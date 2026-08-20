import React, { useState } from 'react';
import { usePokeItems } from '../lib/usePoke';

export type TabType = 
  | 'calendar' 
  | 'today' 
  | 'habitkit'
  | 'food' 
  | 'adhd'
  | 'lifts' 
  | 'goals' 
  | 'momentum' 
  | 'shopping'
  | 'howto'
  | 'skin' 
  | 'grooming' 
  | 'symmetry'
  | 'style'
  | 'protein'
  | 'body' 
  | 'content' 
  | 'sleep'
  | 'sync';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [mode, setMode] = useState<'calm' | 'all'>(() => {
    return (localStorage.getItem('glowup_nav_mode') as 'calm' | 'all') || 'calm';
  });

  const handleToggleMode = (newMode: 'calm' | 'all') => {
    setMode(newMode);
    localStorage.setItem('glowup_nav_mode', newMode);
  };

  // Calm essential tabs (Zero Overwhelm)
  const essentialTabs: Array<{ id: TabType; label: string }> = [
    { id: 'calendar', label: '📅 24h Calendar' },
    { id: 'adhd', label: '🧠 ADHD Focus' },
    { id: 'habitkit', label: '⚡ HabitKit' },
    { id: 'food', label: '🥪 Food & AI' },
    { id: 'shopping', label: '🛒 To Buy' },
    { id: 'lifts', label: '🏋️ Lifts' },
    { id: 'body', label: '📊 88kg Cut' }
  ];

  // Full ecosystem tabs
  const allTabs: Array<{ id: TabType; label: string }> = [
    { id: 'calendar', label: '📅 24h Google Calendar' },
    { id: 'adhd', label: '🧠 ADHD Hyper-Focus' },
    { id: 'today', label: 'Today & Flow ⚡' },
    { id: 'habitkit', label: '⚡ HabitKit Grid' },
    { id: 'food', label: '🥪 Food & AI Macros' },
    { id: 'shopping', label: '🛒 To Buy & Staples' },
    { id: 'lifts', label: '🏋️ Lifts & Workouts' },
    { id: 'goals', label: '🎯 Goals Matrix' },
    { id: 'momentum', label: '🔥 Energy Vault' },
    { id: 'howto', label: '📚 How-To Protocols' },
    { id: 'skin', label: 'Skin & Peel 💅' },
    { id: 'grooming', label: 'Grooming & Hair 💈' },
    { id: 'symmetry', label: 'Symmetry & Jaw 🪞' },
    { id: 'style', label: 'Style & Scent 👔' },
    { id: 'protein', label: 'Protein ₹/g Bank' },
    { id: 'body', label: 'Body & 88kg Cut 📊' },
    { id: 'content', label: 'Content ⚡' },
    { id: 'sleep', label: 'Sleep 🌙' },
    { id: 'sync', label: 'AI & Sync ☁️' },
  ];

  const visibleTabs = mode === 'calm' ? essentialTabs : allTabs;
  const pokeCount = usePokeItems().length;

  return (
    <nav className="nav-strip" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <span style={{ fontSize: '10px', color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
          {mode === 'calm' ? '🧘 CALM ESSENTIALS MODE' : '✨ FULL MATRIX VIEW'}
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className={`tab-btn ${mode === 'calm' ? 'active' : ''}`}
            style={{ fontSize: '9.5px', padding: '2px 8px', borderRadius: '4px' }}
            onClick={() => handleToggleMode('calm')}
          >
            🧘 Essentials
          </button>
          <button
            className={`tab-btn ${mode === 'all' ? 'active' : ''}`}
            style={{ fontSize: '9.5px', padding: '2px 8px', borderRadius: '4px' }}
            onClick={() => handleToggleMode('all')}
          >
            ✨ All Tools
          </button>
        </div>
      </div>

      <div className="tabs-list" role="tablist">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
            {t.id === 'adhd' && pokeCount > 0 && (
              <span
                style={{
                  marginLeft: '5px',
                  background: 'var(--rose)',
                  color: '#1A1206',
                  borderRadius: '9px',
                  padding: '0 5px',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  fontFamily: 'JetBrains Mono, monospace'
                }}
              >
                {pokeCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
