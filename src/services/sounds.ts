import { NativeModulesProxy } from "expo-modules-core";
import type { Audio as AudioType } from "expo-av";
import { useUserStore } from "../store/userStore";
export type SoundCue = "correct" | "retry" | "complete";
export function soundsAvailable() {
  return !!NativeModulesProxy.ExponentAV;
}
let active: AudioType.Sound | null = null;
let generation = 0;
export async function stopSounds() {
  generation++;
  const sound = active;
  active = null;
  if (sound) await sound.unloadAsync().catch(() => {});
}
export async function playSound(cue: SoundCue) {
  if (!useUserStore.getState().soundsEnabled || !soundsAvailable()) return;
  const request = ++generation;
  const previous = active;
  active = null;
  if (previous) await previous.unloadAsync().catch(() => {});
  if (request !== generation) return;
  try {
    const { Audio } = require("expo-av") as typeof import("expo-av");
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    const assets = {
      correct: require("../../assets/sounds/correct.wav"),
      retry: require("../../assets/sounds/retry.wav"),
      complete: require("../../assets/sounds/complete.wav"),
    };
    const { sound } = await Audio.Sound.createAsync(assets[cue], {
      shouldPlay: false,
      volume: 0.35,
    });
    if (request !== generation || !useUserStore.getState().soundsEnabled) {
      await sound.unloadAsync();
      return;
    }
    active = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        if (active === sound) active = null;
        void sound.unloadAsync().catch(() => {});
      }
    });
    await sound.playAsync();
  } catch {
    if (request === generation) await stopSounds();
  }
}
