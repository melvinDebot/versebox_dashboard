#!/usr/bin/env node
/**
 * Fait glisser d'un mois la borne temporelle des regles Realtime Database.
 *
 * Reecrit deux fichiers :
 *   - database.rules.json      deploye sur Firebase par firebase-tools
 *   - src/utils/rulesDeadline.json  lu par le bandeau du dashboard
 *
 * Usage :
 *   node scripts/rotate-rules.mjs
 *   node scripts/rotate-rules.mjs --dry-run
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RULES_FILE = join(ROOT, "database.rules.json");
const DEADLINE_FILE = join(ROOT, "src", "utils", "rulesDeadline.json");

const dryRun = process.argv.includes("--dry-run");

// Duree de vie accordee aux regles. Le cron tourne le 1er de chaque mois ;
// les jours de repit evitent que la base se verrouille si un run echoue.
const MONTHS = Number(process.env.RULES_MONTHS ?? 1);
const GRACE_DAYS = Number(process.env.RULES_GRACE_DAYS ?? 7);

const addMonths = (date, months) => {
  const d = new Date(date);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  // 31 janvier + 1 mois donne le 3 mars : on ramene au dernier jour du mois visé.
  if (d.getDate() !== day) d.setDate(0);
  return d;
};

const localDay = (d) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");

const expiry = addMonths(new Date(), MONTHS);
expiry.setDate(expiry.getDate() + GRACE_DAYS);
expiry.setHours(23, 59, 59, 0);

const expiresAt = expiry.getTime();
const expiresOn = localDay(expiry);

const before = readFileSync(RULES_FILE, "utf8");

if (!/now\s*<\s*\d+/.test(before)) {
  console.error(
    "Aucune borne \"now < <timestamp>\" dans database.rules.json — rien a faire.\n" +
      "Si les regles sont passees sur de l'authentification, ce script et son " +
      "workflow n'ont plus de raison d'exister : supprime-les."
  );
  process.exit(1);
}

// On remplace uniquement les bornes temporelles et les commentaires de date :
// toute autre regle ajoutee a la main est preservee.
const after = before
  .replace(/now\s*<\s*\d+/g, `now < ${expiresAt}`)
  .replace(/(\/\/\s*)\d{4}-\d{2}-\d{2}/g, `$1${expiresOn}`);

const deadline = {
  expiresAt,
  expiresOn,
  rotatedAt: new Date().toISOString(),
  months: MONTHS,
  graceDays: GRACE_DAYS,
};

if (dryRun) {
  console.log("--dry-run : aucun fichier ecrit\n");
  console.log(after);
  console.log(JSON.stringify(deadline, null, 2));
} else {
  writeFileSync(RULES_FILE, after);
  writeFileSync(DEADLINE_FILE, `${JSON.stringify(deadline, null, 2)}\n`);
}

console.log(`Nouvelle echeance : ${expiresOn} (${expiresAt})`);

// Expose la date au workflow, pour le message de commit.
if (process.env.GITHUB_OUTPUT) {
  writeFileSync(process.env.GITHUB_OUTPUT, `expires_on=${expiresOn}\n`, {
    flag: "a",
  });
}
