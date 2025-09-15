const fs = require("fs");
const { execSync } = require("child_process");

const pkg = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const version = pkg.version;

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
const changelogPath = "./CHANGELOG.md";

if (!fs.existsSync(changelogPath)) {
  console.error("CHANGELOG.md not found");
  process.exit(1);
}

const lines = fs.readFileSync(changelogPath, "utf8").split(/\r?\n/);
const lineIndex = lines.findIndex((line) => line.includes("[Unreleased]"));

if (lineIndex === -1) {
  console.error('Label "Unreleased" not found in CHANGELOG.md');
  process.exit(1);
}

lines[lineIndex] = `## [${version}] - ${today}`;

fs.writeFileSync(changelogPath, lines.join("\n"));

// change LICENSE.txt
const licensePath = "./LICENSE.txt";

if (!fs.existsSync(licensePath)) {
  console.error("LICENSE.txt not found");
  process.exit(1);
}

const linesLicense = fs.readFileSync(licensePath, "utf8").split(/\r?\n/);

const lineIndexLicense = 13;
linesLicense[lineIndexLicense] = `Licensed Work:             Kamu Web UI Version ${version}`;
fs.writeFileSync(licensePath, linesLicense.join("\n"));

// Commit changes
// execSync("git add LICENSE.txt CHANGELOG.md", { stdio: "inherit" });
// execSync(`git commit -m "Release v${version}"`, { stdio: "inherit" });
