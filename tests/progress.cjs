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
const { LESSONS } = require('../src/data/lessons.ts');
test('lesson completion requires correct answers and grants XP only once', async () => {
  await useUserStore.persist.rehydrate();
  useUserStore.setState({ xp: 0, level: 1, lessonCompletions: {}, studyDays: {}, reflections: {} });
  const lesson = LESSONS[0];
  assert.equal(useUserStore.getState().finishLesson('missing', []).completed, false);
  assert.equal(useUserStore.getState().finishLesson(lesson.id, []).completed, false);
  assert.equal(useUserStore.getState().finishLesson(lesson.id, [0,0]).completed, false);
  const answers = lesson.questions.map(q=>q.answer);
  assert.deepEqual(useUserStore.getState().finishLesson(lesson.id, answers), { completed: true, xp: 30 });
  assert.deepEqual(useUserStore.getState().finishLesson(lesson.id, answers), { completed: true, xp: 0 });
  assert.equal(useUserStore.getState().studyDays[localDateKey(new Date())].length, 1);
  await useUserStore.persist.rehydrate();
  assert.equal(useUserStore.getState().xp, 30);
  assert.ok(useUserStore.getState().lessonCompletions[lesson.id]);
});
test('review counts on a new day without farming XP; goals and notes persist', async () => {
  const lesson = LESSONS[0]; const today = localDateKey(new Date());
  const yesterday = new Date(); yesterday.setDate(yesterday.getDate()-1);
  useUserStore.setState({ xp: 30, studyDays: {}, lessonCompletions: { [lesson.id]: localDateKey(yesterday) }, lastReadDate:localDateKey(yesterday), streakDays:1 });
  useUserStore.getState().finishLesson(lesson.id, lesson.questions.map(q=>q.answer));
  assert.equal(useUserStore.getState().xp,30);
  assert.equal(useUserStore.getState().streakDays,2);
  assert.deepEqual(useUserStore.getState().studyDays[today],[lesson.id]);
  useUserStore.getState().setDailyGoal(3);
  useUserStore.getState().setDailyGoal(-1);
  useUserStore.getState().saveReflection(lesson.id,'Minha reflexão');
  await useUserStore.persist.rehydrate();
  assert.equal(useUserStore.getState().dailyGoal,3);
  assert.equal(useUserStore.getState().reflections[lesson.id],'Minha reflexão');
});
test('existing saved profiles receive the new study defaults without losing XP', async()=>{
 useUserStore.setState({lessonCompletions:{},studyDays:{},reflections:{},dailyGoal:1});
 memory.set('vereda-user-storage',JSON.stringify({state:{xp:150,level:1,name:'Gabriel'},version:0}));
 await useUserStore.persist.rehydrate();
 assert.equal(useUserStore.getState().xp,150);
 assert.equal(useUserStore.getState().name,'Gabriel');
 assert.deepEqual(useUserStore.getState().lessonCompletions,{});
});
test('all lesson questions have a valid answer and a unique id',()=>{
 assert.equal(new Set(LESSONS.map(l=>l.id)).size,LESSONS.length);
 for(const lesson of LESSONS) for(const q of lesson.questions) {
  assert.ok(q.options[q.answer]); assert.equal(new Set(q.options).size,q.options.length); assert.ok(q.explanation);
 }
});
const {getVerses}=require('../src/data/bible');
const {ALL_BOOKS}=require('../src/data/books');
const {dailyQuestions}=require('../src/data/challenge');
test('offline Bible includes 66 complete books, 1189 chapters and 31102 verses',()=>{
 let chapters=0,verses=0;const bible=ALL_BOOKS.filter(b=>b.testament!=='bom');assert.equal(bible.length,66);
 for(const b of bible)for(let c=1;c<=b.chapters;c++){const v=getVerses(b.id,c);assert.ok(v.length,`${b.id}:${c}`);chapters++;verses+=v.length;}
 assert.equal(chapters,1189);assert.equal(verses,31102);
 assert.ok(getVerses('gen',1)[0].startsWith('No princípio Deus'));
 assert.deepEqual(getVerses('alma',32),[]);
});
test('reading rewards are global per chapter and rereading still counts today',()=>{
 useUserStore.setState({readingLog:{},readingDays:{},xp:0,chaptersReadCount:0});
 assert.equal(useUserStore.getState().recordReading('mat',5),15);
 assert.equal(useUserStore.getState().recordReading('mat',5),0);
 assert.equal(useUserStore.getState().recordReading('mat',500),0);
 assert.equal(useUserStore.getState().chaptersReadCount,1);
 assert.equal(useUserStore.getState().readingDays[localDateKey(new Date())].length,1);
});
test('daily challenge scores validated answers and awards only first attempt',()=>{
 const today=localDateKey(new Date()),q=dailyQuestions(today);
 assert.equal(new Set(q.map(x=>x.id)).size,5);assert.deepEqual(q,dailyQuestions(today));
 useUserStore.setState({challengeDays:{},xp:0});
 assert.deepEqual(useUserStore.getState().finishChallenge(today,[]),{xp:0,score:0});
 assert.deepEqual(useUserStore.getState().finishChallenge(today,q.map(x=>x.answer)),{xp:30,score:5});
 assert.equal(useUserStore.getState().finishChallenge(today,q.map(x=>x.answer)).xp,0);
});
test('mission bonus requires reading, practice and reflection and can only be claimed once',()=>{
 const today=localDateKey(new Date());
 useUserStore.setState({readingDays:{},studyDays:{},challengeDays:{},reflectionDays:{},claimedMissions:[],xp:0});
 assert.equal(useUserStore.getState().claimMissions(),0);
 useUserStore.setState({readingDays:{[today]:['mat:5']},challengeDays:{[today]:3}});
 assert.equal(useUserStore.getState().claimMissions(),0);
 useUserStore.getState().saveReflection('luz','Quero ajudar alguém hoje.');
 assert.equal(useUserStore.getState().claimMissions(),25);
 assert.equal(useUserStore.getState().claimMissions(),0);
});
test('legacy plan readings migrate without awarding XP or duplicating chapter counts',()=>{
 useUserStore.setState({readingLedgerMigrated:false,readingLog:{},xp:120,chaptersReadCount:2});
 useUserStore.getState().migrateReadings(['mat:5','mat:5','bad:10','gen:1000']);
 assert.deepEqual(Object.keys(useUserStore.getState().readingLog),['mat:5']);
 assert.equal(useUserStore.getState().recordReading('mat',5),0);
 assert.equal(useUserStore.getState().xp,120);
 assert.equal(useUserStore.getState().chaptersReadCount,2);
});
