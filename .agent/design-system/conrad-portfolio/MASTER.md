# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Conrad Portfolio
**Generated:** 2026-02-07 14:53:45
**Category:** Portfolio/Personal

---

## Global Rules

### Color Palette

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#1E293B` | `--color-primary` |
| Secondary | `#334155` | `--color-secondary` |
| CTA/Accent | `#22C55E` | `--color-cta` |
| Background | `#0F172A` | `--color-background` |
| Surface | `#1E293B` | `--color-surface` |
| Text | `#F8FAFC` | `--color-text` |
| Text Muted | `#94A3B8` | `--color-text-muted` |
| Border | `#334155` | `--color-border` |

**Color Notes:** Dark tech + status green accent. Slate-based grays for depth.

### Typography

- **Heading Font:** Archivo
- **Body Font:** Space Grotesk
- **Mood:** minimal, portfolio, designer, creative, clean, artistic
- **Google Fonts:** [Archivo + Space Grotesk](https://fonts.google.com/share?selection.family=Archivo:wght@300;400;500;600;700|Space+Grotesk:wght@300;400;500;600;700)

**CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Subtle lift |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.4)` | Cards, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.4)` | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.5)` | Hero images, featured cards |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #22C55E;
  color: #0F172A;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #F8FAFC;
  border: 2px solid #334155;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 200ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  border-color: #22C55E;
  color: #22C55E;
}
```

### Cards

```css
.card {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-md);
  transition: all 200ms ease;
  cursor: pointer;
}

.card:hover {
  border-color: #22C55E;
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

### Inputs

```css
.input {
  background: #1E293B;
  color: #F8FAFC;
  padding: 12px 16px;
  border: 1px solid #334155;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 200ms ease;
}

.input:focus {
  border-color: #22C55E;
  outline: none;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}
```

### Modals

```css
.modal-overlay {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
}

.modal {
  background: #1E293B;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 32px;
  box-shadow: var(--shadow-xl);
  max-width: 500px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Motion-Driven

**Keywords:** Animation-heavy, microinteractions, smooth transitions, scroll effects, parallax, entrance anim, page transitions

**Best For:** Portfolio sites, storytelling platforms, interactive experiences, entertainment apps, creative, SaaS

**Key Effects:** Scroll anim (Intersection Observer), hover (300-400ms), entrance, parallax (3-5 layers), page transitions

### Page Pattern

**Pattern Name:** Portfolio Grid

- **Conversion Strategy:**  hover overlay info,  lightbox view, Visuals first. Filter by category. Fast loading essential.
- **CTA Placement:** Project Card Hover + Footer Contact
- **Section Order:** 1. Hero (Name/Role), 2. Project Grid (Masonry), 3. About/Philosophy, 4. Contact

---

## Anti-Patterns (Do NOT Use)

- ❌ Corporate templates
- ❌ Generic layouts

### Additional Forbidden Patterns

- ❌ **Emojis as icons** — Use SVG icons (Heroicons, Lucide, Simple Icons)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid scale transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Invisible focus states** — Focus states must be visible for a11y

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG instead)
- [ ] All icons from consistent icon set (Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
