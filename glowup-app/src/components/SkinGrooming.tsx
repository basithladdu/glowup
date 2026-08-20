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

  const [expandedStep, setExpandedStep] = React.useState<string | null>(null);

  const microChecks = dayState.stepMicroChecks || {};
  const telemetry = dayState.productTelemetry || {};

  const amStepList = [
    {
      id: 'am_cleanse',
      num: '1',
      name: 'Gentle Cleanser / Cold Water Splash',
      zone: 'Entire Face & Anterior Neck',
      tip: 'Splashing cold water constricts capillaries and reduces morning facial puffiness.',
      checks: [
        'Wash hands with soap first to prevent bacterial transfer',
        'Wet face with lukewarm water to soften sebum',
        'Massage gentle cleanser in upward circular strokes for 45s',
        'Rinse with cool water to firm skin and de-puff eyes',
        'Pat dry with a dedicated sterile face cloth (no friction)'
      ]
    },
    {
      id: 'am_khus',
      num: '2',
      name: 'Pure Khus / Rose Hydrosol Mist',
      zone: 'Face, Forehead & Upper Neck',
      tip: 'Soothes inflammation, balances dermal pH, and optimizes active serum permeability.',
      checks: [
        'Hold spray nozzle 8–10 inches away with eyes closed',
        'Dispense 3–4 generous pumps across forehead and cheeks',
        'Inhale natural grounding khus aroma for parasympathetic calm',
        'Gently press hydrosol mist into skin using clean palms',
        'Leave skin slightly damp for enhanced Vitamin C uptake'
      ]
    },
    {
      id: 'am_vitc',
      num: '3',
      name: 'Minimalist Vitamin C 10% Serum (3 Drops)',
      zone: 'Forehead, Cheeks, Jawline & Neck',
      tip: '3 drops across face and neck. Neutralizes daytime UV and environmental free-radicals.',
      checks: [
        'Check serum clarity and keep dropper glass away from direct skin contact',
        'Dispense exactly 3–4 drops onto fingertips',
        'Smooth evenly over forehead, cheekbones, and anterior neck',
        'Avoid direct contact with eyelid margins and corners of nose',
        'Allow 60–90s to absorb into epidermal layer before moisturizing'
      ]
    },
    {
      id: 'am_b12',
      num: '4',
      name: 'Vitamin B12 / Ceramide Barrier Cream',
      zone: 'Full Face, Jawline & Collarbone Line',
      tip: 'Locks in moisture and protects lipid matrix from trans-epidermal water loss.',
      checks: [
        'Scoop a dime-sized amount onto the back of your hand',
        'Dot evenly on forehead, cheeks, bridge of nose, and chin',
        'Massage in upward sweeping lymphatic drainage motions',
        'Extend remaining cream downward to neck and collarbones',
        'Confirm smooth, non-greasy velvet barrier finish'
      ]
    },
    {
      id: 'am_spf',
      num: '5',
      name: 'Lakmé Sun Expert SPF 50 PA+++ Shield',
      zone: 'Face, Ears, Posterior Neck & Hands',
      tip: 'Crucial 2-finger rule. Blocks 98% UVA/UVB photo-aging and prevents hyperpigmentation.',
      checks: [
        'Dispense 2 full finger lengths (index + middle finger) of SPF',
        'Distribute evenly across entire face, ears, and back of neck',
        'Coat back of hands and exposed wrists',
        'Blend thoroughly without harsh rubbing until transparent',
        'Wait 15 minutes before direct sunlight to establish UV protective film'
      ]
    },
    {
      id: 'am_lip',
      num: '6',
      name: 'Hydrating Lip Balm & Pink Lip Care',
      zone: 'Upper & Lower Lip Vermilion Border',
      tip: 'Nicole Berry scrub on weekends + daily balm for smooth, vibrant vascular pink lips.',
      checks: [
        'Inspect lips for flaking or dead skin accumulation',
        'Gently buff with Nicole lip scrub or warm damp cloth (2x/wk)',
        'Apply dense layer of hydrating balm or petroleum seal',
        'Press lips together firmly to stimulate micro-vascular pink tint',
        'Confirm zero dry patches or cracking'
      ]
    }
  ];

  const pmStepList = [
    {
      id: 'pm_cleanse',
      num: '1',
      name: 'Double Cleanse (Wash off SPF & Pollutants)',
      zone: 'Full Face, Hairline Borders & Neck',
      tip: 'Cleanse thoroughly to strip sunscreen and sebum. Pat dry with dedicated towel.',
      checks: [
        'Wash hands with soap before touching face',
        'Massage cleanser for 60 seconds across all facial contours',
        'Focus on nose folds, jawline, and hairline hairline margins',
        'Rinse thoroughly with lukewarm water until 100% clean',
        'Pat completely dry (actives require 100% dry skin)'
      ]
    },
    {
      id: 'pm_multani',
      num: '2',
      name: 'Multani Mitti (Clay Detox Mask - 2x/wk)',
      zone: 'T-Zone, Nose Bridge & Oily Zones',
      tip: 'Mix with rose/khus water. Draws deep sebum plugs and minimizes pore diameter.',
      checks: [
        'Mix 1 tbsp Multani Mitti with pure rose/khus water into smooth paste',
        'Apply uniform thin layer across T-zone, nose, and cheeks',
        'Strictly avoid sensitive eye sockets and lip contours',
        'Allow 8–10 minutes to dry partially (never allow cracking fully)',
        'Rinse with cool water using soft circular motions'
      ]
    },
    {
      id: 'pm_active',
      num: '3',
      name: `Tonight's Active: ${tonightRot.short}`,
      zone: 'Target Facial Zones (Avoid Eye Creases)',
      tip: `${tonightRot.active}. ${tonightRot.extra}`,
      checks: [
        'Verify tonight matches 7-day clinical active schedule',
        'Ensure skin is 100% dry (never apply actives on damp skin)',
        'Dispense measured pea-sized dose or 2–3 drops',
        'Target hyperpigmentation, forehead, and cheek texture',
        'Allow 3 minutes to penetrate before applying barrier cream'
      ]
    },
    {
      id: 'pm_barrier',
      num: '4',
      name: 'Minimalist B12 Ceramide Barrier Cream',
      zone: 'Entire Face, Jaw & Neck',
      tip: 'Soothes active inflammation, prevents irritation, and rebuilds lipid matrix.',
      checks: [
        'Take a nickel-sized amount of soothing B12 barrier cream',
        'Warm between clean palms for smooth distribution',
        'Press gently over entire face to buffer the active',
        'Smooth over jawline and neck to prevent dehydration',
        'Confirm calm skin feel with zero redness or irritation'
      ]
    },
    {
      id: 'pm_castor',
      num: '5',
      name: 'Cold-Pressed Castor Oil on Eyelashes & Brows',
      zone: 'Upper/Lower Lashline Roots & Eyebrow Follicles',
      tip: 'Dab 1 drop of pure castor oil on lash lines & eyebrows for thickness, growth, and density.',
      checks: [
        'Sanitize spoolie wand or precision cotton swab',
        'Wipe excess castor oil on the inner rim of bottle',
        'Stroke gently along upper eyelash roots from base to tip',
        'Stroke through eyebrow hair follicles and sparse patches',
        'Avoid direct contact with eyeball or lacrimal tear duct'
      ]
    },
    {
      id: 'pm_minox',
      num: '6',
      name: 'Minoxidil 5% on Temples & Beard',
      zone: 'Temple Hairline Corners & Beard Density Zones',
      tip: 'Apply 1ml with calibrated dropper directly onto scalp hairline corners and beard density zones.',
      checks: [
        'Draw exactly 1.0ml into calibrated dropper',
        'Part hairline and apply droplets directly to receding temple corners',
        'Distribute remaining droplets across patchy beard zones',
        'Massage with fingertips for 30s to stimulate follicle micro-circulation',
        'Wash hands with soap immediately after application'
      ]
    },
    {
      id: 'pm_slug',
      num: '7',
      name: 'Vaseline Lip Slugging & Mouth Tape Ready',
      zone: 'Full Lips, Lip Borders & Nasal Airway',
      tip: 'Seal lips with pure petroleum jelly to wake up with zero chapped skin.',
      checks: [
        'Apply generous layer of pure petroleum jelly over lips',
        'Extend slightly past vermilion border to prevent moisture loss',
        'Position medical mouth tape vertically across center of lips',
        'Take 3 slow deep diaphragmatic nasal breaths',
        'Confirm clear airway passage for deep restorative sleep'
      ]
    }
  ];

  return (
    <div className="section-block">
      {/* TAN & HYPERPIGMENTATION PREVENTION PROTOCOL — dermatologist-grounded */}
      <div className="card" style={{ borderColor: 'rgba(232, 163, 61, 0.35)', background: 'linear-gradient(150deg, var(--surface) 0%, rgba(232, 163, 61, 0.05) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div>
            <p className="eyebrow"><span className="n">prevention</span> dermatologist-backed tan & pigmentation shield</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--turmeric)' }}>☀️ Tan Prevention Protocol</h3>
          </div>
          <span className="tag-badge tag-best">SPF out of stock</span>
        </div>
        <p className="note" style={{ marginBottom: '10px' }}>
          Your SPF is on the to-buy list — sunscreen every single day (even indoors) is the #1 lever against
          both new tanning and the hyperpigmentation you're already treating. UV exposure is what deepens dark spots faster
          than any active can fade them.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[
            'AM order: antioxidant serum (Vitamin C) → barrier moisturizer → SPF 50+ — never skip the last step',
            'Prefer a tinted SPF 50+ with iron oxides — plain SPF misses visible light, which restarts melasma/dark spots',
            '2-finger rule reapplication if outdoors past 2–3h; hoodie/cap on peak sun hours (11am–3pm)',
            '3L water daily + high-protein clean whey — supports barrier repair alongside topical actives',
            'Glutathione (1–2% topical or supplement) pairs with SPF to blunt tyrosinase-driven pigment — never as a sub for sunscreen'
          ].map((chk, i) => (
            <div key={i} style={{ fontSize: '11px', color: 'var(--paper)', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span style={{ color: 'var(--turmeric)', fontWeight: 700 }}>☀</span> {chk}
            </div>
          ))}
        </div>
      </div>

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
              const isExpanded = expandedStep === step.id;
              const stepTelem = telemetry[step.id];
              const checkedCount = step.checks.filter((_, idx) => !!microChecks[`${step.id}_${idx}`]).length;

              return (
                <div
                  key={step.id}
                  style={{
                    background: isDone ? 'rgba(138, 168, 95, 0.06)' : 'var(--surface2)',
                    border: `1px solid ${isDone ? 'var(--sage)' : 'var(--line2)'}`,
                    borderRadius: '8px',
                    padding: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="cat-pill gym" style={{ background: 'rgba(201, 123, 142, 0.2)', color: 'var(--rose)', minWidth: '22px', textAlign: 'center' }}>
                          {step.num}
                        </span>
                        <span className="task-title" style={{ textDecoration: isDone ? 'line-through' : 'none', fontWeight: 600 }}>
                          {step.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                        🎯 Zone: <strong style={{ color: 'var(--paper)' }}>{step.zone}</strong>
                      </div>
                      {stepTelem && (
                        <div style={{ fontSize: '10px', color: 'var(--turmeric)', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                          ⚡ Used {stepTelem.count}x · Last: {stepTelem.lastUsed}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn sm"
                        style={{ fontSize: '10px', padding: '3px 7px', background: 'var(--surface3)' }}
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      >
                        {isExpanded ? '▲ Hide' : `▼ ${checkedCount}/${step.checks.length} Checks`}
                      </button>
                      <button
                        className="task-btn"
                        style={{ background: isDone ? 'var(--sage)' : 'var(--surface3)', color: isDone ? '#1A1206' : 'var(--paper)' }}
                        onClick={() => handleToggleAMStep(step.id)}
                      >
                        {isDone ? '✓' : '○'}
                      </button>
                    </div>
                  </div>

                  {/* 5 GRANULAR MICRO-CHECKS EXPANDED ACCORDION */}
                  {isExpanded && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--line2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <p style={{ fontSize: '10.5px', color: 'var(--turmeric)', margin: 0, fontWeight: 600 }}>
                        5 Precision Technique Checks:
                      </p>
                      {step.checks.map((chk, idx) => {
                        const isChkDone = !!microChecks[`${step.id}_${idx}`];
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '5px 8px',
                              background: isChkDone ? 'rgba(138, 168, 95, 0.12)' : 'var(--surface3)',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            onClick={() => useGlowUpStore.getState().toggleStepMicroCheck(step.id, idx, step.zone)}
                          >
                            <span style={{ color: isChkDone ? 'var(--sage)' : 'var(--muted)', fontSize: '12px', fontWeight: 700 }}>
                              {isChkDone ? '☑' : '☐'}
                            </span>
                            <span style={{ fontSize: '11px', color: isChkDone ? 'var(--paper)' : 'var(--muted)', textDecoration: isChkDone ? 'line-through' : 'none' }}>
                              {chk}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
              const isExpanded = expandedStep === step.id;
              const stepTelem = telemetry[step.id];
              const checkedCount = step.checks.filter((_, idx) => !!microChecks[`${step.id}_${idx}`]).length;

              return (
                <div
                  key={step.id}
                  style={{
                    background: isDone ? 'rgba(138, 168, 95, 0.06)' : 'var(--surface2)',
                    border: `1px solid ${isDone ? 'var(--sage)' : 'var(--line2)'}`,
                    borderRadius: '8px',
                    padding: '10px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedStep(isExpanded ? null : step.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="cat-pill gym" style={{ background: 'rgba(110, 143, 196, 0.2)', color: 'var(--indigo)', minWidth: '22px', textAlign: 'center' }}>
                          {step.num}
                        </span>
                        <span className="task-title" style={{ textDecoration: isDone ? 'line-through' : 'none', fontWeight: 600 }}>
                          {step.name}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px' }}>
                        🎯 Zone: <strong style={{ color: 'var(--paper)' }}>{step.zone}</strong>
                      </div>
                      {stepTelem && (
                        <div style={{ fontSize: '10px', color: 'var(--turmeric)', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                          ⚡ Used {stepTelem.count}x · Last: {stepTelem.lastUsed}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        className="btn sm"
                        style={{ fontSize: '10px', padding: '3px 7px', background: 'var(--surface3)' }}
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                      >
                        {isExpanded ? '▲ Hide' : `▼ ${checkedCount}/${step.checks.length} Checks`}
                      </button>
                      <button
                        className="task-btn"
                        style={{ background: isDone ? 'var(--sage)' : 'var(--surface3)', color: isDone ? '#1A1206' : 'var(--paper)' }}
                        onClick={() => handleTogglePMStep(step.id)}
                      >
                        {isDone ? '✓' : '○'}
                      </button>
                    </div>
                  </div>

                  {/* 5 GRANULAR MICRO-CHECKS EXPANDED ACCORDION */}
                  {isExpanded && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--line2)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <p style={{ fontSize: '10.5px', color: 'var(--turmeric)', margin: 0, fontWeight: 600 }}>
                        5 Precision Technique Checks:
                      </p>
                      {step.checks.map((chk, idx) => {
                        const isChkDone = !!microChecks[`${step.id}_${idx}`];
                        return (
                          <div
                            key={idx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '5px 8px',
                              background: isChkDone ? 'rgba(138, 168, 95, 0.12)' : 'var(--surface3)',
                              borderRadius: '6px',
                              cursor: 'pointer'
                            }}
                            onClick={() => useGlowUpStore.getState().toggleStepMicroCheck(step.id, idx, step.zone)}
                          >
                            <span style={{ color: isChkDone ? 'var(--sage)' : 'var(--muted)', fontSize: '12px', fontWeight: 700 }}>
                              {isChkDone ? '☑' : '☐'}
                            </span>
                            <span style={{ fontSize: '11px', color: isChkDone ? 'var(--paper)' : 'var(--muted)', textDecoration: isChkDone ? 'line-through' : 'none' }}>
                              {chk}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRODUCT TELEMETRY & USAGE AUDIT HUB */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">telemetry</span> product application & timestamp audit</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--turmeric)' }}>🔍 Product Telemetry & Zone Summary</h3>
          </div>
          <span className="tag-badge tag-best">Live Timestamps</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px', marginTop: '10px' }}>
          {[
            { id: 'pm_castor', name: 'Cold-Pressed Castor Oil', zone: 'Eyelashes & Eyebrows', icon: '👁️', rec: 'Nightly PM' },
            { id: 'pm_minox', name: 'Minoxidil 5% Solution', zone: 'Temples & Beard Density', icon: '🧔', rec: 'Nightly PM (1ml)' },
            { id: 'am_khus', name: 'Pure Khus Hydrosol Mist', zone: 'Face, Forehead & Neck', icon: '🌿', rec: 'Morning & Post-Workout' },
            { id: 'pm_multani', name: 'Multani Mitti Clay Mask', zone: 'T-Zone & Oily Contours', icon: '🏺', rec: '2x / Week (Mon/Thu)' },
            { id: 'am_vitc', name: 'Minimalist Vitamin C 10%', zone: 'Full Face & Anterior Neck', icon: '🍊', rec: 'Every Morning (3 drops)' },
            { id: 'pm_slug', name: 'Vaseline Lip Slugging', zone: 'Vermilion Lip Border', icon: '👄', rec: 'Nightly Bedtime' }
          ].map((item) => {
            const data = telemetry[item.id];
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--line2)',
                  borderRadius: '8px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '12.5px', color: 'var(--paper)' }}>
                    {item.icon} {item.name}
                  </span>
                  <span className="badge-count" style={{ background: 'var(--surface3)', color: 'var(--turmeric)' }}>
                    {data?.count || 0} Uses
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  🎯 Application Zone: <strong style={{ color: 'var(--paper)' }}>{item.zone}</strong>
                </div>
                <div style={{ fontSize: '10.5px', color: 'var(--sage)' }}>
                  📅 Frequency: {item.rec}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--turmeric)', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px' }}>
                  🕒 Last Logged: {data?.lastUsed || 'Not logged yet'}
                </div>
                <button
                  className="btn sm"
                  style={{ marginTop: '6px', background: 'var(--surface3)', fontSize: '10.5px', padding: '4px' }}
                  onClick={() => useGlowUpStore.getState().logProductUsage(item.id, item.name, item.zone, 5)}
                >
                  ⚡ +1 Quick Spot Application
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* HAIR, BEARD & NAILS — SIMPLE TASK-AWARE GROOMING (routine vs one-off, owned products only, timing-aware) */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <p className="eyebrow"><span className="n">grooming</span> hair · beard · nails — only what you actually own</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--sage)' }}>💇 Hair, Beard & Nails</h3>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '10px' }}>
          {/* HAIR OILING — single task, owned oils only, auto wash-off timing */}
          {(() => {
            const t = telemetry['hair_oil'];
            const lastTs = t?.history?.[0]?.timestamp;
            const hoursSince = lastTs ? (Date.now() - new Date(lastTs).getTime()) / 3600000 : null;
            const washOffDue = hoursSince !== null && hoursSince < 2;
            return (
              <div style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: 700, fontSize: '12.5px' }}>🧴 Hair Oiling <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(single task)</span></span>
                <span style={{ fontSize: '10.5px', color: 'var(--muted)' }}>Tool: coconut oil (daily) or castor oil (density) — whichever's in reach</span>
                {washOffDue ? (
                  <span style={{ fontSize: '10.5px', color: 'var(--turmeric)' }}>⏳ Wash off by {new Date(new Date(lastTs!).getTime() + 2 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                ) : (
                  <span style={{ fontSize: '10.5px', color: 'var(--muted)' }}>{lastTs ? `Last oiled: ${t!.lastUsed}` : 'Not logged yet — no reminder until you do'}</span>
                )}
                <button className="btn sm" style={{ marginTop: '2px' }} onClick={() => useGlowUpStore.getState().logProductUsage('hair_oil', 'Hair Oiling (Coconut/Castor)', 'Scalp', 1)}>
                  ⚡ Log Oiling Now
                </button>
              </div>
            );
          })()}

          {/* BEARD — minoxidil is primary, dermaroller only if extra needed */}
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <span style={{ fontWeight: 700, fontSize: '12.5px' }}>🧔 Beard Density <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(nightly routine)</span></span>
            <span style={{ fontSize: '10.5px', color: 'var(--muted)' }}>Primary tool: Minoxidil 5% (nightly). Dermaroller only on patchy zones needing extra push.</span>
            <span style={{ fontSize: '10.5px', color: telemetry['pm_minox'] ? 'var(--sage)' : 'var(--muted)' }}>
              {telemetry['pm_minox'] ? `✓ Minoxidil last: ${telemetry['pm_minox'].lastUsed}` : 'Log tonight in PM Skincare above'}
            </span>
          </div>

          {/* NAILS — weekly cadence task, silent until actually due */}
          {(() => {
            const t = telemetry['nails_trim'];
            const lastTs = t?.history?.[0]?.timestamp;
            const daysSince = lastTs ? (Date.now() - new Date(lastTs).getTime()) / 86400000 : 999;
            const isDue = daysSince >= 7;
            return (
              <div style={{ background: 'var(--surface2)', border: `1px solid ${isDue ? 'var(--turmeric)' : 'var(--line2)'}`, borderRadius: '8px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <span style={{ fontWeight: 700, fontSize: '12.5px' }}>💅 Nails <span style={{ fontWeight: 400, color: 'var(--muted)' }}>(weekly task)</span></span>
                <span style={{ fontSize: '10.5px', color: isDue ? 'var(--turmeric)' : 'var(--muted)' }}>
                  {isDue ? '✂ Due — trim whenever convenient today' : `Not due yet — trimmed ${Math.floor(daysSince)}d ago, next check in ${Math.max(0, 7 - Math.floor(daysSince))}d`}
                </span>
                <button className="btn sm" style={{ marginTop: '2px' }} onClick={() => useGlowUpStore.getState().logProductUsage('nails_trim', 'Nail Trim', 'Hands/Feet', 1)}>
                  ⚡ Log Trim
                </button>
              </div>
            );
          })()}
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
