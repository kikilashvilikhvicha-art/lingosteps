import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { AchievementCard } from "@/components/AchievementCard";
import { ACHIEVEMENTS } from "@/data/achievements";

export default function AchievementsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const unlockedCount = ACHIEVEMENTS.filter((a) => stats.achievements.includes(a.id)).length;
  const total = ACHIEVEMENTS.length;
  const unlockedItems = ACHIEVEMENTS.filter((a) => stats.achievements.includes(a.id));
  const lockedItems = ACHIEVEMENTS.filter((a) => !stats.achievements.includes(a.id));

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Achievements</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
        {unlockedCount} of {total} unlocked
      </Text>

      {/* Progress summary */}
      <View style={[styles.summary, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.summaryNum, { color: colors.primary }]}>{unlockedCount}</Text>
        <Text style={[styles.summarySlash, { color: colors.mutedForeground }]}>/{total}</Text>
        <View style={styles.summaryBar}>
          <View
            style={[
              styles.summaryFill,
              {
                width: `${(unlockedCount / total) * 100}%`,
                backgroundColor: colors.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>
          {Math.round((unlockedCount / total) * 100)}% complete
        </Text>
      </View>

      {unlockedItems.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Unlocked</Text>
          {unlockedItems.map((ach) => (
            <AchievementCard key={ach.id} achievement={ach} unlocked />
          ))}
        </>
      )}

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Locked</Text>
      {lockedItems.map((ach) => (
        <AchievementCard key={ach.id} achievement={ach} unlocked={false} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  pageTitle: { fontSize: 28, fontWeight: "800" as const, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, marginBottom: 18 },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 22,
  },
  summaryNum: { fontSize: 22, fontWeight: "800" as const },
  summarySlash: { fontSize: 16, fontWeight: "500" as const },
  summaryBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E8E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  summaryFill: { height: 8, borderRadius: 4 },
  summaryLabel: { fontSize: 12, fontWeight: "600" as const },
  sectionTitle: { fontSize: 17, fontWeight: "800" as const, marginBottom: 10 },
});
