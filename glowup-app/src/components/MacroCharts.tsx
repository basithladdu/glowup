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
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9.5px', color: 'var(--muted)' }}>
            Target: 2,000 kcal
          </span>
        </div>

        <svg className="chart" viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <line
            x1={pad}
            y1={kcalTargetY}
            x2={W - pad}
            y2={kcalTargetY}
            stroke="#8C8177"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
          />
          {days.map((d, i) => {
            const hgt = d.k ? Math.max(2, (d.k / maxKcal) * (H - 16)) : 0;
            const x = pad + i * (bw + gap);
            const col = !d.k ? '#272220' : d.k <= KCAL_TARGET ? '#8AA85F' : '#C9503A';
            return (
              <g key={i}>
                <rect x={x} y={H - hgt} width={bw} height={hgt} rx="2.5" fill={col} />
                <text x={x + bw / 2} y={H + 13} textAnchor="middle" fill="#8C8177" fontSize="8" fontFamily="JetBrains Mono, monospace">
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
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9.5px', color: 'var(--muted)' }}>
            Floor: 170g
          </span>
        </div>

        <svg className="chart" viewBox={`0 0 ${W} ${H + 20}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          <line
            x1={pad}
            y1={protTargetY}
            x2={W - pad}
            y2={protTargetY}
            stroke="#8C8177"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.7"
          />
          {days.map((d, i) => {
            const hgt = d.p ? Math.max(2, (d.p / maxProt) * (H - 16)) : 0;
            const x = pad + i * (bw + gap);
            const col = !d.p ? '#272220' : d.p >= PROT_TARGET ? '#8AA85F' : '#E8A33D';
            return (
              <g key={i}>
                <rect x={x} y={H - hgt} width={bw} height={hgt} rx="2.5" fill={col} />
                <text x={x + bw / 2} y={H + 13} textAnchor="middle" fill="#8C8177" fontSize="8" fontFamily="JetBrains Mono, monospace">
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
