
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
// Regular expression pattern to match URLs
const urlRegex = /(https:\/\/lh5\.googleusercontent\.com\/p\/[^\s]+)/g;


// Function to extract valid URLs from the text
function extractValidUrls(text) {
  const matches = text.match(urlRegex);
  return matches ? matches.map((url) => url.replace(/[\\=](.*)/g, "")) : [];
}
if (process.argv[3]) {
  folder = process.argv[3];
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
} else {
  console.log("Please provide valid command");
  console.log("npm start file foldername");
}
if (process.argv[2] === "file") {
  downlaodFromFile();
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

  // Extract valid URLs from the file contents
  const validUrls = extractValidUrls(data);
  fs.writeFileSync("urls.txt", validUrls.join("\n"), "utf8");
  validUrls.forEach(async (url) => {
    const destination = Math.random().toString(10).substring(7) + ".jpg";
    await downloadImage(url, `${folder}/${destination}`);
  });
}

async function downloadImage(url, destination) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
timeout: 86400000,
 maxContentLength:Infinity,
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
