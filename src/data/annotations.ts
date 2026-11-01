export const MARK_COLORS = { gold: { name: 'Dourado', fill: '#F3D680', night: '#F3D680', day: '#735200' }, green: { name: 'Verde', fill: '#A7DCC1', night: '#A7DCC1', day: '#1D6646' }, blue: { name: 'Azul', fill: '#A9CFEF', night: '#A9CFEF', day: '#245B8A' }, pink: { name: 'Rosa', fill: '#EDBAD2', night: '#EDBAD2', day: '#8C315D' } } as const;
export type MarkColor = keyof typeof MARK_COLORS;
export type MarkStyle = 'highlight' | 'underline' | 'bold';
export const MARK_STYLES: { id: MarkStyle; name: string }[] = [{id:'highlight',name:'Realce'},{id:'underline',name:'Sublinhado'},{id:'bold',name:'Negrito'}];
export interface Annotation { id: string; reference: string; start: number; end: number; quote: string; color: MarkColor; style: MarkStyle; note: string; createdAt: string }
export function wordsWithOffsets(text: string) { return Array.from(text.matchAll(/\S+/g), m => ({ text: m[0], start: m.index!, end: m.index! + m[0].length })); }
export function validRange(text: string, start: number, end: number) { return Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end <= text.length && start < end && !!text.slice(start,end).trim(); }
export function annotationSegments(text: string, marks: Annotation[]) {
  const valid=marks.filter(m=>validRange(text,m.start,m.end) && text.slice(m.start,m.end)===m.quote);
  const points=[...new Set([0,text.length,...valid.flatMap(m=>[m.start,m.end])])].sort((a,b)=>a-b);
  return points.slice(0,-1).map((start,i)=>{const end=points[i+1];return {text:text.slice(start,end),mark:[...valid].reverse().find(m=>m.start<=start&&m.end>=end)};});
}
