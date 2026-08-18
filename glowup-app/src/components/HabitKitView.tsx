import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

interface HabitDef {
  id: string;
  name: string;
  sub: string;
  icon: string;
  color: string; // hex
  bgTint: string;
}

export const HabitKitView: React.FC = () => {
  const { state, selectedDate, setSelectedDate, toggleHabit, getDayState } = useGlowUpStore();
  const dayState = getDayState();

  const habits: HabitDef[] = [
    { id: 'h_sunlight', name: 'Walk 7,000 steps & Morning Sunlight', sub: 'Cortisol spike, circadian anchor & fat burn', icon: '🚶', color: '#10B981', bgTint: 'rgba(16, 185, 129, 0.12)' },
    { id: 'h_tongue', name: 'Copper Tongue Scraping & Dental Hygiene', sub: 'Eliminates morning oral sulfur compounds', icon: '🪥', color: '#06B6D4', bgTint: 'rgba(6, 182, 212, 0.12)' },
    { id: 'h_spf', name: 'SPF 50 Shield (Face, Neck, Arms & Hands)', sub: 'Blocks 98% UVA/UVB photo-aging & pigmentation', icon: '🧴', color: '#F43F5E', bgTint: 'rgba(244, 63, 94, 0.12)' },
    { id: 'h_creatine', name: '5g Creatine Monohydrate & 500ml Water', sub: 'Cellular ATP output & cognitive hydration', icon: '⚡', color: '#F59E0B', bgTint: 'rgba(245, 158, 11, 0.12)' },
    { id: 'h_protein', name: '170g Protein Floor & 50/50 Jaw Chewing', sub: 'Muscle synthesis & symmetrical masseter jaw development', icon: '🥩', color: '#8B5CF6', bgTint: 'rgba(139, 92, 246, 0.12)' },
    { id: 'h_posture', name: 'Spine Decompression & Dead Hangs', sub: 'Opens chest, improves posture & reclaims 1–3cm height', icon: '🧍', color: '#EAB308', bgTint: 'rgba(234, 179, 8, 0.12)' },
    { id: 'h_minox', name: 'Minoxidil 5% on Temples & Beard', sub: 'Nightly follicle stimulation for hairline & density', icon: '💧', color: '#3B82F6', bgTint: 'rgba(59, 130, 246, 0.12)' },
    { id: 'h_mouthtape', name: 'Nasal Mouth Tape for Deep Sleep', sub: '100% nasal breathing, raises nitric oxide & prevents snoring', icon: '🌙', color: '#6366F1', bgTint: 'rgba(99, 102, 241, 0.12)' }
  ];

  // Past 7 days day-picker pill bar (Matching Screenshot 1)
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

  // Generate 28-day historical mini dot heatmap for a specific habit
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

  return (
    <div className="section-block">
      {/* HABITKIT HEADER (MATCHING SCREENSHOT) */}
      <div className="card habitkit-header-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>⚡</span>
            <div>
              <h2 style={{ fontSize: '18px', margin: 0, letterSpacing: '-0.02em' }}>
                Habit<span style={{ color: '#8B5CF6' }}>Kit</span> Matrix
              </h2>
              <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                Continuous Momentum Grid
              </span>
            </div>
          </div>
          <span className="tag-badge tag-best">NEVER-ZERO</span>
        </div>

        {/* 7-DAY CIRCULAR DATE PICKER BAR (FROM USER SCREENSHOT 1) */}
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

      {/* HABITKIT HABIT CARDS (MATCHING SCREENSHOT 2 & 3) */}
      <div className="desktop-grid-equal">
        {habits.map((h) => {
          const isDone = !!dayState.habits[h.id];
          const heatmapDots = getHabitMiniHeatmap(h.id);

          return (
            <div key={h.id} className="card habitkit-card">
              <div className="habitkit-card-top">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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

                <button
                  className={`habitkit-check-btn ${isDone ? 'checked' : ''}`}
                  style={{ backgroundColor: isDone ? h.color : 'var(--surface3)' }}
                  onClick={() => toggleHabit(h.id)}
                  title="Toggle habit completion"
                >
                  {isDone ? '✓' : '+'}
                </button>
              </div>

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
