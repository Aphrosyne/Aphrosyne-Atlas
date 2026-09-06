# Aphrosyne Atlas

一个静态优先的个人内容站，使用 Next.js App Router、React、Tailwind CSS、Framer Motion 与 MDX 构建。首页保留个人视觉表达，Blog 承载文章与开发记录，Knowledge 承载教程、问题修复、实验记录与参考资料。

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

## Dashboard 布局工作台

运行 `npm run dev` 后访问 [http://localhost:3000/studio/dashboard/](http://localhost:3000/studio/dashboard/)。它用于调整桌面端 12 列 Dashboard，不会自动写入仓库。

使用步骤：

1. 在左侧预览中拖动卡片调整位置；点击卡片后，右侧会显示当前选中项。
2. 使用“左移/右移/上移/下移”和“加宽/缩窄/加高/变矮”进行精确微调。工作台允许临时重叠，需自行在预览中避开重叠。
3. 满意后点击“复制 TypeScript 配置”或“下载配置文件”。
4. 将导出的整个 `DASHBOARD_LAYOUT` 声明替换到 [`src/config/dashboard-layout.ts`](./src/config/dashboard-layout.ts)，保存后由开发服务器热更新首页。
5. 在桌面和移动尺寸检查布局；最终执行 `npm run build`，再提交变更。

“恢复默认”会恢复当前源码中的布局。工作台不在站点导航中，且生产构建会将该路由返回为 404；它不提供线上写入或 GitHub 授权能力。

## 部署

推送到 `master` 会触发 [GitHub Pages 工作流](./.github/workflows/deploy-pages.yml)：它通过 `npm ci` 安装锁定依赖，构建 `out/`，再使用 GitHub 官方 Pages Actions 发布。

首次使用时，在仓库的 `Settings → Pages` 中将发布来源设置为 `GitHub Actions`。

## 许可协议

- 程序源代码及相关软件材料采用 [MIT License](./LICENSE)；
- Aphrosyne 创作的文章、教程、知识库条目与项目文档采用 [CC BY-SA 4.0](./LICENSE-CONTENT.md)；
- 游戏素材、Mod 资源及其他第三方内容归各自权利人所有，不包含在上述内容授权中。
