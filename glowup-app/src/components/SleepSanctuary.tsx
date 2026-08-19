import React, { useState, useEffect } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const SleepSanctuary: React.FC = () => {
  const { state, setLiveSleep, saveState, selectedDate } = useGlowUpStore();
  const [elapsed, setElapsed] = useState('00:00:00');

  useEffect(() => {
    let interval: any = null;
    if (state.liveSleep) {
      const startTime = new Date(state.liveSleep).getTime();
      const updateTimer = () => {
        const diff = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
        const hrs = String(Math.floor(diff / 3600)).padStart(2, '0');
        const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const secs = String(diff % 60).padStart(2, '0');
        setElapsed(`${hrs}:${mins}:${secs}`);
      };
      updateTimer();
      interval = setInterval(updateTimer, 1000);
    } else {
      setElapsed('00:00:00');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state.liveSleep]);

  const handleToggleSleep = () => {
    if (!state.liveSleep) {
      // Start sleep
      const nowIso = new Date().toISOString();
      setLiveSleep(nowIso);
    } else {
      // Wake up
      const startTime = new Date(state.liveSleep);
      const wakeTime = new Date();
      const hoursSlept = Number(((wakeTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)).toFixed(1));
      
      state.sleep[selectedDate] = {
        bed: startTime.toTimeString().slice(0, 5),
        wake: wakeTime.toTimeString().slice(0, 5),
        dur: hoursSlept
      };
      setLiveSleep(null);
      saveState({ area: 'sleep', item: 'sleep-wake', exact_update: `Slept ${hoursSlept} hours` });
    }
  };

  const isSleeping = !!state.liveSleep;

  const [expandedChecks, setExpandedChecks] = useState(true);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 90-minute sleep cycles calculator
  const calculateCycles = () => {
    const now = new Date();
    // Assuming 15 minutes to fall asleep
    const fallAsleepTime = new Date(now.getTime() + 15 * 60 * 1000);
    
    const cycles = [
      { cycles: 4, hours: '6.0h', time: new Date(fallAsleepTime.getTime() + 4 * 90 * 60 * 1000), label: 'Minimum Floor (4 Cycles)' },
      { cycles: 5, hours: '7.5h', time: new Date(fallAsleepTime.getTime() + 5 * 90 * 60 * 1000), label: 'Optimal Hypertrophy Peak (5 Cycles · Recommended)' },
      { cycles: 6, hours: '9.0h', time: new Date(fallAsleepTime.getTime() + 6 * 90 * 60 * 1000), label: 'Deep CNS Rebuild (6 Cycles)' }
    ];

    return cycles.map(c => ({
      ...c,
      formatted: c.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  const sleepCycles = calculateCycles();

  const preBedChecks = [
    { id: 'sb_1', text: 'Blue-Light Cutoff & Warm Night Shift filter enabled (60m prior)' },
    { id: 'sb_2', text: 'Drink 200ml room temp water (prevent midnight dehydration)' },
    { id: 'sb_3', text: 'Bedroom pitch black and ambient temperature at 18–20°C' },
    { id: 'sb_4', text: 'Apply vertical strip of 3M micropore mouth tape over lips' },
    { id: 'sb_5', text: 'Complete 10-minute 4-4-4-4 Box Breathing parasympathetic reset' }
  ];

  const sleepHistory = Object.entries(state.sleep || {}).map(([d, val]) => ({
    date: d,
    dur: val.dur,
    bed: val.bed,
    wake: val.wake,
    rating: val.dur >= 7.5 ? '⭐ Optimal' : val.dur >= 6.0 ? '⚡ Decent' : '⚠️ Sub-optimal'
  })).slice(-5);

  return (
    <div className="section-block">
      {/* LIVE SLEEP STOPWATCH */}
      <div className="card" style={{ textAlign: 'center', padding: '24px 14px', background: 'linear-gradient(180deg, var(--surface), var(--surface2))' }}>
        <p className="eyebrow" style={{ color: 'var(--indigo)' }}>live sleep tracking</p>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px' }}>One-Tap Sleep Stopwatch 🛌</h2>
        <p className="note" style={{ marginBottom: '16px' }}>
          Tap when hitting the pillow, tap when waking up. Automatically logs sleep duration in your 24h timeline.
        </p>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '38px', fontWeight: 700, color: isSleeping ? 'var(--sage)' : 'var(--indigo)', margin: '14px 0' }}>
          {elapsed}
        </div>

        <button
          className={`btn ${isSleeping ? 'sage' : 'primary'}`}
          style={{ width: '100%', padding: '12px', fontSize: '14px', fontWeight: 700 }}
          onClick={handleToggleSleep}
        >
          {isSleeping ? "☀️ Good Morning, I'm Awake!" : "🛌 Going to Sleep Now"}
        </button>
      </div>

      {/* 90-MINUTE OPTIMAL SLEEP CYCLE CALCULATOR */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">circadian</span> 90-min sleep cycle calculator</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--turmeric)' }}>⏰ Optimal Wake-Up Times (If Sleeping Now)</h3>
          </div>
          <span className="tag-badge tag-best">90m REM Cycles</span>
        </div>
        <p className="note" style={{ marginBottom: '12px' }}>
          Waking up at the end of a 90-minute sleep cycle prevents sleep inertia and morning brain fog.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
          {sleepCycles.map((c, idx) => (
            <div
              key={idx}
              style={{
                background: idx === 1 ? 'rgba(232, 163, 61, 0.1)' : 'var(--surface2)',
                border: `1px solid ${idx === 1 ? 'var(--turmeric)' : 'var(--line2)'}`,
                borderRadius: '8px',
                padding: '10px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: idx === 1 ? 'var(--turmeric)' : 'var(--paper)' }}>
                  {c.formatted}
                </span>
                <span className="badge-count" style={{ background: 'var(--surface3)' }}>{c.hours}</span>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', marginTop: '4px' }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 5 PRE-BED WIND-DOWN TECHNIQUE CHECKS */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">protocol</span> nocturnal nervous system reset</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--indigo)' }}>🌙 5 Pre-Bed Wind-Down Checks</h3>
          </div>
          <button
            className="btn sm"
            style={{ fontSize: '10px', background: 'var(--surface3)' }}
            onClick={() => setExpandedChecks(!expandedChecks)}
          >
            {expandedChecks ? '▲ Hide' : '▼ View Checks'}
          </button>
        </div>

        {expandedChecks && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '10px' }}>
            {preBedChecks.map((chk) => {
              const isDone = !!checkedItems[chk.id];
              return (
                <div
                  key={chk.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    background: isDone ? 'rgba(138, 168, 95, 0.1)' : 'var(--surface2)',
                    border: `1px solid ${isDone ? 'var(--sage)' : 'var(--line2)'}`,
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleCheck(chk.id)}
                >
                  <span style={{ color: isDone ? 'var(--sage)' : 'var(--muted)', fontSize: '13px', fontWeight: 700 }}>
                    {isDone ? '☑' : '☐'}
                  </span>
                  <span style={{ fontSize: '12px', color: isDone ? 'var(--paper)' : 'var(--muted)', textDecoration: isDone ? 'line-through' : 'none' }}>
                    {chk.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECENT SLEEP LOGS & RECOVERY TELEMETRY */}
      {sleepHistory.length > 0 && (
        <div className="card">
          <p className="eyebrow"><span className="n">telemetry</span> recent sleep duration log</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {sleepHistory.map((s, idx) => (
              <div key={idx} className="logrow">
                <span className="logname">{s.date} · Bed: {s.bed} ➔ Wake: {s.wake}</span>
                <span className="logmac" style={{ color: s.dur >= 7.5 ? 'var(--sage)' : 'var(--turmeric)', fontWeight: 700 }}>
                  {s.dur} hrs ({s.rating})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
