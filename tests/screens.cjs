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
 assert.ok(verse);act(()=>verse.props.onPress());assert.ok(useUserStore.getState().bookmarks.includes('mat:5:1'));
 act(()=>button(tree,'Concluir leitura · +15 XP na primeira vez').props.onPress());
 assert.equal(useUserStore.getState().xp,15);
 act(()=>button(tree,'Leitura registrada · +15 XP').props.onPress());assert.equal(useUserStore.getState().xp,15);
 act(()=>tree.unmount());
});
test('Mormon reading identifies absent corpus instead of showing web content',()=>{
 const Screen=require('../src/components/ScriptureReader.tsx').default;
 let tree;act(()=>{tree=Renderer.create(React.createElement(Screen,{url:'https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/32?lang=por',title:'Alma 32',onClose:()=>{}}));});
 assert.equal(tree.root.findAllByType('WebView').length,0);
 assert.ok(button(tree,'Li no meu exemplar · Registrar'));
 act(()=>tree.unmount());
});
