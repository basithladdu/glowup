import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { ROT } from '../lib/constants';

export const SkinGrooming: React.FC = () => {
  const { selectedDate, state, saveState } = useGlowUpStore();
  const dateObj = new Date(selectedDate);
  const dow = dateObj.getDay();
  const tonightRot = ROT[dow];

  // Calculate days to next peel (every 14 days from S.peel)
  const lastPeelDate = new Date(state.peel || '2026-08-15');
  const today = new Date(selectedDate);
  const diffDays = Math.floor((today.getTime() - lastPeelDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysToNextPeel = Math.max(0, 14 - (diffDays % 14));

  const handleLogPeel = () => {
    state.peel = selectedDate;
    saveState({ area: 'skincare', item: 'peel-30', exact_update: 'Completed 30% chemical peel' });
  };

  return (
    <div className="section-block">
      {/* TONIGHT'S SKINCARE PROTOCOL */}
      <div className="card">
        <p className="eyebrow"><span className="n">tonight</span> active skincare protocol</p>
        <h2 style={{ fontSize: '18px', margin: '0 0 6px', color: 'var(--turmeric)' }}>{tonightRot.active}</h2>
        <p className="note" style={{ marginBottom: '12px' }}>{tonightRot.extra}</p>

        <div style={{ background: 'var(--surface2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--line2)' }}>
          <div className="statline">
            <span className="statk">Tonight's Rotation Active</span>
            <span className="statv" style={{ color: 'var(--turmeric)' }}>{tonightRot.short}</span>
          </div>
          <div className="statline">
            <span className="statk">Minimalist 30% Peel Next</span>
            <span className="statv" style={{ color: daysToNextPeel === 0 ? 'var(--rose)' : 'var(--sage)' }}>
              {daysToNextPeel === 0 ? 'Due Tonight!' : `in ${daysToNextPeel} days`}
            </span>
          </div>
        </div>

        <button className="btn sage" style={{ width: '100%', marginTop: '12px' }} onClick={handleLogPeel}>
          ✓ Log 10-Min Chemical Peel Completed Today
        </button>
      </div>

      {/* 7-DAY ROTATION SCHEDULE */}
      <div className="card">
        <p className="eyebrow">7-day actives rotation</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {ROT.map((r, i) => {
            const isToday = i === dow;
            return (
              <div key={i} className="logrow" style={{ background: isToday ? 'rgba(232,163,61,.08)' : 'transparent', padding: '8px 6px', borderRadius: '6px' }}>
                <span className="logname" style={{ color: isToday ? 'var(--turmeric)' : 'var(--paper)', fontWeight: isToday ? 700 : 500 }}>
                  {r.d} · {r.short}
                </span>
                <span className="logmac" style={{ color: isToday ? 'var(--paper)' : 'var(--muted)' }}>
                  {r.active}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
