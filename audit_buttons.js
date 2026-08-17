const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const btnRegex = /<button[^>]*id=['"]([^'"]+)['"][^>]*>/g;
const btnMatches = [];
let match;
while ((match = btnRegex.exec(html)) !== null) {
  btnMatches.push(match[1]);
}

console.log('Total button IDs found:', btnMatches.length);

const unhandled = [];
for (const id of btnMatches) {
  const patterns = [
    `'${id}'`,
    `"${id}"`,
    `#${id}`
  ];
  let foundInScript = false;
  // Check if mentioned in script
  const scriptIdx = html.indexOf('<script>');
  const scriptContent = html.slice(scriptIdx);
  for (const p of patterns) {
    if (scriptContent.includes(p)) {
      foundInScript = true;
      break;
    }
  }
  if (!foundInScript) {
    unhandled.push(id);
  }
}

console.log('Unhandled button IDs in JavaScript:', unhandled);
