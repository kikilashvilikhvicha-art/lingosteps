export interface GameMode {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  unlockLevel: number;
}

export const GAME_MODES: GameMode[] = [
  {
    id: "quiz",
    title: "Multiple Choice",
    description: "Pick the correct translation from 4 options",
    icon: "help-circle",
    color: "#5B4FE9",
    route: "/game/quiz",
    unlockLevel: 1,
  },
  {
    id: "image-guess",
    title: "Guess the Word",
    description: "Match the picture to the right word",
    icon: "image",
    color: "#FF6B6B",
    route: "/game/image-guess",
    unlockLevel: 1,
  },
  {
    id: "unscramble",
    title: "Unscramble",
    description: "Rearrange letters to form the word",
    icon: "shuffle",
    color: "#00C896",
    route: "/game/unscramble",
    unlockLevel: 1,
  },
  {
    id: "timed",
    title: "Timed Challenge",
    description: "Answer as many as you can in 60 seconds",
    icon: "clock",
    color: "#FF9F43",
    route: "/game/timed",
    unlockLevel: 2,
  },
  {
    id: "daily",
    title: "Daily Challenge",
    description: "Today's special mixed challenge",
    icon: "calendar",
    color: "#4CC9F0",
    route: "/daily",
    unlockLevel: 1,
  },
];
