import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { MAX_PACK_BYTES, parseScripturePack, ScripturePack } from '../data/scripturePack';

const POINTER = 'vereda-personal-scriptures-v1';
const FILE_NAME = /^bom-\d+-[a-z0-9]+\.json$/;
type State = { pack: ScripturePack | null; ready: boolean; busy: boolean; error: string | null };
export const useScriptureStore = create<State>(() => ({ pack: null, ready: false, busy: false, error: null }));
let loading: Promise<void> | null = null;
function directory() {
  if (!FileSystem.documentDirectory) throw new Error('O armazenamento local não está disponível.');
  return FileSystem.documentDirectory + 'scriptures/';
}
async function readPack(uri: string) {
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists || info.isDirectory) throw new Error('O arquivo não foi encontrado. Importe novamente.');
  if (info.size > MAX_PACK_BYTES) throw new Error('Escolha um pacote com até 6 MB.');
  return parseScripturePack(await FileSystem.readAsStringAsync(uri));
}
export function loadPersonalScriptures(): Promise<void> {
  if (useScriptureStore.getState().ready) return Promise.resolve();
  if (loading) return loading;
  loading = (async () => {
    try {
      const name = await AsyncStorage.getItem(POINTER);
      if (name) {
        if (!FILE_NAME.test(name)) throw new Error('A referência do texto salvo é inválida. Importe novamente.');
        const pack = await readPack(directory() + name);
        useScriptureStore.setState({ pack, error: null });
      }
    } catch { useScriptureStore.setState({ error: 'Não foi possível carregar o texto salvo. Importe o pacote novamente.' }); }
    finally { useScriptureStore.setState({ ready: true }); loading = null; }
  })();
  return loading;
}
export async function importPersonalScriptures(): Promise<boolean> {
  if (useScriptureStore.getState().busy) return false;
  useScriptureStore.setState({ busy: true });
  let cachedUri: string | undefined;
  let stagedUri: string | undefined;
  let committed = false;
  try {
    await loadPersonalScriptures();
    let picker: typeof import('expo-document-picker');
    try { picker = require('expo-document-picker'); }
    catch { throw new Error('Instale o novo APK do Vereda para habilitar a importação de arquivos.'); }
    const result = await picker.getDocumentAsync({ type: '*/*', multiple: false, copyToCacheDirectory: true });
    if (result.canceled) return false;
    const asset = result.assets[0];
    cachedUri = asset.uri;
    if (!/\.json$/i.test(asset.name)) throw new Error('Selecione Livro-de-Mormon.vereda.json. O PDF original não é importado diretamente.');
    if (asset.size && asset.size > MAX_PACK_BYTES) throw new Error('Escolha um pacote com até 6 MB.');
    const pack = await readPack(asset.uri);
    const dir = directory();
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const oldName = await AsyncStorage.getItem(POINTER);
    const name = `bom-${Date.now()}-${Math.random().toString(36).slice(2, 10)}.json`;
    stagedUri = dir + name;
    await FileSystem.writeAsStringAsync(stagedUri, JSON.stringify(pack));
    // Commit only after the complete file has been written and read back successfully.
    await readPack(stagedUri);
    await AsyncStorage.setItem(POINTER, name);
    committed = true;
    useScriptureStore.setState({ pack, ready: true, error: null });
    if (oldName && FILE_NAME.test(oldName)) await FileSystem.deleteAsync(dir + oldName, { idempotent: true }).catch(() => {});
    return true;
  } finally {
    if (stagedUri && !committed) await FileSystem.deleteAsync(stagedUri, { idempotent: true }).catch(() => {});
    if (cachedUri && FileSystem.cacheDirectory && cachedUri.startsWith(FileSystem.cacheDirectory))
      await FileSystem.deleteAsync(cachedUri, { idempotent: true }).catch(() => {});
    useScriptureStore.setState({ busy: false });
  }
}
export async function removePersonalScriptures(): Promise<void> {
  if (useScriptureStore.getState().busy) return;
  useScriptureStore.setState({ busy: true });
  try {
    await loadPersonalScriptures();
    const oldName = await AsyncStorage.getItem(POINTER);
    await AsyncStorage.removeItem(POINTER);
    useScriptureStore.setState({ pack: null, ready: true, error: null });
    if (oldName && FILE_NAME.test(oldName)) await FileSystem.deleteAsync(directory() + oldName, { idempotent: true }).catch(() => {});
  } finally { useScriptureStore.setState({ busy: false }); }
}
