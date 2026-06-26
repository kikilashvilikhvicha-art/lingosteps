import * as Speech from "expo-speech";
import { Platform } from "react-native";

const LANG_MAP: Record<string, string> = {
  ka: "ka-GE",
  it: "it-IT",
};

export async function speak(text: string, langCode: string): Promise<void> {
  if (Platform.OS === "web") return;
  const language = LANG_MAP[langCode] ?? langCode;
  try {
    Speech.stop();
    Speech.speak(text, {
      language,
      pitch: 1.0,
      rate: 0.85,
    });
  } catch {
    // ignore
  }
}

export function stopSpeech(): void {
  if (Platform.OS === "web") return;
  try {
    Speech.stop();
  } catch {
    // ignore
  }
}
