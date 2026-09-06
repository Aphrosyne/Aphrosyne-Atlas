# Aphrosyne Atlas

一个静态优先的个人内容站，使用 Next.js App Router、React、Tailwind CSS、Framer Motion 与 MDX 构建。首页保留个人视觉表达，Blog 承载文章与开发记录；知识库将在后续阶段加入。

线上地址：[Aphrosyne Atlas](https://aphrosyne.github.io/Aphrosyne-Atlas/)

## 本地开发

```bash
npm ci
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)。如需在同一局域网的其他设备预览，请使用 `npm run dev -- --hostname 0.0.0.0`。

## 静态预览

```bash
npm run build
npx serve out -l 4173
```

访问 `http://localhost:4173/`。本地构建不设置 GitHub Actions 环境变量，因此使用根路径；GitHub Pages 构建会自动从仓库名称生成子路径。

## 站点配置

个人资料、站点元数据、导航、头像/背景路径、About 文案和社交链接集中在 [`src/config/site.ts`](./src/config/site.ts)。Fork 或复用本项目时，只修改该文件即可更新站点身份。

社交链接只渲染 `SOCIAL_LINKS` 数组中已确认可公开的项目。不要在配置文件或仓库中保存 Token、密码和其他私密信息。

## 部署

推送到 `master` 会触发 [GitHub Pages 工作流](./.github/workflows/deploy-pages.yml)：它通过 `npm ci` 安装锁定依赖，构建 `out/`，再使用 GitHub 官方 Pages Actions 发布。

首次使用时，在仓库的 `Settings → Pages` 中将发布来源设置为 `GitHub Actions`。

## 许可协议

- 程序源代码及相关软件材料采用 [MIT License](./LICENSE)；
- Aphrosyne 创作的文章、教程、知识库条目与项目文档采用 [CC BY-SA 4.0](./LICENSE-CONTENT.md)；
- 游戏素材、Mod 资源及其他第三方内容归各自权利人所有，不包含在上述内容授权中。
