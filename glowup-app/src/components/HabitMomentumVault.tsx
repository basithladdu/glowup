import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const HabitMomentumVault: React.FC = () => {
  const { state, selectedDate, setSelectedDate, bankEnergyDay, logReflection } = useGlowUpStore();
  const [reflectionInput, setReflectionInput] = useState('');
  const [showReflectionModal, setShowReflectionModal] = useState(false);

  const abstinence = state.abstinence || { start: '2026-08-04', bankedDays: 14, lastConfirm: '2026-08-18', reflections: [] };
  const bankedDays = abstinence.bankedDays || 14;
  const level = Math.min(5, Math.floor(bankedDays / 7) + 1);
  const totalXp = bankedDays * 100;

  // 12-Week Heatmap generation (84 days)
  const heatmapDays: Array<{ date: string; actionsCount: number; isSelected: boolean }> = [];
  const todayObj = new Date();
  
  for (let i = 83; i >= 0; i--) {
    const d = new Date(todayObj);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayData = state.days[dateStr];
    
    let actions = 0;
    if (dayData) {
      actions += (dayData.food || []).length;
      actions += (dayData.lifts || []).length;
      actions += Object.values(dayData.timeline || {}).filter(Boolean).length;
      actions += Object.values(dayData.habits || {}).filter(Boolean).length;
      actions += Object.values(dayData.grooming || {}).filter(Boolean).length;
    }
    heatmapDays.push({
      date: dateStr,
      actionsCount: actions,
      isSelected: dateStr === selectedDate
    });
  }

  const activeDaysLast30 = heatmapDays.slice(-30).filter(x => x.actionsCount > 0).length;
  const consistencyRate = Math.round((activeDaysLast30 / 30) * 100);

  const getHeatmapColor = (count: number) => {
    if (count === 0) return 'var(--surface2)';
    if (count <= 2) return '#4A3716';
    if (count <= 5) return '#755624';
    if (count <= 8) return '#B8812D';
    return '#E8A33D';
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionInput.trim()) return;
    logReflection(reflectionInput.trim());
    setReflectionInput('');
    setShowReflectionModal(false);
  };

  return (
    <div className="section-block">
      {/* CUMULATIVE MOMENTUM & ENERGY VAULT */}
      <div className="abstinence-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '26px' }}></span>
            <div>
              <h2 style={{ fontSize: '18px', margin: 0 }}>
                {bankedDays} Days Banked · Level {level} ({totalXp} XP)
              </h2>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--turmeric)' }}>
                Phase {level}: Neural Reward Baseline Restored
              </span>
            </div>
          </div>
          <span className="tag-badge tag-best">LVL {level} VAULT</span>
        </div>

        <p className="note" style={{ marginBottom: '12px' }}>
          Never resets to 0. Every single disciplined day is permanently stored into your neurochemical momentum bank.
        </p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn sage" style={{ flex: 2 }} onClick={() => bankEnergyDay()}>
            ✓ Bank Today's Energy (+100 XP)
          </button>
          <button
            className="btn sm"
            style={{ flex: 1, background: 'var(--surface3)' }}
            onClick={() => setShowReflectionModal(true)}
          >
            Recalibrate
          </button>
        </div>
      </div>


      {/* 12-WEEK NEVER-ZERO HABIT HEATMAP GRAPH */}
      <div className="card">
        <p className="eyebrow"><span className="n">activity</span> 12-week consistency matrix</p>
        <h2>Never-Zero Habit &amp; Activity Graph</h2>
        <p className="note" style={{ marginBottom: '10px' }}>
          Missing one day never wipes out your hard work. Tap any cell to view or log habits for that date.
        </p>

        <div className="heatmap-wrap">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridAutoFlow: 'column',
              gridTemplateRows: 'repeat(7, 1fr)',
              gap: '3px'
            }}
          >
            {heatmapDays.map((item, idx) => (
              <div
                key={idx}
                title={`${item.date}: ${item.actionsCount} actions logged`}
                onClick={() => setSelectedDate(item.date)}
                style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '2px',
                  background: getHeatmapColor(item.actionsCount),
                  border: item.isSelected ? '1.5px solid #FFF' : 'none',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </div>

        <div className="statline" style={{ marginTop: '12px' }}>
          <span className="statk">30-Day Rolling Consistency</span>
          <span className="statv" style={{ color: 'var(--sage)' }}>{consistencyRate}% Cumulative Discipline</span>
        </div>
        <div className="statline">
          <span className="statk">Total Lifetime Transmuted Days</span>
          <span className="statv" style={{ color: 'var(--turmeric)' }}>{bankedDays} Days Stored</span>
        </div>
      </div>

      {/* RECALIBRATION MODAL */}
      {showReflectionModal && (
        <div className="modal-backdrop">
          <div className="card modal-box">
            <h2 style={{ fontSize: '16px', margin: '0 0 6px' }}>Gentle Checkpoint / Reflection</h2>
            <p className="note" style={{ marginBottom: '10px' }}>
              Your {bankedDays} banked days and XP remain 100% safe. What micro-adjustment will you make tomorrow?
            </p>
            <form onSubmit={handleSaveReflection}>
              <textarea
                value={reflectionInput}
                onChange={(e) => setReflectionInput(e.target.value)}
                placeholder="e.g. Anchor 23:00 bedtime, drink 500ml cold water on wake..."
                rows={3}
                className="ai-textarea"
                required
              />
              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button type="submit" className="btn sage" style={{ flex: 1 }}>
                  Save &amp; Continue Forward
                </button>
                <button
                  type="button"
                  className="btn sm"
                  style={{ background: 'var(--surface3)' }}
                  onClick={() => setShowReflectionModal(false)}
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
