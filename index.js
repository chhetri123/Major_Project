const link =
  "https://www.google.com/maps/place/Swayambhunath,+Kathmandu+44600/@27.7153242,85.2882376,3a,75y,90t/data=!3m8!1e2!3m6!1sAF1QipMIvGehGur5uD9L-6jYweQhMKGngNPevK7_4aa_!2e10!3e12!6shttps:%2F%2Flh5.googleusercontent.com%2Fp%2FAF1QipMIvGehGur5uD9L-6jYweQhMKGngNPevK7_4aa_%3Dw160-h120-k-no!7i4624!8i3468!4m7!3m6!1s0x39eb188d6f95b9cd:0xc6ed340bfeea9e8d!8m2!3d27.7153242!4d85.2882376!10e5!16s%2Fg%2F11fk4cx1cw?entry=ttu";
const folder = "swambumath";
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs/promises");
const path = require("path");
// Regular expression pattern to match URLs
const urlRegex = /(https:\/\/lh5\.googleusercontent\.com\/p\/[^\s]+)/g;

// Function to extract valid URLs from the text
function extractValidUrls(text) {
  const matches = text.match(urlRegex);
  return matches ? matches.map((url) => url.replace(/\\(.*)/g, "")) : [];
}
axios
  .get(link) // Replace with your desired URL
  .then((response) => {
    const $ = cheerio.load(response.data);
    // console.log(response.data);
    fs.writeFile("index.html", response.data);

    // Extract valid URLs from the file contents
    const validUrls = extractValidUrls(response.data);
    validUrls.forEach(async (url) => {
      const destination = Math.random().toString(10).substring(7) + ".jpg";
      await downloadImage(url, `${folder}/${destination}`);
    });
    // fs.writeFile("urls.txt", validUrls.join("\n"));
  })
  .catch((error) => {
    console.log("Error fetching the page:", error.message);
  });
async function downloadImage(url, destination) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "arraybuffer",
    });

    if (response.status === 200) {
      const filePath = path.resolve(__dirname, destination);
      fs.writeFile(filePath, response.data);
      console.log("Image downloaded successfully!");
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
