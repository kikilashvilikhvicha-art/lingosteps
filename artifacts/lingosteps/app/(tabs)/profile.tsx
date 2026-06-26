import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame, type LanguageMode, type ThemeMode } from "@/context/GameContext";

const LANG_OPTIONS: { value: LanguageMode; label: string; flag: string }[] = [
  { value: "ka-it", label: "Georgian → Italian", flag: "🇬🇪→🇮🇹" },
  { value: "it-ka", label: "Italian → Georgian", flag: "🇮🇹→🇬🇪" },
];

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "system", label: "System", icon: "monitor" },
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const { stats, setLanguageMode, setTheme, setUsername } = useGame();
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(stats.username);
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  function saveName() {
    setUsername(nameInput);
    setEditingName(false);
  }

  return (
    <ScrollView
      style={[styles.screen, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 16, paddingBottom: 100 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Profile</Text>

      {/* Avatar + Name */}
      <View style={[styles.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>{stats.username[0]?.toUpperCase() ?? "L"}</Text>
        </View>
        {editingName ? (
          <View style={styles.nameEdit}>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              style={[styles.nameInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.muted }]}
              autoFocus
              maxLength={20}
              returnKeyType="done"
              onSubmitEditing={saveName}
            />
            <Pressable onPress={saveName} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={16} color="#fff" />
            </Pressable>
            <Pressable onPress={() => { setEditingName(false); setNameInput(stats.username); }}>
              <Feather name="x" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => setEditingName(true)} style={styles.nameRow}>
            <Text style={[styles.username, { color: colors.foreground }]}>{stats.username}</Text>
            <Feather name="edit-2" size={14} color={colors.mutedForeground} />
          </Pressable>
        )}
        <Text style={[styles.levelBadge, { color: colors.primary }]}>Level {stats.level}</Text>
      </View>

      {/* Stats */}
      <View style={[styles.statsGrid, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {[
          { label: "Total XP", value: stats.xp, icon: "star" },
          { label: "Coins", value: stats.coins, icon: "circle" },
          { label: "Streak", value: `${stats.streak}d`, icon: "zap" },
          { label: "Games", value: stats.totalGamesPlayed, icon: "activity" },
          { label: "Words", value: stats.wordsLearned, icon: "book" },
          { label: "Daily", value: stats.dailyCompleted, icon: "calendar" },
        ].map((s) => (
          <View key={s.label} style={styles.statCell}>
            <Feather name={s.icon as any} size={16} color={colors.primary} />
            <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
            <Text style={[styles.statLbl, { color: colors.mutedForeground }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Language Mode */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Language Mode</Text>
      <View style={[styles.optionGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {LANG_OPTIONS.map((opt, i) => (
          <Pressable
            key={opt.value}
            onPress={() => setLanguageMode(opt.value)}
            style={[
              styles.optionRow,
              i < LANG_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
          >
            <Text style={styles.optFlag}>{opt.flag}</Text>
            <Text style={[styles.optLabel, { color: colors.foreground }]}>{opt.label}</Text>
            {stats.languageMode === opt.value && (
              <Feather name="check" size={18} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>

      {/* Theme */}
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Theme</Text>
      <View style={[styles.optionGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {THEME_OPTIONS.map((opt, i) => (
          <Pressable
            key={opt.value}
            onPress={() => setTheme(opt.value)}
            style={[
              styles.optionRow,
              i < THEME_OPTIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
            ]}
          >
            <Feather name={opt.icon as any} size={18} color={colors.primary} />
            <Text style={[styles.optLabel, { color: colors.foreground }]}>{opt.label}</Text>
            {stats.theme === opt.value && (
              <Feather name="check" size={18} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>

      {/* App Info */}
      <View style={[styles.infoBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Text style={[styles.infoTitle, { color: colors.foreground }]}>LingoSteps</Text>
        <Text style={[styles.infoSub, { color: colors.mutedForeground }]}>
          Version 1.0.0 · Georgian & Italian
        </Text>
        <Text style={[styles.infoHint, { color: colors.mutedForeground }]}>
          More languages coming soon: English, Spanish, French, German
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 18 },
  pageTitle: { fontSize: 28, fontWeight: "800" as const, marginBottom: 18 },
  profileCard: {
    alignItems: "center",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    gap: 8,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "800" as const },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  username: { fontSize: 20, fontWeight: "700" as const },
  nameEdit: { flexDirection: "row", alignItems: "center", gap: 8 },
  nameInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 16,
    fontWeight: "600" as const,
    flex: 1,
  },
  saveBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  levelBadge: { fontSize: 13, fontWeight: "700" as const },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 22,
  },
  statCell: {
    width: "33.33%",
    alignItems: "center",
    paddingVertical: 14,
    gap: 4,
  },
  statVal: { fontSize: 18, fontWeight: "800" as const },
  statLbl: { fontSize: 10, fontWeight: "500" as const },
  sectionTitle: { fontSize: 15, fontWeight: "700" as const, marginBottom: 10 },
  optionGroup: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 22,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optFlag: { fontSize: 18 },
  optLabel: { flex: 1, fontSize: 14, fontWeight: "500" as const },
  infoBox: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    gap: 4,
  },
  infoTitle: { fontSize: 15, fontWeight: "700" as const },
  infoSub: { fontSize: 12 },
  infoHint: { fontSize: 11, textAlign: "center", lineHeight: 17 },
});
