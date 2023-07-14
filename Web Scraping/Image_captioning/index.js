console.log(process.cwd());
const path = require("path");

const apiKey =
  "835EFAE1-8286-44E9-866B-52222BCA6CD90D2CDFB2-9F1D-4169-ABAD-93D314A7963C";
console.log(path.resolve(__dirname, "../../DataSets"));
<script src="https://astica.ai/javascript-sdk/2023-07-09/astica.api.js"></script>;

asticaAPI_start("API KEY HERE"); //run at least once

// Read the number of images from a file (assuming the file contains one image URL per line)
fetch("image_urls.txt")
  .then((response) => response.text())
  .then((imageUrls) => {
    const urls = imageUrls.split("\n").filter(Boolean); // Split the URLs by line and remove empty lines
    processImages(urls);
  })
  .catch((error) => console.error(error));

function processImages(imageUrls) {
  // Loop through the image URLs and process them one by one
  for (let i = 0; i < imageUrls.length; i++) {
    const imageUrl = imageUrls[i].trim();
    const imageName = getImageName(imageUrl);

    // Call asticaVision with the image URL and desired options
    asticaVision(
      "2.0_full",
      imageUrl,
      "Description,Faces,Objects",
      function (data) {
        if (typeof data.error !== "undefined") {
          console.error(data.error);
          return;
        }

        console.log(data); // View all data

        // Save the generated caption with the tag of the image name in another file
        const caption = data.description.captions[0].text;
        saveCaptionToFile(imageName, caption);
      }
    );
  }
}

// Extract the image name from the URL
function getImageName(imageUrl) {
  const urlParts = imageUrl.split("/");
  return urlParts[urlParts.length - 1];
}

// Save the caption with the image name in another file
function saveCaptionToFile(imageName, caption) {
  const captionWithTag = `${imageName}: ${caption}\n`;
  fetch("captions.txt", { method: "POST", body: captionWithTag })
    .then((response) => console.log("Caption saved successfully."))
    .catch((error) => console.error(error));
}
