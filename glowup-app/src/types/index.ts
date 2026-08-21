export interface MacroItem {
  n: string;
  k: number;
  p: number;
  c: number;
  f: number;
}

export interface LiftSet {
  n: string;
  kg: number;
  reps: number;
  d?: string;
}

export interface ProductUsageRecord {
  timestamp: string; // ISO string
  formattedTime: string; // e.g. "Aug 20, 01:30 AM"
  zone: string; // anatomical target
  checksCount: number;
}

export interface DayState {
  food: MacroItem[];
  habits: Record<string, boolean>;
  lifts: LiftSet[];
  grooming: Record<string, boolean>;
  timeline: Record<string, boolean>;
  symmetry: Record<string, boolean>;
  style: Record<string, boolean>;
  workoutRoutine: string | null;
  amSkinSteps?: Record<string, boolean>;
  pmSkinSteps?: Record<string, boolean>;
  stepMicroChecks?: Record<string, boolean>; // key format: `stepId_checkIdx`
  productTelemetry?: Record<string, { count: number; lastUsed: string; history: ProductUsageRecord[] }>;
}

export interface GoalMilestone {
  id: string;
  category: 'gym' | 'skin' | 'grooming' | 'health';
  title: string;
  desc: string;
  freq: string;
  date: string;
  done: boolean;
}

export interface AbstinenceState {
  start: string;
  bankedDays: number;
  lastConfirm: string;
  reflections: Array<{ date: string; note: string }>;
}

export interface CalendarEvent {
  id: string;
  title: string;
  sub?: string;
  startHour: number; // e.g. 7.5 for 07:30
  endHour: number;   // e.g. 8.0 for 08:00
  color: 'indigo' | 'sage' | 'turmeric' | 'rose' | 'vermilion' | 'blue';
  category: 'sleep' | 'workout' | 'skincare' | 'nutrition' | 'habit' | 'content';
  date?: string; // specific date or null for daily recurring
}

export interface CustomProteinItem {
  id: string;
  n: string;
  k: number;
  p: number;
  c: number;
  f: number;
  cost: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'nutrition' | 'derm' | 'grooming';
  qty: string;
  estCost: string;
  inStock: boolean;
}

export interface GlowUpState {
  days: Record<string, DayState>;
  weights: Record<string, number>;
  sleep: Record<string, { bed: string; wake: string; dur: number }>;
  content: Record<string, { topic: string; dur: number }>;
  water: Record<string, number>;
  liveSleep: string | null;
  meas: Array<{ d: string; shoulders: number; waist: number; arms?: number }>;
  milestones: GoalMilestone[];
  customRecipes?: CustomProteinItem[];
  customEvents?: CalendarEvent[];
  progressPhotoDates?: string[];
  cadenceLog?: Record<string, string[]>;
  inventory?: InventoryItem[];
  peel: string;
  start: string;
  abstinence: AbstinenceState;
}

export interface ExerciseDefinition {
  name: string;
  sets: string;
  reps: string;
  cue: string;
  intensity?: string;
  isSuperset?: boolean;
  supersetLabel?: string;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  desc: string;
  badge: string;
  freq: string;
  exercises: ExerciseDefinition[];
}
