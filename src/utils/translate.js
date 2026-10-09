// Traduction FR -> EN des challenges.
// - Référence du verset : livre traduit via table, chapitre/versets conservés.
// - Texte du verset : récupéré dans la World English Bible (même version que
//   les données existantes de dataIHMEn), sinon traduction automatique.
// - Explication / challenge : traduction automatique (API MyMemory, gratuite,
//   sans clé, ~5000 caractères/jour).

const MYMEMORY_URL = "https://api.mymemory.translated.net/get";
const BIBLE_API_URL = "https://bible-api.com";
// MyMemory refuse les requêtes de plus de 500 octets
const MAX_CHUNK_BYTES = 450;

export const TRANSLATABLE_FIELDS = [
  "verse",
  "verseText",
  "verseDescription",
  "challenge",
];

const BIBLE_BOOKS_FR_TO_EN = {
  genese: "Genesis",
  exode: "Exodus",
  levitique: "Leviticus",
  nombres: "Numbers",
  deuteronome: "Deuteronomy",
  josue: "Joshua",
  juges: "Judges",
  juge: "Judges",
  ruth: "Ruth",
  "1 samuel": "1 Samuel",
  "2 samuel": "2 Samuel",
  "1 rois": "1 Kings",
  "2 rois": "2 Kings",
  "1 chroniques": "1 Chronicles",
  "2 chroniques": "2 Chronicles",
  esdras: "Ezra",
  nehemie: "Nehemiah",
  esther: "Esther",
  job: "Job",
  psaume: "Psalm",
  psaumes: "Psalm",
  proverbes: "Proverbs",
  ecclesiaste: "Ecclesiastes",
  "cantique des cantiques": "Song of Solomon",
  cantique: "Song of Solomon",
  esaie: "Isaiah",
  jeremie: "Jeremiah",
  lamentations: "Lamentations",
  ezechiel: "Ezekiel",
  daniel: "Daniel",
  osee: "Hosea",
  joel: "Joel",
  amos: "Amos",
  abdias: "Obadiah",
  jonas: "Jonah",
  michee: "Micah",
  nahum: "Nahum",
  habacuc: "Habakkuk",
  sophonie: "Zephaniah",
  aggee: "Haggai",
  haggai: "Haggai",
  zacharie: "Zechariah",
  malachie: "Malachi",
  matthieu: "Matthew",
  mathieu: "Matthew",
  marc: "Mark",
  luc: "Luke",
  jean: "John",
  actes: "Acts",
  "actes des apotres": "Acts",
  romains: "Romans",
  "1 corinthiens": "1 Corinthians",
  "2 corinthiens": "2 Corinthians",
  galates: "Galatians",
  ephesiens: "Ephesians",
  philippiens: "Philippians",
  colossiens: "Colossians",
  "1 thessaloniciens": "1 Thessalonians",
  "2 thessaloniciens": "2 Thessalonians",
  "1 timothee": "1 Timothy",
  "2 timothee": "2 Timothy",
  tite: "Titus",
  philemon: "Philemon",
  hebreux: "Hebrews",
  jacques: "James",
  "1 pierre": "1 Peter",
  "2 pierre": "2 Peter",
  "1 jean": "1 John",
  "2 jean": "2 John",
  "3 jean": "3 John",
  jude: "Jude",
  apocalypse: "Revelation",
};

const normalizeBookName = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^([123])\s*(er|re|e|ere)?\s+/, "$1 ")
    .replace(/\s+/g, " ")
    .trim();

// "1 Corinthiens 13:4-7" -> { book: "1 Corinthians", chapter: "13", verses: "4-7" }
const parseReference = (reference) => {
  const match = String(reference || "")
    .trim()
    .match(/^(.+?)\s*(\d+)\s*(?:[:.,]\s*(\d+(?:\s*[-–]\s*\d+)?))?\s*$/);
  if (!match) return null;
  const book = BIBLE_BOOKS_FR_TO_EN[normalizeBookName(match[1])];
  if (!book) return null;
  return {
    book,
    chapter: match[2],
    verses: match[3]?.replace(/\s*[-–]\s*/, "-"),
  };
};

const formatReference = ({ book, chapter, verses }) =>
  verses ? `${book} ${chapter}:${verses}` : `${book} ${chapter}`;

const byteLength = (text) => new TextEncoder().encode(text).length;

const splitIntoChunks = (text) => {
  const sentences = text.split(/(?<=[.!?…])\s+/);
  const chunks = [];
  let current = "";
  sentences.forEach((sentence) => {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (byteLength(candidate) <= MAX_CHUNK_BYTES) {
      current = candidate;
      return;
    }
    if (current) chunks.push(current);
    if (byteLength(sentence) <= MAX_CHUNK_BYTES) {
      current = sentence;
      return;
    }
    // Phrase trop longue : découpage par mots
    current = "";
    sentence.split(/\s+/).forEach((word) => {
      const next = current ? `${current} ${word}` : word;
      if (byteLength(next) > MAX_CHUNK_BYTES && current) {
        chunks.push(current);
        current = word;
      } else {
        current = next;
      }
    });
  });
  if (current) chunks.push(current);
  return chunks;
};

const decodeHtmlEntities = (text) =>
  new DOMParser().parseFromString(text, "text/html").documentElement
    .textContent;

const translateChunk = async (chunk) => {
  const params = new URLSearchParams({ q: chunk, langpair: "fr|en" });
  const response = await fetch(`${MYMEMORY_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Service de traduction indisponible (${response.status})`);
  }
  const data = await response.json();
  if (data.quotaFinished || Number(data.responseStatus) !== 200) {
    throw new Error(
      Number(data.responseStatus) === 429 || data.quotaFinished
        ? "Quota de traduction gratuite atteint pour aujourd'hui"
        : data.responseDetails || "Échec de la traduction",
    );
  }
  // La réponse principale peut venir de la mémoire collaborative de MyMemory
  // (phrases approchantes parfois sans rapport) : on préfère sa traduction
  // automatique quand elle est fournie.
  const machineMatch = data.matches?.find((m) => m["created-by"] === "MT!");
  return decodeHtmlEntities(
    machineMatch?.translation || data.responseData?.translatedText || "",
  );
};

export const translateText = async (text) => {
  const source = String(text || "").trim();
  if (!source) return "";
  const chunks = splitIntoChunks(source);
  const translated = await Promise.all(chunks.map(translateChunk));
  return translated.join(" ").trim();
};

export const translateVerseReference = async (reference) => {
  const parsed = parseReference(reference);
  if (parsed) return formatReference(parsed);
  return translateText(reference);
};

// Ne renvoie le texte que pour une référence précise (avec verset) :
// un chapitre entier ne correspondrait pas au texte saisi en français.
export const fetchEnglishVerseText = async (englishReference) => {
  if (!/^.+\s\d+:\d+(?:-\d+)?$/.test(englishReference || "")) return null;
  const response = await fetch(
    `${BIBLE_API_URL}/${encodeURIComponent(englishReference)}?translation=web`,
  );
  if (!response.ok) return null;
  const data = await response.json();
  if (!Array.isArray(data.verses) || data.verses.length === 0) return null;
  return data.verses.map((v) => v.text.replace(/\s+/g, " ").trim()).join(" ");
};

/**
 * Traduit les champs texte d'un challenge français.
 * @param {object} source challenge français
 * @param {object} options
 * @param {string[]} options.fields champs à traduire
 * @param {string} options.englishVerse référence anglaise déjà connue (prioritaire)
 * @returns {Promise<{ values: object, errors: object }>}
 */
export const translateChallengeToEnglish = async (
  source,
  { fields = TRANSLATABLE_FIELDS, englishVerse } = {},
) => {
  const values = {};
  const errors = {};

  let referencePromise;
  const getEnglishReference = () => {
    if (englishVerse?.trim()) return Promise.resolve(englishVerse.trim());
    referencePromise ??= translateVerseReference(source.verse);
    return referencePromise;
  };

  const tasks = {
    verse: getEnglishReference,
    verseText: async () => {
      try {
        const reference = await getEnglishReference();
        const bibleText = await fetchEnglishVerseText(reference);
        if (bibleText) return bibleText;
      } catch {
        // on retombe sur la traduction automatique
      }
      return translateText(source.verseText);
    },
    verseDescription: () => translateText(source.verseDescription),
    challenge: () => translateText(source.challenge),
  };

  await Promise.all(
    fields.map(async (field) => {
      try {
        values[field] = await tasks[field]();
      } catch (error) {
        errors[field] = error.message || "Échec de la traduction";
      }
    }),
  );

  return { values, errors };
};
