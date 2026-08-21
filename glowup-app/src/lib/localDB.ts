// Durable local-first persistence layer.
// IndexedDB survives far more reliably than localStorage (no ~5MB cap, no
// silent eviction under Safari ITP) and gives every device an offline-first
// copy of the full GlowUp state that Supabase only ever mirrors.
import type { GlowUpState } from '../types';

const DB_NAME = 'glowup-local-v1';
const DB_VERSION = 2;
const STORE = 'snapshots';
const PHOTO_STORE = 'photos';
const SNAPSHOT_KEY = 'current';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
      // Progress photos live here, keyed by date, and deliberately NOT in the synced
      // snapshot — a few hundred KB of JPEG per entry would bloat every Supabase write.
      if (!db.objectStoreNames.contains(PHOTO_STORE)) {
        db.createObjectStore(PHOTO_STORE);
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

/**
 * Downscale to a sane size before storing. Phone cameras produce 3-5MB images and we
 * only ever show these as a comparison strip, so full resolution is pure waste.
 */
export function downscaleImage(file: File, maxEdge = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode that image'));
      img.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unavailable'));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export async function saveProgressPhoto(date: string, dataUrl: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).put(dataUrl, date);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadProgressPhotos(): Promise<Record<string, string>> {
  try {
    const db = await openDB();
    const out = await new Promise<Record<string, string>>((resolve, reject) => {
      const tx = db.transaction(PHOTO_STORE, 'readonly');
      const store = tx.objectStore(PHOTO_STORE);
      const keys = store.getAllKeys();
      const vals = store.getAll();
      tx.oncomplete = () => {
        const map: Record<string, string> = {};
        (keys.result as string[]).forEach((k, i) => { map[k] = (vals.result as string[])[i]; });
        resolve(map);
      };
      tx.onerror = () => reject(tx.error);
    });
    db.close();
    return out;
  } catch {
    return {};
  }
}

export async function deleteProgressPhoto(date: string): Promise<void> {
  const db = await openDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(PHOTO_STORE, 'readwrite');
    tx.objectStore(PHOTO_STORE).delete(date);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
