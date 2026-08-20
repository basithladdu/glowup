import React, { useState } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';
import type { GoalMilestone } from '../types';

export const GoalsMatrix: React.FC = () => {
  const { state, toggleGoal, addGoal, deleteGoal } = useGlowUpStore();
  const [filter, setFilter] = useState<'all' | 'gym' | 'skin' | 'grooming' | 'health'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'gym' | 'skin' | 'grooming' | 'health'>('gym');
  const [newFreq, setNewFreq] = useState('Daily');
  const [newDate, setNewDate] = useState('2026-09-30');

  const goals = state.milestones || [];
  const gymGoals = goals.filter(g => g.category === 'gym');
  const skinGoals = goals.filter(g => g.category === 'skin');
  const groomingGoals = goals.filter(g => g.category === 'grooming');
  const healthGoals = goals.filter(g => g.category === 'health');

  const filteredGoals = filter === 'all' ? goals : goals.filter(g => g.category === filter);

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newGoalItem: GoalMilestone = {
      id: 'g_' + Date.now(),
      category: newCategory,
      title: newTitle.trim(),
      desc: newTitle.trim(),
      freq: newFreq,
      date: newDate || new Date().toISOString().slice(0, 10),
      done: false
    };
    addGoal(newGoalItem);
    setNewTitle('');
  };

  const getCatLabel = (cat: string) => {
    switch (cat) {
      case 'gym': return { label: '🏋️ GYM', cls: 'cat-pill gym' };
      case 'skin': return { label: '✨ SKIN', cls: 'cat-pill skin' };
      case 'grooming': return { label: '💈 GROOMING', cls: 'cat-pill grooming' };
      case 'health': return { label: '🧬 HEALTH', cls: 'cat-pill health' };
      default: return { label: '🎯 GOAL', cls: 'cat-pill' };
    }
  };

  return (
    <div className="section-block">
      {/* CATEGORY SUMMARY METRIC CARDS */}
      <div className="goal-metrics-summary">
        <div className="goal-metric-box" style={{ borderLeft: '3px solid var(--turmeric)' }}>
          <div className="gm-title">
            <span>🏋️ GYM &amp; PHYSIQUE</span>
            <span style={{ color: 'var(--turmeric)' }}>{gymGoals.filter(g => g.done).length}/{gymGoals.length}</span>
          </div>
          <div className="gm-val">
            {Math.round((gymGoals.filter(g => g.done).length / Math.max(1, gymGoals.length)) * 100)}%{' '}
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>Locked In</span>
          </div>
        </div>

        <div className="goal-metric-box" style={{ borderLeft: '3px solid var(--rose)' }}>
          <div className="gm-title">
            <span>✨ SKIN &amp; DERM</span>
            <span style={{ color: 'var(--rose)' }}>{skinGoals.filter(g => g.done).length}/{skinGoals.length}</span>
          </div>
          <div className="gm-val">
            {Math.round((skinGoals.filter(g => g.done).length / Math.max(1, skinGoals.length)) * 100)}%{' '}
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>Compliant</span>
          </div>
        </div>

        <div className="goal-metric-box" style={{ borderLeft: '3px solid var(--indigo)' }}>
          <div className="gm-title">
            <span>💈 GROOMING &amp; HAIR</span>
            <span style={{ color: 'var(--indigo)' }}>{groomingGoals.filter(g => g.done).length}/{groomingGoals.length}</span>
          </div>
          <div className="gm-val">
            {Math.round((groomingGoals.filter(g => g.done).length / Math.max(1, groomingGoals.length)) * 100)}%{' '}
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>Refined</span>
          </div>
        </div>

        <div className="goal-metric-box" style={{ borderLeft: '3px solid var(--sage)' }}>
          <div className="gm-title">
            <span>🧬 HEALTH &amp; SLEEP</span>
            <span style={{ color: 'var(--sage)' }}>{healthGoals.filter(g => g.done).length}/{healthGoals.length}</span>
          </div>
          <div className="gm-val">
            {Math.round((healthGoals.filter(g => g.done).length / Math.max(1, healthGoals.length)) * 100)}%{' '}
            <span style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 400 }}>Optimized</span>
          </div>
        </div>
      </div>

      {/* 5 PRECISION MILESTONE EXECUTION CHECKS */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">standards</span> 5-point milestone verification</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--turmeric)' }}>🎯 5 Precision Milestone Execution Standards</h3>
          </div>
          <span className="tag-badge tag-best">Outcome Protocol</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', margin: '8px 0 12px' }}>
          {[
            'Binary verification criteria: Clear mathematical pass/fail (e.g. 72.0 kg scale or 100kg lift)',
            'Anchor to a daily recurring micro-habit (e.g. 170g protein floor anchors the 72kg cut)',
            'Realistic time-bounding with incremental milestone phases (Sep ➔ Nov ➔ Dec ➔ Feb)',
            'Automated frictionless progress logging into daily timeline without cognitive friction',
            'Milestone celebration trigger (confetti & dopamine sound chime upon lock-in)'
          ].map((chk, i) => (
            <div key={i} style={{ fontSize: '11px', color: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: 'var(--turmeric)', fontWeight: 700 }}>✓</span> {chk}
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="goal-cat-bar">
        <button className={`goal-cat-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          All Goals <span className="badge-count">{goals.length}</span>
        </button>
        <button className={`goal-cat-btn ${filter === 'gym' ? 'active' : ''}`} onClick={() => setFilter('gym')}>
          🏋️ Gym <span className="badge-count">{gymGoals.length}</span>
        </button>
        <button className={`goal-cat-btn ${filter === 'skin' ? 'active' : ''}`} onClick={() => setFilter('skin')}>
          ✨ Skin <span className="badge-count">{skinGoals.length}</span>
        </button>
        <button className={`goal-cat-btn ${filter === 'grooming' ? 'active' : ''}`} onClick={() => setFilter('grooming')}>
          💈 Grooming <span className="badge-count">{groomingGoals.length}</span>
        </button>
        <button className={`goal-cat-btn ${filter === 'health' ? 'active' : ''}`} onClick={() => setFilter('health')}>
          🧬 Health <span className="badge-count">{healthGoals.length}</span>
        </button>
      </div>

      {/* GOAL CARDS LIST */}
      <div className="desktop-grid-equal">
        {filteredGoals.map((m) => {
          const badge = getCatLabel(m.category);
          return (
            <div key={m.id} className={`goal-item-card ${m.done ? 'done' : ''}`}>
              <div className="goal-item-header">
                <div className="goal-tag-group">
                  <span className={badge.cls}>{badge.label}</span>
                  <span className="freq-pill">⏳ {m.freq || 'Daily'}</span>
                </div>
                <span className="goal-item-date">{m.date ? 'Target: ' + m.date : 'Ongoing Target'}</span>
              </div>

              <div>
                <div className="goal-item-title">{m.title}</div>
                {m.desc && <div className="goal-item-desc">{m.desc}</div>}
              </div>

              <div className="goal-item-footer">
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: m.done ? 'var(--sage)' : 'var(--turmeric)', fontWeight: 700 }}>
                  {m.done ? '✓ COMPLETED' : '● ACTIVE TARGET'}
                </span>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {m.id.startsWith('g_') && !['g_weight', 'g_vtaper', 'g_peel'].includes(m.id) && (
                    <button
                      onClick={() => deleteGoal(m.id)}
                      style={{ background: 'none', border: 0, color: 'var(--muted)', cursor: 'pointer', fontSize: '16px', padding: '0 4px' }}
                      title="Delete goal"
                    >
                      ×
                    </button>
                  )}
                  <button className="goal-toggle-btn" onClick={() => toggleGoal(m.id)}>
                    {m.done ? '✓ Completed' : 'Mark Done'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD NEW GOAL FORM */}
      <div className="card" style={{ marginTop: '16px' }}>
        <p className="eyebrow"><span className="n">+</span> create custom target goal</p>
        <form onSubmit={handleAddGoal} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label className="fl">Goal Title / Metric Target</label>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. 100kg Deadlift 5x5, 120cm Clavicle Width..."
              required
            />
          </div>

          <div className="frow">
            <div>
              <label className="fl">Category</label>
              <select value={newCategory} onChange={(e: any) => setNewCategory(e.target.value)}>
                <option value="gym">🏋️ Gym &amp; Physique</option>
                <option value="skin">✨ Skin &amp; Derm</option>
                <option value="grooming">💈 Grooming &amp; Hair</option>
                <option value="health">🧬 Health &amp; Sleep</option>
              </select>
            </div>
            <div>
              <label className="fl">Execution Frequency</label>
              <select value={newFreq} onChange={(e) => setNewFreq(e.target.value)}>
                <option value="Daily">Daily</option>
                <option value="2x / Week">2x / Week</option>
                <option value="3x / Week">3x / Week</option>
                <option value="6x / Week">6x / Week</option>
                <option value="Weekly">Weekly</option>
                <option value="Every 14 Days">Every 14 Days</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label className="fl">Target Date</label>
              <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} />
            </div>
          </div>

          <button type="submit" className="btn primary" style={{ width: '100%' }}>
            + Add Target Goal to Matrix
          </button>
        </form>
      </div>
    </div>
  );
};
