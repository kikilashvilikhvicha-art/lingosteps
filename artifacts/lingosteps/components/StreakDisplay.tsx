import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface StreakDisplayProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export function StreakDisplay({ streak, size = "md" }: StreakDisplayProps) {
  const colors = useColors();
  const iconSize = size === "sm" ? 14 : size === "lg" ? 24 : 18;
  const fontSize = size === "sm" ? 13 : size === "lg" ? 20 : 16;

  return (
    <View style={styles.container}>
      <Feather name="zap" size={iconSize} color="#FF6B6B" />
      <Text style={[styles.text, { color: colors.foreground, fontSize }]}>
        {streak}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  text: {
    fontWeight: "700" as const,
  },
});
