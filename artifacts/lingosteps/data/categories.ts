export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  gradient: string[];
  unlockLevel: number;
  wordCount: number;
}

export const CATEGORIES: Category[] = [
  { id: "food",      name: "Food",      emoji: "🍽",  color: "#FF6B6B", gradient: ["#FF6B6B","#FF8E8E"], unlockLevel: 1, wordCount: 10 },
  { id: "animals",   name: "Animals",   emoji: "🦁",  color: "#00C896", gradient: ["#00C896","#00E5AB"], unlockLevel: 1, wordCount: 10 },
  { id: "colors",    name: "Colors",    emoji: "🌈",  color: "#FF9F43", gradient: ["#FF9F43","#FFB560"], unlockLevel: 1, wordCount: 10 },
  { id: "numbers",   name: "Numbers",   emoji: "🔢",  color: "#4CC9F0", gradient: ["#4CC9F0","#70D9FF"], unlockLevel: 1, wordCount: 10 },
  { id: "home",      name: "Home",      emoji: "🏠",  color: "#5B4FE9", gradient: ["#5B4FE9","#7C6FEF"], unlockLevel: 2, wordCount: 10 },
  { id: "family",    name: "Family",    emoji: "👨‍👩‍👧",color: "#FF6B6B", gradient: ["#FF6B6B","#FF8E8E"], unlockLevel: 2, wordCount: 10 },
  { id: "transport", name: "Transport", emoji: "🚗",  color: "#7B64F5", gradient: ["#7B64F5","#9380FF"], unlockLevel: 3, wordCount: 10 },
  { id: "shopping",  name: "Shopping",  emoji: "🛍",  color: "#F7B731", gradient: ["#F7B731","#FFC84A"], unlockLevel: 3, wordCount: 10 },
  { id: "travel",    name: "Travel",    emoji: "✈️",  color: "#26C6DA", gradient: ["#26C6DA","#40D9EC"], unlockLevel: 4, wordCount: 10 },
  { id: "work",      name: "Work",      emoji: "💼",  color: "#78909C", gradient: ["#78909C","#90A4AE"], unlockLevel: 4, wordCount: 10 },
  { id: "hospital",  name: "Hospital",  emoji: "🏥",  color: "#EF5350", gradient: ["#EF5350","#F47171"], unlockLevel: 5, wordCount: 10 },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}
