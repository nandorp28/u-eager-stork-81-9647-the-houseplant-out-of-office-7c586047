// The Houseplant Out-of-Office — make.fun entry.
// Writes one out-of-office auto-reply, as if a houseplant sent it,
// to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
// The line must be a single line of 1-120 characters, no leading or
// trailing whitespace, no newline. Node 22 stdlib only.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "Out of office. I am a cactus. I need nothing, I answer to no one, and I will outlive this company.";

function codePointLength(text: string): number {
  return [...text].length;
}

function validate(line: string): void {
  if (line.length === 0) {
    throw new Error("entry is empty");
  }
  if (line.trim() !== line) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  const length = codePointLength(line);
  if (length < 1 || length > 120) {
    throw new Error(`entry is ${length} characters, must be 1-120`);
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
validate(LINE);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");
// Read-back round trip: what landed on disk must be exactly the line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("round-trip check failed: entry.txt does not match the line");
}
console.log(`wrote ${codePointLength(LINE)}-character entry to ${outPath}`);
