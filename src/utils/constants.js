export const CHALLENGE_CATEGORIES = [
  { value: "amour", label: "Amour", disabled: true },
  { value: "familial", label: "Familial" },
  { value: "finances", label: "Finances" },
  { value: "mental", label: "Mental", disabled: true },
  { value: "motivation", label: "Motivation", disabled: true },
  { value: "organisation", label: "Organisation" },
  { value: "relationel", label: "Relationnel", disabled: true },
  { value: "santé", label: "Santé" },
  { value: "spiritualité", label: "Spiritualité", disabled: true },
  { value: "professionnel", label: "Professionnel" },
];

export const USER_CATEGORIES = [
  { value: "amour", label: "Amour" },
  { value: "familial", label: "Familial" },
  { value: "finances", label: "Finances" },
  { value: "mental", label: "Mental" },
  { value: "motivation", label: "Motivation" },
  { value: "organisation", label: "Organisation" },
  { value: "relationel", label: "Relationnel" },
  { value: "santé", label: "Santé" },
  { value: "spiritualité", label: "Spiritualité" },
];

export const CHALLENGE_POINTS = [6, 8, 9, 12, 15, 17].map((v) => ({
  value: v,
  label: String(v),
}));

export const CHALLENGE_LEVELS = [
  { value: "bronze", label: "Bronze" },
  { value: "silver", label: "Silver" },
  { value: "gold", label: "Gold" },
];

export const PRODUCT_CATEGORIES = [
  { value: "music", label: "Music" },
  { value: "games", label: "Games" },
  { value: "books", label: "Books" },
  { value: "clothes", label: "Vêtements" },
  { value: "bag", label: "Sacs" },
  { value: "various", label: "Divers" },
];

export const EMPTY_CLICKS_BY_DAY = [
  { day: "Dim", data: 0 },
  { day: "Lun", data: 0 },
  { day: "Mar", data: 0 },
  { day: "Mer", data: 0 },
  { day: "Jeu", data: 0 },
  { day: "Ven", data: 0 },
  { day: "Sam", data: 0 },
];

export const EMPTY_CLICKS_BY_DAY_MAP = {
  Lun: { data: 0 },
  Mar: { data: 0 },
  Mer: { data: 0 },
  Jeu: { data: 0 },
  Ven: { data: 0 },
  Sam: { data: 0 },
  Dim: { data: 0 },
};
