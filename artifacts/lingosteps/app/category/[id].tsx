import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { getCategoryById } from "@/data/categories";
import { getWordsByCategory, type Word } from "@/data/vocabulary";
import { speak } from "@/utils/speechUtils";
import { GAME_MODES } from "@/data/gameModes";

export default function CategoryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { sourceLang, targetLang } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const category = getCategoryById(id ?? "");
  const words = getWordsByCategory(id ?? "");

  if (!category) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={{ color: colors.foreground, textAlign: "center", marginTop: 40 }}>
          Category not found.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: category.color + "15",
            borderBottomColor: category.color + "30",
            paddingTop: topPad + 8,
          },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.categoryEmoji}>{category.emoji}</Text>
          <Text style={[styles.categoryName, { color: colors.foreground }]}>{category.name}</Text>
          <Text style={[styles.wordCount, { color: category.color }]}>{words.length} words</Text>
        </View>
      </View>

      {/* Play this category */}
      <View style={[styles.playRow, { borderBottomColor: colors.border }]}>
        <Text style={[styles.playLabel, { color: colors.mutedForeground }]}>Practice this category:</Text>
        <View style={styles.playBtns}>
          {GAME_MODES.slice(0, 3).map((mode) => (
            <Pressable
              key={mode.id}
              onPress={() => router.push({ pathname: mode.route as any, params: { category: id } })}
              style={({ pressed }) => [
                styles.playChip,
                { backgroundColor: mode.color + "18", borderColor: mode.color + "40", opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name={mode.icon as any} size={14} color={mode.color} />
              <Text style={[styles.playChipText, { color: mode.color }]}>{mode.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Word list */}
      <FlatList
        data={words}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad + 30 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <WordRow
            word={item}
            sourceLang={sourceLang}
            targetLang={targetLang}
            index={index}
            colors={colors}
          />
        )}
      />
    </View>
  );
}

function WordRow({
  word,
  sourceLang,
  targetLang,
  index,
  colors,
}: {
  word: Word;
  sourceLang: "ka" | "it";
  targetLang: "ka" | "it";
  index: number;
  colors: any;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Animated.View entering={FadeInRight.delay(index * 40).duration(250)}>
      <Pressable
        onPress={() => setExpanded((e) => !e)}
        style={[
          styles.wordRow,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        {/* Emoji */}
        <View style={[styles.emojiBox, { backgroundColor: word.color }]}>
          <Text style={styles.wordEmoji}>{word.emoji}</Text>
        </View>

        {/* Texts */}
        <View style={styles.wordTexts}>
          <Text style={[styles.sourceText, { color: colors.foreground }]}>{word[sourceLang]}</Text>
          <Text style={[styles.targetText, { color: colors.mutedForeground }]}>{word[targetLang]}</Text>
          {expanded && (
            <Text style={[styles.englishText, { color: colors.primary }]}>🇬🇧 {word.en}</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.wordActions}>
          <Pressable onPress={() => speak(word[sourceLang], sourceLang)} hitSlop={8}>
            <Feather name="volume-2" size={16} color={colors.primary} />
          </Pressable>
          <Pressable onPress={() => speak(word[targetLang], targetLang)} hitSlop={8}>
            <Feather name="volume-1" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 6,
  },
  backBtn: {
    alignSelf: "flex-start",
    padding: 4,
    marginBottom: 4,
  },
  headerInfo: { alignItems: "center", gap: 4 },
  categoryEmoji: { fontSize: 40 },
  categoryName: { fontSize: 22, fontWeight: "800" as const },
  wordCount: { fontSize: 13, fontWeight: "600" as const },
  playRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  playLabel: { fontSize: 12 },
  playBtns: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  playChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  playChipText: { fontSize: 11, fontWeight: "700" as const },
  list: { paddingHorizontal: 14, paddingTop: 10, gap: 8 },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  emojiBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  wordEmoji: { fontSize: 22 },
  wordTexts: { flex: 1, gap: 2 },
  sourceText: { fontSize: 15, fontWeight: "700" as const },
  targetText: { fontSize: 13 },
  englishText: { fontSize: 12, marginTop: 2 },
  wordActions: { gap: 8 },
});
