import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { ACHIEVEMENTS } from "@/data/achievements";

export default function ResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    score: string;
    total: string;
    xp: string;
    coins: string;
    newAchievements: string;
    leveledUp: string;
    mode: string;
  }>();

  const score = parseInt(params.score ?? "0");
  const total = parseInt(params.total ?? "1");
  const xp = parseInt(params.xp ?? "0");
  const coins = parseInt(params.coins ?? "0");
  const leveledUp = params.leveledUp === "1";
  const newAchIds = params.newAchievements ? params.newAchievements.split(",").filter(Boolean) : [];
  const newAchs = ACHIEVEMENTS.filter((a) => newAchIds.includes(a.id));

  const pct = total > 0 ? score / total : 0;
  const isPerfect = score === total;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const resultEmoji = isPerfect ? "🏆" : pct >= 0.8 ? "⭐" : pct >= 0.5 ? "👍" : "📚";
  const resultMsg = isPerfect ? "Perfect score!" : pct >= 0.8 ? "Great job!" : pct >= 0.5 ? "Good effort!" : "Keep practicing!";
  const resultColor = isPerfect ? "#FFD166" : pct >= 0.8 ? "#00C896" : pct >= 0.5 ? colors.primary : "#FF9F43";

  useEffect(() => {
    if (Platform.OS !== "web") {
      if (isPerfect) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, []);

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: bottomPad + 30 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Result Hero */}
      <Animated.View entering={ZoomIn.duration(400)} style={styles.hero}>
        <Text style={styles.heroEmoji}>{resultEmoji}</Text>
        <Text style={[styles.heroMsg, { color: resultColor }]}>{resultMsg}</Text>

        {/* Score circle */}
        <View style={[styles.scoreCircle, { borderColor: resultColor }]}>
          <Text style={[styles.scoreNum, { color: resultColor }]}>{score}</Text>
          <Text style={[styles.scoreTotal, { color: colors.mutedForeground }]}>/{total}</Text>
        </View>
      </Animated.View>

      {/* Level up banner */}
      {leveledUp && (
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={[styles.banner, { backgroundColor: "#FFD16620", borderColor: "#FFD166" }]}>
          <Text style={styles.bannerEmoji}>🎉</Text>
          <Text style={[styles.bannerText, { color: "#FFD166" }]}>Level Up! You leveled up!</Text>
        </Animated.View>
      )}

      {/* Rewards */}
      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.rewards, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.rewardItem}>
          <Feather name="star" size={20} color="#FFD166" />
          <Text style={[styles.rewardValue, { color: colors.foreground }]}>+{xp} XP</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.rewardItem}>
          <Text style={styles.rewardEmoji}>🪙</Text>
          <Text style={[styles.rewardValue, { color: colors.foreground }]}>+{coins} coins</Text>
        </View>
      </Animated.View>

      {/* New Achievements */}
      {newAchs.length > 0 && (
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Achievements Unlocked</Text>
          {newAchs.map((ach) => (
            <View
              key={ach.id}
              style={[styles.achCard, { backgroundColor: ach.color + "18", borderColor: ach.color + "40" }]}
            >
              <Text style={styles.achIcon}>{ach.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.achTitle, { color: colors.foreground }]}>{ach.title}</Text>
                <Text style={[styles.achDesc, { color: colors.mutedForeground }]}>{ach.description}</Text>
              </View>
              <Text style={[styles.achXP, { color: ach.color }]}>+{ach.xpReward}XP</Text>
            </View>
          ))}
        </Animated.View>
      )}

      {/* Accuracy */}
      <Animated.View entering={FadeInDown.delay(300).duration(400)} style={[styles.accuracyBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.accLabel, { color: colors.mutedForeground }]}>Accuracy</Text>
        <Text style={[styles.accValue, { color: colors.foreground }]}>{Math.round(pct * 100)}%</Text>
      </Animated.View>

      {/* Buttons */}
      <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.buttons}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.btnSecondary, { borderColor: colors.border, backgroundColor: colors.card }]}
        >
          <Feather name="rotate-ccw" size={16} color={colors.foreground} />
          <Text style={[styles.btnSecondaryText, { color: colors.foreground }]}>Play Again</Text>
        </Pressable>
        <Pressable
          onPress={() => router.navigate("/(tabs)/play")}
          style={[styles.btnPrimary, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.btnPrimaryText}>More Games</Text>
          <Feather name="arrow-right" size={16} color="#fff" />
        </Pressable>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18, gap: 16 },
  hero: { alignItems: "center", gap: 8, paddingVertical: 10 },
  heroEmoji: { fontSize: 56 },
  heroMsg: { fontSize: 24, fontWeight: "800" as const },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 2,
    marginTop: 4,
  },
  scoreNum: { fontSize: 36, fontWeight: "800" as const },
  scoreTotal: { fontSize: 18, fontWeight: "600" as const, alignSelf: "flex-end", marginBottom: 4 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  bannerEmoji: { fontSize: 22 },
  bannerText: { fontSize: 16, fontWeight: "700" as const },
  rewards: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  rewardItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  rewardEmoji: { fontSize: 20 },
  rewardValue: { fontSize: 16, fontWeight: "700" as const },
  divider: { width: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "800" as const, marginBottom: 8 },
  achCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 8,
  },
  achIcon: { fontSize: 22 },
  achTitle: { fontSize: 14, fontWeight: "700" as const },
  achDesc: { fontSize: 12 },
  achXP: { fontSize: 12, fontWeight: "700" as const },
  accuracyBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
  },
  accLabel: { fontSize: 14 },
  accValue: { fontSize: 18, fontWeight: "700" as const },
  buttons: { flexDirection: "row", gap: 10, marginTop: 4 },
  btnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
  },
  btnSecondaryText: { fontSize: 14, fontWeight: "600" as const },
  btnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 15,
    borderRadius: 14,
  },
  btnPrimaryText: { color: "#fff", fontSize: 14, fontWeight: "700" as const },
});
