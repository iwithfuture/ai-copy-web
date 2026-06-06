const fs = require("fs");
const path = require("path");

const root = __dirname;
const owner = "iwithfuture";
const sourceUrl = "https://ai.iwithfuture.com/";
const fingerprint = "iwithfuture-ai-overseas-growth-site";
const comment = `<!-- ownership-fingerprint: ${fingerprint}; source: ${sourceUrl}; owner: ${owner} -->`;
const meta = [
  `<meta name="iwithfuture:owner" content="${owner}">`,
  `<meta name="iwithfuture:source" content="${sourceUrl}">`,
  `<meta name="iwithfuture:fingerprint" content="${fingerprint}">`
].join("");
const hiddenLink = `<a class="ownership-fingerprint-link" href="${sourceUrl}" rel="nofollow noopener" aria-hidden="true" tabindex="-1" data-source-owner="${owner}" data-source-url="${sourceUrl}" data-source-fingerprint="${fingerprint}">iwithfuture source</a>`;

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") return [];
      return htmlFiles(full);
    }
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

function applyToHtml(file) {
  let html = fs.readFileSync(file, "utf8");

  html = html.replace(/<!-- ownership-fingerprint:[\s\S]*?-->/g, "");
  html = html.replace(/<meta name="iwithfuture:[^"]+" content="[^"]*">/g, "");
  html = html.replace(/<a class="ownership-fingerprint-link"[\s\S]*?<\/a>/g, "");

  if (/<head>\s*<meta charset="utf-8">/i.test(html)) {
    html = html.replace(/(<head>\s*<meta charset="utf-8">)/i, `$1${comment}${meta}`);
  } else {
    html = html.replace(/<head>/i, `<head>${comment}${meta}`);
  }
  html = html.replace(
    /<body([^>]*)>/i,
    (match, attrs) => {
      let nextAttrs = attrs
        .replace(/\sdata-source-owner="[^"]*"/g, "")
        .replace(/\sdata-source-url="[^"]*"/g, "")
        .replace(/\sdata-source-fingerprint="[^"]*"/g, "");
      return `<body${nextAttrs} data-source-owner="${owner}" data-source-url="${sourceUrl}" data-source-fingerprint="${fingerprint}">${hiddenLink}`;
    }
  );

  fs.writeFileSync(file, html);
}

htmlFiles(root).forEach(applyToHtml);
console.log("Ownership fingerprint applied.");
