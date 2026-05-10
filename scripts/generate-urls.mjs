// Generate the share-link list (urls.txt) from public/script.js.
// Usage: npm run urls   (from scripts/)

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DOMAIN = 'wedding-invite-digital-kxdp0kig.on-forge.com';

const here = dirname(fileURLToPath(import.meta.url));
const scriptPath = join(here, '..', 'public', 'script.js');
const outPath    = join(here, '..', 'urls.txt');

const source = readFileSync(scriptPath, 'utf8');

// Find a `const VARNAME = { … };` block and return the inner text between the
// outermost { and }. Walks character-by-character so it handles nested braces
// and string literals.
function extractBlock(src, varName) {
  const marker = `const ${varName} = `;
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`${varName} not found`);
  let i = src.indexOf('{', start);
  if (i === -1) throw new Error(`opening brace for ${varName} not found`);
  const inner = i + 1;
  let depth = 0, str = null;
  for (; i < src.length; i++) {
    const ch = src[i];
    if (str) {
      if (ch === '\\') { i++; continue; }
      if (ch === str) str = null;
      continue;
    }
    if (ch === '"' || ch === "'") { str = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') {
      depth--;
      if (depth === 0) return src.slice(inner, i);
    }
  }
  throw new Error(`unterminated block for ${varName}`);
}

// Parse entries of the shape:
//   'slug': { name: 'Name', members: ['A', 'B'] },
const QSTR = /(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")/.source;
const ENTRY_RE = new RegExp(
  `${QSTR}\\s*:\\s*\\{` +
  `\\s*name\\s*:\\s*${QSTR}\\s*,` +
  `\\s*members\\s*:\\s*\\[([^\\]]*)\\]` +
  `\\s*,?\\s*\\}`,
  'g'
);
const STRING_RE = new RegExp(QSTR, 'g');

function parseEntries(block) {
  const out = {};
  for (const m of block.matchAll(ENTRY_RE)) {
    const slug = m[1] ?? m[2];
    const name = m[3] ?? m[4];
    const membersRaw = m[5];
    const members = [];
    for (const s of membersRaw.matchAll(STRING_RE)) {
      members.push(s[1] ?? s[2]);
    }
    out[slug] = { name, members };
  }
  return out;
}

const FAMILIES = parseEntries(extractBlock(source, 'FAMILIES'));
const GUESTS   = parseEntries(extractBlock(source, 'GUESTS'));

function section(title, obj, phone) {
  const slugs = Object.keys(obj);
  const lines = [`## ${title} — ${slugs.length} links (WhatsApp ${phone})`, ''];
  const colWidth =
    Math.max(...slugs.map(s => s.length)) + `https://${DOMAIN}/#`.length + 2;
  for (const slug of slugs) {
    const url = `https://${DOMAIN}/#${slug}`;
    const members = obj[slug].members.join(', ');
    lines.push(`${url.padEnd(colWidth, ' ')}→ ${obj[slug].name}: ${members}`);
  }
  return lines.join('\n');
}

const total = Object.keys(FAMILIES).length + Object.keys(GUESTS).length;
const headcount =
  Object.values(FAMILIES).reduce((n, f) => n + f.members.length, 0) +
  Object.values(GUESTS).reduce((n, g) => n + g.members.length, 0);

const out = [
  '# Wedding share links — Loti & Matina',
  `# Domain: ${DOMAIN}`,
  `# Total: ${total} personalized links · ~${headcount} guests`,
  '# Regenerate: cd scripts && npm run urls',
  '',
  section('FAMILIES', FAMILIES, '+383 44 434 679'),
  '',
  section('GUESTS', GUESTS, '+355 68 464 2402'),
  '',
].join('\n');

writeFileSync(outPath, out);
console.log(`Wrote ${total} links → ${outPath}`);
