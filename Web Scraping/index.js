const link =
  "https://www.google.com/maps/place/Swayambhunath,+Kathmandu+44600/@27.7153242,85.2882376,3a,75y,90t/data=!3m8!1e2!3m6!1sAF1QipMIvGehGur5uD9L-6jYweQhMKGngNPevK7_4aa_!2e10!3e12!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMIvGehGur5uD9L-6jYweQhMKGngNPevK7_4aa_%3Dw160-h120-k-no!7i4624!8i3468!4m7!3m6!1s0x39eb188d6f95b9cd:0xc6ed340bfeea9e8d!8m2!3d27.7153242!4d85.2882376!10e5!16s%2Fg%2F11fk4cx1cw?entry=ttu";
let folder = "";
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
// Regular expression pattern to match URLs
const urlRegex = /(https:\/\/lh5\.googleusercontent\.com\/p\/[^\s]+)/g;

// Function to extract valid URLs from the text
function extractValidUrls(text) {
  const matches = text.match(urlRegex);
  // return matches ? matches.map((url) => url.replace(/\\(.*)/g, "")) : [];
  return matches ? matches.map((url) => url.replace(/[\\=](.*)/g, "")) : [];
}
if (process.argv[3]) {
  folder = process.argv[3];
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
} else {
  console.log("Please provide valid command");
  console.log("npm start file/link foldername");
}
if (process.argv[2] === "file") {
  // console.log(process.argv[2]);
  downlaodFromFile();
} else if (process.argv[2] === "link") {
  downloadFormLink();
} else {
  console.log("Please provide valid command");
  console.log("npm start file/link foldername");
}

function downloadFormLink() {
  axios
    .get(link) // Replace with your desired URL
    .then((response) => {
      startDownloading(response.data);
    })
    .catch((error) => {
      console.log("Error fetching the page:", error.message);
    });
}
function downlaodFromFile() {
  console.log("file");
  fs.readFile("index.txt", "utf8", function (err, data) {
    if (err) throw err.message;
    startDownloading(data);
  });
}
function startDownloading(data) {
  // console.log(data);
  const $ = cheerio.load(data);
  // console.log(response.data);
  // fs.writeFileSync("index.html", data);

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
