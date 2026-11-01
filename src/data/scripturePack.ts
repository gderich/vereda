import { ALL_BOOKS } from './books';
import verseCounts from './bomVerseCounts.json';

export const MAX_PACK_BYTES = 6 * 1024 * 1024;
export type ScripturePack = {
  format: 'vereda-scriptures';
  version: 1;
  collection: 'bom';
  language: 'pt-BR';
  edition: string;
  source: string;
  books: Record<string, Record<string, string[]>>;
};

/** Validate untrusted imports before replacing the user's existing offline text. */
export function parseScripturePack(raw: string): ScripturePack {
  if (raw.length > MAX_PACK_BYTES) throw new Error('O arquivo excede o limite de 6 MB.');
  let p: unknown;
  try { p = JSON.parse(raw.replace(/^\uFEFF/, '')); }
  catch { throw new Error('Escolha o arquivo .vereda.json preparado para o app. O PDF precisa ser convertido primeiro.'); }
  const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
  if (!object(p) || p.format !== 'vereda-scriptures' || p.version !== 1 || p.collection !== 'bom' || p.language !== 'pt-BR')
    throw new Error('Este não é um pacote do Livro de Mórmon em português compatível com o Vereda.');
  if (typeof p.edition !== 'string' || !p.edition.trim() || p.edition.length > 120 || typeof p.source !== 'string' || p.source.length > 250 || !object(p.books))
    throw new Error('O arquivo está incompleto ou tem identificação inválida.');
  const expected = ALL_BOOKS.filter(b => b.testament === 'bom');
  if (Object.keys(p.books).length !== expected.length) throw new Error('O arquivo deve conter os 15 livros completos.');
  const books: ScripturePack['books'] = {};
  let total = 0;
  for (const book of expected) {
    const chapters = p.books[book.id];
    if (!object(chapters) || Object.keys(chapters).length !== book.chapters) throw new Error(`Capítulos incompletos em ${book.name}.`);
    books[book.id] = {};
    for (let ch = 1; ch <= book.chapters; ch++) {
      const verses = chapters[String(ch)];
      if (!Array.isArray(verses) || verses.length !== (verseCounts as Record<string, number[]>)[book.id][ch - 1] || verses.some(v => typeof v !== 'string' || !v.trim() || v.length > 12000 || /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(v)))
        throw new Error(`Versículos inválidos em ${book.name} ${ch}.`);
      books[book.id][String(ch)] = verses.map(v => v.trim());
      total += verses.length;
    }
  }
  if (total !== 6604) throw new Error(`O arquivo contém ${total} versículos; são esperados 6.604. Nenhum texto foi substituído.`);
  return { format: 'vereda-scriptures', version: 1, collection: 'bom', language: 'pt-BR', edition: p.edition.trim(), source: p.source.trim(), books };
}
