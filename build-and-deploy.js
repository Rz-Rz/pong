// Import statements for ES modules
import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// __dirname is not defined in ES module scope, so we need to create it
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration: Update these paths according to your project and deployment structure
const ASSETS_DEST_PATH = "../../backend-three-api/buildthree/static/assets";
const TEXTURES_DEST_PATH = "../../backend-three-api/buildthree/static/textures";
const INDEX_HTML_DEST_PATH = "../../backend-three-api/buildthree/templates/buildthree/";
const INDEX_HTML_PATH = path.join(INDEX_HTML_DEST_PATH, "index.html"); // Assuming index.html is directly in the destination path

// Copy function
// Adjusted Copy function to differentiate between file and directory destinations
async function copyToDest(source, destination, isFile = false) {
  try {
    if (isFile) {
      // Ensure the destination directory exists
      await fs.ensureDir(path.dirname(destination));
      // Copy the file
      await fs.copy(source, destination);
    } else {
      // Ensure the destination directory exists
      await fs.ensureDir(destination);
      // Copy the directory
      await fs.copy(source, destination);
    }
    console.log(`Copied from ${source} to ${destination}`);
  } catch (err) {
    console.error(`Error copying from ${source} to ${destination}: ${err}`);
  }
}

// Define an async function to clean up the destination directory
async function cleanupDestination(destinationPath) {
  try {
    await fs.remove(destinationPath);
    console.log(`Cleaned up ${destinationPath}`);
    await fs.ensureDir(destinationPath);
    console.log(`Prepared ${destinationPath}`);
  } catch (err) {
    console.error(`Error preparing the destination: ${err}`);
  }
}

// Modify index.html function
async function modifyIndexHtml(filePath) {
  try {
    let content = await fs.readFile(filePath, "utf8");
    content = "{% load static %}\n" + content;
    content = content.replace(
      /"\.\/assets\/(.*?)"/g,
      "\"{% static 'assets/$1' %}\"",
    );
    await fs.writeFile(filePath, content, "utf8");
    console.log("index.html has been successfully modified.");
  } catch (error) {
    console.error("An error occurred while modifying index.html:", error);
  }
}

async function main() {
  try {
    await cleanupDestination(ASSETS_DEST_PATH);
    await cleanupDestination(TEXTURES_DEST_PATH);
    await cleanupDestination(INDEX_HTML_DEST_PATH);
    // Build and then copy & modify
    exec("npm run build", async (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);

      // Copy assets and textures
      const assetsSrcPath = path.join(__dirname, "dist", "assets");
      const texturesSrcPath = path.join(__dirname, "dist", "textures");
      await copyToDest(assetsSrcPath, ASSETS_DEST_PATH);
      await copyToDest(texturesSrcPath, TEXTURES_DEST_PATH);

      // Copy index.html and then modify it
      const indexHtmlSrcPath = path.join(__dirname, "dist", "index.html");
      const indexHtmlDestPath = path.join(INDEX_HTML_DEST_PATH, "index.html"); // Full path including filename
      await copyToDest(indexHtmlSrcPath, indexHtmlDestPath, true);
      await modifyIndexHtml(INDEX_HTML_PATH);
    });
  } catch (error) {
    console.error("An error occurred in the main function:", error);
  }
}

main();
