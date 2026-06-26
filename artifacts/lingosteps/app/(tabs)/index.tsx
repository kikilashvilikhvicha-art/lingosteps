import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { ProgressBar } from "@/components/ProgressBar";
import { StreakDisplay } from "@/components/StreakDisplay";
import { GAME_MODES } from "@/data/gameModes";
import { CATEGORIES } from "@/data/categories";

const LANG_LABEL: Record<string, string> = {
  "ka-it": "Georgian → Italian",
  "it-ka": "Italian → Georgian",
};

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats, xpInCurrentLevel, xpForNextLevel, hasDoneToday } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : 0;
  const isDailyDone = hasDoneToday();

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: bottomPad + 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
            Welcome back,
          </Text>
          <Text style={[styles.username, { color: colors.foreground }]}>
            {stats.username}
          </Text>
        </View>
        <StreakDisplay streak={stats.streak} size="lg" />
      </View>

      {/* XP Card */}
      <LinearGradient
        colors={[colors.primary, colors.primary + "CC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.xpCard}
      >
        <View style={styles.xpRow}>
          <View>
            <Text style={styles.xpLabel}>Level {stats.level}</Text>
            <Text style={styles.xpValue}>{stats.xp} XP</Text>
          </View>
          <View style={styles.coins}>
            <Text style={styles.coinEmoji}>🪙</Text>
            <Text style={styles.coinText}>{stats.coins}</Text>
          </View>
        </View>
        <ProgressBar
          progress={xpInCurrentLevel / xpForNextLevel}
          color="rgba(255,255,255,0.9)"
          backgroundColor="rgba(255,255,255,0.3)"
          height={8}
        />
        <Text style={styles.xpSub}>
          {xpForNextLevel - xpInCurrentLevel} XP to level {stats.level + 1}
        </Text>
      </LinearGradient>

      {/* Language Mode */}
      <Pressable
        onPress={() => router.push("/(tabs)/profile")}
        style={[styles.langBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Feather name="globe" size={14} color={colors.primary} />
        <Text style={[styles.langText, { color: colors.primary }]}>
          {LANG_LABEL[stats.languageMode]}
        </Text>
        <Feather name="chevron-right" size={14} color={colors.mutedForeground} />
      </Pressable>

      {/* Daily Challenge */}
      <Pressable
        onPress={() => router.push("/daily")}
        style={({ pressed }) => [
          styles.dailyCard,
          {
            backgroundColor: isDailyDone ? colors.muted : "#4CC9F022",
            borderColor: isDailyDone ? colors.border : "#4CC9F0",
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={[styles.dailyIcon, { backgroundColor: isDailyDone ? colors.border : "#4CC9F020" }]}>
          <Feather name="calendar" size={22} color={isDailyDone ? colors.mutedForeground : "#4CC9F0"} />
        </View>
        <View style={styles.dailyInfo}>
          <Text style={[styles.dailyTitle, { color: isDailyDone ? colors.mutedForeground : colors.foreground }]}>
            Daily Challenge
          </Text>
          <Text style={[styles.dailyDesc, { color: colors.mutedForeground }]}>
            {isDailyDone ? "Completed today! Come back tomorrow." : "Special mixed challenge — 2x XP!"}
          </Text>
        </View>
        {isDailyDone ? (
          <Feather name="check-circle" size={22} color={colors.success} />
        ) : (
          <Feather name="arrow-right" size={20} color="#4CC9F0" />
        )}
      </Pressable>

      {/* Quick Play */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Quick Play</Text>
      <View style={styles.quickGrid}>
        {GAME_MODES.slice(0, 4).map((mode) => (
          <Pressable
            key={mode.id}
            onPress={() => router.push(mode.route as any)}
            style={({ pressed }) => [
              styles.quickCard,
              {
                backgroundColor: mode.color + "15",
                borderColor: mode.color + "30",
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.96 : 1 }],
              },
            ]}
          >
            <Feather name={mode.icon as any} size={24} color={mode.color} />
            <Text style={[styles.quickTitle, { color: colors.foreground }]} numberOfLines={2}>
              {mode.title}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Top Categories */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        {CATEGORIES.slice(0, 6).map((cat) => (
          <Pressable
            key={cat.id}
            onPress={() => router.push({ pathname: "/category/[id]" as any, params: { id: cat.id } })}
            style={({ pressed }) => [
              styles.catPill,
              {
                backgroundColor: cat.color + "18",
                borderColor: cat.color + "40",
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text style={styles.catEmoji}>{cat.emoji}</Text>
            <Text style={[styles.catName, { color: colors.foreground }]}>{cat.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Stats Row */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Your Stats</Text>
      <View style={[styles.statsRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { label: "Games", value: stats.totalGamesPlayed, icon: "activity" },
          { label: "Words", value: stats.wordsLearned, icon: "book" },
          { label: "Streak", value: stats.streak, icon: "zap" },
        ].map((s) => (
          <View key={s.label} style={styles.statItem}>
            <Feather name={s.icon as any} size={16} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  greeting: { fontSize: 13, fontWeight: "500" as const },
  username: { fontSize: 22, fontWeight: "800" as const },
  xpCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    gap: 10,
  },
  xpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  xpLabel: { color: "rgba(255,255,255,0.75)", fontSize: 12, fontWeight: "600" as const },
  xpValue: { color: "#fff", fontSize: 22, fontWeight: "800" as const },
  coins: { flexDirection: "row", alignItems: "center", gap: 4 },
  coinEmoji: { fontSize: 18 },
  coinText: { color: "#fff", fontSize: 18, fontWeight: "700" as const },
  xpSub: { color: "rgba(255,255,255,0.7)", fontSize: 11 },
  langBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignSelf: "flex-start",
    marginBottom: 18,
  },
  langText: { fontSize: 12, fontWeight: "600" as const },
  dailyCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
    marginBottom: 22,
  },
  dailyIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  dailyInfo: { flex: 1 },
  dailyTitle: { fontSize: 15, fontWeight: "700" as const, marginBottom: 2 },
  dailyDesc: { fontSize: 12, lineHeight: 17 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800" as const,
    marginBottom: 12,
    marginTop: 4,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
  quickCard: {
    width: "47%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    gap: 8,
  },
  quickTitle: {
    fontSize: 12,
    fontWeight: "700" as const,
    textAlign: "center",
  },
  catScroll: { marginBottom: 22 },
  catPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 8,
  },
  catEmoji: { fontSize: 16 },
  catName: { fontSize: 13, fontWeight: "600" as const },
  statsRow: {
    flexDirection: "row",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
    gap: 4,
  },
  statValue: { fontSize: 20, fontWeight: "800" as const },
  statLabel: { fontSize: 11, fontWeight: "500" as const },
});
