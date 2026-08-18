import React from 'react';

export type TabType = 
  | 'calendar' 
  | 'today' 
  | 'habitkit'
  | 'food' 
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
  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'calendar', label: '📅 24h Google Calendar' },
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
