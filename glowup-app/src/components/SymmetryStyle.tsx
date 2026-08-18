import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const SymmetryStyle: React.FC = () => {
  const { getDayState, saveState } = useGlowUpStore();
  const dayState = getDayState();

  const symmetryDrills = [
    { id: 'sym_chew', title: '50/50 Chewing Balance Drill', desc: 'Chew evenly on left & right sides. Prevents masseter asymmetry and squares jawline.', tag: 'JAW' },
    { id: 'sym_tuck', title: 'Wall Chin Tucks (3×15 Reps)', desc: 'Press occiput back into wall for 5s. Fixes forward head posture and sharpens submental angle.', tag: 'POSTURE' },
    { id: 'sym_mew', title: 'Suction Mewing & Tongue Posture', desc: 'Entire tongue sealed on roof of mouth. Expands palate and lifts hyoid skin under chin.', tag: 'STRUCTURE' },
    { id: 'sym_massage', title: 'Face Lymphatic De-Bloat Massage (60s)', desc: 'Cold water splash + upward strokes from jaw to temples to neck lymph nodes.', tag: 'DE-BLOAT' }
  ];

  const styleItems = [
    { id: 'sty_mono', title: 'Monochrome / Muted Fitted Aesthetic', desc: 'Black, charcoal, olive, or cream. Clean tailoring that accentuates shoulder-to-waist V-taper.' },
    { id: 'sty_shoes', title: 'Footwear Clean & Leather Conditioned', desc: 'Zero scuffs, wiped soles, conditioned leather boots or clean white minimal sneakers.' },
    { id: 'sty_scent', title: 'Signature Fragrance Pacing', desc: '2 sprays on pulse points (sides of neck & wrists). Clean, masculine, long-lasting sillage.' },
    { id: 'sty_groom', title: 'Clean Grooming Detail Check', desc: 'Beard neckline sharp, nose/ear hair trimmed, eyebrows brushed, hands & nails filed.' }
  ];

  const toggleSymmetry = (id: string) => {
    dayState.symmetry[id] = !dayState.symmetry[id];
    saveState({ area: 'symmetry', item: id, exact_update: `Toggled symmetry drill ${id}` });
  };

  const toggleStyle = (id: string) => {
    dayState.style[id] = !dayState.style[id];
    saveState({ area: 'style', item: id, exact_update: `Toggled style item ${id}` });
  };

  return (
    <div className="section-block">
      {/* FACIAL SYMMETRY & POSTURE */}
      <div className="card">
        <p className="eyebrow"><span className="n">jaw</span> facial symmetry &amp; posture drills</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {symmetryDrills.map((d) => {
            const isDone = !!dayState.symmetry[d.id];
            return (
              <div key={d.id} className={`task-item ${isDone ? 'done' : ''}`}>
                <div className="task-left">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="task-badge">{d.tag}</span>
                    <span className="task-title">{d.title}</span>
                  </div>
                  <div className="task-sub">{d.desc}</div>
                </div>
                <button className="task-btn" onClick={() => toggleSymmetry(d.id)}>
                  {isDone ? '✓ Done' : 'Complete'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* STYLE & GROOMING STANDARDS */}
      <div className="card">
        <p className="eyebrow"><span className="n">style</span> personal aesthetic &amp; grooming</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {styleItems.map((s) => {
            const isDone = !!dayState.style[s.id];
            return (
              <div key={s.id} className={`task-item ${isDone ? 'done' : ''}`}>
                <div className="task-left">
                  <div className="task-title">{s.title}</div>
                  <div className="task-sub">{s.desc}</div>
                </div>
                <button className="task-btn" onClick={() => toggleStyle(s.id)}>
                  {isDone ? '✓ Ready' : 'Check'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
