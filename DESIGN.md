---
name: Numerical Methods
description: A 25-method numerical calculator that shows its work — neutral, dual-theme, built for reading columns of figures.
colors:
  background: "hsl(0 0% 100%)"
  foreground: "hsl(240 10% 3.9%)"
  card: "hsl(0 0% 100%)"
  elevated: "hsl(0 0% 100%)"
  popover: "hsl(0 0% 100%)"
  muted: "hsl(240 4.8% 95.9%)"
  muted-foreground: "hsl(240 3.8% 46.1%)"
  accent: "hsl(240 4.8% 95.9%)"
  border: "hsl(240 5.9% 90%)"
  input: "hsl(240 5.9% 90%)"
  ring: "hsl(221 83% 53%)"
  primary: "hsl(240 5.9% 10%)"
  primary-foreground: "hsl(0 0% 98%)"
  brand: "hsl(221 83% 53%)"
  brand-foreground: "hsl(0 0% 100%)"
  brand-muted: "hsl(221 83% 96%)"
  destructive: "hsl(0 72% 46%)"
  destructive-muted: "hsl(0 86% 97%)"
  success: "hsl(142 71% 33%)"
  success-muted: "hsl(138 76% 96%)"
typography:
  title:
    fontFamily: "Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.018em"
  title-lg:
    fontFamily: "Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 650
    lineHeight: 1.25
    letterSpacing: "-0.018em"
  heading:
    fontFamily: "Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  control:
    fontFamily: "Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 550
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 550
    lineHeight: 1.5
    letterSpacing: "normal"
  caption:
    fontFamily: "Anuphan, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  data:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.78125rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
    fontFeature: "tabular-nums"
  keycap:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  readout:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.02em"
    fontFeature: "tabular-nums"
rounded:
  control: "0.375rem"
  panel: "0.5rem"
  container: "0.75rem"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  "2xl": "20px"
  "3xl": "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.25rem"
    typography: "{typography.control}"
  button-primary-hover:
    backgroundColor: "hsl(240 5.9% 10% / 0.88)"
    textColor: "{colors.primary-foreground}"
  button-secondary:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-secondary-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-ghost-hover:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
  button-destructive:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.destructive}"
    rounded: "{rounded.control}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-destructive-hover:
    backgroundColor: "{colors.destructive-muted}"
    textColor: "{colors.destructive}"
  input:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0 0.625rem"
    height: "2.25rem"
    typography: "{typography.control}"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.container}"
    padding: "1.25rem"
  card-header:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.container}"
    padding: "1.125rem 1.25rem"
    typography: "{typography.heading}"
  card-footer:
    backgroundColor: "hsl(240 4.8% 95.9% / 0.4)"
    textColor: "{colors.muted-foreground}"
    padding: "0.75rem 1.25rem"
    typography: "{typography.caption}"
  table-header:
    backgroundColor: "hsl(240 4.8% 95.9% / 0.6)"
    textColor: "{colors.muted-foreground}"
    padding: "0.5rem 0.875rem"
    typography: "{typography.caption}"
  table-cell:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    padding: "0.4375rem 0.875rem"
    typography: "{typography.data}"
  table-row-final:
    backgroundColor: "{colors.success-muted}"
    textColor: "{colors.success}"
  badge-muted:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.pill}"
    padding: "0.0625rem 0.5rem"
    typography: "{typography.caption}"
  badge-brand:
    backgroundColor: "{colors.brand-muted}"
    textColor: "{colors.brand}"
    rounded: "{rounded.pill}"
    padding: "0.0625rem 0.5rem"
  alert-error:
    backgroundColor: "{colors.destructive-muted}"
    textColor: "{colors.destructive}"
    rounded: "{rounded.panel}"
    padding: "0.75rem 0.875rem"
  alert-success:
    backgroundColor: "{colors.success-muted}"
    textColor: "{colors.success}"
    rounded: "{rounded.panel}"
    padding: "0.75rem 0.875rem"
  alert-info:
    backgroundColor: "{colors.brand-muted}"
    textColor: "{colors.brand}"
    rounded: "{rounded.panel}"
    padding: "0.75rem 0.875rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.muted-foreground}"
    rounded: "{rounded.control}"
    padding: "0.375rem 0.5rem"
  nav-link-active:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.control}"
    padding: "0.375rem 0.5rem"
---

# Design System: Numerical Methods

## Overview

**Creative North Star: "The Standard Instrument"**

This system is the category standard played straight, at full craft. It was chosen deliberately over a bespoke visual world: the reader is a student with a homework sheet beside the laptop, and every unit of attention spent decoding an invented visual language is a unit taken from checking whether their fourth decimal place matches. So the interface borrows the vocabulary its reader already knows from GitHub, Vercel and shadcn/ui — a neutral zinc field, hairline borders, one blue, soft rectangles — and spends its craft budget on the things only a calculator can get right: figures that line up, a converged row you can find without counting, and a table that survives twenty minutes of reading on a bright classroom screen.

The mood is quiet and administrative in the best sense. Surfaces are near-white or near-black with almost no chroma; colour appears only where it carries meaning. Density is high but never crowded — controls sit on a 2.25rem line, cards are separated by 1.25rem, and the page tops out at 84rem so a wide monitor produces more table, not longer lines of prose. Nothing decorates. The one authored moment in the whole build is the results stack rising into place after คำนวณ is pressed; everything else moves in 120ms or not at all.

Light and dark are equal citizens, not a theme and its afterthought. Both are declared in full, the choice is applied before first paint so no reader gets a white flash, and even the charts re-read the live token values when the theme flips rather than shipping a vendor palette. The system explicitly refuses the mission-control dark skin the previous build wore: dark mode here is the same neutral system at a different lightness, not a different personality.

**Key Characteristics:**
- Neutral zinc scale (240° hue at 4–10% saturation) carrying every surface, with a single blue for links, focus and data
- Two faces only: Anuphan for Thai and Latin UI text, Geist Mono for every figure
- Hairline 1px borders as the primary separator; shadows say elevation, never state
- Three radii keyed to element scale — 6px controls, 8px panels, 12px containers
- Tabular-lining numerals everywhere a number appears, so decimal points stack column to column
- Light and dark both fully specified, applied pre-paint, and read back at runtime by the chart layer

## Colors

An almost achromatic zinc field with one blue and two status hues — the palette's job is to stay out of the way of six-decimal figures, then be unmissable in the three places where meaning depends on colour.

### Primary
- **Ink** (`{colors.primary}` light / `hsl(0 0% 98%)` dark): The near-black that fills the one committing button on every surface — คำนวณ, and nothing else. It inverts to near-white in dark mode, so the primary action is always the highest-contrast object on screen. Also fills the 1.625rem brand mark in the header.
- **Signal Blue** (`{colors.brand}` light / `hsl(213 94% 68%)` dark): The single accent. It carries inline links, the focus ring, the info alert, the brand badge, the text-selection wash at 24% alpha, the caret, and the primary data series in every chart. It never fills a button.

### Neutral
- **Paper / Void** (`{colors.background}` light / `hsl(240 10% 3.9%)` dark): The page ground. In dark mode the card surface lifts off it to `hsl(240 8% 6.5%)` and the popover to `hsl(240 8% 7.5%)`; in light mode card, popover and page are all pure white and separation comes entirely from the border.
- **Ink Text** (`{colors.foreground}` light / `hsl(0 0% 98%)` dark): Titles, values, table cells. Measures roughly 19:1 against the page ground in both themes.
- **Quiet Text** (`{colors.muted-foreground}` light / `hsl(240 5% 66%)` dark): Descriptions, hints, table headers, breadcrumbs, inactive nav, the row-index column. Measured 4.83:1 light and 8.05:1 dark — this is the contrast floor of the system, and nothing meant to be read sits below it.
- **Hairline** (`{colors.border}` light / `hsl(240 4% 17%)` dark): Every divider, card edge, table rule and input stroke. Applied globally as the default `border-color`, so any element that turns a border on is already correct.
- **Wash** (`{colors.muted}` / `{colors.accent}`): The faint tint behind table headers (60% alpha), card footers (40% alpha), keycaps, skeletons, and the hover state of every row, nav link and ghost button.

### Tertiary (status)
- **Converged Green** (`{colors.success}` light / `hsl(142 69% 58%)` dark, on `{colors.success-muted}`): Marks the final row of an iteration table — the answer, findable without counting rows — and the success alert. In charts it becomes the plotted-point series.
- **Fault Red** (`{colors.destructive}` light / `hsl(0 84% 68%)` dark, on `{colors.destructive-muted}`): Invalid input borders, field errors, the error alert, and the destructive (delete-history) button. In charts it becomes the reference series.

### Named Rules

**The One Blue Rule.** Exactly one accent hue exists, and it is reserved for wayfinding and data: links, focus rings, info, the primary chart series. It never becomes a button fill, a card background, or decoration. If a new surface seems to need "a colour", the answer is a neutral wash.

**The Two-Signal Rule.** Green means converged or saved; red means invalid or destructive. There is no third status colour in the shipping UI — a `warning` pair exists in the token block but no surface consumes it, so introducing one is a system decision, not a lookup.

**The Borrowed-Surface Rule.** Any third-party surface — KaTeX, Plotly, Swagger UI — is repainted from these tokens before it ships. Vendor defaults belong to no design system: KaTeX inherits `color`, the Plotly layout is built from the live custom properties and recomputed on every theme change, and Swagger's hardcoded greys are overridden to foreground / Quiet Text / card / hairline.

## Typography

**Body / UI Font:** Anuphan (with `ui-sans-serif, system-ui, sans-serif`), weights 300–700
**Data / Mono Font:** Geist Mono (variable, 100–900, with `ui-monospace, monospace`)

**Character:** Anuphan is a low-contrast humanist sans drawn for Thai and Latin in one family, so a heading that puts "Newton-Raphson" inside a Thai sentence never switches skeletons mid-line and Thai tone marks keep their vertical room. Geist Mono is the counterweight: every figure the product exists to show is set in it at true tabular widths, so a column of six-decimal values reads as a column and not as ragged text. The pairing is unemphatic on purpose — the numbers are the only thing asked to be memorable.

### Hierarchy
- **Page Title** (650, 1.5rem, 1.25 line-height, -0.018em) and its **large step** (1.875rem from 768px): One per page — the method name, or the directory heading. Both values are real; the smaller one is what a phone reader sees. Balanced wrapping is on for all headings.
- **Readout** (600, 1.125rem, mono, tabular, -0.02em): The computed answer, stated once at the top of the results stack. The only place a figure is set large.
- **Body** (400, 1rem, 1.65 line-height, capped at 60ch): The inherited base size — the lead paragraph under a page title, in Quiet Text, and the equation plate. The generous leading is a Thai requirement, not a preference: stacked vowels and tone marks need the room.
- **Card Title** (600, 0.9375rem, 1.4): The title bar of every card, and the command palette's search input. Deliberately small — a card is a container, not a chapter.
- **Control** (550, 0.875rem): Buttons, inputs, select triggers, sidebar links, index rows, palette items. This is the interactive size of the entire system: if a user can click or type into it, it is 14px.
- **Label** (550, 0.8125rem): Field labels, card descriptions, breadcrumbs, alerts, index descriptions, table headers. The 13px step is the workhorse for anything that annotates.
- **Data** (400, 0.78125rem, mono, tabular): Iteration table cells, dropping to 0.71875rem below 32.5rem so a wide table survives a phone. The half-step below Label is deliberate — mono runs wider than sans at the same nominal size.
- **Caption** (400–600, 0.75rem): Hints, badges, timestamps, readout labels, sidebar and palette group labels, palette metadata.
- **Keycap** (400, 0.6875rem, mono): The smallest type in the system, used only inside a `kbd` — a keyboard hint is a legend, not text to read.

The whole ramp is these nine roles and no more — 11 / 12 / 12.5 / 13 / 14 / 15 / 16 / 18 / 24px — plus exactly two responsive steps off them: the page title to 30px at 768px, and table data down to 11.5px below 32.5rem. Two roles (Label at 13px and Caption at 12px) carry more than half the declarations in the stylesheet. If a new surface seems to need a size that is not on this list, the answer is one of the existing steps.

### Named Rules

**The Two-Script Rule.** Thai is the reading language and English is the technical vocabulary, so both live inside the same sentence and one family has to carry both. Never apply `text-transform: uppercase` or positive letter-spacing to a UI string that can carry Thai — uppercase is a no-op in Thai and added tracking loosens Thai words without helping the Latin ones beside them. Every group label in the build (sidebar and command palette alike) is therefore sentence case at 12px/600 in Quiet Text. Body copy holds a line-height of 1.6 or more; negative tracking is confined to large headings and the mono readout.

**The Tabular Rule.** Every number a user might compare vertically is Geist Mono with `font-variant-numeric: tabular-nums` — table cells, readouts, matrix cells, and any input the user types a figure into. Tables get it globally in the base layer, so a new table is correct before anyone styles it.

## Layout

A fixed application shell with a single content column that widens rather than reflows. The header is 3.5rem, sticky, translucent (85% background over a 12px backdrop blur) with a hairline beneath it. On method pages a 16.5rem sidebar listing all 25 methods appears at 1024px and sticks under the header with its own scroll; below that width the same nav collapses into a drawer opened from the header.

The content column is `max-width: 68rem` for prose-weight pages and 84rem in its wide variant (every method page and the directory), centred, with 1rem of side padding rising to 1.5rem at 768px and 5–6rem of bottom air so the last row of a table is never welded to the viewport edge.

Method pages split at 1100px into a 21rem parameter column plus a fluid results column; below that the columns stack with the parameter card first and secondary cards (saved equations, history) explicitly ordered below the results, so a phone reader reaches the answer before the extras. The parameter column becomes sticky at `header + 1.5rem` once the split is active — the inputs stay reachable while scrolling a hundred-row table. The home directory is a single column that becomes a two-column CSS multi-column layout at 1280px, with full-width members opting out via `column-span: all`.

Rhythm: 1.25rem is the standard gap between stacked cards and between grid columns; 1rem between form fields; 0.5rem between inline controls; 0.375rem between a label and its control. Card padding is 1.25rem, with headers at 1.125rem/1.25rem and footers at 0.75rem/1.25rem. Controls share a 2.25rem height (1.875rem small) so buttons, inputs and selects align on any row.

Breakpoints in use: 640px (search trigger, palette offset), 768px (page padding and title step), 1024px (sidebar), 1100px (method split), 1280px (directory columns), plus one down-breakpoint at 32.5rem that compresses table and matrix density.

### Named Rules

**The One Template Rule.** All 25 method pages render through a single shell — sidebar, breadcrumb, title, lead, then the aside/results split. A method page supplies only its own fields and its own result cards. A page that needs a different frame is a change to the shell, never a local layout.

**The Answer-First Rule.** The results column always reads answer, then graph, then table, and an empty state occupies that column before the first run so the page never looks like it is missing a region.

## Elevation & Depth

Depth is carried by borders first, tonal layering second, shadow last. Every surface is separated by a 1px hairline; in dark mode surfaces additionally step up in lightness (page 3.9% → card 6.5% → popover 7.5% → elevated 10%), because a hairline alone reads weakly on black. Shadows are small, offset-plus-blur, and used at two tiers in practice: resting for anything sitting on the page, overlay for anything floating above it. Dark mode swaps the tinted shadow for pure black at 0.4–0.6 alpha, since a shadow on a dark ground works by absence of light rather than by tint.

### Shadow Vocabulary
- **Resting** (`box-shadow: 0 1px 2px 0 hsl(240 6% 10% / 0.05)`): Cards, inputs, select triggers, primary and secondary buttons. Barely visible by design — it exists so a white card does not dissolve into a white page.
- **Raised** (`0 1px 2px -1px hsl(240 6% 10% / 0.1), 0 1px 3px 0 hsl(240 6% 10% / 0.1)`) and **Floating** (`0 2px 4px -2px hsl(240 6% 10% / 0.1), 0 4px 6px -1px hsl(240 6% 10% / 0.1)`): Detached panels; the mobile nav drawer is the only shipping consumer.
- **Overlay** (`0 4px 6px -4px hsl(240 6% 10% / 0.1), 0 10px 15px -3px hsl(240 6% 10% / 0.1)`): The command palette and the select menu — the two things that genuinely leave the page plane.

### Named Rules

**The Layer-Not-State Rule.** A shadow says how far a surface sits off the page, never that a pointer is over it. Hover is a background wash or a border shift; focus is a ring. No element gains or loses elevation on hover, and nothing lifts on `translateY`.

**The Hairline-First Rule.** If a boundary can be drawn with a 1px border, it is. Shadow is an addition to a border, never a replacement for one.

## Shapes

Soft rectangles at three sizes, chosen by what the element is rather than by taste. Controls a cursor lands on — buttons, inputs, select triggers, nav links, palette items, matrix cells — take 0.375rem (6px). Mid-weight panels that sit inside something else — alerts, equation plates, dropdown menus — take 0.5rem (8px), the system default. Full containers — cards, the command palette — take 0.75rem (12px), and a card footer corrects its bottom corners to `calc(12px - 1px)` so the fill never bleeds past the border containing it.

Only two things are fully round: badges and the small circular icon plate in an empty state, both pill (`9999px`). Nothing is a circle for decoration. One element sits off the scale on purpose and is not a token: the keycap inside a `kbd` takes a 4px corner, tighter than any control, because it is imitating a physical key rather than joining the interface. One use is not a scale step — do not reach for 4px anywhere else. Icons are a single authored set on a 24 grid at 1.75 stroke weight with round caps and joins, rendered at 13–17px — never a glyph, never an emoji, never a second icon library.

### Named Rules

**The Nesting Radius Rule.** An inner radius is always smaller than the radius of the thing containing it: 12px card → 8px alert → 6px input. If a new element's radius is ambiguous, ask what contains it. (The direction contract named "8px radius" as the world's single value; the build resolved it into this three-step scale, and the scale is the rule.)

## Components

### Buttons
- **Shape:** 6px corners, 2.25rem tall, 0.875rem of side padding, 550 weight at 14px, with a 0.5rem gap to an optional 14px leading icon.
- **Primary:** Ink fill, inverted text, resting shadow. Exactly one per surface, and it is always the action that runs the calculation. Hover drops the fill to 88% opacity.
- **Secondary:** Elevated fill, hairline border, foreground text, resting shadow; hover takes the neutral wash.
- **Ghost:** No border or fill, Quiet Text; hover takes the wash and promotes to foreground. Header nav, icon buttons, low-stakes actions.
- **Destructive:** Reads as a secondary button with red text; only on hover does it take the red-tinted surface and a 40%-alpha red border. Deleting is never loud until you are on it.
- **Sizes / disabled:** A small variant at 1.875rem/13px; icon-only variants are square at the same height. Disabled is 50% opacity with pointer events off — no separate grey.

### Inputs / Fields
- **Style:** 2.25rem tall, page-background fill (not card fill, so an input inside a card is a visible well), 1px input-stroke border, 6px radius, 14px text, resting shadow.
- **Focus:** Border shifts to the ring blue plus a 3px 20%-alpha ring — no outline, no glow. The global `:focus-visible` fallback is a 2px ring at 2px offset, so anything focusable is visible even unstyled.
- **Error:** `aria-invalid="true"` recolours the border red and turns the focus ring red; the message sits under the field at 12px with a 13px alert icon.
- **Structure:** Every control ships inside a field wrapper — a real `<label>` bound by id, a 13px/550 label, and an optional hint or error wired through `aria-describedby`. Expression and numeric inputs additionally take the mono variant.

### Select
Custom listbox, not a native select. The trigger is styled exactly as an input, with a Quiet Text chevron that rotates 180° on open; the menu sits on the popover surface at 8px radius with the overlay shadow, 0.25rem of inset padding and a 16rem max height, entering on a 140ms pop-in. Options are 6px-radius rows that take the wash when hovered or keyboard-active; the selected option goes 550 and carries a 14px check.

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Card surface, hairline border, resting shadow. In light mode the border does all the work; in dark mode the card also lifts tonally.
- **Header:** 1.125rem/1.25rem with a hairline beneath, a 15px/600 title, an optional 13px description, and a right-aligned meta slot (usually a badge).
- **Body:** 1.25rem of padding, or flush (zero) when the content is a table or a list that should meet the card edge.
- **Footer:** 40%-alpha wash, hairline above, 13px Quiet Text.
- **Actions:** When a card *is* the form, the submit button lives in a bordered action strip at the bottom of that card, sharing the row with any error alert — the commit sits at the end of the surface the user was just filling in, not floating elsewhere on the page.

### Navigation
- **Sidebar:** Grouped by problem family. Group labels are 12px/600 Quiet Text in sentence case with a 13px family icon; links are 14px rows at 6px radius in Quiet Text, taking the wash and full foreground on hover, and the wash plus 550 weight when `aria-current="page"`.
- **Header:** Brand lockup (1.625rem ink plate plus a 650 wordmark) at the left, ghost-button page links, then a search trigger and theme toggle at the right. The search trigger is a 2rem input-shaped button carrying a keycap; below 640px it collapses to an icon button.
- **Breadcrumb:** 13px Quiet Text, hairline-coloured slashes, current page in foreground.

### Iteration Table (signature)
The product's central surface. A 13px header row in Quiet Text, sticky to the top of its scroll container over a 60%-alpha wash and a 6px blur; cells in mono at 0.78125rem, right-aligned, with the first column left-aligned as the round index in 550 Quiet Text. Rows are separated by 60%-alpha hairlines and take a 60%-alpha wash on hover, so a finger tracking across a row has something to follow. The final row is filled with the success wash in Converged Green at 600 — the answer, findable without counting. The scroll container carries a shadow-gradient affordance on both edges so a table wider than its card announces that it continues, and drops to smaller type with tighter padding below 32.5rem.

### Readout (signature)
The computed answer, stated once above the work that produced it: a wrapping row of label-over-value pairs — 12px Quiet Text label, 1.125rem/600 mono value at -0.02em — inside a titled card at the top of the results stack. It exists so a student can confirm the number at a glance and only then descend into the iteration table.

### Command Palette
A full-screen scrim (55% near-black plus a 3px blur), panel capped at 34rem and offset 12vh from the top at 640px, 12px radius, overlay shadow, 160ms pop-in. A 3rem borderless search row sits over a hairline, then a grouped list of 6px-radius items each carrying a family icon and right-aligned metadata; the active item takes the wash. Group titles use the same sentence-case 12px/600 Quiet Text label as the sidebar, so the two nav surfaces read as one system. A footer strip on the wash carries keycaps — 1.25rem tall, mono, 11px, with a 2px bottom border that reads as a key edge.

### Alerts and Badges
Alerts are 8px-radius, 13px, tinted-surface panels with a 15px icon and a 35%-alpha tinted border, in three variants (error, success, info) mapping to the two status hues plus the blue. Badges are pill-shaped 12px/550 counters — muted by default for row and record counts, brand or success when the count itself means something.

### Empty State
Centred inside the card that will eventually hold results: a 2.25rem round wash plate with an icon, a 14px/600 title, and a 13px description capped at 34ch. Every results region ships one, so the layout is complete before the first calculation.

### Motion
Interactive state changes are 120ms ease on colour and border only. Panels that appear — palette, select menu — use a 140–160ms `cubic-bezier(0.16, 1, 0.3, 1)` pop-in from 4px up at 0.98 scale. The single authored moment is the results stack arriving after a calculation: 420ms on that same curve, rising 0.875rem out of a 2px blur. Skeletons pulse at 1.6s. Everything is neutralised under `prefers-reduced-motion`.

## Do's and Don'ts

### Do:
- **Do** run every new method page through the shared shell so the 25 stay one template, and supply only fields and result cards.
- **Do** set every figure in Geist Mono with tabular numerals — table cells, readouts, matrix cells, and any input the user types a number into.
- **Do** reach for a 1px hairline before a shadow, and for a neutral wash before a colour, when you need to separate or emphasise something.
- **Do** define both themes for anything new, and read tokens at runtime rather than hardcoding hex when handing colour to a chart or a third-party widget.
- **Do** keep read text at or above the Quiet Text floor (4.83:1 light, 8.05:1 dark) and give Thai copy at least 1.6 line-height.
- **Do** put the commit button at the end of the surface the user was filling in, and give every input a real bound `<label>`.
- **Do** ship an empty state for every region that will later hold results.
- **Do** pick radius by containment: 6px controls, 8px panels, 12px containers.

### Don't:
- **Don't** fill a button, card, or large area with the blue. It carries links, focus, info and the primary data series, and its restraint is what makes a focus ring legible.
- **Don't** uppercase or letter-space any UI string that can carry Thai — which, in a Thai-primary product, is every label, heading and group title. Uppercase is a no-op in Thai and added tracking only loosens it. Both the sidebar and the command palette use the same sentence-case 12px/600 muted group label, and that is the system's group-label pattern.
- **Don't** move elevation on hover, or animate transform anywhere but the two entrance moments already defined.
- **Don't** add a third status hue, a second icon set, a third font, or a fourth radius. Each is a system change, not a component decision.
- **Don't** let a vendor stylesheet ship its own palette — repaint KaTeX, Plotly and Swagger from the tokens.
- **Don't** widen prose past 60ch or let a wide viewport stretch a paragraph; extra width belongs to tables.
- **Don't** use a decorative flourish, an emoji, or a glyph where the authored 24-grid, 1.75-stroke icon set has a symbol.
