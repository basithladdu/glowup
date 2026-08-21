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

  const essentialTabs: Array<{ id: TabType; label: string }> = [
    { id: 'adhd', label: 'Today' },
    { id: 'calendar', label: 'Schedule' },
    { id: 'habitkit', label: 'Habits' },
    { id: 'food', label: 'Food' },
    { id: 'lifts', label: 'Training' },
    { id: 'shopping', label: 'Buy' },
  ];

  const allTabs: Array<{ id: TabType; label: string }> = [
    { id: 'adhd', label: 'Today' },
    { id: 'calendar', label: 'Schedule' },
    { id: 'habitkit', label: 'Habits' },
    { id: 'food', label: 'Food' },
    { id: 'lifts', label: 'Training' },
    { id: 'shopping', label: 'Buy' },
    { id: 'skin', label: 'Skin' },
    { id: 'grooming', label: 'Hair & Beard' },
    { id: 'body', label: 'Body' },
    { id: 'sleep', label: 'Sleep' },
    { id: 'goals', label: 'Goals' },
    { id: 'momentum', label: 'Streaks' },
    { id: 'protein', label: 'Protein Costs' },
    { id: 'symmetry', label: 'Posture' },
    { id: 'style', label: 'Style' },
    { id: 'content', label: 'Content' },
    { id: 'today', label: 'Flow' },
    { id: 'howto', label: 'Guides' },
    { id: 'sync', label: 'Data' },
  ];

  const visibleTabs = mode === 'calm' ? essentialTabs : allTabs;
  const pokeCount = usePokeItems().length;

  return (
    <nav className="nav-strip" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
        <span style={{ fontSize: '10.5px', color: 'var(--muted)' }} />
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            className={`tab-btn ${mode === 'calm' ? 'active' : ''}`}
            style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '4px' }}
            onClick={() => handleToggleMode('calm')}
          >
            Essentials
          </button>
          <button
            className={`tab-btn ${mode === 'all' ? 'active' : ''}`}
            style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '4px' }}
            onClick={() => handleToggleMode('all')}
          >
            Everything
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
                  fontSize: '10.5px',
                  fontWeight: 600,
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
