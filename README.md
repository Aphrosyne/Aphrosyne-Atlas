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

个人资料、站点元数据、导航、头像/背景路径、About 文案和社交链接集中在 [`src/config/site.ts`](./src/config/site.ts)。项目卡片与详情页内容集中在 [`src/config/projects.ts`](./src/config/projects.ts)。

社交链接只渲染 `SOCIAL_LINKS` 数组中已确认可公开的项目。不要在配置文件或仓库中保存 Token、密码和其他私密信息。

Dashboard 的 Status 与 Hitokoto 端点同样配置在 `SITE.dashboard`。它们只适合填写可公开、允许浏览器跨域读取的地址；站点会先渲染同一配置中的静态回退文案，接口不可用时首页仍可正常使用。

### 更新 Dashboard Status

Status 的发布脚本是本地工具，不需要打开 GitHub 网页：

1. 用文本编辑器修改 Git 忽略的 `.private/status.txt`，只写一行明文，例如 `正在准备发布AA正式版🤩`。
2. 脚本会优先使用已有 `.env.local` 中的 `GITHUB_TOKEN`；也可在 `.private/github-token.txt` 保存一个具有 Gist 写入权限的 Token。两处均被 Git 忽略，不要把 Token 写进代码、公开配置或终端命令历史。
3. 先检查解析结果：`python scripts/publish-dashboard-status.py --dry-run`。
4. 确认无误后执行：`python scripts/publish-dashboard-status.py`。

脚本会把行末 emoji 与正文分开，写入 Gist JSON。例如上例会发布为：

```json
{ "status": "正在准备发布AA正式版", "emoji": "🤩" }
```

也可以临时直接传入内容：`python scripts/publish-dashboard-status.py "正在调 Dashboard 布局🎨"`。如果 Gist 内不止一个文件，脚本会停止并提示使用 `--file 文件名`，不会猜测或覆盖错误文件。

## Fork 后客制化

不需要逐个页面搜索个人信息，建议按下面的顺序替换：

1. 在 [`src/config/site.ts`](./src/config/site.ts) 修改站点名称、作者、线上地址、首页文案、About、导航和公开社交链接。
2. 运行 `npm run setup:local-assets` 创建本地素材目录；替换头像或背景时，将原图放入相应目录、运行 `npm run optimize:assets`，再提交生成的发布 WebP。
3. 在 [`src/config/projects.ts`](./src/config/projects.ts) 替换项目数组。`slug` 决定详情页 URL，`status` 支持 `public` 和 `archived`。
4. 删除 `src/content/blog/` 和 `src/content/knowledge/` 中不需要的示例内容，再加入自己的 `.mdx`。Blog 文件直接自动发现；Knowledge 的动态导入表会在 `npm run dev` 和 `npm run build` 时自动生成，不要手改 `src/lib/knowledge-articles.ts`。
5. 需要调整首页卡片位置时使用 Dashboard 布局工作台；颜色和玻璃效果位于 `src/app/globals.css`。
6. 如需换字体，将完整 OTF 放入本地的 `src/app/fonts/`，并同步修改 `scripts/optimize-static-assets.mjs` 中的 `FONT_SOURCES` 与 `src/app/layout.tsx` 中的字体声明；生成后提交 WOFF2，不提交 OTF。
7. 替换内容后检查 `LICENSE-CONTENT.md` 中的作者与授权范围；第三方图片、游戏素材和引用仍需遵守各自许可。

Blog 与 Knowledge 都可在 frontmatter 中使用统一的发布状态：

```yaml
publication: published # published | archived | unlisted | draft
```

- `published`：默认值，显示在正常列表、首页推荐和搜索中；旧内容不写此字段时按此状态处理。
- `archived`：保留公开详情页，移出默认列表并显示在归档入口；仍可被站内搜索找到。
- `unlisted`：不出现在列表、首页和站内搜索中，但会生成可直接访问的公开 URL。
- `draft`：不生成详情页，也不进入列表和搜索。

`unlisted` 不是私密发布。知道 URL 的人仍能访问，静态产物和公开仓库中的源文件也能被查看。未确认可公开的正文、图片、附件和工作笔记请放到仓库根目录的 `.private/`；该目录已被 Git 忽略，且不被构建流程扫描。`.gitignore` 只能防止误提交，不能从已经公开的 Git 历史中移除内容。

Knowledge 的 `status` 表示内容是否经过验证，和发布状态是两件事：可选值为 `verified`、`needs-review`、`outdated`。不再希望网站展示、但仍可公开保留的内容使用 `publication: draft`；私人内容不要放进 `src/content/`，改放 `.private/`。

## 静态资源优化

`npm run dev` 和 `npm run build` 会先执行 `npm run optimize:assets`：

- 扫描 `src/` 中的页面、组件和 MDX，只为当前站点实际使用的字符生成三个 WOFF2 字体子集；
- 递归扫描 `assets/images-source/` 中的 JPG、JPEG 和 PNG，按原目录结构生成到 `public/images/`；
- 背景图最长边上限为 2048 px、头像为 768 px、其他图片为 1920 px，并自动转换为 WebP；含透明通道的 PNG 使用无损 WebP。

`assets/images-source/` 下的原图和 `src/app/fonts/` 下的完整 OTF 都是本地编辑素材，默认不进入 Git；`public/images/` 下的 WebP 与 `src/app/fonts/` 下生成的 WOFF2 是提交并部署的发布资源。缺少原图时，转换器会保留已有 WebP；缺少 OTF 时，会保留已有 WOFF2。因此干净 checkout 可直接构建。新增文章、界面文字或图片后，在具备本地源素材的作者环境运行优化脚本并提交更新后的发布产物。字体缺少运行时动态字符时会回退到系统中文字体。

Fork 后若要准备自己的本地素材目录，运行：

```bash
npm run setup:local-assets
```

该命令只创建缺失目录，不下载、覆盖或提交任何文件。

新增图片时，将原图放到 `assets/images-source/` 下合适的分类目录。例如：

```text
assets/images-source/knowledge/example/screenshot.png
  → public/images/knowledge/example/screenshot.webp
  → Markdown 中引用 /images/knowledge/example/screenshot.webp
```

转换器会跳过没有变化的图片；修改压缩规则后可运行 `npm run optimize:assets -- --force` 强制重新生成。SVG 和动画 GIF 不经过此转换器，应按需直接放入 `public/images/`，视频动画建议另行转换为 WebM。

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

## 版本记录

站点版本与面向访问者的重要变更记录在 [CHANGELOG.md](./CHANGELOG.md)。日常文章更新以条目本身的编辑和验证日期为准，不强制单独发版。

## 许可协议

- 程序源代码及相关软件材料采用 [MIT License](./LICENSE)；
- Aphrosyne（柳江凝）创作的文章、教程、知识库条目与项目文档采用 [CC BY-SA 4.0](./LICENSE-CONTENT.md)；
- 游戏素材、Mod 资源及其他第三方内容归各自权利人所有，不包含在上述内容授权中。
