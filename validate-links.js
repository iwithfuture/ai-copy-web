const fs = require("fs");
const path = require("path");

const files = [
  "index.html",
  ...fs.readdirSync("pages")
    .filter((file) => /\.(html|php)$/.test(file))
    .map((file) => path.join("pages", file)),
];

const missing = [];

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const dir = path.dirname(file);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = match[1];
    if (url.startsWith("http") || url.startsWith("mailto:") || url.startsWith("#")) continue;
    const target = path.normalize(path.join(dir, url));
    if (!fs.existsSync(target)) missing.push(`${file} -> ${url} -> ${target}`);
  }
}

console.log(`files ${files.length} missing ${missing.length}`);
if (missing.length) console.log(missing.slice(0, 50).join("\n"));
