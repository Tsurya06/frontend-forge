const fs = require('fs');
const path = require('path');

const outFile = path.join(__dirname, 'index.ts');
const parts = fs.readdirSync(__dirname)
  .filter(f => f.startsWith('_part') && f.endsWith('.ts'))
  .sort();

let content = `import type { Topic } from '../../types';\n\nexport const cssTopics: Topic[] = [\n`;

for (const part of parts) {
  content += fs.readFileSync(path.join(__dirname, part), 'utf8') + '\n';
}

content += '];\n';
fs.writeFileSync(outFile, content, 'utf8');
console.log(`Wrote ${outFile} (${content.length} chars, ${parts.length} parts)`);
