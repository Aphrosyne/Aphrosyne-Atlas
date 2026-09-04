# 旧博客 Roadmap（历史归档）

> 本文档记录 Aphrosyne Atlas 改造前的开发计划，不代表当前阶段进度。当前路线以 docs/atlas-plan.md 为准。

## 已完成的页面

- [x] 首页 Hero + Dashboard（玻璃 bento grid + 分组飞入动画）
- [x] Playground（CSS 3D 立方体 + 粒子跟随鼠标）

## 待做

### 1. Blog 列表页

- [x] 卡片换成玻璃风格，透明度比 Dashboard 高（`bg-white/8` + `backdrop-blur-md`）
- [x] 保持搜索框和标签筛选功能

### 2. Blog 详情页

- [x] 正文区：全屏模糊蒙版（bg-white/15 blur，和全局背景同色系）→ 无卡片边界感
- [x] 侧边：悬浮 TOC 目录小窗（玻璃 style），lg+ 吸附，sticky 跟随
- [x] 上一篇 / 下一篇导航
- [x] 「返回博客」链接
- [x] MDX 标题自动生成 id（h1-h6，extractText + slugify）
- [x] TOC 去重（间歇性 duplicate key）
- [x] PageTransition 闪烁修复（蒙版移到动画外）

### 3. Projects 页

- [ ] 列表页：项目名片网格（封面图 + 一句话描述 + 技术栈标签）
- [ ] 详情页：从 GitHub README 渲染内容
- [ ] 删掉导航里失效的项目链接 ✅

### 4. Playground 页

- [ ] 支持 iframe 嵌入 `public/demos/` 下的 HTML demo

### 5. About 页 + 社交链接

- [ ] 部署前填真实内容
- [ ] 修复 `SOCIAL_LINKS` 占位值（邮箱、QQ、Bilibili）

### 6. 部署

- [ ] 安全审查（API token、环境变量、公开端点）
- [ ] **推送前更换网站图标**（`public/favicon.ico` 等）
- [ ] **推送前更换加载动画**（`src/app/loading.tsx`）
- [ ] Docker Compose + Nginx 反代 → VPS
- [ ] 配置 HTTPS 证书

### 7. 已删除

- [x] 推荐页（自己不用，没用）
- [x] SteamCard 组件
- [x] 嵌入式工具箱 / CLI 工具（没有实际项目）

### 8. 日/夜间双主题（进行中）

- [x] globals.css 定义 `:root` / `.light` 两套 CSS 变量
- [x] `@theme inline` 映射 CSS 变量到 Tailwind 工具类
- [x] `<html>` 启用 class 模式（next-themes）
- [x] Footer 加 ThemeToggle 切换入口（☾ / ☀）
- [x] 逐步把硬编码颜色换成 CSS 变量引用
  - [x] Navbar / Footer / ThemeToggle / SearchModal
  - [x] BlogList / BlogCard / Blog 列表页标题
  - [x] Blog 详情页（蒙版、返回链接、上一篇/下一篇、TOC、PostHeader）
  - [x] Blog 正文（prose 覆盖、表格、分割线、列表标记、代码块）
  - [x] PostLayout 删除（死代码）
  - [ ] MusicPlayer / MarqueeTechStack / TagCloud / Playground
  - [ ] About / Projects 页面
  - [ ] shared 组件（ProjectCard, SocialIcons, BackToTop, CountUp）
  - [x] `@custom-variant dark` class 模式对接
  - [x] `.spec/tailwind-v4.md` 补充过渡属性规范

## 未来想法

- [ ] Blog 参考 WordPress 老站或其他开源项目加功能
- [ ] 长期维护，逐步丰富内容
