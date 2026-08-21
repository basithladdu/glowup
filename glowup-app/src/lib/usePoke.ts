import { useGlowUpStore } from '../store/useGlowUpStore';
import { PRODUCT_FOR, DEFAULT_INVENTORY, AM_STEP_IDS, PM_STEP_IDS } from './constants';

/** Where tapping a poke item should take you to actually do something about it. */
export type PokeTab = 'habitkit' | 'skin' | 'body' | 'shopping';

export interface PokeItem {
  label: string;
  tab: PokeTab;
}

/** Daily habits expected every day, with the label and the tab that can tick them off. */
const EXPECTED_HABITS: Array<{ id: string; label: string; tab: PokeTab }> = [
  { id: 'h_spf', label: 'SPF sunscreen', tab: 'skin' },
  { id: 'h_minox', label: 'Minoxidil', tab: 'skin' },
  { id: 'h_castoroil', label: 'Castor oil on lashes/brows', tab: 'skin' },
  { id: 'h_creatine', label: 'Creatine', tab: 'habitkit' },
];

/** Single source of truth for "what hasn't been logged yet today" — used by the ADHD poke
 * panel, the nav tab badge, and the AI dossier export, so they can never drift apart. */
export function usePokeItems(): PokeItem[] {
  const { selectedDate, state, getDayState } = useGlowUpStore();
  const dayState = getDayState();
  const isToday = selectedDate === new Date().toISOString().slice(0, 10);
  if (!isToday) return [];

  const inventory = state.inventory || DEFAULT_INVENTORY;
  const isOutOfStock = (key: string) => {
    const prodId = PRODUCT_FOR[key];
    if (!prodId) return false;
    return inventory.find((i) => i.id === prodId)?.inStock === false;
  };

  // If you've run out of the product, nagging you to apply it is useless — the
  // actionable thing is restocking, so the item points at the Buy tab instead.
  // A habit you've removed must not keep showing up here.
  const disabled = state.disabledSteps || [];
  const items: PokeItem[] = EXPECTED_HABITS
    .filter((h) => !disabled.includes(h.id) && !dayState.habits?.[h.id])
    .map((h) => isOutOfStock(h.id)
      ? { label: `Buy ${h.label} — you're out`, tab: 'shopping' as PokeTab }
      : { label: h.label, tab: h.tab });

  // Counts derive from the steps you've actually kept, so switching a step off
  // immediately stops it counting against you.
  const amSteps = AM_STEP_IDS.filter((id) => !disabled.includes(id));
  const pmSteps = PM_STEP_IDS.filter((id) => !disabled.includes(id));
  const amDone = amSteps.filter((id) => dayState.amSkinSteps?.[id]).length;
  const pmDone = pmSteps.filter((id) => dayState.pmSkinSteps?.[id]).length;
  const nowHour = new Date().getHours();
  if (nowHour >= 10 && amSteps.length && amDone < amSteps.length) {
    items.push({ label: `AM Skincare (${amDone}/${amSteps.length} steps)`, tab: 'skin' });
  }
  if (nowHour >= 21 && pmSteps.length && pmDone < pmSteps.length) {
    items.push({ label: `PM Skincare (${pmDone}/${pmSteps.length} steps)`, tab: 'skin' });
  }

  const daysSinceCadence = (id: string) => {
    const d = (state.cadenceLog?.[id] || [])[0];
    return d ? (Date.now() - new Date(d).getTime()) / 86400000 : 999;
  };
  if (daysSinceCadence('nails_trim') >= 7) items.push({ label: 'Nail Trim (weekly)', tab: 'skin' });
  if (daysSinceCadence('haircut_fade') >= 14) items.push({ label: 'Haircut & Fade (14-day)', tab: 'skin' });

  const lastPhoto = (state.progressPhotoDates || [])[0];
  const daysSincePhoto = lastPhoto ? (Date.now() - new Date(lastPhoto).getTime()) / 86400000 : 999;
  if (daysSincePhoto >= 14) items.push({ label: 'Progress Photo (fortnightly)', tab: 'body' });

  return items;
}
