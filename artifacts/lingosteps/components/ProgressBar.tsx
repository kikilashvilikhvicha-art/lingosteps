import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColors } from "@/hooks/useColors";

interface ProgressBarProps {
  progress: number; // 0–1
  height?: number;
  color?: string;
  backgroundColor?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const colors = useColors();
  const clamp = Math.min(1, Math.max(0, progress));
  const barColor = color ?? colors.primary;
  const bgColor = backgroundColor ?? colors.muted;

  return (
    <View style={styles.container}>
      {showLabel && label && (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
      )}
      <View style={[styles.track, { height, backgroundColor: bgColor, borderRadius: height / 2 }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${clamp * 100}%`,
              height,
              backgroundColor: barColor,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 4 },
  track: { overflow: "hidden" },
  fill: {},
  label: { fontSize: 11, fontWeight: "500" as const },
});
