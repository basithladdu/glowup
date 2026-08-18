import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { METALLICADPA_PPL, LIFTS } from '../lib/constants';

export const LiftsWorkouts: React.FC = () => {
  const { selectedDate, getDayState, logLiftSet, setWorkoutRoutine } = useGlowUpStore();
  const dayState = getDayState();

  const [liftName, setLiftName] = useState(LIFTS[0]);
  const [kg, setKg] = useState('60');
  const [reps, setReps] = useState('5');
  const [setsCount, setSetsCount] = useState('1');

  // Routine resolution
  const dayOfWeek = new Date(selectedDate).getDay();
  const autoRoutineKey = dayOfWeek === 0 ? 'rest' : dayOfWeek === 1 ? 'pull_a' : dayOfWeek === 2 ? 'push_a' : dayOfWeek === 3 ? 'legs_a' : dayOfWeek === 4 ? 'pull_a' : dayOfWeek === 5 ? 'push_a' : 'legs_a';
  const activeRoutineKey = dayState.workoutRoutine || autoRoutineKey;
  const currentRoutine = METALLICADPA_PPL[activeRoutineKey] || METALLICADPA_PPL['pull_a'];

  const routineOptions = [
    { id: 'auto', label: '🔄 Auto (by Day)' },
    { id: 'arms', label: '💪 Dedicated Arms Day' },
    { id: 'pull_a', label: 'Day 1 Pull' },
    { id: 'push_a', label: 'Day 2 Push' },
    { id: 'legs_a', label: 'Day 3 Legs' },
    { id: 'rest', label: '🚶 Active Rest' },
  ];

  const handleQuickFill = (exName: string, exSets: string) => {
    setLiftName(exName);
    const repMatch = exSets.match(/(\d+)/);
    if (repMatch) setReps(repMatch[1]);
  };

  const handleLogSet = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(setsCount, 10) || 1;
    for (let i = 0; i < count; i++) {
      logLiftSet({
        n: liftName,
        kg: parseFloat(kg) || 0,
        reps: parseInt(reps, 10) || 0
      });
    }
  };

  return (
    <div className="section-block">
      {/* ROUTINE SWITCHER BAR */}
      <div className="card">
        <p className="eyebrow"><span className="n">split</span> routine switcher</p>
        <div className="routine-selector">
          {routineOptions.map((opt) => (
            <button
              key={opt.id}
              className={`routine-chip ${(opt.id === 'auto' && !dayState.workoutRoutine) || dayState.workoutRoutine === opt.id ? 'active' : ''}`}
              onClick={() => setWorkoutRoutine(opt.id === 'auto' ? null : opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '16px', margin: 0, color: 'var(--paper)' }}>{currentRoutine.name}</h2>
            <span className="tag-badge tag-best">{currentRoutine.badge}</span>
          </div>
          <p className="note" style={{ margin: '4px 0 10px' }}>{currentRoutine.desc}</p>
          <div style={{ fontSize: '10.5px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--turmeric)' }}>
            Frequency: {currentRoutine.freq}
          </div>
        </div>
      </div>

      {/* EXERCISES LIST WITH SUPERSETS & 1-CLICK FILL */}
      <div className="card">
        <p className="eyebrow"><span className="n">exercises</span> today's routine breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentRoutine.exercises.map((ex, idx) => (
            <div
              key={idx}
              className="ex-row"
              onClick={() => handleQuickFill(ex.name, ex.sets)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--paper)' }}>{ex.name}</span>
                  {ex.intensity && <span className="intensity-tag">{ex.intensity}</span>}
                  {ex.isSuperset && <span className="superset-badge">⚡ {ex.supersetLabel}</span>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{ex.cue}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--turmeric)', fontSize: '12px', textAlign: 'right' }}>
                  {ex.sets}<br />
                  <small style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '10px' }}>{ex.reps}</small>
                </span>
                <button
                  className="ex-quick-btn"
                  onClick={(e) => { e.stopPropagation(); handleQuickFill(ex.name, ex.sets); }}
                >
                  + Log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOG WORKING SET FORM */}
      <div className="card">
        <p className="eyebrow"><span className="n">log</span> record working set</p>
        <form onSubmit={handleLogSet} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label className="fl">Exercise</label>
            <input value={liftName} onChange={(e) => setLiftName(e.target.value)} required />
          </div>

          <div className="frow">
            <div>
              <label className="fl">Weight (kg)</label>
              <input type="number" step="0.5" value={kg} onChange={(e) => setKg(e.target.value)} required />
            </div>
            <div>
              <label className="fl">Reps</label>
              <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} required />
            </div>
            <div>
              <label className="fl">Sets</label>
              <input type="number" value={setsCount} onChange={(e) => setSetsCount(e.target.value)} min="1" max="10" required />
            </div>
          </div>

          <button type="submit" className="btn primary" style={{ width: '100%' }}>
            ✓ Log Working Set
          </button>
        </form>
      </div>

      {/* LOGGED SETS ON THIS DATE */}
      <div className="card">
        <p className="eyebrow">logged sets on this date</p>
        {!dayState.lifts.length ? (
          <div className="empty">No lifting sets logged on this date.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dayState.lifts.map((l, idx) => (
              <div key={idx} className="logrow">
                <span className="logname">{l.n}</span>
                <span className="logmac" style={{ color: 'var(--turmeric)', fontWeight: 700 }}>
                  {l.kg} kg × {l.reps} reps
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
