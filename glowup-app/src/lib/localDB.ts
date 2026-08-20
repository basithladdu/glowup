// Durable local-first persistence layer.
// IndexedDB survives far more reliably than localStorage (no ~5MB cap, no
// silent eviction under Safari ITP) and gives every device an offline-first
// copy of the full GlowUp state that Supabase only ever mirrors.
import type { GlowUpState } from '../types';

const DB_NAME = 'glowup-local-v1';
const DB_VERSION = 1;
const STORE = 'snapshots';
const SNAPSHOT_KEY = 'current';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLocalSnapshot(state: GlowUpState): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put({ data: state, savedAt: new Date().toISOString() }, SNAPSHOT_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    // IndexedDB unavailable (private mode, old browser) — localStorage fallback in the store covers it.
  }
}

export async function loadLocalSnapshot(): Promise<GlowUpState | null> {
  try {
    const db = await openDB();
    const result = await new Promise<{ data: GlowUpState } | undefined>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(SNAPSHOT_KEY);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result?.data || null;
  } catch {
    return null;
  }
}

/** Full JSON dump for the "download my data" / debugging path — never auto-triggered. */
export function stateToExportBlob(state: GlowUpState): Blob {
  return new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
}
