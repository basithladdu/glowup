import { useEffect, useState } from 'react';
import { useGlowUpStore } from './store/useGlowUpStore';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import type { TabType } from './components/Navigation';
import { CalendarTimeline } from './components/CalendarTimeline';
import { TodayFlow } from './components/TodayFlow';
import { AIFoodAssistant } from './components/AIFoodAssistant';
import { LiftsWorkouts } from './components/LiftsWorkouts';
import { GoalsMatrix } from './components/GoalsMatrix';
import { HabitMomentumVault } from './components/HabitMomentumVault';
import { SkinGrooming } from './components/SkinGrooming';

export function App() {
  const { loadState } = useGlowUpStore();
  const [activeTab, setActiveTab] = useState<TabType>('calendar');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passInput, setPassInput] = useState('');
  const [passError, setPassError] = useState(false);

  useEffect(() => {
    loadState();
    const storedAuth = sessionStorage.getItem('glowup-auth-v1');
    if (storedAuth === 'true') {
      setIsUnlocked(true);
    }
  }, [loadState]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passInput.trim().toLowerCase() === 'laddu') {
      setIsUnlocked(true);
      sessionStorage.setItem('glowup-auth-v1', 'true');
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  if (!isUnlocked) {
    return (
      <div id="authModal" style={{ display: 'flex' }}>
        <div className="auth-box">
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔒</div>
          <h2>GLOWUP</h2>
          <p>Enter passcode to unlock your personal modular matrix.</p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              placeholder="•••••"
              autoFocus
              className="auth-input"
            />
            <button type="submit" className="btn primary" style={{ width: '100%', marginTop: '10px' }}>
              Unlock Matrix
            </button>
            {passError && (
              <p style={{ color: 'var(--vermilion)', fontSize: '11px', marginTop: '8px' }}>
                Incorrect passcode
              </p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="wrap">
        <Header />
      </div>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="wrap main-content">
        {activeTab === 'calendar' && <CalendarTimeline />}
        {activeTab === 'today' && <TodayFlow />}
        {activeTab === 'food' && <AIFoodAssistant />}
        {activeTab === 'lifts' && <LiftsWorkouts />}
        {activeTab === 'goals' && <GoalsMatrix />}
        {activeTab === 'momentum' && <HabitMomentumVault />}
        {activeTab === 'skin' && <SkinGrooming />}
        {activeTab === 'grooming' && <SkinGrooming />}
        {activeTab === 'body' && <LiftsWorkouts />}
        {activeTab === 'content' && <TodayFlow />}
        {activeTab === 'sleep' && <TodayFlow />}
      </div>
    </div>
  );
}

export default App;
