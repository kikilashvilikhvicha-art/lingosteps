import React from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { CategoryCard } from "@/components/CategoryCard";
import { CATEGORIES } from "@/data/categories";

export default function LearnScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isUnlocked } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const unlocked = CATEGORIES.filter((c) => isUnlocked(c.id, c.unlockLevel));
  const locked = CATEGORIES.filter((c) => !isUnlocked(c.id, c.unlockLevel));

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Learn</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
        Browse categories and practice vocabulary
      </Text>

      {unlocked.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Available</Text>
          <View style={styles.grid}>
            {unlocked.map((cat) => (
              <CategoryCard key={cat.id} category={cat} locked={false} />
            ))}
          </View>
        </>
      )}

      {locked.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Locked</Text>
          <Text style={[styles.lockHint, { color: colors.mutedForeground }]}>
            Level up by playing games to unlock more categories
          </Text>
          <View style={styles.grid}>
            {locked.map((cat) => (
              <CategoryCard key={cat.id} category={cat} locked={true} />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  pageTitle: { fontSize: 28, fontWeight: "800" as const, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontWeight: "800" as const, marginBottom: 12 },
  lockHint: { fontSize: 12, marginBottom: 12, marginTop: -6 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 22,
  },
});
