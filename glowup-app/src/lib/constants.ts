import type { GoalMilestone, WorkoutRoutine, InventoryItem } from '../types';

export const PASSCODE = 'laddu';
export const KCAL_TARGET = 2000;
export const PROT_TARGET = 170;
export const MAINT_KCAL = 2500;

export const SUPABASE_URL = "https://kircxokjlqguyzlkhmop.supabase.co";
export const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpcmN4b2tqbHFndXl6bGtobW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5OTI1MTQsImV4cCI6MjEwMjU2ODUxNH0.zU6f3TqyhHHGFxrMFM55JH-c8Jn7T2FbByIxDGUOZ8k";

export const GEMINI_API_KEY = (typeof window !== 'undefined' && window.localStorage?.getItem('gemini_api_key')) || 
  atob("QVEuQWI4Uk42TGdteXRETFpwM3hic25QakRZZ19fellNQkdhcWVXZnRVaWNvYUxGZlZJN2c=");

export const GEMINI_MODELS = ["gemini-2.5-flash-lite", "gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest"];

/** Seed inventory, used only the first time — after that the persisted store is the
 * source of truth, so toggling stock in the UI sticks across reloads and devices. */
export const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: 'sh_chk', name: 'Raw Chicken Breast', category: 'nutrition', qty: '2 kg', estCost: '₹480', inStock: true },
  { id: 'sh_eggs', name: 'Whole Eggs (Crate of 30)', category: 'nutrition', qty: '1 Crate', estCost: '₹210', inStock: true },
  { id: 'sh_dates', name: 'Medjool Dates', category: 'nutrition', qty: '500g', estCost: '₹280', inStock: false },
  { id: 'sh_whey', name: 'Nakpro Whey Isolate', category: 'nutrition', qty: '1 kg Tub', estCost: '₹1,699', inStock: true },
  { id: 'sh_soya', name: 'Soya Chunks', category: 'nutrition', qty: '500g', estCost: '₹75', inStock: true },
  { id: 'sh_milk', name: 'Milk / Curd', category: 'nutrition', qty: '1 L', estCost: '₹70', inStock: false },
  { id: 'sh_castor', name: 'Castor Oil (lashes & brows)', category: 'grooming', qty: '100ml', estCost: '₹180', inStock: true },
  { id: 'sh_coconut', name: 'Virgin Coconut Oil (scalp)', category: 'grooming', qty: '250ml', estCost: '₹150', inStock: true },
  { id: 'sh_lipscrub', name: 'Lip Scrub', category: 'derm', qty: '30g', estCost: '₹220', inStock: false },
  { id: 'sh_socks', name: 'Cotton Gym Socks (6-pack)', category: 'grooming', qty: '6 Pairs', estCost: '₹299', inStock: false },
  { id: 'sh_tape', name: 'Micropore Mouth Tape', category: 'grooming', qty: '2 Rolls', estCost: '₹120', inStock: true },
  { id: 'sh_spf', name: 'Sunscreen SPF 50', category: 'derm', qty: '100ml', estCost: '₹340', inStock: false },
  { id: 'sh_nivea', name: 'Moisturising Cream', category: 'derm', qty: '100ml Jar', estCost: '₹199', inStock: false },
  { id: 'sh_pilgrim', name: 'Retinol Serum', category: 'derm', qty: '30ml', estCost: '₹449', inStock: true },
  { id: 'sh_peel', name: 'AHA 30% + BHA 2% Peel', category: 'derm', qty: '30ml', estCost: '₹599', inStock: true },
  { id: 'sh_aziderm', name: 'Aziderm 10% (Azelaic Acid)', category: 'derm', qty: '15g Tube', estCost: '₹280', inStock: true },
  { id: 'sh_glyco', name: 'Glyco 6% / 12% (Glycolic Acid)', category: 'derm', qty: '30g', estCost: '₹210', inStock: true },
  { id: 'sh_minox', name: 'Minoxidil 5%', category: 'grooming', qty: '60ml', estCost: '₹550', inStock: true }
];

export const ROT = [
  { d:'Sun', short:'Rest / Kojic', active:'Kojic Acid Cream', extra:'Coconut oil scalp pre-wash + 0.5mm dermaroll AM' },
  { d:'Mon', short:'Aziderm 10%', active:'Aziderm 10% (Azelaic Acid)', extra:'Drying time 10m before moisturizer' },
  { d:'Tue', short:'B12 Barrier', active:'Minimalist Vitamin B12', extra:'Ketoconazole 2% scalp + Glyco 12 Body + Nicole lip scrub' },
  { d:'Wed', short:'Glyco 6%', active:'Glyco 6% (Glycolic Acid)', extra:'Thin layer on face only' },
  { d:'Thu', short:'Aziderm 10%', active:'Aziderm 10% (Azelaic Acid)', extra:'Ketoconazole 2% scalp + Glyco 12 Body' },
  { d:'Fri', short:'Kojic Acid', active:'Kojic Acid Cream', extra:'Focus on hyperpigmentation zones' },
  { d:'Sat', short:'Peel / Active', active:'Minimalist 30% Peel (10 min) OR Aziderm', extra:'Nicole lip scrub + Dermaroll' }
];

export const LIFTS = [
  'Incline DB Bench Press',
  'Barbell Overhead Press',
  'Barbell Bench Press',
  'Barbell Deadlift',
  'Barbell Squat',
  'Romanian Deadlift (Barbell)',
  'Lat Pulldown',
  'Barbell Row',
  'Chest Supported Row (DB)',
  'Leg Press',
  'Leg Curl',
  'Seated Calf Raise',
  'Face Pull',
  'Tricep Pushdown (Cable)',
  'Tricep Extension (DB)',
  'Lateral Raise (DB)',
  'Hammer Curl (DB)',
  'Bicep Curl (DB)',
  'Incline Bicep Curl (DB)',
  'Preacher Curl (Barbell/EZ)',
  'Bench Dips / Cable Kickbacks',
  'Wrist Curls / Reverse Curls'
];

export const METALLICADPA_PPL: Record<string, WorkoutRoutine> = {
  arms: {
    id: 'arms',
    name: 'Dedicated Arms Hypertrophy Day',
    badge: 'Arm Thickness Specialization',
    freq: '1–2x / Week Specialization',
    desc: 'Targeted bicep long-head peak, lateral/long-head tricep lockout, brachialis width, and forearm vascularity.',
    exercises: [
      { name: 'Incline Bicep Curl (DB)', sets: '4 sets', reps: '8–12 reps', intensity: '75%', cue: 'Full stretch at bottom, curl without swinging elbows.' },
      { name: 'Tricep Pushdown (Cable / V-Bar)', sets: '4 sets', reps: '8–12 reps', intensity: '75%', cue: 'Lock elbows to torso, flared squeeze at full extension.' },
      { name: 'Hammer Curl (DB)', sets: '4 sets', reps: '8–12 reps', intensity: '70%', cue: 'Neutral thumbs-up grip. Builds brachialis muscle pushing biceps higher.' },
      { name: 'Overhead Tricep Extension (DB)', sets: '4 sets', reps: '8–12 reps', intensity: '70%', cue: 'Deep long-head stretch behind neck, flare elbows slightly.' },
      { name: '5A. Preacher Curl (EZ Bar / DB)', sets: '3 sets', reps: '10–12 reps', isSuperset: true, supersetLabel: 'SUPERSET 1', cue: 'Strict isolated bicep peak contraction.' },
      { name: '5B. Bench Dips / Cable Kickback', sets: '3 sets', reps: '12–15 reps', isSuperset: true, supersetLabel: 'SUPERSET 1', cue: 'Continuous tension burn out on triceps.' },
      { name: 'Wrist Curls / Reverse Curls', sets: '3 sets', reps: '15–20 reps', intensity: 'Burnout', cue: 'High-rep forearm thickness and grip strength.' }
    ]
  },
  pull_a: {
    id: 'pull_a',
    name: 'Day 1 · Pull (Deadlift Focus)',
    badge: 'Metallicadpa Linear Progression',
    freq: 'Weekly (Day 1)',
    desc: 'Heavy hinge pulling, vertical lat sweep, rear delt bulletproofing, and direct bicep hypertrophy.',
    exercises: [
      { name: 'Deadlift (Barbell)', sets: '1 set', reps: '5+ reps', intensity: '70%', cue: 'Hips down, wedge into bar, drag up shins, AMRAP last set.' },
      { name: 'Lat Pulldown', sets: '3 sets', reps: '8–12 reps', cue: 'Thumbless grip, drive elbows down to hips, arch upper thoracic spine.' },
      { name: 'Chest Supported Row (DB)', sets: '3 sets', reps: '8–12 reps', cue: 'Retract scapulae fully, pull to hip bone.' },
      { name: 'Face Pull', sets: '5 sets', reps: '15–20 reps', cue: 'Pull rope to forehead, rotate hands back (external rotation).' },
      { name: 'Hammer Curl (DB)', sets: '4 sets', reps: '8–12 reps', cue: 'Neutral grip, strict elbow pivot, control the 3s eccentric.' },
      { name: 'Bicep Curl (DB)', sets: '4 sets', reps: '8–12 reps', cue: 'Supinate wrist at peak, squeeze bicep for 1s.' }
    ]
  },
  push_a: {
    id: 'push_a',
    name: 'Day 2 · Push (Bench Focus)',
    badge: 'Metallicadpa Linear Progression',
    freq: 'Weekly (Day 2)',
    desc: 'Heavy chest drive, vertical shoulder pressing, and high-volume tricep / lateral shoulder supersets.',
    exercises: [
      { name: 'Bench Press (Barbell)', sets: '4×5, 1×5+', reps: '5+ reps', intensity: '70%', cue: 'Plant feet, arch lower back, touch lower sternum, flare 45°.' },
      { name: 'Overhead Press (Barbell)', sets: '3 sets', reps: '8–12 reps', cue: 'Squeeze glutes & core, press vertically, head through window at top.' },
      { name: 'Incline Bench Press (DB)', sets: '3 sets', reps: '8–12 reps', cue: '30° incline bench, clavicular upper chest focus.' },
      { name: '4A. Tricep Pushdown (Cable)', sets: '3 sets', reps: '8–12 reps', isSuperset: true, supersetLabel: 'SUPERSET 1', cue: 'Full elbow extension lockout.' },
      { name: '4B. Lateral Raise (DB)', sets: '3 sets', reps: '15–20 reps', isSuperset: true, supersetLabel: 'SUPERSET 1', cue: 'Lead with elbows, slight forward lean, side delt width.' },
      { name: '5A. Tricep Extension (DB)', sets: '3 sets', reps: '8–12 reps', isSuperset: true, supersetLabel: 'SUPERSET 2', cue: 'Overhead long head stretch.' },
      { name: '5B. Lateral Raise (DB)', sets: '3 sets', reps: '15–20 reps', isSuperset: true, supersetLabel: 'SUPERSET 2', cue: 'Continuous side delt burn to failure.' }
    ]
  },
  legs_a: {
    id: 'legs_a',
    name: 'Day 3 · Legs (Squat Focus)',
    badge: 'Metallicadpa Linear Progression',
    freq: 'Weekly (Day 3)',
    desc: 'Heavy quad loading, posterior chain hamstring hinging, and seated soleus development.',
    exercises: [
      { name: 'Squat (Barbell)', sets: '2×5, 1×5+', reps: '5+ reps', intensity: '70%', cue: 'Deep hip hinge below parallel, knees tracking over toes, drive up.' },
      { name: 'Romanian Deadlift (Barbell)', sets: '3 sets', reps: '8–12 reps', cue: 'Soft knee bend, push hips back till hamstrings scream, flat spine.' },
      { name: 'Leg Press', sets: '3 sets', reps: '8–12 reps', cue: 'Feet shoulder-width, full depth without lower back rounding.' },
      { name: 'Leg Curl', sets: '3 sets', reps: '8–12 reps', cue: 'Control eccentric descent 3s, peak hamstring flexion.' },
      { name: 'Seated Calf Raise', sets: '5 sets', reps: '8–12 reps', cue: '2s pause at bottom stretch, 1s peak squeeze on balls of feet.' }
    ]
  },
  rest: {
    id: 'rest',
    name: 'Active Rest & Circadian Recovery',
    badge: 'Recovery & Nervous System Reset',
    freq: '1–2x / Week',
    desc: 'Zero heavy spinal loading. Focus on 60-min outdoor sunlight walking, spine decompression, and deep sleep architecture.',
    exercises: [
      { name: '60-Min Outdoor Sunlight Walk', sets: '1 block', reps: '60 mins', cue: 'Morning sunlight for circadian reset + 7,000 gentle steps.' },
      { name: 'Dead Hang (Pullup Bar)', sets: '3 sets', reps: '30–45s', cue: 'Decompresses spinal discs and reclaims 1–3cm visible height.' },
      { name: 'Doorway Chest Stretch & Wall Tucks', sets: '3 sets', reps: '30s hold', cue: 'Opens rounded shoulders and reinforces upright posture.' }
    ]
  }
};

export const DEFAULT_GOALS: GoalMilestone[] = [
  { id: 'g_weight', category: 'gym', title: 'Target Bodyweight: 72.0 kg (from 85.0 kg)', desc: '500 kcal daily deficit · 170g protein floor. Unlocks sharp jawline definition.', freq: 'Daily Weigh-in', date: '2026-11-15', done: false },
  { id: 'g_vtaper', category: 'gym', title: '1.60 Golden V-Taper Ratio', desc: '120cm shoulders / 75cm waist. Broad clavicles and lean tapered waistline.', freq: 'Monthly Tape', date: '2026-10-30', done: false },
  { id: 'g_arms', category: 'gym', title: '15"+ Arm Circumference', desc: 'Incline curls, heavy cable pushdowns, and hammer curls for brachialis thickness.', freq: 'Monthly Tape', date: '2026-10-30', done: false },
  { id: 'g_deadlift', category: 'gym', title: 'Deadlift 100kg+ for 5+ Clean Reps', desc: 'Heavy hinge progression with strict neutral spine and explosive hip drive.', freq: 'Weekly (Pull A)', date: '2026-09-30', done: false },
  { id: 'g_bench', category: 'gym', title: 'Barbell Bench Press 80kg (5×5+)', desc: 'Controlled eccentric, paused sternum touch, explosive chest drive.', freq: 'Weekly (Push A)', date: '2026-09-30', done: false },
  { id: 'g_squat', category: 'gym', title: 'Barbell Squat 100kg Below Parallel', desc: 'Full depth knee flexion, bracing intra-abdominal pressure.', freq: 'Weekly (Legs A/B)', date: '2026-09-30', done: false },
  { id: 'g_ppl_split', category: 'gym', title: '6-Day PPL + Arms Hypertrophy Consistency', desc: 'Follow exact Metallicadpa Linear Progression without skipping workouts.', freq: '6x / Week', date: '2026-12-31', done: false },
  { id: 'g_peel', category: 'skin', title: 'AHA 30% + BHA 2% Chemical Peel Cycle', desc: '10-min peel every 14 days strictly timed. Accelerates cellular turnover and clears hyperpigmentation.', freq: 'Every 14 Days', date: '2026-08-29', done: false },
  { id: 'g_spf', category: 'skin', title: 'Daily SPF 50 Broad Spectrum (AM + 1:30 PM)', desc: 'Lakmé SPF 50 applied on face, neck, arms, and hands twice daily.', freq: 'Daily (2x/day)', date: '2026-12-31', done: false },
  { id: 'g_skin_rot', category: 'skin', title: 'Night Actives Rotation (Kojic/Azelaic/Glycolic/B12)', desc: 'Follow weekly PM schedule for post-inflammatory erythema clearing and barrier strength.', freq: 'Daily PM', date: '2026-12-31', done: false },
  { id: 'g_lips', category: 'skin', title: 'Nicole Lip Scrub + Vaseline Occlusive Seal', desc: 'Gentle lip exfoliation and overnight moisture seal for smooth, natural pink lips.', freq: '2x / Week (Tue & Sat)', date: '2026-12-31', done: false },
  { id: 'g_minox', category: 'grooming', title: 'Minoxidil 5% Beard & Temple Density', desc: 'Nightly application on temple hairline corners and beard density zones.', freq: 'Daily PM', date: '2026-12-31', done: false },
  { id: 'g_fade', category: 'grooming', title: 'Haircut & Beard Clean Taper Fade', desc: 'Sharp neckline line-up, faded sideburns, and clean groomed beard silhouette.', freq: 'Every 14 Days', date: '2026-08-22', done: false },
  { id: 'g_sleep', category: 'health', title: '7.5h–8.5h Deep Sleep & 23:00 Bedtime Anchor', desc: 'Pitch dark bedroom, nasal mouth tape, phone outside room. Growth hormone recovery.', freq: 'Daily', date: '2026-12-31', done: false },
  { id: 'g_water', category: 'health', title: '3.0 Liters Hydration & Electrolyte Flush', desc: 'Consistent hydration pacing throughout the day to flush sodium and prevent face bloat.', freq: 'Daily', date: '2026-12-31', done: false },
  { id: 'g_abstinence', category: 'health', title: 'Dopamine Mastery & Cumulative Momentum', desc: 'Transmute sexual and mental energy into gym strength, coding focus, and magnetic presence.', freq: 'Daily Discipline', date: '2026-12-31', done: false }
];
