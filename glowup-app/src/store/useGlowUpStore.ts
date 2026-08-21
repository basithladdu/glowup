import { create } from 'zustand';
import type { GlowUpState, MacroItem, LiftSet, GoalMilestone, DayState, CustomProteinItem, CalendarEvent, InventoryItem } from '../types';
import { DEFAULT_GOALS, DEFAULT_INVENTORY } from '../lib/constants';
import { supabase } from '../lib/supabase';
import { saveLocalSnapshot, loadLocalSnapshot } from '../lib/localDB';
import { playSuccessChime } from '../lib/sound';
import { triggerConfetti, triggerGoalCelebration } from '../lib/confetti';

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
  inventory: JSON.parse(JSON.stringify(DEFAULT_INVENTORY)),
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
  addCustomRecipe: (recipe: CustomProteinItem) => void;
  deleteCustomRecipe: (id: string) => void;
  addCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
  toggleStepMicroCheck: (stepId: string, checkIdx: number, zone?: string, date?: string) => void;
  logProductUsage: (productId: string, productName: string, zone: string, checksCount: number, date?: string) => void;
  logProgressPhoto: (date?: string) => void;
  logCadence: (id: string, date?: string) => void;
  setInventoryStock: (id: string, inStock: boolean) => void;
  addInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  toggleStepEnabled: (stepId: string) => void;
}

export const useGlowUpStore = create<GlowUpStore>((set, get) => ({
  selectedDate: new Date().toISOString().slice(0, 10),
  state: getInitialState(),
  syncStatus: 'online',
  syncText: 'Loaded Locally',

  setSelectedDate: (date) => set({ selectedDate: date }),

  loadState: async () => {
    set({ syncStatus: 'syncing', syncText: 'Syncing...' });

    // IndexedDB is the primary local source of truth (durable, no size cap).
    // localStorage stays as a fallback for browsers without IndexedDB support.
    let localData: GlowUpState | null = await loadLocalSnapshot();
    if (!localData) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) localData = JSON.parse(stored);
      } catch (e) {}
    }

    let merged = localData || getInitialState();

    try {
      const { data, error } = await supabase.from('glowup_state').select('data').eq('id', 'basith').single();
      if (!error && data && data.data) {
        merged = { ...merged, ...data.data };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        saveLocalSnapshot(merged);
        set({ state: merged, syncStatus: 'online', syncText: 'Cloud Synced' });
        return;
      }
    } catch (err) {}

    set({ state: merged, syncStatus: 'online', syncText: localData ? 'Local (Offline)' : 'Local Storage' });
  },

  saveState: async (meta) => {
    const currentState = get().state;
    const date = get().selectedDate;
    set({ syncStatus: 'syncing', syncText: 'Saving...' });

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    } catch (e) {}
    saveLocalSnapshot(currentState);

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
      if (goal.done) {
        playSuccessChime();
        triggerGoalCelebration();
      }
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
    triggerConfetti();
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
  },

  addCustomRecipe: (recipe) => {
    const state = { ...get().state };
    state.customRecipes = state.customRecipes || [];
    state.customRecipes.push(recipe);
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'nutrition', item: recipe.id, exact_update: `Added custom protein recipe ${recipe.n}` });
  },

  deleteCustomRecipe: (id) => {
    const state = { ...get().state };
    state.customRecipes = (state.customRecipes || []).filter(r => r.id !== id);
    set({ state });
    get().saveState({ area: 'nutrition', item: id, exact_update: `Deleted custom recipe ${id}` });
  },

  addCalendarEvent: (event) => {
    const state = { ...get().state };
    state.customEvents = state.customEvents || [];
    state.customEvents.push(event);
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'calendar', item: event.id, exact_update: `Created calendar event: ${event.title}` });
  },

  deleteCalendarEvent: (id) => {
    const state = { ...get().state };
    state.customEvents = (state.customEvents || []).filter(e => e.id !== id);
    set({ state });
    get().saveState({ area: 'calendar', item: id, exact_update: `Deleted calendar event ${id}` });
  },

  toggleStepMicroCheck: (stepId, checkIdx, zone = 'Target Zone', date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    const day = state.days[d] || getInitialDayState();
    day.stepMicroChecks = day.stepMicroChecks || {};
    const key = `${stepId}_${checkIdx}`;
    const nextVal = !day.stepMicroChecks[key];
    day.stepMicroChecks[key] = nextVal;
    
    // Update telemetry if checking
    if (nextVal) {
      day.productTelemetry = day.productTelemetry || {};
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const record = {
        timestamp: now.toISOString(),
        formattedTime: `${dateStr}, ${timeStr}`,
        zone,
        checksCount: Object.keys(day.stepMicroChecks).filter(k => k.startsWith(stepId) && day.stepMicroChecks?.[k]).length
      };

      const existing = day.productTelemetry[stepId] || { count: 0, lastUsed: record.formattedTime, history: [] };
      day.productTelemetry[stepId] = {
        count: existing.count + 1,
        lastUsed: record.formattedTime,
        history: [record, ...(existing.history || []).slice(0, 9)]
      };
      playSuccessChime();
    }

    state.days[d] = day;
    set({ state });
    get().saveState({ area: 'microcheck', item: key, exact_update: `Check ${checkIdx} for ${stepId}` });
  },

  logProductUsage: (productId, productName, zone, checksCount, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    const day = state.days[d] || getInitialDayState();
    day.productTelemetry = day.productTelemetry || {};
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    const record = {
      timestamp: now.toISOString(),
      formattedTime: `${dateStr}, ${timeStr}`,
      zone,
      checksCount
    };

    const existing = day.productTelemetry[productId] || { count: 0, lastUsed: record.formattedTime, history: [] };
    day.productTelemetry[productId] = {
      count: existing.count + 1,
      lastUsed: record.formattedTime,
      history: [record, ...(existing.history || []).slice(0, 9)]
    };

    state.days[d] = day;
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'telemetry', item: productId, exact_update: `Logged product ${productName} on ${zone}` });
  },

  logProgressPhoto: (date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.progressPhotoDates = state.progressPhotoDates || [];
    if (!state.progressPhotoDates.includes(d)) {
      state.progressPhotoDates = [d, ...state.progressPhotoDates].slice(0, 60);
    }
    set({ state });
    playSuccessChime();
    triggerGoalCelebration();
    get().saveState({ area: 'body', item: 'progress-photo', exact_update: `Logged progress photo taken on ${d}` });
  },

  // Cross-day cadence log (nail trims, haircuts, etc.) — separate from productTelemetry, which
  // lives inside per-day DayState and resets every day, so it can't track a weekly/14-day cycle.
  logCadence: (id, date) => {
    const d = date || get().selectedDate;
    const state = { ...get().state };
    state.cadenceLog = state.cadenceLog || {};
    state.cadenceLog[id] = state.cadenceLog[id] || [];
    if (!state.cadenceLog[id].includes(d)) {
      state.cadenceLog[id] = [d, ...state.cadenceLog[id]].slice(0, 30);
    }
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'cadence', item: id, exact_update: `Logged cadence task ${id} on ${d}` });
  },

  // Inventory lives in the persisted store (not component state) so marking something
  // in/out of stock survives a reload and syncs across devices.
  setInventoryStock: (id, inStock) => {
    const state = { ...get().state };
    state.inventory = (state.inventory || DEFAULT_INVENTORY).map(i =>
      i.id === id ? { ...i, inStock } : i
    );
    set({ state });
    if (inStock) playSuccessChime();
    get().saveState({ area: 'inventory', item: id, exact_update: `${id} marked ${inStock ? 'in stock' : 'out of stock'}` });
  },

  addInventoryItem: (item) => {
    const state = { ...get().state };
    state.inventory = [item, ...(state.inventory || DEFAULT_INVENTORY)];
    set({ state });
    playSuccessChime();
    get().saveState({ area: 'inventory', item: item.id, exact_update: `Added ${item.name} to inventory` });
  },

  deleteInventoryItem: (id) => {
    const state = { ...get().state };
    state.inventory = (state.inventory || DEFAULT_INVENTORY).filter(i => i.id !== id);
    set({ state });
    get().saveState({ area: 'inventory', item: id, exact_update: `Removed ${id} from inventory` });
  },

  toggleStepEnabled: (stepId) => {
    const state = { ...get().state };
    const disabled = state.disabledSteps || [];
    const nowDisabled = !disabled.includes(stepId);
    state.disabledSteps = nowDisabled ? [...disabled, stepId] : disabled.filter(s => s !== stepId);
    set({ state });
    get().saveState({ area: 'routine', item: stepId, exact_update: `${stepId} ${nowDisabled ? 'removed from' : 'restored to'} routine` });
  }
}));
