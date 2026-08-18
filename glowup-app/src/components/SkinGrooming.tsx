import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { ROT } from '../lib/constants';
import { triggerGoalCelebration } from '../lib/confetti';
import { playSuccessChime } from '../lib/sound';

export const SkinGrooming: React.FC = () => {
  const { selectedDate, state, saveState, getDayState, toggleHabit } = useGlowUpStore();
  const dayState = getDayState();
  const dateObj = new Date(selectedDate);
  const dow = dateObj.getDay();
  const tonightRot = ROT[dow];

  // Micro-steps state (persisted in day state)
  const amSteps = dayState.amSkinSteps || {};
  const pmSteps = dayState.pmSkinSteps || {};

  const handleToggleAMStep = (stepId: string) => {
    dayState.amSkinSteps = dayState.amSkinSteps || {};
    dayState.amSkinSteps[stepId] = !dayState.amSkinSteps[stepId];
    saveState({ area: 'skincare', item: `am-${stepId}`, exact_update: `Toggled AM skin step ${stepId}` });
    
    // If all AM steps done, celebrate & mark SPF habit
    if (Object.values(dayState.amSkinSteps).filter(Boolean).length >= 4) {
      toggleHabit('h_spf');
      triggerGoalCelebration();
      playSuccessChime();
    }
  };

  const handleTogglePMStep = (stepId: string) => {
    dayState.pmSkinSteps = dayState.pmSkinSteps || {};
    dayState.pmSkinSteps[stepId] = !dayState.pmSkinSteps[stepId];
    saveState({ area: 'skincare', item: `pm-${stepId}`, exact_update: `Toggled PM skin step ${stepId}` });
    
    // If all PM steps done, celebrate & mark minoxidil habit
    if (Object.values(dayState.pmSkinSteps).filter(Boolean).length >= 5) {
      toggleHabit('h_minox');
      triggerGoalCelebration();
      playSuccessChime();
    }
  };

  // Calculate days to next peel (every 14 days from state.peel)
  const lastPeelDate = new Date(state.peel || '2026-08-15');
  const today = new Date(selectedDate);
  const diffDays = Math.floor((today.getTime() - lastPeelDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysToNextPeel = Math.max(0, 14 - (diffDays % 14));

  const handleLogPeel = () => {
    state.peel = selectedDate;
    saveState({ area: 'skincare', item: 'peel-30', exact_update: 'Completed 30% chemical peel' });
    triggerGoalCelebration();
    playSuccessChime();
  };

  const amStepList = [
    { id: 'am_cleanse', num: '1', name: 'Gentle Cleanser / Cold Splash', tip: 'Splashing cold water constricts capillaries and reduces morning facial puffiness.' },
    { id: 'am_vitc', num: '2', name: 'Minimalist Vitamin C 10% Serum (3 Drops)', tip: 'Apply 3 drops across face and neck. Wait 60s to absorb. Fights oxidative UV free-radicals.' },
    { id: 'am_b12', num: '3', name: 'Vitamin B12 / Ceramide Barrier Cream', tip: 'Locks in hydration and protects skin barrier from trans-epidermal water loss.' },
    { id: 'am_spf', num: '4', name: 'Lakmé Sun Expert SPF 50 PA+++ Shield', tip: 'Crucial: 2-finger rule on Face, Neck, Ears & Hands. Blocks 98% UVA/UVB photo-aging.' },
    { id: 'am_lip', num: '5', name: 'Hydrating Lip Balm (Nicole Lip Scrub on weekends)', tip: 'Prevents hyperpigmentation and peeling lips.' }
  ];

  const pmStepList = [
    { id: 'pm_cleanse', num: '1', name: 'Double Cleanse (Wash off SPF & Pollutants)', tip: 'Cleanse thoroughly with gentle face wash. Pat completely dry with a dedicated face towel.' },
    { id: 'pm_active', num: '2', name: `Tonight's Active: ${tonightRot.short}`, tip: `${tonightRot.active}. ${tonightRot.extra}` },
    { id: 'pm_barrier', num: '3', name: 'Minimalist B12 Ceramide Barrier Cream', tip: 'Soothes inflammation, prevents irritation, and rebuilds lipid matrix.' },
    { id: 'pm_castor', num: '4', name: 'Cold-Pressed Castor Oil on Eyelashes & Brows', tip: 'Dab 1 drop of pure castor oil on lash lines & eyebrows for thickness, growth, and density.' },
    { id: 'pm_minox', num: '5', name: 'Minoxidil 5% on Temples & Beard', tip: 'Apply 1ml with dropper directly onto scalp hairline corners and beard density zones.' },
    { id: 'pm_slug', num: '6', name: 'Vaseline Lip Slugging & Mouth Tape Ready', tip: 'Seal lips with pure petroleum jelly to wake up with zero chapped skin.' }
  ];

  return (
    <div className="section-block">
      {/* TONIGHT'S CLINICAL ACTIVE ROTATION BANNER */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div>
            <p className="eyebrow"><span className="n">clinical</span> tonight's active skincare rotation</p>
            <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--turmeric)' }}>{tonightRot.active}</h2>
          </div>
          <span className="tag-badge tag-best">{tonightRot.short}</span>
        </div>
        <p className="note" style={{ marginBottom: '12px' }}>{tonightRot.extra}</p>

        <div style={{ background: 'var(--surface2)', padding: '10px', borderRadius: '8px', border: '1px solid var(--line2)' }}>
          <div className="statline">
            <span className="statk">Tonight's Rotation Active</span>
            <span className="statv" style={{ color: 'var(--turmeric)' }}>{tonightRot.short}</span>
          </div>
          <div className="statline">
            <span className="statk">Minimalist 30% Peel Countdown</span>
            <span className="statv" style={{ color: daysToNextPeel === 0 ? 'var(--rose)' : 'var(--sage)' }}>
              {daysToNextPeel === 0 ? 'Due Tonight!' : `in ${daysToNextPeel} days`}
            </span>
          </div>
        </div>

        {daysToNextPeel === 0 && (
          <button className="btn sage" style={{ width: '100%', marginTop: '10px' }} onClick={handleLogPeel}>
            ✓ Log 10-Min 30% Chemical Peel Completed Today
          </button>
        )}
      </div>

      {/* GRANULAR MICRO-STEPS (AM & PM DUAL COLUMNS) */}
      <div className="desktop-grid-equal">
        {/* LEFT: AM MORNING SKINCARE SEQUENCE */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <p className="eyebrow"><span className="n">am</span> morning shield sequence</p>
              <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--rose)' }}>☀️ AM Skincare Micro-Steps</h3>
            </div>
            <span className="badge-count">
              {Object.values(amSteps).filter(Boolean).length} / {amStepList.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {amStepList.map((step) => {
              const isDone = !!amSteps[step.id];
              return (
                <div
                  key={step.id}
                  className="task-item"
                  style={{
                    opacity: isDone ? 0.65 : 1,
                    background: isDone ? 'rgba(138, 168, 95, 0.06)' : 'var(--surface2)',
                    borderColor: isDone ? 'var(--sage)' : 'var(--line2)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleToggleAMStep(step.id)}
                >
                  <div className="task-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="cat-pill gym" style={{ background: 'rgba(201, 123, 142, 0.2)', color: 'var(--rose)', minWidth: '22px', textAlign: 'center' }}>
                        {step.num}
                      </span>
                      <span className="task-title" style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                        {step.name}
                      </span>
                    </div>
                    <div className="task-sub" style={{ marginTop: '3px' }}>{step.tip}</div>
                  </div>
                  <button className="task-btn" style={{ background: isDone ? 'var(--sage)' : 'var(--surface3)', color: isDone ? '#1A1206' : 'var(--paper)' }}>
                    {isDone ? '✓' : '○'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: PM NIGHT REPAIR SEQUENCE (WITH CASTOR OIL) */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div>
              <p className="eyebrow"><span className="n">pm</span> nocturnal renewal sequence</p>
              <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--indigo)' }}>🌙 PM Night Repair Micro-Steps</h3>
            </div>
            <span className="badge-count">
              {Object.values(pmSteps).filter(Boolean).length} / {pmStepList.length}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pmStepList.map((step) => {
              const isDone = !!pmSteps[step.id];
              return (
                <div
                  key={step.id}
                  className="task-item"
                  style={{
                    opacity: isDone ? 0.65 : 1,
                    background: isDone ? 'rgba(138, 168, 95, 0.06)' : 'var(--surface2)',
                    borderColor: isDone ? 'var(--sage)' : 'var(--line2)',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleTogglePMStep(step.id)}
                >
                  <div className="task-left">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="cat-pill gym" style={{ background: 'rgba(110, 143, 196, 0.2)', color: 'var(--indigo)', minWidth: '22px', textAlign: 'center' }}>
                        {step.num}
                      </span>
                      <span className="task-title" style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                        {step.name}
                      </span>
                    </div>
                    <div className="task-sub" style={{ marginTop: '3px' }}>{step.tip}</div>
                  </div>
                  <button className="task-btn" style={{ background: isDone ? 'var(--sage)' : 'var(--surface3)', color: isDone ? '#1A1206' : 'var(--paper)' }}>
                    {isDone ? '✓' : '○'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7-DAY ACTIVES ROTATION SCHEDULE */}
      <div className="card">
        <p className="eyebrow"><span className="n">cycle</span> 7-day clinical actives rotation</p>
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
