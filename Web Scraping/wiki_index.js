const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
let folder;

if (process.argv[2]) {
  folder = process.argv[2];
  folder = path.resolve(__dirname, "../DataSets", folder);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  downlaodFromFile();
} else {
  console.log("Please provide valid command");
  console.log("npm start file/link foldername");
}

function downlaodFromFile() {
  console.log("file");
  fs.readFile("index.txt", "utf8", function (err, data) {
    if (err) throw err.message;
    startDownloading(data);
  });
}
function startDownloading(data) {
  const $ = cheerio.load(data);
  const imgElements = $("img[data-src]");
  const imgUrls = imgElements
    .map(async (index, element) => {
      const link = $(element).attr("data-src");
      const extratedLink = await extractUrl(link);
      return extratedLink;
    })
    .get();
  // Extract valid URLs from the file contents
  Promise.all(imgUrls).then((values) => {
    fs.writeFileSync("wikiUrl.txt", values.join("\n"), "utf8");
  });
}

const extractUrl = async (url) => {
  const link = url.replace("/thumb", "").split("/").slice(0, 8).join("/");
  const destination = Math.random().toString(10).substring(7) + ".jpg";
  await downloadImage(link, `${folder}/${destination}`);
  return link;
};
async function downloadImage(url, destination) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      timeout: 86400000,
      maxContentLength: Infinity,
      responseType: "arraybuffer",
    });

    if (response.status === 200) {
      const filePath = path.resolve(__dirname, destination);
      fs.writeFile(filePath, response.data, (err) => {
        if (err) {
          console.error("Error saving the image:", err);
        } else {
          console.log("Image downloaded successfully!");
        }
      });
    } else {
      console.error(
        "Failed to download the image. Status code:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error downloading the image:", error.message);
  }
}
