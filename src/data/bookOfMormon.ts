import { gunzipSync, strFromU8 } from 'fflate';
import { toByteArray } from 'base64-js';
import payload from './bookOfMormonPayload';
import { parseScripturePack, ScripturePack } from './scripturePack';
let cache: ScripturePack | null = null;
export function getBookOfMormon(): ScripturePack {
  if (!cache) cache = parseScripturePack(strFromU8(gunzipSync(toByteArray(payload))));
  return cache;
}
