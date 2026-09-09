# Changelog

本站使用 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 的记录结构，并以 [Semantic Versioning](https://semver.org/lang/zh-CN/) 标记可发布的站点版本。

- `Added`：新的公开功能、内容模型或重要内容集合。
- `Changed`：已有功能、信息架构或公开约定的行为变化。
- `Fixed`：影响访问、显示、构建或内容正确性的修复。
- `Removed`：不再维护的公开功能或内容。

单篇文章的增补、日常勘误和状态更新时间不强制发布站点版本；它们应在条目的“最后编辑”或“最后验证”字段中记录。涉及导航、搜索、内容模型、部署或一批内容迁移的变更，才进入站点 Changelog。

## [Unreleased]

### Changed

- 内容页采用分板块的低干扰背景与主题前景色，提升 Blog、Knowledge、Projects 和 About 的阅读对比度；手机导航与 Knowledge 分类筛选同步优化。

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
