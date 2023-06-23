const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const readline = require("readline");

let base64Images;
let folderName;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt for the link and folder name
rl.question("Enter the link to scrape images from: ", (link) => {
  rl.question("Enter the folder name to save the images: ", (folder) => {
    folderName = folder;
    rl.close();

    // Call scrapeData with the provided link
    scrapeData(link)
      .then(() => {
        // Call saveImageToFile to save the images
        saveImageToFile();
      })
      .catch((error) => {
        console.error("Error scraping data:", error);
      });
  });
});

async function scrapeData(Link) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(Link);

  // Extract data using JavaScript on the page
  base64Images = await page.evaluate(() => {
    const images = document.querySelectorAll("img");
    const urls = Array.from(images).map((v) => v.src);
    return urls;
  });

  await browser.close();
}

function saveImageToFile() {
  // Create folder if it doesn't exist
  fs.mkdir(folderName, { recursive: true })
    .then(() => {
      // Extract image format from Base64 string
      const filteredImages = base64Images.filter(
        (urls) =>
          urls.startsWith("data:image/jpeg;base64,") ||
          urls.startsWith("data:image/png;base64,") ||
          urls.startsWith("data:image/jpg;base64,") ||
          urls.startsWith("data:image/gif;base64,")
      );

      filteredImages.forEach((image, index) => {
        const fileName = Math.random().toString(10).substring(2, 15);
        const imageFormat = image.split(";")[0].split("/")[1];
        const imageData = image.replace(/^data:image\/\w+;base64,/, "");
        const filePath = `./${folderName}/${fileName}.${imageFormat}`;

        // Write Base64 image data to file
        fs.writeFile(filePath, imageData, "base64")
          .then(() => {
            console.log(`Image file saved successfully: ${filePath}`);
          })
          .catch((err) => {
            console.error(`Failed to save image file: ${err}`);
          });
      });
    })
    .catch((err) => {
      console.error(`Failed to create folder: ${err}`);
    });
}
