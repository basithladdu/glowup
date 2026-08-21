import React from 'react';
import { useGlowUpStore } from '../store/useGlowUpStore';

export const SymmetryStyle: React.FC = () => {
  const { state, selectedDate, getDayState, saveState } = useGlowUpStore();
  const dayState = getDayState();

  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  const symmetryDrills = [
    {
      id: 'sym_chew',
      title: '50/50 Chewing Balance Drill',
      desc: 'Chew evenly on left & right sides. Prevents masseter asymmetry and squares jawline.',
      tag: 'JAW',
      zone: 'Masseter Muscles & Temporomandibular Joint',
      checks: [
        'Alternate chewing sides every 15–20 chews per bite',
        'Never swallow coarse unground food chunks',
        'Feel masseter muscles contracting equally on left and right',
        'Avoid buccinator (cheek) sucking while swallowing',
        'Keep lips lightly sealed during entire chewing sequence'
      ]
    },
    {
      id: 'sym_tuck',
      title: 'Wall Chin Tucks (3×15 Reps)',
      desc: 'Press occiput back into wall for 5s. Fixes forward head posture and sharpens submental angle.',
      tag: 'POSTURE',
      zone: 'Deep Neck Flexors & Suboccipital Base',
      checks: [
        'Stand tall with heels, glutes, and upper back against wall',
        'Keep gaze strictly horizontal (do not tilt head downward)',
        'Pull chin straight back horizontally to create firm neck pack',
        'Hold contraction for 5 seconds feeling deep neck flexor burn',
        'Release smoothly and perform 3 sets of 15 repetitions'
      ]
    },
    {
      id: 'sym_mew',
      title: 'Suction Mewing & Tongue Posture',
      desc: 'Entire tongue sealed on roof of mouth. Expands palate and lifts hyoid skin under chin.',
      tag: 'STRUCTURE',
      zone: 'Maxillary Palate & Submental Hyoid Muscles',
      checks: [
        'Place tip of tongue on palate shelf just behind front teeth',
        'Vacuum seal posterior third of tongue against soft palate',
        'Keep molars lightly resting or 1mm apart (no clenching)',
        'Maintain 100% nasal breathing with lips sealed',
        'Confirm hyoid skin is pulled taut upward under jaw'
      ]
    },
    {
      id: 'sym_massage',
      title: 'Face Lymphatic De-Bloat Massage (60s)',
      desc: 'Cold water splash + upward strokes from jaw to temples to neck lymph nodes.',
      tag: 'DE-BLOAT',
      zone: 'Jawline Margins, Cheeks & Cervical Lymph Nodes',
      checks: [
        'Mist face with pure Khus hydrosol for smooth glide',
        'Sweep index/middle knuckles from chin tip outward along jawline',
        'Drain downward along side of neck toward collarbone lymphatics',
        'Gently pat under-eye area outward to relieve morning water retention',
        'Finish with cold water splash to lock vasoconstriction'
      ]
    }
  ];

  const styleItems = [
    {
      id: 'sty_mono',
      title: 'Monochrome / Muted Fitted Aesthetic',
      desc: 'Black, charcoal, olive, or cream. Clean tailoring that accentuates shoulder-to-waist V-taper.',
      checks: [
        'Choose structured high-GSM heavy cotton or knit fabrics',
        'Verify shoulder seams sit directly on acromion bone border',
        'Ensure clean taper along torso without billowing excess fabric',
        'Match belt and shoe leather tones seamlessly',
        'Inspect outfit for lint, loose threads, or wrinkles'
      ]
    },
    {
      id: 'sty_shoes',
      title: 'Footwear Clean & Leather Conditioned',
      desc: 'Zero scuffs, wiped soles, conditioned leather boots or clean white minimal sneakers.',
      checks: [
        'Wipe midsoles with damp cloth to remove street dust',
        'Condition leather upper with light beeswax or balm',
        'Ensure fresh clean laces without fraying',
        'Inspect heel tread wear to prevent pronation',
        'Store with shoe trees or dry ventilation'
      ]
    },
    {
      id: 'sty_scent',
      title: 'Signature Fragrance Pacing',
      desc: '2 sprays on pulse points (sides of neck & wrists). Clean, masculine, long-lasting sillage.',
      checks: [
        'Apply after shower on hydrated skin for 8h+ longevity',
        '1 spray on carotid artery pulse point on left and right neck',
        '1 spray on wrists (dab gently, never rub to preserve top notes)',
        'Choose woody, amber, or fresh vetiver masculine profiles',
        'Verify non-overpowering 2-foot scent bubble'
      ]
    },
    {
      id: 'sty_groom',
      title: 'Clean Grooming Detail Check',
      desc: 'Beard neckline sharp, nose/ear hair trimmed, eyebrows brushed, hands & nails filed.',
      checks: [
        'Trim beard neckline exactly 2 fingers above Adam\'s apple',
        'Shave stray hairs on upper cheek line for sharp crisp geometry',
        'Brush eyebrows upward and outward with clean spoolie',
        'Clip and file nails smooth with zero rough edges',
        'Inspect nose and ear borders under bright lighting'
      ]
    }
  ];

  // Direct mutation here left zustand's reference unchanged, so a checkbox tap didn't
  // re-render until something unrelated forced it — same fix as SkinGrooming's AM/PM steps.
  const toggleSymmetry = (id: string) => {
    const newSymmetry = { ...dayState.symmetry, [id]: !dayState.symmetry[id] };
    const newDay = { ...dayState, symmetry: newSymmetry };
    useGlowUpStore.setState({ state: { ...state, days: { ...state.days, [selectedDate]: newDay } } });
    saveState({ area: 'symmetry', item: id, exact_update: `Toggled symmetry drill ${id}` });
  };

  const toggleStyle = (id: string) => {
    const newStyle = { ...dayState.style, [id]: !dayState.style[id] };
    const newDay = { ...dayState, style: newStyle };
    useGlowUpStore.setState({ state: { ...state, days: { ...state.days, [selectedDate]: newDay } } });
    saveState({ area: 'style', item: id, exact_update: `Toggled style item ${id}` });
  };

  return (
    <div className="section-block">
      {/* FACIAL SYMMETRY & POSTURE */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">jaw</span> facial symmetry &amp; posture drills</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--turmeric)' }}>Facial Symmetry &amp; Masseter Architecture</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          {symmetryDrills.map((d) => {
            const isDone = !!dayState.symmetry[d.id];
            const isExpanded = expandedItem === d.id;

            return (
              <div
                key={d.id}
                style={{
                  background: isDone ? 'rgba(138, 168, 95, 0.06)' : 'var(--surface2)',
                  border: `1px solid ${isDone ? 'var(--sage)' : 'var(--line2)'}`,
                  borderRadius: '8px',
                  padding: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedItem(isExpanded ? null : d.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="task-badge">{d.tag}</span>
                      <span className="task-title" style={{ textDecoration: isDone ? 'line-through' : 'none', fontWeight: 600 }}>
                        {d.title}
                      </span>
                    </div>
                    <div className="task-sub" style={{ marginTop: '2px' }}>{d.desc}</div>
                    <div style={{ fontSize: '10.5px', color: 'var(--muted)', marginTop: '4px' }}>
                      Zone: <strong style={{ color: 'var(--paper)' }}>{d.zone}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="btn sm"
                      style={{ fontSize: '10px', padding: '3px 7px', background: 'var(--surface3)' }}
                      onClick={() => setExpandedItem(isExpanded ? null : d.id)}
                    >
                      {isExpanded ? '▲ Hide' : '5 Checks'}
                    </button>
                    <button
                      className="task-btn"
                      style={{ background: isDone ? 'var(--sage)' : 'var(--surface3)', color: isDone ? '#1A1206' : 'var(--paper)' }}
                      onClick={() => toggleSymmetry(d.id)}
                    >
                      {isDone ? '✓ Done' : 'Complete'}
                    </button>
                  </div>
                </div>

                {/* 5 GRANULAR MICRO-CHECKS ACCORDION */}
                {isExpanded && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--line2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontSize: '10.5px', color: 'var(--turmeric)', margin: '0 0 4px', fontWeight: 600 }}>
                      5 Precision Biomechanical Checks:
                    </p>
                    {d.checks.map((chk, i) => (
                      <div key={i} style={{ fontSize: '11px', color: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--sage)', fontWeight: 700 }}>✓</span> {chk}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* STYLE & GROOMING STANDARDS */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">style</span> personal aesthetic &amp; grooming</p>
            <h3 style={{ fontSize: '15px', margin: 0, color: 'var(--rose)' }}>Personal Aesthetic &amp; Presence Standards</h3>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
          {styleItems.map((s) => {
            const isDone = !!dayState.style[s.id];
            const isExpanded = expandedItem === s.id;

            return (
              <div
                key={s.id}
                style={{
                  background: isDone ? 'rgba(138, 168, 95, 0.06)' : 'var(--surface2)',
                  border: `1px solid ${isDone ? 'var(--sage)' : 'var(--line2)'}`,
                  borderRadius: '8px',
                  padding: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedItem(isExpanded ? null : s.id)}>
                    <span className="task-title" style={{ textDecoration: isDone ? 'line-through' : 'none', fontWeight: 600 }}>
                      {s.title}
                    </span>
                    <div className="task-sub" style={{ marginTop: '2px' }}>{s.desc}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      className="btn sm"
                      style={{ fontSize: '10px', padding: '3px 7px', background: 'var(--surface3)' }}
                      onClick={() => setExpandedItem(isExpanded ? null : s.id)}
                    >
                      {isExpanded ? '▲ Hide' : '5 Checks'}
                    </button>
                    <button
                      className="task-btn"
                      style={{ background: isDone ? 'var(--sage)' : 'var(--surface3)', color: isDone ? '#1A1206' : 'var(--paper)' }}
                      onClick={() => toggleStyle(s.id)}
                    >
                      {isDone ? '✓ Ready' : 'Check'}
                    </button>
                  </div>
                </div>

                {/* 5 GRANULAR MICRO-CHECKS ACCORDION */}
                {isExpanded && (
                  <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--line2)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <p style={{ fontSize: '10.5px', color: 'var(--rose)', margin: '0 0 4px', fontWeight: 600 }}>
                      5 Aesthetic Quality Standards:
                    </p>
                    {s.checks.map((chk, i) => (
                      <div key={i} style={{ fontSize: '11px', color: 'var(--paper)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--rose)', fontWeight: 700 }}>✓</span> {chk}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
