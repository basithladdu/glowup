import React, { useState, useMemo } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { queryLocalData, type DataFact } from '../lib/dataQuery';
import { stateToExportBlob } from '../lib/localDB';

const AREA_ICON: Record<string, string> = {
  habit: '⚡', 'skincare-am': '☀️', 'skincare-pm': '🌙', grooming: '🧴',
  food: '🥪', lift: '🏋️', product: '🔍', workout: '💪', weight: '⚖️',
  water: '💧', sleep: '😴', goal: '🎯',
};

export const AskYourData: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state } = useGlowUpStore();
  const [q, setQ] = useState('');

  const results: DataFact[] = useMemo(() => queryLocalData(state, q, 40), [state, q]);

  const handleExport = () => {
    const blob = stateToExportBlob(state);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `glowup-data-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box askdata-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ textAlign: 'left' }}>
            <p className="eyebrow" style={{ margin: 0 }}><span className="n">local-first</span> ask your data</p>
            <h3 style={{ fontSize: '15px', margin: 0 }}>🔎 Search Everything You've Logged</h3>
          </div>
          <button className="btn sm" onClick={onClose}>✕</button>
        </div>

        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Try: castor oil, chicken, Aug 18, deadlift, sunscreen..."
          style={{ marginBottom: '8px' }}
        />

        <p className="note" style={{ textAlign: 'left', marginBottom: '10px' }}>
          Grounded lookup over everything stored locally on this device — no server round-trip. {results.length} match{results.length === 1 ? '' : 'es'}.
        </p>

        <div className="askdata-results">
          {!results.length && (
            <div className="empty" style={{ padding: '20px 0' }}>No matches yet — try a shorter keyword.</div>
          )}
          {results.map((f, i) => (
            <div key={i} className="logrow" style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="logname">{AREA_ICON[f.area] || '•'} {f.text}</span>
                <span style={{ fontSize: '9.5px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {f.date} · {f.area}
                </span>
              </div>
              <span className="tag-badge" style={{ background: f.done ? 'rgba(138,168,95,0.15)' : 'rgba(201,123,142,0.15)', color: f.done ? 'var(--sage)' : 'var(--rose)' }}>
                {f.done ? 'DONE' : 'MISSED'}
              </span>
            </div>
          ))}
        </div>

        <button className="btn" style={{ width: '100%', marginTop: '10px' }} onClick={handleExport}>
          ⬇ Export Full Data Snapshot (JSON)
        </button>
      </div>
    </div>
  );
};
