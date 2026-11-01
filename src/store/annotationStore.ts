import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Annotation, MarkColor, MarkStyle, MARK_COLORS, MARK_STYLES, validRange } from '../data/annotations';
import { getBook } from '../data/books';
interface State { marks: Annotation[]; save: (reference: string, text: string, start: number, end: number, color: MarkColor, style: MarkStyle, note: string) => boolean; remove: (id: string) => void }
export const useAnnotationStore = create<State>()(persist((set,get)=>({
  marks: [],
  save: (reference,text,start,end,color,style,note) => {
    const [id,c,v]=reference.split(':'); const book=getBook(id);
    if (!book || reference.split(':').length!==3 || !Number.isInteger(+c) || +c<1 || +c>book.chapters || !Number.isInteger(+v) || +v<1 || +v>200 || !validRange(text,start,end) || !Object.prototype.hasOwnProperty.call(MARK_COLORS,color) || !MARK_STYLES.some(s=>s.id===style)) return false;
    const old=get().marks.find(m=>m.reference===reference&&m.start===start&&m.end===end);
    const mark:Annotation={id:old?.id||`${Date.now()}-${Math.random().toString(36).slice(2)}`,reference,start,end,quote:text.slice(start,end),color,style,note:note.trim().slice(0,500),createdAt:old?.createdAt||new Date().toISOString()};
    set({marks:[...get().marks.filter(m=>m.id!==mark.id),mark]});return true;
  },
  remove: id=>set({marks:get().marks.filter(m=>m.id!==id)}),
}),{name:'vereda-annotations-v1',storage:createJSONStorage(()=>AsyncStorage)}));
