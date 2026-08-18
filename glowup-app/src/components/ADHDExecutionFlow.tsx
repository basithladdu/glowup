import React, { useState, useEffect } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { triggerGoalCelebration } from '../lib/confetti';
import { playSuccessChime } from '../lib/sound';

export const ADHDExecutionFlow: React.FC = () => {
  const { selectedDate, getDayState, saveState, toggleHabit } = useGlowUpStore();
  const dayState = getDayState();

  // Box Breathing Meditation State
  const [medSeconds, setMedSeconds] = useState(10 * 60);
  const [medRunning, setMedRunning] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale (4s)' | 'Hold (4s)' | 'Exhale (4s)' | 'Hold (4s)'>('Inhale (4s)');

  // Nightly 3-Must-Dos State
  const [todo1, setTodo1] = useState('');
  const [todo2, setTodo2] = useState('');
  const [todo3, setTodo3] = useState('');

  // Box breathing 16s cycle
  useEffect(() => {
    let timer: any = null;
    let breathTimer: any = null;

    if (medRunning && medSeconds > 0) {
      timer = setInterval(() => setMedSeconds(prev => prev - 1), 1000);
      
      const phases: Array<'Inhale (4s)' | 'Hold (4s)' | 'Exhale (4s)' | 'Hold (4s)'> = [
        'Inhale (4s)',
        'Hold (4s)',
        'Exhale (4s)',
        'Hold (4s)'
      ];
      let pIdx = 0;
      breathTimer = setInterval(() => {
        pIdx = (pIdx + 1) % 4;
        setBreathPhase(phases[pIdx]);
      }, 4000);
    } else if (medSeconds === 0) {
      setMedRunning(false);
      toggleHabit('h_meditation');
      triggerGoalCelebration();
      playSuccessChime();
    }

    return () => {
      if (timer) clearInterval(timer);
      if (breathTimer) clearInterval(breathTimer);
    };
  }, [medRunning, medSeconds, toggleHabit]);

  const handleSaveNightPlan = (e: React.FormEvent) => {
    e.preventDefault();
    (dayState as any).nightlyPlan = { t1: todo1, t2: todo2, t3: todo3, done1: false, done2: false, done3: false };
    saveState({ area: 'adhd', item: 'nightly-plan', exact_update: `Saved 3 Must-Dos for ${selectedDate}` });
    triggerGoalCelebration();
    playSuccessChime();
  };

  const currentPlan = (dayState as any).nightlyPlan || {
    t1: '1. Ship 1 Content Short / ClickUp Triage',
    t2: '2. Complete 6-Day PPL Lift Session (Heavy Compounds)',
    t3: '3. Lock in 170g Protein Floor & SPF 50 Shield',
    done1: false,
    done2: false,
    done3: false
  };

  const handleTogglePlanItem = (k: 'done1' | 'done2' | 'done3') => {
    currentPlan[k] = !currentPlan[k];
    saveState({ area: 'adhd', item: `plan-${k}`, exact_update: `Toggled plan task ${k}` });
    if (currentPlan.done1 && currentPlan.done2 && currentPlan.done3) {
      triggerGoalCelebration();
      playSuccessChime();
    }
  };

  // ADHD Phase Protocol Cards
  const adhdTimelineSteps = [
    {
      phase: '🌅 07:00 AM Ignition',
      action: 'NO PHONE. Drink 500ml water + Splash Cold Face.',
      why: 'Prevents morning dopamine hijacking. Cold water activates vagus nerve.',
      tag: 'IMMEDIATE'
    },
    {
      phase: '🧘 07:20 AM Mental Quiet',
      action: '10-Minute Box Breathing or Outdoor Sunlight Walk.',
      why: 'Quiets amygdala panic and resets prefrontal dopamine baseline.',
      tag: 'CALM BASELINE'
    },
    {
      phase: '🎯 09:30 AM Deep Work',
      action: 'Single-Task Sprint (45m Timer). Phone in drawer.',
      why: 'ADHD brain thrives in hyper-focus sprints, dies in multitasking.',
      tag: 'MONK MODE'
    },
    {
      phase: '🏋️ 17:30 PM Physical Discharge',
      action: 'Metallicadpa PPL Compound Lifting.',
      why: 'Heavy loading triggers massive BDNF, serotonin & dopamine release.',
      tag: 'DOPAMINE SURGE'
    },
    {
      phase: '🌙 22:30 PM Night Shutdown',
      action: 'Write tomorrow’s 3 Must-Dos + Multani Mitti / Castor Oil + Mouth Tape.',
      why: 'Never wake up wondering what to do. You execute tomorrow on autopilot.',
      tag: 'AUTOPILOT'
    }
  ];

  return (
    <div className="section-block">
      {/* HEADER: ADHD EXECUTIVE ENGINE */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">adhd</span> executive dysfunction slayer</p>
            <h2 style={{ fontSize: '18px', margin: 0 }}>🧠 ADHD Hyper-Focus Protocol &amp; Flow</h2>
          </div>
          <span className="tag-badge tag-best">ZERO-OVERWHELM</span>
        </div>
        <p className="note">
          "If you try to do 20 things at once, you freeze. If you execute ONE Call-To-Action at a time on autopilot, you will become the greatest in your city."
        </p>
      </div>

      <div className="desktop-grid-equal">
        {/* LEFT COLUMN: 10-MIN BOX BREATHING & CURRENT MUST-DOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 10-MIN BOX BREATHING MEDITATION */}
          <div className="card" style={{ textAlign: 'center', padding: '16px' }}>
            <p className="eyebrow"><span className="n">calm</span> 10-minute nervous system reset</p>
            <h3 style={{ fontSize: '16px', margin: '0 0 4px', color: 'var(--sage)' }}>Box Breathing Meditation</h3>
            <p className="note" style={{ marginBottom: '10px' }}>
              Used by Navy SEALs & high performers to instantly lower cortisol and eliminate mental static.
            </p>

            <div style={{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--turmeric)',
              margin: '12px 0',
              padding: '12px',
              background: 'var(--surface2)',
              borderRadius: '8px',
              border: '1px solid var(--line2)'
            }}>
              {medRunning ? breathPhase : 'Ready to Reset'}
            </div>

            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '32px', fontWeight: 700, color: 'var(--paper)', margin: '8px 0' }}>
              {String(Math.floor(medSeconds / 60)).padStart(2, '0')}:{String(medSeconds % 60).padStart(2, '0')}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${medRunning ? 'sage' : 'primary'}`}
                style={{ flex: 1 }}
                onClick={() => setMedRunning(!medRunning)}
              >
                {medRunning ? '⏸ Pause Meditation' : '▶ Start 10m Box Meditation'}
              </button>
              <button
                className="btn sm"
                style={{ background: 'var(--surface3)' }}
                onClick={() => { setMedRunning(false); setMedSeconds(10 * 60); }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* TODAY'S 3 NON-NEGOTIABLE CALLS-TO-ACTION */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <p className="eyebrow"><span className="n">focus</span> 3 non-negotiable actions</p>
                <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--turmeric)' }}>Today's 3 Calls-To-Action</h3>
              </div>
              <span className="badge-count">
                {[currentPlan.done1, currentPlan.done2, currentPlan.done3].filter(Boolean).length} / 3
              </span>
            </div>
            <p className="note" style={{ marginBottom: '10px' }}>
              Forget everything else. Complete only these 3 calls-to-action today and your day is a massive 100% win.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                className="task-item"
                style={{ cursor: 'pointer', background: currentPlan.done1 ? 'rgba(138, 168, 95, 0.08)' : 'var(--surface2)' }}
                onClick={() => handleTogglePlanItem('done1')}
              >
                <span className="task-title" style={{ textDecoration: currentPlan.done1 ? 'line-through' : 'none' }}>
                  {currentPlan.t1}
                </span>
                <button className="task-btn" style={{ background: currentPlan.done1 ? 'var(--sage)' : 'var(--surface3)' }}>
                  {currentPlan.done1 ? '✓' : '○'}
                </button>
              </div>

              <div
                className="task-item"
                style={{ cursor: 'pointer', background: currentPlan.done2 ? 'rgba(138, 168, 95, 0.08)' : 'var(--surface2)' }}
                onClick={() => handleTogglePlanItem('done2')}
              >
                <span className="task-title" style={{ textDecoration: currentPlan.done2 ? 'line-through' : 'none' }}>
                  {currentPlan.t2}
                </span>
                <button className="task-btn" style={{ background: currentPlan.done2 ? 'var(--sage)' : 'var(--surface3)' }}>
                  {currentPlan.done2 ? '✓' : '○'}
                </button>
              </div>

              <div
                className="task-item"
                style={{ cursor: 'pointer', background: currentPlan.done3 ? 'rgba(138, 168, 95, 0.08)' : 'var(--surface2)' }}
                onClick={() => handleTogglePlanItem('done3')}
              >
                <span className="task-title" style={{ textDecoration: currentPlan.done3 ? 'line-through' : 'none' }}>
                  {currentPlan.t3}
                </span>
                <button className="task-btn" style={{ background: currentPlan.done3 ? 'var(--sage)' : 'var(--surface3)' }}>
                  {currentPlan.done3 ? '✓' : '○'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: NIGHTLY 3-MIN TRIAGE & ADHD AUTOPILOT PROTOCOL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* NIGHTLY PLANNER FORM */}
          <div className="card">
            <p className="eyebrow"><span className="n">night</span> plan tomorrow before sleep (3 mins)</p>
            <h3 style={{ fontSize: '15px', margin: '0 0 6px', color: 'var(--indigo)' }}>
              🌙 Nightly Autopilot Lock-In
            </h3>
            <p className="note" style={{ marginBottom: '10px' }}>
              Never wake up and plan. Plan tonight so tomorrow morning your brain wakes up knowing exactly what to execute with zero hesitation.
            </p>

            <form onSubmit={handleSaveNightPlan} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label className="fl">Must-Do Action #1 (Work / Content / ClickUp)</label>
                <input
                  value={todo1}
                  onChange={(e) => setTodo1(e.target.value)}
                  placeholder="e.g. Record Video #14 on Geopolitics (45m)"
                  required
                />
              </div>

              <div>
                <label className="fl">Must-Do Action #2 (Training / Physical)</label>
                <input
                  value={todo2}
                  onChange={(e) => setTodo2(e.target.value)}
                  placeholder="e.g. Pull A (Deadlifts + Barbell Rows)"
                  required
                />
              </div>

              <div>
                <label className="fl">Must-Do Action #3 (Grooming / Nutrition)</label>
                <input
                  value={todo3}
                  onChange={(e) => setTodo3(e.target.value)}
                  placeholder="e.g. 170g Protein + Castor Oil on Lashes + Mouth Tape"
                  required
                />
              </div>

              <button type="submit" className="btn primary" style={{ width: '100%', marginTop: '6px' }}>
                ✓ Lock In Tomorrow's 3 Calls-To-Action
              </button>
            </form>
          </div>

          {/* ADHD AUTOPILOT TIMELINE RULES */}
          <div className="card">
            <p className="eyebrow"><span className="n">blueprint</span> the 5-step daily autopilot</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {adhdTimelineSteps.map((s, idx) => (
                <div key={idx} className="task-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '3px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--paper)' }}>{s.phase}</span>
                    <span className="cat-pill gym" style={{ background: 'rgba(232, 163, 61, 0.15)', color: 'var(--turmeric)', fontSize: '8.5px' }}>
                      {s.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--turmeric)', fontWeight: 600 }}>{s.action}</div>
                  <div style={{ fontSize: '10px', color: 'var(--muted)' }}>{s.why}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
