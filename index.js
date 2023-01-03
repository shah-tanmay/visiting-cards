//STEPS TO RUN THE PROJECT
// 1-> RUN SPLIT.JS CONVERTS YOUR GIVEN INPUT PDF TO IMAGES FORM, OUTPUT WILL BE IN PAGES FOLDER
// 2 -> RUN CROP.JS CONVERTS INDIVIDUAL CARDS OUTPUT WILL BE IN VISITINGCARDS FOLDER.
// 3 -> RUN INDEX.JS EXTRACTS EMAILS, NAME, PHONENUMBER FROM THE IMAGES ALONG WITH BASE64 OF THE IMAGE.

const tesseract = require("node-tesseract-ocr");
const fs = require("fs");
const { spawn } = require("child_process");
const ExcelJS = require("exceljs");

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet("visitingcards");

worksheet.columns = [
  { header: "Email", key: "email", width: 30 },
  { header: "Phone", key: "phone", width: 30 },
  { header: "Name", key: "name", width: 30 },
  { header: "Image(Base64)", key: "image", width: 40 },
];

const base64_encode = (file) => {
  var bitmap = fs.readFileSync(file);
  return new Buffer.from(bitmap).toString("base64");
};

const extractEmails = (text) =>
  text.match(/([a-zA-Z0-9._-]+\s?@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);

const extractPhoneNumber = (text) => {
  var re = /(?:[-+() ]*\d){10,13}/gm;
  var res = text.match(re)?.map(function (s) {
    return s.trim();
  });
  return res;
};

const getNames = (text) => {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [
      "./name-classifier/name-classifier.py",
      text,
    ]);
    let dataToSend;
    python.stdout.on("data", function (data) {
      dataToSend = data.toString();
    });
    python.on("close", function (code) {
      resolve(dataToSend);
    });
  });
};

const config = {
  lang: "eng",
  oem: 1,
  psm: 3,
};

const getTextFromImage = async (page, card) => {
  const text = await tesseract.recognize(
    `./visitingcards/page${page}/card${card}.png`,
    config
  );
  return text;
};

const getData = async () => {
  let position = 1;
  for (let page = 0; page < 10; page++) {
    for (let card = 0; card < 8; card++) {
      position++;
      const text = await getTextFromImage(page, card);
      const email = extractEmails(text);
      const phone = extractPhoneNumber(text);
      const names = await getNames(text);
      const base64 = base64_encode(
        `./visitingcards/page${page}/card${card}.png`
      );
      worksheet.addRow([
        email != null ? email[0] : "",
        phone !== undefined ? phone.join(",") : "",
        names,
        base64,
      ]);
    }
  }
};

Promise.resolve(getData()).then(() => {
  workbook.xlsx
    .writeFile("data2.xlsx")
    .then(() => console.log("File created"))
    .catch((err) => console.log(err));
});
