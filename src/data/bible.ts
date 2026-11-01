import { gunzipSync, strFromU8 } from "fflate";
import { toByteArray } from "base64-js";
import payload from "./biblePayload";
import { ALL_BOOKS } from "./books";
import { chapterUrl } from "./scriptureLinks";
type Bible = Record<string, Record<string, string[]>>;
let cache: Bible | null = null;
export const BIBLE_EDITION = "Almeida Recebida · edição 1.7";
export function getVerses(bookId: string, chapter: number): string[] {
  if (!cache)
    cache = JSON.parse(strFromU8(gunzipSync(toByteArray(payload)))) as Bible;
  return cache[bookId]?.[String(chapter)] || [];
}
export function referenceFromUrl(
  value: string,
): { bookId: string; chapter: number } | null {
  const match = value.match(
    /^https:\/\/www\.churchofjesuschrist\.org\/study\/scriptures\/(?:ot|nt|bofm)\/[a-z0-9-]+\/([1-9]\d*)(?:[?#][^\s]*)?$/,
  );
  if (!match) return null;
  const chapter = Number(match[1]),
    base = value.split(/[?#]/)[0];
  const book = ALL_BOOKS.find(
    (b) => chapterUrl(b.id, chapter)?.split("?")[0] === base,
  );
  return book ? { bookId: book.id, chapter } : null;
}
