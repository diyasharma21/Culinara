import { Camera, BookOpen, ChefHat, Search } from "lucide-react";

/* =========================
   SITE STATS
========================= */

export const SITE_STATS = [
  { label: "Complimentary Scans", val: "10/mo" },
  { label: "Recipes Created", val: "1M+" },
  { label: "Starting Price", val: "$0" },
  { label: "Culinary Rating", val: "4.9★" },
];

/* =========================
   FEATURES
========================= */

export const FEATURES = [
  {
    title: "Smart Pantry Recognition",
    description:
      "Advanced AI instantly identifies your ingredients with remarkable precision.",
    icon: Camera,
    limit: "10 curated scans / mo free",
  },
  {
    title: "Personal AI Culinary Guide",
    description:
      "Transform everyday ingredients into refined, chef-inspired creations.",
    icon: ChefHat,
    limit: "5 signature recipes / mo free",
  },
  {
    title: "Global Dish Discovery",
    description:
      "Explore world cuisines. Filter by preparation time, flavor, or dietary preference.",
    icon: Search,
    limit: "Unlimited exploration",
  },
  {
    title: "Private Recipe Collection",
    description:
      "Save, organize, and export your favorite culinary masterpieces.",
    icon: BookOpen,
    limit: "3 premium saves / month",
  },
];

/* =========================
   HOW IT WORKS
========================= */

export const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Capture",
    desc: "Scan your ingredients with intelligent visual recognition.",
  },
  {
    step: "02",
    title: "Choose",
    desc: "Select a personalized recipe crafted for your taste.",
  },
  {
    step: "03",
    title: "Savor",
    desc: "Cook effortlessly and savor elevated flavors.",
  },
];

/* =========================
   CATEGORY EMOJIS (Premium)
========================= */

export function getCategoryEmoji(category) {
  const emojiMap = {
    Beef: "🥩",
    Chicken: "🍗",
    Dessert: "🍰",
    Lamb: "🍖",
    Miscellaneous: "🍽️",
    Pasta: "🍝",
    Pork: "🥓",
    Seafood: "🦞",
    Side: "🥗",
    Starter: "🥂",
    Vegan: "🌱",
    Vegetarian: "🥦",
    Breakfast: "🥐",
    Goat: "🍖",
  };

  return emojiMap[category] || "✨";
}

/* =========================
   COUNTRY FLAGS (Elegant)
========================= */

export function getCountryFlag(country) {
  const emojiMap = {
    American: "🗽",
    British: "👑",
    Canadian: "🍁",
    Chinese: "🐉",
    Croatian: "⚽",
    Dutch: "🌷",
    Egyptian: "🐫",
    Filipino: "🌴",
    French: "🥐",
    Greek: "🏛️",
    Indian: "🛕",
    Irish: "☘️",
    Italian: "🍕",
    Jamaican: "🌴",
    Japanese: "🗾",
    Kenyan: "🦒",
    Malaysian: "🌺",
    Mexican: "🌮",
    Moroccan: "🕌",
    Polish: "🦅",
    Portuguese: "🚢",
    Russian: "❄️",
    Spanish: "💃",
    Thai: "🛕",
    Tunisian: "🏜️",
    Turkish: "🧿",
    Ukrainian: "🌻",
    Vietnamese: "🍜",
    Algerian: "🏜️",
    Argentinian: "⚽",
    Australian: "🦘",
    Norwegian: "❄️",
    "Saudi Arabian": "🕋",
    Slovakian: "🏔️",
    Syrian: "🏛️",
    Uruguayan: "⚽",
    Venezuelan: "🌞",
  };

  return emojiMap[country] ?? "🌍";
}