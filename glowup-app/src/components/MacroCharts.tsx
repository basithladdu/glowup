import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { KCAL_TARGET, PROT_TARGET } from '../lib/constants';

export const MacroCharts: React.FC = () => {
  const { state } = useGlowUpStore();

  const days: Array<{ date: string; label: string; k: number; p: number }> = [];
  const today = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayData = state.days[dateStr];
    const items = dayData?.food || [];

    const k = items.reduce((sum, item) => sum + (Number(item.k) || 0), 0);
    const p = items.reduce((sum, item) => sum + (Number(item.p) || 0), 0);

    days.push({
      date: dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      k,
      p
    });
  }

  const W = 520;
  const H = 100;
  const pad = 14;
  const gap = 4;
  const bw = (W - pad * 2 - gap * 13) / 14;

  const maxKcal = Math.max(KCAL_TARGET * 1.35, ...days.map(d => d.k)) || KCAL_TARGET;
  const maxProt = Math.max(PROT_TARGET * 1.3, ...days.map(d => d.p)) || PROT_TARGET;

  const kcalTargetY = H - (KCAL_TARGET / maxKcal) * (H - 16);
  const protTargetY = H - (PROT_TARGET / maxProt) * (H - 16);

  return (
    <div className="section-block">
      {/* 14-DAY CALORIE DEFICIT CHART */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p className="eyebrow" style={{ margin: 0 }}><span className="n">calories</span> 14-day deficit trajectory</p>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', color: 'var(--muted)' }}>
            Target: 2,000 kcal
          </span>
        </div>

        <svg className="chart" viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <line
            x1={pad}
            y1={kcalTargetY}
            x2={W - pad}
            y2={kcalTargetY}
            stroke="#7A7168"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
          />
          {days.map((d, i) => {
            const hgt = d.k ? Math.max(2, (d.k / maxKcal) * (H - 16)) : 0;
            const x = pad + i * (bw + gap);
            const col = !d.k ? '#232019' : d.k <= KCAL_TARGET ? '#8B9E76' : '#C2705C';
            return (
              <g key={i}>
                <rect x={x} y={H - hgt} width={bw} height={hgt} rx="2.5" fill={col} />
                <text x={x + bw / 2} y={H + 13} textAnchor="middle" fill="#7A7168" fontSize="8" fontFamily="JetBrains Mono, monospace">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 14-DAY PROTEIN COMPLIANCE CHART */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p className="eyebrow" style={{ margin: 0 }}><span className="n">protein</span> 14-day compliance floor</p>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10.5px', color: 'var(--muted)' }}>
            Floor: 170g
          </span>
        </div>

        <svg className="chart" viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <line
            x1={pad}
            y1={protTargetY}
            x2={W - pad}
            y2={protTargetY}
            stroke="#7A7168"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
          />
          {days.map((d, i) => {
            const hgt = d.p ? Math.max(2, (d.p / maxProt) * (H - 16)) : 0;
            const x = pad + i * (bw + gap);
            const col = !d.p ? '#232019' : d.p >= PROT_TARGET ? '#8B9E76' : '#D9A05B';
            return (
              <g key={i}>
                <rect x={x} y={H - hgt} width={bw} height={hgt} rx="2.5" fill={col} />
                <text x={x + bw / 2} y={H + 13} textAnchor="middle" fill="#7A7168" fontSize="8" fontFamily="JetBrains Mono, monospace">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 14-DAY CUMULATIVE ENERGY BALANCE & NET DEFICIT CALCULATOR */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">thermodynamics</span> net energy deficit bank</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--turmeric)' }}>14-Day Net Energy Balance</h3>
          </div>
        </div>

        {(() => {
          // Untracked days (nothing logged at all) shouldn't count as 0 kcal in the average —
          // that reads as a deficit when it's really just missing data. Average only tracked days.
          const trackedDays = days.filter(d => d.k > 0 || d.p > 0);
          const n = trackedDays.length || 1;
          const avgK = Math.round(trackedDays.reduce((acc, d) => acc + d.k, 0) / n);
          const avgP = (trackedDays.reduce((acc, d) => acc + d.p, 0) / n).toFixed(1);
          return (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', textAlign: 'center', margin: '8px 0 4px' }}>
                <div style={{ background: 'var(--surface2)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>Avg intake · tracked days</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--sage)' }}>
                    {trackedDays.length ? `${avgK} kcal/day` : '— No days logged'}
                  </div>
                </div>
                <div style={{ background: 'var(--surface2)', padding: '8px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>Avg protein · tracked days</div>
                  <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--turmeric)' }}>
                    {trackedDays.length ? `${avgP}g / 170g` : '— No days logged'}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', textAlign: 'center', marginBottom: '6px' }}>
                {trackedDays.length}/14 days tracked in this window
              </div>
            </>
          );
        })()}

        {/* 5 PRECISION CALORIC DEFICIT STANDARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
          {[
            '500 kcal Deficit Cap: Prevents metabolic adaptation and preserves lean muscle mass',
            '170g Protein Anchor: Ensures positive nitrogen balance during hypocaloric phases',
            'Carbohydrate Timing: Allocate 60% of carbs to pre/post-workout feeding windows',
            'Dietary Fat Floor: Maintain 40–50g healthy fats for testosterone and endocrine health',
            'Weekly Refeed Protocol: Single maintenance day (2,300 kcal) every 14 days if fatigue rises'
          ].map((chk, i) => (
            <div key={i} style={{ fontSize: '11.5px', color: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--sage)', fontWeight: 600 }}>✓</span> {chk}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
