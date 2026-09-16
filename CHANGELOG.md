# Changelog

本站使用 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 的记录结构，并以 [Semantic Versioning](https://semver.org/lang/zh-CN/) 标记可发布的站点版本。

- `Added`：新的公开功能、内容模型或重要内容集合。
- `Changed`：已有功能、信息架构或公开约定的行为变化。
- `Fixed`：影响访问、显示、构建或内容正确性的修复。
- `Removed`：不再维护的公开功能或内容。

单篇文章的增补、日常勘误和状态更新时间不强制发布站点版本；它们应在条目的“最后编辑”字段与验证状态中记录。涉及导航、搜索、内容模型、部署或一批内容迁移的变更，才进入站点 Changelog。

## [Unreleased]

### Changed

- Blog 与 Knowledge 文章现在共用基础 MDX 排版契约：标题阶梯、代码/表格滚动壳与 1px 表格基线、引用、分隔线及键盘焦点一致；正文链接采用强调色到头像环色的常驻渐变细线。
- Blog 与 Knowledge 长文在手机正文前新增折叠目录，标题提供具名可聚焦锚点；桌面目录、hash 定位与标题滚动偏移统一，长目录及上下篇标题会以两行显示。
- Blog 与 Knowledge 的 frontmatter 现在在应用和构建期统一严格校验；缺失或非法 publication、失效关联、重复 slug/id 与文章死 hash 会阻止静态产物生成。
- Blog、Knowledge 与 Projects 的搜索、路由和生成链现在使用 canonical 内容索引；相关文档显示可跳转的标题，重复内容扫描不再随页面查询次数增长。
- 列表筛选状态现在可由 URL、刷新和浏览器历史恢复；中文 404、加载和异常状态提供恢复动作。主题切换收束到右下角阅读工具与 Footer，不再破坏顶部导航布局。

## [1.5.0] - 2026-09-15

### Fixed

- Blog、Knowledge 与 About 的阅读壳现在可在窄屏收缩；长链接和 inline code 不再撑宽整页，代码块与宽表保留为可聚焦、可用键盘横滚的局部区域。
- MDX 中的根路径链接和图片会继承静态部署子路径，避免 GitHub Pages 仓库路径下的文章资源失效。
- MDX 文章图片现在在静态 HTML 中携带来自实际发布资产的宽高，lazy 加载不再改变后续正文几何；构建和 Pages 工作流会校验尺寸与替代文本。
- 移动导航改为带焦点闭环与滚动锁的 overlay，打开、关闭或 Escape 不再推动正文；桌面二级导航可由独立键盘按钮展开。
- 页面文档语言统一为中文，并在静态 HTML 中保持单一主地标；隐藏的“返回顶部”控件不再进入键盘焦点序列。
- GitHub Pages 子路径和结尾斜杠下的导航当前态会统一归一化，About 等普通页面现在能正确高亮。
- 搜索对话框现在具备焦点闭环、关闭后的焦点归还、加载/失败/重试/空结果状态与静态索引数据校验，不再静默失败。
- 主题状态、强调按钮、阅读/对话表面、代码行号与焦点环改为语义 token；深浅主题的状态标签和 Dashboard 必要小字不再依赖低对比白色或组件内重复色表。
- 系统启用“减少动态效果”后，连续跑马、旋转和空间位移动画会降级；TagCloud 与技能列表保留为完整静态内容，滚动入口改为即时定位。

### Changed

- 静态预览、basePath、canonical、robots 与 sitemap 统一使用可配置的部署 URL；发布前可分别验证仓库子路径和根路径产物。
- Blog 顶部导航收束为单一直接入口，移除没有筛选效果的“全部文章”和“标签”下拉项。

## [1.4.0] - 2026-09-14

### Changed

- Blog、Knowledge 与 Projects 的内容工具条、卡片表面、焦点反馈及移动端布局收敛至同一视觉与交互基线；阶段性设计说明见 [界面统一化记录](docs/ui-unification-1.x.md)。
- Blog 列表改为由右向左逐条短距离入场，并沿用 Knowledge 的错峰节奏；动画只改变位移，避免玻璃卡片的 backdrop blur 合成闪烁。
- Blog、Knowledge 详情页，以及首页、About、Footer 的可操作元素补齐一致的键盘焦点与触控尺寸。

### Added

- 路线图新增 [UI][P8]，用于在继续界面统一化前明确下一轮可见的改动方向与验收范围。

## [1.3.0] - 2026-09-13

### Changed

- Knowledge 内容模型改为使用 `status` 与单一 `last_edited` 时间戳；内容导入规范、知识库说明、README 与路线图同步移除“最后验证时间”约定。
- Blog 与 Knowledge 列表增加可切换排序依据和升降序的等宽分段控件。

### Fixed

- 快速连续切换页面时，背景动画与主题蒙版可能滞留在旧页面的问题。

## [1.2.0] - 2026-09-13

### Added

- 新增 Crimson Sin 流派构筑总览，以及 UBE 服装运行时 morph 穿模排查两篇知识库文章。
- 新增 `atlas-content-import` 内容导入 skill，用于安全迁移 Blog 与 Knowledge MDX 内容。
- 从 Northern Mod Archive 迁入 6 篇已发布的 Skyrim Knowledge 文章，并将全部 18 篇原始 Markdown 归档至本地 `.private`。

### Changed

- 内容导入规范明确 Knowledge 必须使用 `.mdx` 后缀，并补充 UTF-8 编码与 Windows 验证器调用要求。
- 全部 Blog 与 Knowledge 文章均显式声明 `publication` 状态，避免依赖运行时默认值。
- MDX 渲染支持保留普通段落中的单个换行，改善从外部 Markdown 导入中文笔记时的原有排版。

### Removed

- 移除不再维护的 `branch-rescue` 与 `getting-started` Blog 草稿。

## [1.1.0] - 2026-09-12

### Changed

- 1.x UI 刷新（背景面板、内容列表与项目展示）的完整设计判断和验收记录见 [UI 刷新记录](docs/ui-refresh-1.x.md)。
- 字体构建改为优先使用已提交的 WOFF2 发布产物；本地完整 OTF 仅用于显式重新生成，缺失时不再阻塞干净 checkout 的构建。
- Knowledge 元数据收束为单一“最后更新”时间戳，移除独立的最后验证时间与相关排序、展示、搜索索引逻辑。

## [1.0.0] - 2026-09-09

### Added

- 首批可搜索、可分类浏览的 Skyrim 知识库：教程、问题修复、实验记录与多图 Boss 参考资料。
- Blog 与 Knowledge 的统一发布状态：`published`、`archived`、`unlisted` 与 `draft`。
- Knowledge MDX 导入注册表的构建期自动生成与重复 slug 检查。
- 项目、站点身份、公开链接和 Dashboard 文案的集中配置；README 增补 Fork 后客制化说明。
- Dashboard 的客户端 Status（公开 Gist）和 Hitokoto（公开一言接口）增强，并提供静态回退。
- 本地明文 Status 发布脚本：自动拆分行末 emoji，并安全复用 Git 忽略的 GitHub Token 配置更新公开 Gist。

### Changed

- 项目列表、Blog 与 Knowledge 统一为静态优先的内容展示与搜索体验。
- `.spec/` 中的旧规范和踩坑记录迁至 `docs/archive/`；不公开的本地材料统一放入 Git 忽略的 `.private/`。
- 首页 Blog、Knowledge 与 Projects 卡片统一提供右上角入口；Knowledge 卡片自动列出全部公开条目，内容过多时在卡片内滚动。

### Fixed

- GitHub Pages 子路径下的静态资源、深层文章路由与客户端导航兼容性。
- 玻璃卡片被父级透明度动画包裹时出现的 backdrop blur 延迟问题。

### Removed

- Playground、音乐播放器、FFT、Steam 与 GitHub Contributions 等不再维护的首页功能。
