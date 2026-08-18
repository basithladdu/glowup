import React, { useState, useEffect } from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

interface PoliticalNote {
  id: string;
  date: string;
  topic: string;
  summary: string;
  keyArguments: string;
  stance: string;
}

export const ContentSprint: React.FC = () => {
  const { state, selectedDate, saveState } = useGlowUpStore();
  const [topic, setTopic] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(45 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Political / Congressional Daily Check-in State
  const [polTopic, setPolTopic] = useState('');
  const [polSummary, setPolSummary] = useState('');
  const [polArgs, setPolArgs] = useState('');
  const [polStance, setPolStance] = useState('Analysis / Breakdown');

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
    state.content = state.content || {};
    state.content[selectedDate] = { topic: topicText, dur: 45 };
    saveState({ area: 'content', item: 'sprint-45', exact_update: `Shipped: ${topicText}` });
    setIsRunning(false);
    setSecondsLeft(45 * 60);
    setTopic('');
  };

  const handleLogPoliticalAnalysis = (e: React.FormEvent) => {
    e.preventDefault();
    if (!polTopic.trim()) return;
    const newNote: PoliticalNote = {
      id: 'pol_' + Date.now(),
      date: selectedDate,
      topic: polTopic.trim(),
      summary: polSummary.trim(),
      keyArguments: polArgs.trim(),
      stance: polStance
    };
    (state as any).politicalNotes = (state as any).politicalNotes || [];
    (state as any).politicalNotes.unshift(newNote);
    saveState({ area: 'content', item: 'political-note', exact_update: `Logged political research: ${polTopic.trim()}` });
    setPolTopic('');
    setPolSummary('');
    setPolArgs('');
  };

  const loggedContent = state.content ? state.content[selectedDate] : null;
  const politicalNotes: PoliticalNote[] = (state as any).politicalNotes || [
    {
      id: 'pol_demo1',
      date: '2026-08-19',
      topic: 'Congressional Bill & Defense Budget Hearing',
      summary: 'Analysis of key debates regarding technological sovereignty, semiconductor supply chains, and fiscal appropriation.',
      keyArguments: 'Bipartisan consensus on domestic industrial policy vs. fiscal conservative pushback on deficit spending.',
      stance: 'Critical Synthesis'
    }
  ];

  return (
    <div className="section-block">
      <div className="desktop-grid-equal">
        {/* LEFT COLUMN: 45-MINUTE SPRINT TIMER */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="card" style={{ textAlign: 'center', padding: '20px 14px' }}>
            <p className="eyebrow"><span className="n">#basithladdu</span> 45-minute daily production sprint</p>
            <h2 style={{ fontSize: '18px', margin: '0 0 4px' }}>Content Creation Sprint</h2>
            <p className="note" style={{ marginBottom: '12px' }}>
              One short / reel every 2 days. One pillar deep-dive every 14 days. Zero distractions.
            </p>

            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '38px', fontWeight: 700, color: isRunning ? 'var(--turmeric)' : 'var(--paper)', margin: '10px 0' }}>
              {mins}:{secs}
            </div>

            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Deliverable title (e.g. Scripted & Recorded Reel #14)"
              style={{ marginBottom: '10px' }}
            />

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${isRunning ? 'sage' : 'primary'}`}
                style={{ flex: 1 }}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? '⏸ Pause Timer' : '▶ Start 45m Sprint'}
              </button>
              <button
                className="btn sage"
                onClick={handleFinishSprint}
                disabled={!topic.trim() && !isRunning}
              >
                ✓ Log Shipped
              </button>
            </div>

            {loggedContent && (
              <div style={{ marginTop: '12px', background: 'rgba(138, 168, 95, 0.1)', border: '1px solid var(--sage)', borderRadius: '8px', padding: '8px', fontSize: '11px', color: 'var(--sage)' }}>
                ✓ Shipped on {selectedDate}: {loggedContent.topic} ({loggedContent.dur}m)
              </div>
            )}
          </div>

          {/* SPRINT HISTORY & METRICS */}
          <div className="card">
            <p className="eyebrow"><span className="n">cadence</span> production velocity</p>
            <div className="statline">
              <span className="statk">Target Frequency</span>
              <span className="statv" style={{ color: 'var(--turmeric)' }}>1 Short / 2 Days</span>
            </div>
            <div className="statline">
              <span className="statk">Pillar Deep-Dive</span>
              <span className="statv" style={{ color: 'var(--sage)' }}>1 YouTube Long / 14 Days</span>
            </div>
            <div className="statline">
              <span className="statk">Production Block</span>
              <span className="statv" style={{ color: 'var(--paper)' }}>45 Mins Daily Flow</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: POLITICAL & CONGRESSIONAL BRIEFING CHECK-IN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* POLITICAL RESEARCH FORM */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div>
                <p className="eyebrow"><span className="n">intellect</span> political &amp; congressional research</p>
                <h2 style={{ fontSize: '16px', margin: 0, color: 'var(--turmeric)' }}>
                  🏛️ Daily Political &amp; Policy Briefing
                </h2>
              </div>
              <span className="tag-badge tag-best">HABIT CHECK-IN</span>
            </div>
            <p className="note" style={{ marginBottom: '10px' }}>
              Synthesize real congressional debates, policy changes, and political arguments to maintain sharp intellectual habits and fuel content topics.
            </p>

            <form onSubmit={handleLogPoliticalAnalysis} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label className="fl">Debate / Hearing / Policy Topic</label>
                <input
                  value={polTopic}
                  onChange={(e) => setPolTopic(e.target.value)}
                  placeholder="e.g. US Congressional Hearing on Tech Regulation / Budget Reform"
                  required
                />
              </div>

              <div>
                <label className="fl">Analysis Lens / Stance</label>
                <select value={polStance} onChange={(e) => setPolStance(e.target.value)}>
                  <option value="Analysis / Breakdown">Analysis / Deep-Dive Breakdown</option>
                  <option value="Critical Synthesis">Critical Synthesis / Fact-Check</option>
                  <option value="Economic Impact">Economic & Market Impact</option>
                  <option value="Geopolitical Policy">Geopolitical / Constitutional Policy</option>
                </select>
              </div>

              <div>
                <label className="fl">Core Arguments &amp; Conflicting Positions</label>
                <input
                  value={polArgs}
                  onChange={(e) => setPolArgs(e.target.value)}
                  placeholder="e.g. Pro-regulation safety concerns vs anti-regulatory market growth"
                />
              </div>

              <div>
                <label className="fl">Synthesis &amp; Content Takeaway</label>
                <textarea
                  value={polSummary}
                  onChange={(e) => setPolSummary(e.target.value)}
                  placeholder="Summarize the core philosophical/political insight..."
                  rows={2}
                  className="ai-textarea"
                />
              </div>

              <button type="submit" className="btn primary" style={{ width: '100%' }}>
                ✓ Log Daily Political Research Check-in
              </button>
            </form>
          </div>

          {/* RECENT POLITICAL RESEARCH ARCHIVE */}
          <div className="card">
            <h3 style={{ fontSize: '13px', margin: '0 0 8px', color: 'var(--paper)' }}>
              📜 Political Synthesis Archive ({politicalNotes.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {politicalNotes.map((pn) => (
                <div key={pn.id} className="task-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <span className="task-title" style={{ color: 'var(--turmeric)' }}>{pn.topic}</span>
                    <span className="freq-pill">{pn.date}</span>
                  </div>
                  {pn.keyArguments && (
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)' }}>
                      <strong>Key Debate:</strong> {pn.keyArguments}
                    </div>
                  )}
                  {pn.summary && (
                    <div style={{ fontSize: '10.5px', color: 'var(--paper)' }}>
                      {pn.summary}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
