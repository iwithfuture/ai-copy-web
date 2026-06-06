const fs = require("fs");
const path = require("path");

const root = __dirname;
const siteUrl = "https://ai.iwithfuture.com";
const brand = "吾日三省吾身";
const brandFull = "吾日三省吾身";
const defaultImage = `${siteUrl}/assets/hero-hanto-voyage.png`;
const today = new Date().toISOString().slice(0, 10);

const descriptionOverrides = {
  "index.html": "吾日三省吾身为中国外贸企业提供 WordPress 外贸建站、Shopify 独立站、AI 官网展示建站、Google SEO、社媒运营和询盘转化方案，帮助网站成为可持续获客的增长系统。",
  "pages/wordpress-website.html": "WordPress 外贸建站适合 B2B 工厂、工业设备、零部件和服务型企业，用产品目录、技术资料、FAQ、下载中心和 SEO 内容承接长期自然流量与海外询盘。",
  "pages/shopify-website.html": "Shopify 独立站适合跨境电商和 DTC 品牌，用商品页、支付订单、评价、再营销和转化追踪搭建可运营的在线销售网站。",
  "pages/ai-website.html": "AI 官网展示建站适合个人、SOHO 和小型企业快速上线品牌展示网站，重点覆盖首页、公司介绍、服务展示、案例模块、联系方式和基础 SEO。",
  "pages/seo.html": "基于 Backlinko SEO 方法论，围绕关键词研究、搜索意图、页面结构、技术 SEO、内容集群、内链和外链权威建设，为外贸网站提升自然流量和有效询盘。",
  "pages/technical-seo.html": "技术 SEO 优化网站抓取、索引、速度、结构化数据、站点地图、重复内容、移动端体验和 Core Web Vitals，让外贸网站更容易被 Google 理解和收录。",
  "pages/content-seo.html": "内容 SEO 围绕海外买家的真实问题、产品场景、对比需求和采购决策，规划文章、指南、FAQ、案例和产品页内容，提升自然搜索覆盖。",
  "pages/link-building.html": "外链与品牌曝光通过行业资源、数字 PR、可引用内容、合作伙伴页面和高质量链接建设，提升外贸网站主题权威和品牌可信度。",
  "pages/social-media.html": "外贸社媒运营统一规划 LinkedIn、Facebook、Instagram、YouTube 和邮件内容节奏，用品牌内容、产品场景和线索入口承接海外客户。",
  "pages/pricing.html": "外贸建站价格页面说明 AI 官网、模板建站、仿站和定制建站的套餐起价，最终报价根据页面数量、设计要求、产品上传、语言和功能另行确认。",
  "pages/contact.html": "咨询外贸建站方案，请发送网站需求、行业、目标市场、预算和参考网站到 iwithfuture@gmail.com，获取 WordPress、Shopify 或 AI 官网建站建议。",
  "pages/about.html": "了解吾日三省吾身如何把 WordPress 建站经验、外贸内容、SEO 方法、正版插件和长期维护能力整合成外贸网站增长服务。"
};

const serviceKeywords = [
  "建站",
  "SEO",
  "Shopify",
  "WordPress",
  "SEM",
  "社媒",
  "运营",
  "投流",
  "优化",
  "开发",
  "维护",
  "邮件营销"
];

function htmlFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(full);
    return entry.isFile() && entry.name.endsWith(".html") ? [full] : [];
  });
}

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function text(value) {
  return String(value || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function match(html, regex) {
  const found = html.match(regex);
  return found ? text(found[1]) : "";
}

function pagePath(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function urlFor(relativePath) {
  return relativePath === "index.html" ? `${siteUrl}/` : `${siteUrl}/${relativePath}`;
}

function pageKind(title, relativePath) {
  if (relativePath === "index.html") return "home";
  if (relativePath.includes("contact")) return "contact";
  if (relativePath.includes("blog") || relativePath.includes("knowledge") || relativePath.includes("q-and-a")) return "article";
  if (serviceKeywords.some((keyword) => title.includes(keyword))) return "service";
  return "webpage";
}

function questionsFor(title, desc, kind) {
  if (kind === "contact") {
    return [
      ["如何咨询建站方案？", "可以把公司网站、行业、目标市场、预算、参考网站和当前问题发送到 iwithfuture@gmail.com，用于判断更适合 WordPress、Shopify、AI 官网还是定制建站。"],
      ["咨询前需要准备什么？", "建议准备产品资料、目标客户、主要国家、参考网站、预算范围、期望上线时间和是否需要 SEO、社媒或长期维护。"],
      ["会直接给固定报价吗？", "页面展示的是套餐起价，最终价格会根据页面数量、设计复杂度、产品上传、语言版本、功能和维护要求确认。"]
    ];
  }
  if (kind === "service") {
    return [
      [`${title}适合谁？`, `${title}适合希望用网站承接海外客户、搜索流量、询盘表单和长期运营内容的外贸企业，具体方案会根据行业、预算和目标市场调整。`],
      [`${title}主要解决什么问题？`, desc],
      [`${title}如何开始？`, "先梳理产品、客户、目标市场、参考网站和预算，再确认页面结构、内容资料、SEO 方向、转化入口和上线后的维护计划。"]
    ];
  }
  return [
    [`这个页面主要讲什么？`, desc],
    ["为什么这对外贸网站重要？", "清晰的网站结构、可回答的问题内容和可追踪的转化路径，可以帮助搜索引擎、AI 搜索和海外买家更快理解网站价值。"],
    ["下一步应该做什么？", "建议先确认目标市场、核心产品、参考网站和预算，再选择 WordPress、Shopify、AI 官网或定制建站方案。"]
  ];
}

function graphFor({ title, desc, url, kind }) {
  const orgId = `${siteUrl}/#organization`;
  const siteId = `${siteUrl}/#website`;
  const pageId = `${url}#webpage`;
  const graph = [
    {
      "@type": "Organization",
      "@id": orgId,
      name: brand,
      alternateName: brandFull,
      url: siteUrl,
      email: "iwithfuture@gmail.com",
      sameAs: ["https://iwithfuture.com/", "https://demo.iwithfuture.com/"]
    },
    {
      "@type": "WebSite",
      "@id": siteId,
      name: brandFull,
      url: siteUrl,
      inLanguage: "zh-CN",
      publisher: { "@id": orgId }
    },
    {
      "@type": kind === "contact" ? "ContactPage" : "WebPage",
      "@id": pageId,
      url,
      name: title,
      headline: title,
      description: desc,
      inLanguage: "zh-CN",
      isPartOf: { "@id": siteId },
      about: ["外贸建站", "Google SEO", "WordPress", "Shopify", "海外获客", "询盘转化"],
      audience: { "@type": "BusinessAudience", audienceType: "中国外贸企业、B2B 工厂、跨境电商品牌" },
      primaryImageOfPage: { "@type": "ImageObject", url: defaultImage },
      dateModified: today
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "首页", item: siteUrl },
        { "@type": "ListItem", position: 2, name: title, item: url }
      ]
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: questionsFor(title, desc, kind).map(([name, answer]) => ({
        "@type": "Question",
        name,
        acceptedAnswer: { "@type": "Answer", text: answer }
      }))
    }
  ];

  if (kind === "service") {
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: title,
      description: desc,
      provider: { "@id": orgId },
      areaServed: ["中国", "美国", "欧洲", "东南亚"],
      serviceType: title,
      audience: { "@type": "BusinessAudience", audienceType: "外贸企业和跨境电商品牌" }
    });
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/<\/script/gi, "<\\/script");
}

function seoHead({ title, desc, url, kind }) {
  const escapedTitle = esc(title);
  const escapedDesc = esc(desc);
  const escapedUrl = esc(url);
  return [
    `<meta name="description" content="${escapedDesc}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    `<meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">`,
    `<link rel="canonical" href="${escapedUrl}">`,
    `<link rel="alternate" hreflang="zh-CN" href="${escapedUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${escapedUrl}">`,
    `<meta property="og:locale" content="zh_CN">`,
    `<meta property="og:type" content="${kind === "article" ? "article" : "website"}">`,
    `<meta property="og:site_name" content="${esc(brandFull)}">`,
    `<meta property="og:title" content="${escapedTitle}">`,
    `<meta property="og:description" content="${escapedDesc}">`,
    `<meta property="og:url" content="${escapedUrl}">`,
    `<meta property="og:image" content="${esc(defaultImage)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapedTitle}">`,
    `<meta name="twitter:description" content="${escapedDesc}">`,
    `<meta name="twitter:image" content="${esc(defaultImage)}">`,
    `<meta name="theme-color" content="#2872fa">`,
    `<script type="application/ld+json">${graphFor({ title, desc, url, kind })}</script>`
  ].join("");
}

function enhance(file) {
  const relativePath = pagePath(file);
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<meta name="description" content="[^"]*">/i, "");
  html = html.replace(/<meta name="robots"[^>]*>/gi, "");
  html = html.replace(/<meta name="googlebot"[^>]*>/gi, "");
  html = html.replace(/<link rel="canonical"[^>]*>/gi, "");
  html = html.replace(/<link rel="alternate" hreflang="[^"]*"[^>]*>/gi, "");
  html = html.replace(/<meta property="og:[^"]+"[^>]*>/gi, "");
  html = html.replace(/<meta name="twitter:[^"]+"[^>]*>/gi, "");
  html = html.replace(/<meta name="theme-color"[^>]*>/gi, "");
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, "");

  const rawTitle = match(html, /<title>(.*?)<\/title>/i);
  const h1 = match(html, /<h1[^>]*>(.*?)<\/h1>/i);
  const title = rawTitle || h1 || brandFull;
  const existingDesc = match(html, /<meta name="description" content="([^"]*)">/i);
  const desc = descriptionOverrides[relativePath] || existingDesc || `${h1 || title}，提供面向外贸企业的网站建设、SEO 优化、内容规划和询盘转化建议。`;
  const kind = pageKind(title, relativePath);
  const url = urlFor(relativePath);
  const head = seoHead({ title, desc, url, kind });

  html = html.replace(/(<title>.*?<\/title>)/i, `$1${head}`);
  fs.writeFileSync(file, html);
  return { relativePath, url };
}

const pages = htmlFiles(root)
  .filter((file) => !file.includes(`${path.sep}.git${path.sep}`))
  .sort()
  .map(enhance);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
  .map(({ relativePath, url }) => {
    const priority = relativePath === "index.html" ? "1.0" : relativePath.includes("contact") || relativePath.includes("pricing") ? "0.8" : "0.7";
    return `  <url><loc>${url}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  })
  .join("\n")}\n</urlset>\n`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(root, "robots.txt"),
  `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`
);

console.log(`Enhanced ${pages.length} HTML pages for SEO/GEO/AEO.`);
