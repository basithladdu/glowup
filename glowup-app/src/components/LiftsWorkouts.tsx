import React, { useState, useEffect } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { METALLICADPA_PPL, LIFTS } from '../lib/constants';

export const LiftsWorkouts: React.FC = () => {
  const { selectedDate, getDayState, logLiftSet, setWorkoutRoutine } = useGlowUpStore();
  const dayState = getDayState();

  const [liftName, setLiftName] = useState(LIFTS[0]);
  const [kg, setKg] = useState('60');
  const [reps, setReps] = useState('5');
  const [setsCount, setSetsCount] = useState('1');
  const [restSeconds, setRestSeconds] = useState<number | null>(null);
  const [activeFormCheck, setActiveFormCheck] = useState<string | null>(null);

  // Rest Timer countdown
  useEffect(() => {
    if (restSeconds === null || restSeconds <= 0) return;
    const interval = setInterval(() => {
      setRestSeconds(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [restSeconds]);

  // Routine resolution
  const dayOfWeek = new Date(selectedDate).getDay();
  const autoRoutineKey = dayOfWeek === 0 ? 'rest' : dayOfWeek === 1 ? 'pull_a' : dayOfWeek === 2 ? 'push_a' : dayOfWeek === 3 ? 'legs_a' : dayOfWeek === 4 ? 'pull_a' : dayOfWeek === 5 ? 'push_a' : 'legs_a';
  const activeRoutineKey = dayState.workoutRoutine || autoRoutineKey;
  const currentRoutine = METALLICADPA_PPL[activeRoutineKey] || METALLICADPA_PPL['pull_a'];

  const routineOptions = [
    { id: 'auto', label: 'Auto (by Day)' },
    { id: 'arms', label: 'Dedicated Arms Day' },
    { id: 'pull_a', label: 'Day 1 Pull' },
    { id: 'push_a', label: 'Day 2 Push' },
    { id: 'legs_a', label: 'Day 3 Legs' },
    { id: 'rest', label: 'Active Rest' },
  ];

  const exerciseFormGuides: Record<string, { zone: string; checks: string[] }> = {
    'Incline DB Bench Press': {
      zone: 'Clavicular Upper Chest & Anterior Deltoid',
      checks: [
        'Set bench to 30° incline (not 45° to avoid shoulder takeover)',
        'Retract and depress shoulder blades firmly against pad',
        'Tuck elbows to 45° angle (never flare straight out to 90°)',
        'Lower dumbbells with a 3-second controlled eccentric deep stretch',
        'Drive up and converge at top without clanking weights'
      ]
    },
    'Bench Press (Barbell)': {
      zone: 'Sternal Pectoralis Major & Triceps',
      checks: [
        'Plant feet firmly on floor for solid leg drive',
        'Grip barbell 1.5x shoulder width with wrists stacked straight',
        'Unrack and settle over clavicles, retracting scapulae',
        'Lower bar smoothly to lower sternum with 45° elbow tuck',
        'Drive explosively off chest while maintaining shoulder blade pack'
      ]
    },
    'Deadlift (Barbell)': {
      zone: 'Hamstrings, Glutes, Spinal Erectors & Lat Lock',
      checks: [
        'Place mid-foot under barbell (1 inch from shins)',
        'Hinge hips back and grip bar without moving it',
        'Pull chest up to pull the slack out of the barbell click',
        'Push the floor away through mid-foot like a leg press',
        'Lock out by squeezing glutes (avoid hyperextending lower back)'
      ]
    },
    'Barbell Squat': {
      zone: 'Quadriceps, Gluteus Maximus & Core Cylinder',
      checks: [
        'Rest bar across upper traps (or rear delts for low bar)',
        'Take a deep 360° diaphragmatic breath and brace core tight',
        'Hinge hips and bend knees simultaneously to break parallel',
        'Track knees outward in line with second toe',
        'Drive through mid-foot and stand tall with glute lock'
      ]
    },
    'Lat Pulldown': {
      zone: 'Latissimus Dorsi & Teres Major',
      checks: [
        'Use thumbless overhand grip slightly outside shoulders',
        'Arch upper thoracic spine and look slightly upward',
        'Initiate pull by driving elbows straight down to hip pockets',
        'Squeeze lats at bottom for 1 second without swinging back',
        'Control 3-second eccentric stretch back to full extension'
      ]
    },
    'Lateral Raise (DB)': {
      zone: 'Lateral Deltoid (Shoulder Cap Width)',
      checks: [
        'Tilt torso forward 10–15° with soft knees',
        'Lead movement with elbows rather than hands',
        'Pour the pitcher slightly at the top (pinky higher than thumb)',
        'Raise to parallel with shoulders (avoid shrugging traps)',
        'Lower slowly with 3-second negative cadence'
      ]
    }
  };

  const activeGuide = exerciseFormGuides[liftName] || {
    zone: 'Target Muscle Fiber Chain',
    checks: [
      'Establish firm ground contact and biomechanical brace',
      'Control 3-second eccentric stretch under continuous tension',
      'Maintain neutral cervical and lumbar spine alignment',
      'Execute explosive concentric contraction into target muscle peak',
      'Avoid swinging or using momentum to cheat reps'
    ]
  };

  const handleQuickFill = (exName: string, exSets: string) => {
    setLiftName(exName);
    const repMatch = exSets.match(/(\d+)/);
    if (repMatch) setReps(repMatch[1]);
  };

  const handleStartRest = (secs: number) => {
    setRestSeconds(secs);
  };

  const handleLogSet = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(setsCount, 10) || 1;
    for (let i = 0; i < count; i++) {
      logLiftSet({
        n: liftName,
        kg: parseFloat(kg) || 0,
        reps: parseInt(reps, 10) || 0
      });
    }
    handleStartRest(90);
  };

  const totalVolumeKg = dayState.lifts.reduce((sum, l) => sum + (l.kg * l.reps), 0);

  return (
    <div className="section-block">
      {/* ROUTINE SWITCHER BAR */}
      <div className="card">
        <p className="eyebrow"><span className="n">split</span> routine switcher</p>
        <div className="routine-selector">
          {routineOptions.map((opt) => (
            <button
              key={opt.id}
              className={`routine-chip ${(opt.id === 'auto' && !dayState.workoutRoutine) || dayState.workoutRoutine === opt.id ? 'active' : ''}`}
              onClick={() => setWorkoutRoutine(opt.id === 'auto' ? null : opt.id)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ marginTop: '12px', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
            <h2 style={{ fontSize: '16px', margin: 0, color: 'var(--paper)' }}>{currentRoutine.name}</h2>
            <span className="tag-badge tag-best">{currentRoutine.badge}</span>
          </div>
          <div style={{ marginTop: '4px' }}>
            {!dayState.workoutRoutine ? (
              <span className="badge-count" style={{ background: 'rgba(232,163,61,0.15)', color: 'var(--turmeric)' }}>
                Suggested for {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][dayOfWeek]} — auto by split
              </span>
            ) : (
              <span className="badge-count" style={{ background: 'rgba(110,143,196,0.15)', color: 'var(--indigo)' }}>
                ✋ Manually picked — auto-suggests {METALLICADPA_PPL[autoRoutineKey]?.name.split('·')[0].trim()}
              </span>
            )}
          </div>
          <p className="note" style={{ margin: '4px 0 10px' }}>{currentRoutine.desc}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '10.5px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--turmeric)' }}>
              Frequency: {currentRoutine.freq}
            </span>
            <span className="badge-count" style={{ background: 'var(--surface2)', color: 'var(--sage)' }}>
              Total Volume: {totalVolumeKg.toLocaleString()} kg
            </span>
          </div>
        </div>
      </div>

      {/* REST TIMER BAR */}
      <div className="card" style={{ background: 'linear-gradient(135deg, rgba(27, 24, 22, 0.95), rgba(45, 40, 36, 0.6))' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <p className="eyebrow" style={{ margin: 0 }}><span className="n">timer</span> inter-set recovery</p>
            <div style={{ fontSize: '18px', fontWeight: 700, color: restSeconds && restSeconds > 0 ? 'var(--turmeric)' : 'var(--sage)', fontFamily: 'JetBrains Mono, monospace' }}>
              {restSeconds !== null && restSeconds > 0
                ? `⏱${Math.floor(restSeconds / 60)}:${String(restSeconds % 60).padStart(2, '0')} Rest Left`
                : '✅ Ready for Next Working Set'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="btn sm" style={{ background: 'var(--surface3)' }} onClick={() => handleStartRest(60)}>
              60s
            </button>
            <button className="btn sm" style={{ background: 'var(--surface3)' }} onClick={() => handleStartRest(90)}>
              90s
            </button>
            <button className="btn sm" style={{ background: 'var(--surface3)' }} onClick={() => handleStartRest(120)}>
              120s
            </button>
            {restSeconds !== null && restSeconds > 0 && (
              <button className="btn sm rose" onClick={() => setRestSeconds(0)}>
                × Stop
              </button>
            )}
          </div>
        </div>
      </div>

      {/* EXERCISES LIST WITH SUPERSETS & 1-CLICK FILL */}
      <div className="card">
        <p className="eyebrow"><span className="n">exercises</span> today's routine breakdown</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {currentRoutine.exercises.map((ex, idx) => (
            <div
              key={idx}
              className="ex-row"
              onClick={() => handleQuickFill(ex.name, ex.sets)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--paper)' }}>{ex.name}</span>
                  {ex.intensity && <span className="intensity-tag">{ex.intensity}</span>}
                  {ex.isSuperset && <span className="superset-badge">{ex.supersetLabel}</span>}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>{ex.cue}</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: 'var(--turmeric)', fontSize: '12px', textAlign: 'right' }}>
                  {ex.sets}<br />
                  <small style={{ color: 'var(--muted)', fontWeight: 500, fontSize: '10px' }}>{ex.reps}</small>
                </span>
                <button
                  className="ex-quick-btn"
                  onClick={(e) => { e.stopPropagation(); handleQuickFill(ex.name, ex.sets); }}
                >
                  + Log
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOG WORKING SET FORM WITH 5 PRECISION FORM CHECKS */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">log</span> record working set &amp; biomechanics</p>
            <h3 style={{ fontSize: '14px', margin: 0, color: 'var(--turmeric)' }}>{liftName}</h3>
          </div>
          <button
            className="btn sm"
            style={{ fontSize: '10.5px', background: 'var(--surface3)' }}
            onClick={() => setActiveFormCheck(activeFormCheck === liftName ? null : liftName)}
          >
            {activeFormCheck === liftName ? '▲ Hide Form Guide' : '5 Form Checks'}
          </button>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>
          Target Anatomical Zone: <strong style={{ color: 'var(--paper)' }}>{activeGuide.zone}</strong>
        </div>

        {activeFormCheck === liftName && (
          <div style={{ background: 'var(--surface2)', border: '1px solid var(--line2)', borderRadius: '8px', padding: '10px', marginBottom: '12px' }}>
            <p style={{ fontSize: '11px', color: 'var(--turmeric)', fontWeight: 700, margin: '0 0 6px' }}>
              5 Precision Hypertrophy Technique Checks:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {activeGuide.checks.map((chk, i) => (
                <div key={i} style={{ fontSize: '11px', color: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ color: 'var(--sage)', fontWeight: 700 }}>✓</span> {chk}
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleLogSet} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label className="fl">Exercise</label>
            <input value={liftName} onChange={(e) => setLiftName(e.target.value)} required />
          </div>

          <div className="frow">
            <div>
              <label className="fl">Weight (kg)</label>
              <input type="number" step="0.5" value={kg} onChange={(e) => setKg(e.target.value)} required />
            </div>
            <div>
              <label className="fl">Reps</label>
              <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} required />
            </div>
            <div>
              <label className="fl">Sets</label>
              <input type="number" value={setsCount} onChange={(e) => setSetsCount(e.target.value)} min="1" max="10" required />
            </div>
          </div>

          <button type="submit" className="btn primary" style={{ width: '100%' }}>
            ✓ Log Working Set &amp; Start Rest Timer
          </button>
        </form>
      </div>

      {/* LOGGED SETS ON THIS DATE */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <p className="eyebrow" style={{ margin: 0 }}>logged sets on this date ({dayState.lifts.length} sets)</p>
          <span style={{ fontSize: '11px', color: 'var(--turmeric)', fontFamily: 'JetBrains Mono, monospace' }}>
            {totalVolumeKg} kg Volume
          </span>
        </div>
        {!dayState.lifts.length ? (
          <div className="empty">No lifting sets logged on this date.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dayState.lifts.map((l, idx) => (
              <div key={idx} className="logrow" style={{ padding: '8px 10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span className="logname" style={{ fontWeight: 600 }}>{l.n}</span>
                  <span style={{ fontSize: '10px', color: 'var(--muted)' }}>Set #{idx + 1}</span>
                </div>
                <span className="logmac" style={{ color: 'var(--turmeric)', fontWeight: 700, fontSize: '13px' }}>
                  {l.kg} kg × {l.reps} reps ({l.kg * l.reps} kg)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
