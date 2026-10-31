import { getLesson } from "../data/lessons";
import { localDateKey } from "../utils/date";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  dailyGoal: number;
  lessonCompletions: Record<string, string>;
  studyDays: Record<string, string[]>;
  reflections: Record<string, string>;
  setDailyGoal: (goal: number) => void;
  saveReflection: (id: string, text: string) => void;
  finishLesson: (
    id: string,
    answers: number[],
  ) => { completed: boolean; xp: number };

  // Settings
  notificationsEnabled: boolean;

  // Actions
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  addGems: (amount: number) => void;
  markChapterRead: (bookId: string, chapter: number) => void;
}

const INITIAL_STATE = {
  name: "Discípulo",
  createdAt: new Date().toISOString(),
  xp: 0,
  level: 1,
  streakDays: 0,
  lastReadDate: null,
  maxStreak: 0,
  gems: 0,
  chaptersReadCount: 0,
  notificationsEnabled: false,
  dailyGoal: 1,
  lessonCompletions: {} as Record<string, string>,
  studyDays: {} as Record<string, string[]>,
  reflections: {} as Record<string, string>,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setDailyGoal: (goal) => {
        if ([1, 2, 3].includes(goal)) set({ dailyGoal: goal });
      },
      saveReflection: (id, text) => {
        if (getLesson(id))
          set({
            reflections: { ...get().reflections, [id]: text.slice(0, 2000) },
          });
      },
      finishLesson: (id, answers) => {
        const lesson = getLesson(id);
        if (
          !lesson ||
          answers.length !== lesson.questions.length ||
          lesson.questions.some((q, i) => q.answer !== answers[i])
        )
          return { completed: false, xp: 0 };
        const state = get();
        const today = localDateKey(new Date());
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const xp = state.lessonCompletions[id] ? 0 : 30;
        const streak =
          state.lastReadDate === today
            ? state.streakDays
            : state.lastReadDate === localDateKey(yesterday)
              ? state.streakDays + 1
              : 1;
        const total = state.xp + xp;
        set({
          xp: total,
          level: Math.floor(total / 200) + 1,
          lessonCompletions: {
            ...state.lessonCompletions,
            [id]: state.lessonCompletions[id] || today,
          },
          studyDays: {
            ...state.studyDays,
            [today]: [...new Set([...(state.studyDays[today] || []), id])],
          },
          streakDays: streak,
          maxStreak: Math.max(state.maxStreak, streak),
          lastReadDate: today,
        });
        return { completed: true, xp };
      },
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
      name: "vereda-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
