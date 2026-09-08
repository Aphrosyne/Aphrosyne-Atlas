# Development Workflow

## Dev Server

```bash
npm run dev    # Development server with HMR (hot module replacement)
```

- **Dev 模式下代码改动会自动热更新**，浏览器刷新即可看到效果，不需要每次执行 `npm run build`。
- 仅在以下情况需要 build：
  - 提交前确认无编译错误
  - 检查 SSG 页面是否正常生成
  - 验证生产环境构建

## Code Review

- 每次代码修改后，手动检查浏览器中的效果，确认符合预期后再提交。
- 提交前运行一次 `npm run build` 确保没有编译错误。

## Spec 文件规则

- **禁止主动修改 `.spec/` 目录下的文件**。只有当用户明确要求时才能修改。
- `.spec/` 是项目的权威规范文档，Agent 擅自修改会导致规范形同虚设。
- 这条规则本身也写在 CLAUDE.md 中。
