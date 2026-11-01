const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const Module = require("node:module");
const React = require("react");
const Renderer = require("react-test-renderer");
const { act } = Renderer;
const originalLoad = Module._load;
let routeId = "semente";
let hasNativeReader = false;
const storage = new Map();
Module._load = function (id, ...args) {
  if (id.startsWith("@/")) id = path.resolve(__dirname, "../src", id.slice(2));
  if (id === "react-native")
    return {
      Modal: "Modal",
      UIManager: { getViewManagerConfig: () => (hasNativeReader ? {} : null) },
      View: "View",
      Text: "Text",
      ScrollView: "ScrollView",
      Pressable: "Pressable",
      TextInput: "TextInput",
      TouchableOpacity: "TouchableOpacity",
      ActivityIndicator: "ActivityIndicator",
      StyleSheet: { create: (s) => s },
      Alert: { alert: () => {} },
      Linking: { openURL: async () => {} },
      Share: { share: async () => {} },
      Platform: { OS: "android" },
    };
  if (id === "expo-modules-core") return { NativeModulesProxy: {} };
  if (id === "expo-file-system") return { documentDirectory: "file:///docs/", cacheDirectory: "file:///cache/" };
  if (id === "expo-status-bar") return {StatusBar:"StatusBar"};
  if (id === "expo-web-browser")
    return { openBrowserAsync: async () => ({ type: "dismiss" }) };
  if (id === "react-native-webview") return { WebView: "WebView" };
  if (id === "react-native-safe-area-context")
    return { SafeAreaView: "View", SafeAreaProvider: "View" };
  if (id === "react-native-svg")
    return {
      __esModule: true,
      default: "Svg",
      Path: "Path",
      Circle: "Circle",
      Rect: "Rect",
      G: "G",
      Defs: "Defs",
      RadialGradient: "RadialGradient",
      LinearGradient: "LinearGradient",
      Stop: "Stop",
    };
  if (id === "@expo/vector-icons") return { Ionicons: "Icon" };
  if (id === "expo-router")
    return {
      useRouter: () => ({ push: () => {}, replace: () => {} }),
      useLocalSearchParams: () => ({ id: routeId, planId: "bom-completo" }),
    };
  if (id === "expo-notifications") return { setNotificationHandler: () => {} };
  if (id === "expo-updates")
    return {
      isEnabled: false,
      channel: null,
      runtimeVersion: null,
      updateId: null,
      createdAt: null,
      isEmbeddedLaunch: true,
      checkForUpdateAsync: async () => ({ isAvailable: false }),
      fetchUpdateAsync: async () => ({ isNew: false }),
      reloadAsync: async () => {},
    };
  if (id === "@react-native-async-storage/async-storage")
    return {
      getItem: async (k) => storage.get(k) || null,
      setItem: async (k, v) => storage.set(k, v),
      removeItem: async (k) => storage.delete(k),
    };
  return originalLoad.call(this, id, ...args);
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = (module, filename) =>
    module._compile(
      ts.transpileModule(fs.readFileSync(filename, "utf8"), {
        compilerOptions: {
          module: ts.ModuleKind.CommonJS,
          target: ts.ScriptTarget.ES2020,
          esModuleInterop: true,
          jsx: ts.JsxEmit.ReactJSX,
        },
      }).outputText,
      filename,
    );
const { useUserStore } = require("../src/store/userStore");
const { usePlanStore } = require("../src/store/planStore");
const { LESSONS } = require("../src/data/lessons");
function button(tree, title) {
  return tree.root
    .findAllByType("Pressable")
    .find((n) =>
      n.findAllByType("Text").some((t) => t.children.join("") === title),
    );
}
test("home, progress, library, plans and reader render with persisted profile", async () => {
  await useUserStore.persist.rehydrate();
  await usePlanStore.persist.rehydrate();
  for (const name of [
    "(tabs)/index",
    "(tabs)/progress",
    "(tabs)/library",
    "(tabs)/plans",
    "reading/[planId]",
  ]) {
    let tree;
    act(() => {
      tree = Renderer.create(
        React.createElement(require(`../app/${name}.tsx`).default),
      );
    });
    assert.ok(tree.toJSON(), name);
    act(() => tree.unmount());
  }
});
test("lesson retries wrong answers, saves reflection and completes exactly once", async () => {
  await useUserStore.persist.rehydrate();
  useUserStore.setState({
    xp: 0,
    level: 1,
    lessonCompletions: {},
    studyDays: {},
    reflections: {},
  });
  const Screen = require("../app/lesson/[id].tsx").default;
  let tree;
  act(() => {
    tree = Renderer.create(React.createElement(Screen));
  });
  act(() => button(tree, "Já li · Vamos praticar").props.onPress());
  let options = tree.root
    .findAllByType("Pressable")
    .filter((n) => n.props.accessibilityRole === "radio");
  act(() => options[0].props.onPress());
  act(() => button(tree, "Verificar").props.onPress());
  assert.ok(button(tree, "Tentar novamente"));
  act(() => button(tree, "Tentar novamente").props.onPress());
  for (const q of LESSONS[0].questions) {
    options = tree.root
      .findAllByType("Pressable")
      .filter((n) => n.props.accessibilityRole === "radio");
    act(() => options[q.answer].props.onPress());
    act(() => button(tree, "Verificar").props.onPress());
    act(() => button(tree, "Continuar").props.onPress());
  }
  act(() =>
    tree.root
      .findByType("TextInput")
      .props.onChangeText("Cuidar de um pequeno hábito."),
  );
  act(() => button(tree, "Concluir lição").props.onPress());
  assert.equal(useUserStore.getState().xp, 30);
  assert.equal(
    useUserStore.getState().reflections.semente,
    "Cuidar de um pequeno hábito.",
  );
  assert.ok(
    tree.root
      .findAllByType("Text")
      .some((n) => n.children.join("") === "+30 XP conquistados"),
  );
  act(() => tree.unmount());
});
test('native offline reader displays real verses, bookmarks and one-time reading XP',()=>{
 const Screen=require('../src/components/ScriptureReader.tsx').default;
 useUserStore.setState({xp:0,readingLog:{},readingDays:{},bookmarks:[],chaptersReadCount:0});
 let tree;act(()=>{tree=Renderer.create(React.createElement(Screen,{url:'https://www.churchofjesuschrist.org/study/scriptures/nt/matt/5?lang=por',title:'Mateus 5',onClose:()=>{}}));});
 assert.equal(tree.root.findAllByType('WebView').length,0);
 const verse=tree.root.findAllByType('Pressable').find(n=>n.props.accessibilityLabel?.startsWith('Versículo 1.'));
 assert.ok(verse);act(()=>verse.props.onPress());act(()=>button(tree,'Guardar versículo nos favoritos').props.onPress());act(()=>button(tree,'Voltar à leitura').props.onPress());assert.ok(useUserStore.getState().bookmarks.includes('mat:5:1'));
 act(()=>button(tree,'Concluir leitura · +15 XP na primeira vez').props.onPress());
 assert.equal(useUserStore.getState().xp,15);
 act(()=>button(tree,'Leitura registrada · +15 XP').props.onPress());assert.equal(useUserStore.getState().xp,15);
 act(()=>tree.unmount());
});
test('Book of Mormon opens offline without personal import',()=>{
 const Screen=require('../src/components/ScriptureReader.tsx').default;
 let tree;act(()=>{tree=Renderer.create(React.createElement(Screen,{url:'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/32?lang=por',title:'Alma 32',onClose:()=>{}}));});
 assert.equal(tree.root.findAllByType('WebView').length,0);
 assert.ok(button(tree,'Concluir leitura · +15 XP na primeira vez'));assert.equal(tree.root.findAllByType('Pressable').filter(n=>n.props.accessibilityLabel?.startsWith('Versículo ')).length,43);
 act(()=>tree.unmount());
});
test('imported Mormon text supports native reading, bookmarks, font, theme and plan completion',()=>{
 const {useScriptureStore}=require('../src/store/scriptureStore');
 const pack={edition:'Exemplar pessoal de teste',books:{'1ne':{'1':['Texto fictício do primeiro versículo.','Texto fictício do segundo versículo.']}}};
 useScriptureStore.setState({pack,ready:true,error:null});
 useUserStore.setState({xp:0,readingLog:{},readingDays:{},bookmarks:[],chaptersReadCount:0,readerFont:22,readerTheme:'night'});
 usePlanStore.setState({userPlans:{},activePlanId:'bom-completo'});
 const Screen=require('../app/reading/[planId].tsx').default;
 let tree;act(()=>{tree=Renderer.create(React.createElement(Screen));});
 act(()=>button(tree,'Ler capítulo no Vereda').props.onPress());
 assert.equal(tree.root.findAllByType('WebView').length,0);
 assert.ok(tree.root.findAllByType('Text').some(n=>n.children.includes('Texto fictício do primeiro versículo.')));
 const verse=tree.root.findAllByType('Pressable').find(n=>n.props.accessibilityLabel?.startsWith('Versículo 1.'));
 act(()=>verse.props.onPress());act(()=>button(tree,'Guardar versículo nos favoritos').props.onPress());act(()=>button(tree,'Voltar à leitura').props.onPress());assert.ok(useUserStore.getState().bookmarks.includes('1ne:1:1'));
 act(()=>tree.root.findAllByType('Pressable').find(n=>n.props.accessibilityLabel==='Aumentar fonte').props.onPress());assert.equal(useUserStore.getState().readerFont,24);
 act(()=>button(tree,'☀ Papel sépia').props.onPress());assert.equal(useUserStore.getState().readerTheme,'sepia');
 act(()=>button(tree,'Concluir leitura · +15 XP na primeira vez').props.onPress());
 assert.equal(useUserStore.getState().xp,15);
 assert.deepEqual(usePlanStore.getState().userPlans['bom-completo'].completedChapters,['1ne:1']);
 assert.equal(tree.root.findAllByType('Modal').length,0);
 act(()=>tree.unmount());useScriptureStore.setState({pack:null});
});
test('reader selects a partial verse, changes color and style, saves a note and renders it',()=>{
 const {useAnnotationStore}=require('../src/store/annotationStore');useAnnotationStore.setState({marks:[]});
 const Screen=require('../src/components/ScriptureReader.tsx').default;let tree;
 act(()=>{tree=Renderer.create(React.createElement(Screen,{url:'https://www.churchofjesuschrist.org/study/scriptures/bofm/1-ne/1?lang=por',title:'1 Néfi 1',onClose(){}}));});
 act(()=>tree.root.findAllByType('Pressable').find(n=>n.props.accessibilityLabel?.startsWith('Versículo 1.')).props.onPress());
 function word(n){return tree.root.findAllByType('Text').find(t=>t.props.accessibilityLabel?.startsWith(`Selecionar palavra ${n}:`));}
 act(()=>word(2).props.onPress());act(()=>word(5).props.onPress());
 act(()=>tree.root.findAllByType('Pressable').find(t=>t.props.accessibilityLabel==='Cor Azul').props.onPress());act(()=>button(tree,'Sublinhado').props.onPress());
 act(()=>tree.root.findByType('TextInput').props.onChangeText('Minha reflexão pessoal.'));
 act(()=>button(tree,'Salvar marcação').props.onPress());
 const mark=useAnnotationStore.getState().marks[0];assert.equal(mark.style,'underline');assert.equal(mark.color,'blue');assert.equal(mark.note,'Minha reflexão pessoal.');assert.ok(mark.start>0);assert.ok(tree.root.findAllByType('Text').some(t=>t.props.style?.textDecorationLine==='underline'));
 act(()=>tree.unmount());
});
