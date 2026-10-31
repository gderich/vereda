import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPlan, getPlanChapters, getNextChapter } from '../data/plans';

export interface PlanProgress {
  planId: string;
  completedChapters: string[];
  startedAt: string;
  completedAt: string | null;
}
interface PlanState {
  activePlanId: string | null;
  userPlans: Record<string, PlanProgress>;
  setActivePlan: (id: string) => void;
  completeChapter: (id: string, bookId: string, chapter: number) => { awarded: boolean; finished: boolean };
}
export const usePlanStore = create<PlanState>()(persist((set, get) => ({
  activePlanId: 'bom-completo',
  userPlans: {},
  setActivePlan: id => {
    if (!getPlan(id)) return;
    set(state => ({ activePlanId: id, userPlans: {
      ...state.userPlans,
      [id]: state.userPlans[id] ?? { planId: id, completedChapters: [], startedAt: new Date().toISOString(), completedAt: null },
    } }));
  },
  completeChapter: (id, bookId, chapter) => {
    const plan = getPlan(id);
    if (!plan || !getPlanChapters(plan).some(c => c.bookId === bookId && c.chapter === chapter)) return { awarded: false, finished: false };
    get().setActivePlan(id);
    const progress = get().userPlans[id];
    const key = `${bookId}:${chapter}`;
    if (progress.completedChapters.includes(key)) return { awarded: false, finished: Boolean(progress.completedAt) };
    const completedChapters = [...progress.completedChapters, key];
    const finished = getNextChapter(plan, completedChapters) === null;
    set(state => ({ userPlans: { ...state.userPlans, [id]: {
      ...progress, completedChapters, completedAt: finished ? new Date().toISOString() : null,
    } } }));
    return { awarded: true, finished };
  },
}), { name: 'tether-plan-storage', storage: createJSONStorage(() => AsyncStorage) }));
