import React, { useState } from 'react';

export const HowToGuidesModal: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null);

  const guides = [
    {
      id: 'guide_multani',
      title: 'Multani Mitti + Pure Khus/Rose Hydrosol Clay Mask',
      category: 'Deep Pore Clarification',
      summary: 'Removes deep sebum blockages, tightens dilated pores, and calms redness (1-2x/week).',
      steps: [
        '1. Measure 1 tablespoon Multani Mitti (Fuller\'s Earth) in a glass or ceramic bowl.',
        '2. Add 2–3 teaspoons pure Khus / Rose water hydrosol until a smooth, spreadable paste forms.',
        '3. Apply evenly across T-zone, nose, forehead, and jawline with clean fingertips or brush.',
        '4. Leave for exactly 10–12 minutes until 80% dry (never let it crack or dry 100% to protect skin moisture barrier).',
        '5. Rinse with cool water, pat dry, and follow immediately with B12 Ceramide barrier cream.'
      ]
    },
    {
      id: 'guide_castor',
      title: 'Cold-Pressed Castor Oil Eyelashes, Brows & Beard Protocol',
      category: 'Follicle Density & Anagen Phase',
      summary: 'Ricinoleic acid stimulates prostaglandin receptors to thicken sparse eyelashes, brows, and beard roots.',
      steps: [
        '1. Cleanse face and eye area completely with gentle foaming face wash.',
        '2. Dip a clean spoolie brush or cotton swab into 1 drop of 100% pure cold-pressed castor oil.',
        '3. Brush gently through eyebrows from inner to outer arch.',
        '4. Sweep carefully along upper eyelash tips (avoid direct eyeball contact).',
        '5. Dab 2 drops across patchy beard root areas and massage for 30 seconds before sleep.'
      ]
    },
    {
      id: 'guide_lips',
      title: 'Nicole Berry Lip Scrub + Vaseline Pink Lip Slugging',
      category: 'Lip Micro-Circulation & Slugging',
      summary: 'Exfoliates dead keratinized cells and locks in moisture for natural pink, plump lips.',
      steps: [
        '1. Moisten lips with lukewarm water.',
        '2. Apply a pea-sized amount of Nicole Berry lip scrub to lips.',
        '3. Massage in gentle circular motions for 45–60 seconds to stimulate capillary blood flow.',
        '4. Wipe clean with a soft damp microfiber cloth.',
        '5. Immediately apply a thick layer of Pure Petroleum Jelly (Vaseline) for overnight slugging.'
      ]
    },
    {
      id: 'guide_coconutoil',
      title: 'Virgin Coconut Oil Scalp & Hairline Massage Protocol',
      category: 'Hair Shaft & Follicle Rebuild',
      summary: 'Medium-chain triglycerides penetrate the hair cortex, reducing protein loss and fortifying roots.',
      steps: [
        '1. Warm 1–2 teaspoons of pure virgin cold-pressed coconut oil between palms.',
        '2. Part hair section-by-section to expose scalp surface.',
        '3. Massage in firm circular motions with fingertips for 5 minutes to stimulate subgaleal circulation.',
        '4. Distribute a thin protective layer through hair mid-lengths to ends.',
        '5. Leave for 45–60 minutes or overnight before washing with gentle clarifying shampoo.'
      ]
    },
    {
      id: 'guide_derma',
      title: '0.5mm Titanium Derma Rolling + Minoxidil 5% Protocol',
      category: 'Hairline & Beard Growth',
      summary: 'Creates controlled micro-channels to stimulate collagen induction and multiply Minoxidil absorption.',
      steps: [
        '1. Sanitize 0.5mm derma roller in 70% isopropyl alcohol for 10 minutes prior.',
        '2. Roll across hairline temples and patchy beard areas: 4-6 passes horizontally, vertically, and diagonally with light pressure.',
        '3. Wait at least 15–20 minutes before applying 1.0ml Minoxidil 5% solution.',
        '4. Rinse derma roller under hot water and store in protective case.',
        '5. Perform strictly 1–2 times per week (never on active acne or inflamed skin).'
      ]
    },
    {
      id: 'guide_lymph',
      title: 'Lymphatic Face De-Bloat Massage (60s)',
      category: 'Facial Aesthetics',
      summary: 'Drains excess interstitial sodium fluid from cheeks and jaw to instantly sharpen facial contours.',
      steps: [
        '1. Splash face with ice-cold water to constrict blood vessels.',
        '2. Mist face with pure Khus hydrosol for smooth skin glide.',
        '3. Knuckle strokes: Place knuckles at chin and sweep upward along jawline to below earlobe (10 reps per side).',
        '4. Cheekbone drain: Use index and middle fingers sweeping under cheekbones outward to temples (10 reps).',
        '5. Neck drain: Sweep both palms downward from behind ears down sides of neck to collarbones (10 reps).'
      ]
    },
    {
      id: 'guide_tuck',
      title: 'Wall Chin Tucks (Posture & Submental Angle)',
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
      title: '50/50 Chewing Balance & Masseter Drill',
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
      title: 'Dead Hangs & Spinal Decompression',
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
      title: 'The Minimalist AHA 30% + BHA 2% Peel Protocol',
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
      title: 'Nasal Mouth Taping (Sleep Architecture)',
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
            <h2 style={{ fontSize: '18px', margin: 0 }}>Protocol Guides &amp; How-To Tutorials </h2>
          </div>
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
