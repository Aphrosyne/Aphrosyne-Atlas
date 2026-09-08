# Aphrosyne Atlas — Coding Agent 工作说明

## 开发依据

按以下顺序理解项目：

1. `docs/atlas-plan.md`：项目定位、阶段边界与长期路线。
2. 当前代码和 Git 状态：真实实现、完成进度与工作树状态。
3. `docs/archive/`：已归档的前端实现约束和踩坑记录，仅作历史参考。
4. `docs/legacy-blog-notes.md` 与 `docs/legacy-blog-roadmap.md`：旧博客阶段的历史资料，不作为当前进度依据。

计划描述目标，代码描述现状。两者冲突时，不把路线图复选框、旧文档、分支名或版本描述当成已完成事实；先检查代码和可验证结果，再决定是否修订计划。

推进路线图阶段时使用项目 skill：`.agents/skills/atlas-stage/SKILL.md`。

## 当前实现注意事项

- 技术栈为 Next.js 16 App Router、React 19、Tailwind CSS v4、Framer Motion 与 MDX。
- Dashboard 使用 12 列显式 Grid；卡片位置和入场方向集中由 `GRID`、`DIR` 控制。底部卡片使用 `bottom` 方向入场曾导致滚动卡顿，调整时可参考 `docs/archive/framer-motion-blur.md`。
- 当前 Blog 从 `src/content/*.mdx` 动态导入文章。`src/lib/posts.ts` 仍通过正则和 `new Function` 读取 metadata，并依赖兼容 CRLF 的 `\r?\n`；这是待替换的旧实现，在知识库内容模型阶段前不要无测试地重写。
- 主题颜色通过 `src/app/globals.css` 的 CSS 变量映射到 Tailwind v4；修改主题实现时可参考 `docs/archive/tailwind-v4.md`。

## 项目目标

Aphrosyne Atlas 是一个静态优先、具有个人视觉风格的内容站：

- 首页保留个人表达和全屏 Hero。
- Blog 承载原有文章、开发记录与随笔。
- Knowledge 承载 Skyrim 教程、问题修复、实验记录和参考资料。
- 两类内容共用一个 Next.js 项目、视觉系统、搜索入口和部署流程，但采用各自合适的信息架构。
- 构建产物应能部署到 GitHub Pages，并为以后使用其他静态托管或自定义域名保留空间。

## 不可违反的规则

1. **遵守阶段边界。** 静态化、部署验证、旧功能删减和知识库建设分阶段进行，不把后续重构混入当前任务。
2. **静态化不等于去个性化。** 在路线图阶段 0–1，不主动缩短或移除首页 Hero，不重新设计首页，不因动态能力失效而删除整个视觉组件。
3. **静态产物必须独立可用。** 完成静态迁移后，核心页面不得依赖常驻 Node.js 服务、私有 API、Server Actions 或运行时环境变量。
4. **公开仓库不得包含秘密或私人内容。** 不提交 `.env.local`、Token、API Key、私人网盘链接、个人路径或未经确认可公开的素材。
5. **部署路径不能硬编码。** GitHub Pages 仓库子路径和未来自定义域名必须通过统一配置处理；审计普通图片、CSS URL 和客户端请求，因为它们不会自动继承 `basePath`。
6. **Blog 与 Knowledge 不混为同一种内容。** Blog 按日期与标签组织；Knowledge 按分类、版本、验证状态和关联关系组织。共享渲染能力，不强行共享全部元数据与导航逻辑。
7. **保护用户内容和现有改动。** 不擅自删除、覆盖、移动或批量改写文章与图片；处理来源不明的工作树修改前先确认归属。
8. **中文内容是一等公民。** 新功能必须支持 UTF-8、中文标题、中文搜索和 Windows 中文路径；不能假设文件名遵循统一格式。
9. **不主动修改历史文档。** 除非用户明确要求，不修改 `docs/archive/`、`docs/legacy-blog-notes.md` 与 `docs/legacy-blog-roadmap.md`。
10. **不扩展未经确认的产品范围。** 不自行加入账号、数据库、评论后台、AI 问答、内容爬取或其他需要长期服务端维护的系统。

## Next.js 规则

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

执行要求：

- 修改 Next.js 行为前，完整阅读与任务直接相关的本地版本文档。
- 动态路由用于静态导出时必须提供完整的静态参数，并明确未知参数行为。
- 不凭旧版本经验假定 `output`、缓存、Route Handler、Image 或字体行为。
- `next dev` 成功不代表静态部署成功；静态阶段必须检查 `next build` 生成的 `out/`。

## 开发方式

- 开始前检查 `git status`，区分当前任务改动与用户已有改动。
- 分析代码遵循“入口文件 → 调用链 → 相关配置 → 必要时扩大范围”，避免无目的扫描。
- 改动保持小而可审查；优先完成一个可验证闭环，再进入下一项。
- 修复问题时处理根因，不用隐藏内容、关闭动画或删除功能来掩盖构建与渲染错误，除非路线图已决定删减。
- 新增共享逻辑时放入职责明确的组件或 `lib` 模块，不继续向大型页面组件堆积无关行为。
- 不复制粘贴 GitHub Pages 仓库名到多个组件；公开资源路径应有单一来源。
- 外部服务必须具有失败降级；静态站的核心导航、文章和知识库不能因第三方接口失败而不可用。

## 本机 Python 环境

- 本机已安装用户级 Python 3.14；在 Codex PowerShell 中，`python`、`python3` 与 `py` 均已实际验证可运行。不得仅根据 PATH 文本、`Get-Command` 的首项或 WindowsApps 中的零字节应用执行别名断言“没有 Python”。
- 当前用户级解释器可通过 `py -0p` 动态查询；稳定的回退入口为 `py -3.14`、`$env:LOCALAPPDATA\Python\bin\python.exe` 或 `$env:LOCALAPPDATA\Python\pythoncore-3.14-64\python.exe`。
- Codex 桌面端另带独立的 Python 3.12 运行时，当前入口为 `$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`。涉及文档、PDF、表格、图片等 Codex bundled 工具时，先调用工作区依赖查询能力获取当次实际路径，不假定 bundled 版本永久不变。
- 判断 Python 是否可用时，至少实际执行 `python --version`；若失败，再执行 `py -0p` 与 `py -3.14 --version`，并用 `Test-Path` 核对上述入口。只有这些检查都失败后，才能报告 Python 不可用。
- 如果项目以后建立 `.venv`，项目脚本和测试优先使用 `.venv\Scripts\python.exe`；当前没有项目虚拟环境。不要因为 WindowsApps 排在 PATH 前面就擅自修改系统 PATH、关闭应用执行别名或重新安装 Python。

## Git 提交规范

- 提交标题使用 `<type>[(范围)]: <中文说明>` 格式，沿用 `feat`、`fix`、`docs`、`refactor`、`test`、`chore` 等 Conventional Commit 前缀。
- 冒号后的标题说明和提交正文使用中文；文件名、代码标识、库名和不可替代的技术术语可保留原文。
- 范围为可选项，可以使用阶段名、功能名或模块名，例如 `feat(阶段1): 完成静态导出基础配置`。
- 一次提交只表达一个清晰目的，不把功能、无关重构和文档整理混在同一提交中。
- 示例：`docs: 整理开发文档并建立项目规则`、`fix(静态导出): 修复 GitHub Pages 子路径资源加载`。

## 视觉与交互约束

- 延续现有背景、玻璃拟态、主题变量和动效语言，除非当前任务明确是视觉重构。
- 知识库可以使用更高对比度、更高密度的阅读布局，但应与全站保持同一品牌系统。
- 尊重 `prefers-reduced-motion`，交互不能只靠 hover 表达，移动端必须有可用路径。
- 不使用 `transform-gpu` 作为 backdrop blur 闪烁或延迟渲染的通用修复；先定位层叠、动画属性和合成边界。
- 视觉修改至少检查一个桌面尺寸和一个移动尺寸；重要页面需要与既有基线对照。

## 内容与资产约束

- Blog 和 Knowledge 的源文件是长期资产，迁移时优先保持正文语义和稳定 URL。
- 知识库 frontmatter 必须可解析、可校验，不通过执行字符串代码读取元数据。
- 图片、引用和第三方资料进入公开站点前要确认来源与授权；未确认可公开的本地材料放在根目录 `.private/`，不默认公开。
- 不同时维护 Markdown 与 PDF 两份正文；PDF 仅作为明确需要的发布物或下载附件。
- 修复 Markdown 路径时兼容空格、中文和正斜杠 URL，不把本机绝对路径写入网页。

## 验证

根据改动范围选择验证，基础命令为：

```bash
npm run lint
npm run build
```

静态导出阶段还必须：

- 使用静态文件服务器预览 `out/`，不能只测试开发服务器。
- 检查首页、Blog 列表、至少两篇文章、深层路径刷新、404、主题切换和资源加载。
- 检查浏览器控制台中的 404、hydration 和运行时错误。
- 验证 GitHub Pages 子路径下的 `_next`、`public` 图片和客户端数据路径。

纯文档修改可不运行应用构建，但应检查链接、文件路径和说明是否与当前代码一致。

## 完成定义

任务只有在以下条件满足时才算完成：

- 实现内容与用户确认的范围一致，没有提前侵入后续阶段。
- 有明确的成功、失败和降级行为。
- 相关 lint、构建或手动验收已通过；未执行的验证要说明原因。
- 没有破坏首页核心视觉、中文内容、既有 URL 或静态部署路径。
- 没有泄露秘密、私人信息或未经确认公开的内容。
- `docs/atlas-plan.md` 只勾选有证据支持的完成项，并准确保留剩余工作。
- 提交和推送仅在用户明确要求时进行。
- 执行提交时，标题与正文符合本项目的中文提交规范。
