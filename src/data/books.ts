/**
 * Metadados dos livros das escrituras
 * Fonte: https://www.churchofjesuschrist.org/study/scriptures?lang=por
 * Apenas metadados; não contém o texto integral das escrituras.
 */

export interface Book {
  id: string;
  name: string;
  shortName: string;
  testament: 'old' | 'new' | 'bom';
  chapters: number;
  order: number;
  description?: string;
}

export const BOOK_OF_MORMON_BOOKS: Book[] = [
  { id: '1ne', name: '1 Néfi', shortName: '1 Né', testament: 'bom', chapters: 22, order: 1 },
  { id: '2ne', name: '2 Néfi', shortName: '2 Né', testament: 'bom', chapters: 33, order: 2 },
  { id: 'jac', name: 'Jacó', shortName: 'Jac', testament: 'bom', chapters: 7, order: 3 },
  { id: 'enos', name: 'Enos', shortName: 'Enos', testament: 'bom', chapters: 1, order: 4 },
  { id: 'jaro', name: 'Jarom', shortName: 'Jar', testament: 'bom', chapters: 1, order: 5 },
  { id: 'omni', name: 'Ômni', shortName: 'Ômni', testament: 'bom', chapters: 1, order: 6 },
  { id: 'wom', name: 'Palavras de Mórmon', shortName: 'PdM', testament: 'bom', chapters: 1, order: 7 },
  { id: 'mos', name: 'Mosias', shortName: 'Mos', testament: 'bom', chapters: 29, order: 8 },
  { id: 'alma', name: 'Alma', shortName: 'Alma', testament: 'bom', chapters: 63, order: 9 },
  { id: 'hela', name: 'Helamã', shortName: 'Hel', testament: 'bom', chapters: 16, order: 10 },
  { id: '3ne', name: '3 Néfi', shortName: '3 Né', testament: 'bom', chapters: 30, order: 11 },
  { id: '4ne', name: '4 Néfi', shortName: '4 Né', testament: 'bom', chapters: 1, order: 12 },
  { id: 'morm', name: 'Mórmon', shortName: 'Morm', testament: 'bom', chapters: 9, order: 13 },
  { id: 'ether', name: 'Éter', shortName: 'Éter', testament: 'bom', chapters: 15, order: 14 },
  { id: 'moro', name: 'Morôni', shortName: 'Mor', testament: 'bom', chapters: 10, order: 15 },
];

export const OLD_TESTAMENT_BOOKS: Book[] = [
  { id: 'gen', name: 'Gênesis', shortName: 'Gn', testament: 'old', chapters: 50, order: 1 },
  { id: 'exo', name: 'Êxodo', shortName: 'Êx', testament: 'old', chapters: 40, order: 2 },
  { id: 'lev', name: 'Levítico', shortName: 'Lv', testament: 'old', chapters: 27, order: 3 },
  { id: 'num', name: 'Números', shortName: 'Nm', testament: 'old', chapters: 36, order: 4 },
  { id: 'deu', name: 'Deuteronômio', shortName: 'Dt', testament: 'old', chapters: 34, order: 5 },
  { id: 'jos', name: 'Josué', shortName: 'Js', testament: 'old', chapters: 24, order: 6 },
  { id: 'jdg', name: 'Juízes', shortName: 'Jz', testament: 'old', chapters: 21, order: 7 },
  { id: 'rut', name: 'Rute', shortName: 'Rt', testament: 'old', chapters: 4, order: 8 },
  { id: '1sa', name: '1 Samuel', shortName: '1 Sm', testament: 'old', chapters: 31, order: 9 },
  { id: '2sa', name: '2 Samuel', shortName: '2 Sm', testament: 'old', chapters: 24, order: 10 },
  { id: '1ki', name: '1 Reis', shortName: '1 Rs', testament: 'old', chapters: 22, order: 11 },
  { id: '2ki', name: '2 Reis', shortName: '2 Rs', testament: 'old', chapters: 25, order: 12 },
  { id: '1ch', name: '1 Crônicas', shortName: '1 Cr', testament: 'old', chapters: 29, order: 13 },
  { id: '2ch', name: '2 Crônicas', shortName: '2 Cr', testament: 'old', chapters: 36, order: 14 },
  { id: 'ezr', name: 'Esdras', shortName: 'Ed', testament: 'old', chapters: 10, order: 15 },
  { id: 'neh', name: 'Neemias', shortName: 'Ne', testament: 'old', chapters: 13, order: 16 },
  { id: 'est', name: 'Ester', shortName: 'Et', testament: 'old', chapters: 10, order: 17 },
  { id: 'job', name: 'Jó', shortName: 'Jó', testament: 'old', chapters: 42, order: 18 },
  { id: 'psa', name: 'Salmos', shortName: 'Sl', testament: 'old', chapters: 150, order: 19 },
  { id: 'pro', name: 'Provérbios', shortName: 'Pv', testament: 'old', chapters: 31, order: 20 },
  { id: 'ecc', name: 'Eclesiastes', shortName: 'Ec', testament: 'old', chapters: 12, order: 21 },
  { id: 'son', name: 'Cantares', shortName: 'Ct', testament: 'old', chapters: 8, order: 22 },
  { id: 'isa', name: 'Isaías', shortName: 'Is', testament: 'old', chapters: 66, order: 23 },
  { id: 'jer', name: 'Jeremias', shortName: 'Jr', testament: 'old', chapters: 52, order: 24 },
  { id: 'lam', name: 'Lamentações', shortName: 'Lm', testament: 'old', chapters: 5, order: 25 },
  { id: 'ezk', name: 'Ezequiel', shortName: 'Ez', testament: 'old', chapters: 48, order: 26 },
  { id: 'dan', name: 'Daniel', shortName: 'Dn', testament: 'old', chapters: 12, order: 27 },
  { id: 'hos', name: 'Oséias', shortName: 'Os', testament: 'old', chapters: 14, order: 28 },
  { id: 'joe', name: 'Joel', shortName: 'Jl', testament: 'old', chapters: 3, order: 29 },
  { id: 'amo', name: 'Amós', shortName: 'Am', testament: 'old', chapters: 9, order: 30 },
  { id: 'oba', name: 'Obadias', shortName: 'Ob', testament: 'old', chapters: 1, order: 31 },
  { id: 'jon', name: 'Jonas', shortName: 'Jn', testament: 'old', chapters: 4, order: 32 },
  { id: 'mic', name: 'Miquéias', shortName: 'Mq', testament: 'old', chapters: 7, order: 33 },
  { id: 'nam', name: 'Naum', shortName: 'Na', testament: 'old', chapters: 3, order: 34 },
  { id: 'hab', name: 'Habacuque', shortName: 'Hc', testament: 'old', chapters: 3, order: 35 },
  { id: 'zep', name: 'Sofonias', shortName: 'Sf', testament: 'old', chapters: 3, order: 36 },
  { id: 'hag', name: 'Ageu', shortName: 'Ag', testament: 'old', chapters: 2, order: 37 },
  { id: 'zec', name: 'Zacarias', shortName: 'Zc', testament: 'old', chapters: 14, order: 38 },
  { id: 'mal', name: 'Malaquias', shortName: 'Ml', testament: 'old', chapters: 4, order: 39 },
];

export const NEW_TESTAMENT_BOOKS: Book[] = [
  { id: 'mat', name: 'Mateus', shortName: 'Mt', testament: 'new', chapters: 28, order: 1 },
  { id: 'mrk', name: 'Marcos', shortName: 'Mc', testament: 'new', chapters: 16, order: 2 },
  { id: 'luk', name: 'Lucas', shortName: 'Lc', testament: 'new', chapters: 24, order: 3 },
  { id: 'jhn', name: 'João', shortName: 'Jo', testament: 'new', chapters: 21, order: 4 },
  { id: 'act', name: 'Atos', shortName: 'At', testament: 'new', chapters: 28, order: 5 },
  { id: 'rom', name: 'Romanos', shortName: 'Rm', testament: 'new', chapters: 16, order: 6 },
  { id: '1co', name: '1 Coríntios', shortName: '1 Co', testament: 'new', chapters: 16, order: 7 },
  { id: '2co', name: '2 Coríntios', shortName: '2 Co', testament: 'new', chapters: 13, order: 8 },
  { id: 'gal', name: 'Gálatas', shortName: 'Gl', testament: 'new', chapters: 6, order: 9 },
  { id: 'eph', name: 'Efésios', shortName: 'Ef', testament: 'new', chapters: 6, order: 10 },
  { id: 'php', name: 'Filipenses', shortName: 'Fp', testament: 'new', chapters: 4, order: 11 },
  { id: 'col', name: 'Colossenses', shortName: 'Cl', testament: 'new', chapters: 4, order: 12 },
  { id: '1th', name: '1 Tessalonicenses', shortName: '1 Ts', testament: 'new', chapters: 5, order: 13 },
  { id: '2th', name: '2 Tessalonicenses', shortName: '2 Ts', testament: 'new', chapters: 3, order: 14 },
  { id: '1ti', name: '1 Timóteo', shortName: '1 Tm', testament: 'new', chapters: 6, order: 15 },
  { id: '2ti', name: '2 Timóteo', shortName: '2 Tm', testament: 'new', chapters: 4, order: 16 },
  { id: 'tit', name: 'Tito', shortName: 'Tt', testament: 'new', chapters: 3, order: 17 },
  { id: 'phm', name: 'Filêmon', shortName: 'Fm', testament: 'new', chapters: 1, order: 18 },
  { id: 'heb', name: 'Hebreus', shortName: 'Hb', testament: 'new', chapters: 13, order: 19 },
  { id: 'jas', name: 'Tiago', shortName: 'Tg', testament: 'new', chapters: 5, order: 20 },
  { id: '1pe', name: '1 Pedro', shortName: '1 Pe', testament: 'new', chapters: 5, order: 21 },
  { id: '2pe', name: '2 Pedro', shortName: '2 Pe', testament: 'new', chapters: 3, order: 22 },
  { id: '1jn', name: '1 João', shortName: '1 Jo', testament: 'new', chapters: 5, order: 23 },
  { id: '2jn', name: '2 João', shortName: '2 Jo', testament: 'new', chapters: 1, order: 24 },
  { id: '3jn', name: '3 João', shortName: '3 Jo', testament: 'new', chapters: 1, order: 25 },
  { id: 'jud', name: 'Judas', shortName: 'Jd', testament: 'new', chapters: 1, order: 26 },
  { id: 'rev', name: 'Apocalipse', shortName: 'Ap', testament: 'new', chapters: 22, order: 27 },
];

export const ALL_BOOKS: Book[] = [
  ...BOOK_OF_MORMON_BOOKS,
  ...OLD_TESTAMENT_BOOKS,
  ...NEW_TESTAMENT_BOOKS,
];

export const BOOKS_BY_ID: Record<string, Book> = Object.fromEntries(
  ALL_BOOKS.map(book => [book.id, book])
);

export const BOOKS_BY_TESTAMENT = {
  bom: BOOK_OF_MORMON_BOOKS,
  old: OLD_TESTAMENT_BOOKS,
  new: NEW_TESTAMENT_BOOKS,
};

export function getBook(id: string): Book | undefined {
  return BOOKS_BY_ID[id];
}

export function getBooksByTestament(testament: 'old' | 'new' | 'bom'): Book[] {
  return BOOKS_BY_TESTAMENT[testament];
}

export function getTotalChapters(testament?: 'old' | 'new' | 'bom'): number {
  const books = testament ? BOOKS_BY_TESTAMENT[testament] : ALL_BOOKS;
  return books.reduce((sum, book) => sum + book.chapters, 0);
}

// Total chapters: BoM (239) + OT (929) + NT (260) = 1,428 capítulos
export const TOTAL_CHAPTERS = {
  bom: 239,
  old: 929,
  new: 260,
  all: 1428,
};