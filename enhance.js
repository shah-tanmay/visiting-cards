const jimp = require("jimp");

const enhance = async (page, card) => {
  const image = await jimp.read(`./visitingcards/page${page}/card${card}.png`);
  image.resize(500, 500).quality(100);
  await image.writeAsync(
    `./visitingcards/enhanced/page${page}/card${card}.png`
  );
};

for (let page = 0; page < 10; page++) {
  for (let card = 0; card < 8; card++) {
    enhance(page, card);
  }
}
