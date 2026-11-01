import { create } from 'zustand';
import { persist,createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { READING_CUES } from '../data/readingHabit';
interface State { cue:string;weeklyGoal:number;setCue:(cue:string)=>void;setWeeklyGoal:(n:number)=>void }
export const useReadingHabitStore=create<State>()(persist(set=>({cue:'',weeklyGoal:3,setCue:cue=>{if((READING_CUES as readonly string[]).includes(cue))set({cue});},setWeeklyGoal:n=>{if([3,5,7].includes(n))set({weeklyGoal:n});}}),{name:'vereda-reading-habit-v1',storage:createJSONStorage(()=>AsyncStorage)}));
