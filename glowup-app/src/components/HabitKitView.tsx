import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

interface HabitDef {
  id: string;
  name: string;
  sub: string;
  icon: string;
  color: string; // hex
  bgTint: string;
  category: 'health' | 'hygiene' | 'productivity' | 'derm';
  checks: string[];
}

export const HabitKitView: React.FC = () => {
  const { state, selectedDate, setSelectedDate, toggleHabit, getDayState, toggleStepEnabled } = useGlowUpStore();

  // Habits you've switched off vanish from the grid and stop being nagged about.
  const disabledIds = state.disabledSteps || [];
  const dayState = getDayState();
  const [showAudit, setShowAudit] = useState(false);
  const [expandedHabit, setExpandedHabit] = useState<string | null>(null);

  const habits: HabitDef[] = [
    {
      id: 'h_sunlight',
      name: 'Walk 7,000 steps & Morning Sunlight',
      sub: 'Cortisol spike, circadian anchor & fat burn',
      icon: '',
      color: '#10B981',
      bgTint: 'rgba(16, 185, 129, 0.12)',
      category: 'health',
      checks: [
        'Step outdoors within 45 mins of waking',
        'Direct sunlight into eyes without sunglasses (10–15 mins)',
        'Brisk pace to elevate heart rate above 100 bpm',
        'Hydrate with 500ml water before or during walk',
        'Hit at least 3,500 morning steps toward 7k floor'
      ]
    },
    {
      id: 'h_tongue',
      name: 'Copper Tongue Scraping & Dental Floss',
      sub: 'Eliminates morning oral sulfur compounds & plaque',
      icon: '',
      color: '#06B6D4',
      bgTint: 'rgba(6, 182, 212, 0.12)',
      category: 'hygiene',
      checks: [
        '5–7 firm sweeps from back of tongue to tip',
        'Rinse scraper thoroughly with warm water',
        'Floss inter-dental contacts to remove anaerobic biofilm',
        '2-minute circular brushing along gumline',
        'Warm water or salt rinse'
      ]
    },
    {
      id: 'h_spf',
      name: 'SPF 50 Shield (Face, Neck, Arms & Hands)',
      sub: 'Blocks 98% UVA/UVB photo-aging & pigmentation',
      icon: '',
      color: '#F43F5E',
      bgTint: 'rgba(244, 63, 94, 0.12)',
      category: 'derm',
      checks: [
        'Squeeze 2 full finger lengths of Lakmé SPF 50',
        'Apply evenly across forehead, nose, and cheeks',
        'Cover ears and anterior/posterior neck',
        'Rub remainder into back of hands',
        'Allow 15 minutes before direct UV exposure'
      ]
    },
    {
      id: 'h_creatine',
      name: '5g Creatine Monohydrate & 500ml Water',
      sub: 'Cellular ATP output & cognitive hydration',
      icon: '',
      color: '#F59E0B',
      bgTint: 'rgba(245, 158, 11, 0.12)',
      category: 'health',
      checks: [
        'Measure exact 5.0g scoop',
        'Dissolve in 400–500ml water or protein shake',
        'Stir vigorously until transparent',
        'Consume with carbs or meal for optimal insulin uptake',
        'Maintain 3.5L daily baseline water intake'
      ]
    },
    {
      id: 'h_coconutoil',
      name: 'Virgin Coconut Oil Scalp & Hairline Massage',
      sub: 'Penetrates hair cortex, reduces protein loss & strengthens roots',
      icon: '',
      color: '#14B8A6',
      bgTint: 'rgba(20, 184, 166, 0.12)',
      category: 'derm',
      checks: [
        'Warm 1–2 tsp pure cold-pressed virgin coconut oil in palms',
        'Part hair section by section to expose scalp roots',
        'Massage in firm circular motions with fingertips for 5 minutes',
        'Distribute light coat through hair mid-lengths to prevent split ends',
        'Leave for 45–60 mins or overnight before gentle clarifying wash'
      ]
    },
    {
      id: 'h_clickup',
      name: '10m ClickUp Triage & Content Spark',
      sub: 'Triage 3 oldest backlog tasks & capture video notes',
      icon: '',
      color: '#6366F1',
      bgTint: 'rgba(99, 102, 241, 0.12)',
      category: 'productivity',
      checks: [
        'Open ClickUp dashboard with zero distraction tabs',
        'Exterminate top 3 oldest overdue or pending cards',
        'Capture 1 raw content idea or script hook in notes',
        'Re-prioritize high-leverage bottlenecks for tomorrow',
        'Log completion within 10-minute focus timer block'
      ]
    },
    {
      id: 'h_protein',
      name: '170g Protein Floor & 50/50 Jaw Chewing',
      sub: 'Muscle synthesis & symmetrical masseter jaw development',
      icon: '',
      color: '#8B5CF6',
      bgTint: 'rgba(139, 92, 246, 0.12)',
      category: 'health',
      checks: [
        'Weigh chicken / eggs / soya / whey portions accurately',
        'Hit at least 40g protein per major feeding window',
        'Chew each mouthful 20–30 times alternately on left/right jaw',
        'Engage masseter muscles symmetrically',
        'Reach 170g floor before 10:00 PM'
      ]
    },
    {
      id: 'h_posture',
      name: 'Spine Decompression & Dead Hangs',
      sub: 'Opens chest, improves posture & reclaims 1–3cm height',
      icon: '',
      color: '#EAB308',
      bgTint: 'rgba(234, 179, 8, 0.12)',
      category: 'health',
      checks: [
        'Grab pull-up bar with shoulder-width overhand grip',
        'Hang completely relaxed for 45–60 seconds',
        'Let gravity decompress lumbar and thoracic vertebrae',
        'Perform 10 wall angels with chin tucked',
        'Maintain tall sternum and retracted neck alignment'
      ]
    },
    {
      id: 'h_minox',
      name: 'Minoxidil 5% on Temples & Beard',
      sub: 'Nightly follicle stimulation for hairline & density',
      icon: '',
      color: '#3B82F6',
      bgTint: 'rgba(59, 130, 246, 0.12)',
      category: 'derm',
      checks: [
        'Draw exactly 1.0ml into calibrated dropper',
        'Apply directly onto temple recession zones',
        'Apply remaining drops across patchy beard areas',
        'Massage with fingertips for 30 seconds',
        'Wash hands with soap immediately'
      ]
    },
    {
      id: 'h_mouthtape',
      name: 'Nasal Mouth Tape for Deep Sleep',
      sub: '100% nasal breathing, raises nitric oxide & prevents snoring',
      icon: '',
      color: '#4F46E5',
      bgTint: 'rgba(79, 70, 229, 0.12)',
      category: 'hygiene',
      checks: [
        'Clean and dry lips completely',
        'Apply vertical strip of medical micropore tape',
        'Test 3 deep diaphragmatic nasal breaths',
        'Confirm clear airway passage',
        'Sleep strictly in nasal respiration mode'
      ]
    }
  ];

  // Past 7 days day-picker pill bar
  const getRecentDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      days.push({
        dateStr: dStr,
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()],
        dayNum: d.getDate(),
        isToday: dStr === new Date().toISOString().slice(0, 10),
        isSelected: dStr === selectedDate
      });
    }
    return days;
  };

  // Generate 35-day historical mini dot heatmap for a specific habit
  const getHabitMiniHeatmap = (habitId: string) => {
    const today = new Date();
    const dots: Array<{ date: string; isDone: boolean }> = [];
    for (let i = 35; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      const done = !!(state.days[dStr]?.habits?.[habitId]);
      dots.push({ date: dStr, isDone: done });
    }
    return dots;
  };

  // Compute consistency score for each habit
  const activeHabits = habits.filter(h => !disabledIds.includes(h.id));

  const habitConsistency = activeHabits.map(h => {
    const dots = getHabitMiniHeatmap(h.id);
    const doneCount = dots.filter(d => d.isDone).length;
    const score = Math.round((doneCount / dots.length) * 100);
    return {
      ...h,
      doneCount,
      totalCount: dots.length,
      score,
      status: score >= 80 ? 'Locked In' : score >= 50 ? 'Good Momentum' : '⚠Needs Focus'
    };
  });

  return (
    <div className="section-block">
      {/* HABITKIT HEADER */}
      <div className="card habitkit-header-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}></span>
            <div>
              <h2 style={{ fontSize: '18px', margin: 0, letterSpacing: '-0.02em' }}>
                Habit<span style={{ color: '#8B5CF6' }}>Kit</span> Matrix
              </h2>
              <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                Continuous Momentum Grid
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button
              className={`btn sm ${showAudit ? 'primary' : ''}`}
              style={{ background: showAudit ? undefined : 'var(--surface2)', fontSize: '10px' }}
              onClick={() => setShowAudit(!showAudit)}
            >
              {showAudit ? 'Hide Audit' : 'Consistency Audit'}
            </button>
          </div>
        </div>

        {/* 7-DAY CIRCULAR DATE PICKER BAR */}
        <div className="habitkit-date-strip">
          {getRecentDays().map((d, idx) => (
            <div
              key={idx}
              className={`habitkit-day-circle ${d.isSelected ? 'selected' : ''} ${d.isToday ? 'today' : ''}`}
              onClick={() => setSelectedDate(d.dateStr)}
            >
              <span className="h-day-name">{d.dayName}</span>
              <span className="h-day-num">{d.dayNum}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CONSISTENCY AUDIT BREAKDOWN */}
      {showAudit && (
        <div className="card" style={{ background: 'var(--surface2)', border: '1px solid var(--line2)' }}>
          <p className="eyebrow"><span className="n">audit</span> 35-day consistency &amp; reliability breakdown</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px', marginTop: '8px' }}>
            {habitConsistency.map(hc => (
              <div key={hc.id} style={{ background: 'var(--surface)', padding: '8px 10px', borderRadius: '8px', border: '0.5px solid var(--line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700 }}>{hc.icon} {hc.name.slice(0, 18)}...</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: hc.color, fontWeight: 700 }}>{hc.score}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '9.5px', color: 'var(--muted)' }}>
                  <span>{hc.doneCount} / {hc.totalCount} days</span>
                  <span style={{ color: hc.score >= 80 ? 'var(--sage)' : hc.score >= 50 ? 'var(--turmeric)' : 'var(--vermilion)' }}>
                    {hc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HABITKIT HABIT CARDS WITH 5 PRECISION CHECKS */}
      <div className="desktop-grid-equal">
        {disabledIds.some(id => habits.find(h => h.id === id)) && (
          <div className="card">
            <p className="eyebrow"><span className="n">habits</span> you removed</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {disabledIds.map(id => habits.find(h => h.id === id)).filter(Boolean).map((h) => (
                <button key={h!.id} className="ai-chip" onClick={() => toggleStepEnabled(h!.id)}>
                  + {h!.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeHabits.map((h) => {
          const isDone = !!dayState.habits[h.id];
          const isExpanded = expandedHabit === h.id;
          const heatmapDots = getHabitMiniHeatmap(h.id);

          return (
            <div key={h.id} className="card habitkit-card">
              <div className="habitkit-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, cursor: 'pointer' }} onClick={() => setExpandedHabit(isExpanded ? null : h.id)}>
                  <div
                    className="habitkit-icon-box"
                    style={{ background: h.bgTint, color: h.color }}
                  >
                    {h.icon}
                  </div>
                  <div>
                    <h3 className="habitkit-title">{h.name}</h3>
                    <p className="habitkit-sub">{h.sub}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button
                    className="btn sm"
                    style={{ fontSize: '10px', padding: '3px 7px', background: 'var(--surface3)' }}
                    onClick={() => setExpandedHabit(isExpanded ? null : h.id)}
                  >
                    {isExpanded ? '▲ Hide' : 'Checks'}
                  </button>
                  <button
                    className="btn sm"
                    title="Remove this habit from your list"
                    style={{ fontSize: '10px', padding: '3px 6px', background: 'transparent', color: 'var(--muted)', border: 0 }}
                    onClick={() => toggleStepEnabled(h.id)}
                  >
                    ✕
                  </button>
                  <button
                    className={`habitkit-check-btn ${isDone ? 'checked' : ''}`}
                    style={{ backgroundColor: isDone ? h.color : 'var(--surface3)' }}
                    onClick={() => toggleHabit(h.id)}
                    title="Toggle habit completion"
                  >
                    {isDone ? '✓' : '+'}
                  </button>
                </div>
              </div>

              {/* 5 GRANULAR TECHNIQUE CHECKS ACCORDION */}
              {isExpanded && (
                <div style={{ margin: '8px 0', padding: '8px 0', borderTop: '1px solid var(--line2)', borderBottom: '1px solid var(--line2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <p style={{ fontSize: '10.5px', color: 'var(--turmeric)', margin: '0 0 4px', fontWeight: 600 }}>
                    5 Precision Execution Checks:
                  </p>
                  {h.checks.map((chk, i) => (
                    <div key={i} style={{ fontSize: '11px', color: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: h.color, fontWeight: 700 }}>✓</span> {chk}
                    </div>
                  ))}
                </div>
              )}

              {/* HABITKIT MULTI-WEEK HEATMAP DOT GRID */}
              <div className="habitkit-heatmap-grid">
                {heatmapDots.map((dot, dIdx) => (
                  <div
                    key={dIdx}
                    title={`${dot.date}: ${dot.isDone ? 'Completed' : 'Missed'}`}
                    className="habitkit-dot"
                    style={{
                      backgroundColor: dot.isDone ? h.color : 'rgba(255, 255, 255, 0.05)',
                      opacity: dot.isDone ? 1 : 0.4
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
