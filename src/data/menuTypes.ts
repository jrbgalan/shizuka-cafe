export type MenuCategoryId =
  | "all"
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snacks"
  | "coffee"
  | "tea"
  | "pastries"
  | "seasonal";

export type DietaryCode =
  | "vegetarian"
  | "vegan"
  | "dairy-free"
  | "spicy"
  | "contains-pork"
  | "contains-seafood"
  | "v"
  | "vg"
  | "df"
  | "gf";

export interface Review {
  id: string;
  author: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
}

export type AvailableHours =
  | { from: string; to: string }
  | "all-day";

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  japaneseName?: string;
  jp?: string;
  category: MenuCategoryId;
  price: number; // in PHP
  description: string;
  ingredients: string[];
  allergens: string[];
  dietary: DietaryCode[];
  image: {
    src: string;
    alt: string;
  };
  imageLabel?: string;
  reviews: Review[];
  rating: number; // dynamically computed
  reviewsCount: number; // dynamically computed
  available: AvailableHours;
  isSignature?: boolean;
}

export interface MenuCategory {
  id: MenuCategoryId;
  label: string;
  jp: string;
  hours?: string;
}

export interface DietaryInfo {
  label: string;
  color: string;
  short: string;
}

