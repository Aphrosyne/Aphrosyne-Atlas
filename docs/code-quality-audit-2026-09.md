# Aphrosyne Atlas 代码质量审计（2026-09）

## 1. 审计摘要

本次审计以当前代码、当前 Git 状态、Next.js 16.2.6 随包文档以及实际静态构建为依据。结论如下：

- **未发现 P0。** 当前 GitHub Pages 静态导出可以成功构建，核心路由、深层刷新、404、主题切换、中文搜索和仓库子路径资源均通过实际验证。
- **发现 4 组 P1：** Next.js 16.2.6 落入当前安全公告影响范围；Blog/Knowledge/About 的窄屏横向溢出；移动导航展开大幅推动正文；全局搜索不是完整的可访问对话框。
- **当前最关键的软件工程债务不是“组件不够漂亮”，而是质量门禁和内容契约没有闭环。** `npm run lint` 当前有 24 个错误、4 个警告，部署工作流又不执行 lint；内容注册表、页面 parser 与搜索索引使用三套近似但不相同的校验和默认值，未来损坏 frontmatter 时可能出现“构建成功、搜索可见、点击 404”或错误 publication 被当作公开内容。
- **静态部署主链路当前可靠。** 8 篇 Blog、13 篇 Knowledge 均生成静态页面；未知 slug 正确进入 404；GitHub Actions 环境构建的 33 个 HTML 中未发现遗漏 `/Aphrosyne-Atlas` 前缀的根相对 `src`/`href`。
- **Blog 与 Knowledge 的差异应保留。** 日期/标签与类型/版本/验证状态是有意义的信息架构差异；应共享 schema、加载、错误报告、阅读壳和样式角色，而不是强行合并元数据。

建议先处理安全版本、P1 移动端与搜索交互，再建立内容 schema 和 CI 门禁；样式 token、重复解析和组件整理可在不重写架构的前提下渐进完成。

## 2. 审计范围与当前基线

### 2.1 开始时工作树

审计开始时执行 `git status --short --branch`：

```text
## master...origin/master [ahead 3]
?? docs/ui-ux-audit-2026-09.md
```

`docs/ui-ux-audit-2026-09.md` 是用户已有的未跟踪文件。本次只读使用，未修改、移动或删除。构建、浏览器验证和依赖审计完成后，写报告前工作树仍为上述状态。

### 2.2 已阅读的项目依据

- 完整阅读根目录 `AGENTS.md`。
- 完整阅读 `docs/atlas-plan.md`，确认项目已经进入静态优先、Blog/Knowledge 共站、GitHub Pages 部署和 1.x 持续维护阶段。
- 完整阅读 `docs/ui-ux-audit-2026-09.md`，复用其中已有的真实 1440/768/390 视口证据，不重复大篇幅审美评价。
- 按问题直接阅读 Next.js 16.2.6 本地文档：静态导出、动态路由、`generateStaticParams`、`dynamicParams`、Route Handler、Server/Client Component、`use client`、Image、字体、`basePath`、public 资源、metadata、error 与 not-found。本文关于 Next.js 行为的判断不依赖旧版本经验。

视觉代码检查使用了 `ui-ux-pro-max`，仅用于颜色/设计令牌、Tailwind/CSS、响应式、动效和可访问性交互；没有让它替代工程审计。静态产物交互使用 `computer-use` 的浏览器流程完成。

### 2.3 实际覆盖

覆盖 `src/app/`、`src/components/`、`src/lib/`、`src/config/`、`src/types/`、`src/mdx-components.tsx`、`scripts/`、Next/ESLint/PostCSS/TypeScript/package 配置、GitHub Pages 工作流、Blog/Knowledge 内容与生成产物。调用链从页面入口追踪到 parser、生成器、配置、客户端消费和静态产物。

当前数据基线：

| 项目 | 数量/状态 |
| --- | --- |
| Blog 源文件 | 8；必需 metadata 均有效 |
| Knowledge 源文件 | 13；必需 metadata 均有效 |
| Knowledge 重复 basename slug | 0 |
| 失效 `related` slug | 0 |
| MDX 本地图片引用 | 47；缺失 0 |
| 搜索索引 | 23 项：2 个页面、8 篇 Blog、13 篇 Knowledge |
| Knowledge loader | 13 个，与内容一致 |
| 静态 HTML | 33 个；另有静态 `/api/blog` 响应 |
| 显式 TypeScript `any` / 非空断言 | 0 / 0 |

## 3. 项目运行和内容处理链路概览

```text
src/content/blog/*.mdx
  ├─ src/lib/posts.ts ── 列表、metadata、静态 slug、相邻文章
  ├─ Next MDX 动态导入 ── Blog 详情正文
  └─ generate-search-index.mjs ── public/search-index.json

src/content/knowledge/**/*.mdx
  ├─ src/lib/knowledge.ts ── 列表、metadata、静态 slug
  ├─ generate-knowledge-registry.mjs ── knowledge-articles.ts ── 动态 loader
  └─ generate-search-index.mjs ── public/search-index.json

SITE / projects / dashboard-layout
  ├─ Server Component 将静态数据传给 Client Component
  ├─ publicPath() 处理 public 资源和搜索 JSON 的 basePath
  └─ next build(output=export) ── out/ ── GitHub Pages
```

`npm run build` 的顺序是资源优化、Knowledge 注册表、搜索索引、`next build`。这保证干净 checkout 可以从已提交 WOFF2/WebP 生成静态站；但内容校验分散在三处，是本次最重要的结构性风险之一。

## 4. P0/P1 问题

本次没有 P0。

### CQ-001 · Next.js 16.2.6 落入当前 critical/high 安全公告范围

- **分类 / 严重程度 / 置信度 / 性质：**安全与依赖；P1；高；技术债、安全风险。
- **位置：**`package.json:18,22`，`package-lock.json` 中的 Next 及其传递依赖；`next.config.ts:14,20-22`。
- **调用链与触发条件：**本地或替代托管环境运行受影响的 Next 服务能力；部分公告需要 Windows-hosted server、Server Actions、Image Optimization、rewrites 或恶意输入。当前 GitHub Pages 产物本身不运行 Next 服务端。
- **证据：**2026-09-14 执行 `npm audit --omit=dev --json`，得到 1 critical、3 high、1 moderate（共 5 个受影响包）。直接依赖 `next@16.2.6` 命中 `GHSA-p293-qw3h-jr36`、`GHSA-2xp9-vwfh-vxw4` 以及多项 high/moderate 公告；审计建议的可修复版本为 16.3.5。`npm explain` 同时确认受影响的内置 `postcss@8.4.31`、`sharp@0.34.5` 和 `nanoid@3.3.12` 路径。
- **实际影响：**当前生产目标是纯静态 GitHub Pages，`output: 'export'`、`images.unoptimized: true`，且代码没有 Server Actions、middleware/proxy 或运行时 rewrites，因此不能把公告标题直接等同为当前线上可利用的 RCE，也不构成 P0。但 Windows 本地开发、未来 Node 托管或重新启用服务端能力会扩大暴露面；继续固定 16.2.6 会让安全基线过期。
- **根因：**版本固定在已经进入公告受影响区间的 Next 16.2.6；缺少依赖安全门禁。
- **推荐修复方向：**单独建立依赖升级任务，先核对目标 Next 版本随包文档，再升级到不受影响的受支持版本；逐项复核静态导出、MDX、React Compiler、Image、动态路由和 GitHub Pages。不要用 `npm audit fix --force` 无差别改锁文件。
- **回归验证：**`npm ci`、lint、TypeScript、两种 basePath 构建、完整静态路由/404/搜索/主题/资源检查，并重新执行 `npm audit --omit=dev`。依赖 CQ-005 的 CI 门禁。

### CQ-002 · Blog、Knowledge 阅读页和 About 在窄屏发生全文横向溢出

- **分类 / 严重程度 / 置信度 / 性质：**正确性、响应式；P1；高；已确认 Bug。
- **位置：**`src/app/layout.tsx:41,49`；`src/app/blog/[slug]/page.tsx:29-40,47-59`；`src/app/knowledge/[slug]/page.tsx:46-67`；`src/components/about/AboutContent.tsx:26-31,76-78`；`src/components/shared/MarqueeTechStack.tsx:18-37`。
- **调用链与触发条件：**根布局 flex item → 页面外壳 → 阅读面板 → 长标题、表格/代码、上下篇 flex 或 `w-max` 跑马灯；390px 手机和 768px 平板更容易触发。
- **证据：**视觉审计的真实 DOM 量测记录：390px 下 MDX 样式帖文档宽 970px、Experience Knowledge 720px、About 768px；正文和头像被推出视口。当前代码中根 `main` 未声明 `min-w-0`，Blog/Knowledge/About 外壳的可收缩约束不一致，跑马灯内部使用 `w-max`。
- **实际影响：**手机读者看不到完整正文或需要整页横向拖动；长文、表格和中文/英文混排会放大问题，属于常见核心阅读路径故障。
- **根因：**flex/grid 子项的 min-content 宽度向上传播，阅读壳缺少一致的 `w-full min-w-0` 边界；局部可横滚内容没有被限制在局部容器。
- **推荐修复方向：**逐层确定最小可收缩边界；只让 `pre`/table 等必要区域局部横滚；重验上下篇导航、Knowledge 三栏和 About 跑马灯。禁止用全局 `overflow-x-hidden` 掩盖不可访问内容。
- **回归验证：**320/390/768 深浅主题，三篇压力样本的 `document.scrollWidth <= clientWidth + 1`；长 URL、长英文、表格、代码和图片仍完整；重验 TOC、hash、Footer。与 CQ-012 共同验收。

### CQ-003 · 移动导航展开会把正文向下推动约 506px

- **分类 / 严重程度 / 置信度 / 性质：**交互正确性、响应式；P1；高；已确认 Bug。
- **位置：**`src/components/layout/Navbar.tsx:135-136,195-209,234-276`。
- **调用链与触发条件：**手机点击菜单 → `menuOpen` → `AnimatePresence` 在 sticky `header` 的正常文档流中插入全部导航及子项。
- **证据：**390×844 实测 header 高度从 60px 增到 566px，Projects 标题 y 从 124 移到 630；源码确认菜单没有 absolute/fixed 脱离文档流。
- **实际影响：**内容位置突变，用户失去阅读上下文；小屏横屏时菜单还可能超过可视高度。
- **根因：**把可展开的全量菜单作为 header 普通块级子元素渲染，未定义焦点、滚动锁和视口高度策略。
- **推荐修复方向：**改为受视口约束的 popover/drawer，并明确 Escape、背景交互、关闭后焦点恢复和菜单内部滚动；保留全部导航入口。
- **回归验证：**展开前后正文几何位置不变；320/390/横屏可访问全部项；键盘和触控均能关闭并完成导航。与 CQ-004、CQ-011 共享焦点验收。

### CQ-004 · 全局搜索不是完整的模态对话框

- **分类 / 严重程度 / 置信度 / 性质：**可访问性交互；P1；高；已确认 Bug。
- **位置：**`src/components/layout/SearchModal.tsx:57-118`；触发器 `src/components/layout/Navbar.tsx:211-229`。
- **调用链与触发条件：**点击搜索 → Navbar 设置 `searchOpen` → SearchModal 在 header 内渲染 overlay 和面板 → Tab/Shift+Tab/Escape/关闭或结果跳转。
- **证据：**对 GitHub Pages 子路径静态产物实际操作：中文 `Experience` 能返回正确 Knowledge 条目，但 DOM/AX 中没有 `dialog`/`aria-modal`，背景 Profile、GitHub、导航和文章链接仍暴露在可访问树；输入名称仅来自 placeholder；没有焦点闭环、背景隔离、显式关闭按钮或焦点归还。视觉审计也已实际复现 Tab 进入背景控件。
- **实际影响：**键盘和读屏用户可能离开弹窗而不知情；手机缺少清晰关闭路径；搜索虽然功能可用，但核心交互不满足可访问对话框契约。
- **根因：**实现只覆盖视觉 overlay 和初始 focus，没有实现完整的对话框生命周期。
- **推荐修复方向：**为现有玻璃面板补 `dialog`/`aria-modal`、稳定标题/输入名称、焦点 trap、背景 inert、关闭按钮、Escape 和触发器焦点恢复；路由跳转后将焦点送到页面主标题或提供可感知导航。
- **回归验证：**键盘双向循环、读屏地标、手机软键盘、Escape、overlay/关闭按钮、结果导航和关闭后焦点；故障/空/加载状态同时覆盖 CQ-007。

## 5. P2 问题

### CQ-005 · lint 基线失败，部署工作流没有质量门禁

- **分类 / 严重程度 / 置信度 / 性质：**工程质量、CI；P2；高；技术债、测试缺口。
- **位置：**`package.json:10-13`；`.github/workflows/deploy-pages.yml:28-40`；`src/app/blog/[slug]/page.tsx:22-74`；四个 effect 组件。
- **调用链与触发条件：**本地 `npm run lint`；master push 的部署工作流只执行 `npm ci` 和 build。
- **证据：**lint 返回 28 个问题：20 个 `react-hooks/error-boundaries` 错误集中在 Blog 详情的 JSX `try/catch`，4 个 `react-hooks/set-state-in-effect` 错误（ClockCard:23、TagCloud:11、ThemeToggle:10、GlowDots:33），4 个 `<img>` 警告。build 仍通过，CI 也不会单独拦截 lint。
- **实际影响：**仓库长期处于“官方质量命令必然失败”的状态，新问题无法与旧基线区分；Blog 页 try/catch 看似兜底，实际不能捕获 React 子树渲染错误，还把内容加载错误统一变成 404，降低诊断质量。
- **根因：**升级后的 React/ESLint 规则未收敛，且部署流程没有把 lint/类型检查作为独立任务。
- **推荐修复方向：**先调整 Blog 页面，只在数据/导入边界处理“内容不存在”，不要包裹 JSX；逐个判断 effect 是否需改为初始化/外部 store/hydration guard，必要的例外应有局部说明；随后把 lint 和 `tsc --noEmit --incremental false` 加入 CI。
- **回归验证：**lint 零错误；现有文章导入失败能给出可诊断构建错误或明确 404；CI 故意引入 lint 错误时阻断部署。依赖 CQ-020 的测试策略。

### CQ-006 · 内容注册、页面解析和搜索索引没有统一 schema，且 publication 对非法值 fail-open

- **分类 / 严重程度 / 置信度 / 性质：**正确性、数据契约、发布安全；P2；高；潜在缺陷、技术债。
- **位置：**`src/types/publication.ts:5-9`；`src/lib/posts.ts:11-29,43-50`；`src/lib/knowledge.ts:50-75,90-117`；`scripts/generate-knowledge-registry.mjs:14-25`；`scripts/generate-search-index.mjs:17-19,31-60`。
- **调用链与触发条件：**新增/损坏 MDX frontmatter，尤其缺失字段、非法 `publication`、空字符串、错误日期或 loader/parser 规则漂移。
- **证据：**页面 parser 对缺失必需字段返回 `null` 且不报告文件；Knowledge loader 生成器只跳过字面值 `draft`，不验证 type/status/title；搜索生成器给缺失 title/excerpt 提供回退并继续索引；两处 publication parser 都把缺失或非法值默认为 `published`。因此一份损坏内容可以被 loader/搜索接纳，却不进入 `generateStaticParams`，形成可搜索的 404；`publication: private` 等拼写错误会被当作公开内容。当前 21 个内容文件经额外只读校验均有效，尚未发生该故障。
- **实际影响：**Knowledge 扩展后最危险的失败模式是构建成功但内容面不一致；fail-open publication 还会增加误发布风险。`.private/` 是当前真正的安全边界，frontmatter 不能替代它。
- **根因：**同一事实在 TypeScript parser、registry 脚本和 search 脚本重复实现；类型只约束消费端，不校验外部 MDX 数据。
- **推荐修复方向：**建立一个可由 Node 生成脚本和应用端共同调用的运行时 schema/规范化层；非法枚举和必需字段应带文件路径令构建失败；对“缺失 publication 默认公开”的历史兼容做一次明确迁移决策，非法显式值至少 fail-closed。保留 Blog/Knowledge 各自 schema，不合并业务字段。
- **回归验证：**表驱动 fixture 覆盖空/错/缺字段、CRLF、中文、空格路径、重复 slug、错误 related、draft/unlisted/archived；断言 registry、路由和搜索对同一输入给出一致结果。

### CQ-007 · 搜索索引加载没有错误、取消、响应校验和状态模型

- **分类 / 严重程度 / 置信度 / 性质：**异步正确性、降级；P2；高；潜在缺陷。
- **位置：**`src/components/layout/SearchModal.tsx:23-55,95-113`。
- **调用链与触发条件：**打开搜索 → fetch `publicPath('/search-index.json')` → 快速关闭/重复打开、404、非 JSON、慢网或组件卸载。
- **证据：**effect 直接 `.then(r => r.json()).then(setData)`，没有 `response.ok`、catch、AbortController、运行时 shape 校验；100ms focus timer也未清理。失败时可能产生未处理 Promise，界面既不显示 loading 也不显示失败；重复打开会重复请求并允许旧响应覆盖新生命周期。未做故障注入，因此“当前必然报错”不成立。
- **实际影响：**索引缺失或 CDN/路径故障时用户只看到没有反馈的空面板，控制台可能报未处理异常；未来索引增大时竞态和重复传输更明显。
- **根因：**异步资源被当作永远成功的本地常量，缺少可辨识的 `idle/loading/ready/error` 状态。
- **推荐修复方向：**缓存一次成功结果；使用 AbortController/失效标志和 timer cleanup；检查状态码与 JSON 结构；展示加载、失败和重试，保持静态站核心导航不依赖搜索。
- **回归验证：**正常、慢速、404、500、无效 JSON、连续开关、路由切换和 basePath；确保无未处理 Promise、旧响应覆盖或失焦。与 CQ-004 一起实施。

### CQ-008 · 搜索声称支持项目，但没有索引具体项目

- **分类 / 严重程度 / 置信度 / 性质：**功能契约；P2；高；已确认 Bug。
- **位置：**`src/components/layout/SearchModal.tsx:85`；`scripts/generate-search-index.mjs:63-74`；`src/config/projects.ts:13-50`。
- **调用链与触发条件：**搜索现有项目标题，例如 `CommunityOS`。
- **证据：**placeholder 为“搜索文章、知识库、项目...”，生成器却只加入通用 `/projects` 页面，没有读取 `projects` 配置。静态产物实际输入 `CommunityOS` 显示“没有找到相关结果”，而该项目确实存在。
- **实际影响：**全局搜索的可见承诺与能力不一致；新增项目不会被发现。
- **根因：**搜索索引只整合内容目录和两个手写页面条目，没有共享项目数据源。
- **推荐修复方向：**在生成器中安全读取/共享可序列化项目数据，或将项目索引条目放到独立纯数据模块；不要在生成器复制项目列表。
- **回归验证：**三个项目标题、标签、中文描述均可命中并跳到详情；重复 href 和特殊字符有测试。

### CQ-009 · 导航“标签”链接是无效状态，Knowledge 相关文档也不是链接

- **分类 / 严重程度 / 置信度 / 性质：**导航与内容关系；P2；高；已确认 Bug、一致性问题。
- **位置：**`src/config/site.ts:69-75` → `src/components/blog/BlogList.tsx:20-30`；`src/content/knowledge/guides/mod-organizer-profile-migration-checklist.mdx:9` → `src/app/knowledge/[slug]/page.tsx:83-86`。
- **调用链与触发条件：**点击 Navbar 的“标签”，或在迁移清单文章底部使用“相关文档”。
- **证据：**Navbar 生成 `/blog?view=tags`，BlogList 只识别 `view=archive`，所以 tags 与普通列表完全相同；Knowledge 当前唯一非空 related 指向有效 slug，但渲染使用 `entry.related.join('、')`，只显示内部 slug 文本。
- **实际影响：**两个明确的导航承诺都不能完成预期动作；Knowledge 关系模型存在却无法帮助读者跳转。
- **根因：**配置和消费端状态协议未同步；related 被建模成 slug，但展示层未解析为标题与 URL。
- **推荐修复方向：**为 Blog 明确定义 tags 视图或移除该子入口（由产品决定）；Knowledge 在已校验 slug 基础上解析标题并渲染 Link，缺失关系构建失败或明确降级。
- **回归验证：**直接访问/点击 `?view=tags`、浏览器前进后退、标签筛选；related 正常/缺失/循环关系与 basePath 跳转。

### CQ-010 · 全站语义和键盘路径存在成组缺陷

- **分类 / 严重程度 / 置信度 / 性质：**可访问性；P2；高；已确认 Bug、技术债。
- **位置：**`src/app/layout.tsx:36-49`；多个页面自身 `<main>`，如 `src/app/knowledge/page.tsx:17` 与两类详情页；`src/components/layout/Navbar.tsx:32-124`；`src/components/layout/BackToTop.tsx:10-35`。
- **调用链与触发条件：**中文页面读屏、键盘访问桌面下拉、初始或历史恢复滚动、Tab 到隐藏回顶按钮。
- **证据：**导出 HTML 的 Blog、Knowledge 列表/详情均有 2 个 `<main>` 且 `lang="en"`；桌面下拉仅由 mouse enter/leave 打开，Link 上虽有 `aria-expanded` 但没有键盘展开动作；BackToTop 隐藏时只有 opacity/pointer-events，静态首页 AX 在顶部仍列出该按钮，effect 也没有初次调用 `handleScroll`。
- **实际影响：**页面语言和地标错误，子导航对键盘/部分触控路径不可达，不可见按钮可能获得焦点，历史恢复时可见状态不正确。
- **根因：**根布局和页面各自声明主地标；视觉隐藏与交互隐藏混用；hover 菜单把“去板块”和“展开子项”放在同一个 Link 语义上。
- **推荐修复方向：**根或页面只保留一层 `main`，设置适合中文主体的 lang；板块链接与展开按钮分责；不可见回顶控件移出 Tab/AX 并初始化滚动状态；选中筛选补适合的 `aria-current`/`aria-pressed`。
- **回归验证：**导出 HTML 地标检查、纯键盘全站路径、读屏语言、触控平板断点、历史滚动恢复。不要把所有控件机械改成同一种 ARIA 角色。

### CQ-011 · reduced-motion 策略只覆盖部分组件

- **分类 / 严重程度 / 置信度 / 性质：**可访问性、动效；P2；中高；潜在缺陷。
- **位置：**`src/app/globals.css:75-81`；`src/components/home/HeroSection.tsx:17-43,61-72`；`src/components/home/TagCloud.tsx:21-67`；`src/components/home/Dashboard.tsx:40-65,130-138`；SearchModal、PageTransition、BackToTop。
- **调用链与触发条件：**用户系统启用 `prefers-reduced-motion: reduce`。
- **证据：**CSS 仅暂停 banner/marquee；Backdrop 与 Knowledge 卡片有 reduced-motion 分支，但 Hero 连续 flow/float、词云旋转、Dashboard 多方向入场、搜索缩放、回顶 smooth scroll 等没有统一降级。当前浏览器环境不能模拟 reduce=true，因此没有伪称运行通过。
- **实际影响：**特定辅助功能用户仍会看到连续旋转和空间位移；暂停跑马灯后被裁切的技能也未变成完整静态清单。
- **根因：**动效参数和偏好处理分散在 CSS、Framer Motion 和事件代码。
- **推荐修复方向：**建立轻量共享 motion policy；reduce 下取消连续运动和空间飞入，保留即时反馈；跑马灯改为完整可换行静态降级。无需删除默认 Hero 或品牌动效。
- **回归验证：**真实 reduce=true 与默认模式各跑一遍首页、导航、搜索、长文目录和回顶；内容必须完整可达。

### CQ-012 · MDX 图片没有尺寸预留，加载会改变长文几何

- **分类 / 严重程度 / 置信度 / 性质：**布局稳定性、性能；P2；高；潜在缺陷。
- **位置：**`src/mdx-components.tsx:41-48`；内容资产生成 `scripts/optimize-static-assets.mjs:132-189`。
- **调用链与触发条件：**长教程首次加载或慢网 → 原生 lazy `<img>` 无 width/height → 图片解码后插入高度；随后影响 hash/TOC。
- **证据：**Boss 教程实测未加载时图片框可为 0×0，加载后首图为 734×412.875；组件只设置 `h-auto max-w-full`，47 个当前本地图片引用都存在但没有统一尺寸 metadata。没有生产 CLS trace，因此不把风险写成已测 CLS 超标。
- **实际影响：**长文后续内容和已经定位的章节可能被下推，阅读与目录状态不稳定。
- **根因：**资产管线转换图片时没有输出尺寸清单，MDX 渲染也没有比例信息。
- **推荐修复方向：**在构建/内容导入阶段提取真实 width/height 或 aspect-ratio，并由 MDX 组件预留；保留 lazy、原图比例与 `publicPath`，不需要图片服务。
- **回归验证：**慢网/禁用缓存、hash 直接进入图片后章节、不同长宽比；记录生产 CLS 作为补充。与 CQ-002、CQ-014 联合验收。

### CQ-013 · 目录在文末可能无法激活最后章节

- **分类 / 严重程度 / 置信度 / 性质：**状态同步；P2；高；已确认 Bug。
- **位置：**`src/components/blog/TableOfContents.tsx:84-143`，尤其固定 activation line `:98-107`。
- **调用链与触发条件：**点击靠近文末的短章节或滚动到文章底部；最后标题无法到达 `scrollY + 144` 激活线。
- **证据：**Blog 文章点击“结论”后页面进度已 100%，目录仍高亮上一节“解决方式”；算法只选择通过固定激活线的最后一个标题，没有文末覆盖规则。
- **实际影响：**目录当前状态与实际位置不一致，图片后加载还会放大错位。
- **根因：**标题激活和文章滚动进度是两套计算，文末边界没有合并。
- **推荐修复方向：**滚动接近文章/文档末端时显式选择最后可见章节；保留现有 ResizeObserver 和清理逻辑，不通过增加巨额底部空白凑激活线。
- **回归验证：**短末节、长末节、hash 点击、图片前后、缩放和浏览器恢复滚动。

### CQ-014 · `npm start` 与静态导出配置确定性冲突

- **分类 / 严重程度 / 置信度 / 性质：**开发流程；P2；高；已确认 Bug。
- **位置：**`package.json:11-13`；`next.config.ts:14`。
- **调用链与触发条件：**构建后按标准脚本运行 `npm start`。
- **证据：**实际执行 `npm start -- --port 4180`，Next 16.2.6 立即退出码 1：`"next start" does not work with "output: export" configuration`，并要求使用静态服务器服务 `out`。
- **实际影响：**README/开发者习惯中的生产预览入口不可用，也容易让人误用开发服务器代替静态验收。
- **根因：**项目切换到 `output: 'export'` 后保留了默认 `next start` 脚本。
- **推荐修复方向：**单独任务将预览脚本改为固定、可复现的静态服务器方案，或明确移除不可用脚本；不要在本审计中新增依赖。
- **回归验证：**build 后通过脚本打开首页、深层路径、404、basePath 和正确 MIME；进程可正常退出。

### CQ-015 · basePath 推导支持当前 Pages，但会阻碍未来自定义域名

- **分类 / 严重程度 / 置信度 / 性质：**部署架构；P2；高；潜在缺陷、技术债。
- **位置：**`next.config.ts:4-18`；`src/lib/public-path.ts:1-5`；`src/config/site.ts:20`。
- **调用链与触发条件：**GitHub Actions 中部署到未来自定义域名根路径；`GITHUB_ACTIONS=true` 仍自动把仓库名作为 basePath。
- **证据：**当前唯一规则是“Actions + repositoryName ⇒ `/${repositoryName}`”，没有显式部署目标覆盖。当前 GitHub Pages 项目站构建经过实际验证完全正确；风险只在路线图所说的未来自定义域名/其他静态托管。
- **实际影响：**同一 workflow 切到自定义域名根路径时，所有 Next 链接、`_next`、图片和搜索 JSON 仍带仓库前缀。
- **根因：**把“运行在 GitHub Actions”与“托管在仓库子路径”视为同一事实。
- **推荐修复方向：**建立一个显式、可验证的部署 basePath 输入；默认策略和 SITE canonical URL 同源，避免在组件复制仓库名。
- **回归验证：**空 basePath、`/Aphrosyne-Atlas`、自定义域名三组构建快照；扫描 HTML 与真实静态预览。

### CQ-016 · robots 指向不存在且与当前站点配置不一致的 sitemap

- **分类 / 严重程度 / 置信度 / 性质：**SEO、发布一致性；P2；高；已确认 Bug。
- **位置：**`public/robots.txt:4`；`src/config/site.ts:20`。
- **调用链与触发条件：**爬虫读取 robots 后请求 sitemap。
- **证据：**robots 写死 `https://aphrosyne.dev/sitemap.xml`，当前 SITE URL 是 `https://aphrosyne.github.io/Aphrosyne-Atlas`，仓库中没有任何 sitemap 文件或 metadata route。
- **实际影响：**爬虫得到无效/错误站点地图提示；站点 URL 有多个事实来源。
- **根因：**历史域名字符串没有与部署配置和生成流程连接。
- **推荐修复方向：**先确定 canonical 域名，再由 metadata route 或构建期单一配置生成 robots/sitemap；不要继续手工复制域名。
- **回归验证：**导出文件存在、URL 与 SITE/basePath 策略一致、所有公开路由被覆盖、draft/unlisted 不泄露。

### CQ-017 · 设计 token 只覆盖基础颜色，状态、表面、阴影、层级和动效仍有多个事实来源

- **分类 / 严重程度 / 置信度 / 性质：**样式一致性、可维护性；P2；高；技术债。
- **位置：**`src/app/globals.css:6-43`；Knowledge 列表 `src/components/knowledge/KnowledgeList.tsx:12-29` 与详情 `src/app/knowledge/[slug]/page.tsx:10-27`；Dashboard `src/components/home/Dashboard.tsx:40-75`；Navbar/Search/阅读面板。
- **调用链与触发条件：**调整浅/深主题、状态色、玻璃层级、统一 focus 或动效节奏时。
- **证据：**全局只有 8 个语义颜色变量；Knowledge status label/class 在列表和详情重复；阅读面板阴影在 Blog/Knowledge 复制，Project 使用近似但不同 alpha；31 处 backdrop blur、21 处 shadow、112 处 rounded 类分布在大量组件。浅色 Knowledge 仍直接使用 `text-emerald-300`/`amber-200`/`rose-200`，实际可读性不足。Dashboard/Hero 的白色透明文字是有意“表达玻璃”特例，但缺少命名角色。
- **实际影响：**同一语义在不同页面逐渐漂移，浅色和可访问状态修复需要多点搜索，未来设计系统与 Blog/Knowledge 扩展成本上升。
- **根因：**主题只抽象了原子颜色，组件层语义角色仍由任意 Tailwind 值和复制字符串表达。
- **推荐修复方向：**渐进建立 status fg/bg/border、expressive/content/reading/dialog surface、focus、shadow、z-layer 和 motion 时序；保留 Hero/头像/Meme 等局部常量，不要求所有 px/ms 变量化。
- **回归验证：**状态矩阵、深浅主题对比、focus、hover/active/disabled、玻璃复合背景；组件快照或 Story/测试页覆盖共享角色。

### CQ-018 · 内容在构建期间被重复扫描和解析，Knowledge 增长后成本近似按页面数放大

- **分类 / 严重程度 / 置信度 / 性质：**性能、架构；P2；高；扩展风险、技术债。
- **位置：**`src/lib/knowledge.ts:90-123`；`src/lib/posts.ts:43-100`；两类详情页的 `generateMetadata` 与 page；`src/app/page.tsx:8-12`。
- **调用链与触发条件：**每个 Knowledge 详情：metadata 调 `getKnowledgeBySlug` 扫全库，page 再扫全库并调用 `getAllKnowledge` 再扫；Blog metadata/page/相邻导航也重复读取。内容数量扩大时触发。
- **证据：**`getKnowledgeBySlug` 不是定点读文件，而是 `readKnowledgeEntries()` 扫描所有 `**/*.mdx`；无 memo/cache 或共享构建索引。当前仅 13+8 篇，完整 build 约 9 秒，尚未形成实际性能故障。
- **实际影响：**Knowledge 扩展后构建 I/O 和 gray-matter 解析量按“页面数 × 内容数”增长，CI 时间与本地反馈恶化。
- **根因：**为简单实现复用“读全库”函数，没有建立一次构建内的 canonical 内容索引。
- **推荐修复方向：**在 CQ-006 schema 完成后，构建一次不可变 metadata map/list，让列表、slug lookup、static params、search 共用；不要提前引入数据库或运行时服务。
- **回归验证：**相同产物 hash/路由/排序，记录 20/100/500 条 fixture 的读取次数和 build 时间。

### CQ-019 · 首页默认向两个第三方端点发送访客请求，隐私边界没有对用户说明

- **分类 / 严重程度 / 置信度 / 性质：**隐私、外部依赖；P2；高；发布风险。
- **位置：**`src/config/site.ts:44-49`；`src/components/home/Dashboard.tsx:277-299,315-340`。
- **调用链与触发条件：**任何访问首页且启用 JavaScript 的用户 → 浏览器请求 Hitokoto 与 GitHub Gist raw endpoint。
- **证据：**两个 fetch 都在客户端 mount effect 自动执行；因此第三方会收到访客 IP、User-Agent/网络元数据。代码有 AbortController、状态码检查和本地 fallback，第三方失败不会破坏核心页面，这是做得好的部分；但站点未声明该联网行为。
- **实际影响：**静态站并不等于完全离线或零第三方请求；隐私预期和 CSP/地区网络可用性需要明确。没有 cookie、token 或用户内容上传证据。
- **根因：**动态个性组件采用直接客户端 API，产品说明只强调静态部署而未区分第三方运行时请求。
- **推荐修复方向：**由站点所有者选择：明确隐私说明、改为构建期快照/自托管静态数据，或提供关闭开关；保持当前失败降级。不要为此引入常驻服务端。
- **回归验证：**离线/阻断第三方仍有稳定内容；网络面板只出现已声明域名；无敏感参数。

### CQ-020 · 核心发布链路没有自动化回归测试

- **分类 / 严重程度 / 置信度 / 性质：**测试；P2；高；测试缺口。
- **位置：**`package.json:5-14` 没有 test 脚本；仓库无测试目录/fixture；部署 workflow 只 build。
- **调用链与触发条件：**新增内容类型、修改 parser/search/basePath/路由/交互后。
- **证据：**当前关键行为只能靠 build 和人工浏览器：publication 状态、重复 slug、损坏 metadata、搜索 schema、GitHub Pages 子路径、未知 slug、modal focus、移动溢出均没有自动防回归。
- **实际影响：**CQ-006、CQ-007、CQ-015 这类“特定内容或部署环境才出现”的缺陷容易在成功 build 下进入主分支。
- **根因：**项目从个人博客逐步演进，功能链路先完成，测试基线未同步建立。
- **推荐修复方向：**优先少量高价值测试：parser/schema 单元测试；registry/search 集成 fixture；两种 basePath 的 build smoke；静态服务器下路由/404/资源；搜索和键盘焦点的浏览器测试。无需一开始追求全组件快照覆盖。
- **回归验证：**测试必须能在 CI 干净 checkout、Windows 中文路径 fixture 和 Linux runner 中重复运行。

## 6. P3 与一致性问题

### CQ-021 · 小型 timer 生命周期和重复点击竞态未统一处理

- **分类 / 严重程度 / 置信度 / 性质：**客户端生命周期；P3；中高；潜在缺陷。
- **位置：**`src/lib/useBounce.ts:3-14`；`src/components/layout/Navbar.tsx:43-54`；Search focus timer。
- **证据与影响：**`useBounce` 不保存/清理 timeout，快速重复点击时旧 timer 会提前结束新动画，卸载后仍会触发 setState；Navbar 延迟关闭 timer 未在卸载时清理。影响局部、短暂，不是当前核心故障。
- **修复与验证：**用 ref 清理并在重复触发前取消旧 timer；fake timer 或快速点击/路由卸载测试。可与 CQ-007 一起整理。

### CQ-022 · 未使用组件和生产导出中的开发 Studio 增加维护/产物噪声

- **分类 / 严重程度 / 置信度 / 性质：**代码组织、bundle；P3；高；技术债。
- **位置：**未找到调用方的 `FeaturedProjects`、`RecentPosts`、`SkillsShowcase`、`AnimatedEntrance`、`AnimatedSection`、`Button`、`CountUp`、`GlowDots`、`GradientText`；`src/app/studio/dashboard/page.tsx:10-12`。
- **证据与影响：**上述组件没有活动入口 import；GlowDots 仍产生 lint 错误。生产 build 仍生成 `out/studio/dashboard/index.html`（内容为 `NEXT_HTTP_ERROR_FALLBACK;404`、noindex）并把 Studio 文案打入 JS chunk。公开访问显示 404，但静态服务器会为现有文件返回 200，且开发工具代码仍随产物发布；不含秘密，故不升为安全问题。
- **修复与验证：**确认无历史/计划依赖后删除死代码或移到明确实验区；决定 Studio 是本地独立工具还是公开构建路由。先测 bundle/开发流程收益，不机械清理。

### CQ-023 · 命名和类型总体良好，但共享语义常量与错误文案仍漂移

- **分类 / 严重程度 / 置信度 / 性质：**一致性；P3；高；可选重构。
- **位置：**Knowledge status/type 两份映射；Project status 两份映射；Navbar/Dashboard/About 三份 `superellipsePath`；`src/components/shared/SocialIcons.tsx` 的宽 Record；`src/types/post.ts:13-15` 未使用的 `Post`；`src/app/error.tsx:12-18` 与 `not-found.tsx:6-15` 英文文案。
- **证据与影响：**这些不会直接导致当前构建失败，但修改标签、状态色、头像裁切或错误语气要多点同步。错误边界还直接展示 `error.message`，当前静态站风险低，但不宜把任意客户端错误细节当作用户文案。
- **修复与验证：**只抽取有真实复用语义的常量/类型；错误页使用稳定中文用户文案并把诊断留给日志。不要为了统一默认导出、文件名或短局部常量做无收益重写。

## 7. 命名与代码风格审计

总体评价：命名大多表达业务含义，`KnowledgeType`、`KnowledgeStatus`、`PublicationState`、`DashboardCardId` 等联合类型清晰；事件处理器普遍使用 `on...`/`handle...`，布尔值 `open`、`visible`、`showingArchive` 为肯定语义。`@/*` import 边界一致，默认导出主要用于组件和页面，命名导出用于数据/工具，当前没有因导出风格造成误用。

需要治理的是“同一概念多个实现”而不是格式偏好：

- `TYPE_LABELS`/`STATUS_LABELS`/`STATUS_CLASSES` 在 Knowledge 列表和详情重复；状态文案与视觉角色应有单一来源。
- 内容 publication 的名称统一，行为却分别实现在 types、两个 parser 和搜索脚本中，属于契约漂移而非命名错误。
- `NAV_ITEMS` 把 `view=tags` 当成有效协议，但 BlogList 未实现，说明配置键缺少消费端类型约束。
- `superellipsePath` 的三份复制当前参数相同，已达到值得共享的程度；Hero/Dashboard 的个性化动效数值则是合理局部常量。
- Blog/Knowledge 的 metadata 字段不同是有意设计，不建议为了“统一”改成一个过宽接口。

## 8. 颜色、样式和设计令牌审计

### 8.1 当前来源

- `globals.css` 提供深浅两套 `bg/surface/fg/muted/accent/avatar-ring/border/code-bg`，并通过 Tailwind v4 `@theme inline` 映射；这是有效的单一基础颜色源。
- `content-card.ts` 已共享列表卡片 surface/padding/focus；应作为渐进抽取范例，而非建立巨型万能 Card。
- 组件层仍大量使用 Tailwind alpha、任意 shadow/blur/圆角以及白色表达色。代码扫描得到 31 处 backdrop blur、21 处 shadow、112 处 rounded 类；数量本身不是错误，但状态/阅读面板/弹窗等重复语义已形成维护成本。

### 8.2 判断

- **应该 token 化：**Knowledge 状态三元组、archived、on-accent、focus、阅读/内容/表达/dialog 四类 surface、常用 shadow、z-layer、动效时序与导航/锚点高度。
- **可以保留为局部常量：**Hero 渐变节点、头像超椭圆参数、Meme 弹跳曲线、具体背景切换方向、单个 SVG strokeWidth；它们有明确局部语义，变量化收益低。
- **现有明确缺陷：**深色 accent 上小号白字对比不足；浅色 Knowledge 状态仍用浅色前景；代码块固定暗色主题与浅色行号 token 不匹配。详细视觉证据已在 UI/UX 审计，本报告只把它们归入 CQ-017 的工程根因。
- **不建议：**把所有透明度、圆角和毫秒数强制改成变量，或抹平 Dashboard 表达玻璃与长文阅读玻璃的合理差异。

## 9. 架构与可维护性分析

- Dashboard 约 360 行并混合布局、远端数据卡和表现组件；当前规模仍可理解，远端卡已有运行时校验和降级，不值得一次性大拆。若后续增加卡片，应先把远端数据 hook/卡片边界分离。
- Blog 和 Knowledge 应共享：内容 schema 基础设施、publication 语义、MDX 阅读组件、搜索文档模型、错误报告和静态路径测试。它们不应共享：Blog 日期/相邻文章与 Knowledge 类型/状态/版本/related/sources。
- 生成文件边界基本清楚：`knowledge-articles.ts` 有生成注释且只有变化时写入；`search-index.json` 和 `out/` 被忽略。问题是源数据到两个生成产物缺少共同验证。
- `SITE`、projects、dashboard layout 已集中，是良好基础。域名/robots/basePath 仍需要统一部署事实源。
- 当前最需要避免的大重写是引入数据库、全局状态库或内容平台；静态构建内的 schema 和索引足以解决主要债务。

## 10. TypeScript 与数据契约

- `strict: true`，`npx tsc --noEmit --incremental false` 通过；没有显式 `any` 和非空断言。
- Studio 的 `Object.fromEntries(...) as Layout` 由固定 `DASHBOARD_CARD_IDS` 构造；drag id 断言后立即用 includes 校验，当前属于可接受折中。
- Knowledge 查询参数先检查 keys 再断言联合类型，当前安全；可抽 type guard 提高可读性，但不是 Bug。
- 真正的运行时不安全边界是 MDX frontmatter 和生成 JSON，而非组件 props。SearchModal 的 `SearchItem[]` 仅是 TypeScript 声明，没有验证网络 JSON。
- `SocialIcons` 若使用 `Record<SocialPlatform, JSX.Element>` 可让 SITE 扩展时编译期发现缺图标；属于 P3。

## 11. 性能与运行成本

- 当前静态 build 约 9 秒，21 篇内容规模下可接受；CQ-018 是扩展风险，不建议在没有基准前引入复杂缓存框架。
- 首页 Dashboard 必须是 Client Component，因为包含远端 fetch、时钟、弹跳和 Framer Motion；把它整体标 client 是当前可接受的工程折中。服务端仍预先提供文章/Knowledge/项目数据。
- Backdrop 的 transition id 防止旧动画完成回调覆盖新背景，Dashboard 远端 fetch 和 TOC 的 observer/listener/RAF 都有清理；这些不应在重构中丢失。
- 31 处 blur 不等于 31 层同时合成；实际风险集中在 Dashboard/阅读面板/导航/弹窗重叠与整层 opacity/transform。没有 GPU trace，不能宣称已确认性能退化。
- 原生 MDX 图片配合静态 export 和 arbitrary dimensions 是合理选择；问题是尺寸预留，不是“必须换成 Next Image”。

## 12. 安全和隐私风险

- 除 CQ-001 和 CQ-019 外，未发现当前应用中的 `new Function`、`eval`、`dangerouslySetInnerHTML` 或动态 HTML 注入。`AGENTS.md` 关于旧 `posts.ts` 使用正则/`new Function` 的说明已经落后于代码；当前实际使用 `gray-matter`。
- MDX 可执行 JSX/组件，因此信任边界是“仓库中经过审阅的内容”。当前没有从不受信任用户输入动态编译 MDX，不构成远程注入漏洞；未来内容导入必须继续经过审核，不能把外部 MDX 直接放入 `src/content`。
- `git ls-files` 和模式扫描未发现被跟踪的 `.env*`、`.private/**`、token、私钥；`.private/`、`.env*`、原始图片目录已忽略。`publish-dashboard-status.py` 从环境或私有文件读取 token，不打印 Authorization 值。
- `NEXT_PUBLIC_BASE_PATH` 是公开构建配置，暴露没有问题；SITE 中的 Gist ID 和公共 API URL 不是秘密。
- Route Handler `/api/blog` 是静态 GET，符合 Next 16 静态导出能力；没有运行时 API/Server Action 与部署目标冲突。

## 13. 测试缺口

按价值排序：

1. 内容 schema/发布状态/重复 slug/related 的单元与 fixture 测试。
2. registry、search、route params 三者一致性的集成测试。
3. 空 basePath 与仓库 basePath 的静态 build smoke，检查所有 HTML/JSON/图片/字体。
4. 搜索 modal 键盘、失败注入、项目索引和路由跳转的浏览器测试。
5. 320/390/768 的 overflow、移动菜单几何和长文图片/hash 测试。
6. unknown slug、404、draft/unlisted/archived 的发布测试。
7. reduced-motion、读屏与真实移动软键盘人工验收。

不建议优先做低信息量的全组件快照；上述测试直接保护发布链路。

## 14. 技术债登记表

| ID | 问题类型 | 严重度 | 影响范围 | 修复成本 | 建议阶段 | 依赖 |
| --- | --- | --- | --- | --- | --- | --- |
| CQ-001 | 依赖安全 | P1 | 开发/未来服务端托管 | 中 | 发布前必须处理 | CQ-005 |
| CQ-002 | 响应式正确性 | P1 | Blog/Knowledge/About 手机阅读 | 中 | 发布前必须处理 | CQ-012 |
| CQ-003 | 移动导航 | P1 | 全站手机 | 中 | 发布前必须处理 | CQ-004、CQ-010 |
| CQ-004 | 搜索可访问性 | P1 | 全站搜索 | 中 | 发布前必须处理 | CQ-007 |
| CQ-005 | lint/CI | P2 | 全仓库 | 中 | 当前 1.x | CQ-020 |
| CQ-006 | 内容 schema | P2 | Blog/Knowledge/搜索/发布 | 中 | Knowledge 扩展前 | CQ-020 |
| CQ-007 | 搜索异步状态 | P2 | 全局搜索 | 小中 | 当前 1.x | CQ-004、CQ-006 |
| CQ-008 | 项目索引 | P2 | 搜索/Projects | 小 | 当前 1.x | CQ-006 |
| CQ-009 | 导航关系 | P2 | Blog 标签/Knowledge related | 小中 | 当前 1.x | CQ-006 |
| CQ-010 | 地标/键盘 | P2 | 全站 | 中 | 当前 1.x | CQ-003、CQ-004 |
| CQ-011 | reduced-motion | P2 | 全站动效 | 中 | 当前 1.x | CQ-017 |
| CQ-012 | 图片尺寸 | P2 | MDX 长文 | 中 | Knowledge 扩展前 | CQ-006 |
| CQ-013 | TOC 状态 | P2 | Blog/Knowledge 长文 | 小 | Knowledge 扩展前 | CQ-012 |
| CQ-014 | 静态预览脚本 | P2 | 本地/CI 验收 | 小 | 当前 1.x | 无 |
| CQ-015 | 部署路径 | P2 | 自定义域名/其他静态托管 | 小中 | 切换域名前 | CQ-020 |
| CQ-016 | robots/sitemap | P2 | SEO/发布 | 小中 | 当前 1.x | CQ-015 |
| CQ-017 | 设计 token | P2 | 主题与共享组件 | 中 | 当前 1.x | CQ-002、CQ-011 |
| CQ-018 | 重复内容解析 | P2 | 构建时间 | 中 | Knowledge 扩展前 | CQ-006 |
| CQ-019 | 第三方隐私 | P2 | 首页访客 | 小中 | 发布前明确策略 | 产品选择 |
| CQ-020 | 自动化测试 | P2 | 发布链路 | 中大 | 当前 1.x | CQ-005、CQ-006 |
| CQ-021 | timer 生命周期 | P3 | 局部微交互 | 小 | 顺手处理 | CQ-007 |
| CQ-022 | 死代码/Studio | P3 | 维护与 bundle | 小中 | 当前 1.x 后段 | 入口确认 |
| CQ-023 | 常量/类型/文案 | P3 | 可读性与一致性 | 小中 | 随相关改动 | CQ-017 |

## 15. 推荐治理顺序

### 发布前必须处理

1. CQ-001：将 Next 升至不受当前公告影响的版本并完整回归；这是独立实施任务。
2. CQ-002、CQ-003：修复核心移动阅读和菜单几何。
3. CQ-004：完成搜索对话框的焦点/语义闭环。
4. CQ-019：至少明确首页第三方请求的产品/隐私策略；可保留现有降级。

### 当前 1.x 阶段适合处理

1. CQ-005 与 CQ-020：恢复 lint 绿色基线并建立最小 CI 门禁。
2. CQ-007、CQ-008、CQ-009、CQ-010：补全搜索、导航和键盘契约。
3. CQ-014、CQ-016：修正静态预览和发布元数据。
4. CQ-017：从状态色、阅读面板和 focus 开始渐进抽 token。

### Knowledge 扩展前处理

1. CQ-006：统一 schema/规范化和错误报告。
2. CQ-012、CQ-013：稳定图片、hash 与目录。
3. CQ-018：基于统一索引消除 N×N 文件扫描。

### 可以长期保留

- Blog 与 Knowledge 不同的 metadata 和导航结构。
- 首页全屏 Hero、Dashboard 12 列显式布局、个性化背景与更丰富动效。
- 静态 export 下的原生 MDX `<img>`、`images.unoptimized`、publicPath 单一工具。
- 当前规模下 Dashboard 作为一个 client 岛，以及小型局部常量。
- font source 缺失时保留已提交 WOFF2、图片源与公开 WebP 分离的资产策略。

### 不建议处理

- 不迁移框架、不引入数据库/账号/全局状态库或常驻搜索后端。
- 不为了形式统一合并 Blog 与 Knowledge schema。
- 不把所有数值 token 化，不机械拆分每个大组件，不用全局隐藏 overflow 或关闭动效掩盖 Bug。
- 不删除 Hero、人物背景、Meme 或个人文案来换取通用模板式“规范”。

## 16. 已检查但不构成问题的项目

1. **静态动态路由：**Blog、Knowledge、Projects 都提供完整 `generateStaticParams`，详情设置 `dynamicParams=false`；未知 slug 实际进入 404。符合 Next 16.2.6 本地文档。
2. **GitHub Pages 子路径：**Link 自动继承 basePath，普通 public 图片/搜索 JSON 通过 `publicPath`；两次构建与 HTML 扫描未发现当前遗漏。当前 Pages 目标没有路径 Bug。
3. **Server/Client 边界：**浏览器 API 位于 client 组件/effect/事件中；没有在 Server Component render 直接访问 window/document。浏览器未观察到 hydration 错误。
4. **随机值：**MemCard 的 state initializer 含随机逻辑，但当前 `MEM_COUNT=1`，服务端和客户端结果恒为 0；现在不会造成 hydration mismatch。若增加图片数量，应把随机选择移到挂载后并测试。
5. **内容安全解析：**旧 `new Function` 已不存在；gray-matter 解析 UTF-8，Blog 文件平铺、Knowledge Windows 路径经 globby/path 处理，生成 import 路径显式改成正斜杠。
6. **当前内容一致性：**21 个 MDX 无非法必需字段、重复 Knowledge slug、失效 related 或缺失图片；搜索、loader、静态页数量一致。
7. **清理：**Backdrop transition id、Dashboard 两个远端请求的 AbortController、TOC 的 ResizeObserver/listener/RAF 均正确清理，快速背景切换的过期回调防护应保留。
8. **外部能力降级：**Hitokoto 与 Gist 请求失败时回退 SITE 静态文案，不会让首页核心内容不可用。
9. **TypeScript：**strict 编译通过；未发现 `any`/非空断言泛滥。少数类型断言都有局部运行时约束或固定数据源。
10. **秘密边界：**未发现已跟踪 secret/私有目录；status 发布脚本的 token 读取方式合理。审计没有读取或输出本地 token 内容。
11. **Route Handler：**`/api/blog` 是无请求依赖的静态 GET，成功导出；当前没有 API Route 与纯静态目标冲突。
12. **工程折中：**`suppressHydrationWarning` 用于 next-themes 修改 html class；当前主题切换和刷新正常，是可接受折中。

## 17. 验证命令与结果

| 验证 | 结果 |
| --- | --- |
| `git status --short --branch`（开始/构建后/报告前） | 始终为 ahead 3 + 用户已有未跟踪 UI/UX 报告；构建未产生可见 Git 变化 |
| `npm run lint` | 失败：24 errors、4 warnings；详见 CQ-005 |
| `npx tsc --noEmit --incremental false` | 通过，无输出 |
| `npm run build` | 通过；生成 `out/`；8 Blog、13 Knowledge、3 Project 详情及静态 API |
| `$env:GITHUB_ACTIONS='true'; $env:GITHUB_REPOSITORY='Aphrosyne/Aphrosyne-Atlas'; npm run build` | 通过；产物使用 `/Aphrosyne-Atlas` basePath |
| 静态 HTML 路径扫描 | 33 个 HTML，未发现未加仓库前缀的根相对 `src`/`href` |
| 静态服务器 + 浏览器 | 首页、Blog 列表、2 篇 Blog、Knowledge 列表、2 篇 Knowledge、About、Projects、深层刷新、未知路径 404 通过 |
| 主题切换 | `html` class 从 dark 切到 light，正常 |
| 全局搜索 | `Experience` 正确命中并可跳转；`CommunityOS` 不命中，确认 CQ-008 |
| 浏览器 console | 本轮静态核心路径日志为空；不等于所有故障路径零错误 |
| `npm start -- --port 4180` | 失败，确认与 output export 冲突，详见 CQ-014 |
| 内容只读校验 | Blog 8、Knowledge 13；非法 metadata 0、重复 slug 0、broken related 0 |
| MDX 资产校验 | 47 个本地图片引用全部存在 |
| `npm ls --depth=0` | 依赖树完整，无 extraneous/missing 报告 |
| `npm audit --omit=dev --json` | 首次沙箱网络失败；获准只读联网后成功，发现 1 critical/3 high/1 moderate |

`out/` 和 `public/search-index.json` 本来就在 `.gitignore`；`src/lib/knowledge-articles.ts` 在生成后内容未变化。验证没有清理、覆盖或回退任何用户改动。

## 18. 尚未确认的风险和限制

- 未在真实 iOS/Android、VoiceOver/TalkBack、Windows 高对比度或 200% 缩放下验证；移动证据来自浏览器视口模拟。
- 当前工具不能模拟 `prefers-reduced-motion: reduce`，CQ-011 是代码证据，需人工/自动媒体模拟复现。
- 未注入搜索 JSON 404/慢速/坏 JSON、背景图片失败、运行时 error boundary、第三方超时；相关项按潜在缺陷描述。
- 没有生产 Web Vitals、CPU/GPU trace、网络限速或冷字体 trace；未把代码气味夸大成已确认性能故障。
- GitHub Pages 子路径在本地用等价环境变量和静态服务器验证，未在真实远端 Pages 域名重新部署；当前仓库现有 workflow/线上权限不在“只审计”授权范围内。
- `npm audit` 只反映审计时 npm 公告数据库和依赖图；公告可变化，升级任务开始时必须重新执行并核对适用条件。
- 自定义域名方案尚未选定，CQ-015 的触发条件是未来使用 Actions 生成根路径站点；当前仓库子路径部署不受影响。

本审计没有修改业务代码、配置、依赖、现有文档或 Git 历史；没有提交、推送、创建分支或清理工作树。唯一新增文件是本报告。
