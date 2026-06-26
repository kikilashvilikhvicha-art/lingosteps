import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ACHIEVEMENTS, type AchievementStats } from "@/data/achievements";

export type LanguageMode = "ka-it" | "it-ka";
export type ThemeMode = "light" | "dark" | "system";

export interface PlayerStats {
  xp: number;
  coins: number;
  level: number;
  streak: number;
  lastPlayedDate: string;
  totalGamesPlayed: number;
  quizCompleted: number;
  timedCompleted: number;
  dailyCompleted: number;
  wordsLearned: number;
  perfectGames: number;
  achievements: string[];
  completedDailyDates: string[];
  languageMode: LanguageMode;
  theme: ThemeMode;
  username: string;
}

const XP_PER_LEVEL = 200;

const DEFAULT_STATS: PlayerStats = {
  xp: 0,
  coins: 0,
  level: 1,
  streak: 0,
  lastPlayedDate: "",
  totalGamesPlayed: 0,
  quizCompleted: 0,
  timedCompleted: 0,
  dailyCompleted: 0,
  wordsLearned: 0,
  perfectGames: 0,
  achievements: [],
  completedDailyDates: [],
  languageMode: "ka-it",
  theme: "system",
  username: "Learner",
};

interface GameContextType {
  stats: PlayerStats;
  isLoaded: boolean;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  recordGameResult: (params: {
    type: "quiz" | "timed" | "daily" | "image-guess" | "unscramble";
    score: number;
    total: number;
    xpEarned: number;
    coinsEarned: number;
    wordsEncountered: number;
  }) => { newAchievements: string[]; leveledUp: boolean };
  setLanguageMode: (mode: LanguageMode) => void;
  setTheme: (theme: ThemeMode) => void;
  setUsername: (name: string) => void;
  isUnlocked: (categoryId: string, unlockLevel: number) => boolean;
  getTodayString: () => string;
  hasDoneToday: () => boolean;
  sourceLang: "ka" | "it";
  targetLang: "ka" | "it";
  xpForNextLevel: number;
  xpInCurrentLevel: number;
}

const GameContext = createContext<GameContextType | null>(null);
const STORAGE_KEY = "lingosteps_player_v2";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function checkStreak(stats: PlayerStats): { streak: number; lastPlayedDate: string } {
  const today = todayISO();
  if (!stats.lastPlayedDate) return { streak: 1, lastPlayedDate: today };
  if (stats.lastPlayedDate === today) return { streak: stats.streak, lastPlayedDate: today };
  const last = new Date(stats.lastPlayedDate);
  const now = new Date(today);
  const diff = Math.floor((now.getTime() - last.getTime()) / 86400000);
  if (diff === 1) return { streak: stats.streak + 1, lastPlayedDate: today };
  return { streak: 1, lastPlayedDate: today };
}

function detectNewAchievements(oldAchievements: string[], astats: AchievementStats): string[] {
  const newOnes: string[] = [];
  for (const ach of ACHIEVEMENTS) {
    if (!oldAchievements.includes(ach.id) && ach.requirement(astats)) {
      newOnes.push(ach.id);
    }
  }
  return newOnes;
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try {
          const parsed = JSON.parse(val) as PlayerStats;
          setStats({ ...DEFAULT_STATS, ...parsed });
        } catch {
          setStats(DEFAULT_STATS);
        }
      }
      setIsLoaded(true);
    });
  }, []);

  const save = useCallback((updated: PlayerStats) => {
    setStats(updated);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const addXP = useCallback((amount: number) => {
    setStats((prev) => {
      const newXP = prev.xp + amount;
      const updated = { ...prev, xp: newXP, level: calcLevel(newXP) };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addCoins = useCallback((amount: number) => {
    setStats((prev) => {
      const updated = { ...prev, coins: prev.coins + amount };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const recordGameResult = useCallback(
    (params: {
      type: "quiz" | "timed" | "daily" | "image-guess" | "unscramble";
      score: number;
      total: number;
      xpEarned: number;
      coinsEarned: number;
      wordsEncountered: number;
    }): { newAchievements: string[]; leveledUp: boolean } => {
      let newAchievements: string[] = [];
      let leveledUp = false;

      setStats((prev) => {
        const { streak, lastPlayedDate } = checkStreak(prev);
        const newXP = prev.xp + params.xpEarned;
        const newLevel = calcLevel(newXP);
        const isPerfect = params.score === params.total && params.total > 0;

        const updatedStats: PlayerStats = {
          ...prev,
          xp: newXP,
          coins: prev.coins + params.coinsEarned,
          level: newLevel,
          streak,
          lastPlayedDate,
          totalGamesPlayed: prev.totalGamesPlayed + 1,
          quizCompleted: params.type === "quiz" ? prev.quizCompleted + 1 : prev.quizCompleted,
          timedCompleted: params.type === "timed" ? prev.timedCompleted + 1 : prev.timedCompleted,
          dailyCompleted: params.type === "daily"
            ? prev.completedDailyDates.includes(todayISO()) ? prev.dailyCompleted : prev.dailyCompleted + 1
            : prev.dailyCompleted,
          wordsLearned: prev.wordsLearned + params.wordsEncountered,
          perfectGames: isPerfect ? prev.perfectGames + 1 : prev.perfectGames,
          completedDailyDates:
            params.type === "daily" && !prev.completedDailyDates.includes(todayISO())
              ? [...prev.completedDailyDates, todayISO()]
              : prev.completedDailyDates,
        };

        const achStats: AchievementStats = {
          gamesPlayed: updatedStats.totalGamesPlayed,
          streak: updatedStats.streak,
          level: updatedStats.level,
          xp: updatedStats.xp,
          dailyCompleted: updatedStats.dailyCompleted,
          quizCompleted: updatedStats.quizCompleted,
          timedCompleted: updatedStats.timedCompleted,
          wordsLearned: updatedStats.wordsLearned,
          perfectGames: updatedStats.perfectGames,
        };

        newAchievements = detectNewAchievements(prev.achievements, achStats);
        leveledUp = newLevel > prev.level;

        const finalStats: PlayerStats = {
          ...updatedStats,
          achievements: [...prev.achievements, ...newAchievements],
        };

        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(finalStats));
        return finalStats;
      });

      return { newAchievements, leveledUp };
    },
    []
  );

  const setLanguageMode = useCallback((mode: LanguageMode) => {
    setStats((prev) => {
      const updated = { ...prev, languageMode: mode };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setStats((prev) => {
      const updated = { ...prev, theme };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setUsername = useCallback((name: string) => {
    setStats((prev) => {
      const updated = { ...prev, username: name.trim() || "Learner" };
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isUnlocked = useCallback((categoryId: string, unlockLevel: number): boolean => {
    return stats.level >= unlockLevel;
  }, [stats.level]);

  const getTodayString = useCallback((): string => todayISO(), []);

  const hasDoneToday = useCallback((): boolean => {
    return stats.completedDailyDates.includes(todayISO());
  }, [stats.completedDailyDates]);

  const sourceLang = stats.languageMode === "ka-it" ? "ka" : "it";
  const targetLang = stats.languageMode === "ka-it" ? "it" : "ka";
  const xpInCurrentLevel = stats.xp % XP_PER_LEVEL;
  const xpForNextLevel = XP_PER_LEVEL;

  return (
    <GameContext.Provider
      value={{
        stats,
        isLoaded,
        addXP,
        addCoins,
        recordGameResult,
        setLanguageMode,
        setTheme,
        setUsername,
        isUnlocked,
        getTodayString,
        hasDoneToday,
        sourceLang: sourceLang as "ka" | "it",
        targetLang: targetLang as "ka" | "it",
        xpForNextLevel,
        xpInCurrentLevel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
