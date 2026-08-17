const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Check all element IDs referenced in JS
const idRegex = /getElementById\(['"]([^'"]+)['"]\)/g;
const dollarRegex = /\$\(['"]#?([^'"]+)['"]\)/g;

const allIds = new Set();
let match;
while ((match = idRegex.exec(html)) !== null) {
  allIds.add(match[1]);
}
while ((match = dollarRegex.exec(html)) !== null) {
  allIds.add(match[1].replace('#', ''));
}

console.log('Total unique IDs referenced in JavaScript:', allIds.size);

const missingIds = [];
for (const id of allIds) {
  if (id.includes('${') || id.includes('+')) continue; // dynamic ID
  const hasIdInHtml = html.includes('id="' + id + '"') || html.includes("id='" + id + "'");
  if (!hasIdInHtml) {
    missingIds.push(id);
  }
}

console.log('Total verified IDs:', allIds.size - missingIds.length);
if (missingIds.length > 0) {
  console.log('IDs created dynamically or needing check:', missingIds);
} else {
  console.log('✅ ALL DOM IDs strictly matched in HTML structure!');
}
