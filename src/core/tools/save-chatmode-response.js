const fs = require('fs');
const path = require('path');

const CHATMODES = {
  planner: 'Planner',
  generator: 'Generator',
  healer: 'Healer',
  'api-testing': 'API Testing',
  'manual-testing': 'Manual Testing',
};

const OUTPUT_DIR = path.resolve(__dirname, '../../../docs/chatmode-responses');

const args = process.argv.slice(2);
const chatmode = args[0];
const topic = args[1];

if (!chatmode || !topic) {
  console.error('Usage: node save-chatmode-response.js <chatmode> "<topic>" <<\'EOF\'');
  console.error('<response body on stdin>');
  console.error('EOF');
  console.error(`\nKnown chatmodes: ${Object.keys(CHATMODES).join(', ')}`);
  process.exit(1);
}

if (!CHATMODES[chatmode]) {
  console.error(
    `Unknown chatmode "${chatmode}". Known chatmodes: ${Object.keys(CHATMODES).join(', ')}`
  );
  process.exit(1);
}

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function utcTimestamp(date) {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d+Z$/, 'Z');
}

function iso8601(date) {
  return date.toISOString().replace(/\.\d+Z$/, 'Z');
}

function readStdin() {
  const chunks = [];
  const fd = 0;
  const buffer = Buffer.alloc(65536);
  while (true) {
    let bytesRead;
    try {
      bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);
    } catch (err) {
      if (err.code === 'EAGAIN') continue;
      if (err.code === 'EOF') break;
      throw err;
    }
    if (bytesRead === 0) break;
    chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
  }
  return Buffer.concat(chunks).toString('utf8');
}

const body = readStdin().trim();

if (!body) {
  console.error('No response body received on stdin - nothing to save.');
  process.exit(1);
}

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const now = new Date();
const slug = slugify(topic) || 'response';
let filename = `${chatmode}-${slug}-${utcTimestamp(now)}.md`;
let filePath = path.join(OUTPUT_DIR, filename);

let suffix = 2;
while (fs.existsSync(filePath)) {
  filename = `${chatmode}-${slug}-${utcTimestamp(now)}-${suffix}.md`;
  filePath = path.join(OUTPUT_DIR, filename);
  suffix += 1;
}

const content = `# ${CHATMODES[chatmode]} Agent Response — ${topic}\n\nTimestamp: ${iso8601(now)}\n\n${body}\n`;

fs.writeFileSync(filePath, content);

console.log(`Saved: docs/chatmode-responses/${filename}`);
