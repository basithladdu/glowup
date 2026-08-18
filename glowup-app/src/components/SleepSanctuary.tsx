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

  return (
    <div className="section-block">
      <div className="card" style={{ textAlign: 'center', padding: '24px 14px' }}>
        <p className="eyebrow" style={{ color: 'var(--indigo)' }}>live sleep tracking</p>
        <h2 style={{ fontSize: '20px', margin: '0 0 8px' }}>One-Tap Sleep Stopwatch</h2>
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

      {/* SLEEP HYGIENE STANDARDS */}
      <div className="card">
        <p className="eyebrow">sleep architecture standards</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="task-item">
            <div className="task-left">
              <div className="task-title">Pitch Dark &amp; Cool Room (18–20°C)</div>
              <div className="task-sub">Blackout curtains or eye mask. Signals melatonin surge for deep Slow-Wave Sleep.</div>
            </div>
          </div>
          <div className="task-item">
            <div className="task-left">
              <div className="task-title">3M Micropore Nasal Mouth Tape</div>
              <div className="task-sub">Guarantees 100% nasal breathing, raises nitric oxide delivery, prevents dry mouth.</div>
            </div>
          </div>
          <div className="task-item">
            <div className="task-left">
              <div className="task-title">Phone Charging Outside Bedroom</div>
              <div className="task-sub">Zero blue light and zero pre-sleep cortisol spikes from notifications.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
