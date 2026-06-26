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
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { generateQuestions, calcXP, calcCoins } from "@/utils/gameLogic";
import { speak } from "@/utils/speechUtils";
import type { Question } from "@/utils/gameLogic";

const TOTAL = 10;

export default function QuizScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { sourceLang, targetLang, recordGameResult } = useGame();

  const [questions] = useState<Question[]>(() =>
    generateQuestions({ sourceLang, targetLang, categoryId: category, count: TOTAL })
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const current = questions[index];
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    if (current) {
      speak(current.sourceText, sourceLang);
    }
  }, [index]);

  function handleSelect(option: string) {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    const isCorrect = option === current.correctAnswer;
    if (isCorrect) {
      setScore((s) => s + 1);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    speak(current.correctAnswer, targetLang);
  }

  function handleNext() {
    if (index + 1 >= TOTAL) {
      const finalScore = score + (selected === current.correctAnswer ? 0 : 0);
      const xp = calcXP(score, TOTAL, "quiz");
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
          mode: "quiz",
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
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.progressContainer}>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <Animated.View
              style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: colors.primary }]}
            />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
            {index + 1}/{TOTAL}
          </Text>
        </View>
        <Text style={[styles.scoreText, { color: colors.primary }]}>⭐ {score}</Text>
      </View>

      {/* Question */}
      <View style={styles.questionArea}>
        <Animated.View key={index} entering={FadeInDown.duration(300)} style={styles.questionCard}>
          <Pressable onPress={() => speak(current.sourceText, sourceLang)} style={styles.speakBtn}>
            <Feather name="volume-2" size={18} color={colors.primary} />
          </Pressable>
          <Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>
            {sourceLang === "ka" ? "Georgian" : "Italian"}
          </Text>
          <Text style={[styles.questionWord, { color: colors.foreground }]}>
            {current.sourceText}
          </Text>
          <Text style={[styles.questionInstruction, { color: colors.mutedForeground }]}>
            Select the {targetLang === "it" ? "Italian" : "Georgian"} translation
          </Text>
        </Animated.View>
      </View>

      {/* Options */}
      <View style={[styles.options, { paddingBottom: bottomPad + 20 }]}>
        {current.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === current.correctAnswer;
          let bg = colors.card;
          let border = colors.border;
          let textColor = colors.foreground;

          if (answered) {
            if (isCorrect) { bg = "#00C89618"; border = "#00C896"; textColor = "#00C896"; }
            else if (isSelected && !isCorrect) { bg = "#FF3B3018"; border = "#FF3B30"; textColor = "#FF3B30"; }
          } else if (isSelected) {
            bg = colors.primary + "18";
            border = colors.primary;
          }

          return (
            <Animated.View key={opt} entering={FadeInDown.delay(i * 60).duration(250)}>
              <Pressable
                onPress={() => handleSelect(opt)}
                style={[styles.option, { backgroundColor: bg, borderColor: border }]}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                {answered && isCorrect && <Feather name="check-circle" size={18} color="#00C896" />}
                {answered && isSelected && !isCorrect && <Feather name="x-circle" size={18} color="#FF3B30" />}
              </Pressable>
            </Animated.View>
          );
        })}

        {answered && (
          <Animated.View entering={ZoomIn.duration(200)}>
            <Pressable
              onPress={handleNext}
              style={[styles.nextBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.nextText}>
                {index + 1 >= TOTAL ? "See Results" : "Next"}
              </Text>
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
  progressText: { fontSize: 10, fontWeight: "500" as const },
  scoreText: { fontSize: 15, fontWeight: "700" as const },
  questionArea: { flex: 1, paddingHorizontal: 18, justifyContent: "center" },
  questionCard: { alignItems: "center", gap: 10 },
  speakBtn: {
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  questionLabel: { fontSize: 12, fontWeight: "600" as const, textTransform: "uppercase", letterSpacing: 1 },
  questionWord: { fontSize: 38, fontWeight: "800" as const, textAlign: "center" },
  questionInstruction: { fontSize: 14 },
  options: { paddingHorizontal: 18, gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  optionText: { fontSize: 16, fontWeight: "600" as const, flex: 1 },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 14,
    gap: 8,
    marginTop: 4,
  },
  nextText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
});
