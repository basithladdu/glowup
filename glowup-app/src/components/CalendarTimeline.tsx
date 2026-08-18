import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { ROT, METALLICADPA_PPL } from '../lib/constants';

export const CalendarTimeline: React.FC = () => {
  const { selectedDate, getDayState, toggleTimelineEvent } = useGlowUpStore();
  const dayState = getDayState();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');

  const dateObj = new Date(selectedDate);
  const dow = dateObj.getDay();
  const rot = ROT[dow];

  // Workout title resolution
  const autoRoutineKey = dow === 0 ? 'rest' : dow === 1 ? 'pull_a' : dow === 2 ? 'push_a' : dow === 3 ? 'legs_a' : dow === 4 ? 'pull_a' : dow === 5 ? 'push_a' : 'legs_a';
  const customKey = dayState.workoutRoutine;
  const routine = METALLICADPA_PPL[customKey || autoRoutineKey] || METALLICADPA_PPL['pull_a'];

  const scheduleEvents = [
    { id: 'ev_sleep_am', time: '00:00 – 07:00', title: '😴 Deep Sleep Recovery Window', sub: 'Target 7.5h–8.5h uninterrupted sleep architecture. Nasal breathing.', cta: '✓ Slept' },
    { id: 'ev_brush_am', time: '07:00 – 07:10', title: '🪥 AM Teeth Brushing & Tongue Scrape', sub: 'Scrape tongue 5x + brush 2 mins with fluoride paste. Eliminates morning odor.', cta: '✓ Brushed' },
    { id: 'ev_wake_water', time: '07:10 – 07:15', title: '💧 500ml Morning Hydration Flush', sub: 'Rehydrates cells, kickstarts motility, flushes metabolic waste.', cta: '✓ Drank 500ml' },
    { id: 'ev_am_skin', time: '07:35 – 07:50', title: '🧴 AM Skincare Shield + SPF 50', sub: 'AHA facewash → Vit C → B12 → Lakmé SPF 50 on Face, Neck, Arms & Hands.', cta: '✓ Applied SPF' },
    { id: 'ev_creatine', time: '08:15 – 08:20', title: '⚡ Creatine Monohydrate 5g', sub: 'ATP energy for compound lifts, cognitive cellular hydration.', cta: '✓ Took Creatine' },
    { id: 'ev_gym', time: '17:30 – 18:45', title: `🏋️ ${routine.name}`, sub: routine.desc, cta: '✓ Log Workout' },
    { id: 'ev_whey', time: '18:45 – 19:00', title: '🥛 Post-Workout Nakpro Whey Isolate', sub: '1 Scoop Nakpro Whey Isolate in cold water (24g Protein).', cta: '✓ Drank Whey' },
    { id: 'ev_pm_groom', time: '21:30 – 22:00', title: `💅 PM Skincare: ${rot.short}`, sub: `${rot.active} on face. ${rot.extra}.`, cta: '✓ Done PM' },
    { id: 'ev_sleep_pm', time: '23:00 – 07:00', title: '😴 Deep Sleep Mode Active', sub: 'Room pitch dark & cool. Phone outside bedroom.', cta: '🛌 Slept' }
  ];

  return (
    <div className="section-block">
      {/* MODE SWITCHER */}
      <div className="cal-mode-bar">
        <button
          className={`cal-mode-btn ${viewMode === 'day' ? 'active' : ''}`}
          onClick={() => setViewMode('day')}
        >
          ⏱️ 24h Day Grid
        </button>
        <button
          className={`cal-mode-btn ${viewMode === 'week' ? 'active' : ''}`}
          onClick={() => setViewMode('week')}
        >
          🗓️ 7-Day Week
        </button>
        <button
          className={`cal-mode-btn ${viewMode === 'month' ? 'active' : ''}`}
          onClick={() => setViewMode('month')}
        >
          📆 30-Day Month
        </button>
      </div>

      <div className="desktop-grid-2">
        {/* 24-HOUR DAY TIME-BLOCKED SCHEDULE */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p className="eyebrow"><span className="n">gcal</span> master time-blocked schedule</p>
              <h2 style={{ fontSize: '16px', margin: 0 }}>24-Hour Master Google Calendar</h2>
            </div>
            <span className="tag-badge tag-best">TIME-BLOCKED</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scheduleEvents.map((ev) => {
              const isDone = !!dayState.timeline[ev.id];
              return (
                <div key={ev.id} className={`task-item ${isDone ? 'done' : ''}`}>
                  <div className="task-left">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span className="task-badge">{ev.time}</span>
                        <span className="task-title">{ev.title}</span>
                      </div>
                      <div className="task-sub">{ev.sub}</div>
                    </div>
                  </div>

                  <button
                    className="task-btn"
                    onClick={() => toggleTimelineEvent(ev.id)}
                  >
                    {isDone ? '✓ Completed' : ev.cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* DESKTOP SIDEBAR PROTOCOL SUMMARY */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card">
            <p className="eyebrow"><span className="n">today</span> active training split</p>
            <h2 style={{ fontSize: '16px', margin: '0 0 4px', color: 'var(--turmeric)' }}>{routine.name}</h2>
            <p className="note" style={{ marginBottom: '10px' }}>{routine.desc}</p>
            <div className="statline">
              <span className="statk">Intensity Badge</span>
              <span className="statv" style={{ color: 'var(--sage)' }}>{routine.badge}</span>
            </div>
            <div className="statline">
              <span className="statk">Frequency</span>
              <span className="statv" style={{ color: 'var(--turmeric)' }}>{routine.freq}</span>
            </div>
          </div>

          <div className="card">
            <p className="eyebrow"><span className="n">pm</span> active derm protocol</p>
            <h2 style={{ fontSize: '16px', margin: '0 0 4px', color: 'var(--rose)' }}>{rot.short}</h2>
            <p className="note" style={{ marginBottom: '8px' }}>{rot.active}</p>
            <div style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--surface2)', padding: '8px', borderRadius: '6px' }}>
              💡 {rot.extra}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
