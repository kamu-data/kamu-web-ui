const fs = require("fs");
const path = require("path");
const { LICENSE_HEADER } = require("./src/docs/license-header");

function addLicenseToFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const LICENSE_HEADER_COUNT_LINES = LICENSE_HEADER.split("\n").length;
  if (!content.startsWith("/**")) {
    fs.writeFileSync(filePath, LICENSE_HEADER + "\n\n" + content, "utf8");
    console.log(`Added license to ${filePath}`);
  } else {
    try {
      const data = fs.readFileSync(filePath, "utf8");
      const lines = data.split("\n");
      const newLines = LICENSE_HEADER.split("\n");

      const updatedContent = [...newLines, ...lines.slice(LICENSE_HEADER_COUNT_LINES)].join("\n");
      fs.writeFileSync(filePath, updatedContent, "utf8");
      console.log(`First ${LICENSE_HEADER_COUNT_LINES} lines replace in ${filePath}`);
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

function processDirectory(directory) {
  fs.readdirSync(directory).forEach((file) => {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".ts")) {
      addLicenseToFile(fullPath);
    }
  });
}

processDirectory("./src/app/account/settings/tabs/emails-tab"); // Change directory as needed
console.log("License headers added to all files.");
