const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Extract champion cards - each card has name, cost, traits
const champions = [];

// Find all champion card blocks
const cardRegex = /class="text-xl leading-tight font-semibold"[^>]*>\s*([\w'\.\s]+?)\s*<\/div>[\s\S]*?<span>(\d+)<\/span>[\s\S]*?<div class="mt-1 flex gap-2"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/g;

let m;
while (m = cardRegex.exec(html)) {
  const name = m[1].trim();
  const cost = parseInt(m[2]);
  const traitsBlock = m[3];
  
  // Extract trait names from alt attributes
  const traitRegex = /alt="([^"]+)"/g;
  const traits = [];
  let tm;
  while (tm = traitRegex.exec(traitsBlock)) {
    traits.push(tm[1]);
  }
  
  champions.push({ name, cost, traits });
}

console.log(JSON.stringify(champions, null, 2));
console.log('\nTotal champions:', champions.length);

// Aggregate traits
const traitMap = {};
champions.forEach(c => {
  c.traits.forEach(t => {
    if (!traitMap[t]) traitMap[t] = [];
    traitMap[t].push({ name: c.name, cost: c.cost });
  });
});

console.log('\n--- TRAITS ---');
Object.keys(traitMap).sort().forEach(t => {
  console.log(`${t} (${traitMap[t].length}): ${traitMap[t].map(c => `${c.name}(${c.cost})`).join(', ')}`);
});
