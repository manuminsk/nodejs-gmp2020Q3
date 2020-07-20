// https://github.com/Keyang/node-csvtojson

const fs = require("fs");
const csv = require("csvtojson");
const { pipeline } = require("stream");

const csvContent = "./csv/";

fs.readdir(csvContent, (err, files) => {
  if (err) {
    console.error("Pipeline failed.", err);
    throw Error;
  }

  files.forEach((file) => {
    if (file && file.length) {
      const fileName = file.split(".");
      const fileType = fileName.pop();

      fileType === "csv" &&
        pipeline(
          fs.createReadStream(`./csv/${file}`),
          csv(),
          fs.createWriteStream(`./csv/${fileName.join("")}.txt`),
          (err) => {
            if (err) {
              console.error("Pipeline failed.", err);
            } else {
              console.log("Pipeline succeeded.");
            }
          }
        );
    }
  });
});
