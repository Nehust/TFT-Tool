const fs = require('fs');

const data = JSON.parse(fs.readFileSync('f:\\TFT tool\\data\\tft_set17_data.json', 'utf8'));

const VERSION = '16.7.1';
const BASE = `https://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/`;

const nameToImage = {
  "Aatrox": "Aatrox.png",
  "Briar": "Briar.png",
  "Caitlyn": "Caitlyn.png",
  "Cho'Gath": "Chogath.png",
  "Ezreal": "Ezreal.png",
  "Leona": "Leona.png",
  "Lissandra": "Lissandra.png",
  "Nasus": "Nasus.png",
  "Poppy": "Poppy.png",
  "Rek'Sai": "RekSai.png",
  "Talon": "Talon.png",
  "Teemo": "Teemo.png",
  "Twisted Fate": "TwistedFate.png",
  "Veigar": "Veigar.png",
  "Akali": "Akali.png",
  "Bel'Veth": "Belveth.png",
  "Gnar": "Gnar.png",
  "Gragas": "Gragas.png",
  "Gwen": "Gwen.png",
  "Jax": "Jax.png",
  "Jinx": "Jinx.png",
  "Meepsie": "Bard.png",
  "Milio": "Milio.png",
  "Mordekaiser": "Mordekaiser.png",
  "Pantheon": "Pantheon.png",
  "Pyke": "Pyke.png",
  "Zoe": "Zoe.png",
  "Aurora": "Aurora.png",
  "Diana": "Diana.png",
  "Fizz": "Fizz.png",
  "Illaoi": "Illaoi.png",
  "Kai'Sa": "Kaisa.png",
  "Lulu": "Lulu.png",
  "Maokai": "Maokai.png",
  "Miss Fortune": "MissFortune.png",
  "Ornn": "Ornn.png",
  "Rhaast": "Kayn.png",
  "Samira": "Samira.png",
  "Urgot": "Urgot.png",
  "Viktor": "Viktor.png",
  "Aurelion Sol": "AurelionSol.png",
  "Corki": "Corki.png",
  "Karma": "Karma.png",
  "Kindred": "Kindred.png",
  "LeBlanc": "Leblanc.png",
  "Master Yi": "MasterYi.png",
  "Nami": "Nami.png",
  "Nunu": "Nunu.png",
  "Rammus": "Rammus.png",
  "Riven": "Riven.png",
  "Tahm Kench": "TahmKench.png",
  "The Mighty Mech": "Rumble.png",
  "Xayah": "Xayah.png",
  "Bard": "Bard.png",
  "Blitzcrank": "Blitzcrank.png",
  "Fiora": "Fiora.png",
  "Graves": "Graves.png",
  "Jhin": "Jhin.png",
  "Morgana": "Morgana.png",
  "Shen": "Shen.png",
  "Sona": "Sona.png",
  "Vex": "Vex.png",
  "Zed": "Zed.png"
};

let updated = 0;
data.champions.forEach(champ => {
  const imgFile = nameToImage[champ.name];
  if (imgFile) {
    champ.image = BASE + imgFile;
    updated++;
  } else {
    console.log(`WARNING: No mapping for ${champ.name}`);
  }
});

console.log(`Updated ${updated}/${data.champions.length} champion images`);

fs.writeFileSync('f:\\TFT tool\\data\\tft_set17_data.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Saved tft_set17_data.json');

fs.copyFileSync('f:\\TFT tool\\data\\tft_set17_data.json', 'f:\\TFT tool\\app\\data.json');
console.log('Copied to app/data.json');
