const fs = require("fs");
const path = require("path");
const { LICENSE_HEADER } = require("./src/docs/license-header");

const licenseText = LICENSE_HEADER + "\n\n";

function addLicenseToFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  if (!content.startsWith("/**")) {
    fs.writeFileSync(filePath, licenseText + content, "utf8");
    console.log(`Added license to ${filePath}`);
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
