import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const TodayFlow: React.FC = () => {
  const { getDayState, getDayTotals, toggleHabit, logWater } = useGlowUpStore();
  const dayState = getDayState();
  const totals = getDayTotals();

  const dailyHabits = [
    { id: 'h_sunlight', label: '30-Min Sunlight Walk', desc: 'Circadian cortisol spike & 3,000 steps' },
    { id: 'h_tongue', label: 'Copper Tongue Scraping', desc: 'Eliminates 85% of oral volatile sulfur compounds' },
    { id: 'h_spf', label: 'SPF 50 Shield (Face, Neck, Arms, Hands)', desc: 'Blocks 98% of UVA/UVB photo-aging rays' },
    { id: 'h_creatine', label: '5g Creatine Monohydrate', desc: 'Cellular ATP energy & brain memory output' },
    { id: 'h_chew', label: '50/50 Chewing Balance', desc: 'Symmetrical masseter hypertrophy & jaw development' },
    { id: 'h_posture', label: 'Spine Decompression & Dead Hangs', desc: 'Reclaims 1–3cm visible height & opens shoulders' },
    { id: 'h_minox', label: 'Minoxidil 5% on Temples & Beard', desc: 'Anagen hair growth stimulation' },
    { id: 'h_mouthtape', label: 'Nasal Mouth Tape for Sleep', desc: '100% nasal breathing and zero sleep apnoea' }
  ];

  const completedCount = dailyHabits.filter(h => dayState.habits[h.id]).length;
  const progressPct = Math.round((completedCount / dailyHabits.length) * 100);

  return (
    <div className="section-block">
      {/* 3-RING METRICS DASHBOARD */}
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
          <div style={{ background: 'var(--surface2)', padding: '10px 6px', borderRadius: '8px' }}>
            <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>PROTEIN</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: totals.p >= 170 ? 'var(--sage)' : 'var(--turmeric)' }}>
              {totals.p}g
            </div>
            <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Target: 170g</div>
          </div>

          <div style={{ background: 'var(--surface2)', padding: '10px 6px', borderRadius: '8px' }}>
            <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>CALORIES</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: totals.k <= 2000 ? 'var(--sage)' : 'var(--vermilion)' }}>
              {totals.k}
            </div>
            <div style={{ fontSize: '9px', color: 'var(--muted)' }}>Cap: 2,000</div>
          </div>

          <div style={{ background: 'var(--surface2)', padding: '10px 6px', borderRadius: '8px' }}>
            <div style={{ fontSize: '9px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>HABITS</div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--turmeric)' }}>
              {progressPct}%
            </div>
            <div style={{ fontSize: '9px', color: 'var(--muted)' }}>{completedCount}/{dailyHabits.length} Done</div>
          </div>
        </div>
      </div>

      {/* QUICK HYDRATION LOGGER */}
      <div className="card">
        <p className="eyebrow"><span className="n">water</span> 3.0l hydration target</p>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn sm" style={{ flex: 1, background: 'var(--surface2)' }} onClick={() => logWater(250)}>
            + 250ml Glass
          </button>
          <button className="btn sm" style={{ flex: 1, background: 'var(--surface2)' }} onClick={() => logWater(500)}>
            + 500ml Bottle
          </button>
          <button className="btn sm" style={{ flex: 1, background: 'var(--surface2)' }} onClick={() => logWater(750)}>
            + 750ml Flask
          </button>
        </div>
      </div>


      {/* DAILY HABIT EXECUTION LIST */}
      <div className="card">
        <p className="eyebrow"><span className="n">today</span> core daily habits</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {dailyHabits.map((h) => {
            const isDone = !!dayState.habits[h.id];
            return (
              <div key={h.id} className={`task-item ${isDone ? 'done' : ''}`}>
                <div className="task-left">
                  <div>
                    <div className="task-title">{h.label}</div>
                    <div className="task-sub">{h.desc}</div>
                  </div>
                </div>
                <button className="task-btn" onClick={() => toggleHabit(h.id)}>
                  {isDone ? '✓ Done' : 'Complete'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
