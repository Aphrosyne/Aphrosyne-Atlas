# Aphrosyne Atlas 1.x 统一路线图

> 本文件是 `1.0.0` 之后的实施入口。它把界面、代码质量和文章渲染三份专项审计按共同根因重新编排；不是 Changelog，也不替代长期路线。

## 路线图定位

- `docs/atlas-plan.md` 的阶段 0–5 已完成首版；本路线图处理当前 1.x 的安全、可靠性、阅读体验与维护性工作。
- 阶段 6 的自定义域名、其他托管、PWA、PDF 与离线发布仍是长期路线，不因出现在审计里自动升级为当前阻断项。
- 当前代码是事实来源。审计编号用于追溯证据，不表示事项已经实施。
- Blog 与 Knowledge 共用基础设施、主题和渲染能力，但继续保留不同的 metadata、导航目标和阅读方式。
- 首页全屏 Hero、Dashboard 12 列表达、人物背景与玻璃拟态是产品边界，不作为“统一化”清理对象。

## 当前基线

| 项目 | 当前事实 | 对路线图的影响 |
| --- | --- | --- |
| Git | 2026-09-14 规划 R0 时，`master` 的 `HEAD` 为 `8fab25b`，比 `origin/master` 领先 2 个提交；`ab764a7` 后的提交只整理路线图与项目 skill，未修改应用代码；本轮开始前工作树干净 | 三份报告与当前应用代码仍处于同一基线，按关键调用链抽查即可，不需要第四次全仓审计；本轮不提交或推送 |
| 框架 | Next.js 16.3.5、React 19.2.4、静态 `output: 'export'`、`trailingSlash: true` | R0 已依据 2026-09-14 的官方公告与稳定版本完成安全升级；后续升级仍需重新核对当时信息 |
| 发布 | GitHub Pages 仓库子路径构建和核心静态路由曾在同一代码基线通过；`npm start` 与静态导出不兼容 | 保留静态优先与 `out/` 独立可用能力；建立可重复的静态预览入口 |
| 质量 | 报告记录 `npm run lint` 为 24 errors、4 warnings，TypeScript 与 build 通过；部署工作流只 build | 先恢复可信门禁，不能靠关规则或只看 build 掩盖问题 |
| 移动阅读 | Blog、Knowledge 与 About 在 390px 出现 590–970px 等级的全文宽度；菜单在正常流中把正文下推约 506px | 页面几何与核心交互属于发布前 P1，先于视觉精修 |
| 文章渲染 | 桌面 16/28 与约 702–734px 行宽可保留；表格无局部滚动壳，图片无尺寸预留，TOC 文末状态不正确 | 先稳定宽度和图片几何，再改目录和视觉细节 |
| 内容链路 | `posts.ts` 已使用 `gray-matter`，旧 `new Function` 已不存在；但应用、registry、search 仍分别解析和默认化 frontmatter | 不再安排“移除 `new Function`”；改为统一 schema、fail-closed 发布状态与构建索引 |
| 主题与动效 | 基础颜色变量和背景切换已有可保留实现；状态色、阅读表面、focus、层级、motion policy 仍分散 | 先建立语义 token，再迁移局部颜色；页面结构稳定后才建设完整路由动效 |

上述初始运行结果来自 `ab764a7` 的三份报告；后续提交未改变应用代码。R0 实施已重新运行依赖安装、安全审计、lint、TypeScript、两种 basePath 的生产构建与真实静态产物浏览器验收，结果记录在对应批次中。

## 使用与勾选规则

- 状态沿用 `[ ]` 待处理、`[~]` 实施/待验收、`[x]` 已完成、`[-]` 决定不做。
- 只有代码、自动检查与规定的手动验收共同支持时，才能把批次标为 `[x]`。部分完成必须保留未通过项。
- 每次只由一个独立 Codex 任务实施一个批次；按 `.agents/skills/atlas-stage/SKILL.md` 先核对现状并提交批次计划，确认后再编码。
- 每批默认从干净或已确认归属的工作树开始，不修改历史审计、长期路线或文章正文，除非该批明确列入一处已确认内容缺陷。
- P0：安全、数据或核心站点不可用；P1：发布前必须处理或核心阅读/交互明显受阻；P2：1.x 可靠性与维护；P3：低风险精修；Choice：用户选择；Deferred：本阶段延后。
- 同一批内先做可验证的结构改动，再做必要样式迁移；不要同时改变大量视觉变量、内容模型和动画，避免无法归因。

## 三份审计来源

- [UI/UX 审阅与优化规划](./ui-ux-audit-2026-09.md)：`A01`–`A22`，提供真实视口、主题、键盘和视觉证据。
- [代码质量审计](./code-quality-audit-2026-09.md)：`CQ-001`–`CQ-023`，提供依赖、构建、内容链路、CI 与架构证据。
- [文章渲染系统专项审计](./article-rendering-audit-2026-09.md)：`AR01`–`AR16`，提供 MDX 元素、阅读几何、目录和内容样本证据。
- [长期项目路线](./atlas-plan.md)：约束静态优先、GitHub Pages、Blog/Knowledge 边界与长期阶段。

## 跨报告问题映射

| 统一事项 | UI/UX 编号 | 代码审计编号 | 文章审计编号 | 共同根因 | 目标批次 |
| --- | --- | --- | --- | --- | --- |
| 安全依赖与可验证升级 | — | CQ-001 | — | 框架版本落入公告影响范围，缺少升级闭环 | R0 |
| lint、类型与 CI 门禁 | — | CQ-005、CQ-020 | — | build 不再代替 lint，发布链缺少独立质量检查 | R1 |
| 静态预览与发布路径契约 | A20 | CQ-014、CQ-015、CQ-016、CQ-020 | — | 静态产物缺少统一预览/路径/发布元数据验证入口 | R2 |
| 阅读页与 About 全文横向溢出 | A01 | CQ-002 | AR01 | flex/grid 的 min-content 宽度向外传播，页面壳缺少收缩边界 | R3 |
| 表格、代码与长行局部溢出 | A01、A12 | CQ-002 | AR02、AR10 | 可横滚内容没有被限制在局部容器 | R3 |
| 图片加载改变长文几何 | A10 | CQ-012 | AR03 | 资产与渲染器之间没有尺寸/比例契约 | R4 |
| 手机菜单推动正文 | A02 | CQ-003 | — | 菜单位于 header 正常文档流，缺少 overlay 生命周期 | R5 |
| 全站语言、地标与键盘语义 | A07、A15 | CQ-010 | AR13 | 页面外壳与控件职责分散，视觉状态未对应语义状态 | R5 |
| 搜索模态焦点与异步状态 | A03、A04 | CQ-004、CQ-007、CQ-021 | — | 只实现视觉 overlay，未实现 dialog 与异步资源生命周期 | R6 |
| 主题状态色、强调色与阅读表面 | A05、A06、A14、A17、A18 | CQ-017、CQ-023 | AR08、AR11 | 基础色存在，但语义角色和组件消费不统一 | R7 |
| reduced-motion 与跑马灯降级 | A14、A16 | CQ-011 | — | CSS、Framer Motion 与事件滚动各自处理偏好 | R8 |
| 文章链接、代码、标题、表格视觉规则 | A12 | CQ-017、CQ-023 | AR07–AR10、AR14、AR15 | 两类文章复制 prose 覆盖，缺少共享渲染角色 | R9 |
| 移动目录、标题锚点与文末激活 | A11、A22 | CQ-013 | AR04–AR06 | 标题/TOC/hash 缺少统一定位与窄屏入口契约 | R10 |
| frontmatter、publication、id/hash 校验 | — | CQ-006、CQ-009、CQ-020 | AR12 | 应用与生成脚本重复校验且 publication fail-open | R11 |
| registry、搜索、关联导航与构建扫描 | A04 | CQ-006、CQ-008、CQ-009、CQ-018 | — | 多个生成消费者没有共享 canonical 内容索引 | R12 |
| 页面状态、筛选历史与全站一致性 | A13、A17–A19 | CQ-009、CQ-023 | — | 页面族缺少明确状态/轨道/恢复契约 | R13 |
| 路由切换、背景合成与 Motion System | A08、A09、A16 | CQ-011、CQ-017 | — | 持久层、路由层和页内入场职责未分离 | R14 |
| 第三方请求与隐私策略 | — | CQ-019 | — | 静态部署与浏览器运行时联网边界未向用户说明 | Choice C8 |
| 阅读玻璃与排版偏好 | — | — | AR16 | 可读性底线可客观验证，最终视觉强度需用户选择 | Choice C1–C5 |
| Studio 与死代码 | A21 | CQ-022 | — | 本地工具和公开产物边界尚未作产品决定 | Deferred D2 |

同一编号可在一个“结构批次”和后续“系统批次”出现，但不得重复实现同一根因。例如 R3 只建立表格的局部滚动边界，R9 才在该既有边界上统一表格视觉；R8 建立 reduced-motion policy，R14 只让新路由动效遵循该 policy。

## 优先级统一说明

- CQ-001 统一为 **P1**，不是 P0：当前公开产物是纯静态文件，没有常驻 Next 服务端，但开发环境和未来托管仍受影响，故排在最前。
- AR02 在代码审计中被包含于 CQ-002，而文章审计列为 P1；统一按 **P1** 处理，因为宽表会直接阻断手机阅读。
- A10/AR03 为 P1、CQ-012 为 P2；统一按 **P1** 处理，因为图片插入会破坏长文定位，并且是 TOC 修复的前置条件。
- A16 为 P1、CQ-011 为 P2；统一按 **P1** 处理其可访问性基线，完整路由动效本身仍为 P2。
- CQ-006 整体为 P2；其中“非法显式 publication 值不得默认公开”按 **P1 安全子项**验收，其余 schema/性能治理仍为 P2。
- A20 暂为 **P2 调查**；只有在新鲜、可追溯的正式静态产物中复现客户端导航空白时才升级为 P1。
- AR16 及字号、代码主题、引用样式等保持 **Choice**，不阻塞无关的几何、对比度和键盘修复。

## 实施顺序总览

| 顺序 | 批次 | 优先级 | 可观察结果 | 主要依赖 |
| --- | --- | --- | --- | --- |
| 1 | R0 安全依赖与升级闭环 | P1 | 使用经官方信息确认的安全 Next 版本，静态站无回归 | 无 |
| 2 | R1 质量门禁恢复 | P2 | lint/type/build 在 CI 中有独立、可信结果 | R0 |
| 3 | R2 静态发布契约 | P2；复现 A20 时升 P1 | `out/` 有统一预览、路径与发布元数据验收 | R0、R1 |
| 4 | R3 页面收缩与局部溢出 | P1 | 手机不再整页横滚，表格/代码只在自身滚动 | R1 |
| 5 | R4 图片几何稳定 | P1 | 长图加载前已有尺寸，hash 不被后加载内容推走 | R3 |
| 6 | R5 导航与全站语义 | P1 | 菜单不推动正文，键盘/语言/地标正确 | R3 |
| 7 | R6 搜索对话框闭环 | P1 | 搜索具备完整焦点、关闭、失败和重试行为 | R5 |
| 8 | R7 语义 token 与客观对比 | P1/P2 | 状态、强调、阅读、代码与 focus 角色有单一来源 | R3 |
| 9 | R8 减弱动画策略 | P1 | reduce 模式无连续/空间运动且内容完整 | R5、R7 |
| 10 | R9 共享文章渲染规则 | P2 | Blog/Knowledge 共用基础 prose 能力，保留各自 IA | R3、R7 |
| 11 | R10 目录、锚点与移动阅读导航 | P2 | 手机可快速定位，末章与 hash 状态正确 | R4、R9 |
| 12 | R11 内容 schema 与校验 | P1/P2 | 非法内容无法静默公开或产生可搜索 404 | R1 |
| 13 | R12 canonical 索引与生成链 | P2 | 路由、registry、搜索、related 使用同一已校验数据 | R11 |
| 14 | R13 页面状态与全站一致性 | P2/P3 | 错误/空状态、筛选恢复、页面轨道与主题入口一致 | R5–R7、R12 |
| 15 | R14 路由与页面 Motion System | P2 | 持久层、路由层、页内动效职责清晰，历史与静态导航可靠 | R2、R8、R10、R13 |
| 16 | R15 已选择的视觉与功能增强 | Choice/P3 | 只实现用户明确选定的审美或增强项 | 对应基础批次 |

R0–R2 建立发布基线；R3–R8 解决发布前核心可用性；R9–R13 完成 1.x 的阅读与维护闭环；R14 必须等页面结构稳定；R15 不阻塞前述客观修复。

## 批次 R0：安全依赖与升级闭环

- **状态 / 优先级：**[x] / P1。
- **目标：**将 Next.js 及配套包升级到实施当日确认不受相关官方公告影响的受支持版本，同时保持静态导出、MDX 和 Pages 子路径行为。
- **来源：**CQ-001。
- **范围：**`package.json`、lockfile、Next/React/ESLint 配套版本、`next.config.ts`；第一步重新核对官方安全公告、目标版本发布说明和安装后本地文档。
- **非目标：**不使用 `npm audit fix --force`；不顺便重构页面、切换框架或启用实验功能。
- **前置依赖：**无。当前 lint 红线作为升级前已知基线记录，R0 不以“修完所有旧 lint”为前提。
- **实施注意事项与风险：**静态 Pages 降低但不消除开发/未来托管风险；必须同步 `next`、`@next/mdx`、`eslint-config-next` 等兼容版本。保持 `output: 'export'`、完整静态参数和未知 slug 行为。
- **验收 / 退出条件：**重新执行 production audit；`npm ci`、TypeScript、当前 lint 差异检查、空 basePath 与仓库 basePath build、`out/` 核心路由/404/搜索/主题/资源检查均无升级回归。报告安全目标和残余公告，不猜测“零风险”。
- **建议提交边界：**1 个依赖提交；若兼容改动不可避免，再加 1 个仅处理升级兼容性的提交。

### R0 实施计划（2026-09-14）

#### 已确认基线与目标版本

- 当前直接版本为 `next@16.2.6`、`@next/mdx@^16.2.6`、`eslint-config-next@16.2.6`、`react@19.2.4`、`react-dom@19.2.4`；本地 Node 24.20.0 与 Pages 工作流 Node 22 均满足候选版本要求的 Node `>=20.9.0`。
- 2026-09-14 重新执行 `npm audit --omit=dev --json`，仍得到 1 critical、3 high、1 moderate；直接依赖 `next@16.2.6` 命中截至 16.3.2 的公告，并带入受影响的 PostCSS、Sharp、Nano ID 与 Baseline Browser Mapping 路径。
- [Next.js 官方 2026-08 安全发布](https://nextjs.org/blog/august-2026-security-release)要求 16.x 至少升级到 `16.3.3`；2026-09-14 的 npm `latest` 与[最新稳定 GitHub Release](https://github.com/vercel/next.js/releases/tag/v16.3.5)均为 `16.3.5`。因此本规划的首选目标是 `16.3.5`，不采用 `16.4.0-canary`。
- `next@16.3.5` 仍兼容 React 19，`eslint-config-next@16.3.5` 仍兼容 ESLint 9；R0 默认保留 React/React DOM 19.2.4、ESLint 9、TypeScript 5 与现有 React Compiler 插件，只在安装后的 peer、安全或构建证据要求时做最小配套调整。
- 实施开始时必须再次检查官方安全发布、稳定 dist-tag 和目标 release notes。若 `latest` 已变，优先选择当时 Active LTS 的最新稳定补丁；若已进入新的 minor，不自动跨 minor，先比较修复覆盖和迁移风险后更新本节目标。

#### 文件与改动边界

- 必改：`package.json`、`package-lock.json`。将 `next`、`@next/mdx`、`eslint-config-next` 对齐到同一稳定版本，锁文件仅由 npm 解析生成，不手工挑改传递依赖。
- 条件改动：`next.config.ts`。先用 16.3.5 原配置验证；只有新版本文档、类型错误或静态构建证明确有兼容问题时才调整，并保持 `output: 'export'`、`trailingSlash`、构建期 `basePath`、`images.unoptimized`、MDX 插件和 React Compiler 现有语义。
- 只读核对：三类动态详情路由的 `generateStaticParams()` 与 `dynamicParams = false`、`src/lib/public-path.ts`、搜索索引生成脚本、Knowledge registry 生成脚本、`.github/workflows/deploy-pages.yml`。
- 明确不改：页面组件、文章正文、审计文档、R1 的 lint 根因与 CI 门禁、R2 的长期静态预览脚本；不启用 Cache Components、Partial Prefetching、Rust React Compiler 或其他 16.3 实验能力。

#### 实施顺序

1. **冻结升级前证据。**确认工作树归属，记录 `node --version`、`npm --version`、`npm ls`、production audit、TypeScript 与 lint 摘要。当前已知基线是 TypeScript 通过、lint 为 24 errors / 4 warnings；这些旧 lint 项留给 R1，R0 只阻止新增或规则漂移。
2. **再次确定安全目标。**只依据 Next.js/Vercel 官方安全公告、Vercel GitHub Release 与 npm 包元数据核对受影响区间、最新稳定版本、Node engine 和 peer dependencies，并在实施记录中写明查询日期。
3. **最小升级并重建锁文件。**同一次依赖操作对齐三个 Next 配套包；不执行 `npm audit fix --force`，不主动刷新无关顶层依赖。随后用 `npm ci` 从锁文件重装，确保 lockfile 可复现，并检查是否意外出现多版本 Next 配套包或 peer warning。
4. **以安装后文档复核配置。**完整阅读新安装版本中与本项目直接相关的 static export、`basePath`、MDX、`generateStaticParams` 文档和升级说明；先验证现有配置，兼容改动必须有具体文档、类型或构建证据。
5. **执行自动验证矩阵。**运行 TypeScript、lint 差异检查和两次 production build：一次空 `basePath`，一次模拟 `GITHUB_ACTIONS=true` 与仓库名的 Pages 子路径。两次都核对 `out/` 文件结构、生成索引和构建日志。
6. **预览真实静态产物。**使用静态文件服务器分别挂载空路径产物和 `/Aphrosyne-Atlas/` 子路径产物，不用 `next dev` 代替；验证首页、Blog 列表与至少两篇文章、Knowledge 列表与至少两篇文章、Projects、About、404、搜索、主题、深层刷新、前后退、`_next`、字体、图片和 `search-index.json`，并检查控制台。
7. **关闭安全与 Git 闭环。**重新执行 production audit 和 `npm ls`，记录仍存在的公告、适用条件与处理归属；用 `git diff --check`、`git diff --name-only` 和 `git status` 确认没有生成物、文章或无关依赖漂移，再决定是否将 R0 标为完成。

#### 失败处理与降级

- 若 16.3.5 无法通过静态导出、MDX 或 Pages 子路径验收，先保留升级分支上的失败证据并定位最小兼容改动；不得以恢复受影响的 16.2.6 作为完成状态，也不得关闭静态导出或删除页面来换取通过。
- 若安装后出现新的 lint 规则，只修复由版本升级直接引入、且范围很小的兼容问题；旧 24 errors / 4 warnings 与大规模 lint 清理继续归 R1。无法清楚区分时，R0 保持 `[~]` 并记录差异。
- 若 audit 仍有 critical/high，按“直接/传递、生产是否可达、官方是否有稳定修复”逐项判断。存在可用稳定修复却未采用时不得完成；没有修复或与静态产物不可达时可记录残余风险，但不能宣称“零风险”。
- 若新稳定版本要求超出本批的框架迁移、视觉改动或内容模型修改，停止在计划闸门，另行确认范围，不把扩大改动混入 R0。

#### R0 完成判定

- 三个 Next 配套包版本一致，`npm ci` 无 lockfile 变更和不可接受的 peer warning；React 等未升级项有兼容依据。
- production audit 不再包含已有 Next 16.2.6 公告链；任何残余项均有日期、影响面和后续归属。
- TypeScript 继续通过；lint 相对升级前没有新增错误或 warning，也没有通过关规则、忽略文件或降级配置掩盖差异。
- 空路径与 Pages 子路径的 production build、真实 `out/` 预览及上述核心路由/资源矩阵全部通过；未知动态 slug 仍返回 404。
- 最终依赖 diff 默认只包含 `package.json` 与 `package-lock.json`，另回写本路线图的实施状态与证据；若确需 `next.config.ts` 兼容改动，必须独立说明证据。没有提交、推送或部署，除非用户另行授权。

#### R0 实施结果（2026-09-14）

- 将 `next`、`@next/mdx` 与 `eslint-config-next` 对齐到稳定版 `16.3.5`；保留 React/React DOM 19.2.4、ESLint 9、TypeScript 5 与现有 Next 配置。安装后的 16.3.5 本地文档确认现有 static export、`basePath`、MDX 与 `generateStaticParams` 用法仍适用，因此未修改 `next.config.ts`。
- `package-lock.json` 由 npm 重新解析；Next 16.3.5 复用项目已有 `sharp@0.35.4`，并将受影响的 `baseline-browser-mapping` 解析到 2.11.23。`npm ci` 可重复完成，未出现 peer dependency 错误；npm 11 仅保留与本次升级无关的 `allowScripts` 提示。
- `npm audit --omit=dev --json` 结果为 0 项生产依赖漏洞；原 Next 16.2.6 及其 PostCSS、Sharp、Nano ID、Baseline Browser Mapping 公告链已消除。完整 audit 仍报告 `brace-expansion`、`browserslist`、`js-yaml` 3 个仅开发依赖 high，均有可用修复，归入 R1 的工具链/门禁批次处理；未运行 `npm audit fix --force`。
- `npx tsc --noEmit` 通过；`npm run lint` 仍为升级前已知的 24 errors / 4 warnings，没有新增错误、warning 或规则漂移，旧问题继续归 R1。
- 空 `basePath` 与模拟 GitHub Pages `/Aphrosyne-Atlas` 子路径的 `npm run build` 均通过：34 个静态页面、8 篇 Blog、13 篇 Knowledge、3 个 Project，registry 13 项、搜索索引 23 项。
- 两份 `out/` 均由静态文件服务器真实预览。首页、Blog/Knowledge 列表及各两篇详情、Projects、About、Studio、搜索索引、静态 API、深层刷新、404、搜索、主题、前后退和资源加载通过；未知 slug 返回 404。浏览器覆盖 390×844、768×1024 与 1440×900，未发现升级引入的控制台错误或破图。
- 390px 阅读页原有整页横向溢出仍可复现，证据与 R3 的既有基线一致，本批未以样式改动越界处理。未提交、推送或部署。

#### 建议提交边界

1. `chore(R0): 升级 Next.js 安全依赖`
2. 仅在确有必要时追加 `fix(R0): 适配 Next.js 升级后的静态导出`，且只包含有验证证据的兼容改动。

## 批次 R1：恢复 lint、类型与 CI 最小门禁

- **状态 / 优先级：**[x] / P2。
- **目标：**让仓库的官方质量命令重新可信，并在部署前独立失败，而不是由成功 build 掩盖 lint/类型问题。
- **来源：**CQ-005、CQ-020。
- **范围：**Blog 详情错误边界、Clock/TagCloud/ThemeToggle/GlowDots 等现有规则错误、`<img>` 例外说明、`typecheck` 脚本与 Pages workflow。
- **非目标：**不追求全组件测试覆盖；不关闭 React/Next 规则；不在本批删除所有死代码或重写内容系统。
- **前置依赖：**R0，避免刚恢复的基线再次被框架升级打乱。
- **实施注意事项与风险：**Blog 的 JSX `try/catch` 不能假装捕获子树渲染错误；必要规则例外只能局部、带理由。CI 应让 lint/type/build 各自可诊断。
- **验收 / 退出条件：**`npm run lint` 零错误；`tsc --noEmit --incremental false` 通过；CI 中 lint/type/build 顺序清楚，故意制造的 lint/type 错误可阻断部署；现有文章不存在时仍返回正确 404，导入失败可诊断。
- **建议提交边界：**2 个提交：修复现有 lint 根因；增加脚本与 CI 门禁。

### R1 实施结果（2026-09-14）

- 移除 Blog 详情页中包裹 JSX 的 `try/catch`：缺失 metadata 继续显式调用 `notFound()`；MDX 导入、相邻文章查询或渲染的非预期异常会冒泡到新增的 `app/blog/[slug]/error.tsx` 路由段错误边界。该边界向读者显示稳定中文恢复界面，并在控制台记录原始错误，避免把导入失败伪装成 404 或向生产用户泄露错误文本。
- Clock、TagCloud、ThemeToggle 与 GlowDots 的首次客户端状态更新改为可清理的 timer 或 animation frame 回调，消除 effect 内同步 `setState` 的级联渲染规则错误；GlowDots 同时补齐原有 timer 清理。
- 对 About、Dashboard 和 Navbar 的 4 个原生 `<img>` 添加逐处说明的 `no-img-element` 例外：它们是使用 `publicPath`、静态导出与 SVG clip-path 的本地资源，不引入运行时图像优化器。MDX 的同类例外保持原状。
- 新增 `npm run typecheck`（`tsc --noEmit --incremental false`），Pages workflow 在 `npm ci` 后依次运行 lint、typecheck、build；任一前置命令非零退出即不会进入构建和部署。
- `npm run lint` 与 `npm run typecheck` 均通过；空 basePath 和模拟 `/Aphrosyne-Atlas` 子路径的 production build 均通过，生成 34 个静态页面。临时加入后移除的无效 TypeScript 探针分别令 lint 和 typecheck 以退出码 1 失败，验证门禁阻断行为。
- 在真实 Pages 子路径静态预览中验证现有 Blog 文章正常渲染、未知 Blog slug 返回 404。未提交、推送或部署；预览服务和临时文件均已清理。

## 批次 R2：建立可重复的静态发布契约

- **状态 / 优先级：**[x] / P2；新鲜产物未复现 A20。
- **目标：**用一个明确脚本预览刚生成的 `out/`，并对静态导航、basePath 和发布元数据形成可重复 smoke 验收。
- **来源：**A20、CQ-014、CQ-015、CQ-016、CQ-020。
- **范围：**替换失效的 `npm start`、静态服务器预览入口、空路径/仓库子路径构建参数、robots/sitemap 与 canonical 配置、核心路由 smoke。
- **非目标：**不绑定自定义域名、不部署其他平台、不为预览引入常驻应用服务器。
- **前置依赖：**R0、R1。
- **实施注意事项与风险：**先确认预览服务正确处理目录式 `index.html` 和 404；将“运行于 Actions”和“部署于仓库子路径”拆开，部署路径继续只有一个事实源。自定义域名只验证空 basePath 构建，不实际切换。
- **验收 / 退出条件：**新 build 的首页、Blog、两篇文章、Knowledge、深层刷新、前后退、404、主题、搜索和资源在静态服务器通过；空 basePath 与 `/Aphrosyne-Atlas` 均通过 HTML/资源扫描；robots/sitemap 只含公开路由且 URL 与配置一致；浏览器控制台无 404/hydration/runtime 错误。
- **建议提交边界：**2–3 个提交：预览脚本；basePath 输入与 smoke；robots/sitemap 单一来源。

### R2 实施结果（2026-09-15）

- 新增 `site.config.mjs` 作为部署 origin、`basePath` 与公开 URL 的唯一输入源；`next.config.ts`、`SITE.url`、metadata canonical、`robots.txt` 和 `sitemap.xml` 均从此配置消费。工作流显式传入 `/Aphrosyne-Atlas` 与 `https://aphrosyne.github.io`，不再把 Actions 环境与仓库子路径隐式耦合。
- 移除与 `output: 'export'` 不兼容的 `npm start`；新增 `build:static`、`preview:static` 与 `smoke:static`。预览器只服务刚生成的 `out/`，支持目录式路由、可配置子路径与 404；不引入常驻应用服务器。README 同步记录 Pages 子路径和未来根路径的本地验收命令。
- `robots.ts` 与 `sitemap.ts` 以 Next metadata route 静态导出。sitemap 覆盖公开首页、列表、Blog、Knowledge 与 Projects 路由，沿用既有 publication 过滤排除 draft/unlisted，且不包含 Studio；核心公开页面和详情页生成与部署 URL 对齐的 canonical。
- 在 `https://aphrosyne.github.io/Aphrosyne-Atlas` 子路径与 `https://example.com` 根路径各执行一次 production static build（各 36 条静态路由）和 smoke。smoke 检查 10 条核心路由、所有本地 HTML 资源、搜索索引目标、canonical、robots 与 sitemap；两种路径均通过。
- 真实静态服务浏览器验收了 Pages 子路径首页、Blog 详情、Knowledge 详情、未知路径 404，以及前进/后退；链接、`_next`、图片、字体与中文内容均正确保留子路径。根路径静态服务对首页、两种详情、404、robots 与 sitemap 返回预期 200/404。未复现 A20；未部署、未推送。本批使用 `computer-use` 对实际静态产物完成浏览器路径验收。

## 批次 R3：修复页面收缩链与局部横向溢出

- **状态 / 优先级：**[x] / P1。
- **目标：**320/390/768px 下 Blog、Knowledge、About 不再整页横滚；宽表、代码和必要长内容只在自身容器中可达。
- **来源：**A01、A12、CQ-002、AR01、AR02、AR10。
- **范围：**root flex item、Blog/Knowledge/About 页面壳、阅读卡片和内容列、上下篇、Knowledge 导航、Marquee 内在宽度、table/pre/长 inline code 的局部边界。
- **非目标：**不全局隐藏 overflow；不改正文字号、玻璃透明度、表格审美或首页 Hero；不删除移动端功能。
- **前置依赖：**R1。
- **实施注意事项与风险：**按“根 main → 页面壳 → grid/flex item → article → 局部可滚元素”逐层定位；表格结构壳在本批建立，颜色与密度留给 R9。修复换行会改变页面高度，需回归 Footer 与现有 TOC。
- **验收 / 退出条件：**四篇审计压力样本和 About 在 320/390/768 深浅主题下 `document.scrollWidth <= clientWidth + 1`；长 URL、中英连续串、上下篇、17 列表格、代码与跑马灯内容不丢失；table/pre 可键盘进入、横滚、退出；1440 桌面行宽不倒退。
- **建议提交边界：**2 个提交：页面/布局收缩边界；局部 table/pre/inline-code 溢出边界。

### R3 实施结果（2026-09-15）

- root `main`、About、Blog 与 Knowledge 阅读壳、三栏 grid、文章列、侧栏和上下篇导航均补齐 `w-full`/`min-w-0` 收缩边界；窄屏上下篇改为纵向排列，保留桌面双列与既有玻璃、Hero 和正文尺寸。
- 新增全局 MDX `table`/`pre` 映射：每个宽表和代码块都进入带名称、焦点样式与 `tabIndex=0` 的局部滚动区域。客户端小岛支持左右方向键与 Home/End 横滚；长 inline code 与裸露长链接可在行内断开，文字不丢失。
- MDX 根路径链接和图片统一经已有 `publicPath` 处理。修复了启用共享 MDX 组件后在 Pages 子路径下暴露的根路径链接与图片引用，而未修改文章正文或本地资源路径。
- 对 MDX 样式帖、Experience 修复、彩色魔法 Boss 长文和 About，使用新建的静态 `out/` 在 320/390/768 深浅主题矩阵测量 `document.scrollWidth <= clientWidth + 1`，全部通过；1440 宽度四样本亦无横向回归。宽表/代码区域只在自身 `scrollWidth > clientWidth` 时横滚，键盘验收确认聚焦后右方向键可移动局部 `scrollLeft`（320px 样本为 0 → 184）。
- `npm run lint`、`npm run typecheck`、Pages 子路径 `build:static` 和 `smoke:static` 均通过。未部署、未推送；R4 继续处理图片加载前的尺寸预留，不把本批的 `max-width` 约束误作 CLS 修复。

## 批次 R4：为文章图片建立尺寸契约

- **状态 / 优先级：**[x] / P1。
- **目标：**内容图片在加载前预留正确比例，长文定位和后续章节不再因 lazy image 解码而插入大段高度。
- **来源：**A10、CQ-012、AR03。
- **范围：**静态资产处理或尺寸清单、MDX 图片渲染、导入流程对尺寸数据的传递；宽图、长图、小图和失败图样本。
- **非目标：**不引入图片服务；不强制裁切地图；不在本批建设灯箱、图注系统或替换所有原生 `<img>`。
- **前置依赖：**R3。
- **实施注意事项与风险：**尺寸来源必须来自实际资产并兼容中文/空格/正斜杠 public 路径；保持 lazy、原始比例、alt 与 GitHub Pages `publicPath`。生成物必须可由干净 checkout 重建。
- **验收 / 退出条件：**冷加载/慢网下图片加载前后后续标题位置稳定；hash 直达图片后章节不被推离；多种比例完整显示；失败时 alt/占位可读；静态 build、子路径资源与生产 CLS 记录通过。
- **建议提交边界：**2 个提交：生成尺寸数据；MDX 渲染消费与回归样本。

### R4 实施结果（2026-09-15）

- `scripts/optimize-static-assets.mjs` 会从 `public/images/` 的 54 个发布图片生成 `src/lib/image-dimensions.ts`；MDX 原生图片先按公开路径查找真实宽高，再经 `publicPath` 输出部署路径，保留 lazy、原始比例、alt 和原生失败回退。
- 新增 `verify:images`：静态构建后逐页核验文章图片的 `width`/`height`、非空替代文本及与实际发布文件的一致性；GitHub Pages 工作流已将其作为上传产物前门禁。
- Pages 子路径和根路径两次静态 build、smoke 与图片尺寸验证均通过。真实静态预览的 46 图 Boss 长文中，图片尚未解码时仍已保留 501×281.8125 的显示空间；直达 `#30-253` 时标题位于视口 0.3125px，等待附近图片开始加载后 `scrollY`（37387）与标题位置均未变化。未推送、未部署；线上 RUM CLS 仍按 T3 在实际发布后持续记录。

## 批次 R5：重建移动导航与全站语义基线

- **状态 / 优先级：**[x] / P1。
- **目标：**移动菜单不再改变正文几何位置；全站具备正确中文语言、主地标、当前项和键盘导航契约。
- **来源：**A02、A07、A15、CQ-003、CQ-010、AR13。
- **范围：**Navbar 移动 drawer/popover、桌面板块链接与展开按钮分责、`lang`、单一 `main`、BackToTop 隐藏状态、Hero 内容入口名称/offset、当前页面/筛选语义。
- **非目标：**不重新设计 Navbar 外观；不修改完整路由动画；不把所有控件机械改成同一种 ARIA role。
- **前置依赖：**R3。
- **实施注意事项与风险：**菜单须受视口高度约束并处理 Escape、背景交互、滚动锁、导航后/关闭后焦点；768px 触屏断点必须有可用路径。保留所有导航入口与 Hero 高度。
- **验收 / 退出条件：**320/390/横屏打开菜单前后正文坐标不变，全部入口可触控/键盘访问；焦点不进入被遮页面；桌面下拉可键盘展开；导出 HTML 只有一个主地标且中文读屏语言正确；Hero 首区不被 sticky Nav 遮挡。
- **建议提交边界：**2 个提交：导航 overlay 与焦点；语言、地标、Hero/BackToTop 语义修复。

### R5 实施结果（2026-09-15）

- 移动导航从 header 正常流改为全屏 backdrop 上的独立 dialog；打开时锁定背景滚动、自动聚焦菜单、Tab/Shift+Tab 在菜单内闭环，Escape、关闭按钮和 backdrop 都会关闭并将焦点还给触发器。面板有自身最大视口高度与纵向滚动，不改变正文坐标。
- 桌面含子项的导航拆分为父级链接与显式展开按钮；按钮具备名称、`aria-expanded`/`aria-controls` 和 Escape 收起行为。移动入口保持父级与子项均可直接触达。
- 根布局输出 `lang="zh-CN"` 和唯一 `main` 地标；详情页与 Knowledge 页面内部容器改为 `div`。Hero 按 sticky 导航高度计算首屏、主要内容目标带 scroll offset；BackToTop 在隐藏时移出无障碍树与 Tab 顺序。
- Pages 子路径和根路径静态 build、smoke 与图片校验均通过；根路径 32/32 个导出 HTML 均为 `zh-CN`，且未发现多于一个 `main`。390×844 静态预览中菜单开关前后 `main` 均为 top=60、left=0；打开时背景滚动锁定，Escape 后恢复且焦点回到触发器。1440×900 中桌面知识库子导航可展开 5 个子项并以 Escape 收起。未推送、未部署。
- 追加修复：导航比较会去除配置的 `basePath` 与导出路由结尾斜杠。Pages 子路径 `/Aphrosyne-Atlas/about/` 的 About 链接现有 `aria-current="page"` 与高亮背景；Blog 配置降为无子项的直接链接，旧“全部文章/标签”和 Blog 展开按钮均不再输出。

## 批次 R6：完成搜索对话框与异步状态闭环

- **状态 / 优先级：**[x] / P1。
- **目标：**搜索在桌面、手机、键盘和失败网络下都具有明确、可恢复的状态，不再让焦点逃逸或静默失败。
- **来源：**A03、A04、CQ-004、CQ-007、CQ-021。
- **范围：**dialog/aria-modal、标题与输入名称、焦点 trap/inert/归还、显式关闭、Escape、结果导航焦点、`idle/loading/ready/error`、响应检查、取消/缓存/timer 清理、长结果辨识。
- **非目标：**不新增搜索后端；不在本批重写 canonical 索引或承诺项目搜索，项目数据接入归 R12。
- **前置依赖：**R5。
- **实施注意事项与风险：**处理 sticky Navbar 的层叠上下文和手机软键盘；关闭、快速重开、路由跳转时旧响应不得覆盖新生命周期。数据形状校验接口应能在 R12 复用。
- **验收 / 退出条件：**Tab/Shift+Tab 闭环，背景不可交互，Escape/按钮/overlay 行为明确，关闭后焦点归触发器；中文、Blog/Knowledge scope、空结果正常；慢速、404、500、坏 JSON、连续开关均有状态且无未处理 Promise；结果标题/摘要在手机可区分。
- **建议提交边界：**2 个提交：dialog 焦点生命周期；索引请求状态、校验与结果布局。

### R6 实施结果（2026-09-15）

- SearchModal 使用明确的 idle/loading/ready/error 状态；请求会校验 HTTP 状态及索引数组形状，关闭时中止未完成请求，失败时提供可见的重试入口。已加载索引在同次会话内复用。
- 对话框有名称、`aria-modal`、初始输入焦点及 Tab/Shift+Tab 焦点闭环；Escape、关闭按钮、backdrop 与结果导航均关闭对话框并把焦点还给搜索触发器，同时锁定并恢复背景滚动。
- Pages 子路径静态 build、smoke 和图片校验通过；静态预览验证了中文“知识库”搜索结果、背景滚动锁和 Escape 焦点归还。未推送、未部署。

## 批次 R7：建立语义 token 并修复客观对比问题

- **状态 / 优先级：**[x] / P1（对比缺陷）+ P2（系统治理）。
- **目标：**让状态、强调、正文/次要文字、阅读表面、代码、focus 和层级有稳定语义来源，再由组件消费，而不是继续复制白色和任意 alpha。
- **来源：**A05、A06、A14、A17、A18、CQ-017、CQ-023、AR08、AR11。
- **范围：**`globals.css` Tailwind v4 变量；status fg/bg/border、accent-fill/on-accent、expressive/content/reading/dialog surface、reading/code muted、focus、shadow、z-layer、导航/锚点尺寸；迁移 Knowledge 状态、代码行号、Dashboard/About 必要文字和核心 focus 消费者。
- **非目标：**不一次 token 化所有 px/ms/圆角；不决定阅读玻璃最终透明度、强调色关系或代码主题；不抹平 Hero、Dashboard 与阅读卡片的角色差异。
- **前置依赖：**R3，先稳定几何，避免用颜色改动掩盖布局问题。
- **实施注意事项与风险：**先把现有值迁移为命名角色，再只调整有证据的对比缺陷；半透明玻璃按最终复合背景验收。Tailwind v4 映射遵循本地版本实现。
- **验收 / 退出条件：**普通文字/必要小字目标 4.5:1、适用大字 3:1；verified/needs-review/outdated 不只靠颜色；深色 accent 上文字合格；固定暗色代码行号与 focus 可读；深浅主题、hover/focus/disabled 和复杂背景均检查；组件不再各自维护相同状态色映射。
- **建议提交边界：**2 个提交：定义/迁移语义 token；修复核心消费者对比与重复映射。

### R7 实施结果（2026-09-15）

- `globals.css` 现定义强调文字/填充/填充上文字、状态前景/背景/边框、表达/内容/阅读/对话表面、阅读与代码次要文字、focus、阴影、层级和导航/锚点尺寸等 Tailwind v4 可消费 token；固定暗色代码行号改用 `code-muted`。
- Knowledge 列表与详情页改为共享状态标签元数据；Blog 归档与项目公开/归档也复用同一来源，状态以“已验证 / 待复查 / 已过时”等文字表达，不只依赖颜色。Dashboard 与 About 的必要文字和核心导航、目录、卡片、搜索焦点环已迁移，强调填充统一使用合格的 on-accent 文本。
- 对 token 的实色前景/背景组合计算得到 5.49–8.24:1（深色 accent/三类状态）与 5.98–7.07:1（浅色 accent/三类状态）。lint、TypeScript、根路径与 Pages 子路径静态构建、smoke 和图片校验通过；本地静态预览检查了首页、知识库列表与文章的深浅主题。未推送、未部署。

## 批次 R8：统一 reduced-motion 与连续运动降级

- **状态 / 优先级：**[x] / P1。
- **目标：**系统偏好 reduce 时取消空间飞入、连续旋转和自动跑马灯，同时保留内容、导航和即时反馈。
- **来源：**A14、A16、CQ-011。
- **范围：**共享 motion policy；Hero、Dashboard、TagCloud、Navbar/Search、PageTransition、BackToTop、Backdrop 与 About 技能跑马灯；技能的单份语义清单和静态换行降级。
- **非目标：**不删除默认品牌动效；不把“动画时长设 0”当作内容可达性的全部验收；不在本批实现完整路由退出。
- **前置依赖：**R5、R7。
- **实施注意事项与风险：**CSS、Framer Motion hook 与命令式滚动必须遵循同一政策；默认模式继续保留 Hero 与表达动效。恢复偏好时不得遗留暂停或隐藏状态。
- **验收 / 退出条件：**真实或可验证媒体模拟的 reduce=true 下无连续旋转/跑马/长距离飞入/smooth 强制滚动，所有技能与内容可见；导航、搜索、目录、回顶可用；恢复默认后原有品牌动效正常。
- **建议提交边界：**2 个提交：共享策略与主要动效消费；Marquee 语义/静态降级及回归。

### R8 实施结果（2026-09-15）

- 新增共享 `useMotionPolicy`，为 Framer Motion、命令式滚动与交互弹跳提供统一的系统 reduce 偏好；Hero、BackToTop、PageTransition、AnimatedSection、Backdrop、Blog/Knowledge/Project 卡片、Dashboard、Navbar 与 SearchModal 都遵循该策略。
- reduce 模式不再执行 Hero 流光/浮动、头像 hover 旋转、TagCloud 3D 自旋、技能跑马灯或菜单/搜索/卡片的空间位移；Hero 与回顶改为即时滚动。TagCloud 以完整静态标签展示，技能跑马灯有单份读屏列表并显示不重复的静态换行内容。
- lint、TypeScript、根路径与 Pages 子路径静态构建、smoke 和图片校验通过。未推送、未部署；真实设备的系统 reduce 偏好与读屏验证仍按 T4 留待发布前设备验收。

## 批次 R9：统一 Blog/Knowledge 的共享文章渲染规则

- **状态 / 优先级：**[x] / P2。
- **目标：**在稳定几何与 token 之上，统一两类文章的基础排版、代码、表格、链接和标题层级，同时保留各自 metadata 与导航密度。
- **来源：**A12、CQ-017、CQ-023、AR07–AR10、AR14、AR15。
- **范围：**共享 prose/MDX 角色、H4–H6 阶梯、inline code 换行与装饰、pre/code 内层责任、代码行号/focus、table 1px 基线、hr/blockquote 基线、link 状态 token。
- **非目标：**不合并 Blog 日期/上下篇与 Knowledge 类型/版本/来源；不决定 Choice C2–C6；不建设完整 callout 或代码复制功能。
- **前置依赖：**R3、R7。
- **实施注意事项与风险：**复用 R3 的局部滚动壳，不再创建第二套 table wrapper；高亮内联颜色不能被普通正文色覆盖。Knowledge 可保留显式 compact 变体，Blog 不再拥有无理由的 2px 重表格。
- **验收 / 退出条件：**MDX 样式帖、Experience 与 Boss 样本深浅主题下 H1–H6、链接、inline code、TSX/INI/text、表格、列表、引用清楚；长路径不撑宽；两类文章基础 pre/code/table 行为一致，差异均有命名理由；键盘可操作滚动区与链接。
- **建议提交边界：**2 个提交：共享排版/链接/inline-code；代码块/表格/引用迁移。

### R9 实施结果（2026-09-15）

- Blog 与 Knowledge 详情页改为消费共享 `ARTICLE_PROSE_CLASS`；正文不再分别维护 prose、inline code 与表格的 Tailwind 任意选择器。H4–H6、引用、分隔线、列表标记、可访问链接焦点、代码行号和 R3 已有的局部滚动壳统一由 `globals.css` 的文章角色提供。
- 表格统一为 1px 边线、标题行强调底色与交替行承托；代码与宽表保持各自可键盘聚焦的横向滚动区，不向页面传播宽度。Blog/Knowledge 的元数据、上一篇/下一篇和分类导航仍保持各自信息架构。
- 用户已选择 C5：正文链接使用强调色到头像环色的常驻 1px 渐变线，hover 加粗至 2px；无需仅靠颜色识别链接。lint、TypeScript、根路径与 Pages 子路径静态构建、smoke 和图片校验通过。未推送、未部署。

## 批次 R10：完善目录、标题锚点与移动阅读导航

- **状态 / 优先级：**[x] / P2。
- **目标：**手机在正文前即可跳转章节，桌面/手机目录在末章、hash、图片加载和历史恢复后都保持正确状态。
- **来源：**A11、A22、CQ-013、AR04、AR05、AR06。
- **范围：**移动折叠本篇目录、Knowledge 分类入口与全文解耦、长标题两行策略、标题锚点的名称/可见入口、统一 scroll offset、TOC 文末规则和点击/observer 交接。
- **非目标：**不改变稳定 URL 或正文标题文本；不增加大段尾部空白凑激活线；不把桌面三栏原样压进手机。
- **前置依赖：**R4、R9；图片和标题几何必须先稳定。
- **实施注意事项与风险：**Blog 与 Knowledge 保留不同导航目标；移动 sticky 控件不能占据过多视口。历史恢复、浏览器返回与 hash 刷新不能被无条件回顶覆盖。
- **验收 / 退出条件：**390px 可在正文前直达任一 H2/H3；长侧栏/上下篇标题可辨；末章在点击、自然滚动、刷新和图片加载后正确 active；标题锚点可键盘/触控使用并有名称；前后退/hash offset 正确。
- **建议提交边界：**2 个提交：锚点/TOC 状态算法；移动目录与导航布局。

### R10 实施结果（2026-09-15）

- Blog 与 Knowledge 正文标题改由全局 MDX `h2`/`h3` 组件提供具名、可聚焦的锚点入口；目录读取时排除该入口符号，因而不改变文章原有标题文本。标题的 `scroll-margin` 与目录激活线共同使用语义滚动偏移，点击、hash 刷新和历史导航均保留浏览器原生定位。
- 两类详情页均在正文前提供窄屏折叠“本篇目录”，桌面继续使用右侧目录和阅读进度轨；移动目录限高后独立滚动，不挤占正文视口。目录与上下篇标题采用两行截断策略，Knowledge 的分类导航仍作为文章外的独立入口。
- lint、TypeScript、根路径与 Pages 子路径静态构建、smoke 和图片校验通过；本地静态预览以 390px 检查了目录展开、任意 H2/H3 的 hash 跳转与具名标题锚点。未推送、未部署。

## 批次 R11：建立 Blog/Knowledge 内容 schema 与校验边界

- **状态 / 优先级：**[x] / P1 安全子项 + P2。
- **目标：**让应用、路由和生成脚本对同一内容得出一致结论；损坏 metadata、非法 publication、重复 slug 或死锚点在构建时明确失败。
- **来源：**CQ-006、CQ-009、CQ-020、AR12。
- **范围：**可由 Node 脚本与应用共享的解析/规范化层；Blog/Knowledge 独立 schema；publication 迁移规则；中文、CRLF、日期、枚举、sources/related、重复 basename、文章内重复 id/死 hash fixture；修复已确认的 Boss `#boss24`/重复 `#boss4` 内容错误。
- **非目标：**不把 Blog 与 Knowledge 合成一个过宽 schema；不批量改写文章；不以 frontmatter 代替 `.private/` 的私人内容边界。
- **前置依赖：**R1；可与 R3–R10 并行排期，但合入时必须重跑这些阅读回归。
- **实施注意事项与风险：**非法显式 publication 必须 fail-closed；“缺失 publication 是否沿用公开默认”要以一次明确迁移决定处理。错误必须带文件路径，兼容 UTF-8、中文和 Windows 路径。
- **验收 / 退出条件：**表驱动 fixture 覆盖空/错/缺字段、CRLF、中文、空格路径、重复 slug、broken related、draft/unlisted/archived；registry、route params、search 对同一输入一致；46 个 Boss hash 均存在且唯一；当前 21 篇内容全部通过且无无关正文改写。
- **建议提交边界：**2–3 个提交：schema/规范化；fixture 与校验；已确认单篇锚点修复。

### R11 实施结果（2026-09-15）

- 新增 Blog 与 Knowledge 各自的共享 fail-closed schema，应用读取路径、Knowledge loader registry 和搜索索引生成都使用同一规范化结果。用户确认：缺失或非法 `publication` 一律使构建失败，不再默认公开。
- 构建新增 schema fixture 与全量内容验证：覆盖 CRLF、中文/空格路径、日期、publication、枚举、`related` 与 `sources`；同时拒绝重复 slug、重复显式 id、死 hash 与不存在的 Knowledge `related`。
- 修复 Colorful Magic Boss 文档中第 24 个 Boss 误写为第二个 `#boss4` 的锚点；46 个 Boss 锚点现均存在且唯一。lint、TypeScript、静态构建、smoke 与图片校验通过。未推送、未部署。

## 批次 R12：统一 canonical 内容索引、生成链与搜索数据

- **状态 / 优先级：**[x] / P2。
- **目标：**让路由、registry、列表、搜索、related 与构建查询共享一次已校验的 canonical 数据，避免“搜索可见但页面 404”和 N×N 扫描。
- **来源：**A04、CQ-006、CQ-008、CQ-009、CQ-018、CQ-020。
- **范围：**构建期 metadata map/list、slug lookup、static params、Knowledge loader registry、search document model、Projects 纯数据索引、related 标题/链接解析、读取次数与规模 fixture。
- **非目标：**不引入数据库、CMS、运行时搜索服务或全局状态库；不合并两类内容业务字段。
- **前置依赖：**R11。
- **实施注意事项与风险：**生成文件仍只在内容变化时写入；搜索 JSON 必须运行时校验并兼容 R6 状态模型；Projects 从单一纯数据源进入索引，不在脚本复制清单。优化前后产物、排序和 URL 必须相同。
- **验收 / 退出条件：**Blog/Knowledge/Projects 标题、标签、中文描述可命中正确路由；related 显示标题并可跳转；route/registry/search 数量一致；20/100/500 fixture 的文件读取次数不再按页面数平方增长；静态 build 和两种 basePath 通过。
- **建议提交边界：**2 个提交：canonical 内容索引与消费者迁移；搜索/Projects/related 与性能回归。

### R12 实施结果（2026-09-16）

- Blog 与 Knowledge 在进程内构建一次已校验的 canonical index；列表、单篇 lookup、静态参数、sitemap、首页消费的既有查询、Knowledge loader registry 和搜索生成均不再各自扫描内容目录。所有 slug、publication 与 `related` 在索引建立时统一验证。
- 搜索生成直接消费该 index，并将 `projects.ts` 的单一项目数据源加入搜索文档；Knowledge `related` 以 canonical metadata 显示可跳转标题。新增一致性回归，确认路由/搜索数量为 8 篇 Blog、13 篇 Knowledge、3 个 Projects，20/100/500 次查询均复用同一索引。
- lint、TypeScript、根路径与 Pages 子路径静态构建、smoke 和图片校验通过。未推送、未部署。

## 批次 R13：收敛页面状态、筛选历史与页面族一致性

- **状态 / 优先级：**[x] / P2/P3。
- **目标：**让列表、详情、状态页和全局外壳拥有可解释的轨道与恢复行为，而不抹平页面族差异。
- **来源：**A06、A13、A17、A18、A19、CQ-009、CQ-023。
- **范围：**404/error/loading/空结果承托和中文恢复动作；Blog/Knowledge 筛选 URL/History 契约；`?view=tags` 的明确实现或移除决定；页面外轨/内轨、Footer 关系、长文可达主题入口、Dashboard 平板信息辨识。
- **非目标：**不强制所有页面同宽同高；不重做 Dashboard；不决定手机标签默认展开方式或卡片透明度等 Choice。
- **前置依赖：**R5–R7、R12。
- **实施注意事项与风险：**输入逐字状态如写 URL 应使用不会污染历史的策略；返回列表保留哪些筛选/排序/滚动需明确。错误页不直接向普通读者暴露原始异常信息。
- **验收 / 退出条件：**筛选→文章→后退恢复已定义状态，刷新 URL 语义一致；404/error/loading/空结果在 390/1440 深浅主题可读并有恢复动作；主题在长文顶部/阅读中可达；Footer/Nav/列表边轨关系明确；768px Dashboard 项目名称可辨且卡片未删除。
- **建议提交边界：**2–3 个提交：状态页；筛选/历史协议；页面轨道与可达主题入口。

### R13 实施结果（2026-09-16）

- 全局 404、异常与加载状态改为中文且提供明确恢复动作；异常页面不再向读者输出原始错误。Blog 筛选、搜索、排序和归档状态以 replace 写入 URL，前后退与刷新会还原相同状态；Knowledge 分类/归档同样使用 URL 状态，未实现的 `?view=tags` 不再作为入口存在。
- 主题切换从破坏导航对称的顶部移到右下角阅读工具：主题菜单始终可达，回顶按钮在可用时平滑加入同一竖向药丸组，菜单从左侧展开并支持触控、键盘、点击外部关闭和 reduced-motion。Footer 继续保留主题入口。
- lint、TypeScript、根路径与 Pages 子路径静态构建、smoke 和图片校验通过。未推送、未部署。

## 批次 R14：建立路由与页面 Motion System

- **状态 / 优先级：**[ ] / P2。
- **目标：**在稳定页面结构上分离持久背景、路由内容、页内 stagger 和微交互职责；导航过程无空白、叠页、过期背景或错误滚动接管。
- **来源：**A08、A09、A16、CQ-011、CQ-017。
- **范围：**先做 Blog 列表→文章→另一文章→Knowledge→后退的隔离验证；路由生命周期方案、背景 decode/失败降级、玻璃底板与内容 motion 分层、统一时序、历史/hash/scroll policy、快速连续导航。
- **非目标：**不依赖私有 router context 冻结技巧；不把 template remount 当作已完成 exit；不默认启用实验 View Transition；不使用 `transform-gpu` 作为 blur 通用修复。
- **前置依赖：**R2、R8、R10、R13；用户需先决定 C6 的方向与强度，或明确只接受最小中性过渡。
- **实施注意事项与风险：**依据实施时安装版本的本地 Next 文档验证 App Router 生命周期。旧视觉层若临时保留必须脱离普通流且不可交互；Navbar 不随正文退场；R8 的 reduce policy 是硬约束。
- **验收 / 退出条件：**暖/冷导航、快速跨三板块、同板块文章、前后退、刷新、hash 以录屏和控制台验证；退出是否真实完成有证据，未完成则明确降级为可靠轻量进入；背景失败有底色/旧图承托；静态 `out/` 与仓库子路径通过；reduce=true 无空间过渡。
- **建议提交边界：**2–3 个提交：隔离验证/路由协调；背景与内容分层；全站消费者与回归。

## 批次 R15：实施已确认的审美与可选增强

- **状态 / 优先级：**[ ] / Choice、P3。
- **目标：**只实现用户已选定且已有对照样本的视觉或功能增强；每一类选择可独立验收和回退。
- **来源：**A13、A18、A21、AR15、AR16；原收集箱 P2、P6、P8。
- **范围：**仅包含下节被明确选择的项目；每次最多处理一个视觉变量族或一个增强能力。
- **非目标：**不把未选择项打包实施；不以可选精修替代 R0–R14 的客观退出条件；不新增常驻服务端。
- **前置依赖：**对应基础批次完成；例如玻璃/字号依赖 R3、R7、R9，路由方向依赖 R14 方案，代码复制依赖 R9。
- **实施注意事项与风险：**同文同位置、深浅和桌面/手机做 A/B 对照；修改玻璃时不同时改字号，修改动效时不同时换背景，保证归因。
- **验收 / 退出条件：**用户选择被记录；实现只覆盖选定范围；对照截图、可访问性、lint/build/静态预览通过；未选择项继续保持 Choice 而非暗中默认。
- **建议提交边界：**每个选择或增强 1 个独立提交，不把多个审美决定合并。

## 需要用户决定的事项

这些选择不阻塞 R0–R13 的客观修复；C6 只阻塞 R14 的最终动效方向，其他项只影响 R15。

| 编号 | 选择 | 候选与边界 |
| --- | --- | --- |
| C1 | 阅读玻璃承托 | 保持轻透并加局部 scrim；或提高阅读面板承托；“可切换阅读模式”成本更高，默认不优先 |
| C2 | 正文字号 | 保留 16/28；或在宽度修复后比较 17/30。不能用放大/缩小字号掩盖溢出 |
| C3 | 代码主题 | 深浅都固定暗色；或使用双主题。无论选择哪项，行号/focus 的客观对比在 R7/R9 先修 |
| C4 | 中文引用 | 全站正体；或 Blog 保留斜体、Knowledge 正体。先区分引用与说明，不先建大而全 callout |
| C5 | 正文链接线索 | **已选：**强调色到头像环色的常驻渐变细线，hover 加粗；具备非颜色线索 |
| C6 | 路由转场 | 保留明显横向方向；较短位移+轻纵移；最小中性过渡；实验 View Transition 仅可隔离验证 |
| C7 | Blog 手机筛选 | 少量标签+展开；全部展开；独立筛选面板。所有标签和当前选择必须可达 |
| C8 | 首页第三方请求 | 明确隐私说明并保留；改构建期/本地静态数据；提供关闭选择。失败降级必须保留 |
| C9 | 复制体验 | 是否添加代码复制；Blog attribution 是否保留、是否排除代码块、Knowledge 是否采用同一策略 |
| C10 | 置顶内容 | 是否为 Blog 与 Knowledge 增加置顶；需在 R11 后分别定义字段与排序，不共享无意义的业务规则 |
| C11 | Hero 文案 | 诗句、署名和长期表达是否调整；全屏 Hero 与个人主页定位不变 |

## 持续性技术债

| 编号 | 持续项 | 处理规则 |
| --- | --- | --- |
| T1 | 内容编辑质量与冗长文章 | 逐篇编辑，不把内容问题伪装成渲染器 Bug；保留稳定 URL、语义和授权信息 |
| T2 | MDX 回归样本扩充 | 随真实能力增加 task list、无语言代码、PowerShell/JSON/YAML、失败图、复杂列表等 fixture，不预先建设组件市场 |
| T3 | 性能量测 | 在相关批次记录同设备同构建的图片 CLS、首页滚动合成、背景切换和搜索响应；没有 trace 不宣称性能故障 |
| T4 | 真实设备无障碍 | 逐批补真实触控、软键盘、读屏、高对比度和 200% zoom；视口模拟不能替代最终证据 |
| T5 | 内容与素材公开边界 | `.private/`、授权、来源、中文/空格路径和 publicPath 持续检查；不把 private 状态只托付给 frontmatter |
| T6 | Profile blur 条带 | R14 前持续观察；只有可复现后才作为 A09 合成问题处理，不用 `transform-gpu` 猜测修复 |

## 延后与不建议事项

| 编号 | 状态 | 内容与理由 |
| --- | --- | --- |
| D1 | Deferred | 自定义域名、EdgeOne/其他托管、ICP、PWA、离线 ZIP、PDF 导出仍属于 `atlas-plan` 阶段 6；R2 只保证配置可切换 |
| D2 | Deferred/Choice | Studio 手机体验与死代码清理（A21、CQ-022）不影响公开核心路径；先决定工具是否保留为本地独立入口，再开单独任务 |
| D3 | Deferred | 本地 `refs/codex/`、reflog 与旧 pack 清理是可破坏的本机维护，不属于站点 1.x 发布；仅在用户明确授权并确认备份后处理 |
| D4 | Deferred | 完整 callout 系统、所有长表 sticky header、灯箱、可选代码换行、外链图标，等待真实内容需求；可在 R15 单项选择 |
| D5 | 不建议 | 迁移 VitePress、引入数据库/CMS/账号/运行时搜索后端、为图片增加运行时服务；与静态优先和当前规模不匹配 |
| D6 | 不建议 | 删除 Hero、人物背景、Dashboard、Meme 或玻璃语言来换取通用文档模板；与项目定位冲突 |
| D7 | 不建议 | 全局 `overflow-x:hidden`、关闭全部动画、固定所有页面高度、通用 `transform-gpu`、一次变量化所有数值；这些会掩盖根因或制造返工 |

## 原收集箱事项归属

| 原事项 | 归属 | 说明 |
| --- | --- | --- |
| Profile backdrop-filter 模糊带 | T6 → R14（仅复现后） | 当前审计未复现，不作为已确认发布阻断项 |
| Hero 文案、署名和诗句 | Choice C11 / R15 | 不影响客观修复，不改变全屏 Hero 定位 |
| 整体布局风格美化 | R7、R13、R15 | 已完成的页面背景结论不再重复；剩余 token/页面轨道/审美选择分别归位 |
| 手机布局美化 | R3、R5、R6、R10、R13 | 按几何、导航、搜索、阅读导航和信息密度拆成可验收根因 |
| 界面高度、元素、大小、视觉统一 | R3、R7、R9、R13、R14 | 不再保留抽象“统一化”并行任务；共享能力与合理页面差异分别处理 |
| Blog/Knowledge 置顶 | Choice C10 / R15 | 等 R11 schema 后分别定义，不先侵入内容模型 |
| 文章阅读体验 | R3、R4、R7、R9、R10、R15 | 客观缺陷先修，玻璃/字号/引用等审美后选 |
| 下一轮可见界面统一方向 | R7、R13、Choice C1/C7 / R15 | token 和状态属于基础；表面强度、筛选形态属于选择 |
| 后续内容迁移 | T1、T5 | 已有导入 skill；逐篇处理，不纳入代码实施批次 |
| 文章内容优化 | T1 | 属于持续编辑，不与渲染器批次混写 |
| 独立 code review 与修复批次 | 已覆盖 | 三份审计已由 `ab764a7` 保存，本文件完成去重与批次化，不再创建第四份审计 |
| React 19 ESLint 基线 | R1 | 以零错误和 CI 阻断为退出条件 |
| Blog `new Function` | 已由现状覆盖 → R11 | 当前实现已是 `gray-matter`；不重复“移除”，只补 schema、fail-closed 与测试 |
| 原图/字体发布与历史瘦身 | 已完成历史项 | 不重新实施；保持干净 checkout 可构建的资产策略 |
| 本地 Git 对象回收 | D3 | 与站点发布无关且具破坏性，等待明确授权 |

## 全路线共同验收边界

- 涉及代码的批次至少运行 lint、TypeScript 和 build；静态/路由/资源相关批次还必须预览 `out/`。
- 公开页面至少覆盖 1440×900、768×1024、390×844；响应式根因批次增加 320px，重要视觉批次覆盖深浅主题。
- 静态验收覆盖首页、Blog 列表、至少两篇 Blog、Knowledge 列表、至少两篇 Knowledge、Projects、About、404、深层刷新、前后退、主题、搜索与控制台。
- GitHub Pages 子路径相关批次验证 `_next`、public 图片、字体、搜索 JSON 和客户端导航；未来自定义域名只验证空 basePath 产物，不擅自部署。
- Blog 与 Knowledge 的内容、URL 和 metadata 差异必须保留；共享的是 parser 基础、渲染能力、token、搜索文档模型和测试契约。
- 任何批次都不得泄露 secret、私人路径或未经确认可公开的素材；不得无授权提交、推送、部署或清理 Git 历史。
