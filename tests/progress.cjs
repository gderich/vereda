const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
const originalLoad = Module._load;
const memory = new Map();
Module._load = function(id, ...args) {
  if (id === '@react-native-async-storage/async-storage') return {
    getItem: async key => memory.get(key) ?? null,
    setItem: async (key, value) => { memory.set(key, value); },
    removeItem: async key => { memory.delete(key); },
  };
  return originalLoad.call(this, id, ...args);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
}).outputText, filename);
const { getPlan, getNextChapter, getPlanChapters, calculatePlanProgress, READING_PLANS } = require('../src/data/plans.ts');
const { usePlanStore } = require('../src/store/planStore.ts');
const { useUserStore } = require('../src/store/userStore.ts');
const { localDateKey } = require('../src/utils/date.ts');
test('short thematic plans use only their intended chapters', () => {
  assert.deepEqual(getPlanChapters(getPlan('sermao-monte')).map(c => c.chapter), [5,6,7]);
  assert.deepEqual(getNextChapter(getPlan('fe-alma32'), []), { bookId: 'alma', chapter: 32 });
  assert.equal(getPlanChapters(getPlan('plano-salvacao')).length, 7);
});
test('New Testament does not start in Book of Mormon', () => {
  assert.deepEqual(getNextChapter(getPlan('novo-testamento'), []), { bookId: 'mat', chapter: 1 });
});
test('progress ignores unrelated or duplicate chapters', () => {
  const plan = getPlan('sermao-monte');
  assert.equal(calculatePlanProgress(plan, ['alma:1', 'mat:5', 'mat:5']), 33);
  assert.equal(getNextChapter(plan, ['mat:5','mat:6','mat:7']), null);
});
test('completion is validated and only awarded once', async () => {
  await usePlanStore.persist.rehydrate();
  usePlanStore.setState({ userPlans: {} });
  assert.equal(usePlanStore.getState().completeChapter('fe-alma32','alma',1).awarded, false);
  assert.deepEqual(usePlanStore.getState().completeChapter('fe-alma32','alma',32), { awarded: true, finished: true });
  assert.equal(usePlanStore.getState().completeChapter('fe-alma32','alma',32).awarded, false);
  assert.ok(usePlanStore.getState().userPlans['fe-alma32'].completedAt);
  await usePlanStore.persist.rehydrate();
  assert.deepEqual(usePlanStore.getState().userPlans['fe-alma32'].completedChapters, ['alma:32']);
});
test('all plans have unique, valid chapter references', () => {
  for (const plan of READING_PLANS) {
    const refs = getPlanChapters(plan).map(c => `${c.bookId}:${c.chapter}`);
    assert.ok(refs.length); assert.equal(new Set(refs).size, refs.length);
  }
});
test('streak advances once per local day and resets after a gap', async () => {
  await useUserStore.persist.rehydrate();
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  useUserStore.setState({ streakDays: 3, lastReadDate: localDateKey(yesterday), xp: 0 });
  useUserStore.getState().incrementStreak(); useUserStore.getState().incrementStreak();
  assert.equal(useUserStore.getState().streakDays, 4);
  useUserStore.setState({ lastReadDate: '2000-01-01' });
  useUserStore.getState().incrementStreak();
  assert.equal(useUserStore.getState().streakDays, 1);
  useUserStore.getState().addXP(650);
  assert.equal(useUserStore.getState().level, 4);
});
