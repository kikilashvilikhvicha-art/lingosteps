import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Category } from "@/data/categories";

interface CategoryCardProps {
  category: Category;
  locked?: boolean;
  compact?: boolean;
}

export function CategoryCard({ category, locked = false, compact = false }: CategoryCardProps) {
  const colors = useColors();

  function handlePress() {
    if (locked) return;
    router.push({ pathname: "/category/[id]" as any, params: { id: category.id } });
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        {
          backgroundColor: locked ? colors.muted : category.color + "15",
          borderColor: locked ? colors.border : category.color + "40",
          opacity: pressed && !locked ? 0.85 : 1,
          transform: [{ scale: pressed && !locked ? 0.97 : 1 }],
        },
      ]}
    >
      <Text style={[styles.emoji, compact && styles.emojiCompact]}>
        {locked ? "🔒" : category.emoji}
      </Text>
      <Text
        style={[
          styles.name,
          compact && styles.nameCompact,
          { color: locked ? colors.mutedForeground : colors.foreground },
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
      {!compact && (
        <Text style={[styles.count, { color: locked ? colors.mutedForeground : category.color }]}>
          {locked ? `Lvl ${category.unlockLevel}` : `${category.wordCount} words`}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    flex: 1,
    aspectRatio: 1,
  },
  cardCompact: {
    padding: 10,
    gap: 4,
    aspectRatio: undefined,
    height: 72,
    flex: undefined,
    width: "31%",
  },
  emoji: { fontSize: 28 },
  emojiCompact: { fontSize: 20 },
  name: { fontSize: 12, fontWeight: "600" as const, textAlign: "center" },
  nameCompact: { fontSize: 10 },
  count: { fontSize: 11, fontWeight: "500" as const },
});
