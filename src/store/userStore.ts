import { localDateKey } from '../utils/date';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  // Profile
  name: string;
  createdAt: string;

  // Gamification
  xp: number;
  level: number;
  streakDays: number;
  lastReadDate: string | null;
  maxStreak: number;
  gems: number;
  chaptersReadCount: number;

  // Settings
  notificationsEnabled: boolean;

  // Actions
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  addGems: (amount: number) => void;
  markChapterRead: (bookId: string, chapter: number) => void;
}

const INITIAL_STATE = {
  name: 'Discípulo',
  createdAt: new Date().toISOString(),
  xp: 0,
  level: 1,
  streakDays: 0,
  lastReadDate: null,
  maxStreak: 0,
  gems: 0,
  chaptersReadCount: 0,
  notificationsEnabled: false,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addXP: (amount: number) => {
        const currentXP = get().xp + amount;
        set({ xp: currentXP, level: Math.floor(currentXP / 200) + 1 });
      },

      incrementStreak: () => {
        const today = localDateKey(new Date());
        const lastRead = get().lastReadDate;

        if (lastRead === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = localDateKey(yesterday);

        let newStreak = get().streakDays;

        if (lastRead === yesterdayStr || lastRead === null) {
          newStreak += 1;
        } else if (lastRead !== today) {
          newStreak = 1;
        }

        const maxStreak = Math.max(newStreak, get().maxStreak);

        set({
          streakDays: newStreak,
          maxStreak,
          lastReadDate: today,
        });


      },

      addGems: (amount: number) => {
        set({ gems: get().gems + amount });
      },

      markChapterRead: (bookId: string, chapter: number) => {
        set({ chaptersReadCount: get().chaptersReadCount + 1 });
        get().incrementStreak();

        get().addGems(5);
      },
    }),
    {
      name: 'vereda-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);