import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { generateQuestions, scrambleWord, calcXP, calcCoins } from "@/utils/gameLogic";
import { speak } from "@/utils/speechUtils";
import type { Question } from "@/utils/gameLogic";

const TOTAL = 8;

export default function UnscrambleScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { sourceLang, targetLang, recordGameResult } = useGame();

  const [questions] = useState<Question[]>(() =>
    generateQuestions({ sourceLang, targetLang, categoryId: category, count: TOTAL })
  );
  const [index, setIndex] = useState(0);
  const [scrambled, setScrambled] = useState<string[]>([]);
  const [chosen, setChosen] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const current = questions[index];
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (current) {
      const s = scrambleWord(current.correctAnswer);
      setScrambled(s);
      setChosen([]);
      setFeedback(null);
      speak(current.sourceText, sourceLang);
    }
  }, [index]);

  function handleLetterTap(idx: number) {
    if (feedback || chosen.includes(idx)) return;
    const newChosen = [...chosen, idx];
    setChosen(newChosen);

    if (newChosen.length === scrambled.length) {
      const built = newChosen.map((i) => scrambled[i]).join("");
      const isCorrect = built.toLowerCase() === current.correctAnswer.toLowerCase();
      setFeedback(isCorrect ? "correct" : "wrong");
      if (isCorrect) {
        setScore((s) => s + 1);
        speak(current.correctAnswer, targetLang);
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }

  function handleChosenTap(pos: number) {
    if (feedback) return;
    const removedIdx = chosen[pos];
    setChosen(chosen.filter((_, i) => i !== pos));
  }

  function handleNext() {
    if (index + 1 >= TOTAL) {
      const xp = calcXP(score, TOTAL, "unscramble");
      const coins = calcCoins(score, TOTAL);
      const { newAchievements, leveledUp } = recordGameResult({
        type: "quiz",
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
          mode: "unscramble",
        },
      });
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (!current) return null;

  const builtWord = chosen.map((i) => scrambled[i]).join("");
  const progress = (index + 1) / TOTAL;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: "#00C896" }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>{index + 1}/{TOTAL}</Text>
        </View>
        <Text style={[styles.scoreText, { color: "#00C896" }]}>⭐ {score}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <Animated.View key={index} entering={FadeInDown.duration(300)} style={styles.questionCard}>
          <Pressable onPress={() => speak(current.sourceText, sourceLang)} style={styles.speakBtn}>
            <Feather name="volume-2" size={18} color={colors.primary} />
          </Pressable>
          <Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>
            {sourceLang === "ka" ? "Georgian" : "Italian"}
          </Text>
          <Text style={[styles.questionWord, { color: colors.foreground }]}>{current.sourceText}</Text>
          <Text style={[styles.instruction, { color: colors.mutedForeground }]}>
            Spell in {targetLang === "it" ? "Italian" : "Georgian"}
          </Text>
        </Animated.View>

        {/* Answer slots */}
        <View style={styles.answerRow}>
          {scrambled.map((_, i) => {
            const letter = chosen[i] !== undefined ? scrambled[chosen[i]] : "";
            const slotColor = !feedback ? colors.border
              : feedback === "correct" ? "#00C896" : "#FF3B30";
            return (
              <Pressable
                key={i}
                onPress={() => letter && handleChosenTap(i)}
                style={[styles.slot, { borderColor: slotColor, backgroundColor: letter ? colors.card : colors.muted }]}
              >
                <Text style={[styles.slotLetter, { color: feedback === "correct" ? "#00C896" : feedback === "wrong" ? "#FF3B30" : colors.foreground }]}>
                  {letter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {feedback && (
          <Animated.View entering={FadeInDown.duration(200)} style={styles.feedbackBox}>
            {feedback === "correct" ? (
              <Text style={[styles.feedbackText, { color: "#00C896" }]}>Correct!</Text>
            ) : (
              <View style={styles.wrongFeedback}>
                <Text style={[styles.feedbackText, { color: "#FF3B30" }]}>Wrong</Text>
                <Text style={[styles.correctAnswer, { color: colors.foreground }]}>
                  Answer: <Text style={{ color: colors.primary, fontWeight: "700" as const }}>{current.correctAnswer}</Text>
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* Letter tiles */}
        {!feedback && (
          <View style={styles.tiles}>
            {scrambled.map((letter, i) => {
              const used = chosen.includes(i);
              return (
                <Pressable
                  key={i}
                  onPress={() => handleLetterTap(i)}
                  style={[
                    styles.tile,
                    {
                      backgroundColor: used ? colors.muted : colors.primary + "20",
                      borderColor: used ? colors.border : colors.primary,
                      opacity: used ? 0.4 : 1,
                    },
                  ]}
                >
                  <Text style={[styles.tileLetter, { color: used ? colors.mutedForeground : colors.primary }]}>
                    {letter}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {feedback && (
          <Animated.View entering={ZoomIn.duration(200)}>
            <Pressable
              onPress={handleNext}
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.nextText}>{index + 1 >= TOTAL ? "See Results" : "Next"}</Text>
              <Feather name="arrow-right" size={18} color="#fff" />
            </Pressable>
          </Animated.View>
        )}
      </ScrollView>
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
  body: { paddingHorizontal: 18, paddingBottom: 40, gap: 20 },
  questionCard: { alignItems: "center", gap: 8, paddingTop: 10 },
  speakBtn: { padding: 10 },
  questionLabel: { fontSize: 12, fontWeight: "600" as const, textTransform: "uppercase", letterSpacing: 1 },
  questionWord: { fontSize: 34, fontWeight: "800" as const, textAlign: "center" },
  instruction: { fontSize: 14 },
  answerRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 8 },
  slot: {
    width: 44,
    height: 48,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  slotLetter: { fontSize: 20, fontWeight: "700" as const },
  feedbackBox: { alignItems: "center", gap: 6 },
  wrongFeedback: { alignItems: "center", gap: 4 },
  feedbackText: { fontSize: 22, fontWeight: "800" as const },
  correctAnswer: { fontSize: 14 },
  tiles: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  tile: {
    width: 50,
    height: 54,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  tileLetter: { fontSize: 22, fontWeight: "700" as const },
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
