import React, { useState, useEffect } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const ContentSprint: React.FC = () => {
  const { state, selectedDate, saveState } = useGlowUpStore();
  const [topic, setTopic] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  const handleFinishSprint = () => {
    const topicText = topic.trim() || 'Content Sprint';
    state.content[selectedDate] = { topic: topicText, dur: 45 };
    saveState({ area: 'content', item: 'sprint-45', exact_update: `Shipped: ${topicText}` });
    setIsRunning(false);
    setSecondsLeft(45 * 60);
    setTopic('');
  };

  const loggedContent = state.content[selectedDate];

  return (
    <div className="section-block">
      {/* 45-MINUTE CONTENT SPRINT TIMER */}
      <div className="card" style={{ textAlign: 'center', padding: '20px 14px' }}>
        <p className="eyebrow"><span className="n">#basithladdu</span> 45-minute daily production sprint</p>
        <h2 style={{ fontSize: '18px', margin: '0 0 4px' }}>Content Creation Sprint</h2>
        <p className="note" style={{ marginBottom: '12px' }}>
          One short / reel every 2 days. One pillar YouTube deep-dive every 14 days. Zero distractions.
        </p>

        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '38px', fontWeight: 700, color: isRunning ? 'var(--turmeric)' : 'var(--paper)', margin: '10px 0' }}>
          {mins}:{secs}
        </div>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Deliverable title (e.g. Scripted & Recorded Video #14)"
          style={{ marginBottom: '10px' }}
        />

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${isRunning ? 'sage' : 'primary'}`}
            style={{ flex: 1 }}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? '⏸ Pause Sprint' : '⚡ Start 45m Sprint'}
          </button>
          <button className="btn sm" style={{ background: 'var(--surface3)' }} onClick={handleFinishSprint}>
            ✓ Mark Shipped
          </button>
        </div>
      </div>

      {/* DELIVERABLE STATUS */}
      {loggedContent && (
        <div className="card" style={{ background: 'rgba(138,168,95,.08)', borderColor: 'var(--sage)' }}>
          <div className="statline">
            <span className="statk">Shipped Today</span>
            <span className="statv" style={{ color: 'var(--sage)' }}>✓ {loggedContent.topic}</span>
          </div>
        </div>
      )}
    </div>
  );
};
