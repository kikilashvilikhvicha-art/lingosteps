import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { GameMode } from "@/data/gameModes";

interface GameModeCardProps {
  mode: GameMode;
  disabled?: boolean;
  categoryId?: string;
}

export function GameModeCard({ mode, disabled = false, categoryId }: GameModeCardProps) {
  const colors = useColors();

  function handlePress() {
    if (disabled) return;
    const params: Record<string, string> = {};
    if (categoryId) params.category = categoryId;
    router.push({ pathname: mode.route as any, params });
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed && !disabled ? 0.97 : 1 }],
        },
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: mode.color + "22" }]}>
        <Feather name={mode.icon as any} size={26} color={mode.color} />
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: colors.foreground }]}>{mode.title}</Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {mode.description}
        </Text>
      </View>
      {!disabled && (
        <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  title: { fontSize: 15, fontWeight: "700" as const, marginBottom: 2 },
  desc: { fontSize: 12, lineHeight: 17 },
});
