// Export de la liste des emails utilisateurs (JSON, Excel, CSV).
// Le fichier Excel (.xlsx) est généré à la main (archive ZIP + SpreadsheetML)
// pour ne pas ajouter de dépendance au bundle.

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export const EXPORT_FORMATS = [
  {
    id: "xlsx",
    label: "Excel",
    extension: "xlsx",
    icon: "FileSpreadsheet",
    description: "Classeur Excel, une adresse par ligne",
  },
  {
    id: "csv",
    label: "CSV",
    extension: "csv",
    icon: "FileText",
    description: "Import Brevo, Mailchimp, Google Sheets…",
  },
  {
    id: "json",
    label: "JSON",
    extension: "json",
    icon: "FileJson",
    description: "Tableau de chaînes, pour scripts et API",
  },
];

/**
 * Récupère toutes les adresses email des utilisateurs, nettoyées,
 * dédoublonnées (sans tenir compte de la casse) et triées.
 */
export const extractEmails = (users = []) => {
  const seen = new Set();
  const emails = [];

  users.forEach((item) => {
    const raw = item?.user?.email;
    if (typeof raw !== "string") return;
    const email = raw.trim();
    if (!email) return;
    const key = email.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    emails.push(email);
  });

  return emails.sort((a, b) =>
    a.localeCompare(b, "fr", { sensitivity: "base", numeric: true }),
  );
};

/* ------------------------------------------------------------------ JSON */

const buildJson = (emails) =>
  new Blob([`${JSON.stringify(emails, null, 2)}\n`], {
    type: "application/json;charset=utf-8",
  });

/* ------------------------------------------------------------------- CSV */

// Neutralise les cellules qu'Excel interpréterait comme une formule.
const FORMULA_PREFIX = /^[=+\-@\t\r]/;

const toCsvCell = (value) => {
  const safe = FORMULA_PREFIX.test(value) ? `'${value}` : value;
  return /[",;\r\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

const buildCsv = (emails) =>
  new Blob(
    // BOM UTF-8 pour qu'Excel lise correctement les accents.
    [`\uFEFF${["email", ...emails.map(toCsvCell)].join("\r\n")}\r\n`],
    { type: "text/csv;charset=utf-8" },
  );

/* ------------------------------------------------------------------ XLSX */

const escapeXml = (value) =>
  value
    // Retire les caractères interdits en XML 1.0.
    .replace(/[^\t\n\r -퟿-�\u{10000}-\u{10FFFF}]/gu, "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const NS_MAIN = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const NS_PKG_RELS =
  "http://schemas.openxmlformats.org/package/2006/relationships";
const NS_DOC_RELS =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships";

const buildSheetXml = (emails) => {
  const longest = emails.reduce((max, email) => Math.max(max, email.length), 5);
  const width = Math.min(Math.max(longest + 4, 24), 80);
  const cell = (row, value, style = "") =>
    `<row r="${row}"><c r="A${row}" t="inlineStr"${style}><is><t>${escapeXml(
      value,
    )}</t></is></c></row>`;

  return (
    `${XML_HEADER}<worksheet xmlns="${NS_MAIN}">` +
    '<sheetViews><sheetView workbookViewId="0">' +
    '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>' +
    "</sheetView></sheetViews>" +
    `<cols><col min="1" max="1" width="${width}" customWidth="1"/></cols>` +
    `<sheetData>${cell(1, "email", ' s="1"')}${emails
      .map((email, index) => cell(index + 2, email))
      .join("")}</sheetData>` +
    "</worksheet>"
  );
};

const buildXlsxParts = (emails) => [
  {
    name: "[Content_Types].xml",
    content:
      `${XML_HEADER}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
      `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      "</Types>",
  },
  {
    name: "_rels/.rels",
    content:
      `${XML_HEADER}<Relationships xmlns="${NS_PKG_RELS}">` +
      `<Relationship Id="rId1" Type="${NS_DOC_RELS}/officeDocument" Target="xl/workbook.xml"/>` +
      "</Relationships>",
  },
  {
    name: "xl/workbook.xml",
    content:
      `${XML_HEADER}<workbook xmlns="${NS_MAIN}" xmlns:r="${NS_DOC_RELS}">` +
      '<sheets><sheet name="Emails" sheetId="1" r:id="rId1"/></sheets>' +
      "</workbook>",
  },
  {
    name: "xl/_rels/workbook.xml.rels",
    content:
      `${XML_HEADER}<Relationships xmlns="${NS_PKG_RELS}">` +
      `<Relationship Id="rId1" Type="${NS_DOC_RELS}/worksheet" Target="worksheets/sheet1.xml"/>` +
      `<Relationship Id="rId2" Type="${NS_DOC_RELS}/styles" Target="styles.xml"/>` +
      "</Relationships>",
  },
  {
    name: "xl/styles.xml",
    content:
      `${XML_HEADER}<styleSheet xmlns="${NS_MAIN}">` +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>' +
      '<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
      '<fills count="2"><fill><patternFill patternType="none"/></fill>' +
      '<fill><patternFill patternType="gray125"/></fill></fills>' +
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>' +
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
      "</styleSheet>",
  },
  { name: "xl/worksheets/sheet1.xml", content: buildSheetXml(emails) },
];

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

const crc32 = (bytes) => {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

// Compression native du navigateur ; repli sur un ZIP non compressé sinon.
const deflateRaw = async (bytes) => {
  if (typeof CompressionStream === "undefined") return null;
  try {
    const stream = new Blob([bytes])
      .stream()
      .pipeThrough(new CompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch {
    return null;
  }
};

const toDosDateTime = (date) => ({
  time:
    (date.getHours() << 11) |
    (date.getMinutes() << 5) |
    Math.floor(date.getSeconds() / 2),
  day:
    ((date.getFullYear() - 1980) << 9) |
    ((date.getMonth() + 1) << 5) |
    date.getDate(),
});

const createZip = async (files, type) => {
  const encoder = new TextEncoder();
  const { time, day } = toDosDateTime(new Date());
  const entries = await Promise.all(
    files.map(async ({ name, content }) => {
      const data = encoder.encode(content);
      const deflated = await deflateRaw(data);
      const compressed = Boolean(deflated) && deflated.length < data.length;
      return {
        name: encoder.encode(name),
        data,
        payload: compressed ? deflated : data,
        method: compressed ? 8 : 0,
        crc: crc32(data),
      };
    }),
  );

  const localParts = [];
  const centralParts = [];
  let offset = 0;

  entries.forEach(({ name, data, payload, method, crc }) => {
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // noms de fichiers en UTF-8
    local.setUint16(8, method, true);
    local.setUint16(10, time, true);
    local.setUint16(12, day, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, payload.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, name.length, true);
    localParts.push(new Uint8Array(local.buffer), name, payload);

    const central = new DataView(new ArrayBuffer(46));
    central.setUint32(0, 0x02014b50, true);
    central.setUint16(4, 20, true);
    central.setUint16(6, 20, true);
    central.setUint16(8, 0x0800, true);
    central.setUint16(10, method, true);
    central.setUint16(12, time, true);
    central.setUint16(14, day, true);
    central.setUint32(16, crc, true);
    central.setUint32(20, payload.length, true);
    central.setUint32(24, data.length, true);
    central.setUint16(28, name.length, true);
    central.setUint32(42, offset, true);
    centralParts.push(new Uint8Array(central.buffer), name);

    offset += 30 + name.length + payload.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...localParts, ...centralParts, new Uint8Array(end.buffer)], {
    type,
  });
};

const buildXlsx = (emails) => createZip(buildXlsxParts(emails), XLSX_MIME);

/* ---------------------------------------------------------------- Public */

const BUILDERS = { json: buildJson, csv: buildCsv, xlsx: buildXlsx };

/** Génère le fichier d'export pour un format donné (Blob). */
export const buildEmailExport = async (formatId, emails) => {
  const builder = BUILDERS[formatId];
  if (!builder) throw new Error(`Format d'export inconnu : ${formatId}`);
  return builder(emails);
};

/** Génère tous les formats d'un coup : { json: Blob, csv: Blob, xlsx: Blob }. */
export const buildAllEmailExports = async (emails) =>
  Object.fromEntries(
    await Promise.all(
      EXPORT_FORMATS.map(async ({ id }) => [
        id,
        await buildEmailExport(id, emails),
      ]),
    ),
  );

const sizeFormatter = new Intl.NumberFormat("fr-FR", {
  maximumFractionDigits: 1,
});

/** Formate un poids en octets : « 842 o », « 12,4 Ko », « 1,2 Mo ». */
export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} o`;
  const units = ["Ko", "Mo", "Go"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${sizeFormatter.format(value)} ${units[unit]}`;
};

export const exportFileName = (extension, date = new Date()) => {
  const pad = (n) => String(n).padStart(2, "0");
  const stamp = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
  return `versebox-emails-${stamp}.${extension}`;
};

/** Déclenche le téléchargement d'un Blob dans le navigateur. */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
