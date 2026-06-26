import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { ALL_WORDS, getWordsByCategory, type Word } from "@/data/vocabulary";
import { calcXP, calcCoins } from "@/utils/gameLogic";
import { speak } from "@/utils/speechUtils";

const TOTAL = 8;

interface ImageQuestion {
  correctWord: Word;
  options: Word[];      // 4 options (correct + 3 distractors)
  targetText: string;  // what to show as text prompt
}

function buildQuestions(sourceLang: "ka" | "it", categoryId?: string, count: number = TOTAL): ImageQuestion[] {
  const pool = categoryId ? getWordsByCategory(categoryId) : ALL_WORDS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const words = shuffled.slice(0, Math.min(count, shuffled.length));

  return words.map((word) => {
    const others = pool.filter((w) => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [word, ...others].sort(() => Math.random() - 0.5);
    return {
      correctWord: word,
      options,
      targetText: word[sourceLang],
    };
  });
}

export default function ImageGuessScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { sourceLang, targetLang, recordGameResult } = useGame();

  const [questions] = useState<ImageQuestion[]>(() =>
    buildQuestions(sourceLang, category, TOTAL)
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const current = questions[index];
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (current) speak(current.targetText, sourceLang);
  }, [index]);

  function handleSelect(wordId: string) {
    if (answered) return;
    setSelected(wordId);
    setAnswered(true);
    const isCorrect = wordId === current.correctWord.id;
    if (isCorrect) {
      setScore((s) => s + 1);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    speak(current.correctWord[targetLang], targetLang);
  }

  function handleNext() {
    if (index + 1 >= TOTAL) {
      const xp = calcXP(score, TOTAL, "image-guess");
      const coins = calcCoins(score, TOTAL);
      const { newAchievements, leveledUp } = recordGameResult({
        type: "image-guess",
        score,
        total: TOTAL,
        xpEarned: xp,
        coinsEarned: coins,
        wordsEncountered: TOTAL,
      });
      router.replace({
        pathname: "/game/results",
        params: {
          score: String(score),
          total: String(TOTAL),
          xp: String(xp),
          coins: String(coins),
          newAchievements: newAchievements.join(","),
          leveledUp: leveledUp ? "1" : "0",
          mode: "image-guess",
        },
      });
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  if (!current) return null;

  const progress = (index + 1) / TOTAL;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: "#FF6B6B" }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>{index + 1}/{TOTAL}</Text>
        </View>
        <Text style={[styles.scoreText, { color: "#FF6B6B" }]}>⭐ {score}</Text>
      </View>

      <View style={styles.body}>
        <Animated.View key={index} entering={FadeInDown.duration(300)} style={styles.questionArea}>
          <Text style={[styles.instruction, { color: colors.mutedForeground }]}>
            Find the picture for:
          </Text>
          <Pressable onPress={() => speak(current.targetText, sourceLang)} style={styles.wordRow}>
            <Text style={[styles.targetWord, { color: colors.foreground }]}>{current.targetText}</Text>
            <Feather name="volume-2" size={18} color={colors.primary} />
          </Pressable>
          <Text style={[styles.langLabel, { color: colors.mutedForeground }]}>
            ({sourceLang === "ka" ? "Georgian" : "Italian"})
          </Text>
        </Animated.View>

        {/* 2x2 emoji grid */}
        <View style={styles.grid}>
          {current.options.map((word, i) => {
            const isSelected = selected === word.id;
            const isCorrect = word.id === current.correctWord.id;
            let bg = word.color;
            let borderColor = "transparent";
            let borderWidth = 0;
            let overlay: string | null = null;

            if (answered) {
              if (isCorrect) { borderColor = "#00C896"; borderWidth = 3; overlay = "✓"; }
              else if (isSelected && !isCorrect) { borderColor = "#FF3B30"; borderWidth = 3; overlay = "✗"; }
            } else if (isSelected) {
              borderColor = colors.primary;
              borderWidth = 3;
            }

            return (
              <Animated.View
                key={word.id}
                entering={FadeInDown.delay(i * 80).duration(250)}
                style={styles.gridItem}
              >
                <Pressable
                  onPress={() => handleSelect(word.id)}
                  style={[styles.emojiCard, { backgroundColor: bg, borderColor, borderWidth }]}
                >
                  <Text style={styles.emoji}>{word.emoji}</Text>
                  <Text style={[styles.wordLabel, { color: colors.foreground }]} numberOfLines={1}>
                    {word[targetLang]}
                  </Text>
                  {overlay && (
                    <View style={[styles.overlayBadge, { backgroundColor: isCorrect ? "#00C896" : "#FF3B30" }]}>
                      <Text style={styles.overlayText}>{overlay}</Text>
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {answered && (
          <Animated.View entering={ZoomIn.duration(200)} style={{ paddingHorizontal: 18, paddingBottom: bottomPad + 10 }}>
            <Pressable
              onPress={handleNext}
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.nextText}>{index + 1 >= TOTAL ? "See Results" : "Next"}</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 12,
    gap: 12,
  },
  progressContainer: { flex: 1, gap: 4 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 10 },
  scoreText: { fontSize: 15, fontWeight: "700" as const },
  body: { flex: 1, gap: 12 },
  questionArea: { alignItems: "center", paddingHorizontal: 18, gap: 6 },
  instruction: { fontSize: 14 },
  wordRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  targetWord: { fontSize: 32, fontWeight: "800" as const, textAlign: "center" },
  langLabel: { fontSize: 12 },
  grid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 10,
  },
  gridItem: { width: "47%" },
  emojiCard: {
    borderRadius: 18,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    overflow: "hidden",
  },
  emoji: { fontSize: 44 },
  wordLabel: { fontSize: 12, fontWeight: "600" as const, textAlign: "center" },
  overlayBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  overlayText: { color: "#fff", fontSize: 14, fontWeight: "800" as const },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 8,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
});
