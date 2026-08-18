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

export interface DayState {
  food: MacroItem[];
  habits: Record<string, boolean>;
  lifts: LiftSet[];
  grooming: Record<string, boolean>;
  timeline: Record<string, boolean>;
  symmetry: Record<string, boolean>;
  style: Record<string, boolean>;
  workoutRoutine: string | null;
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

export interface GlowUpState {
  days: Record<string, DayState>;
  weights: Record<string, number>;
  sleep: Record<string, { bed: string; wake: string; dur: number }>;
  content: Record<string, { topic: string; dur: number }>;
  water: Record<string, number>;
  liveSleep: string | null;
  meas: Array<{ d: string; shoulders: number; waist: number; arms?: number }>;
  milestones: GoalMilestone[];
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
