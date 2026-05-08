# Mint Design System — Typography Usage Rules

> **This file is intentionally separate from `design-system.md`.**
> Token definitions (sizes, weights, fonts) live in the token reference.
> This file defines how to USE those tokens — and each product team is
> free to fork and adapt these rules for their own context.

---

## Typefaces

| Typeface | File | Role | Weights allowed |
|----------|------|------|----------------|
| **Sohne** | `Sohne-Kraftig.otf` | Headings, Display, numeric values | **500 only** — never use any other weight |
| **Groww Sans** | `GrowwSans-Regular.otf` / `GrowwSans-Medium.otf` | All body text | 400 (Regular) · 500 (Medium) |

> **Hard constraint:** Never use Sohne at any weight other than 500. Never use Sohne for body or paragraph text.
> **Weight 535 rule:** Groww Sans "Medium" may appear as weight 535 in variable font outputs (Figma, prototyping tools). Always replace 535 with 500 — they are the same visual weight. The static font file (GrowwSans-Medium.otf) is weight 500.

---

## Hierarchy Rules

- Use `display-*` tokens for hero titles, large numerals, and prominent single values — **one display token per screen maximum.**
- Use `heading-base` by default for all section headers, sheet titles, and app bar labels.
- Use `heading-small` or `heading-xsmall` only when `heading-base` is too large for the space or repeats frequently on a screen.
- Use `heading-eyebrow` for secondary labels in cards where the content (value or heading) is more important than the label. Always pair with a `heading-large` or larger nearby.
- Use `body-base` (400) as the default for all reading text. Switch to `body-base-heavy` (500) to emphasise a key value inline.
- Use `body-small` for fine print, metadata, and helper text. Use `body-xsmall` very sparingly — only where space is critically constrained.

---

## Letter Spacing

- **0** for all tokens — no exceptions.
- `heading-eyebrow` is the only token with letter spacing: **0.2em** (2sp on Android). This is baked into the token, not an additional style.
- Never add custom letter-spacing on top of any token.

---

## All-Caps

- `heading-eyebrow` is **always rendered in all-caps** (`text-transform: uppercase`). This is part of the token definition, not optional.
- No other token is ever all-caps.

---

## Line Height

- Never override the line height defined in a token. The size/line-height pairs are designed to maintain consistent vertical rhythm across all platforms.

---

## Color Pairing

| Use case | Token |
|----------|-------|
| Default text | `contentPrimary` |
| Supporting text, subtitles, captions | `contentSecondary` |
| Eyebrow headers, de-emphasised labels | `contentTertiary` — use sparingly |
| Brand-coloured text | `contentAccent` — never for body copy |

---

## Platform Implementation

### Android (Compose)

```kotlin
// heading-base
style = TextStyle(
    fontSize = 18.sp,
    lineHeight = 28.sp,
    fontFamily = FontFamily(Font(R.font.sohne)),
    fontWeight = FontWeight(500),
    color = Variables.contentContentPrimary,
)

// body-base
style = TextStyle(
    fontSize = 14.sp,
    lineHeight = 20.sp,
    fontFamily = FontFamily(Font(R.font.groww_sans_variable)),
    fontWeight = FontWeight(400),
    color = Variables.contentContentPrimary,
)

// heading-eyebrow — note: letterSpacing + toUpperCase()
style = TextStyle(
    fontSize = 10.sp,
    lineHeight = 12.sp,
    fontFamily = FontFamily(Font(R.font.sohne)),
    fontWeight = FontWeight(500),
    letterSpacing = 2.sp,
    color = Variables.contentContentPrimary,
)
// Apply text.uppercase() in the composable
```

### Web (CSS)

```css
/* heading-base */
font-family: 'Sohne', sans-serif;
font-size: 18px;
line-height: 28px;
font-weight: 500;
letter-spacing: 0;

/* body-base */
font-family: 'GrowwSans', sans-serif;
font-size: 14px;
line-height: 20px;
font-weight: 400;
letter-spacing: 0;

/* heading-eyebrow */
font-family: 'Sohne', sans-serif;
font-size: 10px;
line-height: 12px;
font-weight: 500;
letter-spacing: 0.2em;
text-transform: uppercase;
```

### iOS (Swift / UIKit)

```swift
// heading-base
let headingBase = UIFont(name: "Sohne-Kraftig", size: 18)
// line height: 28pt → via NSParagraphStyle.minimumLineHeight = 28

// body-base
let bodyBase = UIFont(name: "GrowwSans-Regular", size: 14)
```
