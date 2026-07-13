export type CategoryId =
  | "earbuds"
  | "headphones"
  | "premium"
  | "speakers"
  | "smartwatches";

export interface Category {
  id: CategoryId;
  label: string;
  tagline: string;
}

export const CATEGORIES: Category[] = [
  { id: "earbuds", label: "Earbuds", tagline: "True wireless freedom" },
  { id: "headphones", label: "Headphones", tagline: "Over-ear immersion" },
  { id: "premium", label: "Premium ANC", tagline: "Silence, engineered" },
  { id: "speakers", label: "Speakers", tagline: "Fill the room" },
  { id: "smartwatches", label: "Smartwatches", tagline: "Track every beat" },
];

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Review {
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

/** SVG render archetype used to draw the product illustration. */
export type RenderKind = "earbuds" | "headphones" | "speaker" | "watch";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  priceINR: number;
  priceUSD: number;
  mrpINR: number;
  mrpUSD: number;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  features: string[];
  specs: { label: string; value: string }[];
  badges: string[];
  render: RenderKind;
  featured?: boolean;
  bestseller?: boolean;
  reviews: Review[];
}

export function discountPct(p: Product): number {
  return Math.round(((p.mrpINR - p.priceINR) / p.mrpINR) * 100);
}
