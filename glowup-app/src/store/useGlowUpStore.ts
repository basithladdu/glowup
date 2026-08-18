import { create } from 'zustand';
import type { GlowUpState, MacroItem, LiftSet, GoalMilestone, DayState } from '../types';
import { DEFAULT_GOALS } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { playSuccessChime } from '../lib/sound';

const STORAGE_KEY = 'glowup-modular-v1';

const getInitialDayState = (): DayState => ({
  food: [],
  habits: {},
  lifts: [],
  grooming: {},
  timeline: {},
  symmetry: {},
  style: {},
  workoutRoutine: null
});

const getInitialState = (): GlowUpState => ({
  days: {},
  weights: {},
  sleep: {},
  content: {},
  water: {},
  liveSleep: null,
  meas: [],
  milestones: JSON.parse(JSON.stringify(DEFAULT_GOALS)),
  peel: '2026-08-15',
  start: '2026-08-18',
  abstinence: {
    start: '2026-08-04',
    bankedDays: 14,
    lastConfirm: '2026-08-18',
    reflections: []
  }
});

interface GlowUpStore {
  selectedDate: string;
  state: GlowUpState;
  syncStatus: 'online' | 'syncing' | 'offline';
  syncText: string;
  setSelectedDate: (date: string) => void;
  loadState: () => Promise<void>;
  saveState: (meta?: { area: string; item: string; exact_update: string }) => Promise<void>;
  
  // Helpers
  getDayState: (date?: string) => DayState;
  getDayTotals: (date?: string) => { k: number; p: number; c: number; f: number };
  
  // Actions
  addFoodItems: (items: MacroItem[], date?: string) => void;
  removeFoodItem: (index: number, date?: string) => void;
  toggleTimelineEvent: (eventId: string, date?: string) => void;
  toggleHabit: (habitId: string, date?: string) => void;
  toggleGrooming: (id: string, date?: string) => void;
  logLiftSet: (set: LiftSet, date?: string) => void;
  setWorkoutRoutine: (routineId: string | null, date?: string) => void;
  toggleGoal: (goalId: string) => void;
  addGoal: (goal: GoalMilestone) => void;
  deleteGoal: (goalId: string) => void;
  bankEnergyDay: (date?: string) => void;
  logReflection: (note: string, date?: string) => void;
  setLiveSleep: (timestamp: string | null) => void;
  logMorningWeight: (weight: number, date?: string) => void;
  logWater: (ml: number, date?: string) => void;
}

export const useGlowUpStore = create<GlowUpStore>((set, get) => ({
  selectedDate: new Date().toISOString().slice(0, 10),
  state: getInitialState(),
  syncStatus: 'online',
  syncText: 'Loaded Locally',

  setSelectedDate: (date) => set({ selectedDate: date }),

  loadState: async () => {
    set({ syncStatus: 'syncing', syncText: 'Syncing...' });
    let localData: GlowUpState | null = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) localData = JSON.parse(stored);
    } catch (e) {}

    let merged = localData || getInitialState();

    try {
      const { data, error } = await supabase.from('glowup_state').select('data').eq('id', 'basith').single();
      if (!error && data && data.data) {
        merged = { ...merged, ...data.data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        set({ state: merged, syncStatus: 'online', syncText: 'Cloud Synced' });
        return;
      }
    } catch (err) {}

    set({ state: merged, syncStatus: 'online', syncText: 'Local Storage' });
  },

  saveState: async (meta) => {
    const currentState = get().state;
    const date = get().selectedDate;
    set({ syncStatus: 'syncing', syncText: 'Saving...' });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {}

    try {
      await supabase.from('glowup_state').upsert({
        id: 'basith',
        data: currentState,
        updated_at: new Date().toISOString()
      });

      if (meta) {
        await supabase.from('glowup_events').insert([{
          schema: 'glowup-event-v1',
          date: date,
          time: new Date().toTimeString().slice(0, 5),
          source: 'web-modular',
          area: meta.area || 'general',
          item: meta.item || '',
          status: 'done',
          exact_update: meta.exact_update || ''
        }]);
      }
      set({ syncStatus: 'online', syncText: 'Cloud Synced' });
    } catch (e) {
      set({ syncStatus: 'offline', syncText: 'Saved Locally' });
    }
  },

  getDayState: (date) => {
    const d = date || get().selectedDate;
    const currentState = get().state;
    return currentState.days[d] || getInitialDayState();
  },

  getDayTotals: (date) => {
    const dayState = get().getDayState(date);
    return dayState.food.reduce((acc, f) => ({
      k: acc.k + (Number(f.k) || 0),
      p: Number((acc.p + (Number(f.p) || 0)).toFixed(1)),
      c: Number((acc.c + (Number(f.c) || 0)).toFixed(1)),
      f: Number((acc.f + (Number(f.f) || 0)).toFixed(1))
    }), { k: 0, p: 0, c: 0, f: 0 });
  },

  addFoodItems: (items, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.days[d] = state.days[d] || getInitialDayState();
    state.days[d].food = [...state.days[d].food, ...items];
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'nutrition', item: 'food-log', exact_update: `Logged ${items.length} items` });
  },

  removeFoodItem: (index, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    if (state.days[d]?.food) {
      state.days[d].food.splice(index, 1);
      set({ state });
      get().saveState({ area: 'nutrition', item: 'food-remove', exact_update: `Removed food item at index ${index}` });
    }
  },

  toggleTimelineEvent: (eventId, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.days[d] = state.days[d] || getInitialDayState();
    state.days[d].timeline = state.days[d].timeline || {};
    state.days[d].timeline[eventId] = !state.days[d].timeline[eventId];
    set({ state });
    if (state.days[d].timeline[eventId]) playSuccessChime();
    get().saveState({ area: 'timeline', item: eventId, exact_update: `Toggled ${eventId}` });
  },

  toggleHabit: (habitId, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.days[d] = state.days[d] || getInitialDayState();
    state.days[d].habits = state.days[d].habits || {};
    state.days[d].habits[habitId] = !state.days[d].habits[habitId];
    set({ state });
    if (state.days[d].habits[habitId]) playSuccessChime();
    get().saveState({ area: 'habits', item: habitId, exact_update: `Toggled habit ${habitId}` });
  },

  toggleGrooming: (id, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.days[d] = state.days[d] || getInitialDayState();
    state.days[d].grooming = state.days[d].grooming || {};
    state.days[d].grooming[id] = !state.days[d].grooming[id];
    set({ state });
    if (state.days[d].grooming[id]) playSuccessChime();
    get().saveState({ area: 'grooming', item: id, exact_update: `Toggled grooming ${id}` });
  },

  logLiftSet: (liftSet, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.days[d] = state.days[d] || getInitialDayState();
    state.days[d].lifts = [...state.days[d].lifts, { ...liftSet, d }];
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'lifts', item: liftSet.n, exact_update: `Logged set ${liftSet.kg}kg x ${liftSet.reps}` });
  },

  setWorkoutRoutine: (routineId, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.days[d] = state.days[d] || getInitialDayState();
    state.days[d].workoutRoutine = routineId;
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'lifts', item: 'routine-select', exact_update: `Selected workout routine ${routineId || 'auto'}` });
  },

  toggleGoal: (goalId) => {
    const state = { ...get().state };
    const goal = state.milestones.find(g => g.id === goalId);
    if (goal) {
      goal.done = !goal.done;
      set({ state });
      if (goal.done) playSuccessChime();
      get().saveState({ area: 'goals', item: goalId, exact_update: `Toggled goal ${goal.title}: ${goal.done ? 'completed' : 'pending'}` });
    }
  },

  addGoal: (goal) => {
    const state = { ...get().state };
    state.milestones = [...state.milestones, goal];
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'goals', item: goal.id, exact_update: `Added goal ${goal.title}` });
  },

  deleteGoal: (goalId) => {
    const state = { ...get().state };
    state.milestones = state.milestones.filter(g => g.id !== goalId);
    set({ state });
    get().saveState({ area: 'goals', item: goalId, exact_update: `Deleted goal ${goalId}` });
  },

  bankEnergyDay: (date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.abstinence = state.abstinence || { start: '2026-08-04', bankedDays: 14, lastConfirm: d, reflections: [] };
    state.abstinence.bankedDays = (state.abstinence.bankedDays || 14) + 1;
    state.abstinence.lastConfirm = d;
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'abstinence', item: 'bank-day', exact_update: `Banked day ${state.abstinence.bankedDays} (+100 XP)` });
  },

  logReflection: (note, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.abstinence = state.abstinence || { start: '2026-08-04', bankedDays: 14, lastConfirm: d, reflections: [] };
    state.abstinence.reflections = state.abstinence.reflections || [];
    state.abstinence.reflections.push({ date: d, note });
    set({ state });
    get().saveState({ area: 'abstinence', item: 'reflection', exact_update: `Logged reflection: ${note}` });
  },

  setLiveSleep: (timestamp) => {
    const state = { ...get().state, liveSleep: timestamp };
    set({ state });
    get().saveState({ area: 'sleep', item: 'live-sleep', exact_update: timestamp ? 'Started sleep timer' : 'Stopped sleep timer' });
  },

  logMorningWeight: (weight, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.weights[d] = weight;
    set({ state });
    get().saveState({ area: 'body', item: 'weight', exact_update: `Logged weight ${weight}kg` });
  },

  logWater: (ml, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.water[d] = (state.water[d] || 0) + ml;
    set({ state });
    get().saveState({ area: 'hydration', item: 'water', exact_update: `Logged ${ml}ml water` });
  }
}));
