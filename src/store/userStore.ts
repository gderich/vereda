import { getBook } from "../data/books";
import { dailyQuestions } from "../data/challenge";
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

  readingLedgerMigrated: boolean;
  migrateReadings: (chapters:string[]) => void;
  readingLog: Record<string, string>;
  readingDays: Record<string, string[]>;
  reflectionDays: Record<string, boolean>;
  challengeDays: Record<string, number>;
  claimedMissions: string[];
  bookmarks: string[];
  lastChapter: { bookId: string; chapter: number } | null;
  readerFont: number;
  readerTheme: "night" | "sepia";
  soundVolume: number;
  recordReading: (bookId: string, chapter: number) => number;
  finishChallenge: (
    date: string,
    answers: number[],
  ) => { xp: number; score: number };
  claimMissions: () => number;
  toggleBookmark: (key: string) => void;
  soundsEnabled: boolean;
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
  readingLedgerMigrated: false,
  readingLog: {} as Record<string, string>,
  readingDays: {} as Record<string, string[]>,
  reflectionDays: {} as Record<string, boolean>,
  challengeDays: {} as Record<string, number>,
  claimedMissions: [] as string[],
  bookmarks: [] as string[],
  lastChapter: null as { bookId: string; chapter: number } | null,
  readerFont: 22,
  readerTheme: "night" as "night" | "sepia",
  soundVolume: 0.8,
  soundsEnabled: true,
  dailyGoal: 1,
  lessonCompletions: {} as Record<string, string>,
  studyDays: {} as Record<string, string[]>,
  reflections: {} as Record<string, string>,
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      migrateReadings: (chapters) => {
        if(get().readingLedgerMigrated)return;
        const previous:Record<string,string>={};
        for(const key of chapters){const [id,c]=key.split(':');const book=getBook(id),chapter=Number(c);if(book&&Number.isInteger(chapter)&&chapter>=1&&chapter<=book.chapters)previous[key]=get().lastReadDate||localDateKey(new Date());}
        set({readingLog:{...previous,...get().readingLog},readingLedgerMigrated:true});
      },
      toggleBookmark: (key) =>
        set({
          bookmarks: get().bookmarks.includes(key)
            ? get().bookmarks.filter((k) => k !== key)
            : [...get().bookmarks, key],
        }),
      recordReading: (bookId, chapter) => {
        const book = getBook(bookId);
        if (
          !book ||
          !Number.isInteger(chapter) ||
          chapter < 1 ||
          chapter > book.chapters
        )
          return 0;
        const state = get(),
          key = `${bookId}:${chapter}`,
          today = localDateKey(new Date());
        const earned = state.readingLog[key] ? 0 : 15;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const streak =
          state.lastReadDate === today
            ? state.streakDays
            : state.lastReadDate === localDateKey(yesterday)
              ? state.streakDays + 1
              : 1;
        set({
          readingLog: {
            ...state.readingLog,
            [key]: state.readingLog[key] || today,
          },
          readingDays: {
            ...state.readingDays,
            [today]: [...new Set([...(state.readingDays[today] || []), key])],
          },
          lastChapter: { bookId, chapter },
          xp: state.xp + earned,
          level: Math.floor((state.xp + earned) / 200) + 1,
          chaptersReadCount: state.chaptersReadCount + (earned ? 1 : 0),
          streakDays: streak,
          maxStreak: Math.max(streak, state.maxStreak),
          lastReadDate: today,
        });
        return earned;
      },
      finishChallenge: (date, answers) => {
        const questions = dailyQuestions(date);
        if (
          date !== localDateKey(new Date()) ||
          answers.length !== questions.length ||
          answers.some(
            (a, i) =>
              !Number.isInteger(a) || a < 0 || a >= questions[i].options.length,
          )
        )
          return { xp: 0, score: 0 };
        const score = questions.filter(
            (q, i) => q.answer === answers[i],
          ).length,
          state = get();
        const xp = state.challengeDays[date] !== undefined ? 0 : 10 + score * 4;
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const streak =
          state.lastReadDate === date
            ? state.streakDays
            : state.lastReadDate === localDateKey(yesterday)
              ? state.streakDays + 1
              : 1;
        set({
          xp: state.xp + xp,
          level: Math.floor((state.xp + xp) / 200) + 1,
          challengeDays: {
            ...state.challengeDays,
            [date]: Math.max(score, state.challengeDays[date] || 0),
          },
          streakDays: streak,
          maxStreak: Math.max(streak, state.maxStreak),
          lastReadDate: date,
        });
        return { xp, score };
      },
      claimMissions: () => {
        const state = get(),
          today = localDateKey(new Date());
        if (
          state.claimedMissions.includes(today) ||
          !state.readingDays[today]?.length ||
          !(
            state.studyDays[today]?.length ||
            state.challengeDays[today] !== undefined
          ) ||
          !state.reflectionDays[today]
        )
          return 0;
        set({
          xp: state.xp + 25,
          level: Math.floor((state.xp + 25) / 200) + 1,
          claimedMissions: [...state.claimedMissions, today],
        });
        return 25;
      },
      setDailyGoal: (goal) => {
        if ([1, 2, 3].includes(goal)) set({ dailyGoal: goal });
      },
      saveReflection: (id, text) => {
        if (getLesson(id))
          set({
            reflections: { ...get().reflections, [id]: text.slice(0, 2000) },
            reflectionDays:
              text.trim().length >= 15
                ? { ...get().reflectionDays, [localDateKey(new Date())]: true }
                : get().reflectionDays,
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
