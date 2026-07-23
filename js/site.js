document.documentElement.classList.add("has-js");

const header = document.querySelector(".site-header");
const progress = document.querySelector(".progress");
const heroBg = document.querySelector(".hero-bg");
const cursorLight = document.querySelector(".cursor-light");
const mobileToggle = document.querySelector(".mobile-toggle");
const backTop = document.getElementById("backTop");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateScrollState() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  if (progress) progress.style.width = `${pct}%`;
  if (header) header.classList.toggle("scrolled", window.scrollY > 18);
  if (heroBg && !reducedMotion) heroBg.style.transform = `translateY(${window.scrollY * 0.04}px)`;
}

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

window.addEventListener("mousemove", (event) => {
  if (reducedMotion) return;
  if (cursorLight) {
    cursorLight.style.left = `${event.clientX}px`;
    cursorLight.style.top = `${event.clientY}px`;
  }
});

if (mobileToggle) {
  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenu) {
    mobileMenu.id ||= "mobile-navigation";
    mobileToggle.setAttribute("aria-controls", mobileMenu.id);
  }
  mobileToggle.setAttribute("aria-expanded", "false");
  mobileToggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    const open = document.body.classList.contains("menu-open");
    mobileToggle.setAttribute("aria-expanded", String(open));
    mobileToggle.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
  });
}

document.querySelector(".mobile-menu")?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    document.body.classList.remove("menu-open");
    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-label", "打开菜单");
    }
  }
});

document.querySelectorAll(".nav-item").forEach((item, index) => {
  const trigger = item.querySelector(".nav-trigger");
  const mega = item.querySelector(".mega");
  const syncExpanded = () => trigger?.setAttribute("aria-expanded", String(item.classList.contains("mega-open")));
  if (trigger && mega) {
    mega.id ||= `mega-menu-${index + 1}`;
    trigger.setAttribute("aria-controls", mega.id);
    trigger.setAttribute("aria-expanded", "false");
  }
  item.addEventListener("mouseenter", () => {
    item.classList.add("mega-open");
    syncExpanded();
  });
  item.addEventListener("mouseleave", () => {
    item.classList.remove("mega-open");
    syncExpanded();
  });

  if (trigger) {
    trigger.addEventListener("click", (event) => {
      if (!item.querySelector(".mega")) return;
      event.preventDefault();
      document.querySelectorAll(".nav-item.mega-open").forEach((open) => {
        if (open !== item) {
          open.classList.remove("mega-open");
          open.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
        }
      });
      item.classList.toggle("mega-open");
      syncExpanded();
    });
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    document.querySelectorAll(".nav-item.mega-open").forEach((item) => {
      item.classList.remove("mega-open");
      item.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
    });
    if (document.body.classList.contains("menu-open")) {
      document.body.classList.remove("menu-open");
      mobileToggle?.setAttribute("aria-expanded", "false");
      mobileToggle?.setAttribute("aria-label", "打开菜单");
      mobileToggle?.focus();
    }
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

document.querySelectorAll(".tabs").forEach((shell, shellIndex) => {
  const buttons = Array.from(shell.querySelectorAll(".tab-btn"));
  const panels = Array.from(shell.querySelectorAll(".tab-panel"));
  const buttonWrap = shell.querySelector(".tab-buttons");
  buttonWrap?.setAttribute("role", "tablist");
  buttons.forEach((button, buttonIndex) => {
    const id = button.dataset.tab;
    const panel = panels.find((item) => item.dataset.panel === id);
    button.id ||= `tab-${shellIndex + 1}-${buttonIndex + 1}`;
    if (panel) {
      panel.id ||= `tab-panel-${shellIndex + 1}-${buttonIndex + 1}`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", button.id);
      button.setAttribute("aria-controls", panel.id);
    }
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(button.classList.contains("active")));
    button.setAttribute("tabindex", button.classList.contains("active") ? "0" : "-1");
  button.addEventListener("click", () => {
      buttons.forEach((btn) => {
        const active = btn === button;
        btn.classList.toggle("active", active);
        btn.setAttribute("aria-selected", String(active));
        btn.setAttribute("tabindex", active ? "0" : "-1");
      });
      panels.forEach((item) => item.classList.toggle("active", item.dataset.panel === id));
    });
  });
});

document.querySelectorAll(".faq-item").forEach((item, index) => {
  const question = item.querySelector(".faq-q");
  const answer = item.querySelector(".faq-a");
  const sync = () => {
    const active = item.classList.contains("active");
    if (answer) {
      answer.style.maxHeight = active ? `${answer.scrollHeight}px` : "0px";
      answer.setAttribute("aria-hidden", String(!active));
    }
    question?.setAttribute("aria-expanded", String(active));
  };
  if (question) {
    question.id ||= `faq-question-${index + 1}`;
    if (answer) {
      answer.id ||= `faq-answer-${index + 1}`;
      answer.setAttribute("role", "region");
      answer.setAttribute("aria-labelledby", question.id);
      question.setAttribute("aria-controls", answer.id);
    }
    question.addEventListener("click", () => {
      item.classList.toggle("active");
      sync();
    });
  }
  sync();
});

document.querySelectorAll("[data-copy-value]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copyValue || "";
    const feedback = button.querySelector("small");
    try {
      await navigator.clipboard.writeText(value);
      if (feedback) feedback.textContent = `已复制：${value}`;
      window.dataLayer?.push({ event: "contact_copy", contact_method: "wechat" });
    } catch {
      if (feedback) feedback.textContent = `请手动复制：${value}`;
    }
  });
});

const consultationForm = document.getElementById("consultation-form");
if (consultationForm) {
  consultationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(consultationForm);
    const labels = {
      name: "姓名或称呼",
      email: "联系邮箱",
      company: "公司或品牌",
      website: "现有网站",
      service: "咨询服务",
      market: "目标市场",
      message: "主要问题",
    };
    const lines = Array.from(data.entries())
      .filter(([, value]) => String(value).trim())
      .map(([key, value]) => `${labels[key] || key}：${String(value).trim()}`);
    const subject = `网站项目咨询 - ${String(data.get("company") || data.get("name") || "新咨询").trim()}`;
    const body = `${lines.join("\n")}\n\n来源页面：${window.location.href}`;
    const notice = consultationForm.querySelector(".form-notice");
    if (notice) {
      notice.hidden = false;
      notice.textContent = "咨询内容已整理完成，正在打开邮件工具。请确认内容后发送。";
    }
    window.dataLayer?.push({ event: "consultation_email_open", service: data.get("service") || "" });
    window.location.href = `mailto:iwithfuture@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

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
      text = "方案评估建议：先确认页面数量、语言版本、产品资料和询盘追踪，再确定交付范围。";
    } else if (tool.includes("budget")) {
      text = "投放评估建议：先确认目标市场、关键词竞争、素材准备和落地页承接，再规划测试节奏。";
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
      <div class="template-actionbar">
        <span>\u9009\u62e9\u884c\u4e1a Demo\uff0c\u67e5\u770b\u9002\u5408\u4f60\u7684\u9875\u9762\u7ed3\u6784</span>
        <a class="template-demo-link" href="https://demo.iwithfuture.com/#machinery" target="_blank" rel="noopener">\u6253\u5f00 Demo \u5e93</a>
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
      .map(([title, desc, image, link]) => '<a href="' + (link || templateCategoryLinks[category] || "https://demo.iwithfuture.com/") + '" target="_blank" rel="noopener" class="template-card-mini"><span class="template-thumb"><img src="' + image + '" alt="' + title + '" loading="lazy"></span><strong>' + title + '</strong><span>' + desc + '</span></a>')
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
        <a href="pages/contact.html"><small>03 / Build</small><b>最后咨询落地</b><span>把模板编号和资料发来确认方案</span></a>
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
        <p>选择最接近你当前需求的情况，右侧会给出初步建议。真正方案仍需要根据页面、产品、语言和功能确认。</p>
        <div class="finder-options">
          <button class="finder-option active" type="button" data-plan="wp"><b>B2B 工厂 / 服务商</b><span>产品目录、资料、SEO、询盘</span></button>
          <button class="finder-option" type="button" data-plan="ai"><b>轻量官网展示</b><span>资料轻量，先快速上线</span></button>
          <button class="finder-option" type="button" data-plan="shopify"><b>跨境电商 / DTC</b><span>商品、支付、订单和复购</span></button>
          <button class="finder-option" type="button" data-plan="custom"><b>品牌定制官网</b><span>设计差异化和完整交付</span></button>
        </div>
      </div>
    </div>`;
  hero.insertAdjacentElement("afterend", finder);

  finder.querySelectorAll(".finder-option").forEach((button) => {
    button.addEventListener("click", () => {
      finder.querySelectorAll(".finder-option").forEach((item) => item.classList.toggle("active", item === button));
    });
  });

  finder.querySelectorAll(".reveal").forEach((el) => setTimeout(() => el.classList.add("visible"), 80));
}

function enhanceHomeDecisionGuide() {
  const isHome = /\/(?:index\.html)?$/.test(location.pathname) || location.pathname.endsWith("/AI/");
  if (!isHome || document.querySelector(".home-decision-guide")) return;
  const target = document.querySelector(".ecosystem-strip") || document.querySelector(".hero");
  if (!target) return;

  const section = document.createElement("section");
  section.className = "section home-decision-guide";
  section.innerHTML = `
    <div class="container">
      <div class="section-head reveal">
        <div>
          <span class="section-kicker">Choose Your Build</span>
          <h2>先判断建站方式，再决定页面结构。</h2>
        </div>
        <p>不用一开始就纠结技术名词。先看你的目标是展示、沉淀内容，还是在线交易，再选择 AI 官网、WordPress 或 Shopify。</p>
      </div>
      <div class="decision-grid">
        <a class="decision-card reveal" href="pages/ai-website.html">
          <small>按需求评估</small>
          <h3>AI 官网展示建站</h3>
          <p>适合个人、SOHO、小型企业快速上线品牌展示页，先验证方向，不做复杂系统。</p>
          <span>快速上线 / 轻量展示 / 易于启动</span>
        </a>
        <a class="decision-card reveal featured" href="pages/wordpress-website.html">
          <small>推荐长期运营</small>
          <h3>WordPress 外贸建站</h3>
          <p>适合 B2B 工厂、工业品、服务企业，把产品目录、技术资料、FAQ 和 SEO 内容长期沉淀。</p>
          <span>内容运营 / SEO 增长 / 后台可维护</span>
        </a>
        <a class="decision-card reveal" href="pages/shopify-website.html">
          <small>电商交易型</small>
          <h3>Shopify 独立站</h3>
          <p>适合 DTC 品牌和跨境电商，重点处理商品、支付、订单、评价和再营销。</p>
          <span>在线交易 / 商品管理 / 复购转化</span>
        </a>
      </div>
    </div>`;
  target.insertAdjacentElement("afterend", section);
  section.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
    setTimeout(() => el.classList.add("visible"), 80);
  });
}

function enhanceServiceConversionBlocks() {
  const slug = location.pathname.split("/").pop();
  const serviceMap = {
    "ai-website.html": {
      name: "AI 官网展示建站",
      fit: "想快速上线展示型官网、先控制交付范围、资料还需要边做边整理。",
      notFit: "需要复杂后台、多语言内容矩阵、长期 SEO 内容运营或在线交易系统。",
      deliver: "首页、公司介绍、服务/产品展示、案例或优势模块、联系方式、基础移动端适配。",
      prepare: "行业、参考网站、公司介绍、核心服务、联系方式和上线时间。"
    },
    "wordpress-website.html": {
      name: "WordPress 外贸建站",
      fit: "B2B 工厂、设备、零部件、服务企业，需要产品目录、资料下载、FAQ、博客和长期 SEO。",
      notFit: "核心目标是在线下单、支付、库存、订单管理和电商复购。",
      deliver: "网站结构规划、页面设计、WordPress 后台、产品/内容栏目、询盘入口、基础 SEO。",
      prepare: "产品分类、核心产品、目标市场、参考 Demo、现有资料、是否需要多语言。"
    },
    "shopify-website.html": {
      name: "Shopify 独立站",
      fit: "DTC 品牌、跨境电商、需要商品页、支付、订单、评价、优惠和再营销。",
      notFit: "只做 B2B 目录展示、长篇内容 SEO 或资料型官网时，WordPress 通常更合适。",
      deliver: "店铺结构、首页、商品页、集合页、购物流程、基础追踪和转化模块。",
      prepare: "商品数量、SKU、支付方式、物流区域、参考店铺、品牌素材和运营计划。"
    }
  };
  const data = serviceMap[slug];
  if (!data || document.querySelector(".service-conversion-block")) return;
  const hero = document.querySelector(".inner-hero");
  if (!hero) return;

  const section = document.createElement("section");
  section.className = "section service-conversion-block";
  section.innerHTML = `
    <div class="container service-conversion-shell">
      <div class="service-conversion-head reveal">
        <span class="section-kicker">Decision Snapshot</span>
        <h2>${data.name}，先看这四点再决定。</h2>
        <p>这部分是为了让客户更快判断自己是否适合这个方案，也方便咨询时一次性说清楚需求。</p>
      </div>
      <div class="service-conversion-grid">
        <article class="conversion-card reveal"><small>适合谁</small><h3>适合选择</h3><p>${data.fit}</p></article>
        <article class="conversion-card reveal"><small>不适合谁</small><h3>暂时不要选</h3><p>${data.notFit}</p></article>
        <article class="conversion-card reveal"><small>交付内容</small><h3>会交付什么</h3><p>${data.deliver}</p></article>
        <article class="conversion-card reveal"><small>咨询资料</small><h3>你需要准备</h3><p>${data.prepare}</p></article>
      </div>
      <div class="service-conversion-cta reveal">
        <span>不确定该选哪一种？把行业、产品数量和参考网站发来，我可以先帮你判断方向。</span>
        <a class="btn btn-primary magnetic" href="contact.html">咨询建站方案</a>
      </div>
    </div>`;
  hero.insertAdjacentElement("afterend", section);
  section.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
    setTimeout(() => el.classList.add("visible"), 80);
  });
}

function enhanceLicensedTrustBlocks() {
  const slug = location.pathname.split("/").pop();
  if (!["wordpress-website.html", "pricing.html", "about.html"].includes(slug) || document.querySelector(".license-trust-panel")) return;
  const anchor = document.querySelector(".licensed-plugins") || document.querySelector(".licensed-assurance") || document.querySelector(".inner-hero");
  if (!anchor) return;

  const section = document.createElement("section");
  section.className = "section section-soft license-trust-panel";
  section.innerHTML = `
    <div class="container trust-panel-shell">
      <div class="trust-panel-copy reveal">
        <span class="section-kicker">Licensed & Maintainable</span>
        <h2>不做破解版主题和插件堆出来的便宜站。</h2>
        <p>低价建站最常见的坑，是用破解版主题、来路不明插件或无法升级的页面模板。上线时看起来便宜，后期可能出现安全漏洞、功能失效、无法更新、无法迁移，甚至网站被挂马。</p>
      </div>
      <div class="trust-panel-grid">
        <article class="trust-chip reveal"><b>正版授权</b><span>优先使用已购买或正规授权的主题、插件和工具。</span></article>
        <article class="trust-chip reveal"><b>可维护</b><span>网站上线后仍可更新、备份、排查问题和继续扩展。</span></article>
        <article class="trust-chip reveal"><b>可交接</b><span>后台结构、插件用途和维护建议会讲清楚，避免后期被锁死。</span></article>
      </div>
    </div>`;
  anchor.insertAdjacentElement("afterend", section);
  section.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
    setTimeout(() => el.classList.add("visible"), 80);
  });
}

function enhanceCustomerFacingTemplates() {
  const slug = location.pathname.split("/").pop() || "index.html";
  if (slug === "index.html" || slug === "") return;

  const dataBySlug = {
    "ai-website.html": ["AI 官网展示建站", "适合先把品牌、服务和联系方式快速上线，用轻量页面承接客户搜索、名片和社媒访问。", "轻量展示", "快速上线", "后续可升级"],
    "wordpress-website.html": ["WordPress 外贸建站", "适合 B2B 工厂、服务企业和内容沉淀型网站，把产品目录、资料下载、FAQ 和 SEO 内容长期维护起来。", "长期运营", "内容沉淀", "可维护后台"],
    "shopify-website.html": ["Shopify 独立站建设", "适合需要在线销售、支付、订单和复购的 DTC 品牌，把商品页、广告落地页和再营销连成转化路径。", "在线交易", "商品转化", "复购运营"],
    "custom-development.html": ["定制开发建站", "适合对性能、交互、后台和业务流程有明确要求的项目，用定制结构解决模板无法承接的问题。", "定制功能", "高性能", "可扩展"],
    "multilingual-website.html": ["多语言外贸网站", "适合需要英语、小语种和不同国家市场页面的企业，让不同地区客户看到本地化内容和清晰询盘入口。", "多市场", "本地化", "hreflang"],
    "landing-pages.html": ["广告落地页设计", "适合 Google Ads、Facebook Ads 和活动投放，把单一产品或服务的卖点、信任和转化动作压缩到一页里。", "广告转化", "快速测试", "线索收集"],
    "speed-security.html": ["网站速度与安全优化", "适合已经上线但加载慢、后台不稳或安全风险较高的网站，先保证客户能顺畅访问，再谈转化。", "速度体验", "安全维护", "稳定访问"],
    "website-maintenance.html": ["网站维护与增长托管", "适合网站已经上线但缺少持续更新、备份、数据复盘和内容优化的企业，让网站保持可用、可改、可增长。", "持续维护", "月度复盘", "内容更新"],
    "seo.html": ["Google SEO 优化", "适合希望用自然搜索持续获得询盘的外贸企业，从关键词、技术、内容和外链四个方向提升可见度。", "自然流量", "关键词布局", "内容资产"],
    "b2b-organic-growth.html": ["B2B 自然流量运营", "适合已有网站、产品专业且希望持续积累海外自然流量和有效询盘的 B2B 企业。", "网站与增长阶段", "关键词和承接页面", "内容、数据与询盘"],
    "technical-seo.html": ["技术 SEO", "适合网站收录差、速度慢、结构混乱或页面体验不足的情况，先让搜索引擎能正确抓取和理解网站。", "索引抓取", "速度体验", "结构化数据"],
    "content-seo.html": ["内容 SEO", "适合想用文章、指南、FAQ 和对比页承接买家问题的企业，把内容做成可搜索的询盘入口。", "买家问题", "内容集群", "长期排名"],
    "link-building.html": ["外链与品牌曝光", "适合已经有基础内容和产品页的网站，通过高质量曝光、品牌提及和行业内容提升信任。", "品牌信任", "外链质量", "行业曝光"],
    "google-sem.html": ["Google SEM 投放", "适合需要更快获取询盘的企业，用关键词、广告组、落地页和转化追踪控制预算效率。", "关键词广告", "落地页", "转化追踪"],
    "google-ads-landing.html": ["Google Ads 落地页", "适合广告点击成本较高、转化不稳定的账户，把用户点击后的页面说服力做扎实。", "广告承接", "页面说服", "表单转化"],
    "facebook-ads.html": ["Facebook / Instagram 投流", "适合用视觉素材、兴趣人群和再营销获客的品牌或产品，用素材测试找到可放大的组合。", "素材测试", "像素事件", "再营销"],
    "social-media.html": ["全渠道社媒运营", "适合希望在 LinkedIn、YouTube、Facebook 和 Instagram 持续建立信任的外贸企业。", "内容节奏", "品牌露出", "线索回流"],
    "linkedin-operation.html": ["LinkedIn 社媒运营", "适合 B2B 企业接触采购、老板、工程师和渠道商，用专业内容建立长期信任。", "B2B 决策人", "专业内容", "私域跟进"],
    "youtube-operation.html": ["YouTube 内容运营", "适合产品需要演示、安装、案例或教程的企业，用视频降低客户理解成本。", "视频演示", "搜索曝光", "信任建立"],
    "conversion-optimization.html": ["转化率优化 CRO", "适合有访问但询盘少的网站，逐步优化首屏、信任、表单、按钮和落地页路径。", "询盘质量", "页面测试", "转化提升"],
    "blog.html": ["博客中心", "适合把外贸建站、SEO、广告和运营经验整理成可持续访问的内容入口。", "教程内容", "经验沉淀", "搜索入口"],
    "knowledge-base.html": ["外贸建站知识库", "适合系统查看建站、SEO、广告、社媒和内容运营方法，帮助客户先判断方向。", "系统学习", "方案判断", "长期更新"],
    "q-and-a.html": ["问答中心", "适合把客户常问问题做成清晰答案，减少沟通成本，也增加搜索覆盖。", "常见问题", "快速理解", "搜索覆盖"],
    "video-tutorials.html": ["实操教程中心", "适合通过视频理解建站、工具和运营流程，把复杂步骤变得更容易执行。", "视频教程", "工具演示", "步骤拆解"],
    "downloads.html": ["资源下载中心", "适合下载建站清单、资料模板和运营表格，把准备工作提前做清楚。", "资料清单", "模板下载", "准备更快"],
    "blog-wordpress.html": ["WordPress 建站教程", "适合想了解 WordPress 外贸网站结构、主题、插件和后期维护逻辑的客户。", "WordPress", "网站结构", "后期维护"],
    "blog-shopify.html": ["Shopify 独立站教程", "适合想了解 Shopify 商品页、支付、应用、广告承接和复购运营的客户。", "Shopify", "商品页", "复购运营"],
    "blog-seo.html": ["Google SEO 教程", "适合想理解关键词、技术 SEO、内容 SEO 和外链策略如何配合的客户。", "SEO 教程", "关键词", "内容策略"],
    "blog-ads.html": ["广告投放教程", "适合想了解 Google Ads、Facebook Ads、落地页和转化追踪关系的客户。", "广告投放", "落地页", "转化追踪"],
    "blog-ai-tools.html": ["AI 外贸工具教程", "适合想用 AI 提升建站、内容、客服和运营效率的客户。", "AI 工具", "内容效率", "运营辅助"],
    "process.html": ["服务流程", "适合想在合作前了解沟通、报价、资料准备、设计开发、上线和维护边界的客户。", "合作步骤", "交付边界", "上线维护"],
    "pricing.html": ["方案咨询", "适合先了解不同建站方式的服务范围，再根据页面数量、功能、资料和运营要求确认方案。", "服务范围", "交付边界", "按需评估"],
    "about.html": ["关于吾日三省吾身", "适合了解我为什么做外贸建站、如何看待网站运营，以及能提供哪些长期支持。", "建站经验", "长期运营", "可信合作"],
    "contact.html": ["咨询建站方案", "适合把行业、参考网站和当前问题一次说清楚，我会先帮你判断更适合哪种建站方式。", "需求判断", "方案建议", "邮件沟通"]
  };

  const h1 = document.querySelector("h1");
  const fallbackTitle = h1 ? h1.textContent.trim() : "这个页面";
  const data = dataBySlug[slug] || [fallbackTitle, "这个页面会帮你判断当前方案是否适合自己的业务，并把下一步需要准备的资料讲清楚。", "业务判断", "页面结构", "咨询转化"];
  const [titleText, summary, tagA, tagB, tagC] = data;
  document.body.classList.add("customer-facing-page");

  const heroPanel = document.querySelector(".inner-hero .hero-panel");
  if (heroPanel && !document.body.classList.contains("industry-page-enhanced")) {
    heroPanel.innerHTML = `
      <h4>客户能先判断什么</h4>
      <ul>
        <li>${tagA}是否符合当前阶段</li>
        <li>${tagB}需要准备哪些资料</li>
        <li>${tagC}如何连接询盘或成交</li>
        <li>是否值得进一步咨询方案</li>
      </ul>`;
  }

  const growthSection = Array.from(document.querySelectorAll(".section")).find((section) => {
    const kicker = section.querySelector(".section-kicker");
    return kicker && kicker.textContent.trim().toLowerCase() === "growth system";
  });
  if (growthSection && !document.body.classList.contains("industry-page-enhanced")) {
    const title = growthSection.querySelector(".section-head h2");
    const intro = growthSection.querySelector(".section-head p");
    const cards = growthSection.querySelectorAll(".card");
    if (title) title.textContent = `${titleText}要先解决客户为什么继续看下去。`;
    if (intro) intro.textContent = summary;
    const cardContent = [
      ["先判断是否适合", `把${tagA}、目标客户和当前阶段讲清楚，让客户先知道这个方案是不是为自己准备的。`],
      ["再整理页面信息", `围绕${tagB}组织标题、栏目、证明材料和常见问题，减少客户来回确认基础信息。`],
      ["最后引导下一步", `把${tagC}、联系入口和后续动作放到合适位置，让客户知道该怎么继续沟通。`],
    ];
    cards.forEach((card, index) => {
      const item = cardContent[index];
      if (!item) return;
      const cardTitle = card.querySelector("h3");
      const cardText = card.querySelector("p");
      if (cardTitle) cardTitle.textContent = item[0];
      if (cardText) cardText.textContent = item[1];
    });
  }

  const executionSection = Array.from(document.querySelectorAll(".section")).find((section) => {
    const kicker = section.querySelector(".section-kicker");
    return kicker && kicker.textContent.trim().toLowerCase() === "execution map";
  });
  if (executionSection && !document.body.classList.contains("industry-page-enhanced")) {
    const heading = executionSection.querySelector("h2");
    if (heading) heading.textContent = `${titleText}落地时，按这四步推进。`;
    const items = executionSection.querySelectorAll(".feature-item, .process-item");
    const steps = [
      ["确认目标与边界", `先确认你的行业、目标市场和当前资料，避免一开始就做成不适合客户的页面。`],
      ["整理内容与结构", `把${tagA}、${tagB}和客户常问问题整理成页面结构，保证客户能快速找到重点。`],
      ["设置转化入口", `根据${tagC}设计按钮、表单、邮箱、下载或咨询入口，让访问者有明确下一步。`],
      ["上线后复盘优化", "根据访问、点击、询盘和搜索数据，持续调整页面内容、CTA 和后续运营重点。"],
    ];
    items.forEach((item, index) => {
      const step = steps[index];
      if (!step) return;
      const itemTitle = item.querySelector("b, h3");
      const itemText = item.querySelector("span, p");
      if (itemTitle) itemTitle.textContent = step[0];
      if (itemText) itemText.textContent = step[1];
    });
  }

  document.querySelectorAll(".section-head").forEach((head) => {
    const kicker = head.querySelector(".section-kicker");
    const title = head.querySelector("h2");
    const intro = head.querySelector("p");
    if (!kicker || !title) return;
    if (kicker.textContent.trim().toLowerCase() === "related" && title.textContent.includes("你可能还需要")) {
      title.textContent = "继续查看这些相关内容，帮你把方案判断完整。";
      if (intro) intro.textContent = "如果你还不确定该先做网站、SEO、广告还是社媒，可以从这些页面继续对照自己的阶段。";
    }
  });

  document.querySelectorAll(".cta").forEach((cta) => {
    const ctaTitle = cta.querySelector("h2");
    const ctaText = cta.querySelector("p");
    if (ctaTitle && ctaTitle.textContent.includes("先做一次网站增长诊断")) ctaTitle.textContent = "把你的行业和参考网站发来，先判断方向。";
    if (ctaText && ctaText.textContent.includes("告诉我们你的网站")) ctaText.textContent = "不用一开始就准备完整需求。先说清你的产品、目标市场和想参考的网站，我会帮你判断更适合哪种页面结构和建站方式。";
  });
}

function enhanceTutorialCategoryPages() {
  const slug = location.pathname.split("/").pop();
  const content = {
    "blog-wordpress.html": {
      cards: [
        ["先搭稳运行环境", "从域名、主机、SSL、WordPress 安装和基础设置开始，避免后续速度、安全与收录问题反复返工。"],
        ["再规划页面与内容", "按产品、应用、公司能力、资料下载和 FAQ 组织栏目，让网站既方便维护，也能承接搜索需求。"],
        ["最后建立维护机制", "明确主题插件更新、备份、安全、性能和内容发布节奏，让网站上线后仍然可持续运营。"],
      ],
      steps: [
        ["完成安装与基础设置", "配置域名、HTTPS、固定链接、管理员权限和必要的安全措施。"],
        ["搭建核心页面结构", "先完成首页、产品分类、产品详情、关于、联系和必要的信任页面。"],
        ["补齐 SEO 与数据工具", "设置标题描述、站点地图、Search Console、GA4 和关键咨询事件。"],
        ["按周期备份和更新", "建立更新前备份、兼容性检查、速度检查和内容维护清单。"],
      ],
    },
    "blog-shopify.html": {
      cards: [
        ["店铺基础与商品目录", "先确认市场、币种、支付、物流和商品分类，减少正式上架后的结构调整。"],
        ["商品页与购买信任", "用清晰图片、规格、配送退换、评价和 FAQ 回答购买前最关键的问题。"],
        ["追踪与复购运营", "连接广告和分析工具，持续观察加购、结账、购买和邮件复购表现。"],
      ],
      steps: [
        ["配置市场与交易设置", "完成域名、币种、支付、税费、物流区域和通知邮件设置。"],
        ["建立商品与集合结构", "统一商品信息、变体、图片、集合和站内筛选逻辑。"],
        ["检查购买转化路径", "从广告入口到商品、购物车和结账完整测试移动端流程。"],
        ["复盘数据与复购", "根据商品和渠道表现优化页面、素材、邮件及再营销受众。"],
      ],
    },
    "blog-seo.html": {
      cards: [
        ["关键词与搜索意图", "区分产品词、行业词、问题词和对比词，先判断用户真正想找什么。"],
        ["技术基础与页面结构", "确保页面可抓取、可索引、加载稳定，并让主题、层级和内链关系清晰。"],
        ["内容集群与权威积累", "围绕核心业务持续发布可验证内容，并通过内链、引用与行业曝光建立信任。"],
      ],
      steps: [
        ["完成网站与竞品诊断", "检查收录、流量、关键词、页面结构和竞争结果，建立初始基线。"],
        ["建立关键词页面地图", "把关键词分配到产品页、行业页、指南、FAQ 和对比内容，避免互相竞争。"],
        ["按优先级发布和优化", "先修高影响页面，再持续扩展内容集群与内部链接。"],
        ["按月复盘排名与询盘", "同时观察曝光、点击、有效询盘和页面贡献，不用单日波动作判断。"],
      ],
    },
    "blog-ads.html": {
      cards: [
        ["账户与关键词结构", "让广告组围绕明确产品和意图组织，减少宽泛流量消耗预算。"],
        ["素材与落地页一致", "广告承诺、页面标题、卖点和行动按钮保持一致，降低点击后的流失。"],
        ["转化追踪与实验", "先确认表单、电话、邮件等关键事件可追踪，再比较素材、受众和页面表现。"],
      ],
      steps: [
        ["确认目标和有效转化", "定义什么是合格询盘，并排除浏览、误点等低价值事件。"],
        ["建立小范围测试", "从高意图关键词或明确受众起步，控制变量和初期预算。"],
        ["优化素材与落地页", "根据搜索词、点击和页面行为调整广告表达与承接内容。"],
        ["按有效询盘复盘", "用询盘质量和成交反馈判断渠道，而不只看点击率或表单数量。"],
      ],
    },
    "blog-ai-tools.html": {
      cards: [
        ["从具体任务选工具", "先明确要整理资料、生成初稿、翻译、分析还是自动化，再选择合适工具。"],
        ["提供可靠业务上下文", "把产品参数、目标客户、品牌语气和参考资料说清楚，减少空泛输出。"],
        ["保留事实核查与人工审核", "AI 适合提高效率，但价格、参数、认证和客户承诺必须由人确认。"],
      ],
      steps: [
        ["选择一个高频任务", "从重复且容易验收的工作开始，不要一次把整个业务交给自动化。"],
        ["整理输入资料与规则", "准备可信来源、输出格式、禁用表达和审核标准。"],
        ["生成、校对并记录问题", "核对事实、语气、版权和敏感信息，把常见错误写回流程。"],
        ["衡量节省时间与质量", "比较人工耗时、返工率和最终效果，再决定是否扩大使用范围。"],
      ],
    },
  }[slug];
  if (!content) return;

  const findSection = (name) => Array.from(document.querySelectorAll(".section")).find((section) =>
    section.querySelector(".section-kicker")?.textContent.trim().toLowerCase() === name
  );
  const growthSection = findSection("growth system");
  growthSection?.querySelectorAll(".card").forEach((card, index) => {
    const item = content.cards[index];
    if (!item) return;
    const title = card.querySelector("h3");
    const text = card.querySelector("p");
    if (title) title.textContent = item[0];
    if (text) text.textContent = item[1];
  });

  const executionSection = findSection("execution map");
  executionSection?.querySelectorAll(".feature-item, .process-item").forEach((item, index) => {
    const step = content.steps[index];
    if (!step) return;
    const title = item.querySelector("b, h3");
    const text = item.querySelector("span, p");
    if (title) title.textContent = step[0];
    if (text) text.textContent = step[1];
  });
}

function enhanceIndustrySolutionPages() {
  const slug = location.pathname.split("/").pop();
  const pages = {
    "b2b-factory.html": {
      label: "B2B Factory Website",
      title: "B2B 工厂出海方案",
      hero: "适合制造商、OEM/ODM 工厂和出口供应商。网站重点不是“好看”，而是让海外采购能快速判断你的生产能力、产品范围、认证资质和合作流程。",
      outcome: "把产品目录、工厂实力、认证资料、项目经验和询盘入口放到同一条采购路径里。",
      fit: ["产品线比较多，需要按分类展示", "客户会关心产能、证书、交期和定制能力", "希望长期做 Google SEO 和自然询盘"],
      structure: ["首页：定位、核心产品、工厂优势、合作流程", "产品目录：分类、参数、应用场景、可定制项", "关于工厂：产线、质检、证书、团队与出口经验", "案例与 FAQ：降低采购顾虑，减少重复沟通"],
      conversion: ["每个产品分类页保留询盘按钮", "下载资料前引导留下邮箱", "把 WhatsApp / Email / 表单放在采购决策节点", "用 GA4 和转化事件追踪有效询盘来源"],
      seo: ["产品词 + manufacturer / supplier / factory", "应用场景词，例如 for construction / for agriculture", "认证、材质、工艺、MOQ、交期等采购问题", "对比型内容：材质对比、工艺对比、选型指南"],
      demos: [
        ["机械设备官网 Demo", "适合设备工厂和出口制造商", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/654787959/fabrix-cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=839e9ec25e43532a15434c219a62662f7f61932f4bb69a0e226d7e098e22e9a0", "https://live.kitpixel.com/fabrix/template-kit/home/?storefront=envato-elements"],
        ["产品目录型官网", "适合 SKU 多、分类清晰的 B2B 产品", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/347074086/cover-image.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=980c5707bcf32ac1b5455492184380f214f862621c903912ec71f0e833e3df7b", "https://templatekits.c-kav.com/demo2/zoi-kit/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#machinery"
    },
    "machinery.html": {
      label: "Machinery Website",
      title: "机械设备外贸网站",
      hero: "机械设备网站要先让采购确认型号、参数、应用场景、视频演示和售后能力。页面需要帮助客户快速判断设备是否适配，而不是只展示一张产品图。",
      outcome: "把设备型号、技术参数、应用行业、运行视频、售后支持和询盘表单串成一条清晰路径。",
      fit: ["设备单价高，客户决策周期长", "需要展示参数、工况、产能、耗材和案例", "客户经常反复询问选型、安装和售后"],
      structure: ["产品页：型号、参数表、适用场景、视频和 FAQ", "行业应用页：按工况讲解决方案", "案例页：展示现场、结果和客户行业", "资料页：说明书、规格书、维护指南"],
      conversion: ["产品页放“发送型号需求”按钮", "参数表旁边放询价入口", "视频和案例下方引导预约沟通", "用表单字段收集产能、尺寸、目标市场等信息"],
      seo: ["machine / equipment + manufacturer / supplier", "型号参数词、工艺词、应用行业词", "How to choose / maintenance / troubleshooting", "案例内容：国家、行业、设备型号、应用结果"],
      demos: [
        ["机械设备官网 Demo", "适合设备工厂和出口制造商", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/654787959/fabrix-cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=839e9ec25e43532a15434c219a62662f7f61932f4bb69a0e226d7e098e22e9a0", "https://live.kitpixel.com/fabrix/template-kit/home/?storefront=envato-elements"],
        ["资料下载型页面", "适合规格书、案例和技术资料承接", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/430395189/Cover%20Image.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=fec4381fc35b1e507f5174df8df4d9f9b559ba42721b76fedaf5bd6723c46f1c", "https://www.roofixer.oxacor.com/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#machinery"
    },
    "industrial-parts.html": {
      label: "Industrial Parts Website",
      title: "工业零部件网站",
      hero: "工业零部件网站要解决的是“能不能匹配我的规格”。客户会看材质、尺寸、公差、兼容型号、图纸加工能力和 MOQ，页面结构必须方便筛选和询价。",
      outcome: "让客户按类别、材质、规格和应用快速找到合适产品，并提交图纸或参数需求。",
      fit: ["SKU 多、型号多、参数复杂", "支持来图加工、定制和小批量试单", "客户常问材质、尺寸、公差、兼容性"],
      structure: ["分类页：按材质、用途、规格建立筛选逻辑", "产品页：参数表、图纸下载、兼容型号、FAQ", "能力页：加工工艺、质检标准、包装和交期", "询价页：支持上传图纸或填写规格"],
      conversion: ["产品页增加 RFQ 按钮", "上传图纸入口放在首屏和页尾", "用表单收集材质、数量、公差、目标交期", "给重复采购客户保留快捷联系入口"],
      seo: ["part / component + material / size / standard", "custom machining / OEM parts / replacement parts", "材质、表面处理、公差、标准号内容", "兼容型号和应用行业长尾词"],
      demos: [
        ["工业零部件官网 Demo", "适合配件、五金和加工件供应商", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/397940166/Ketok-Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=8300a9089acaf75d7b36cb4aba9a6cf7e56f3c17ae048140f5f45e0cde1926cd", "https://gajean.com/ketok/template-kit/homepage/?storefront=envato-elements"],
        ["参数筛选型目录", "适合规格多、型号多的零部件产品", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/351017006/cover%20Gadgetin.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=2fa810cd637a2967c4329d86b2d5f639d5389776056395eec37b7e7a92f0ac4b", "https://templatekit.brothergrounds.com/gadgetin/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#parts"
    },
    "home-building.html": {
      label: "Home & Building Website",
      title: "家居建材出海网站",
      hero: "家居建材网站既要展示质感，也要给采购足够的工程信息。客户会关注材质、尺寸、颜色、安装方式、案例场景、认证和批量供货能力。",
      outcome: "用场景图、产品系列、材质工艺、项目案例和资料下载帮助客户建立信任。",
      fit: ["产品视觉很重要，需要展示空间效果", "客户会比较材质、颜色、尺寸和工程案例", "适合做多语言、目录下载和询盘承接"],
      structure: ["首页：品牌定位、产品系列、场景图和优势", "产品系列页：材质、颜色、尺寸、安装方式", "项目案例页：国家、空间、产品和效果", "下载中心：目录册、规格书、安装指南"],
      conversion: ["场景图旁边设置“获取目录”入口", "产品系列页引导索取样品或报价", "案例页引导预约项目沟通", "下载资料前收集邮箱和目标市场"],
      seo: ["material / furniture / building product + supplier", "颜色、材质、尺寸、安装方式长尾词", "应用空间词：hotel / villa / office / retail", "案例文章：项目类型、国家、产品系列"],
      demos: [
        ["家居建材官网 Demo", "适合建材、家具和装饰材料品牌", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/654646238/aestona.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=5da10c38a3dca9781a7f09bd49a1303142551ad974c5a8345d9d8f8e0aabcc4e", "https://demo.zaderonstudio.com/aestona/?storefront=envato-elements"],
        ["项目案例型页面", "适合空间效果、安装场景和工程案例", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/467814402/Elementor%20Template%20Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=ed8f3822d3639982f34e15ae97185cda49026d76ace837adeb9679715958cb7e", "https://kit.nirmanavisual.com/archidream/template-kit/home/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#building"
    },
    "electronics.html": {
      label: "Electronics Website",
      title: "电子电器外贸网站",
      hero: "电子电器网站要让客户快速确认功能、参数、认证、适配场景和渠道合作方式。页面需要兼顾产品矩阵、技术资料和经销商询盘。",
      outcome: "把产品系列、规格参数、认证资料、应用场景和合作入口清楚展示出来。",
      fit: ["产品有多种型号和功能差异", "客户重视认证、规格、包装和渠道政策", "需要承接经销商、批发商或 OEM 询盘"],
      structure: ["产品矩阵：按功能、场景和型号分类", "产品页：参数、认证、包装、下载资料", "应用页：家庭、商业、工业等使用场景", "合作页：经销、批发、OEM/ODM 说明"],
      conversion: ["产品页放批发询价入口", "认证与规格旁边放下载/咨询按钮", "合作页收集国家、渠道类型和采购量", "广告落地页单独设计主推产品 CTA"],
      seo: ["electronics / appliance + supplier / manufacturer", "功能词、型号词、认证词、场景词", "wholesale / distributor / OEM / ODM", "产品对比、选型指南和常见问题"],
      demos: [
        ["电子电器官网 Demo", "适合电子产品、电器和智能硬件", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/636491335/Occidensential%20-%20Cover%20Template%20Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=16221a06033e74f18b48712e9f5c9a1da8a4b714b33b0c08b8f2fd69bbd9af50", "https://mydemo.occidensential.com/insighto/?storefront=envato-elements"],
        ["技术规格页面", "适合认证、参数、应用和资料下载", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/635400361/Cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=e42d9b5c5b6aaf833a956880f524d7e0be7325e4f6cb0ca112fbf4ab48413d48", "https://askproject.net/flynn/home/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#electronics"
    },
    "beauty.html": {
      label: "Beauty Brand Website",
      title: "美妆个护品牌出海",
      hero: "美妆个护网站要同时讲清品牌质感、成分功效、使用场景和购买信任。页面需要适合社媒种草、广告落地和后续 Shopify 转化。",
      outcome: "用品牌故事、产品功效、成分说明、用户评价和内容入口承接海外用户。",
      fit: ["产品依赖视觉、故事和信任背书", "需要承接 Instagram / TikTok / Facebook 流量", "后续可能接 Shopify、KOL 和再营销"],
      structure: ["首页：品牌定位、明星产品、功效和评价", "产品页：成分、功效、使用方式、FAQ", "内容页：护肤指南、使用教程、前后对比", "转化页：套装、优惠、评价和订阅入口"],
      conversion: ["社媒入口落到主推产品页", "产品页强调功效、成分和评价", "邮件订阅承接折扣和新品通知", "后续可接 Shopify 购物路径"],
      seo: ["skincare / beauty / personal care + benefit", "成分词、功效词、肤质词、使用方法", "best / how to use / routine 类内容", "品牌曝光和社媒内容再利用"],
      demos: [
        ["美妆个护官网 Demo", "适合护肤、美妆、个护和 DTC 品牌", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/633180894/Syantik%20Elementor%20Cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=88fd50ecedfc35bbe8536de2241415c6b3b4671e00529b3e1f74a58e242690c0", "https://syantik.tokotema.xyz/template-kit/home/?storefront=envato-elements"],
        ["品牌故事页面", "适合视觉、功效、成分和用户信任", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/446256112/cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=353f3978a318af17be109cd5ed562efcaa29c8d3a09610ff651eb144b66d50f8", "https://themesflat.co/kitmellis/template-kit/home-01/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#beauty"
    },
    "medical-devices.html": {
      label: "Medical Device Website",
      title: "医疗器械外贸网站",
      hero: "医疗器械网站最重要的是合规、专业和信任。客户会先看认证、参数、适用场景、说明书和售后支持，再判断是否进入询价。",
      outcome: "把产品参数、认证资料、适用科室、说明书下载和专业询价流程整理清楚。",
      fit: ["产品涉及认证、规格和使用说明", "客户是经销商、医院、诊所或采购机构", "需要用专业内容降低合规与信任顾虑"],
      structure: ["产品页：参数、认证、适用场景、说明书", "资料页：CE/FDA、手册、检测报告、FAQ", "应用页：按科室或使用场景组织内容", "询价页：收集采购身份、国家和数量"],
      conversion: ["认证资料旁边放咨询入口", "产品页提供说明书下载", "表单收集国家、采购类型、预计数量", "避免夸大医疗效果，文案保持专业克制"],
      seo: ["medical device / equipment + supplier", "认证词、科室词、型号词、用途词", "manual / specification / distributor 类内容", "FAQ 覆盖安全、合规、包装、售后问题"],
      demos: [
        ["医疗器械官网 Demo", "适合设备、耗材和医疗产品出口", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/431851040/preview%20copy.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=5461829be2476fae15102ec8733fa1281436d814d4798eff840c22e802d4211e", "https://kitpro.site/colabs/?storefront=envato-elements"],
        ["认证资料页面", "适合 CE、FDA、说明书和技术文档", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/496276959/cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=7e64fb13fa7adcbf9eb3a065f0469ce0e370a802cd37301118eae10df5339675", "https://themesflat.com/laboixkit/template-kit/home-01/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#medical"
    },
    "new-energy.html": {
      label: "New Energy Website",
      title: "新能源产品出海",
      hero: "新能源网站要把产品能力、系统方案、应用场景和项目案例讲清楚。客户通常会比较参数、认证、稳定性、安装场景和长期服务能力。",
      outcome: "围绕储能、光伏、电池、充电产品建立解决方案型网站结构。",
      fit: ["产品需要按应用场景解释方案", "客户关注认证、容量、寿命、安装和案例", "需要承接工程商、经销商和项目询盘"],
      structure: ["解决方案页：住宅、商业、工业、户外等场景", "产品页：参数、认证、系统兼容和下载资料", "案例页：项目规模、国家、效果和图片", "支持页：安装、售后、FAQ 和资料下载"],
      conversion: ["方案页收集项目规模和应用场景", "参数区放资料下载和预约沟通", "案例页引导提交项目需求", "广告落地页按单一产品或场景设计"],
      seo: ["solar / energy storage / battery + solution", "容量、功率、应用场景、认证长尾词", "installation / maintenance / project case", "国家与应用场景结合的案例内容"],
      demos: [
        ["新能源官网 Demo", "适合储能、光伏、电池和充电产品", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/640642222/Coverimage-Solarize.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=1450b2e17cf18dcca1220fe9e904e5d8e0eb70406d068a59622def28ec8f5a8c", "https://askit.dextheme.net/solarize/?storefront=envato-elements"],
        ["项目案例页面", "适合工程案例、下载资料和询盘", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/633660695/main%20preview.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=80f8117e9e5013a4f201e458c146b2962ee62769b554e09987bd28acbcda175e", "https://demokit.creativemox.com/sunara/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#energy"
    },
    "cross-border-ecommerce.html": {
      label: "Cross-border Ecommerce",
      title: "跨境电商独立站",
      hero: "跨境电商独立站要服务于转化和复购。页面重点是商品卖点、信任评价、支付体验、广告落地、邮件订阅和再营销，而不只是一个品牌展示站。",
      outcome: "把 Shopify 商品页、广告落地页、评价、套装组合和再营销事件规划到同一套转化路径里。",
      fit: ["需要在线销售、支付和订单管理", "依赖广告、社媒或 KOL 带来流量", "希望做邮件订阅、优惠券、复购和再营销"],
      structure: ["首页：品牌定位、主推商品、评价和优惠入口", "商品页：卖点、图片、评价、FAQ 和加购路径", "落地页：按广告主题单独设计", "内容页：使用教程、对比、场景和品牌故事"],
      conversion: ["首屏突出主推商品和优惠", "商品页减少干扰，强化加购和信任", "接入 Meta Pixel / GA4 / Google Ads 转化", "用邮件和再营销承接未购买用户"],
      seo: ["product + benefit / use case", "best / review / how to use / comparison", "品牌词、产品词和场景词", "用博客和指南承接非品牌自然流量"],
      demos: [
        ["跨境电商独立站 Demo", "适合 DTC 品牌和在线销售", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/335130366/cover.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=663073e1c9ba825b5045d237c333dbb99c81f258645edf3c266f6f01f48299b3", "https://templatekit.jegtheme.com/kramic/?storefront=envato-elements"],
        ["产品转化页面", "适合卖点、评价、套装和再营销", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/420056802/Cover-Image-vegetta.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=d04dd3628871bc05a13acb6ec7082660476990e147df45f06e7c1c77bacbdc07", "https://ibeydesign.com/vegetta/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/#ecommerce"
    },
    "foreign-trade-soho.html": {
      label: "SOHO Website",
      title: "外贸 SOHO 获客方案",
      hero: "外贸 SOHO 网站要轻量、清晰、可信。重点是让客户知道你能提供什么产品或服务、如何合作、如何快速联系，而不是堆很多复杂栏目。",
      outcome: "用轻量官网承接名片、社媒、邮件和 Google 搜索流量，形成稳定联系入口。",
      fit: ["个人或小团队刚开始做海外获客", "产品线不复杂，但需要专业形象", "希望先上线再逐步优化"],
      structure: ["首页：定位、服务/产品、优势和联系方式", "产品或服务页：按最核心类别展示", "关于页：经验、合作方式和信任信息", "联系页：邮箱、微信、WhatsApp 和需求表单"],
      conversion: ["首屏放清楚联系入口", "每个服务模块都能进入咨询", "用案例或流程解释合作方式", "后续可逐步升级成 WordPress 内容站"],
      seo: ["niche product / sourcing / supplier service", "目标市场 + 产品/服务组合词", "常见采购问题和合作流程", "从少量高意图页面开始沉淀"],
      demos: [
        ["轻量官网 Demo", "适合 SOHO、小团队和顾问型服务", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/309504244/2340x1560.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=0e41faae051d0cbd7ad99aba10246f5482a06cdda9a6f787174e9701aa01c106", "https://elementorpress.com/templatekit-pro/layout03/?storefront=envato-elements"],
        ["服务展示页面", "适合先建立可信联系入口", "https://elements-resized.envatousercontent.com/elements-template-kits-cover-images/files/465785323/Cover%20image%20Pecalang%20-%20Elementor%20Template%20Kit.jpg?w=433&cf_fit=scale-down&q=85&format=auto&s=c6b65d1fe97a8bd5c6c2c3340211ba50cd8e59a076a8ab4b626ee5d2fcb6a6c5", "https://kit.nirmanavisual.com/pecalang/template-kit/home1/?storefront=envato-elements"],
      ],
      demoLibrary: "https://demo.iwithfuture.com/"
    }
  };
  const data = pages[slug];
  if (!data || document.querySelector(".industry-playbook")) return;

  const hero = document.querySelector(".inner-hero");
  if (!hero) return;

  document.body.classList.add("industry-page-enhanced");
  const heroTitle = hero.querySelector("h1");
  const heroText = hero.querySelector("p");
  const heroPanel = hero.querySelector(".hero-panel");
  if (heroTitle) heroTitle.textContent = data.title;
  if (heroText) heroText.textContent = data.hero;
  if (heroPanel) {
    heroPanel.innerHTML = `
      <h4>这个页面会帮客户判断</h4>
      <ul>
        <li>你是否适合这个行业的网站结构</li>
        <li>核心栏目应该怎么安排</li>
        <li>询盘入口应该放在哪里</li>
        <li>内容和 SEO 可以从哪里开始</li>
      </ul>`;
  }

  const growthSection = Array.from(document.querySelectorAll(".section")).find((section) => {
    const kicker = section.querySelector(".section-kicker");
    return kicker && kicker.textContent.trim().toLowerCase() === "growth system";
  });
  if (growthSection) {
    const title = growthSection.querySelector(".section-head h2");
    const intro = growthSection.querySelector(".section-head p");
    const cards = growthSection.querySelectorAll(".card");
    if (title) title.textContent = `${data.title}不是简单换模板，而是把客户决策路径做清楚。`;
    if (intro) intro.textContent = `${data.outcome} 页面内容会围绕买家真正关心的问题展开，让客户先理解、再比较、最后愿意提交需求。`;
    const cardContent = [
      [`${data.title}定位`, `${data.fit[0]}；${data.fit[1]}。先把适合的客户和采购场景讲清楚，页面才不会变成泛泛展示。`],
      ["核心页面结构", `${data.structure[0]}；${data.structure[1]}。先让客户找到信息，再引导他进入询盘或下载资料。`],
      ["询盘与内容增长", `${data.conversion[0]}，同时围绕 ${data.seo[0]} 扩展内容，让页面既能转化，也能长期沉淀搜索流量。`],
    ];
    cards.forEach((card, index) => {
      const item = cardContent[index];
      if (!item) return;
      const cardTitle = card.querySelector("h3");
      const cardText = card.querySelector("p");
      if (cardTitle) cardTitle.textContent = item[0];
      if (cardText) cardText.textContent = item[1];
    });
  }

  const executionSection = Array.from(document.querySelectorAll(".section")).find((section) => {
    const kicker = section.querySelector(".section-kicker");
    return kicker && kicker.textContent.trim().toLowerCase() === "execution map";
  });
  if (executionSection) {
    const title = executionSection.querySelector("h2");
    if (title) title.textContent = `${data.title}落地时，先把这四件事做扎实。`;
    const items = executionSection.querySelectorAll(".feature-item, .process-item");
    const executionItems = [
      ["买家需求与场景拆解", `${data.fit[0]}，所以第一步要先确认目标客户、采购场景和主要决策顾虑。`],
      ["栏目结构与资料准备", `${data.structure[0]}；${data.structure[1]}。这些内容决定网站是否能让客户快速看懂。`],
      ["询盘入口与信任设计", `${data.conversion[0]}；${data.conversion[1]}。让客户在比较产品、查看资料和准备咨询时都有明确下一步。`],
      ["SEO 内容与数据复盘", `${data.seo[0]} 是起点，上线后再根据访问、转化和询盘数据调整页面与内容方向。`],
    ];
    items.forEach((item, index) => {
      const content = executionItems[index];
      if (!content) return;
      const itemTitle = item.querySelector("b, h3");
      const itemText = item.querySelector("span, p");
      if (itemTitle) itemTitle.textContent = content[0];
      if (itemText) itemText.textContent = content[1];
    });
  }

  const list = (items) => items.map((item) => `<li>${item}</li>`).join("");
  const demos = data.demos.map(([title, desc, img, href]) => `
    <a class="industry-demo-card" href="${href}" target="_blank" rel="noopener">
      <span><img src="${img}" alt="${title}" loading="lazy"></span>
      <b>${title}</b>
      <small>${desc}</small>
    </a>`).join("");

  const section = document.createElement("section");
  section.className = "section industry-playbook";
  section.innerHTML = `
    <div class="container">
      <div class="industry-playbook-head reveal">
        <span class="section-kicker">${data.label}</span>
        <h2>${data.title}应该这样规划，而不是简单套模板。</h2>
        <p>${data.outcome}</p>
      </div>
      <div class="industry-playbook-grid">
        <article class="industry-plan-card industry-plan-card-main reveal">
          <small>01 / 适合谁</small>
          <h3>先判断你的业务是不是这种结构</h3>
          <ul>${list(data.fit)}</ul>
        </article>
        <article class="industry-plan-card reveal">
          <small>02 / 页面结构</small>
          <h3>客户真正会看的栏目</h3>
          <ul>${list(data.structure)}</ul>
        </article>
        <article class="industry-plan-card reveal">
          <small>03 / 询盘转化</small>
          <h3>把咨询入口放在决策节点</h3>
          <ul>${list(data.conversion)}</ul>
        </article>
        <article class="industry-plan-card reveal">
          <small>04 / 内容 SEO</small>
          <h3>从采购问题和长尾词开始</h3>
          <ul>${list(data.seo)}</ul>
        </article>
      </div>
      <div class="industry-demo-panel reveal">
        <div class="industry-demo-copy">
          <span class="section-kicker">Demo Reference</span>
          <h3>可以参考这些页面方向</h3>
          <p>Demo 不是直接照搬，而是用来判断行业视觉、页面模块和信息层级。真正落地时会根据你的产品、资料、预算和目标市场重新组合。</p>
          <a class="btn btn-primary magnetic" href="${data.demoLibrary}" target="_blank" rel="noopener">查看对应 Demo</a>
        </div>
        <div class="industry-demo-grid">${demos}</div>
      </div>
    </div>`;

  hero.insertAdjacentElement("afterend", section);
  section.querySelectorAll(".reveal").forEach((el) => {
    revealObserver.observe(el);
    setTimeout(() => el.classList.add("visible"), 80);
  });
}

function enhanceOrganicGrowthEntry() {
  const inPages = /\/pages\//.test(window.location.pathname.replace(/\\/g, "/"));
  const href = inPages ? "b2b-organic-growth.html" : "pages/b2b-organic-growth.html";
  const label = "\u81ea\u7136\u6d41\u91cf\u8fd0\u8425";

  const nav = document.querySelector(".nav-links");
  if (nav && !nav.querySelector('a[href$="b2b-organic-growth.html"]')) {
    const link = document.createElement("a");
    link.className = "nav-trigger organic-growth-nav";
    link.href = href;
    link.textContent = label;
    const blogLink = Array.from(nav.children).find((item) => item.matches('a[href$="blog.html"]'));
    nav.insertBefore(link, blogLink || null);
  }

  const mobileMenu = document.querySelector(".mobile-menu");
  if (mobileMenu) {
    const mobileLinks = [
      ["b2b-organic-growth.html", "B2B " + label],
      ["pricing.html", "方案咨询"],
      ["process.html", "服务流程"],
      ["q-and-a.html", "问答中心"],
      ["video-tutorials.html", "实操教程中心"],
      ["about.html", "关于我们"],
    ];
    const contactLink = mobileMenu.querySelector('a[href$="contact.html"]');
    mobileLinks.forEach(([path, text]) => {
      if (mobileMenu.querySelector(`a[href$="${path}"]`)) return;
      const link = document.createElement("a");
      link.href = inPages ? path : `pages/${path}`;
      link.textContent = text;
      mobileMenu.insertBefore(link, contactLink || null);
    });
  }

  const marketingFooter = Array.from(document.querySelectorAll(".site-footer .footer-grid > div")).find((group) => {
    const heading = group.querySelector("h6");
    return heading && /SEO|\u8425\u9500\u83b7\u5ba2/.test(heading.textContent);
  });
  if (marketingFooter && !marketingFooter.querySelector('a[href$="b2b-organic-growth.html"]')) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = "B2B " + label;
    marketingFooter.insertBefore(link, marketingFooter.firstElementChild.nextSibling);
  }
}

enhanceOrganicGrowthEntry();
enhanceMegaMenus();
enhanceHomeLikeDemo();
enhanceHomeDecisionGuide();
enhanceServiceConversionBlocks();
enhanceLicensedTrustBlocks();
enhanceContactFinder();
enhanceCustomerFacingTemplates();
enhanceTutorialCategoryPages();
enhanceIndustrySolutionPages();
