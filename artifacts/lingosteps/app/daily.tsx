import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
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
import { getDailyWords, calcXP, calcCoins } from "@/utils/gameLogic";
import { speak } from "@/utils/speechUtils";
import type { Word } from "@/data/vocabulary";

const TOTAL = 10;

interface DailyQuestion {
  word: Word;
  sourceText: string;
  correctAnswer: string;
  options: string[];
}

function buildDailyQuestions(
  sourceLang: "ka" | "it",
  targetLang: "ka" | "it",
  dateString: string
): DailyQuestion[] {
  const words = getDailyWords(dateString, TOTAL);
  return words.map((word) => {
    const correctAnswer = word[targetLang];
    const allWords = getDailyWords(dateString, 50);
    const others = allWords.filter((w) => w.id !== word.id);
    const distractors = others
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w[targetLang]);
    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
    return { word, sourceText: word[sourceLang], correctAnswer, options };
  });
}

export default function DailyScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { sourceLang, targetLang, recordGameResult, getTodayString, hasDoneToday } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const todayStr = getTodayString();
  const alreadyDone = hasDoneToday();

  const [questions] = useState<DailyQuestion[]>(() =>
    buildDailyQuestions(sourceLang, targetLang, todayStr)
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(alreadyDone);

  const current = questions[index];

  useEffect(() => {
    if (current && !alreadyDone) speak(current.sourceText, sourceLang);
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
      const finalScore = score;
      const xp = calcXP(finalScore, TOTAL, "daily");
      const coins = calcCoins(finalScore, TOTAL);
      recordGameResult({
        type: "daily",
        score: finalScore,
        total: TOTAL,
        xpEarned: xp,
        coinsEarned: coins,
        wordsEncountered: TOTAL,
      });
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    }
  }

  if (done) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </Pressable>
        </View>
        <View style={styles.doneBody}>
          <Animated.View entering={ZoomIn.duration(400)} style={styles.doneHero}>
            <Text style={styles.doneEmoji}>🎉</Text>
            <Text style={[styles.doneTitle, { color: colors.foreground }]}>Daily Complete!</Text>
            {!alreadyDone && (
              <Text style={[styles.doneScore, { color: colors.primary }]}>
                {score}/{TOTAL} correct · +{calcXP(score, TOTAL, "daily")} XP
              </Text>
            )}
            <Text style={[styles.doneMsg, { color: colors.mutedForeground }]}>
              Come back tomorrow for a new challenge
            </Text>
          </Animated.View>
          <Pressable
            onPress={() => router.navigate("/(tabs)/index")}
            style={[styles.homeBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="home" size={18} color="#fff" />
            <Text style={styles.homeBtnText}>Go Home</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!current) return null;

  const progress = (index + 1) / TOTAL;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.headerMid}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Daily Challenge</Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%`, backgroundColor: "#4CC9F0" }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.mutedForeground }]}>{index + 1}/{TOTAL}</Text>
        </View>
        <Text style={[styles.xpBadge, { color: "#4CC9F0" }]}>2x XP</Text>
      </View>

      <View style={styles.questionArea}>
        <Animated.View key={index} entering={FadeInDown.duration(300)} style={styles.questionCard}>
          <Pressable onPress={() => speak(current.sourceText, sourceLang)} style={styles.speakBtn}>
            <Feather name="volume-2" size={18} color="#4CC9F0" />
          </Pressable>
          <Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>
            {sourceLang === "ka" ? "Georgian" : "Italian"}
          </Text>
          <Text style={[styles.questionWord, { color: colors.foreground }]}>{current.sourceText}</Text>
          <Text style={[styles.instruction, { color: colors.mutedForeground }]}>
            Select the {targetLang === "it" ? "Italian" : "Georgian"} translation
          </Text>
        </Animated.View>
      </View>

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
              style={[styles.nextBtn, { backgroundColor: "#4CC9F0" }]}
            >
              <Text style={styles.nextText}>{index + 1 >= TOTAL ? "Finish!" : "Next"}</Text>
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
  headerMid: { flex: 1, gap: 4 },
  headerTitle: { fontSize: 13, fontWeight: "700" as const },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 10 },
  xpBadge: { fontSize: 13, fontWeight: "700" as const },
  questionArea: { flex: 1, paddingHorizontal: 18, justifyContent: "center" },
  questionCard: { alignItems: "center", gap: 10 },
  speakBtn: { padding: 10 },
  questionLabel: { fontSize: 12, fontWeight: "600" as const, textTransform: "uppercase", letterSpacing: 1 },
  questionWord: { fontSize: 36, fontWeight: "800" as const, textAlign: "center" },
  instruction: { fontSize: 14 },
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
  doneBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 20,
  },
  doneHero: { alignItems: "center", gap: 10 },
  doneEmoji: { fontSize: 64 },
  doneTitle: { fontSize: 28, fontWeight: "800" as const },
  doneScore: { fontSize: 16, fontWeight: "700" as const },
  doneMsg: { fontSize: 14, textAlign: "center", lineHeight: 21 },
  homeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  homeBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" as const },
});
