/* js/parser.js */
/* BUILD: 20260303a */

export function parseCSV(text) {
  if (!text) return { mode: null, rows: [] };

  const lines = text
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) {
    throw new Error("CSV形式が不正です");
  }

  // 1行目：shime_size,25
  const first = lines[0].split(",");
  if (first[0] !== "shime_size") {
    throw new Error("1行目に shime_size が必要です");
  }

  const mode = Number(first[1]);
  if (mode !== 25 && mode !== 30) {
    throw new Error("shime_size は 25 または 30");
  }

  const rows = [];

  for (let i = 2; i < lines.length; i++) {
    const parts = lines[i].split(",");

    if (parts.length !== 4) continue;

    const course = Number(parts[0]);
    const bin = Number(parts[1]);
    const shime = Number(parts[2]);
    const cut = Number(parts[3]);

    rows.push({
      course,
      bin,
      shime,
      cut
    });
  }

  return { mode, rows };
}
