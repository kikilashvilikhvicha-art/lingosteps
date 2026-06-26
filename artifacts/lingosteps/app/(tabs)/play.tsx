import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { GameModeCard } from "@/components/GameModeCard";
import { GAME_MODES } from "@/data/gameModes";
import { CATEGORIES } from "@/data/categories";

export default function PlayScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { stats, isUnlocked } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Play</Text>
      <Text style={[styles.pageSubtitle, { color: colors.mutedForeground }]}>
        Choose a game mode and category
      </Text>

      {/* Category Filter */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
        <Pressable
          onPress={() => setSelectedCategory(undefined)}
          style={[
            styles.catChip,
            {
              backgroundColor: !selectedCategory ? colors.primary : colors.muted,
              borderColor: !selectedCategory ? colors.primary : colors.border,
            },
          ]}
        >
          <Text style={[styles.catChipText, { color: !selectedCategory ? "#fff" : colors.mutedForeground }]}>
            All
          </Text>
        </Pressable>
        {CATEGORIES.map((cat) => {
          const locked = !isUnlocked(cat.id, cat.unlockLevel);
          const active = selectedCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              onPress={() => !locked && setSelectedCategory(active ? undefined : cat.id)}
              style={[
                styles.catChip,
                {
                  backgroundColor: active ? cat.color : locked ? colors.muted : cat.color + "15",
                  borderColor: active ? cat.color : locked ? colors.border : cat.color + "40",
                  opacity: locked ? 0.5 : 1,
                },
              ]}
            >
              <Text style={styles.catEmoji}>{locked ? "🔒" : cat.emoji}</Text>
              <Text
                style={[
                  styles.catChipText,
                  { color: active ? "#fff" : locked ? colors.mutedForeground : colors.foreground },
                ]}
              >
                {cat.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Game Modes */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Choose Mode</Text>
      {GAME_MODES.map((mode) => {
        const locked = stats.level < mode.unlockLevel;
        return (
          <GameModeCard
            key={mode.id}
            mode={mode}
            disabled={locked}
            categoryId={selectedCategory}
          />
        );
      })}

      {/* Tip box */}
      <View style={[styles.tip, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Feather name="info" size={14} color={colors.primary} />
        <Text style={[styles.tipText, { color: colors.mutedForeground }]}>
          Select a category to focus on specific vocabulary. Leave on "All" for a mixed challenge.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  pageTitle: { fontSize: 28, fontWeight: "800" as const, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, marginBottom: 20 },
  sectionTitle: { fontSize: 15, fontWeight: "700" as const, marginBottom: 10 },
  catScroll: { marginBottom: 20 },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: 8,
  },
  catEmoji: { fontSize: 14 },
  catChipText: { fontSize: 12, fontWeight: "600" as const },
  tip: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  tipText: { flex: 1, fontSize: 12, lineHeight: 18 },
});
