const jimp = require("jimp");
const tessarct = require("node-tesseract-ocr");

const enhance = async () => {
  const image = await jimp.read("./visitingcards/page0/card7.png");
  await image.resize(1000, 1000).quality(100);
  await image.writeAsync(`./visitingcards/page0/card7.png`);
};

const config = {
  lang: "eng",
  oem: 3,
  psm: 3,
};

enhance().then(() => {
  tessarct
    .recognize("./visitingcards/page0/card7.png", config)
    .then((text) => console.log(text));
});
