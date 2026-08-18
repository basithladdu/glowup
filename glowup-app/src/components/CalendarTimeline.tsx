import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import { ROT, METALLICADPA_PPL } from '../lib/constants';
import type { CalendarEvent } from '../types';

export const CalendarTimeline: React.FC = () => {
  const { selectedDate, setSelectedDate, state, getDayState, toggleTimelineEvent, addCalendarEvent } = useGlowUpStore();
  const dayState = getDayState();
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [showEventModal, setShowEventModal] = useState(false);

  // New Event State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventStart, setNewEventStart] = useState('08:00');
  const [newEventEnd, setNewEventEnd] = useState('09:00');
  const [newEventColor, setNewEventColor] = useState<'indigo' | 'sage' | 'turmeric' | 'rose' | 'vermilion'>('turmeric');

  const dateObj = new Date(selectedDate);
  const dow = dateObj.getDay();
  const rot = ROT[dow];

  // Workout title resolution
  const autoRoutineKey = dow === 0 ? 'rest' : dow === 1 ? 'pull_a' : dow === 2 ? 'push_a' : dow === 3 ? 'legs_a' : dow === 4 ? 'pull_a' : dow === 5 ? 'push_a' : 'legs_a';
  const customKey = dayState.workoutRoutine;
  const routine = METALLICADPA_PPL[customKey || autoRoutineKey] || METALLICADPA_PPL['pull_a'];

  const coreEvents = [
    { id: 'ev_sleep_am', startHour: 0, endHour: 7, time: '00:00 – 07:00', title: '😴 Deep Sleep Recovery Window', sub: 'Target 7.5h–8.5h uninterrupted sleep architecture. Nasal breathing.', color: 'indigo' as const, cta: '✓ Slept' },
    { id: 'ev_brush_am', startHour: 7, endHour: 7.17, time: '07:00 – 07:10', title: '🪥 AM Teeth Brushing & Tongue Scrape', sub: 'Scrape tongue 5x + brush 2 mins with fluoride paste.', color: 'sage' as const, cta: '✓ Brushed' },
    { id: 'ev_wake_water', startHour: 7.17, endHour: 7.25, time: '07:10 – 07:15', title: '💧 500ml Morning Hydration Flush', sub: 'Rehydrates cells, kickstarts motility, flushes metabolic waste.', color: 'blue' as const, cta: '✓ Drank 500ml' },
    { id: 'ev_am_skin', startHour: 7.58, endHour: 7.83, time: '07:35 – 07:50', title: '🧴 AM Skincare Shield + SPF 50', sub: 'AHA facewash → Vit C → B12 → Lakmé SPF 50 on Face, Neck, Arms & Hands.', color: 'rose' as const, cta: '✓ Applied SPF' },
    { id: 'ev_creatine', startHour: 8.25, endHour: 8.33, time: '08:15 – 08:20', title: '⚡ Creatine Monohydrate 5g', sub: 'ATP energy for compound lifts, cognitive cellular hydration.', color: 'turmeric' as const, cta: '✓ Took Creatine' },
    { id: 'ev_shopping', startHour: 11, endHour: 12.5, time: '11:00 – 12:30', title: '🛒 Nutrition & Supplies Shopping', sub: 'Chicken breast, eggs, staples, socks & gym gear replenishment.', color: 'sage' as const, cta: '✓ Shopped' },
    { id: 'ev_gym', startHour: 17.5, endHour: 18.75, time: '17:30 – 18:45', title: `🏋️ ${routine.name}`, sub: routine.desc, color: 'turmeric' as const, cta: '✓ Log Workout' },
    { id: 'ev_whey', startHour: 18.75, endHour: 19, time: '18:45 – 19:00', title: '🥛 Post-Workout Nakpro Whey Isolate', sub: '1 Scoop Nakpro Whey Isolate + 250ml Buffalo Milk (32g Protein).', color: 'sage' as const, cta: '✓ Drank Whey' },
    { id: 'ev_pm_groom', startHour: 21.5, endHour: 22, time: '21:30 – 22:00', title: `💅 PM Skincare: ${rot.short}`, sub: `${rot.active} on face. ${rot.extra}.`, color: 'rose' as const, cta: '✓ Done PM' },
    { id: 'ev_sleep_pm', startHour: 23, endHour: 24, time: '23:00 – 00:00', title: '😴 Deep Sleep Mode Active', sub: 'Room pitch dark & cool. Phone outside bedroom.', color: 'indigo' as const, cta: '🛌 Slept' }
  ];

  // Current time position
  const now = new Date();
  const currentHourDecimal = now.getHours() + now.getMinutes() / 60;
  const currentTopPx = currentHourDecimal * 60;

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    const [sh, sm] = newEventStart.split(':').map(Number);
    const [eh, em] = newEventEnd.split(':').map(Number);
    const sHour = sh + (sm || 0) / 60;
    const eHour = Math.max(sHour + 0.5, eh + (em || 0) / 60);

    const eventItem: CalendarEvent = {
      id: 'cev_' + Date.now(),
      title: newEventTitle.trim(),
      startHour: sHour,
      endHour: eHour,
      color: newEventColor,
      category: 'habit',
      date: selectedDate
    };

    addCalendarEvent(eventItem);
    setNewEventTitle('');
    setShowEventModal(false);
  };

  // Week View calculation
  const getWeekDays = () => {
    const curr = new Date(selectedDate);
    const first = curr.getDate() - curr.getDay();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const next = new Date(curr.setDate(first + i));
      days.push({
        dateStr: next.toISOString().slice(0, 10),
        dayName: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        dayNum: next.getDate(),
        isToday: next.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10),
        isSelected: next.toISOString().slice(0, 10) === selectedDate
      });
    }
    return days;
  };

  // Month View calculation
  const getMonthDays = () => {
    const curr = new Date(selectedDate);
    const year = curr.getFullYear();
    const month = curr.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ dayNum: null, dateStr: '' });
    }
    for (let i = 1; i <= totalDays; i++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        dayNum: i,
        dateStr: dStr,
        isToday: dStr === new Date().toISOString().slice(0, 10),
        isSelected: dStr === selectedDate
      });
    }
    return days;
  };

  return (
    <div className="section-block">
      {/* GOOGLE CALENDAR HEADER TOOLBAR */}
      <div className="gcal-toolbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '24px' }}>📅</span>
            <div>
              <h2 style={{ fontSize: '17px', margin: 0, color: 'var(--paper)', fontFamily: 'Cinzel, serif' }}>Google Calendar</h2>
              <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>Time-Blocked Circadian Protocol</span>
            </div>
          </div>
          <button className="gcal-btn-today" onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}>
            Today
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="gcal-view-selector">
            <button className={`gcal-view-btn ${viewMode === 'day' ? 'active' : ''}`} onClick={() => setViewMode('day')}>
              Day
            </button>
            <button className={`gcal-view-btn ${viewMode === 'week' ? 'active' : ''}`} onClick={() => setViewMode('week')}>
              Week
            </button>
            <button className={`gcal-view-btn ${viewMode === 'month' ? 'active' : ''}`} onClick={() => setViewMode('month')}>
              Month
            </button>
          </div>

          <button className="btn primary sm" onClick={() => setShowEventModal(true)}>
            + Add Event
          </button>
        </div>
      </div>

      {/* VIEW: 24-HOUR DAY TIME-GRID (REAL GOOGLE CALENDAR GRID) */}
      {viewMode === 'day' && (
        <div className="desktop-grid-2">
          {/* LEFT: 24-HOUR TIMETABLE */}
          <div className="card gcal-day-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
              <div style={{ fontWeight: 700, fontSize: '13px', color: 'var(--turmeric)' }}>
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dow]}, {dateObj.getDate()} {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][dateObj.getMonth()]}
              </div>
              <span className="tag-badge tag-best">24H TIMETABLE</span>
            </div>

            <div className="gcal-grid-body">
              {/* Hour Lines 00:00 to 23:00 */}
              {Array.from({ length: 24 }).map((_, h) => (
                <div key={h} className="gcal-hour-row" style={{ top: `${h * 60}px` }}>
                  <span className="gcal-hour-label">{String(h).padStart(2, '0')}:00</span>
                  <div className="gcal-hour-line" />
                </div>
              ))}

              {/* Current Time Red Indicator Line */}
              <div className="gcal-now-line" style={{ top: `${currentTopPx}px` }}>
                <span className="gcal-now-dot" />
              </div>

              {/* Event Time Blocks */}
              {coreEvents.map((ev) => {
                const top = ev.startHour * 60;
                const height = Math.max(32, (ev.endHour - ev.startHour) * 60 - 4);
                const isDone = !!dayState.timeline[ev.id];

                return (
                  <div
                    key={ev.id}
                    className={`gcal-event-block ${ev.color} ${isDone ? 'done' : ''}`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                    onClick={() => toggleTimelineEvent(ev.id)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="gcal-event-title">{ev.title}</div>
                        <div className="gcal-event-time">{ev.time}</div>
                      </div>
                      <button className="gcal-check-btn" onClick={(e) => { e.stopPropagation(); toggleTimelineEvent(ev.id); }}>
                        {isDone ? '✓' : '○'}
                      </button>
                    </div>
                    {height > 50 && <div className="gcal-event-sub">{ev.sub}</div>}
                  </div>
                );
              })}

              {/* Custom User Events */}
              {(state.customEvents || []).filter(e => !e.date || e.date === selectedDate).map((ev) => {
                const top = ev.startHour * 60;
                const height = Math.max(32, (ev.endHour - ev.startHour) * 60 - 4);

                return (
                  <div
                    key={ev.id}
                    className={`gcal-event-block ${ev.color}`}
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <div className="gcal-event-title">{ev.title}</div>
                    <div className="gcal-event-time">{Math.floor(ev.startHour)}:00 – {Math.floor(ev.endHour)}:00</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: ACTIVE PROTOCOL SIDEBAR */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div className="card">
              <p className="eyebrow"><span className="n">training</span> today's workout split</p>
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
      )}

      {/* VIEW: 7-DAY WEEK VIEW (GOOGLE CALENDAR 7 COLUMNS) */}
      {viewMode === 'week' && (
        <div className="card gcal-week-card">
          <div className="gcal-week-header">
            {getWeekDays().map((d, i) => (
              <div
                key={i}
                className={`gcal-week-head-col ${d.isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedDate(d.dateStr)}
              >
                <span className="gcal-week-dayname">{d.dayName}</span>
                <span className={`gcal-week-daynum ${d.isToday ? 'today' : ''}`}>{d.dayNum}</span>
              </div>
            ))}
          </div>

          <div className="gcal-week-grid">
            {getWeekDays().map((d, i) => {
              const dowIdx = new Date(d.dateStr).getDay();
              const autoKey = dowIdx === 0 ? 'rest' : dowIdx === 1 ? 'pull_a' : dowIdx === 2 ? 'push_a' : dowIdx === 3 ? 'legs_a' : dowIdx === 4 ? 'pull_a' : dowIdx === 5 ? 'push_a' : 'legs_a';
              const wRot = ROT[dowIdx];
              const wRoutine = METALLICADPA_PPL[autoKey] || METALLICADPA_PPL['pull_a'];

              return (
                <div key={i} className="gcal-week-col" onClick={() => setSelectedDate(d.dateStr)}>
                  <div className="gcal-week-chip sleep">😴 00:00 Sleep</div>
                  <div className="gcal-week-chip water">💧 07:10 500ml</div>
                  <div className="gcal-week-chip skin">🧴 07:35 SPF 50</div>
                  <div className="gcal-week-chip gym">🏋️ 17:30 {wRoutine.name.slice(0, 14)}</div>
                  <div className="gcal-week-chip food">🥛 18:45 Whey 32g</div>
                  <div className="gcal-week-chip derm">💅 21:30 {wRot.short}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: 30-DAY MONTH VIEW (GOOGLE CALENDAR 7x5 GRID) */}
      {viewMode === 'month' && (
        <div className="card gcal-month-card">
          <div className="gcal-month-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((name, i) => (
              <div key={i} className="gcal-month-head-cell">{name}</div>
            ))}
          </div>

          <div className="gcal-month-grid">
            {getMonthDays().map((d, i) => {
              if (!d.dayNum) return <div key={i} className="gcal-month-cell empty" />;
              const dayData = state.days[d.dateStr];
              const hasLifts = (dayData?.lifts || []).length > 0;
              const hasFood = (dayData?.food || []).length > 0;

              return (
                <div
                  key={i}
                  className={`gcal-month-cell ${d.isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedDate(d.dateStr)}
                >
                  <span className={`gcal-month-num ${d.isToday ? 'today' : ''}`}>{d.dayNum}</span>
                  <div className="gcal-month-pills">
                    {hasFood && <span className="gcal-mini-pill food">🥩 Macros</span>}
                    {hasLifts && <span className="gcal-mini-pill gym">🏋️ Lifted</span>}
                    <span className="gcal-mini-pill skin">✨ Protocol</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD CUSTOM EVENT MODAL */}
      {showEventModal && (
        <div className="modal-backdrop">
          <div className="card modal-box">
            <h2 style={{ fontSize: '16px', margin: '0 0 6px' }}>📅 Create Google Calendar Event</h2>
            <p className="note" style={{ marginBottom: '12px' }}>
              Add custom time-blocked tasks to your schedule for {selectedDate}.
            </p>

            <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label className="fl">Event Title</label>
                <input
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g. Grocery Run, 45m Coding, Mobility..."
                  required
                />
              </div>

              <div className="frow">
                <div>
                  <label className="fl">Start Time</label>
                  <input type="time" value={newEventStart} onChange={(e) => setNewEventStart(e.target.value)} required />
                </div>
                <div>
                  <label className="fl">End Time</label>
                  <input type="time" value={newEventEnd} onChange={(e) => setNewEventEnd(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="fl">Color / Category</label>
                <select value={newEventColor} onChange={(e: any) => setNewEventColor(e.target.value)}>
                  <option value="turmeric">Gold (Gym / Focus)</option>
                  <option value="sage">Sage (Nutrition / Health)</option>
                  <option value="indigo">Indigo (Sleep / Rest)</option>
                  <option value="rose">Rose (Skincare / Grooming)</option>
                  <option value="blue">Blue (Hydration / Routine)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" className="btn primary" style={{ flex: 1 }}>
                  ✓ Create Event
                </button>
                <button
                  type="button"
                  className="btn sm"
                  style={{ background: 'var(--surface3)' }}
                  onClick={() => setShowEventModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
