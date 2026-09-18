# Aphrosyne Atlas 文章渲染系统专项审计

> 审计日期：2026-09-14  
> 性质：只审计，不实施  
> 证据来源：当前源码、现有 `docs/ui-ux-audit-2026-09.md`、用户附加的五张截图，以及 `http://localhost:3002` 的真实浏览器渲染

## 1. 审计结论

当前文章系统的桌面阅读基础是成立的：本地中文字体、16px/28px 正文、Blog 约 702px 与 Knowledge 约 734px 的正文宽度、深色阅读面板、H2/H3 目录以及可键盘聚焦和横向滚动的代码块，均值得保留。Blog 与 Knowledge 也已经形成合理的信息架构差异：前者强调日期、标签与连续阅读，后者强调类型、验证状态、适用版本、分类导航和快速定位。

现阶段最大问题不是“视觉风格不够像文档站”，而是阅读外壳没有可靠的收缩边界。390×844 下四个压力样本的页面宽度分别达到 970、590、720、576px，正文被裁出可视区；320px 下情况继续恶化。表格、长行内代码、上下篇导航和 Knowledge 导航会把自身最小内容宽度传回页面外壳。不能用全局 `overflow-x: hidden` 掩盖，必须从根部的 flex item、页面 `main`、阅读卡片、内容列到 table/pre 分层约束。

第二组核心问题是渲染能力不完整或漂移：表格没有局部滚动容器；图片 lazy-load 但没有尺寸预留；标题锚点是 0px 宽的空链接；H4–H6 视觉上几乎同级；正文链接只靠颜色；浅色主题仍使用固定 `github-dark` 代码块且行号对比不足；Blog 和 Knowledge 对 table、pre 内层 code 的处理不同。

第三组问题来自具体内容而非渲染器。Boss 教程的 `#boss24` 目标不存在，正文误写了第二个 `id="boss4"`；这是已经在浏览器中复现的文章内导航故障。此类问题应由内容校验发现，不能通过 CSS 修复。

本轮未发现 P0。确认 3 项 P1、10 项 P2、若干 P3/Choice；其中 P1 是移动端整页横溢、表格无局部溢出边界、长教程图片无尺寸预留。

## 2. 范围、环境与限制

### 2.1 实际环境

- 分支：`master`。
- 复用了已运行的项目开发服务器 `http://localhost:3002`，未终止任何进程。
- 浏览器：Codex in-app Chromium 浏览器；以最终 DOM、computed style、几何值和截图为证据。
- 实测文章：
  - `/blog/mdx-style-test/`
  - `/blog/dashboard-hover-backdrop-compositing/`
  - `/knowledge/experience-skill-cap/`
  - `/knowledge/colorful-magic-bosses-loot/`
- 实测视口：1440×900、768×1024、390×844、320×720。
- 四篇文章均切换过深色和浅色主题；重点页面另做了 hash 点击、hash 刷新、文末状态、图片加载、代码焦点和语义检查。
- 精确浏览器 200% zoom 未完成：当前浏览器控制层没有暴露 zoom 能力，快捷键没有改变 CSS viewport；本报告没有把等效窄视口冒充成 200% zoom 通过。320px 与 768px 结果只能作为收缩压力证据，后续仍须用可验证 zoom 值的浏览器补测。

### 2.2 初始工作树

审计开始前已有以下未跟踪文件，均视为用户原有工作，不修改：

```text
?? docs/code-quality-audit-2026-09.md
?? docs/ui-ux-audit-2026-09.md
```

本轮唯一新增文件是本文。未修改业务代码、样式、配置、依赖、文章或路线图；未提交、推送、建分支或清理工作树。

### 2.3 方法与判定边界

- 真实浏览器现象优先于截图；源码只用于解释根因。
- 已有 Astra UI/UX 报告是起点，本报告只深化 Reading Pass，不重做全站审计。
- 对可变图片背景上的半透明玻璃，单一 CSS 前景/背景色对比度不能代表实际复合对比；没有像素证据时只标为条件风险或 Choice。
- 当前没有内容样本的语法标为“缺少测试样本”，不视作已经通过或失败。
- `ui-ux-pro-max` 给出的无障碍、响应式、行高和行长基线只作为审计参照；没有用其通用“杂志站”建议覆盖本站既有玻璃、人物背景与个人视觉身份。

## 3. 附加截图与当前实现的对照

用户说明前三张为 Knowledge、后两张为 Blog。分类与当前路由外壳一致。

| 截图 | 对照结论 |
| --- | --- |
| Knowledge 1 | 三栏阅读壳、左侧知识导航、正文元信息、右侧目录与当前实现一致。桌面正文密度合理，长侧栏标题单行截断仍存在。 |
| Knowledge 2 | 超长 Boss 教程的高密度正文、嵌套目录和独立滚动轨与当前实现一致；当前真实页面总高约 43,540px。 |
| Knowledge 3 | 地图宽图完整显示、未被裁切，符合“教程图片保留原图”的正确方向；当前实测 1920×1080 原图显示为 734×412.875px。 |
| Blog 4 | 702px 主栏加 192px 目录、固定暗色代码块、透明阅读玻璃与当前实现一致。截图顶部标题被导航遮住/截断的状态在本轮直接打开页首时未稳定复现，不登记为确定缺陷。 |
| Blog 5 | Blog 的 2px 完整表格网格、代码行号、中文引用斜体与当前实现一致；表格风格明显重于 Knowledge。 |

截图与当前实测最重要的差异是分辨率而非实现代际：截图在更宽桌面上展示，无法暴露手机端整页横溢；当前浏览器在 390px 和 320px 下明确复现裁切。

## 4. 当前阅读体验中应保留的部分

- 正文字体：当前本地 Source Han Sans SC 衍生字体覆盖 400/500/700，中文正文与 Skyrim/技术术语混排稳定，无需为了“重构感”更换字体。
- 桌面正文：Blog 702px、Knowledge 734px；16px 字号、28px 行高。中文约 40–46 个全角字的行宽是合理起点。
- 页面身份：背景图、阅读玻璃、青绿强调色、粉色次强调与圆角语言构成本站辨识度，应通过承托和 token 改良，不应删除。
- 代码块：`rehype-pretty-code` 已提供语法高亮、`data-language`、行号、`overflow-x: auto` 和 `tabIndex=0`。真实键盘焦点在深色主题为 1px 浅色 UA outline，长行能在块内滚动。
- 目录：桌面 H2/H3 分组、折叠按钮、`aria-current="location"`、键盘可操作的快速滚动轨均有价值。
- 图片：使用真实 `alt`，路径会经过统一 `publicPath`，宽图按比例缩至正文宽度，地图没有被强制裁切。
- Knowledge 元数据：类型、验证状态、版本、更新时间和标签与 Blog 日期/阅读时长的差异是合理 IA，而非必须消除的漂移。
- 主题切换：在同一文章中切换深浅主题没有主动重置当前滚动位置；这符合长文阅读连续性。

## 5. 文章页面结构与渲染链路

```text
MDX 文件
  ├─ Blog: src/content/blog/*.mdx
  │    └─ getPostBySlug / 动态 import
  └─ Knowledge: src/content/knowledge/**/*.mdx
       └─ gray-matter 元数据 + 生成的 loader registry

@next/mdx
  ├─ remark-gfm / remark-frontmatter / remark-breaks
  ├─ rehype-slug / rehype-autolink-headings
  └─ rehype-pretty-code(theme: github-dark)

src/mdx-components.tsx
  ├─ h1–h6: id + scroll-mt-20
  ├─ a: 内部 Next Link / 外部原生 a
  └─ img: publicPath + lazy + max-width

页面外壳
  ├─ Blog page + PostHeader + CopyAttribution + TOC + 上下篇
  └─ Knowledge page + 元信息 + 分类导航 + TOC + 来源/关联

Tailwind Typography + globals.css prose token
```

关键源码：

- `next.config.ts:26-34`：所有文章共享 remark/rehype 管线，代码主题固定为 `github-dark`。
- `src/mdx-components.tsx:22-48`：共享标题、链接、图片渲染。
- `src/app/globals.css:83-109`：共享行号与 prose 颜色变量。
- `src/app/blog/[slug]/page.tsx:29-66`：Blog 阅读壳及页面级 prose 覆盖。
- `src/app/knowledge/[slug]/page.tsx:46-91`：Knowledge 三栏阅读壳及另一套 prose 覆盖。
- `src/components/blog/TableOfContents.tsx:46-143`：标题采集、active 判定和阅读进度。
- `src/components/blog/CopyAttribution.tsx:13-34`：仅 Blog 存在的复制归因行为。

## 6. Markdown/MDX 元素覆盖矩阵

状态含义：已实测＝至少在真实浏览器中观察；源码覆盖＝仓库有内容但不在四篇浏览器样本中完整压力测试；缺样本＝当前内容未找到可判定样本。

| 元素 | 状态 | 当前结论 |
| --- | --- | --- |
| 普通/中文/中英数字混排段落 | 已实测 | 桌面 16/28、行宽合理；手机受外壳横溢阻断。 |
| 粗体、斜体、删除线 | 已实测 | 可辨；大量粗体在高密度 Knowledge 中会形成视觉噪声，主要是内容编辑约束。 |
| 换行 | 已实测 | `remark-breaks` 把 Markdown 软换行转为硬换行；对搬运笔记友好，但作者源文件换行会成为版式决定。 |
| 超长连续文本/URL | 部分实测 | 长行内路径在 320px 可超过内容宽；缺专门的极端连续字符串夹具。 |
| 文本选择颜色 | 已实测源码 | 没有文章专用 `::selection`；沿用浏览器/全局默认，缺深浅主题视觉基线。 |
| H1–H6 | 已实测 | H1–H3 清楚；H4–H6 均约 16px/600，H5/H6 几乎不可区分。 |
| 标题锚点 | 已实测 | id 唯一化正常，但自动锚点为空、0px 宽、无可访问名称、`tabIndex=-1`。 |
| 普通/内部/外部链接 | 已实测 | 内外链接语义正确；外链无独立提示；正文链接无常驻下划线、无 visited 规则。 |
| 行内代码 | 已实测 | 14px/600、2×6px padding、圆角和背景可辨；仍显示 Typography 自动反引号，长路径不具备稳定断行策略。 |
| TS/TSX 代码块 | 已实测 | 高亮、行号、块内滚动与键盘聚焦可用。 |
| INI/text 代码块 | 已实测 | Experience 的 INI 和 Knowledge text 代码存在；Knowledge 内层 code 背景与 Blog 不一致。 |
| JS/JSON/YAML/PowerShell/日志 | 缺样本 | 当前文章代码围栏只发现 `ts`、`tsx`、`ini`、`text`。 |
| 无语言代码块 | 缺样本 | 未确认。 |
| 选中行/高亮行/错误行 | 缺样本 | 管线可能支持部分 meta，但当前内容没有回归样本。 |
| 无序/有序/多级列表 | 已实测 | 基础层级可读；Knowledge 的故障步骤适合扫描。 |
| 列表项多段、列表内代码块/引用/图片 | 缺样本 | 仓库有嵌套列表，但缺完整组合压力夹具。 |
| 任务列表 | 缺样本 | 未发现 GFM task list 内容。 |
| blockquote/多段引用 | 已实测 | 有左边线，但中文仍继承斜体与自动引号；Boss 将大量说明数据写成引用，语义与装饰耦合。 |
| 引用来源/cite | 缺样本 | 未发现稳定写法。 |
| 表格 | 已实测 | Blog/Knowledge 均能显示；无局部滚动 wrapper，样式漂移明显。 |
| 表格内代码/链接/列表 | 部分实测 | 有链接与行内代码；缺列表、多段长文本和极端多列样本。 |
| 图片与 alt | 已实测 | 47 张内容图片均使用非空 Markdown alt；无尺寸预留、figure/figcaption、原图查看。 |
| 分隔线 | 已实测 | Blog 为 2px 强线，Knowledge 为默认轻线；Boss 频繁使用会加重超长页面节奏。 |
| 原生 HTML | 已实测 | Blog 有 JSX/Tailwind 提示框，Boss 有手写空锚点；可用但缺允许范围。 |
| MDX 自定义 React 组件 | 缺样本 | 没有独立组件级回归样本。 |
| `kbd` | 缺样本 | 未发现。 |
| `details/summary` 正文 | 缺样本 | 页面外壳 Knowledge 导航使用，但文章正文没有样本。 |
| 脚注 | 缺样本 | 未发现。 |
| 音视频 | 缺样本 | 未发现，也不是当前必需能力。 |

## 7. 字体、行宽与连续阅读

桌面当前值应作为迁移基线，而不是立即改大：Blog 702px、Knowledge 734px，正文 16/28。正文段落、H2 的 48px 上距/24px 下距、H3 的 20px/32px 基本适合长文。

问题在响应式收缩，而非桌面行宽：

| 页面 | 视口 | clientWidth | document.scrollWidth | 文章宽 | 结论 |
| --- | ---: | ---: | ---: | ---: | --- |
| Blog MDX 样式帖 | 1440×900 | 1425 | 1425 | 702 | 正常 |
| Blog 普通长文 | 1440×900 | 1425 | 1425 | 702 | 正常 |
| Knowledge Experience | 1440×900 | 1425 | 1425 | 734 | 正常 |
| Knowledge Boss | 1440×900 | 1425 | 1425 | 734 | 正常 |
| Blog MDX 样式帖 | 768×1024 | 753 | 994 | 896 | P1 横溢 |
| Blog 普通长文 | 390×844 | 375 | 590 | 516.3 | P1 横溢 |
| Blog MDX 样式帖 | 390×844 | 375 | 970 | 896 | P1 横溢 |
| Knowledge Experience | 390×844 | 375 | 720 | 646.2 | P1 横溢 |
| Knowledge Boss | 390×844 | 375 | 576 | 501.8 | P1 横溢 |

DOM outlier 检查表明，根部 `ThemeProvider` 内的 `main.flex.flex-col` 本身宽 375px，但其子页面 `main.mx-auto.max-w-*` 按内容固有宽度扩至 590–970px。其后阅读卡片、内容列、table/导航继承这个宽度。Blog 普通文章即使没有表格也会受上下篇 flex 项与文章最小内容宽影响；MDX 样式帖由表格和上下篇进一步放大；Knowledge 还受分类导航与表格影响。

页面级根因见 `src/app/layout.tsx:49`、Blog `page.tsx:29-40,47-64`、Knowledge `page.tsx:46-67`。正确方向是建立每层 `w-full/min-w-0/max-width` 责任，并将可溢出内容限制在自己的滚动容器内。

## 8. 行内代码专项

当前共同值：14px、600、2px 6px 内边距、4px 圆角、无边框。Blog 普通段落行高 28px 时 inline code 自身 20px；Knowledge 因父级排版显示为 24.5px line-height。深浅主题分别使用 `--color-code-bg` 的 40% 背景，前景随主题变化，基本可辨。

确定问题：

- Typography 默认 `::before/::after` 仍显示反引号；已经有底色后，反引号既像内容又像装饰，路径密集时噪声较大。
- `box-decoration-break: slice`；跨行时背景边缘不能保证每行片段完整。
- 没有 `overflow-wrap:anywhere`/`word-break` 的明确规则。实测 Experience 中一段 inline code 宽 333.7px，已超过 320px 视口下 305px 的可用宽；当前整页横溢掩盖了它的独立风险。
- 标题或链接内 inline code 缺样本，不能确认前景继承、点击线索和锚点 slug 是否理想。

建议基线：保持 0.875em–0.9em、500/600 字重、2px 5–6px padding；背景与普通标签区分；去除自动反引号或明确保留其语义；允许长路径在标点处/任意必要点断行并使用 `box-decoration-break: clone`；链接内 code 以链接语义色或常驻下划线维持可点击性。

## 9. 代码块专项

### 9.1 已有能力

- `rehype-pretty-code` 固定 `github-dark`；实测 `pre` 背景 `rgb(36,41,46)`、正文 `rgb(225,228,232)`。
- 行号来自 `span[data-line]::before`。
- `pre` 为 `overflow-x:auto`，并由插件提供 `tabIndex=0`；键盘可进入滚动区域。
- TS/TSX、INI、text 围栏能渲染；长 TypeScript 样本 `scrollWidth=732`、`clientWidth=702`，只在代码块内部滚动（桌面正确）。

### 9.2 确定问题和取舍

- 浅色主题仍是固定暗色代码块，这本身可以是有意策略；问题是行号颜色跟随全站 `--color-muted`。浅色下 `#6b6b6b` 对 `#24292e` 仅 2.75:1，深色下 `#a3a3a3` 对同底为 5.82:1。
- Blog 明确将 `pre code` 背景设透明；Knowledge 没有同一覆盖。实测 Blog 内层 code 为透明，Knowledge 为 `code-bg/40`，属于无意样式漂移。
- 有 `data-language="ts"`，但页面没有可见语言标签或文件名标题。
- 没有复制按钮、可选换行、高亮/错误行的当前样本。
- UA focus outline 深色为 1px 浅色、浅色主题为 1px 深色，基本可见但不属于站点一致的 focus token。

本站的技术文章和配置教程有真实复制需求，但复制按钮不应被当成阻断项。推荐先统一主题 token、内层背景、焦点、滚动条与窄屏边界，再选择是否加复制按钮。语言标签适用于 TS/INI/PowerShell 等，但 `text`/日志可默认弱化或不显示。可选换行只作为读者控制，默认保留代码原始换行和横滚。

`CopyAttribution` 仅包裹 Blog；源码会在复制选择文本时追加来源，而 Knowledge 不会。本轮浏览器自动化复制返回原文本，无法证明真实系统剪贴板路径是否触发该监听器，因此不登记为浏览器确认缺陷。实施复制按钮前必须决定：复制代码是否应排除归因，Blog/Knowledge 是否应一致。

## 10. 表格、列表与引用

### 表格

- Blog 使用 2px 全网格、2px 分隔线、强调色表头和隔行底色；Knowledge 采用 Typography 默认的较轻规则。两者差异没有对应“Blog 连续阅读 / Knowledge 高密度扫描”的清晰理由，属于漂移。
- 表格直接作为 `article` 子元素，父级没有滚动 wrapper；实测 `display:table`、`overflow-x:visible`、`tabIndex=-1`。在窄屏不可能同时做到“页面不横溢”和“表格局部可达”。
- MDX 样式帖表格在 390px 布局中把内容列固有宽度推到 896px；Experience 的宽表把文章推到 646.2px。
- `th` 在浏览器中没有显式 `scope`。简单首行表头仍可理解，但复杂行/列表头需要语义约定。
- 当前无 caption、滚动提示、键盘滚动容器；sticky 表头对普通短表不必要，对 46 Boss 的 1918px 高表可作为可选密度变体评估。

推荐共享基础 table wrapper：`max-width:100%`、局部横滚、可聚焦、左右边缘/渐隐提示、1px 边线、明确表头和单元格 padding。Knowledge 可以覆盖为更紧密行高；Blog 不应默认更粗边框。sticky 表头只用于确有长表、且不会与 Navbar/目录冲突的变体。

### 列表

基础无序、有序与两级嵌套可读；Experience 的编号证据链可快速扫描。建议共享：一级缩进约 1.25–1.5em、列表项间距 0.375–0.5em、多段列表项保留段距、嵌套层级减小但不归零。当前缺任务列表、列表内大块代码/引用/图片样本。

### 引用

当前引用有左边线、斜体和 Typography 自动引号，英文风格明确；对中文说明、等级、掉落物等结构化信息并不总合适。Boss 教程大量把“等级/备注/掉落物”写为 blockquote，使“引用来源”和“信息卡”语义混在一起。这首先是内容建模/作者规范问题，不应通过把所有引用改成 callout 解决。

建议默认中文 blockquote 采用正体或低斜度、清楚左边线和可选来源；是否移除斜体是 Choice。callout 只有在“提示/警告/危险/版本限制”重复出现且作者能稳定标注时才值得建立，当前不建议先做完整组件系统。

## 11. 图片与媒体

Boss 教程初次加载、图片尚未进入懒加载范围时，首张内容图片：`width/height` 属性均为空、natural size 为 0、布局框为 0×0。通过目录进入 `#2-227` 后，相关图加载为 natural 1920×1080，实际 734×412.875px。图片本身正确适应正文宽度，但插入 412.875px 高度会改变后续内容和锚点几何。

这是全站渲染器问题，根因在 `src/mdx-components.tsx:41-48`：原生 `<img loading="lazy">` 只有 `h-auto max-w-full`，没有内容尺寸或 aspect-ratio。正确方向是构建/内容资产阶段取得真实尺寸并传入，或生成可靠比例元数据；不能给地图统一固定高度并裁切。

当前积极项：47 张 Markdown 图片均找到非空 alt；Boss 图片使用“BOSS N 位置截图”，至少能传达用途。待改进项：没有 figure/figcaption、原图查看入口、小图防无意义放大规则、加载失败样式。深色截图与深色阅读面板的边界也没有专门 token；可用 1px 中性边框而非统一重阴影。

图片验收必须同时检查：加载前后 CLS、hash 定位是否被推动、地图文字在 390px 是否可辨、触控原图查看、失败时 alt 是否保留可读位置。

## 12. 目录、锚点和文章导航

### 已确认问题

1. 小于 `lg` 时右侧文章目录完全隐藏；Knowledge 分类导航改排在全文之后。手机读者无法在正文前快速跳到章节。对应 `blog page.tsx:64`、`knowledge page.tsx:91`。
2. 普通 Blog 长文点击“结论”后，hash 正确变为 `#结论`，刷新后 hash 和滚动位置也保留，但标题只能停在 viewport y≈279px；active 仍是“解决方式”，滚动轨已经 100%。根因是固定 144px 激活线没有文末规则，见 `TableOfContents.tsx:98-107`。
3. `rehype-autolink-headings` 产生的标题 anchor 实测宽 0px、高 35px、空文本、无 `aria-label`、`tabIndex=-1`。标题 id 与目录跳转可用，但读者无法发现或复制标题链接。这是“生成了锚点”不等于“锚点交互完成”。
4. Knowledge 左栏所有标题 `truncate` 为单行；截图和实测均难以区分相似长标题。
5. Blog 上一篇/下一篇也使用单行 `truncate`，并参与手机最小内容宽传播。

### 内容层故障

Boss 教程表格中“24：异端魔人领主”链接指向 `#boss24`（内容第 58 行），正文第 810 行却误写为第二个 `<a id="boss4"></a>`。浏览器确认 `#boss4` 数量为 2、`#boss24` 为 0；点击后 URL 变成 `#boss24`，但不存在目标，不能跳到 Boss 24。这是 P2 内容缺陷，应由构建期重复 id/死 hash 校验发现。

### 正确方向

- 手机提供文章开头可达的折叠目录，不把完整桌面目录常驻占满屏幕。
- 文末 active 规则以最后章节/文章结束边界兜底，不用增加空白强行让标题越过激活线。
- 标题链接应有可访问名称和至少 44×44px 的触控入口，或在 heading hover/focus 内显示图标；不能保留 0px 空链接。
- 导航显示可允许两行，title 仅作为补充，不能替代可见文本。
- 建立 id 唯一、文章内 hash 存在、hash 刷新/前进/后退的内容校验。

## 13. 深浅主题与语义颜色

正文主体深浅主题都可读：暗色正文约 `fg 80%`，浅色正文约 `#1a1a1a 80%`；强调色对名义 surface 的对比也够用（深色 `#3b9a9a/#1a1a1c` 约 5.19:1，浅色 `#355b82/#e5e5e5` 约 5.61:1）。但实际阅读玻璃只有 `surface/50`，背后是高频、明暗变化大的图片，不能仅用 token 对比断言所有位置都通过。

确定或继承问题：

- 固定暗色代码块在浅色主题可以保留，但行号 2.75:1 不足；需要代码专用 muted token，不能复用页面 muted。
- Knowledge `verified/needs-review/outdated` 使用固定 `emerald-300/amber-200/rose-200`，浅色主题仍沿用；这是 Astra A05 已覆盖的状态色问题。
- Knowledge 版本、更新时间、标签大量使用 `fg/45–55` 且字号 12–14px；浅色复合背景下属于高风险次要文字，需要逐项满足 4.5:1，不能以“次要”作为降对比理由。
- 正文链接仅靠颜色，默认 `text-decoration:none`，没有 visited 规则；hover 粉色不能帮助触控和键盘用户。
- 没有文章专用 selection、focus、table border、code muted、image border 等语义 token。

建议 token 至少包括：`reading-surface`、`reading-text`、`reading-muted`、`link/visited/link-hover/link-focus`、`inline-code-*`、`code-block-*`、`table-*`、`quote-*`、`media-border/caption`。深浅主题表达可以不同，但角色必须相同。

## 14. 手机、平板、桌面与缩放

### 1440×900

三栏 Knowledge 与两栏 Blog 均稳定；正文宽、字号和行高合理。主要问题是玻璃承托选择、长标题截断、目录文末边界和浅色状态/代码色。

### 768×1024

普通 Blog 与 Knowledge 的部分样本宽度可落在 655px，但 MDX 表格样式帖已经达到 `scrollWidth=994`、文章 896px，说明断点隐藏目录并不等于内容能收缩。此宽度还没有本篇目录。

### 390×844

四篇均出现不同程度整页横溢；截图中能直接看到文字被右边裁断、底部出现整页水平滚动条。Knowledge 分类导航位于全文之后；Boss 教程长达约 45,000px，移动读者到目录前必须穿过整篇。

### 320×720

布局根因不变：可用 clientWidth 305px，四页 scrollWidth 仍约 970/590/720/576px。行内路径、宽表、上下篇与分类导航风险进一步放大。

### 200% zoom

未验证。后续必须在能显示实际 zoom 值的 Chromium/Firefox 中，以 1440×900 物理窗口、200% 页面缩放复测：全文宽度、导航可达、焦点不被裁、代码/表格局部滚动、目录与回顶按钮不遮挡正文。不得用 720px viewport 结果替代文字缩放与浏览器 zoom 行为。

## 15. Blog 与 Knowledge 的共享和差异

### 应共享

| 能力 | 理由 |
| --- | --- |
| 正文字号、行高、段距与 H1–H6 阶梯 | 同一品牌、同一中文阅读基础。 |
| 链接/visited/focus | 可访问性不应由内容类型决定。 |
| 行内代码与长路径断行 | 两类内容都包含术语、路径、配置项。 |
| 代码块容器、主题 token、行号、滚动与焦点 | 当前 Knowledge 内层背景漂移没有 IA 理由。 |
| table wrapper 与基础单元格规则 | 两类都需要局部滚动和键盘可达。 |
| blockquote、图片、图注、失败/尺寸策略 | 内容语义相同。 |
| heading id、可用锚点和 hash 校验 | 目录和分享链接的共同基础。 |
| overflow/min-width 责任 | 页面安全边界，不是视觉差异。 |
| reading-surface 与语义颜色角色 | 可允许数值覆盖，但角色应一致。 |

### 可以不同

| 差异 | 判定 |
| --- | --- |
| Blog 日期、标签、阅读时长、上下篇 | 有意 IA；服务连续阅读。 |
| Knowledge 类型、验证状态、版本、更新时间、来源、关联 | 有意 IA；服务复现与可信度判断。 |
| Knowledge 分类导航 | 有意 IA；但手机放在全文后是响应式缺陷。 |
| Knowledge 更紧密的表格/列表密度 | 可以保留为命名变体；当前没有明确 token，尚属样式漂移。 |
| Blog 2px 重表格，Knowledge 轻表格 | 无明确内容理由，当前是无意漂移。 |
| Blog `pre code` 透明、Knowledge 内层 `code-bg/40` | 无信息架构理由，当前是无意漂移。 |
| Blog 复制归因、Knowledge 无复制归因 | 需要内容授权/使用体验决策，不应默认为合理差异。 |
| Blog 更偏连续阅读、Knowledge 更偏定位/扫描 | 正确方向；对应目录、状态、表格密度，而不是两套基础正文 CSS。 |

## 16. 按优先级排列的问题单

| 编号 | 级别 | 类型/归属 | 确认条件与证据 | 根因与推荐方向 | 验收 |
| --- | --- | --- | --- | --- | --- |
| AR01 | P1 | 客观缺陷；页面外壳 | 390px 四样本 `scrollWidth` 590–970；正文裁断 | root flex item 下页面 `main` 按 min-content 扩张；逐层建立 `w-full/min-w-0/max-width`，上下篇允许收缩 | 320/390/768 深浅无整页横滚；只允许 pre/table 局部滚动 |
| AR02 | P1 | 客观缺陷；共享渲染 | table 直接位于 article，`overflow-x:visible`、无 wrapper、不可聚焦 | 共享 table 容器；局部横滚、焦点、提示与 1px 基础边线 | 多列表格不撑宽页面；键盘可进入、滚动、离开 |
| AR03 | P1 | 稳定性；共享图片 | Boss 图片加载前 0×0，加载后 734×412.875 | 资产尺寸/比例进入渲染数据；保留 lazy 和原图比例 | 图片加载不推动后续标题/hash；生产 CLS 补测 |
| AR04 | P2 | 效率/可访问性；页面外壳 | `<lg` 目录隐藏，Knowledge 分类导航在 43k px 正文后 | 手机折叠本篇目录；分类入口与全文解耦 | 390px 在正文前可跳任一 H2/H3 |
| AR05 | P2 | 定位；TOC | 点击/刷新 `#结论` 后 active 仍“解决方式”，progress=100 | 文末 active 兜底与观察器/点击交接 | 最后一节在点击、自然滚动、刷新时均 active |
| AR06 | P2 | 可访问性；共享 heading | 自动标题链接 0px、空名、`tabIndex=-1` | 配置 autolink 内容/属性，提供可见或聚焦可见入口 | 键盘/触控可复制标题链接；名称可读 |
| AR07 | P2 | 可访问性；共享 link | 无下划线、无 visited，hover 才变色 | 常驻非颜色线索；完整 link state token | 深浅主题 normal/visited/hover/focus/active 可辨 |
| AR08 | P2 | 对比/一致性；代码 | 浅色行号 2.75:1；固定暗底内层 Blog/Knowledge 不同 | 代码专用 muted；统一 pre/code 责任 | 行号至少 4.5:1；两类相同基础渲染 |
| AR09 | P2 | 层级；共享 heading | H4/H5/H6 都 16px/600，H5/H6 16/28 且相邻时无上距 | 建立完整标题阶梯和相邻标题规则 | 不看 DOM 也能区分 H4–H6；不夸大层级 |
| AR10 | P2 | 溢出；inline code | 333.7px inline path 超过 320px 可用 305px；无断行规则 | `overflow-wrap`、断点和 decoration clone | 长路径/命令在 320px 不撑宽、不丢字符 |
| AR11 | P2 | 对比；Knowledge 元信息 | 浅色固定状态色、12px `fg/45–55` | 深浅状态与 muted token 分离；保留文字标签 | 所有必要小字 ≥4.5:1，状态不只靠颜色 |
| AR12 | P2 | 客观缺陷；文章内容 | Boss `#boss24` 不存在，`#boss4` 重复 2 次 | 修文章 id；构建期校验重复 id/死 hash | 表格 46 个跳转全部到正确条目 |
| AR13 | P2 | 语义；全站外壳 | 文章页实测 2 个 `<main>`，根 `lang="en"` | 延续 Astra A15：单一 main、中文 lang | 地标唯一，读屏按中文发音 |
| AR14 | P3 | 一致性；表格/分隔线 | Blog 2px 全网格与 Knowledge 默认轻线无意漂移 | 共享 1px 基线，密度变体显式命名 | 两类差异均有内容理由 |
| AR15 | P3 | 中文排版；blockquote | 中文引用斜体+自动引号；Boss 把数据当引用 | 正体候选；先定作者语义，不强推 callout | 中文长引文与说明均清楚、不误义 |
| AR16 | Choice | 审美/条件风险；阅读玻璃 | 截图与实测显示亮暗背景穿透程度变化；未取得逐像素最差对比 | 比较 3 个承托方案，保留背景/玻璃身份 | 同文同位置深浅对照后由用户选择 |

## 17. 文章渲染基线草案

下表是实现前的规范草案；“候选”表示需视觉对照或内容样本后确定。

| 项目 | 共享基线草案 | 允许覆盖 |
| --- | --- | --- |
| 正文宽度 | 目标 720px；可接受 680–740px；外壳始终 `w-full/min-w-0` | Blog 可 700–720；Knowledge 可 720–740 |
| 正文字号/行高 | A 保守 16/28；B 舒适 17/30 | Knowledge 高密度默认优先 A；Blog 可比较 A/B |
| 段距 | 1–1.25em；相邻短句不靠手工 `<br>` 模拟段落 | Knowledge 条目型内容可略紧 |
| H1 | 页面文章标题移动 30/36、桌面 36/40；正文一般不再用 H1 | MDX 样式夹具例外 |
| H2 | 24/32，约 48px 上距、16–24px 下距 | Knowledge 高频章节可略减上距 |
| H3 | 20/30–32，约 30–36px 上距、12–16px 下距 | 无 |
| H4 | 17–18/28、600 | 无 |
| H5 | 16/26、600，可配弱边/编号 | 无 |
| H6 | 14–15/24、600、muted 但满足对比 | 无 |
| 标题锚点 | sticky offset 由 Nav 实高+间隙 token 决定；可触控、可聚焦、有名称 | 目录显示文本可按内容类型精简 |
| 列表 | 1.25–1.5em 缩进；项距 0.375–0.5em；嵌套层级清楚 | Knowledge 可更紧但不降低至 0 |
| 行内代码 | 0.875–0.9em、500/600、2×5–6px、4–6px 圆角、必要时 anywhere 断行 | 无 |
| 代码块 | 固定暗色或双主题二选一；局部横滚、可聚焦、代码专用 token、默认不强制换行 | Knowledge 可显示配置文件名；Blog 可显示语言 |
| 表格 | 共享可聚焦滚动容器、1px 边、明确 th、12–16px 横向/8–12px 纵向 padding | Knowledge 可有 compact；长数据表可选 sticky header |
| 引用 | 左边线、正体候选、来源样式；不把警告语义只交给颜色 | Blog 可更具编辑感；Knowledge 可更紧 |
| 链接 | normal/visited/hover/focus/active；常驻细下划线或等价非颜色线索 | 外链图标是否显示为 Choice |
| 图片 | 固有尺寸/比例预留、max-width、禁止默认裁切、非空 alt、可选 figcaption | Knowledge 地图可提供原图查看；Blog 可更强调图注 |
| 阅读玻璃 | 角色为 `reading-surface`，独立于普通 card；建议比较 72–88% 承托或局部 scrim | Blog/Knowledge 可有小幅密度差，不应各写临时 alpha |
| 主题 token | reading/link/code/table/quote/media/focus/status 分角色 | 数值可按深浅和页面族覆盖 |
| 移动行为 | 页面无横溢；pre/table 局部滚；本篇目录在正文前可达；图片完整 | Knowledge 分类入口可独立折叠 |
| 文末 | 正文、来源、上下篇/相关内容有清楚结束节奏 | Blog 上下篇；Knowledge 来源/关联 |

## 18. 需要用户决定的设计选择

### C1 阅读玻璃承托

- A：保持当前 50% 轻透，仅给正文局部文字 scrim。氛围最强，但规则复杂，背景干扰仍可能出现。
- B：阅读面板提高至约 72–88% 承托，边缘仍保留 blur/透明。长读最稳，推荐先做对照候选。
- C：提供“沉浸/强化阅读”切换。灵活，但增加控件、状态和测试成本；当前不优先。

### C2 正文字号

- A：保留 16/28。信息密度和当前页面高度稳定。
- B：17/30。连续阅读更松，但 Boss 页面会更长。应在先修宽度后再比较。

### C3 代码主题

- A：深浅主题都用暗色代码块。维护低、技术感强；必须独立修行号/focus token。
- B：随主题切换 Shiki 主题。整体统一，但 token、SSR 体积和回归成本更高。

### C4 中文引用

- A：改为正体、保留左边线与可选引号，更适合说明和长中文。
- B：保留斜体作为 Blog 的编辑表达；Knowledge 正体。差异需写进规范。

### C5 链接线索

- A：正文链接常驻细下划线+offset，最清楚。
- B：常驻底部渐变/边线，视觉更轻但实现更复杂。
- 外链是否加图标也需选择；无论如何不能只靠 hover 颜色。

### C6 复制体验

- 是否增加代码复制按钮。
- Blog 自动追加 attribution 是否保留，是否排除代码块，Knowledge 是否同样处理。此项涉及内容授权和作者偏好，不由审计者决定。

### C7 Callout

- 当前建议“不建立完整系统”；若以后导入内容反复出现明确的 Note/Warning/Danger/Version 限制，再以 2–3 种语义起步，图标+标题+文字共同表达，不只靠颜色。

## 19. 建议实施顺序

### 第一批：阻断阅读

1. AR01 页面收缩链；同时回归上下篇、Knowledge 导航和 Footer。
2. AR02 table 局部滚动；不能等 AR01 后才发现宽表仍破坏页面。
3. AR03 图片尺寸预留；随后重验 hash 与 TOC。
4. AR12 修 Boss 24 锚点，并加重复 id/死 hash 校验。

### 第二批：低风险统一基础规则

1. 共享 link、inline code、focus、heading H4–H6 token。
2. 代码专用颜色与 Blog/Knowledge `pre code` 统一。
3. 表格 1px 基线、quote 与 hr 的共享默认值。
4. `lang` 和单一 main 与 Astra A15 同批处理。

### 第三批：共享渲染组件

1. Table wrapper。
2. 带尺寸/figure/figcaption/原图能力的内容图片渲染。
3. 可用标题锚点与 build-time id/hash 校验。
4. 移动目录；保留 Blog/Knowledge 各自外壳和元数据。

### 第四批：用户审美选择

阅读玻璃、16/28 vs 17/30、固定暗色 vs 双主题代码、中文引用正斜体、链接常驻线索。

### 可选增强

代码复制按钮、可选代码换行、外链图标、Knowledge 长表 sticky header、原图灯箱。

### 暂时不值得实施

大而全 callout 组件库、所有表格统一 sticky header、复杂 MDX 组件市场、为了文档感删除背景/玻璃、把站点迁往 VitePress、为静态图片引入运行时图片服务。

## 20. 验收矩阵

| 维度 | 必验内容 | 通过条件 |
| --- | --- | --- |
| 路由 | 四篇压力样本 | 直达、刷新、前后退均显示完整正文 |
| 视口 | 1440×900、768×1024、390×844、320px | 无整页横滚；卡片和文字完整 |
| 缩放 | 100%、200% | 200% 下仍可操作，无内容丢失 |
| 主题 | 深/浅 | 正文、元信息、链接、状态、代码、表格均可读 |
| 标题 | H1–H6、长中英标题 | 层级清楚，自然换行，不撑宽 |
| 锚点 | 目录点击、标题链接、hash 刷新、前进/后退、文末 | offset 正确、active 正确、链接可访问 |
| 链接 | internal/external/visited/hover/focus/active | 不只靠颜色；焦点清楚 |
| inline code | 中文标点、路径、命令、标题/链接组合 | 不撑宽；跨行背景完整 |
| code block | TSX/INI/text/PowerShell/JSON/YAML/日志、无语言、长行 | 局部滚、可聚焦、颜色合格、触控可横移 |
| table | 4列、17列、长文本、代码/链接/列表 | 局部滚、焦点与退出正常、列头语义明确 |
| list/quote | 嵌套、多段、组合内容 | 层级与段距稳定，中文引用不误义 |
| image | 宽图、长图、小图、深色截图、失败图 | 尺寸预留、不裁信息、alt/图注/原图路径正确 |
| 长文 | Boss 全文、文末来源/导航 | 目录可达、加载不推定位、正文结束清楚 |
| 控制台 | 四路由深浅/断点 | 无 hydration、运行时错误和资源 404 |

## 21. 未完成测试与不确定项

- 精确 200% 浏览器 zoom：当前控制能力无法验证 zoom 值，未伪装为通过。
- 真实触控设备、移动软键盘、屏幕阅读器和高对比模式。
- 生产静态 `out/` 与 GitHub Pages 子路径。本轮是文档审计，未构建，也未重写现有静态产物。
- 图片失败注入、慢网 CLS/性能 trace；目前只确认加载前 0×0 与加载后几何变化。
- visited 链接的跨会话视觉；源码无规则，浏览器隐私限制也不允许通过 computed style可靠读取 visited 颜色。
- CopyAttribution 的真实系统剪贴板路径；浏览器自动化复制未触发可观察 attribution，源码行为与系统剪贴板仍需人工补验。
- 当前缺少的 `mdx-style-test` 夹具：任务列表、列表项多段、列表内代码/引用/图片、超长 URL、无分隔长英文数字、标题/链接内 inline code、无语言代码块、PowerShell、JavaScript、JSON、YAML、长日志、高亮/错误行、表格内列表与超长单元格、caption、图片失败/小图/长图、引用来源、脚注、`kbd`、正文 `details/summary`、自定义 React 组件、连续多个代码块/表格、空段落。
- 阅读玻璃的最差复合对比没有逐像素取样；当前只确认其随背景变化，最终透明度必须由用户在同一文章、同一位置的深浅对照中选择。
