/**
 * Planos de leitura pré-definidos
 * Inspirado no Tether + Duolingo (metas diárias, streaks)
 */

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  testament: 'bom' | 'old' | 'new' | 'all';
  books: string[]; // book IDs in order
  estimatedDays: number;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  category: 'cronologico' | 'tematico' | 'livro' | 'anual';
  icon: string;
  color: string;
  dailyChapters: number;
  xpPerChapter: number;
  bonusXpOnComplete: number;
}

export const READING_PLANS: ReadingPlan[] = [
  // ===== PLANOS GRATUITOS =====
  {
    id: 'bom-completo',
    name: 'Livro de Mórmon Completo',
    description: 'Leia todo o Livro de Mórmon do início ao fim. 239 capítulos.',
    testament: 'bom',
    books: [
      '1ne', '2ne', 'jac', 'enos', 'jaro', 'omni', 'wom',
      'mos', 'alma', 'hela', '3ne', '4ne', 'morm', 'ether', 'moro'
    ],
    estimatedDays: 239,
    difficulty: 'iniciante',
    category: 'livro',
    icon: '📖',
    color: '#1E3A5F',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 500,
  },
  {
    id: 'novo-testamento',
    name: 'Novo Testamento',
    description: 'A vida e ensinamentos de Jesus Cristo e dos apóstolos. 260 capítulos.',
    testament: 'new',
    books: [
      'mat', 'mrk', 'luk', 'jhn', 'act', 'rom', '1co', '2co',
      'gal', 'eph', 'php', 'col', '1th', '2th', '1ti', '2ti',
      'tit', 'phm', 'heb', 'jas', '1pe', '2pe', '1jn', '2jn',
      '3jn', 'jud', 'rev'
    ],
    estimatedDays: 260,
    difficulty: 'iniciante',
    category: 'livro',
    icon: '✝️',
    color: '#C49A2C',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 500,
  },
  {
    id: 'evangelhos',
    name: 'Os Quatro Evangelhos',
    description: 'Mateus, Marcos, Lucas e João. A vida de Cristo. 89 capítulos.',
    testament: 'new',
    books: ['mat', 'mrk', 'luk', 'jhn'],
    estimatedDays: 89,
    difficulty: 'iniciante',
    category: 'tematico',
    icon: '📜',
    color: '#1E3A5F',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 200,
  },
  {
    id: 'atos-epistolas',
    name: 'Atos e Epístolas Paulinas',
    description: 'A igreja primitiva e cartas de Paulo. 115 capítulos.',
    testament: 'new',
    books: ['act', 'rom', '1co', '2co', 'gal', 'eph', 'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm'],
    estimatedDays: 115,
    difficulty: 'intermediario',
    category: 'tematico',
    icon: '📨',
    color: '#0F172A',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 300,
  },
  {
    id: 'salmos-proverbios',
    name: 'Salmos e Provérbios',
    description: 'Sabedoria e louvor para o dia a dia. 181 capítulos.',
    testament: 'old',
    books: ['psa', 'pro'],
    estimatedDays: 181,
    difficulty: 'iniciante',
    category: 'tematico',
    icon: '🙏',
    color: '#8B7355',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 250,
  },
  {
    id: 'genesis-juizes',
    name: 'Gênesis a Juízes',
    description: 'Da criação à conquista da Terra Prometida. 232 capítulos.',
    testament: 'old',
    books: ['gen', 'exo', 'lev', 'num', 'deu', 'jos', 'jdg'],
    estimatedDays: 232,
    difficulty: 'iniciante',
    category: 'cronologico',
    icon: '🌍',
    color: '#1E3A5F',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 400,
  },

  // ===== PLANO DESTAQUE: BRASIL 365 =====
  {
    id: 'brasil-365',
    name: 'Brasil 365',
    description: 'Leia o Antigo Testamento, o Novo Testamento e o Livro de Mórmon em sequência, com meta de cerca de 4 capítulos por dia.',
    testament: 'all',
    books: [
      // Janeiro - Gênesis a Êxodo
      'gen', 'exo',
      // Fevereiro - Levítico a Deuteronômio
      'lev', 'num', 'deu',
      // Março - Josué a 1 Samuel
      'jos', 'jdg', 'rut', '1sa',
      // Abril - 2 Samuel a 2 Reis
      '2sa', '1ki', '2ki',
      // Maio - 1 Crônicas a Neemias
      '1ch', '2ch', 'ezr', 'neh', 'est',
      // Junho - Jó a Cantares
      'job', 'psa', 'pro', 'ecc', 'son',
      // Julho - Isaías a Daniel
      'isa', 'jer', 'lam', 'ezk', 'dan',
      // Agosto - Oséias a Malaquias
      'hos', 'joe', 'amo', 'oba', 'jon', 'mic', 'nam', 'hab', 'zep', 'hag', 'zec', 'mal',
      // Setembro - Evangelhos
      'mat', 'mrk', 'luk', 'jhn',
      // Outubro - Atos a Filemom
      'act', 'rom', '1co', '2co', 'gal', 'eph', 'php', 'col', '1th', '2th', '1ti', '2ti', 'tit', 'phm',
      // Novembro - Hebreus a Apocalipse
      'heb', 'jas', '1pe', '2pe', '1jn', '2jn', '3jn', 'jud', 'rev',
      // Dezembro - Livro de Mórmon completo
      '1ne', '2ne', 'jac', 'enos', 'jaro', 'omni', 'wom', 'mos', 'alma', 'hela', '3ne', '4ne', 'morm', 'ether', 'moro'
    ],
    estimatedDays: 365,
    difficulty: 'avancado',
    category: 'anual',
    icon: '🇧🇷',
    color: '#009B3A',
    dailyChapters: 4, // ~4 capítulos/dia para completar em 365 dias
    xpPerChapter: 15,
    bonusXpOnComplete: 2000,
  },

  // ===== PLANOS TEMÁTICOS CURTOS (1-2 semanas) =====
  {
    id: 'sermao-monte',
    name: 'Sermão do Monte',
    description: 'Mateus 5-7. O ensino central de Jesus. 3 capítulos.',
    testament: 'new',
    books: ['mat'],
    estimatedDays: 3,
    difficulty: 'iniciante',
    category: 'tematico',
    icon: '🏔️',
    color: '#C49A2C',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 100,
  },
  {
    id: 'fe-alma32',
    name: 'A Fé (Alma 32)',
    description: 'O clássico discurso sobre a fé como semente. 1 capítulo.',
    testament: 'bom',
    books: ['alma'],
    estimatedDays: 1,
    difficulty: 'iniciante',
    category: 'tematico',
    icon: '🌱',
    color: '#1E3A5F',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 50,
  },
  {
    id: 'amor-1co13',
    name: 'O Hino do Amor',
    description: '1 Coríntios 13. A definição do amor cristão. 1 capítulo.',
    testament: 'new',
    books: ['1co'],
    estimatedDays: 1,
    difficulty: 'iniciante',
    category: 'tematico',
    icon: '❤️',
    color: '#E84A5F',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 50,
  },
  {
    id: 'armadura-deus',
    name: 'Armadura de Deus',
    description: 'Efésios 6:10-20. Proteção espiritual. 1 capítulo.',
    testament: 'new',
    books: ['eph'],
    estimatedDays: 1,
    difficulty: 'iniciante',
    category: 'tematico',
    icon: '🛡️',
    color: '#64748B',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 50,
  },
  {
    id: 'plano-salvacao',
    name: 'Plano de Salvação',
    description: '2 Néfi 9-10, Alma 12, 34, 40-42. O plano de felicidade.',
    testament: 'bom',
    books: ['2ne', 'alma'],
    estimatedDays: 7,
    difficulty: 'intermediario',
    category: 'tematico',
    icon: '📋',
    color: '#1E3A5F',
    dailyChapters: 1,
    xpPerChapter: 15,
    bonusXpOnComplete: 150,
  },
];

// Helper functions
import { BOOK_OF_MORMON_BOOKS, OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS, ALL_BOOKS } from './books';

export function getPlan(id: string): ReadingPlan | undefined {
  return READING_PLANS.find(p => p.id === id);
}

export function getPlansByCategory(category: ReadingPlan['category']): ReadingPlan[] {
  return READING_PLANS.filter(p => p.category === category);
}

export function getBeginnerPlans(): ReadingPlan[] {
  return READING_PLANS.filter(p => p.difficulty === 'iniciante');
}

export type ChapterRef = { bookId: string; chapter: number };
const selectedChapters: Record<string, ChapterRef[]> = {
  'sermao-monte': [5, 6, 7].map(chapter => ({ bookId: 'mat', chapter })),
  'fe-alma32': [{ bookId: 'alma', chapter: 32 }],
  'amor-1co13': [{ bookId: '1co', chapter: 13 }],
  'armadura-deus': [{ bookId: 'eph', chapter: 6 }],
  'plano-salvacao': [
    ...[9, 10].map(chapter => ({ bookId: '2ne', chapter })),
    ...[12, 34, 40, 41, 42].map(chapter => ({ bookId: 'alma', chapter })),
  ],
};
export function getPlanChapters(plan: ReadingPlan): ChapterRef[] {
  return selectedChapters[plan.id] ?? plan.books.flatMap(bookId => {
    const book = ALL_BOOKS.find(b => b.id === bookId);
    return Array.from({ length: book?.chapters ?? 0 }, (_, i) => ({ bookId, chapter: i + 1 }));
  });
}
export function calculatePlanProgress(plan: ReadingPlan, completedChapters: string[]): number {
  const chapters = getPlanChapters(plan);
  const done = new Set(completedChapters);
  return chapters.length ? Math.round(100 * chapters.filter(c => done.has(`${c.bookId}:${c.chapter}`)).length / chapters.length) : 0;
}
export function getNextChapter(plan: ReadingPlan, completedChapters: string[]): ChapterRef | null {
  const done = new Set(completedChapters);
  return getPlanChapters(plan).find(c => !done.has(`${c.bookId}:${c.chapter}`)) ?? null;
}
export function getPlanStats(plan: ReadingPlan): { totalChapters: number; totalXP: number } {
  const totalChapters = getPlanChapters(plan).length;
  return { totalChapters, totalXP: totalChapters * plan.xpPerChapter + plan.bonusXpOnComplete };
}
