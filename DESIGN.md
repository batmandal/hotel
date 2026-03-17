# BookINN UI Design System

This document defines the UI color palette, components, and styling conventions. When changing UI colors or layout, follow these rules so the app stays consistent.

## Color System (Tailwind)

### Primary / Accent
- **Main:** `teal-500`, `teal-600`, `teal-700` — buttons, links, highlights, CTAs
- **Light accent:** `teal-50`, `teal-100` — section backgrounds, tags/pills, hover states
- **Text on accent:** `text-teal-600`, `text-teal-700` for labels; `text-white` on solid teal buttons

### Backgrounds
- **Page:** `white`, `gray-50` (e.g. body or main content area)
- **Dark sections:** `gray-900` (footer, dark header overlay)
- **Section highlight:** `teal-50` or `teal-50/50` for alternating sections
- **Cards/panels:** `white` with `shadow-md` or `shadow-lg`

### Text
- **Headings:** `gray-900` (e.g. `text-gray-900`, `font-bold`)
- **Body/secondary:** `gray-600`, `gray-500`
- **Muted:** `gray-400`, `gray-500`
- **On dark:** `white`, `text-teal-100` for subtle text on teal/gray-900

### Borders
- **Default:** `gray-200`, `border-gray-200`
- **Accent:** `teal-200`, `teal-500` for focus or selected state

## Components

### Buttons
- **Primary:** `bg-teal-600 text-white hover:bg-teal-700`; focus ring `ring-teal-500`
- **Secondary:** `bg-white border border-gray-200 text-gray-900 hover:bg-gray-50`
- **Outline (on dark):** `border border-white text-white hover:bg-white/10`
- **Link style:** `text-teal-600 hover:underline`
- Use `rounded-md` for buttons.

### Pills / Tags
- **Category or label:** `rounded-full bg-teal-100 px-4 py-1.5 text-sm font-medium text-teal-700`
- **Badge on image:** `rounded bg-gray-800` or `bg-gray-900` with `text-white`

### Cards
- **Container:** `bg-white rounded-xl shadow-md` (or `shadow-lg` on hover)
- **Image:** `rounded-xl` or `rounded-lg`, `object-cover`
- **Overlay text:** `bg-gradient-to-t from-black/80` with `text-white`

### Sections
- **Section title:** Small pill/tag above, then `text-3xl font-bold text-gray-900`
- **Spacing:** `py-16` for sections, `max-w-7xl mx-auto px-4` for content width

### Form inputs
- **Input/Select:** `border border-gray-200`, focus `ring-2 ring-teal-500 ring-offset-2`
- **Placeholder:** `text-gray-500`

## Where Styles Live

- **Most UI:** Tailwind classes in component `className` props (e.g. in `src/components/`, `src/app/`).
- **Global:** [src/app/globals.css](src/app/globals.css) — `:root` for `--background`, `--foreground`; body uses these. Prefer Tailwind for new styles unless it’s a global theme variable.

## Adding or Changing Colors

- Prefer the existing teal/gray palette. If you add a new color (e.g. for status), document it here and use Tailwind classes.
- When changing primary/accent colors, update this file and all main components (Button, Header, Footer, cards) so they stay in sync.
