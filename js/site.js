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
  document.querySelectorAll(".mega").forEach((mega) => {
    const panel = mega.querySelector(".mega-panel");
    if (panel) panel.remove();
    mega.classList.add("mega-compact");
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
          <a class="template-demo-link" href="https://demo.iwithfuture.com/#machinery" target="_blank" rel="noopener">查看 Demo</a>
      </div>
      <div class="template-tabs">
        <button class="active" type="button" data-template-category="machinery">机械设备</button>
        <button type="button" data-template-category="parts">工业零部件</button>
        <button type="button" data-template-category="home">家居建材</button>
        <button type="button" data-template-category="electronics">电子电器</button>
        <button type="button" data-template-category="beauty">美妆个护</button>
        <button type="button" data-template-category="medical">医疗器械</button>
        <button type="button" data-template-category="energy">新能源</button>
        <button type="button" data-template-category="ecommerce">跨境电商</button>
      </div>
        <div class="template-grid-mini">
          <a href="https://live.kitpixel.com/fabrix/template-kit/home/?storefront=envato-elements" target="_blank" rel="noopener" class="template-card-mini">
            <span class="template-thumb"><img src="https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/654787959/fabrix-cover.jpg?w=433&amp;cf_fit=scale-down&amp;q=85&amp;format=auto&amp;s=839e9ec25e43532a15434c219a62662f7f61932f4bb69a0e226d7e098e22e9a0" alt="机械设备官网 Demo"></span><strong>机械设备官网 Demo</strong><span>适合设备工厂和出口制造商</span>
          </a>
          <a href="https://templatekits.c-kav.com/demo2/zoi-kit/?storefront=envato-elements" target="_blank" rel="noopener" class="template-card-mini">
            <span class="template-thumb"><img src="https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/347074086/cover-image.jpg?w=433&amp;cf_fit=scale-down&amp;q=85&amp;format=auto&amp;s=980c5707bcf32ac1b5455492184380f214f862621c903912ec71f0e833e3df7b" alt="产品目录 + 询盘"></span><strong>产品目录 + 询盘</strong><span>展示设备分类、参数和应用场景</span>
          </a>
          <a href="https://www.roofixer.oxacor.com/?storefront=envato-elements" target="_blank" rel="noopener" class="template-card-mini">
            <span class="template-thumb"><img src="https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/430395189/Cover%20Image.jpg?w=433&amp;cf_fit=scale-down&amp;q=85&amp;format=auto&amp;s=fec4381fc35b1e507f5174df8df4d9f9b559ba42721b76fedaf5bd6723c46f1c" alt="资料下载型页面"></span><strong>资料下载型页面</strong><span>承接规格书、案例和技术资料</span>
          </a>
        </div>
      <div class="template-metrics">
        <span><b>Learn</b> 博客学习</span>
        <span><b>Demo</b> 模板选型</span>
        <span><b>Build</b> 咨询落地</span>
      </div>
    </div>`;
  hero.appendChild(stage);
  const templateData = {
    machinery: [
      ["机械设备官网 Demo", "适合设备工厂和出口制造商", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/654787959/fabrix-cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=839e9ec25e43532a15434c219a62662f7f61932f4bb69a0e226d7e098e22e9a0", "https://live.kitpixel.com/fabrix/template-kit/home/?storefront=envato-elements"],
      ["产品目录 + 询盘", "展示设备分类、参数和应用场景", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/347074086/cover-image.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=980c5707bcf32ac1b5455492184380f214f862621c903912ec71f0e833e3df7b", "https://templatekits.c-kav.com/demo2/zoi-kit/?storefront=envato-elements"],
      ["资料下载型页面", "承接规格书、案例和技术资料", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/430395189/Cover%20Image.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=fec4381fc35b1e507f5174df8df4d9f9b559ba42721b76fedaf5bd6723c46f1c", "https://www.roofixer.oxacor.com/?storefront=envato-elements"],
    ],
    parts: [
      ["工业零部件官网 Demo", "适合配件、五金和加工件供应商", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/397940166/Ketok-Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=8300a9089acaf75d7b36cb4aba9a6cf7e56f3c17ae048140f5f45e0cde1926cd", "https://gajean.com/ketok/template-kit/homepage/?storefront=envato-elements"],
      ["参数筛选型目录", "突出型号、材质、规格和兼容性", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/351017006/cover%20Gadgetin.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=2fa810cd637a2967c4329d86b2d5f639d5389776056395eec37b7e7a92f0ac4b", "https://templatekit.brothergrounds.com/gadgetin/?storefront=envato-elements"],
      ["B2B 询价型页面", "让采购商快速提交图纸和需求", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/309504244/2340x1560.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=0e41faae051d0cbd7ad99aba10246f5482a06cdda9a6f787174e9701aa01c106", "https://elementorpress.com/templatekit-pro/layout03/?storefront=envato-elements"],
    ],
    home: [
      ["家居建材官网 Demo", "适合建材、家具和装饰材料品牌", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/654646238/aestona.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=5da10c38a3dca9781a7f09bd49a1303142551ad974c5a8345d9d8f8e0aabcc4e", "https://demo.zaderonstudio.com/aestona/?storefront=envato-elements"],
      ["项目案例型页面", "展示空间效果、安装场景和工程案例", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/467814402/Elementor%20Template%20Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=ed8f3822d3639982f34e15ae97185cda49026d76ace837adeb9679715958cb7e", "https://kit.nirmanavisual.com/archidream/template-kit/home/?storefront=envato-elements"],
      ["产品系列目录", "适合颜色、尺寸、材质多的产品线", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/636785822/Rihome%20Elementor%20Cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=01527e52b3031713a1ca31822ffef5eee2c2baf436c34e05c107b7edb98c7f1b", "https://kits.rometheme.net/rihome/?storefront=envato-elements"],
    ],
    electronics: [
      ["电子电器官网 Demo", "适合电子产品、电器和智能硬件", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/636491335/Occidensential%20-%20Cover%20Template%20Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=16221a06033e74f18b48712e9f5c9a1da8a4b714b33b0c08b8f2fd69bbd9af50", "https://mydemo.occidensential.com/insighto/?storefront=envato-elements"],
      ["技术规格页面", "展示认证、参数、应用和下载资料", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/635400361/Cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=e42d9b5c5b6aaf833a956880f524d7e0be7325e4f6cb0ca112fbf4ab48413d48", "https://askproject.net/flynn/home/?storefront=envato-elements"],
      ["经销商询盘入口", "承接批发、代理和 OEM/ODM 需求", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/465785323/Cover%20image%20Pecalang%20-%20Elementor%20Template%20Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=c6b65d1fe97a8bd5c6c2c3340211ba50cd8e59a076a8ab4b626ee5d2fcb6a6c5", "https://kit.nirmanavisual.com/pecalang/template-kit/home1/?storefront=envato-elements"],
    ],
    beauty: [
      ["美妆个护官网 Demo", "适合护肤、美妆、个护和 DTC 品牌", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/633180894/Syantik%20Elementor%20Cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=88fd50ecedfc35bbe8536de2241415c6b3b4671e00529b3e1f74a58e242690c0", "https://syantik.tokotema.xyz/template-kit/home/?storefront=envato-elements"],
      ["品牌故事页面", "突出视觉、功效、成分和用户信任", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/446256112/cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=353f3978a318af17be109cd5ed562efcaa29c8d3a09610ff651eb144b66d50f8", "https://themesflat.co/kitmellis/template-kit/home-01/?storefront=envato-elements"],
      ["Shopify 转化入口", "适合后续接入商品、支付和复购", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/383217001/cover.png?w=433&cf_fit=scale-down&q=85&format=auto&s=7fed53b747046a6804ce3a684528a5a403ef9233ee453ad5e4d5e0aef5b770e8", "https://templatekits.themewarrior.com/cantiq/template-kit/homepage/?storefront=envato-elements"],
    ],
    medical: [
      ["医疗器械官网 Demo", "适合设备、耗材和医疗产品出口", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/431851040/preview%20copy.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=5461829be2476fae15102ec8733fa1281436d814d4798eff840c22e802d4211e", "https://kitpro.site/colabs/?storefront=envato-elements"],
      ["认证资料页面", "突出 CE、FDA、说明书和技术文档", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/496276959/cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=7e64fb13fa7adcbf9eb3a065f0469ce0e370a802cd37301118eae10df5339675", "https://themesflat.com/laboixkit/template-kit/home-01/?storefront=envato-elements"],
      ["专业询盘路径", "适合经销商、医院和采购商咨询", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/482617293/cover.png?w=433&cf_fit=scale-down&q=85&format=auto&s=c609071d83c8a80a7dfae5f3f759ae4e5fa3b8aeb08cbf23eccb191459012cf0", "https://web.rabonadev.com/udhun/template-kit/home/?storefront=envato-elements"],
    ],
    energy: [
      ["新能源官网 Demo", "适合储能、光伏、电池和充电产品", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/640642222/Coverimage-Solarize.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=1450b2e17cf18dcca1220fe9e904e5d8e0eb70406d068a59622def28ec8f5a8c", "https://askit.dextheme.net/solarize/?storefront=envato-elements"],
      ["解决方案页面", "按应用场景展示系统能力和参数", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/654732977/Cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=3f1a79afbe64cffc252d31d4ec469cf26d56c337d5c80f412ad756f8de48acbd", "https://templates.casloop.net/solarism/template-kit/home/?storefront=envato-elements"],
      ["项目案例页面", "承接工程案例、下载资料和询盘", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/633660695/main%20preview.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=80f8117e9e5013a4f201e458c146b2962ee62769b554e09987bd28acbcda175e", "https://demokit.creativemox.com/sunara/?storefront=envato-elements"],
    ],
    ecommerce: [
      ["跨境电商独立站 Demo", "适合 DTC 品牌和在线销售", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/335130366/cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=663073e1c9ba825b5045d237c333dbb99c81f258645edf3c266f6f01f48299b3", "https://templatekit.jegtheme.com/kramic/?storefront=envato-elements"],
      ["产品转化页面", "突出卖点、评价、套装和再营销", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/420056802/Cover-Image-vegetta.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=d04dd3628871bc05a13acb6ec7082660476990e147df45f06e7c1c77bacbdc07", "https://ibeydesign.com/vegetta/?storefront=envato-elements"],
      ["Shopify 店铺入口", "适合支付、订单、库存和复购", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/349350615/cover.png?w=433&cf_fit=scale-down&q=85&format=auto&s=0494affd62721c3aa52eca19672d5bb4de73244b34ed00e1e0ce1d4df76fcb9e", "https://templatekits.themewarrior.com/bookchimp/template-kit/homepage/?storefront=envato-elements"],
    ],
  };

  const templateCategoryLinks = {
    machinery: "https://demo.iwithfuture.com/#machinery",
    parts: "https://demo.iwithfuture.com/#parts",
    home: "https://demo.iwithfuture.com/#building",
    electronics: "https://demo.iwithfuture.com/#electronics",
    beauty: "https://demo.iwithfuture.com/#beauty",
    medical: "https://demo.iwithfuture.com/#medical",
    energy: "https://demo.iwithfuture.com/#energy",
    ecommerce: "https://demo.iwithfuture.com/#ecommerce",
  };

  const renderTemplateCards = (category) => {
    const cards = templateData[category] || templateData.machinery;
    const grid = stage.querySelector(".template-grid-mini");
    const demoLink = stage.querySelector(".template-demo-link");
    if (demoLink) demoLink.href = templateCategoryLinks[category] || "https://demo.iwithfuture.com/";
    grid.innerHTML = cards
      .map(([title, desc, image, link]) => `<a href="${link || templateCategoryLinks[category] || "https://demo.iwithfuture.com/"}" target="_blank" rel="noopener" class="template-card-mini"><span class="template-thumb"><img src="${image}" alt="${title}" loading="lazy"></span><strong>${title}</strong><span>${desc}</span></a>`)
      .join("");
  };

  stage.querySelectorAll("[data-template-category]").forEach((button) => {
    button.addEventListener("click", () => {
      stage.querySelectorAll("[data-template-category]").forEach((item) => item.classList.toggle("active", item === button));
      renderTemplateCards(button.dataset.templateCategory);
    });
  });

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
