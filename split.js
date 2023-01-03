var pdf2img = require("pdf-img-convert");
const mkdirp = require("mkdirp");
// Both HTTP and local paths are supported
var outputImages1 = pdf2img.convert("test2.pdf", {
  width: 1100,
  height: 1600,
});

var fs = require("fs");

mkdirp("./pages").then(() => {
  outputImages1.then(function (outputImages) {
    for (i = 0; i < outputImages.length; i++)
      fs.writeFile(
        "./pages/page" + i + ".png",
        outputImages[i],
        function (error) {
          if (error) {
            console.error("Error: " + error);
          }
        }
      );
  });
});
