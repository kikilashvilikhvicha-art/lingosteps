export type LangCode = "ka" | "it";

export interface Word {
  id: string;
  ka: string;       // Georgian
  it: string;       // Italian
  en: string;       // English (for reference)
  category: string;
  emoji: string;
  color: string;    // background color for emoji card
}

const PALETTE = [
  "#FFE5E5", "#E5F0FF", "#E5FFE5", "#FFF5E5",
  "#F5E5FF", "#E5FFFA", "#FFE5F5", "#E5F5FF",
  "#FFFDE5", "#FFE5F0", "#E5FFF0", "#F0E5FF",
];

let colorIdx = 0;
function nextColor() { return PALETTE[colorIdx++ % PALETTE.length]; }

const food: Word[] = [
  { id: "food_1",  ka: "პური",     it: "pane",      en: "bread",   category: "food", emoji: "🍞", color: nextColor() },
  { id: "food_2",  ka: "ყავა",     it: "caffè",     en: "coffee",  category: "food", emoji: "☕", color: nextColor() },
  { id: "food_3",  ka: "წყალი",   it: "acqua",     en: "water",   category: "food", emoji: "💧", color: nextColor() },
  { id: "food_4",  ka: "ვაშლი",   it: "mela",      en: "apple",   category: "food", emoji: "🍎", color: nextColor() },
  { id: "food_5",  ka: "რძე",      it: "latte",     en: "milk",    category: "food", emoji: "🥛", color: nextColor() },
  { id: "food_6",  ka: "კვერცხი", it: "uovo",      en: "egg",     category: "food", emoji: "🥚", color: nextColor() },
  { id: "food_7",  ka: "ყველი",   it: "formaggio", en: "cheese",  category: "food", emoji: "🧀", color: nextColor() },
  { id: "food_8",  ka: "ხორცი",   it: "carne",     en: "meat",    category: "food", emoji: "🥩", color: nextColor() },
  { id: "food_9",  ka: "თევზი",   it: "pesce",     en: "fish",    category: "food", emoji: "🐟", color: nextColor() },
  { id: "food_10", ka: "ჩაი",     it: "tè",        en: "tea",     category: "food", emoji: "🍵", color: nextColor() },
];

const home: Word[] = [
  { id: "home_1",  ka: "სახლი",      it: "casa",     en: "house",   category: "home", emoji: "🏠", color: nextColor() },
  { id: "home_2",  ka: "კარი",       it: "porta",    en: "door",    category: "home", emoji: "🚪", color: nextColor() },
  { id: "home_3",  ka: "ფანჯარა",   it: "finestra", en: "window",  category: "home", emoji: "🪟", color: nextColor() },
  { id: "home_4",  ka: "საწოლი",    it: "letto",    en: "bed",     category: "home", emoji: "🛏", color: nextColor() },
  { id: "home_5",  ka: "მაგიდა",    it: "tavolo",   en: "table",   category: "home", emoji: "🪑", color: nextColor() },
  { id: "home_6",  ka: "სკამი",     it: "sedia",    en: "chair",   category: "home", emoji: "🪑", color: nextColor() },
  { id: "home_7",  ka: "სამზარეულო", it: "cucina",  en: "kitchen", category: "home", emoji: "🍳", color: nextColor() },
  { id: "home_8",  ka: "აბაზანა",   it: "bagno",    en: "bathroom",category: "home", emoji: "🛁", color: nextColor() },
  { id: "home_9",  ka: "ბაღი",      it: "giardino", en: "garden",  category: "home", emoji: "🌳", color: nextColor() },
  { id: "home_10", ka: "გასაღები",  it: "chiave",   en: "key",     category: "home", emoji: "🔑", color: nextColor() },
];

const family: Word[] = [
  { id: "fam_1",  ka: "დედა",       it: "madre",    en: "mother",      category: "family", emoji: "👩", color: nextColor() },
  { id: "fam_2",  ka: "მამა",       it: "padre",    en: "father",      category: "family", emoji: "👨", color: nextColor() },
  { id: "fam_3",  ka: "და",         it: "sorella",  en: "sister",      category: "family", emoji: "👧", color: nextColor() },
  { id: "fam_4",  ka: "ძმა",        it: "fratello", en: "brother",     category: "family", emoji: "👦", color: nextColor() },
  { id: "fam_5",  ka: "ვაჟი",      it: "figlio",   en: "son",         category: "family", emoji: "🧒", color: nextColor() },
  { id: "fam_6",  ka: "ქალიშვილი",it: "figlia",   en: "daughter",    category: "family", emoji: "👶", color: nextColor() },
  { id: "fam_7",  ka: "ბებია",      it: "nonna",    en: "grandmother", category: "family", emoji: "👵", color: nextColor() },
  { id: "fam_8",  ka: "ბაბუა",      it: "nonno",    en: "grandfather", category: "family", emoji: "👴", color: nextColor() },
  { id: "fam_9",  ka: "ბავშვი",    it: "bambino",  en: "child",       category: "family", emoji: "🧒", color: nextColor() },
  { id: "fam_10", ka: "ოჯახი",     it: "famiglia", en: "family",      category: "family", emoji: "👨‍👩‍👧‍👦", color: nextColor() },
];

const transport: Word[] = [
  { id: "trans_1",  ka: "მანქანა",      it: "macchina",     en: "car",     category: "transport", emoji: "🚗", color: nextColor() },
  { id: "trans_2",  ka: "ავტობუსი",    it: "autobus",      en: "bus",     category: "transport", emoji: "🚌", color: nextColor() },
  { id: "trans_3",  ka: "მატარებელი",  it: "treno",        en: "train",   category: "transport", emoji: "🚂", color: nextColor() },
  { id: "trans_4",  ka: "თვითმფრინავი",it: "aereo",        en: "plane",   category: "transport", emoji: "✈️", color: nextColor() },
  { id: "trans_5",  ka: "ველოსიპედი",  it: "bicicletta",   en: "bicycle", category: "transport", emoji: "🚲", color: nextColor() },
  { id: "trans_6",  ka: "ნავი",         it: "barca",        en: "boat",    category: "transport", emoji: "⛵", color: nextColor() },
  { id: "trans_7",  ka: "ტაქსი",       it: "taxi",         en: "taxi",    category: "transport", emoji: "🚕", color: nextColor() },
  { id: "trans_8",  ka: "გზა",          it: "strada",       en: "road",    category: "transport", emoji: "🛣", color: nextColor() },
  { id: "trans_9",  ka: "სადგური",     it: "stazione",     en: "station", category: "transport", emoji: "🚉", color: nextColor() },
  { id: "trans_10", ka: "ბილეთი",      it: "biglietto",    en: "ticket",  category: "transport", emoji: "🎫", color: nextColor() },
];

const animals: Word[] = [
  { id: "ani_1",  ka: "ძაღლი",    it: "cane",     en: "dog",      category: "animals", emoji: "🐶", color: nextColor() },
  { id: "ani_2",  ka: "კატა",     it: "gatto",    en: "cat",      category: "animals", emoji: "🐱", color: nextColor() },
  { id: "ani_3",  ka: "ცხენი",    it: "cavallo",  en: "horse",    category: "animals", emoji: "🐴", color: nextColor() },
  { id: "ani_4",  ka: "ფრინველი", it: "uccello",  en: "bird",     category: "animals", emoji: "🐦", color: nextColor() },
  { id: "ani_5",  ka: "ძროხა",   it: "mucca",    en: "cow",      category: "animals", emoji: "🐄", color: nextColor() },
  { id: "ani_6",  ka: "სპილო",   it: "elefante", en: "elephant", category: "animals", emoji: "🐘", color: nextColor() },
  { id: "ani_7",  ka: "ლომი",     it: "leone",    en: "lion",     category: "animals", emoji: "🦁", color: nextColor() },
  { id: "ani_8",  ka: "დათვი",    it: "orso",     en: "bear",     category: "animals", emoji: "🐻", color: nextColor() },
  { id: "ani_9",  ka: "კურდღელი", it: "coniglio", en: "rabbit",   category: "animals", emoji: "🐰", color: nextColor() },
  { id: "ani_10", ka: "თევზი",   it: "pesce",    en: "fish",     category: "animals", emoji: "🐟", color: nextColor() },
];

const colorsData: Word[] = [
  { id: "col_1",  ka: "წითელი",        it: "rosso",    en: "red",    category: "colors", emoji: "🔴", color: "#FFE5E5" },
  { id: "col_2",  ka: "ლურჯი",         it: "blu",      en: "blue",   category: "colors", emoji: "🔵", color: "#E5EEFF" },
  { id: "col_3",  ka: "მწვანე",        it: "verde",    en: "green",  category: "colors", emoji: "🟢", color: "#E5FFE5" },
  { id: "col_4",  ka: "ყვითელი",      it: "giallo",   en: "yellow", category: "colors", emoji: "🟡", color: "#FFFDE5" },
  { id: "col_5",  ka: "თეთრი",        it: "bianco",   en: "white",  category: "colors", emoji: "⬜", color: "#F5F5F5" },
  { id: "col_6",  ka: "შავი",         it: "nero",     en: "black",  category: "colors", emoji: "⬛", color: "#E0E0E0" },
  { id: "col_7",  ka: "ნარინჯისფერი",it: "arancione",en: "orange", category: "colors", emoji: "🟠", color: "#FFF3E5" },
  { id: "col_8",  ka: "იასამნისფერი", it: "viola",    en: "purple", category: "colors", emoji: "🟣", color: "#F5E5FF" },
  { id: "col_9",  ka: "ვარდისფერი",   it: "rosa",     en: "pink",   category: "colors", emoji: "🩷", color: "#FFE5F5" },
  { id: "col_10", ka: "ყავისფერი",    it: "marrone",  en: "brown",  category: "colors", emoji: "🟤", color: "#F5EDE5" },
];

const numbers: Word[] = [
  { id: "num_1",  ka: "ერთი",  it: "uno",     en: "one",   category: "numbers", emoji: "1️⃣", color: nextColor() },
  { id: "num_2",  ka: "ორი",   it: "due",     en: "two",   category: "numbers", emoji: "2️⃣", color: nextColor() },
  { id: "num_3",  ka: "სამი",  it: "tre",     en: "three", category: "numbers", emoji: "3️⃣", color: nextColor() },
  { id: "num_4",  ka: "ოთხი",  it: "quattro", en: "four",  category: "numbers", emoji: "4️⃣", color: nextColor() },
  { id: "num_5",  ka: "ხუთი",  it: "cinque",  en: "five",  category: "numbers", emoji: "5️⃣", color: nextColor() },
  { id: "num_6",  ka: "ექვსი", it: "sei",     en: "six",   category: "numbers", emoji: "6️⃣", color: nextColor() },
  { id: "num_7",  ka: "შვიდი", it: "sette",   en: "seven", category: "numbers", emoji: "7️⃣", color: nextColor() },
  { id: "num_8",  ka: "რვა",   it: "otto",    en: "eight", category: "numbers", emoji: "8️⃣", color: nextColor() },
  { id: "num_9",  ka: "ცხრა",  it: "nove",    en: "nine",  category: "numbers", emoji: "9️⃣", color: nextColor() },
  { id: "num_10", ka: "ათი",   it: "dieci",   en: "ten",   category: "numbers", emoji: "🔟", color: nextColor() },
];

const shopping: Word[] = [
  { id: "shop_1",  ka: "ფული",       it: "soldi",    en: "money",    category: "shopping", emoji: "💰", color: nextColor() },
  { id: "shop_2",  ka: "ფასი",       it: "prezzo",   en: "price",    category: "shopping", emoji: "🏷", color: nextColor() },
  { id: "shop_3",  ka: "ბაზარი",    it: "mercato",  en: "market",   category: "shopping", emoji: "🏪", color: nextColor() },
  { id: "shop_4",  ka: "მაღაზია",   it: "negozio",  en: "shop",     category: "shopping", emoji: "🛍", color: nextColor() },
  { id: "shop_5",  ka: "ჩანთა",     it: "borsa",    en: "bag",      category: "shopping", emoji: "👜", color: nextColor() },
  { id: "shop_6",  ka: "ბარათი",    it: "carta",    en: "card",     category: "shopping", emoji: "💳", color: nextColor() },
  { id: "shop_7",  ka: "ქვითარი",  it: "scontrino",en: "receipt",  category: "shopping", emoji: "🧾", color: nextColor() },
  { id: "shop_8",  ka: "გაყიდვა",  it: "vendita",  en: "sale",     category: "shopping", emoji: "🔖", color: nextColor() },
  { id: "shop_9",  ka: "ფასდაკლება",it: "sconto",   en: "discount", category: "shopping", emoji: "💸", color: nextColor() },
  { id: "shop_10", ka: "მოლარე",   it: "cassiere", en: "cashier",  category: "shopping", emoji: "🧑‍💼", color: nextColor() },
];

const travel: Word[] = [
  { id: "trav_1",  ka: "სასტუმრო",  it: "hotel",       en: "hotel",    category: "travel", emoji: "🏨", color: nextColor() },
  { id: "trav_2",  ka: "პასპორტი",  it: "passaporto",  en: "passport", category: "travel", emoji: "🛂", color: nextColor() },
  { id: "trav_3",  ka: "აეროპორტი", it: "aeroporto",   en: "airport",  category: "travel", emoji: "🛫", color: nextColor() },
  { id: "trav_4",  ka: "რუკა",      it: "mappa",       en: "map",      category: "travel", emoji: "🗺", color: nextColor() },
  { id: "trav_5",  ka: "ტურისტი",  it: "turista",     en: "tourist",  category: "travel", emoji: "🧳", color: nextColor() },
  { id: "trav_6",  ka: "ვიზა",      it: "visto",       en: "visa",     category: "travel", emoji: "📋", color: nextColor() },
  { id: "trav_7",  ka: "ბარგი",     it: "bagaglio",    en: "luggage",  category: "travel", emoji: "🧳", color: nextColor() },
  { id: "trav_8",  ka: "სანაპირო", it: "spiaggia",    en: "beach",    category: "travel", emoji: "🏖", color: nextColor() },
  { id: "trav_9",  ka: "მთა",       it: "montagna",    en: "mountain", category: "travel", emoji: "⛰", color: nextColor() },
  { id: "trav_10", ka: "ტური",      it: "gita",        en: "tour",     category: "travel", emoji: "🗺", color: nextColor() },
];

const hospital: Word[] = [
  { id: "hosp_1",  ka: "ექიმი",       it: "dottore",   en: "doctor",       category: "hospital", emoji: "👨‍⚕️", color: nextColor() },
  { id: "hosp_2",  ka: "მედდა",      it: "infermiere",en: "nurse",        category: "hospital", emoji: "👩‍⚕️", color: nextColor() },
  { id: "hosp_3",  ka: "წამალი",     it: "medicina",  en: "medicine",     category: "hospital", emoji: "💊", color: nextColor() },
  { id: "hosp_4",  ka: "საავადმყოფო",it: "ospedale",  en: "hospital",     category: "hospital", emoji: "🏥", color: nextColor() },
  { id: "hosp_5",  ka: "ტკივილი",   it: "dolore",    en: "pain",         category: "hospital", emoji: "🤕", color: nextColor() },
  { id: "hosp_6",  ka: "ცხელება",   it: "febbre",    en: "fever",        category: "hospital", emoji: "🌡", color: nextColor() },
  { id: "hosp_7",  ka: "აფთიაქი",  it: "farmacia",  en: "pharmacy",     category: "hospital", emoji: "💊", color: nextColor() },
  { id: "hosp_8",  ka: "სასწრაფო", it: "ambulanza", en: "ambulance",    category: "hospital", emoji: "🚑", color: nextColor() },
  { id: "hosp_9",  ka: "რეცეპტი",  it: "ricetta",   en: "prescription", category: "hospital", emoji: "📋", color: nextColor() },
  { id: "hosp_10", ka: "ინექცია",  it: "iniezione", en: "injection",    category: "hospital", emoji: "💉", color: nextColor() },
];

const work: Word[] = [
  { id: "work_1",  ka: "ოფისი",        it: "ufficio",   en: "office",    category: "work", emoji: "🏢", color: nextColor() },
  { id: "work_2",  ka: "კომპიუტერი",  it: "computer",  en: "computer",  category: "work", emoji: "💻", color: nextColor() },
  { id: "work_3",  ka: "შეხვედრა",    it: "riunione",  en: "meeting",   category: "work", emoji: "🤝", color: nextColor() },
  { id: "work_4",  ka: "კოლეგა",      it: "collega",   en: "colleague", category: "work", emoji: "👥", color: nextColor() },
  { id: "work_5",  ka: "ხელფასი",    it: "stipendio", en: "salary",    category: "work", emoji: "💵", color: nextColor() },
  { id: "work_6",  ka: "ხელშეკრულება",it: "contratto",en: "contract",  category: "work", emoji: "📜", color: nextColor() },
  { id: "work_7",  ka: "ანგარიში",   it: "rapporto",  en: "report",    category: "work", emoji: "📊", color: nextColor() },
  { id: "work_8",  ka: "შვებულება",  it: "vacanza",   en: "vacation",  category: "work", emoji: "🏖", color: nextColor() },
  { id: "work_9",  ka: "მენეჯერი",   it: "manager",   en: "manager",   category: "work", emoji: "👔", color: nextColor() },
  { id: "work_10", ka: "ვადა",        it: "scadenza",  en: "deadline",  category: "work", emoji: "⏰", color: nextColor() },
];

export const ALL_WORDS: Word[] = [
  ...food, ...home, ...family, ...transport, ...animals,
  ...colorsData, ...numbers, ...shopping, ...travel, ...hospital, ...work,
];

export const WORDS_BY_CATEGORY: Record<string, Word[]> = {
  food,
  home,
  family,
  transport,
  animals,
  colors: colorsData,
  numbers,
  shopping,
  travel,
  hospital,
  work,
};

export function getWordsByCategory(categoryId: string): Word[] {
  return WORDS_BY_CATEGORY[categoryId] ?? ALL_WORDS;
}

export function getRandomWords(count: number, categoryId?: string): Word[] {
  const pool = categoryId ? getWordsByCategory(categoryId) : ALL_WORDS;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getDistractors(correct: Word, lang: LangCode, pool: Word[], count: number): string[] {
  const others = pool.filter((w) => w.id !== correct.id);
  const shuffled = others.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((w) => w[lang]);
}
