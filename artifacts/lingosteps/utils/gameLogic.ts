import { ALL_WORDS, getWordsByCategory, getDistractors, type LangCode, type Word } from "@/data/vocabulary";

export interface Question {
  word: Word;
  sourceText: string;
  correctAnswer: string;
  options: string[];
  sourceLang: LangCode;
  targetLang: LangCode;
}

export function generateQuestions(params: {
  sourceLang: LangCode;
  targetLang: LangCode;
  categoryId?: string;
  count?: number;
}): Question[] {
  const { sourceLang, targetLang, categoryId, count = 10 } = params;
  const pool = categoryId ? getWordsByCategory(categoryId) : ALL_WORDS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const words = shuffled.slice(0, Math.min(count, shuffled.length));

  return words.map((word) => {
    const correctAnswer = word[targetLang];
    const distractors = getDistractors(word, targetLang, pool, 3);
    const options = [correctAnswer, ...distractors].sort(() => Math.random() - 0.5);
    return {
      word,
      sourceText: word[sourceLang],
      correctAnswer,
      options,
      sourceLang,
      targetLang,
    };
  });
}

export function scrambleWord(word: string): string[] {
  const letters = word.replace(/\s/g, "").split("");
  let scrambled = [...letters];
  for (let i = scrambled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
  }
  // Ensure it's actually scrambled
  while (scrambled.join("") === letters.join("") && letters.length > 1) {
    scrambled = scrambled.sort(() => Math.random() - 0.5);
  }
  return scrambled;
}

export function calcXP(score: number, total: number, mode: "quiz" | "timed" | "daily" | "image-guess" | "unscramble"): number {
  const base = score * 10;
  const bonus = score === total ? 20 : 0;
  const multiplier = mode === "timed" ? 1.5 : mode === "daily" ? 2 : 1;
  return Math.round((base + bonus) * multiplier);
}

export function calcCoins(score: number, total: number): number {
  const ratio = total > 0 ? score / total : 0;
  return Math.round(ratio * 10 + (score === total ? 5 : 0));
}

export function getDailyWords(dateString: string, count: number = 10): Word[] {
  const seed = dateString.split("-").reduce((acc, n) => acc + parseInt(n), 0);
  const shuffled = [...ALL_WORDS].sort((a, b) => {
    const ha = hashCode(a.id + seed);
    const hb = hashCode(b.id + seed);
    return ha - hb;
  });
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = (Math.imul(31, hash) + c) | 0;
  }
  return hash;
}
