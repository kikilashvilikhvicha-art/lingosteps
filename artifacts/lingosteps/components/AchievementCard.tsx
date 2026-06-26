import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";
import type { Achievement } from "@/data/achievements";

interface AchievementCardProps {
  achievement: Achievement;
  unlocked: boolean;
}

export function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: unlocked ? colors.card : colors.muted,
          borderColor: unlocked ? achievement.color + "40" : colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: unlocked ? achievement.color + "20" : colors.border },
        ]}
      >
        <Text style={[styles.icon, { opacity: unlocked ? 1 : 0.4 }]}>{achievement.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text
          style={[
            styles.title,
            { color: unlocked ? colors.foreground : colors.mutedForeground },
          ]}
        >
          {achievement.title}
        </Text>
        <Text style={[styles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {achievement.description}
        </Text>
        {unlocked && (
          <Text style={[styles.xp, { color: achievement.color }]}>+{achievement.xpReward} XP</Text>
        )}
      </View>
      {!unlocked && (
        <Text style={[styles.lock, { color: colors.mutedForeground }]}>🔒</Text>
      )}
      {unlocked && (
        <Text style={[styles.checkmark, { color: achievement.color }]}>✓</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: { fontSize: 22 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700" as const, marginBottom: 2 },
  desc: { fontSize: 12, lineHeight: 17 },
  xp: { fontSize: 11, fontWeight: "600" as const, marginTop: 3 },
  lock: { fontSize: 16 },
  checkmark: { fontSize: 20, fontWeight: "700" as const },
});
