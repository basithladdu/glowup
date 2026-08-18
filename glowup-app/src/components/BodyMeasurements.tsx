import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const BodyMeasurements: React.FC = () => {
  const { state, selectedDate, logMorningWeight, saveState } = useGlowUpStore();
  const [weightInput, setWeightInput] = useState('85.0');
  const [shoulders, setShoulders] = useState('116');
  const [waist, setWaist] = useState('82');
  const [arms, setArms] = useState('14.2');

  const currentWeight = state.weights[selectedDate] || 85.0;
  const startWeight = 85.0;
  const targetWeight = 72.0;
  const weightProgress = Math.max(0, Math.min(100, Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)));

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightInput) || 85.0;
    logMorningWeight(w);
  };

  const handleLogMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    const sh = parseFloat(shoulders) || 0;
    const wa = parseFloat(waist) || 0;
    const ar = parseFloat(arms) || 0;
    state.meas = state.meas || [];
    state.meas.push({ d: selectedDate, shoulders: sh, waist: wa, arms: ar });
    saveState({ area: 'body', item: 'measurements', exact_update: `Logged tape: ${sh}cm / ${wa}cm / ${ar}in` });
  };

  const vtRatio = (parseFloat(shoulders) / (parseFloat(waist) || 1)).toFixed(2);

  return (
    <div className="section-block">
      {/* 85kg -> 72kg CUT PROGRESS */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="eyebrow"><span className="n">fat loss</span> cut to 72.0 kg</p>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Current: {currentWeight} kg</h2>
          </div>
          <span className="tag-badge tag-best">{weightProgress}% COMPLETED</span>
        </div>
        <p className="note" style={{ margin: '6px 0 10px' }}>
          Target: 72.0 kg · 500 kcal daily deficit · 170g protein floor. Unlocks sharp jawline, facial leanness, and visible abs.
        </p>
        <div style={{ background: 'var(--surface2)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--turmeric)', height: '100%', width: `${Math.max(5, weightProgress)}%` }} />
        </div>
      </div>

      {/* LOG MORNING WEIGH-IN */}
      <div className="card">
        <p className="eyebrow"><span className="n">weigh-in</span> fasted morning weight</p>
        <form onSubmit={handleLogWeight} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            step="0.1"
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
            placeholder="e.g. 84.5"
            required
            style={{ flex: 2 }}
          />
          <button type="submit" className="btn primary" style={{ flex: 1 }}>
            ✓ Log Weight
          </button>
        </form>
      </div>

      {/* V-TAPER & ANTHROPOMETRIC TAPE */}
      <div className="card">
        <p className="eyebrow"><span className="n">v-taper</span> shoulder-to-waist golden ratio</p>
        <div style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
          <div className="statline">
            <span className="statk">Golden V-Taper Ratio</span>
            <span className="statv" style={{ color: Number(vtRatio) >= 1.6 ? 'var(--sage)' : 'var(--turmeric)' }}>
              {vtRatio} / 1.60 Ideal
            </span>
          </div>
          <div className="statline">
            <span className="statk">Arm Circumference</span>
            <span className="statv" style={{ color: 'var(--paper)' }}>{arms}" / 15.0" Goal</span>
          </div>
        </div>

        <form onSubmit={handleLogMeasurements} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="frow">
            <div>
              <label className="fl">Shoulder (cm)</label>
              <input type="number" step="0.5" value={shoulders} onChange={(e) => setShoulders(e.target.value)} />
            </div>
            <div>
              <label className="fl">Waist (cm)</label>
              <input type="number" step="0.5" value={waist} onChange={(e) => setWaist(e.target.value)} />
            </div>
            <div>
              <label className="fl">Arms (inches)</label>
              <input type="number" step="0.1" value={arms} onChange={(e) => setArms(e.target.value)} />
            </div>
          </div>
          <button type="submit" className="btn sage" style={{ width: '100%' }}>
            ✓ Save Anthropometric Tape Measurements
          </button>
        </form>
      </div>
    </div>
  );
};
