import React, { useState } from 'react';

export const HowToGuidesModal: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = [
    {
      id: 'guide_lymph',
      title: '💆 Lymphatic Face De-Bloat Massage (60s)',
      category: 'Facial Aesthetics',
      summary: 'Drains excess interstitial sodium fluid from cheeks and jaw to instantly sharpen facial contours.',
      steps: [
        '1. Splash face with ice-cold water to constrict blood vessels.',
        '2. Apply a light layer of moisturizer or face wash for skin glide.',
        '3. Knuckle strokes: Place knuckles at the chin and sweep upward along jawline to below the earlobe (10 reps per side).',
        '4. Cheekbone drain: Use index and middle fingers from sides of nose sweeping under cheekbones outward to temples (10 reps).',
        '5. Neck drain: Sweep both palms downward from behind the ears down the sides of the neck to collarbones (10 reps) to drain lymph nodes into venous system.'
      ]
    },
    {
      id: 'guide_tuck',
      title: '🧍 Wall Chin Tucks (Posture & Submental Angle)',
      category: 'Symmetry & Posture',
      summary: 'Strengthens deep neck flexors (longus capitis/colli) and eliminates "nerd neck" / double chin effect.',
      steps: [
        '1. Stand with heels, glutes, upper back, and head flat against a wall.',
        '2. Look straight ahead (do not tilt head up or down).',
        '3. Retract your chin directly straight back as if making a double chin against the wall.',
        '4. Hold occiput firmly against wall for 5 seconds while keeping chest tall.',
        '5. Perform 3 sets of 15 repetitions daily.'
      ]
    },
    {
      id: 'guide_chew',
      title: '🍽️ 50/50 Chewing Balance & Masseter Drill',
      category: 'Jaw Symmetry',
      summary: 'Equalizes unilateral masseter muscle hypertrophy to fix facial asymmetry.',
      steps: [
        '1. Notice which side you naturally chew on (most people chew 80% on one side).',
        '2. Consciously switch every bite to your weaker non-dominant side.',
        '3. Chew hard foods (mastic gum, whole foods, fibrous vegetables) evenly on left and right molars.',
        '4. Practice lip seal and swallow using tongue suction without engaging cheek facial muscles.'
      ]
    },
    {
      id: 'guide_hang',
      title: '🏋️ Dead Hangs & Spinal Decompression',
      category: 'Height & Spine',
      summary: 'Relieves intervertebral disc compression, widens shoulder carriage, and reclaims 1–3cm visible height.',
      steps: [
        '1. Grip a sturdy pull-up bar with an overhand shoulder-width grip.',
        '2. Let your body hang completely limp with feet off the floor.',
        '3. Relax abdominal wall and breathe deeply into your lower back to let gravity lengthen the spine.',
        '4. Hold for 45–60 seconds. Repeat 3 times daily after gym sessions.'
      ]
    },
    {
      id: 'guide_peel',
      title: '💅 The Minimalist AHA 30% + BHA 2% Peel Protocol',
      category: 'Chemical Exfoliation',
      summary: 'Deep chemical peel for hyperpigmentation, acne marks, and rapid epidermal turnover.',
      steps: [
        '1. Wash face thoroughly and pat 100% dry. DO NOT apply on damp or broken skin.',
        '2. Apply 3–4 drops evenly across face, avoiding immediate eye contours and lips.',
        '3. Set a strict timer for 10 MINUTES max. Mild tingling is normal; intense burning means rinse immediately.',
        '4. Rinse off completely with lukewarm/cold water. No harsh facewash.',
        '5. Apply soothing barrier cream (Minimalist B12) and ALWAYS wear SPF 50 the next morning.',
        '6. Perform ONLY once every 14 days strictly.'
      ]
    },
    {
      id: 'guide_mouthtape',
      title: '🌙 Nasal Mouth Taping (Sleep Architecture)',
      category: 'Sleep & Nitric Oxide',
      summary: 'Guarantees 100% nasal breathing throughout 8 hours of sleep.',
      steps: [
        '1. Use porous, medical-grade 3M Micropore tape (1 inch width).',
        '2. Cut a small 2-inch strip and fold a tiny tab at one end for instant removal.',
        '3. Place vertically over the center of closed lips before turning off the lights.',
        '4. Nasal breathing increases blood oxygenation by 15%, stimulates endogenous nitric oxide release, and prevents dry morning mouth odor.'
      ]
    }
  ];

  const active = guides.find(g => g.id === selectedGuide);

  return (
    <div className="section-block">
      {/* HOW-TO PROTOCOLS HEADER */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <p className="eyebrow"><span className="n">knowledge</span> biomechanical &amp; aesthetic protocols</p>
            <h2 style={{ fontSize: '18px', margin: 0 }}>Protocol Guides &amp; How-To Tutorials 📚</h2>
          </div>
          <span className="tag-badge tag-best">EVIDENCE-BASED</span>
        </div>
        <p className="note">
          Tap any protocol below to view step-by-step scientific instructions, anatomical cues, and execution guidelines.
        </p>
      </div>

      <div className="desktop-grid-equal">
        {guides.map((g) => (
          <div
            key={g.id}
            className="card"
            style={{ cursor: 'pointer', transition: '0.12s' }}
            onClick={() => setSelectedGuide(g.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span className="cat-pill gym" style={{ background: 'rgba(232, 163, 61, 0.15)' }}>{g.category}</span>
              <span style={{ fontSize: '11px', color: 'var(--turmeric)', fontWeight: 700 }}>View Guide →</span>
            </div>
            <h3 style={{ fontSize: '14px', margin: '4px 0 6px', color: 'var(--paper)' }}>{g.title}</h3>
            <p className="note">{g.summary}</p>
          </div>
        ))}
      </div>

      {/* MODAL POPUP FOR SELECTED GUIDE */}
      {active && (
        <div className="modal-backdrop" onClick={() => setSelectedGuide(null)}>
          <div className="card modal-box" style={{ maxWidth: '480px', textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <span className="eyebrow" style={{ color: 'var(--turmeric)' }}>{active.category}</span>
                <h2 style={{ fontSize: '17px', margin: '2px 0 0', color: 'var(--paper)' }}>{active.title}</h2>
              </div>
              <button className="del" onClick={() => setSelectedGuide(null)}>×</button>
            </div>

            <p className="note" style={{ marginBottom: '14px', color: 'var(--paper)' }}>{active.summary}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', background: 'var(--surface2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--line2)' }}>
              {active.steps.map((step, idx) => (
                <div key={idx} style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--paper)' }}>
                  {step}
                </div>
              ))}
            </div>

            <button className="btn primary" style={{ width: '100%', marginTop: '14px' }} onClick={() => setSelectedGuide(null)}>
              ✓ Got It / Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
