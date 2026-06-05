const CATEGORIES = ["spiritualité", "motivation", "mental", "relationel"];

const safeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return [];
};

export const countUsersByCategory = (users) => {
  const list = safeArray(users);
  const counts = CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat]: 0 }), {});

  list.forEach((item) => {
    const category = item?.user?.category;
    if (category && Object.prototype.hasOwnProperty.call(counts, category)) {
      counts[category]++;
    }
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return CATEGORIES.map(() => 0);

  return CATEGORIES.map((cat) => Math.round((counts[cat] / total) * 100));
};

export const countGenders = (users) => {
  const list = safeArray(users);
  let male = 0;
  let female = 0;

  list.forEach((item) => {
    const gender = item?.user?.gender;
    if (gender === "man") male++;
    else if (gender === "women") female++;
  });

  const total = male + female;
  if (total === 0) return [0, 0];

  const malePct = Math.round((male / total) * 100);
  return [malePct, 100 - malePct];
};

const AGE_BUCKETS = [
  { label: "15-17", min: 15, max: 17 },
  { label: "18-25", min: 18, max: 25 },
  { label: "26-35", min: 26, max: 35 },
  { label: "36+", min: 36, max: Infinity },
];

export const calculateAgeRanges = (users) => {
  const list = safeArray(users);
  const buckets = AGE_BUCKETS.map(() => 0);
  const currentYear = new Date().getFullYear();

  list.forEach((item) => {
    const birth = item?.user?.age;
    if (!birth) return;
    const year = new Date(birth).getFullYear();
    if (Number.isNaN(year)) return;
    const age = currentYear - year;
    const bucketIdx = AGE_BUCKETS.findIndex((b) => age >= b.min && age <= b.max);
    if (bucketIdx >= 0) buckets[bucketIdx]++;
  });

  return [{ name: "Âge", data: buckets }];
};

export const AGE_LABELS = AGE_BUCKETS.map((b) => b.label);

export const totalChallenges = (challengesByCategory) => {
  if (!challengesByCategory) return 0;
  return Object.values(challengesByCategory).reduce(
    (total, list) => total + (Array.isArray(list) ? list.length : 0),
    0,
  );
};

export const CATEGORY_LABELS = [
  "Spiritualité",
  "Motivation",
  "Mental",
  "Relationnel",
];

export const GENDER_LABELS = ["Homme", "Femme"];
