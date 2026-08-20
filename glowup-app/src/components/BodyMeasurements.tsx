import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const BodyMeasurements: React.FC = () => {
  const { state, selectedDate, logMorningWeight, saveState, logProgressPhoto } = useGlowUpStore();
  const photoDates = state.progressPhotoDates || [];
  const lastPhotoDate = photoDates[0];
  const daysSincePhoto = lastPhotoDate ? Math.floor((Date.now() - new Date(lastPhotoDate).getTime()) / 86400000) : 999;
  const photoDue = daysSincePhoto >= 14;
  const [weightInput, setWeightInput] = useState('88.0');
  const [shoulders, setShoulders] = useState('116');
  const [waist, setWaist] = useState('84');
  const [arms, setArms] = useState('14.2');

  const currentWeight = state.weights[selectedDate] || 88.0;
  const startWeight = 88.0;
  const targetWeight = 72.0;
  const weightToLose = Math.max(0, currentWeight - targetWeight);
  const weightProgress = Math.max(0, Math.min(100, Math.round(((startWeight - currentWeight) / (startWeight - targetWeight)) * 100)));

  const handleLogWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weightInput) || 88.0;
    logMorningWeight(w);
  };

  const handleLogMeasurements = (e: React.FormEvent) => {
    e.preventDefault();
    const sh = parseFloat(shoulders) || 0;
    const wa = parseFloat(waist) || 0;
    const ar = parseFloat(arms) || 0;
    // Mutating state.meas.push() directly wouldn't trigger a re-render — zustand only notifies
    // subscribers when the state reference actually changes, so this builds a fresh object.
    const newMeas = [...(state.meas || []), { d: selectedDate, shoulders: sh, waist: wa, arms: ar }];
    useGlowUpStore.setState({ state: { ...state, meas: newMeas } });
    saveState({ area: 'body', item: 'measurements', exact_update: `Logged tape: ${sh}cm / ${wa}cm / ${ar}in` });
  };

  const vtRatio = (parseFloat(shoulders) / (parseFloat(waist) || 1)).toFixed(2);

  const [neck, setNeck] = useState('38');

  // US Navy Body Fat Formula for Men:
  // %BF = 86.010 * log10(waist - neck) - 70.041 * log10(height) + 36.76
  const heightCm = 170; // 5'7"
  const waistCm = parseFloat(waist) || 84;
  const neckCm = parseFloat(neck) || 38;
  const diff = waistCm - neckCm;
  const estBf = diff > 0 ? Math.max(5, Math.min(40, (86.010 * Math.log10(diff) - 70.041 * Math.log10(heightCm) + 36.76))).toFixed(1) : '18.0';

  const bfCategory = Number(estBf) <= 12 ? '🔥 Shredded (Abs Fully Visible)' : Number(estBf) <= 15 ? '⚡ Athletic (Upper Abs Visible)' : Number(estBf) <= 19 ? '🎯 Moderate (Lean Cut Phase)' : '⚠️ High Body Fat';

  const cutMilestones = [
    { title: 'Phase 1: Initial Water & Glycogen Flush', weight: '85.0 kg', status: currentWeight <= 85 ? 'Done' : 'Active Target', date: 'Sep 15, 2026' },
    { title: 'Phase 2: Submental Fat & Jawline Unlocked', weight: '80.0 kg', status: currentWeight <= 80 ? 'Done' : 'Target', date: 'Nov 01, 2026' },
    { title: 'Phase 3: Upper Abs & Clavicle Definition', weight: '76.0 kg', status: currentWeight <= 76 ? 'Done' : 'Target', date: 'Dec 15, 2026' },
    { title: 'Phase 4: Full Golden V-Taper (10–12% Shredded)', weight: '72.0 kg', status: currentWeight <= 72 ? 'Done' : 'Ultimate Goal', date: 'Feb 15, 2027' }
  ];


  return (
    <div className="section-block">
      {/* PROGRESS PHOTO CADENCE — fortnightly, tied to the peel cycle so it's one date to remember */}
      <div className="card" style={{ borderColor: photoDue ? 'rgba(232,163,61,0.4)' : undefined }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">visual</span> fortnightly progress photo</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: photoDue ? 'var(--turmeric)' : 'var(--paper)' }}>
              📸 {photoDue ? 'Due Today — Take Your Photo' : `Next due in ${14 - daysSincePhoto}d`}
            </h3>
            <p className="note" style={{ margin: '4px 0 0' }}>
              {lastPhotoDate ? `Last logged: ${lastPhotoDate} (${daysSincePhoto}d ago)` : 'Not logged yet — same lighting, same pose, front/side/back.'}
            </p>
          </div>
          <button className="btn primary" onClick={() => logProgressPhoto()}>
            ✓ I Took My Photo Today
          </button>
        </div>
      </div>

      {/* 88kg -> 72kg CUT PROGRESS & ANALYTICS */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="eyebrow"><span className="n">fat loss</span> cut trajectory (88.0 kg ➔ 72.0 kg)</p>
            <h2 style={{ fontSize: '20px', margin: 0 }}>Current: {currentWeight} kg</h2>
          </div>
          <span className="tag-badge tag-best">{weightToLose.toFixed(1)} KG TO GO</span>
        </div>
        <p className="note" style={{ margin: '6px 0 10px' }}>
          Target: 72.0 kg · 500 kcal daily deficit · 170g protein floor. Expected fat loss rate: ~0.6 kg/week.
        </p>
        <div style={{ background: 'var(--surface2)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ background: 'var(--turmeric)', height: '100%', width: `${Math.max(5, weightProgress)}%` }} />
        </div>
      </div>

      <div className="desktop-grid-equal">
        {/* LEFT COLUMN: WEIGH-IN & MILESTONES */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* LOG MORNING WEIGH-IN */}
          <div className="card">
            <p className="eyebrow"><span className="n">weigh-in</span> fasted morning weight</p>
            <form onSubmit={handleLogWeight} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="number"
                step="0.1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder="e.g. 88.0"
                required
                style={{ flex: 2 }}
              />
              <button type="submit" className="btn primary" style={{ flex: 1 }}>
                ✓ Log Weight
              </button>
            </form>
          </div>

          {/* CUT PHASES & TIMELINE ANALYTICS */}
          <div className="card">
            <p className="eyebrow"><span className="n">phases</span> fat loss timeline milestones</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {cutMilestones.map((m, idx) => (
                <div key={idx} className="task-item" style={{ opacity: m.status === 'Done' ? 0.6 : 1 }}>
                  <div className="task-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="task-title">{m.title}</span>
                      <span className="freq-pill">{m.weight}</span>
                    </div>
                    <div className="task-sub">Est Date: {m.date}</div>
                  </div>
                  <span className="tag-badge" style={{ background: m.status === 'Done' ? 'var(--sage)' : 'var(--surface3)', color: m.status === 'Done' ? '#1A1206' : 'var(--turmeric)' }}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: V-TAPER, BODY FAT CALCULATOR & 5 PRECISION CHECKS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <p className="eyebrow"><span className="n">v-taper</span> shoulder-to-waist golden ratio</p>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
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
              <div className="statline">
                <span className="statk">US Navy Est. Body Fat</span>
                <span className="statv" style={{ color: Number(estBf) <= 15 ? 'var(--sage)' : 'var(--turmeric)' }}>
                  ~{estBf}% ({bfCategory})
                </span>
              </div>
            </div>

            {/* 5 PRECISION ANTHROPOMETRIC TAPE CHECKS */}
            <div style={{ background: 'var(--surface3)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
              <p style={{ fontSize: '11px', color: 'var(--turmeric)', fontWeight: 700, margin: '0 0 6px' }}>
                5 Precision Anthropometric Measurement Checks:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  'Measure in morning fasting state immediately after urination',
                  'Keep tape strictly parallel to floor with zero twist or slack',
                  'Measure waist at narrowest point without sucking in abdomen',
                  'Measure shoulders across widest lateral deltoid peaks',
                  'Measure arm circumference flexed at peak biceps contraction'
                ].map((chk, i) => (
                  <div key={i} style={{ fontSize: '11px', color: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ color: 'var(--sage)', fontWeight: 700 }}>✓</span> {chk}
                  </div>
                ))}
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
                  <label className="fl">Neck (cm)</label>
                  <input type="number" step="0.5" value={neck} onChange={(e) => setNeck(e.target.value)} />
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
      </div>
    </div>
  );
};
