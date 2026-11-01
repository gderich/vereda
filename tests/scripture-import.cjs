const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const storage = new Map(), files = new Map();
let picked = { canceled: true }, failWrite = false, failPointer = false, missingPicker = false, picks = 0;
const orig = Module._load;
Module._load = function(id,...args) {
 if(id === '@react-native-async-storage/async-storage') return {
  getItem: async k => storage.get(k) || null,
  setItem: async (k,v) => { if(failPointer) throw Error('storage full'); storage.set(k,v); },
  removeItem: async k => storage.delete(k),
 };
 if(id === 'expo-file-system') return {
  documentDirectory: 'file:///documents/', cacheDirectory:'file:///cache/',
  getInfoAsync: async uri => ({ exists:files.has(uri), isDirectory:false, size:Buffer.byteLength(files.get(uri)||'') }),
  readAsStringAsync: async uri => { if(!files.has(uri)) throw Error('missing'); return files.get(uri); },
  writeAsStringAsync: async (uri,s) => { if(failWrite) throw Error('disk full');files.set(uri,s); },
  makeDirectoryAsync: async()=>{}, deleteAsync: async uri=>{files.delete(uri);},
 };
 if(id === 'expo-document-picker') { if(missingPicker) throw Error('missing native module');return {getDocumentAsync:async()=>{picks++;return picked;}}; }
 return orig.call(this,id,...args);
};
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,f);
const { parseScripturePack } = require('../src/data/scripturePack');
const { useScriptureStore: store, loadPersonalScriptures:load, importPersonalScriptures:importPack, removePersonalScriptures:remove } = require('../src/store/scriptureStore');
const counts=require('../src/data/bomVerseCounts.json');
function fixture(){return {format:'vereda-scriptures',version:1,collection:'bom',language:'pt-BR',edition:'Exemplar de teste',source:'Texto fictício para testes',books:Object.fromEntries(Object.entries(counts).map(([b,cs])=>[b,Object.fromEntries(cs.map((n,i)=>[i+1,Array.from({length:n},(_,j)=>`Texto de teste ${b} ${i+1}:${j+1}.`)]))]))};}
function choose(p=fixture()) { const uri='file:///cache/test.json';files.set(uri,JSON.stringify(p));picked={canceled:false,assets:[{name:'test.vereda.json',uri}]}; }
function reset(){storage.clear();files.clear();store.setState({pack:null,ready:false,error:null,busy:false});picked={canceled:true};failWrite=failPointer=missingPicker=false;}

test('personal scripture packs validate every book, chapter and verse before use',()=>{
 const p=fixture();assert.equal(Object.keys(parseScripturePack(JSON.stringify(p)).books).length,15);
 delete p.books.alma['32'];assert.throws(()=>parseScripturePack(JSON.stringify(p)),/Capítulos/);
 const q=fixture();q.books.alma['32'].pop();q.books.alma['33'].push('extra');assert.throws(()=>parseScripturePack(JSON.stringify(q)),/Versículos/);
 const r=fixture();r.books.moro['10'][0]='';assert.throws(()=>parseScripturePack(JSON.stringify(r)),/Versículos/);
 assert.throws(()=>parseScripturePack('%PDF'),/PDF/);
 assert.throws(()=>parseScripturePack('x'.repeat(6*1024*1024+1)),/6 MB/);
});
test('import survives a restart, reads locally, replaces safely and preserves unrelated progress',async()=>{
 reset();storage.set('vereda-user-storage','existing XP and bookmarks');
 await load();assert.equal(store.getState().ready,true);assert.equal(store.getState().pack,null);
 choose();assert.equal(await importPack(),true);const first=storage.get('vereda-personal-scriptures-v1');
 assert.ok(first);assert.equal(files.has('file:///cache/test.json'),false);
 store.setState({pack:null,ready:false});await load();assert.equal(store.getState().pack.books.moro['10'].length,34);
 const p=fixture();p.edition='Outro exemplar';choose(p);assert.equal(await importPack(),true);
 assert.equal(store.getState().pack.edition,'Outro exemplar');assert.equal(files.has('file:///documents/scriptures/'+first),false);
 await remove();assert.equal(store.getState().pack,null);assert.equal(storage.has('vereda-personal-scriptures-v1'),false);
 assert.equal(storage.get('vereda-user-storage'),'existing XP and bookmarks');
});
test('cancel, invalid file, full disk and pointer failure never replace an existing exemplar',async()=>{
 reset();choose();await importPack();const name=storage.get('vereda-personal-scriptures-v1'),pack=store.getState().pack;
 picked={canceled:true};assert.equal(await importPack(),false);
 choose({...fixture(),books:{}});await assert.rejects(importPack(),/15 livros/);
 choose();failWrite=true;await assert.rejects(importPack(),/disk full/);failWrite=false;
 choose();failPointer=true;await assert.rejects(importPack(),/storage full/);failPointer=false;
 assert.equal(storage.get('vereda-personal-scriptures-v1'),name);assert.equal(store.getState().pack,pack);
 assert.equal([...files.keys()].filter(x=>x.startsWith('file:///documents/')).length,1);
 assert.equal(store.getState().busy,false);
});
test('missing native picker provides rebuild guidance; concurrent picks are blocked',async()=>{
 reset();await load();missingPicker=true;await assert.rejects(importPack(),/novo APK/);missingPicker=false;
 choose();const a=importPack(),b=importPack();assert.equal(await b,false);assert.equal(await a,true);
});
test('missing or corrupt saved text becomes recoverable without wiping progress',async()=>{
 reset();storage.set('vereda-personal-scriptures-v1','bom-1-test.json');await load();assert.match(store.getState().error,/Importe/);
 choose();await importPack();assert.equal(store.getState().error,null);
 store.setState({pack:null,ready:false});storage.set('vereda-personal-scriptures-v1','../../secret');await load();assert.match(store.getState().error,/Importe/);
});
