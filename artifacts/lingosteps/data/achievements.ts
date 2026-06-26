export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  requirement: (stats: AchievementStats) => boolean;
  xpReward: number;
}

export interface AchievementStats {
  gamesPlayed: number;
  streak: number;
  level: number;
  xp: number;
  dailyCompleted: number;
  quizCompleted: number;
  timedCompleted: number;
  wordsLearned: number;
  perfectGames: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_step",
    title: "First Step",
    description: "Complete your first game",
    icon: "👣",
    color: "#5B4FE9",
    requirement: (s) => s.gamesPlayed >= 1,
    xpReward: 50,
  },
  {
    id: "streak_3",
    title: "Habit Builder",
    description: "Maintain a 3-day streak",
    icon: "🔥",
    color: "#FF6B6B",
    requirement: (s) => s.streak >= 3,
    xpReward: 100,
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "⚡",
    color: "#FFD166",
    requirement: (s) => s.streak >= 7,
    xpReward: 200,
  },
  {
    id: "streak_30",
    title: "Month Master",
    description: "Maintain a 30-day streak",
    icon: "🏆",
    color: "#FFD166",
    requirement: (s) => s.streak >= 30,
    xpReward: 500,
  },
  {
    id: "level_5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "⭐",
    color: "#00C896",
    requirement: (s) => s.level >= 5,
    xpReward: 150,
  },
  {
    id: "level_10",
    title: "Language Hero",
    description: "Reach level 10",
    icon: "🦸",
    color: "#5B4FE9",
    requirement: (s) => s.level >= 10,
    xpReward: 300,
  },
  {
    id: "quiz_master",
    title: "Quiz Master",
    description: "Complete 10 quiz games",
    icon: "🧠",
    color: "#4CC9F0",
    requirement: (s) => s.quizCompleted >= 10,
    xpReward: 200,
  },
  {
    id: "speed_demon",
    title: "Speed Demon",
    description: "Score 15+ in timed challenge",
    icon: "💨",
    color: "#FF9F43",
    requirement: (s) => s.timedCompleted >= 1,
    xpReward: 150,
  },
  {
    id: "word_collector",
    title: "Word Collector",
    description: "Learn 50 words",
    icon: "📚",
    color: "#00C896",
    requirement: (s) => s.wordsLearned >= 50,
    xpReward: 200,
  },
  {
    id: "daily_7",
    title: "Daily Champion",
    description: "Complete 7 daily challenges",
    icon: "📅",
    color: "#FF6B6B",
    requirement: (s) => s.dailyCompleted >= 7,
    xpReward: 250,
  },
  {
    id: "perfect",
    title: "Perfectionist",
    description: "Get a perfect score in any game",
    icon: "💎",
    color: "#7B64F5",
    requirement: (s) => s.perfectGames >= 1,
    xpReward: 100,
  },
];
