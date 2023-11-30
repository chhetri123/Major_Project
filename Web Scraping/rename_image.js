const fs = require("fs").promises;
const path = require("path");

const folderPath = "phasupatinath1"; // Replace this with your folder path

(async () => {
  try {
    const files = await fs.readdir(folderPath);
    let renamedCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const filePath = path.join(folderPath, file);

      // Check if it's a file and if it's a JPG image
      const stats = await fs.stat(filePath);
      if (stats.isFile() && path.extname(file).toLowerCase() === ".jpg") {
        const newFileName = `p_${i + 1}.jpg`;

        await fs.rename(filePath, path.join(folderPath, newFileName));
        renamedCount++;
        console.log(`Renamed ${file} to ${newFileName}`);
      }
    }

    console.log("Renaming process completed.");
  } catch (err) {
    console.error("Error renaming files:", err);
  }
})();
