import { Alert } from "react-native";
import {
  NativeModulesProxy,
  requireOptionalNativeModule,
} from "expo-modules-core";
import type { Audio as AudioType } from "expo-av";
import { useUserStore } from "../store/userStore";
export type SoundCue = "correct" | "retry" | "complete";
export function soundsAvailable() {
  try {
    return (
      !!NativeModulesProxy.ExponentAV ||
      !!requireOptionalNativeModule("ExponentAV")
    );
  } catch {
    return false;
  }
}
let active: AudioType.Sound | null = null;
let generation = 0;
export async function stopSounds() {
  generation++;
  const sound = active;
  active = null;
  if (sound) await sound.unloadAsync().catch(() => {});
}
export async function playSound(
  cue: SoundCue,
): Promise<"played" | "disabled" | "unavailable" | "interrupted" | "error"> {
  if (!useUserStore.getState().soundsEnabled) return "disabled";
  if (!soundsAvailable()) return "unavailable";
  const request = ++generation;
  const previous = active;
  active = null;
  if (previous) await previous.unloadAsync().catch(() => {});
  if (request !== generation) return "interrupted";
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
      volume: useUserStore.getState().soundVolume,
    });
    if (request !== generation || !useUserStore.getState().soundsEnabled) {
      await sound.unloadAsync();
      return "interrupted";
    }
    active = sound;
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        if (active === sound) active = null;
        void sound.unloadAsync().catch(() => {});
      }
    });
    await sound.playAsync();
    return "played";
  } catch {
    if (request === generation) await stopSounds();
    return "error";
  }
}

export async function testSound() {
  const result = await playSound("complete");
  const messages = {
    played:
      "O efeito foi reproduzido. Se não ouviu, aumente o volume de mídia do celular e confira se o áudio está saindo por um fone Bluetooth.",
    disabled: "Os sons estão desligados. Ative-os na aba Progresso.",
    unavailable:
      "Este APK não contém o módulo de áudio. Instale o APK 1.2 gerado pelo atualizador; atualizar apenas o QR Code não acrescenta esse componente.",
    interrupted: "Outro som interrompeu o teste. Tente novamente.",
    error:
      "O áudio não pôde ser iniciado. Feche e abra o app; se persistir, instale o novo APK.",
  };
  Alert.alert(
    result === "played" ? "Teste de áudio" : "Áudio indisponível",
    messages[result],
  );
  return result;
}
