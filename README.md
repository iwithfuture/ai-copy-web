# 吾日三省吾身 Static Site

这是一个复刻 `hantoglobal.com` 风格的静态网站项目，包含首页、服务页、营销页、AI 增长页、行业方案页、资源页、案例页、工具页和联系页。

## 本地预览

```bash
node server.js
```

然后访问：

```text
http://127.0.0.1:4173/
```

## 部署到 GitHub Pages

1. 将本项目推送到 GitHub 仓库。
2. 打开仓库 `Settings -> Pages`。
3. Source 选择 `Deploy from a branch`。
4. Branch 选择 `main`，目录选择 `/root`。
5. 保存后等待 GitHub Pages 构建完成。

## 目录

- `index.html`：首页
- `pages/`：所有内页
- `css/site.css`：全站样式
- `js/site.js`：导航、FAQ、Tab、表单、工具计算等交互
- `assets/`：Logo 与页面图片资源
- `server.js`：本地静态服务器
