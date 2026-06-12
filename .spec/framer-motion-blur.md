# Framer Motion × Backdrop Blur 渲染问题

## 问题

`backdrop-blur` 元素放在 Framer Motion 的 `opacity: 0 → 1` 动画容器内时，模糊效果会在动画**结束后**才突然出现，形成一次"闪现"。

**根源**：浏览器优化——元素 opacity 为 0 或其祖先 opacity 为 0 时，不渲染 backdrop-filter。动画结束后 opacity 变成 1，blur 才被计算，视觉上就是"延迟出现"。

## 两种解法（按场景选择）

### A. 移出动画容器（适合背景装饰）

如果 blur 元素是纯装饰（如全屏蒙版），直接放在动画容器外面让它立即渲染：

```tsx
// ✅ 蒙版不做动画，立即渲染
<>
  <div className="fixed inset-0 bg-white/15 backdrop-blur-xl z-[-1]" />
  <PageTransition>
    <div>正文内容...</div>
  </PageTransition>
</>
```

### B. 动画和 blur 在同一个元素上（适合内容卡片）

如果 blur 元素本身就是内容（如卡片），去掉父级动画容器，把 Framer Motion 动画直接写在 blur 元素上：

```tsx
// ✅ 动画和 blur 同一个元素
<motion.a
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="bg-surface/50 backdrop-blur-sm border..."
>
  卡片内容
</motion.a>

// ❌ 父级动画 + 子级 blur → 模糊延迟
<PageTransition>
  <BlogCard className="backdrop-blur-sm" />
</PageTransition>
```

## 原则

> blur 和 animation 必须在同一个 DOM 元素上。如果被拆分在父子两个元素，浏览器不会在父级 opacity 0 时预计算子级的 backdrop-filter。

## 第三条路：不动画

如果 blur 元素是工具栏/搜索栏等功能性 UI（非内容展示），**直接去掉动画**，无需入场效果。一个普通的 `<div>` 不会有 blur 延迟问题。
