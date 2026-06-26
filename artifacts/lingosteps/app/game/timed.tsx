import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { generateQuestions, calcXP, calcCoins } from "@/utils/gameLogic";
import { speak } from "@/utils/speechUtils";
import type { Question } from "@/utils/gameLogic";

const DURATION = 60;

export default function TimedScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { category } = useLocalSearchParams<{ category?: string }>();
  const { sourceLang, targetLang, recordGameResult } = useGame();

  const [questions] = useState<Question[]>(() =>
    generateQuestions({ sourceLang, targetLang, categoryId: category, count: 50 })
  );
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const endGame = useCallback(() => {
    setGameOver(true);
    if (timerRef.current) clearInterval(timerRef.current);
    const xp = calcXP(score, answered, "timed");
    const coins = calcCoins(score, answered || 1);
    const { newAchievements, leveledUp } = recordGameResult({
      type: "timed",
      score,
      total: answered,
      xpEarned: xp,
      coinsEarned: coins,
      wordsEncountered: answered,
    });
    setTimeout(() => {
      router.replace({
        pathname: "/game/results",
        params: {
          score: String(score),
          total: String(answered),
          xp: String(xp),
          coins: String(coins),
          newAchievements: newAchievements.join(","),
          leveledUp: leveledUp ? "1" : "0",
          mode: "timed",
        },
      });
    }, 1200);
  }, [score, answered, recordGameResult]);

  useEffect(() => {
    if (started && !gameOver) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            endGame();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, gameOver, endGame]);

  useEffect(() => {
    if (started && questions[questionIndex]) {
      speak(questions[questionIndex].sourceText, sourceLang);
    }
  }, [questionIndex, started]);

  function startGame() {
    setStarted(true);
  }

  function handleSelect(option: string) {
    if (feedback !== null || !started || gameOver) return;
    setSelected(option);
    const current = questions[questionIndex];
    const isCorrect = option === current.correctAnswer;
    setFeedback(isCorrect);
    if (isCorrect) {
      setScore((s) => s + 1);
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setAnswered((a) => a + 1);

    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      setQuestionIndex((i) => Math.min(i + 1, questions.length - 1));
    }, 500);
  }

  const current = questions[questionIndex];
  const timerColor = timeLeft <= 10 ? "#FF3B30" : timeLeft <= 20 ? "#FF9F43" : colors.primary;
  const timerProgress = timeLeft / DURATION;

  if (!started) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="x" size={22} color={colors.mutedForeground} />
          </Pressable>
        </View>
        <View style={styles.startBody}>
          <Text style={[styles.startEmoji]}>⏱</Text>
          <Text style={[styles.startTitle, { color: colors.foreground }]}>Timed Challenge</Text>
          <Text style={[styles.startDesc, { color: colors.mutedForeground }]}>
            Answer as many questions as you can in {DURATION} seconds.{"\n"}
            Each correct answer earns 1.5x XP!
          </Text>
          <Pressable
            onPress={startGame}
            style={[styles.startBtn, { backgroundColor: "#FF9F43" }]}
          >
            <Text style={styles.startBtnText}>Start!</Text>
            <Feather name="zap" size={20} color="#fff" />
          </Pressable>
        </View>
      </View>
    );
  }

  if (!current) return null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Pressable onPress={() => { endGame(); router.back(); }} hitSlop={12}>
          <Feather name="x" size={22} color={colors.mutedForeground} />
        </Pressable>
        <View style={styles.timerContainer}>
          <View style={[styles.timerTrack, { backgroundColor: colors.muted }]}>
            <View style={[styles.timerFill, { width: `${timerProgress * 100}%`, backgroundColor: timerColor }]} />
          </View>
          <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        </View>
        <View style={styles.scoreBox}>
          <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Score</Text>
          <Text style={[styles.scoreNum, { color: "#FF9F43" }]}>{score}</Text>
        </View>
      </View>

      <View style={styles.questionArea}>
        <Animated.View key={questionIndex} entering={FadeInDown.duration(200)}>
          <Text style={[styles.questionLabel, { color: colors.mutedForeground }]}>
            {sourceLang === "ka" ? "Georgian" : "Italian"}
          </Text>
          <Pressable onPress={() => speak(current.sourceText, sourceLang)} style={styles.wordRow}>
            <Text style={[styles.questionWord, { color: colors.foreground }]}>{current.sourceText}</Text>
            <Feather name="volume-2" size={16} color={colors.primary} />
          </Pressable>
        </Animated.View>
      </View>

      <View style={[styles.options, { paddingBottom: bottomPad + 20 }]}>
        {current.options.map((opt, i) => {
          const isSelected = selected === opt;
          const isCorrect = opt === current.correctAnswer;
          let bg = colors.card;
          let border = colors.border;
          let textColor = colors.foreground;

          if (feedback !== null && isSelected) {
            if (isCorrect) { bg = "#00C89618"; border = "#00C896"; textColor = "#00C896"; }
            else { bg = "#FF3B3018"; border = "#FF3B30"; textColor = "#FF3B30"; }
          }

          return (
            <Pressable
              key={opt}
              onPress={() => handleSelect(opt)}
              style={[styles.option, { backgroundColor: bg, borderColor: border }]}
            >
              <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
            </Pressable>
          );
        })}
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
  timerContainer: { flex: 1, gap: 4 },
  timerTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  timerFill: { height: 8, borderRadius: 4 },
  timerText: { fontSize: 13, fontWeight: "700" as const, textAlign: "right" },
  scoreBox: { alignItems: "center" },
  scoreLabel: { fontSize: 10 },
  scoreNum: { fontSize: 20, fontWeight: "800" as const },
  questionArea: { flex: 1, paddingHorizontal: 18, justifyContent: "center", alignItems: "center", gap: 10 },
  questionLabel: { fontSize: 12, fontWeight: "600" as const, textTransform: "uppercase", letterSpacing: 1, textAlign: "center", marginBottom: 6 },
  wordRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  questionWord: { fontSize: 36, fontWeight: "800" as const, textAlign: "center" },
  options: { paddingHorizontal: 18, gap: 10 },
  option: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: "center",
  },
  optionText: { fontSize: 16, fontWeight: "600" as const },
  startBody: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  startEmoji: { fontSize: 60 },
  startTitle: { fontSize: 28, fontWeight: "800" as const },
  startDesc: { fontSize: 14, textAlign: "center", lineHeight: 22 },
  startBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  startBtnText: { color: "#fff", fontSize: 18, fontWeight: "700" as const },
});
