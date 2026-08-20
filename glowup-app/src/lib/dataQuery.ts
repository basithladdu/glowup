// Flattens the whole GlowUp state into searchable "facts" so questions like
// "did I do castor oil this week" or "when did I last log chicken" can be
// answered by scanning local data directly — no server round-trip, no vector
// DB, just a grounded lookup over everything that's actually been logged.
import type { GlowUpState } from '../types';

export interface DataFact {
  date: string;
  area: string;
  text: string;
  done: boolean;
}

const HABIT_LABELS: Record<string, string> = {
  h_spf: 'SPF sunscreen applied',
  h_minox: 'Minoxidil applied',
  h_creatine: 'Creatine taken',
  h_castoroil: 'Castor oil on lashes/brows',
};

export function flattenState(state: GlowUpState): DataFact[] {
  const facts: DataFact[] = [];

  for (const [date, day] of Object.entries(state.days || {})) {
    for (const [id, val] of Object.entries(day.habits || {})) {
      facts.push({ date, area: 'habit', text: HABIT_LABELS[id] || id, done: !!val });
    }
    for (const [id, val] of Object.entries(day.amSkinSteps || {})) {
      facts.push({ date, area: 'skincare-am', text: id.replace(/_/g, ' '), done: !!val });
    }
    for (const [id, val] of Object.entries(day.pmSkinSteps || {})) {
      facts.push({ date, area: 'skincare-pm', text: id.replace(/_/g, ' '), done: !!val });
    }
    for (const [id, val] of Object.entries(day.grooming || {})) {
      facts.push({ date, area: 'grooming', text: id.replace(/_/g, ' '), done: !!val });
    }
    for (const item of day.food || []) {
      facts.push({ date, area: 'food', text: `${item.n} (${item.k}kcal, ${item.p}g protein)`, done: true });
    }
    for (const lift of day.lifts || []) {
      facts.push({ date, area: 'lift', text: `${lift.n} ${lift.kg}kg x ${lift.reps}`, done: true });
    }
    for (const [key, tel] of Object.entries(day.productTelemetry || {})) {
      facts.push({ date, area: 'product', text: `${key.replace(/_/g, ' ')} used ${tel.count}x, last ${tel.lastUsed}`, done: true });
    }
    if (day.workoutRoutine) {
      facts.push({ date, area: 'workout', text: `Workout routine: ${day.workoutRoutine}`, done: true });
    }
  }

  for (const [date, w] of Object.entries(state.weights || {})) {
    facts.push({ date, area: 'weight', text: `Weighed ${w}kg`, done: true });
  }
  for (const [date, ml] of Object.entries(state.water || {})) {
    facts.push({ date, area: 'water', text: `Drank ${ml}ml`, done: true });
  }
  for (const [date, s] of Object.entries(state.sleep || {})) {
    facts.push({ date, area: 'sleep', text: `Slept ${s.bed} → ${s.wake} (${s.dur}h)`, done: true });
  }
  for (const date of state.progressPhotoDates || []) {
    facts.push({ date, area: 'photo', text: 'Progress photo taken', done: true });
  }
  for (const g of state.milestones || []) {
    facts.push({ date: g.date, area: 'goal', text: `${g.title} — ${g.done ? 'done' : 'pending'}`, done: g.done });
  }

  return facts.sort((a, b) => b.date.localeCompare(a.date));
}

/** Simple keyword scoring — grounded lookup, not generative. Returns top matches. */
export function queryLocalData(state: GlowUpState, query: string, limit = 25): DataFact[] {
  const facts = flattenState(state);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return facts.slice(0, limit);

  const scored = facts
    .map(f => {
      const hay = `${f.area} ${f.text} ${f.date}`.toLowerCase();
      const score = terms.reduce((acc, t) => acc + (hay.includes(t) ? 1 : 0), 0);
      return { f, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || b.f.date.localeCompare(a.f.date));

  return scored.slice(0, limit).map(x => x.f);
}

/** Which of today's known checklist items were NOT logged — the "poke me" list. */
export function findMissedToday(state: GlowUpState, date: string, expectedHabitIds: string[]): string[] {
  const day = state.days?.[date];
  if (!day) return expectedHabitIds.map(id => HABIT_LABELS[id] || id);
  return expectedHabitIds
    .filter(id => !day.habits?.[id])
    .map(id => HABIT_LABELS[id] || id);
}
