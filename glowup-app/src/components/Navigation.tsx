import React from 'react';

export type TabType = 
  | 'calendar' 
  | 'today' 
  | 'food' 
  | 'lifts' 
  | 'goals' 
  | 'momentum' 
  | 'skin' 
  | 'grooming' 
  | 'body' 
  | 'content' 
  | 'sleep';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'calendar', label: '📅 24h Calendar' },
    { id: 'today', label: 'Today & Flow ⚡' },
    { id: 'food', label: '🥪 Food & AI Macros' },
    { id: 'lifts', label: '🏋️ Lifts & Workouts' },
    { id: 'goals', label: '🎯 Goals Matrix' },
    { id: 'momentum', label: '🔥 Habit Graph & Momentum' },
    { id: 'skin', label: 'Skin & Peel 💅' },
    { id: 'grooming', label: 'Grooming & Hair 💈' },
    { id: 'body', label: 'Body & Weight 📊' },
    { id: 'content', label: 'Content ⚡' },
    { id: 'sleep', label: 'Sleep 🌙' },
  ];

  return (
    <nav className="nav-strip">
      <div className="tabs-list" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={activeTab === t.id}
            className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => onTabChange(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
};
