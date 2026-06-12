# Blog Guidelines

## Creating a New Blog Post

1. Create `src/content/<slug>.mdx`
2. Add metadata export with the **correct current date** — always check the actual date before writing.

```mdx
export const metadata = {
  title: 'Post Title',
  date: 'YYYY-MM-DD',   // ⚠️ 检查当前日期，不要复制旧文章的时间
  tags: ['tag1', 'tag2'],
  excerpt: 'Short description...',
  readingTime: 'X min',
}
```

3. Write content in Markdown + optional JSX.
4. Build will auto-discover it.

## Content

- 技术排查类文章按时间线写排查过程（现象→排查→根因→解法→教训）
- 设计笔记类文章写决策过程（尝试→问题→调整→最终方案→总结）
- 文章标题用中文还是英文取决于内容，保持一致即可

## Syntax Highlighting Notes

- MDX 中 fenced code blocks 使用 three backticks + language identifier
- HTML-in-MDX: wrap in `<div>` block, avoid mixing markdown inside raw HTML
- Don't use `export` inside `<style>` tags — MDX treats exports specially
