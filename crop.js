const sharp = require("sharp");
const mkdirp = require("mkdirp");
const fs = require("fs");

const getCroppedImages = () => {
  for (let page = 0; page < 10; page++) {
    mkdirp(`./visitingcards/page${page}`).then(() => {
      let originalImage = `./pages/page${page}.png`;
      sharp(`./pages/page${page}.png`)
        .metadata()
        .then((data) => {
          const totalHeight = data.height;
          for (let i = 0; i < 4; i++) {
            const height = i != 3 ? 400 : totalHeight - 1200;
            sharp(originalImage)
              .extract({ width: 500, height: height, left: 0, top: 400 * i })
              .toFile(`./visitingcards/page${page}/card${i}.png`)
              .then(function (new_file_info) {
                console.log("Image cropped and saved");
              })
              .catch(function (err) {
                console.log(i, "An error occured");
                console.log(err);
              });
            sharp(originalImage)
              .extract({ width: 600, height: height, left: 500, top: 400 * i })
              .toFile(`./visitingcards/page${page}/card${4 + i}.png`)
              .then(function (new_file_info) {
                console.log("Image cropped and saved");
              })
              .catch(function (err) {
                console.log(4 + i, "An error occured");
                console.log(err);
              });
          }
        });
    });
  }
};

getCroppedImages();
