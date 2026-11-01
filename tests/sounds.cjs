const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");
const Module = require("node:module");
const original = Module._load;
const proxy = {};
let enabled = true;
let sounds = [];
Module._load = function (id, ...args) {
  if (id === "react-native") return {Alert:{alert:()=>{}}};
  if (id === "expo-modules-core") return { NativeModulesProxy: proxy };
  if (id === "../store/userStore")
    return { useUserStore: { getState: () => ({ soundsEnabled: enabled }) } };
  if (id === "expo-av")
    return {
      Audio: {
        setAudioModeAsync: async () => {},
        Sound: {
          createAsync: async () => {
            const sound = {
              played: 0,
              unloaded: 0,
              callback: null,
              playAsync: async () => sound.played++,
              unloadAsync: async () => sound.unloaded++,
              setOnPlaybackStatusUpdate: (fn) => (sound.callback = fn),
            };
            sounds.push(sound);
            return { sound };
          },
        },
      },
    };
  return original.call(this, id, ...args);
};
require.extensions[".wav"] = (m) => {
  m.exports = 1;
};
require.extensions[".ts"] = (m, f) =>
  m._compile(
    ts.transpileModule(fs.readFileSync(f, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
      },
    }).outputText,
    f,
  );
const { playSound, stopSounds } = require("../src/services/sounds");
test("sound playback respects missing native module and disabled preference", async () => {
  await playSound("correct");
  assert.equal(sounds.length, 0);
  proxy.ExponentAV = {};
  enabled = false;
  await playSound("correct");
  assert.equal(sounds.length, 0);
});
test("only latest sound plays; completion and stop release resources", async () => {
  enabled = true;
  sounds = [];
  await Promise.all([playSound("correct"), playSound("complete")]);
  assert.equal(
    sounds.reduce((n, s) => n + s.played, 0),
    1,
  );
  const last = sounds.at(-1);
  last.callback({ isLoaded: true, didJustFinish: true });
  assert.equal(last.unloaded, 1);
  await playSound("retry");
  const retry = sounds.at(-1);
  await stopSounds();
  assert.equal(retry.unloaded, 1);
});
const { isScriptureUrl } = require("../src/utils/reader");
test("reader accepts official scripture URLs only", () => {
  assert.ok(
    isScriptureUrl(
      "https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=por",
    ),
  );
  for (const url of [
    "javascript:alert(1)",
    "http://www.churchofjesuschrist.org/study/scriptures/bofm",
    "https://www.churchofjesuschrist.org.evil.test/study/scriptures/bofm",
    "https://www.churchofjesuschrist.org/account",
    "https://user:password@www.churchofjesuschrist.org/study/scriptures/bofm",
  ])
    assert.equal(isScriptureUrl(url), false);
});
