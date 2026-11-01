import { ALL_BOOKS, getBook } from './books';
import { localDateKey } from '../utils/date';
export const READING_CUES = ['Depois de acordar', 'Depois do almoço', 'Antes de dormir'] as const;
export function recentReadingDays(days: Record<string,string[]>, now = new Date()) {
  return Array.from({length:7},(_,i)=>{const d=new Date(now);d.setDate(d.getDate()-6+i);const key=localDateKey(d);return {key,label:d.toLocaleDateString('pt-BR',{weekday:'short'}),read:!!days[key]?.length};});
}
export function nextReading(last: {bookId:string;chapter:number}|null, log: Record<string,string>) {
  if(!last || !getBook(last.bookId))return {bookId:'1ne',chapter:1};
  if(!log[`${last.bookId}:${last.chapter}`])return last;
  const book=getBook(last.bookId)!;
  if(last.chapter<book.chapters)return {bookId:last.bookId,chapter:last.chapter+1};
  const books=ALL_BOOKS.filter(b=>b.testament===book.testament),i=books.findIndex(b=>b.id===book.id);
  return {bookId:books[(i+1)%books.length].id,chapter:1};
}
