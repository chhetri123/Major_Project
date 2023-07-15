const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");
let folder;
<<<<<<< HEAD
let delay = 50; // Initial delay in milliseconds between requests
let retryAttempts = 0; // Number of retry attempts for a specific URL
let count = 1;
=======
let delay = 1500; // Initial delay in milliseconds between requests
let retryAttempts = 0; // Number of retry attempts for a specific URL

>>>>>>> d25e85f65a4e81e4eba3d2b87975f742d933436c
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
<<<<<<< HEAD
    startDownloading(data).then((value) => value);
=======
    startDownloading(data);
>>>>>>> d25e85f65a4e81e4eba3d2b87975f742d933436c
  });
}

function delayRequest(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
<<<<<<< HEAD
async function startDownloading(data) {
  const $ = cheerio.load(data);
  const imgElements = $("img[data-src]");
  const imgUrls = imgElements
    .map((index, element) => {
      const link = $(element).attr("data-src");
      return extractUrl(link);
    })
    .get();
  // Extract valid URLs from the file contents

  fs.writeFileSync("wikiUrl.txt", imgUrls.join("\n"), "utf8");
  for (const url of imgUrls) {
    const destination = Math.random().toString(10).substring(7) + ".jpg";
    retryAttempts = 0; // Reset the retry attempts for each new URL
    await downloadImage(url, `${folder}/${destination}`);
  }
}

const extractUrl = (url) => {
  return url.replace("/thumb", "").split("/").slice(0, 8).join("/");
};

async function downloadImage(url, destination) {
  await delayRequest(delay);
=======
function startDownloading(data) {
  const $ = cheerio.load(data);
  const imgElements = $("img[data-src]");
  const imgUrls = imgElements
    .map(async (index, element) => {
      const link = $(element).attr("data-src");
      const extratedLink = await extractUrl(link);
      retryAttempts = 0; // Reset the retry attempts for each new URL
      await delayRequest(delay);
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
  retryAttempts = 0; // Reset the retry attempts for each new URL
  await downloadImage(link, `${folder}/${destination}`);
  return link;
};

// async function downloadImage(url, destination) {
//   try {

//      await delayRequest(1000);
//     const response = await axios({
//       method: "GET",
//       url: url,
//       timeout: 86400000,
//       maxContentLength: Infinity,
//       responseType: "arraybuffer",
//     });

//     if (response.status === 200) {
//       const filePath = path.resolve(__dirname, destination);
//       fs.writeFile(filePath, response.data, (err) => {
//         if (err) {
//           console.error("Error saving the image:", err);
//         } else {
//           console.log("Image downloaded successfully!");
//         }
//       });
//     } else {

//       console.error(
//         "Failed to download the image. Status code:",
//         response.status
//       );
//     }
//   } catch (error) {
//     console.log(url);
//     console.error("Error downloading the image:", error.message);
//   }
// }

async function downloadImage(url, destination) {
>>>>>>> d25e85f65a4e81e4eba3d2b87975f742d933436c
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
<<<<<<< HEAD
          console.log(`Image ${count++} downloaded successfully!`);
=======
          console.log("Image downloaded successfully!");
>>>>>>> d25e85f65a4e81e4eba3d2b87975f742d933436c
        }
      });
    } else if (response.status === 429) {
      console.log("Retrying..");
      if (retryAttempts < 3) {
        // Implement exponential backoff by doubling the delay duration
        delay *= 2;
        retryAttempts++;
        console.log(
          `Received 429 status. Retrying in ${delay} milliseconds...`
        );
        await downloadImage(url, destination); // Retry the request
      } else {
        console.error("Exceeded maximum retry attempts for the URL:", url);
      }
    } else {
      console.error(
        "Failed to download the image. Status code:",
        response.status
      );
    }
  } catch (error) {
    console.error("Error downloading the image:", error.message);
<<<<<<< HEAD
=======
    await delayRequest(delay);
>>>>>>> d25e85f65a4e81e4eba3d2b87975f742d933436c
  }
}
