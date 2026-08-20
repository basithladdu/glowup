import { useGlowUpStore } from '../store/useGlowUpStore';
import { findMissedToday } from './dataQuery';

const EXPECTED_HABITS = ['h_spf', 'h_minox', 'h_creatine', 'h_castoroil'];

/** Single source of truth for "what hasn't been logged yet today" — used by both the ADHD
 * poke panel and the nav tab badge, so they can never drift out of sync with each other. */
export function usePokeItems(): string[] {
  const { selectedDate, state, getDayState } = useGlowUpStore();
  const dayState = getDayState();
  const isToday = selectedDate === new Date().toISOString().slice(0, 10);
  if (!isToday) return [];

  const missedHabits = findMissedToday(state, selectedDate, EXPECTED_HABITS);
  const amStepsDone = Object.values(dayState.amSkinSteps || {}).filter(Boolean).length;
  const pmStepsDone = Object.values(dayState.pmSkinSteps || {}).filter(Boolean).length;
  const nowHour = new Date().getHours();

  const items: string[] = [...missedHabits];
  if (nowHour >= 10 && amStepsDone < 6) items.push(`AM Skincare (${amStepsDone}/6 steps)`);
  if (nowHour >= 21 && pmStepsDone < 7) items.push(`PM Skincare (${pmStepsDone}/7 steps)`);

  const daysSinceCadence = (id: string) => {
    const d = (state.cadenceLog?.[id] || [])[0];
    return d ? (Date.now() - new Date(d).getTime()) / 86400000 : 999;
  };
  if (daysSinceCadence('nails_trim') >= 7) items.push('Nail Trim (weekly)');
  if (daysSinceCadence('haircut_fade') >= 14) items.push('Haircut & Fade (14-day)');

  const lastPhoto = (state.progressPhotoDates || [])[0];
  const daysSincePhoto = lastPhoto ? (Date.now() - new Date(lastPhoto).getTime()) / 86400000 : 999;
  if (daysSincePhoto >= 14) items.push('Progress Photo (fortnightly)');

  return items;
}
