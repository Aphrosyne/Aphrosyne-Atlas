# Tailwind CSS v4 Conventions

This project uses Tailwind CSS v4. When writing or reviewing code, follow these rules.

## Gradient direction

```css
/* ✅ CORRECT */
bg-linear-to-r    /* not bg-gradient-to-r */
```

## Opacity modifiers

Use `/N` integer syntax, not `/[0.NN]` brackets:

```css
/* ✅ CORRECT */
bg-white/3        /* 3% opacity  — not bg-white/[0.03] */
bg-accent/6       /* 6% opacity  — not bg-accent/[0.06] */
border-white/20   /* 20% opacity — not border-white/[0.20] */
```

## Spacing scale

Use built-in spacing scale instead of arbitrary pixel values where possible (1 = 0.25rem = 4px):

```css
/* ✅ CORRECT */
-inset-0.5           /* 2px  — not -inset-[2px] */
h-0.5                /* 2px  — not h-[2px] */
-inset-0.375         /* 1.5px — not -inset-[1.5px] */
min-w-37.5           /* 150px — not min-w-[150px] */
gap-0.75             /* 3px  — not gap-[3px] */
w-2.75 / h-2.75     /* 11px — not w-[11px] / h-[11px] */
```

## Important modifier

Use suffix syntax `class!`, not prefix `!class`:

```css
/* ✅ CORRECT */
backdrop-blur-none!
/* ❌ WRONG */
!backdrop-blur-none
```

## Border radius

Use named utilities for standard values:

```css
/* ✅ CORRECT */
rounded-xs         /* 2px — not rounded-[2px] */
```

## Backdrop blur

Use named utilities when they match:

```css
/* ✅ CORRECT */
backdrop-blur        /* 8px  — not backdrop-blur-[8px] */
backdrop-blur-sm     /* 4px  — not backdrop-blur-[4px] */
backdrop-blur-md     /* 12px — not backdrop-blur-[12px] */
/* Keep for non-standard values: */
backdrop-blur-[15px] /* no matching named utility */
```

## Directional border colors

Use per-direction color classes to avoid override:

```css
/* ✅ CORRECT — each direction independent */
border-t border-t-white/20 border-b border-b-white/5
/* ❌ WRONG — border-b-white/5 overrides border-white/20 */
border-t border-white/20 border-b border-white/5
```
