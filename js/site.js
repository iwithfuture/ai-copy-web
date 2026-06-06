document.documentElement.classList.add("has-js");

const header = document.querySelector(".site-header");
const progress = document.querySelector(".progress");
const heroBg = document.querySelector(".hero-bg");
const cursorLight = document.querySelector(".cursor-light");
const mobileToggle = document.querySelector(".mobile-toggle");
const backTop = document.getElementById("backTop");

function updateScrollState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progress) progress.style.width = `${pct}%`;
  if (header) header.classList.toggle("scrolled", window.scrollY > 18);
  if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.04}px)`;
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

window.addEventListener("mousemove", (event) => {
  if (cursorLight) {
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  }
});

if (mobileToggle) {
  mobileToggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });
}

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => document.body.classList.remove("menu-open"));
});

document.querySelectorAll(".nav-item").forEach((item) => {
  const trigger = item.querySelector(".nav-trigger");
  item.addEventListener("mouseenter", () => item.classList.add("mega-open"));
  item.addEventListener("mouseleave", () => item.classList.remove("mega-open"));

  if (trigger) {
    trigger.addEventListener("click", (event) => {
      if (!item.querySelector(".mega")) return;
      event.preventDefault();
      document.querySelectorAll(".nav-item.mega-open").forEach((open) => {
        if (open !== item) open.classList.remove("mega-open");
      });
      item.classList.toggle("mega-open");
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".nav-item.mega-open").forEach((item) => item.classList.remove("mega-open"));
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.tab;
    const shell = button.closest(".tabs");
    shell.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.toggle("active", btn === button));
    shell.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === id));
  });
});

document.querySelectorAll(".faq-item").forEach((item) => {
  const question = item.querySelector(".faq-q");
  const answer = item.querySelector(".faq-a");
  const sync = () => {
    if (answer) answer.style.maxHeight = item.classList.contains("active") ? `${answer.scrollHeight}px` : "0px";
  };
  if (question) {
    question.addEventListener("click", () => {
      item.classList.toggle("active");
      sync();
    });
  }
  sync();
});

document.querySelectorAll(".tilt").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("mousemove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
    button.style.transform = `translate(${x}px, ${y}px)`;
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "";
  });
});

if (backTop) {
  backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

document.querySelectorAll(".tool-card").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const pages = Number(data.pages || 10);
    const langs = Number(data.langs || 1);
    const budget = Number(data.budget || 0);
    const tool = form.dataset.tool || "";
    let text = "";

    if (tool.includes("quotation")) {
      const low = Math.round((pages * 1800 + langs * 6000 + 18000) / 1000) * 1000;
      const high = Math.round((pages * 2600 + langs * 9000 + 36000) / 1000) * 1000;
      text = `预估报价区间：${low} - ${high} 元，建议先做核心页面和询盘追踪。`;
    } else if (tool.includes("budget")) {
      text = `按预算 ${budget} 元估算，可测试约 ${Math.round(budget / 8)} 次点击，建议预留 20% 做素材与落地页 A/B 测试。`;
    } else if (tool.includes("generator") || tool.includes("description")) {
      text = `生成示例：For ${data.target || "your product"}, focus on reliable performance, certified quality, flexible customization and fast response for overseas buyers.`;
    } else {
      text = "综合评分 82/100。建议优先优化首页标题、产品目录结构、移动端速度、FAQ 内容和询盘 CTA。";
    }

    const result = form.querySelector(".tool-result");
    if (result) result.textContent = text;
  });
});

function enhanceMegaMenus() {
  const configs = [
    {
      tags: ["WordPress", "Shopify", "AI 官网"],
      title: "先选建站方式，再定页面结构",
      text: "B2B 内容沉淀优先 WordPress，在线交易优先 Shopify，轻量展示可以先做 AI 官网。",
    },
    {
      tags: ["SEO", "Google Ads", "社媒"],
      title: "把流量接进同一套转化路径",
      text: "关键词、广告素材、落地页和询盘入口一起规划，减少只做单点优化的浪费。",
    },
    {
      tags: ["博客", "知识库", "教程"],
      title: "内容资产沉淀到长期入口",
      text: "把教程、FAQ、产品场景和运营复盘做成可搜索、可转发、可持续更新的内容库。",
    },
  ];

  document.querySelectorAll(".mega").forEach((mega, index) => {
    const panel = mega.querySelector(".mega-panel");
    if (!panel || panel.querySelector(".mega-preview")) return;
    const config = configs[index] || configs[0];
    const badges = document.createElement("div");
    badges.className = "mega-badges";
    badges.innerHTML = config.tags.map((tag) => `<span>${tag}</span>`).join("");
    const preview = document.createElement("div");
    preview.className = "mega-preview";
    preview.innerHTML = `<strong>${config.title}</strong><p>${config.text}</p>`;
    panel.appendChild(badges);
    panel.appendChild(preview);
  });
}

function enhanceHomeLikeDemo() {
  const isHome = /\/(?:index\.html)?$/.test(location.pathname) || location.pathname.endsWith("/AI/");
  if (!isHome) return;

  document.body.classList.add("demo-inspired-home");
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const oldOrbit = hero.querySelector(".hero-orbit");
  if (oldOrbit) oldOrbit.remove();

  const stage = document.createElement("div");
  stage.className = "demo-stage reveal";
  stage.innerHTML = `
    <div class="template-console">
      <div class="template-topbar">
        <span>WordPress Template Kits</span>
        <b>iwithfuture.com ecosystem</b>
      </div>
      <div class="template-search">
        <span>搜索外贸网站模板、行业 Demo、建站方案</span>
        <a href="https://demo.iwithfuture.com/" target="_blank" rel="noopener">查看 Demo</a>
      </div>
      <div class="template-tabs">
        <button class="active" type="button">B2B 工厂</button>
        <button type="button">机械设备</button>
        <button type="button">家居建材</button>
        <button type="button">服务公司</button>
      </div>
      <div class="template-grid-mini">
        <a href="https://demo.iwithfuture.com/" target="_blank" rel="noopener" class="template-card-mini">
          <i></i><strong>产品目录型官网</strong><span>适合 B2B 工厂</span>
        </a>
        <a href="https://demo.iwithfuture.com/" target="_blank" rel="noopener" class="template-card-mini">
          <i></i><strong>技术资料型官网</strong><span>适合工业设备</span>
        </a>
        <a href="https://demo.iwithfuture.com/" target="_blank" rel="noopener" class="template-card-mini">
          <i></i><strong>品牌展示型官网</strong><span>适合服务企业</span>
        </a>
      </div>
      <div class="template-metrics">
        <span><b>Learn</b> 博客学习</span>
        <span><b>Demo</b> 模板选型</span>
        <span><b>Build</b> 咨询落地</span>
      </div>
    </div>`;
  hero.appendChild(stage);
  setTimeout(() => stage.classList.add("visible"), 120);

  if (!document.querySelector(".ecosystem-strip")) {
    const strip = document.createElement("section");
    strip.className = "ecosystem-strip";
    strip.innerHTML = `
      <div class="container ecosystem-strip-inner">
        <a href="https://iwithfuture.com/" target="_blank" rel="noopener"><small>01 / Learn</small><b>先看博客教程</b><span>理解外贸建站、Google 工具和运营逻辑</span></a>
        <a href="https://demo.iwithfuture.com/" target="_blank" rel="noopener"><small>02 / Demo</small><b>再选模板方向</b><span>用 Demo 判断行业风格和页面结构</span></a>
        <a href="pages/contact.html"><small>03 / Build</small><b>最后咨询落地</b><span>把模板编号、资料和预算发来确认方案</span></a>
      </div>`;
    hero.insertAdjacentElement("afterend", strip);
  }
}

function enhanceContactFinder() {
  if (!location.pathname.endsWith("/contact.html")) return;
  const hero = document.querySelector(".contact-consult-hero") || document.querySelector(".inner-hero");
  if (!hero || document.querySelector(".consult-finder")) return;

  const finder = document.createElement("section");
  finder.className = "section consult-finder";
  finder.innerHTML = `
    <div class="container finder-shell">
      <div class="finder-panel reveal">
        <span class="section-kicker">Quick Match</span>
        <h2>先用 10 秒判断你更适合哪种建站。</h2>
        <p>选择最接近你当前需求的情况，右侧会给出初步建议。真正报价仍需要根据页面、产品、语言和功能确认。</p>
        <div class="finder-options">
          <button class="finder-option active" type="button" data-plan="wp"><b>B2B 工厂 / 服务商</b><span>产品目录、资料、SEO、询盘</span></button>
          <button class="finder-option" type="button" data-plan="ai"><b>轻量官网展示</b><span>预算有限，先快速上线</span></button>
          <button class="finder-option" type="button" data-plan="shopify"><b>跨境电商 / DTC</b><span>商品、支付、订单和复购</span></button>
          <button class="finder-option" type="button" data-plan="custom"><b>品牌定制官网</b><span>设计差异化和完整交付</span></button>
        </div>
      </div>
      <div class="finder-result reveal">
        <div>
          <span class="section-kicker">Recommendation</span>
          <h3 id="finderTitle">建议优先考虑 WordPress 外贸建站</h3>
          <p id="finderText">如果你有产品目录、项目经验、FAQ、下载资料和长期 SEO 需求，WordPress 更适合做可维护的外贸官网底座。</p>
          <div class="finder-tags" id="finderTags"><span>产品目录</span><span>SEO 内容</span><span>询盘表单</span></div>
        </div>
        <a class="btn btn-primary magnetic" href="mailto:iwithfuture@gmail.com">把需求发到邮箱</a>
      </div>
    </div>`;
  hero.insertAdjacentElement("afterend", finder);

  const plans = {
    wp: ["建议优先考虑 WordPress 外贸建站", "如果你有产品目录、项目经验、FAQ、下载资料和长期 SEO 需求，WordPress 更适合做可维护的外贸官网底座。", ["产品目录", "SEO 内容", "询盘表单"]],
    ai: ["建议先做 AI 官网展示建站", "如果你只是想先有一个品牌展示入口，预算控制在 2000 元起，AI 官网可以先快速上线，再根据反馈升级。", ["快速上线", "轻量展示", "预算友好"]],
    shopify: ["建议后续单独评估 Shopify 独立站", "如果你要在线交易、支付、订单、库存和再营销，Shopify 更适合，但报价需要按商品、支付和运营需求单独评估。", ["在线交易", "商品管理", "再营销"]],
    custom: ["建议考虑定制建站方案", "如果你希望品牌视觉、首页、内页、移动端、SEO 基础和内容结构都更完整，定制建站更适合。", ["品牌设计", "完整页面", "SEO 基础"]],
  };

  finder.querySelectorAll(".finder-option").forEach((button) => {
    button.addEventListener("click", () => {
      finder.querySelectorAll(".finder-option").forEach((item) => item.classList.toggle("active", item === button));
      const plan = plans[button.dataset.plan];
      finder.querySelector("#finderTitle").textContent = plan[0];
      finder.querySelector("#finderText").textContent = plan[1];
      finder.querySelector("#finderTags").innerHTML = plan[2].map((tag) => `<span>${tag}</span>`).join("");
    });
  });

  finder.querySelectorAll(".reveal").forEach((el) => setTimeout(() => el.classList.add("visible"), 80));
}

enhanceMegaMenus();
enhanceHomeLikeDemo();
enhanceContactFinder();
