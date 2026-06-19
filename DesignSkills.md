# Design System — eventflow (Event Booking System)

> This file is the single source of design truth for this project. Every color, spacing value, font, icon, and component state referenced below is final — do not invent new values, do not substitute icon libraries, do not introduce colors outside the token tables. If something is genuinely unspecified, default to the closest existing token rather than creating a new one.
---

## 1. Product Summary

**Product**: eventflow — a web app for browsing live events (concerts, tech talks, sports, workshops) and booking seats.
**Audience**: urban professionals, 22–35, who attend live events regularly.
**Personality**: energetic but precise. Feels like the few seconds before a show starts — anticipation, not corporate calm.
**Not this**: not a SaaS dashboard, not a travel booking site, not a food delivery app. Avoid those visual tropes entirely.

**Brand name**: `eventflow` (lowercase wordmark, the "e" is always rendered in the accent color).

---

## 2. Theming — Dark Mode & Light Mode

The app **must support both dark mode and light mode**, toggled by the user, with the preference persisted (`localStorage` key: `eventflow-theme`, values `"dark"` | `"light"`). On first visit with no stored preference, default to the user's OS preference via `prefers-color-scheme`. Default fallback if neither is available: **dark**.

Implementation pattern: set `data-theme="dark"` or `data-theme="light"` on the `<html>` element. All colors are CSS variables that switch based on this attribute — never hardcode a hex value directly in a component. Components reference `var(--color-*)` only.

### 2.1 Design Tokens — Color

| Token | Dark mode value | Light mode value | Usage |
|---|---|---|---|
| `--color-bg` | `#0A0A0F` | `#FAF8F6` | page background |
| `--color-surface` | `#111118` | `#FFFFFF` | card / panel background |
| `--color-surface-elevated` | `#1C1C28` | `#F3F1EE` | modal, input, dropdown background |
| `--color-border` | `#2A2A3D` | `#E6E2DC` | all borders, dividers |
| `--color-text-primary` | `#FFFFFF` | `#14141C` | headings, primary text |
| `--color-text-secondary` | `#A0A0B8` | `#65657A` | labels, captions, metadata |
| `--color-text-muted` | `#6B6B80` | `#9C9CA8` | placeholders, disabled text |
| `--color-accent` | `#FF4D6D` | `#E0294F` | links, icons, text-on-light accents |
| `--color-accent-fill` | `#FF4D6D` | `#FF4D6D` | button backgrounds (always paired with white text) |
| `--color-accent-fill-hover` | `#FF6B85` | `#C9143A` | button hover |
| `--color-accent-glow` | `rgba(255,77,109,0.14)` | `rgba(224,41,79,0.08)` | focus rings, hover glows |
| `--color-success` | `#3DDC84` | `#1B8A4D` | upcoming/confirmed status |
| `--color-success-bg` | `rgba(61,220,132,0.14)` | `#E7F6EC` | success pill background |
| `--color-error` | `#FF5470` | `#D6293F` | errors, cancelled status |
| `--color-error-bg` | `rgba(255,84,112,0.14)` | `#FBEAEC` | error pill / banner background |
| `--color-warning` | `#FFB020` | `#B5760A` | low-seats warning |
| `--color-warning-bg` | `rgba(255,176,32,0.14)` | `#FBF1DE` | warning pill background |
| `--color-overlay` | `rgba(5,5,8,0.72)` | `rgba(20,20,28,0.5)` | modal backdrop |

**Rule**: the accent hue (rose, ~`350°`) never changes between modes — only its lightness/saturation is tuned per mode for contrast. Never substitute a different hue (no switching to blue/green as an "accent" — rose is the brand color in both themes).

### 2.2 CSS Variable Block (reference implementation)

```css
:root,
[data-theme="dark"] {
  --color-bg: #0A0A0F;
  --color-surface: #111118;
  --color-surface-elevated: #1C1C28;
  --color-border: #2A2A3D;
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A0A0B8;
  --color-text-muted: #6B6B80;
  --color-accent: #FF4D6D;
  --color-accent-fill: #FF4D6D;
  --color-accent-fill-hover: #FF6B85;
  --color-accent-glow: rgba(255,77,109,0.14);
  --color-success: #3DDC84;
  --color-success-bg: rgba(61,220,132,0.14);
  --color-error: #FF5470;
  --color-error-bg: rgba(255,84,112,0.14);
  --color-warning: #FFB020;
  --color-warning-bg: rgba(255,176,32,0.14);
  --color-overlay: rgba(5,5,8,0.72);
}

[data-theme="light"] {
  --color-bg: #FAF8F6;
  --color-surface: #FFFFFF;
  --color-surface-elevated: #F3F1EE;
  --color-border: #E6E2DC;
  --color-text-primary: #14141C;
  --color-text-secondary: #65657A;
  --color-text-muted: #9C9CA8;
  --color-accent: #E0294F;
  --color-accent-fill: #FF4D6D;
  --color-accent-fill-hover: #C9143A;
  --color-accent-glow: rgba(224,41,79,0.08);
  --color-success: #1B8A4D;
  --color-success-bg: #E7F6EC;
  --color-error: #D6293F;
  --color-error-bg: #FBEAEC;
  --color-warning: #B5760A;
  --color-warning-bg: #FBF1DE;
  --color-overlay: rgba(20,20,28,0.5);
}
```

### 2.3 Theme Toggle Component

- Placed in the navbar, right side, before the auth buttons / user avatar.
- Visual: a pill-shaped switch (40px × 22px) with a sliding circle, OR a single icon button that swaps icon on click — **use the single icon button pattern**, it's cleaner:
  - Dark mode active → show `fa-regular fa-sun` (tapping switches to light)
  - Light mode active → show `fa-regular fa-moon` (tapping switches to dark)
  - Icon button: 36×36px, circular, `background: var(--color-surface-elevated)`, `border: 1px solid var(--color-border)`, icon color `var(--color-text-secondary)`. On hover: border becomes `var(--color-accent)`, icon color becomes `var(--color-accent)`.
- Transition: when toggled, animate background/text/border colors across the whole app with `transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease` applied globally — never a hard cut, never a full page flash.
- Respect `prefers-reduced-motion: reduce` — if set, apply the theme change with `transition: none`.

---

## 3. Typography

| Role | Font | Weight | Source |
|---|---|---|---|
| Display / Headings | **Syne** | 700, 800 | Google Fonts |
| Body / UI text | **Inter** | 400, 500, 600 | Google Fonts |
| Mono / live data | **JetBrains Mono** | 500 | Google Fonts |

Load via Google Fonts `<link>` in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

### Type Scale

| Token | Size | Font | Weight | Line-height | Usage |
|---|---|---|---|---|---|
| `display` | 56px (32px mobile) | Syne | 800 | 1.1 | hero headline only |
| `h1` | 36px (28px mobile) | Syne | 700 | 1.2 | page titles |
| `h2` | 24px (20px mobile) | Syne | 700 | 1.25 | section headings |
| `h3` | 18px | Inter | 600 | 1.3 | card titles, modal titles |
| `body` | 15px | Inter | 400 | 1.6 | paragraph text |
| `label` | 12px | Inter | 500 | 1.4 | uppercase, letter-spacing 0.08em — form labels, section eyebrows |
| `data` | 14px | JetBrains Mono | 500 | 1.4 | seat counts, prices, booking IDs |
| `caption` | 12px | Inter | 400 | 1.4 | timestamps, fine print |

Color for all text: `var(--color-text-primary)` for headings/body, `var(--color-text-secondary)` for labels/captions, `var(--color-text-muted)` for placeholders/disabled.

---

## 4. Iconography — FontAwesome Free Only

**All icons must come from FontAwesome Free.** Do not use Lucide, Heroicons, Feather, Material Icons, emoji, or any other icon source. Do not invent custom SVG icons unless FontAwesome genuinely has no equivalent (none of the icons needed for this project fall into that category).

### 4.1 Installation (React, no TypeScript)

```bash
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-regular-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
```

### 4.2 Usage Pattern

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

<FontAwesomeIcon icon={faMagnifyingGlass} className="text-[var(--color-accent)] w-4 h-4" />
```

Use the **solid (`fas`)** style for filled/primary icons, **regular (`far`)** style for outline/secondary icons (FontAwesome Free includes a limited regular set — only use regular icons confirmed to exist in the free tier: `faSun`, `faMoon`, `faUser`, `faHeart`, `faCalendar`, `faClock`, `faCircleCheck`, `faCircleXmark`, `faBell`). Default to solid everywhere else.

### 4.3 Icon Mapping (use exactly these — do not substitute)

| UI element | Icon name | Style |
|---|---|---|
| Search / AI search bar | `faMagnifyingGlass` | solid |
| AI indicator (sparkle) | `faWandMagicSparkles` | solid |
| Calendar / date | `faCalendarDays` | solid |
| Time / clock | `faClock` | regular |
| Venue / location | `faLocationDot` | solid |
| Seats / capacity | `faChair` | solid |
| Category / tag | `faTag` | solid |
| Ticket / booking | `faTicket` | solid |
| User / account | `faUser` | regular |
| Logout | `faRightFromBracket` | solid |
| Theme toggle (dark active) | `faSun` | regular |
| Theme toggle (light active) | `faMoon` | regular |
| Hamburger menu (mobile nav) | `faBars` | solid |
| Close (modal, drawer) | `faXmark` | solid |
| Chevron / nudge arrow (card links) | `faArrowRight` | solid |
| Chevron down (dropdown, accordion) | `faChevronDown` | solid |
| Increment seat stepper | `faPlus` | solid |
| Decrement seat stepper | `faMinus` | solid |
| Success / confirmed | `faCircleCheck` | regular |
| Error / cancelled | `faCircleXmark` | regular |
| Warning / low seats | `faTriangleExclamation` | solid |
| Empty state (no bookings) | `faTicket` (large, faded) | solid |
| Empty state (no search results) | `faMagnifyingGlass` (large, faded) | solid |
| Password visibility toggle | `faEye` / `faEyeSlash` | regular |
| Email field | `faEnvelope` | regular |
| Lock / password field | `faLock` | solid |
| Map pin in venue card | `faMapPin` | solid |
| Filter | `faFilter` | solid |
| Sort | `faArrowUpWideShort` | solid |
| Share | `faShareNodes` | solid |
| Back navigation | `faArrowLeft` | solid |

Icon sizing: 16px default (`w-4 h-4`), 20px for nav/buttons (`w-5 h-5`), 14px for inline metadata (`w-3.5 h-3.5`), 48px+ for empty-state illustrations (`w-12 h-12`, opacity 30%).

Icon color always uses a token: `var(--color-text-secondary)` for neutral/informational icons, `var(--color-accent)` for interactive/active icons, `var(--color-text-primary)` for icons inside filled accent buttons (rendered white).

---

## 5. Layout, Spacing & Radius

### 5.1 Spacing Scale (Tailwind default scale — use these multiples only)

`4px / 8px / 12px / 16px / 20px / 24px / 32px / 40px / 48px / 64px / 96px`

- Card internal padding: 16px (mobile) → 20–24px (desktop)
- Section vertical spacing: 64px (desktop) → 40px (mobile)
- Grid gap (event cards): 24px (desktop) → 16px (mobile)

### 5.2 Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 8px | buttons, inputs |
| `radius-md` | 12px | cards, modals |
| `radius-lg` | 16px | booking panel, large feature cards |
| `radius-pill` | 999px | badges, tags, status pills, category filters |

### 5.3 Borders & Shadows

- No drop shadows anywhere except: focus glow (`0 0 0 3px var(--color-accent-glow)`) and the primary CTA button hover glow (`0 0 20px rgba(255,77,109,0.27)` dark / `0 0 16px rgba(224,41,79,0.18)` light).
- All elevation is communicated via `1px solid var(--color-border)` + background tone (`surface` vs `surface-elevated`), never via shadow stacking.

### 5.4 Z-Index Scale

| Layer | z-index |
|---|---|
| base content | 0 |
| sticky navbar | 40 |
| sticky booking panel / mobile bottom CTA bar | 30 |
| dropdown / mobile drawer | 50 |
| modal overlay | 60 |
| toast notifications | 70 |

---

## 6. Mobile Responsiveness

Design **mobile-first**. Every component must be specified for mobile before desktop is treated as an enhancement, not the other way around.

### 6.1 Breakpoints (Tailwind defaults — do not add custom breakpoints)

| Breakpoint | Width | Target |
|---|---|---|
| base (no prefix) | 0–639px | mobile phones |
| `sm:` | 640px+ | large phones / small tablets |
| `md:` | 768px+ | tablets |
| `lg:` | 1024px+ | small laptops |
| `xl:` | 1280px+ | desktop |

### 6.2 Touch Target Rules

- Minimum tappable area: **44×44px** for every interactive element (buttons, icon buttons, stepper controls, nav links) — pad with invisible hit-area if the visual icon is smaller.
- Minimum spacing between adjacent tap targets: 8px, to prevent mis-taps.
- Form inputs: minimum height 48px on all breakpoints (never shrink inputs on mobile — they get harder to tap accurately, not easier).

### 6.3 Navigation Pattern

- Desktop (`md:` and up): horizontal navbar with inline links.
- Mobile (base): navbar shows logo + theme toggle + hamburger icon (`faBars`) only. Tapping hamburger opens a full-height slide-in drawer from the right (`width: 80vw, max-width: 320px`), `background: var(--color-surface)`, containing nav links stacked vertically (each a full-width tappable row, 56px height), auth buttons at the bottom of the drawer. Drawer overlay uses `var(--color-overlay)`. Close via `faXmark` icon top-right of drawer or tapping the overlay.

### 6.4 Grid Collapse Rules

- Event grid: `lg:` 3 columns → `md:` 2 columns → base 1 column.
- Event Detail page: `lg:` two-column (info + sticky booking panel) → base: single column, info stacks first, booking panel becomes a **sticky bottom bar** (see 6.5).
- Login/Register split screen: `md:` two-panel layout → base: visual panel is hidden entirely (`hidden md:block`), form takes full width with top padding replacing the visual panel's role.

### 6.5 Mobile Booking Pattern (important UX enhancement)

On mobile, a tall sticky sidebar doesn't work. Replace the desktop sticky booking panel with a **sticky bottom action bar**:
- Fixed to bottom of viewport, `z-index: 30`, `background: var(--color-surface)`, `border-top: 1px solid var(--color-border)`, padding 12px 16px, safe-area-inset-bottom respected (`padding-bottom: max(12px, env(safe-area-inset-bottom))`).
- Shows: seat count (small, left) + price (mono, center) + "Book Now" button (right, or full-width below if space-constrained).
- Tapping "Book Now" opens the full seat-selector + confirm flow as a **bottom sheet modal** (slides up from bottom, rounded top corners `radius-lg`, drag-to-dismiss handle bar at top) rather than the inline panel used on desktop.

### 6.6 Typography & Spacing Scaling on Mobile

- All `display`/`h1`/`h2` sizes scale down per the type scale table in section 3 (already includes mobile sizes).
- Section padding reduces from 64px → 40px; card padding reduces from 24px → 16px; grid gaps reduce from 24px → 16px.

### 6.7 Horizontal Scroll Patterns

- Category filter pills (Home page) scroll horizontally on mobile with `overflow-x-auto`, hidden scrollbar (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`), and a subtle fade-out gradient mask at the right edge to hint more content exists.

---

## 7. Motion & Animation

- Default transition timing: `200ms ease` for hover/focus state changes, `300ms ease` for drawer/modal entrances.
- **The one signature animation**: a slow sonar pulse ring around the live seat counter on the Event Detail page. 2s duration, expanding ring from the counter's edge, fading opacity from 40% to 0%, looping. Color: `var(--color-accent)`.
- This is the only ambient/looping animation in the product. Every other motion is a direct response to user action (hover, tap, page transition) — never decorative idle motion elsewhere.
- Respect `prefers-reduced-motion: reduce` globally: disable the pulse ring (replace with a static dot indicator), disable card hover lift/scale (keep color/border changes only), disable drawer slide animations (use instant or fade-only).

---

## 8. Pages

### 8.1 Home / Event Discovery (`/`)

**Navbar** (sticky, 64px, `background: var(--color-bg)` + `backdrop-filter: blur(12px)`, `border-bottom: 1px solid var(--color-border)`):
- Left: "eventflow" wordmark, Syne 700, the "e" in `var(--color-accent)`
- Center (desktop only, `md:flex hidden`): nav links "Discover", "My Bookings" (My Bookings only if authenticated)
- Right: theme toggle icon button (section 2.3) + auth state:
  - Logged out: "Log in" (ghost button, `border: 1px solid var(--color-border)`, text `var(--color-text-primary)`) + "Sign up" (filled accent button)
  - Logged in: user avatar (32px circle, initials, `background: var(--color-surface-elevated)`) + small badge showing upcoming booking count
- Mobile: hamburger (`faBars`) replaces center links + auth buttons, moved into drawer (section 6.3)

**Hero**:
- `display` headline: "Find your next **live experience**" — "live experience" on its own line, colored `var(--color-accent)`
- Subtext (`body`, `var(--color-text-secondary)`): "From underground gigs to stadium nights — book your seat before it's gone."
- AI Search Bar (component spec 9.2) centered below, max-width 640px
- Category filter pills row below search, horizontally scrollable on mobile (section 6.7): All / Music / Tech / Sports / Art / Comedy / Workshop. Active pill: `background: var(--color-accent-fill)`, text white. Inactive: `border: 1px solid var(--color-border)`, text `var(--color-text-secondary)`.

**Event Grid**:
- Section eyebrow label: "UPCOMING EVENTS" (`label` token)
- Grid per section 6.4 column rules, gap per section 6.6
- Each item: Event Card (component spec 9.1)
- Loading state: 6 skeleton cards (component spec 9.8)
- Empty state: centered, `faMagnifyingGlass` icon (48px, 30% opacity, `var(--color-text-muted)`), heading "No events match your search" (`h3`), sub "Try a different query or clear filters" (`caption`), ghost button "Clear filters"

---

### 8.2 Event Detail (`/events/:id`)

**Layout**: `lg:grid-cols-[1fr_400px] lg:gap-8` two-column on desktop; single column + sticky bottom bar on mobile (section 6.5).

**Left column**:
- Hero image, 16:9, `radius-md`, `object-fit: cover`. No-image fallback: `background: var(--color-surface-elevated)` with category name centered in `h2`, 20% opacity, `var(--color-text-muted)`.
- Back link above image on mobile only: `faArrowLeft` + "Back to events" (`caption`)
- Event name (`h1`)
- Metadata pill row: Date (`faCalendarDays`), Time (`faClock`), Venue (`faLocationDot`) — each pill `background: var(--color-surface-elevated)`, `radius-pill`, padding 8px 14px, `data` or `body` text
- Category badge: `radius-pill`, `background: var(--color-accent-glow)`, text `var(--color-accent)`, icon `faTag`
- Description (`body`, `var(--color-text-secondary)`, line-height 1.7)
- "WHERE" section: `label` + venue name (`h3`) + static venue card (`faMapPin` centered in a `var(--color-surface-elevated)` block, `radius-md`, height 180px — no live map integration needed)

**Right column / Booking panel** (desktop: sticky card; mobile: sticky bottom bar → bottom sheet, section 6.5):
- Card: `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `radius-lg`, padding 24–28px, `position: sticky; top: 88px` on desktop
- **Live Seat Counter** (signature component): large `data`-style number at 48px, `faChair` icon beside it, label "seats available" (`label`) below. Pulse ring per section 7.
  - Seats < 10: number + ring color shift to `var(--color-warning)`, label → "Almost sold out", `faTriangleExclamation` icon appears beside label
  - Seats = 0: number shows "0" in `var(--color-error)`, label → "Sold out", booking controls disabled (opacity 50%, `cursor: not-allowed`), CTA button becomes "Join Waitlist" (ghost style instead of filled)
- Divider: `1px solid var(--color-border)`
- Seat stepper: label "HOW MANY SEATS?" (`label`), then a row: minus button (`faMinus`, 36px circular, ghost) — number (`data`, 20px) — plus button (`faPlus`, 36px circular, ghost). Min 1, max = available seats. Buttons disabled state at min/max: opacity 40%.
- Price row: "2 × ₹599" left (`caption`) / "₹1,198" right (`data`, bold, `var(--color-text-primary)`)
- Primary CTA: "Book Now" full-width, `var(--color-accent-fill)` background, white text, `radius-sm`, 48px height, hover → `var(--color-accent-fill-hover)` + glow (section 5.3)
- Reassurance caption below button: "Booking confirmed instantly. Free cancellation before 24h." (`caption`, `var(--color-text-muted)`)
- Booking confirmation flow opens a Modal (component 9.6) on desktop, or the bottom sheet variant on mobile.

---

### 8.3 Login (`/login`)

**Desktop** (`md:grid-cols-2`): left visual panel, right form panel.
**Mobile**: visual panel `hidden`, form panel full width with top padding 32px replacing it.

**Visual panel**: `background: var(--color-surface)`; large ghost text "events" in Syne 800, 96px, colored `var(--color-surface-elevated)` (barely visible against panel bg); 3 decorative blurred event card silhouettes staggered/rotated ±3°; tagline bottom-left: "Your next great night out starts here." (`h3`, white in dark mode / `var(--color-text-primary)` in light mode)

**Form panel**: centered content, max-width 380px
- Wordmark top
- "Welcome back" (`h2`)
- "Log in to manage your bookings." (`body`, secondary)
- Email field (icon `faEnvelope`), Password field (icon `faLock`, trailing `faEye`/`faEyeSlash` visibility toggle) — Input spec 9.4
- "Forgot password?" — right-aligned, `caption`, `var(--color-accent)`
- Submit: "Log in" full-width filled button
- Divider "— or —"
- Ghost button: "Continue with Google" (decorative, no functional requirement, but style consistently — `faGoogle` from free-brands-svg-icons is permitted here since it's the one legitimate brand-icon exception)
- Footer: "New here? **Create an account**" (bold part links to `/register`, colored `var(--color-accent)`)

**Error state**: invalid credentials → red banner above form, `background: var(--color-error-bg)`, `border: 1px solid var(--color-error)`, icon `faCircleXmark`, text "Incorrect email or password. Try again." (`body`, `var(--color-error)`)

---

### 8.4 Register (`/register`)

Same split-screen structure as Login, panels mirrored (form left, visual right on desktop; visual hidden on mobile).

**Visual panel copy**: "Every great story starts with showing up."

**Form fields**: Full Name (`faUser`), Email (`faEnvelope`), Password (`faLock` + visibility toggle), Confirm Password (`faLock` + visibility toggle)
- Password strength bar: 4px height bar below password field, fills left-to-right: weak (25%, `var(--color-error)`) / medium (60%, `var(--color-warning)`) / strong (100%, `var(--color-success)`)
- Submit: "Create account"
- Footer: "Already have an account? **Log in**"

---

### 8.5 My Bookings (`/bookings`)

Single column, max-width 800px, centered, padding per section 6.6.

**Header**: "My Bookings" (`h1`) + sub-label "3 upcoming · 1 past" (`caption`)

**Tabs**: "Upcoming" | "Past" — underline tab style; active tab: text `var(--color-text-primary)`, 2px underline `var(--color-accent)`; inactive: text `var(--color-text-secondary)`, no underline

**Booking list**: vertical stack, gap 16px, Booking Card per component 9.3

**Empty state**: centered `faTicket` icon (48px, 30% opacity), "No bookings yet" (`h3`), "Find an event and grab your seat." (`caption`), filled CTA "Browse events" → `/`

**Cancel confirmation**: Modal (component 9.6) — "Cancel this booking?" with body text "Your seats will be released back to the event. This can't be undone." Two buttons: ghost "Keep booking" / filled-error "Cancel booking" (`background: var(--color-error)`, white text)

---

### 8.6 404 Not Found

Full-screen centered. "404" in Syne 800, 120px, `var(--color-surface-elevated)`. Overlapping smaller "Page not found" (`h2`, `var(--color-text-primary)`). Subtext "The page you're looking for doesn't exist." (`body`, secondary). Filled button "Back to events" → `/`. Background: faint repeating dot grid using `var(--color-border)` at 40% opacity, `background-size: 24px 24px`.

---

## 9. Components

### 9.1 Event Card

- `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `radius-md`, `overflow: hidden`
- Image area: 16:9, `object-fit: cover`; on card hover, `transform: scale(1.05)` (clipped by overflow hidden); category badge top-right of image, `radius-pill`, `background: var(--color-accent-fill)`, white text, 11px Inter 600 uppercase
- Content padding 16px: event name (`h3`, 2-line clamp) → date+venue row (`caption`, flex with `faCalendarDays`/`faLocationDot` icons and a `·` separator) → seat count row (`data`, `faChair` icon; default `var(--color-text-primary)`; <10 seats → `var(--color-warning)`; 0 seats → "Sold Out" pill, `background: var(--color-error-bg)`, text `var(--color-error)`, replaces the count entirely)
- Bottom row: "View event" text + `faArrowRight` icon, `var(--color-accent)`, 13px; icon nudges 3px right on hover
- Card hover: `border-color: var(--color-accent)` at 35% opacity, `transform: translateY(-2px)`, transition 200ms

### 9.2 AI Search Bar

- Container: `height: 56px`, `max-width: 640px`, `background: var(--color-surface-elevated)`, `border: 1px solid var(--color-border)`, `radius-sm`
- Left icon: `faWandMagicSparkles`, `var(--color-accent)`, padding-left 16px
- Input: placeholder italic, `var(--color-text-muted)` — *"Try: \"music concerts this weekend with 50+ seats\""*
- Right: "Search" button, `width: 80px`, `background: var(--color-accent-fill)`, white text, flush right with `radius: 0 8px 8px 0`
- Focus state: container border → `var(--color-accent)`, glow `0 0 0 3px var(--color-accent-glow)`
- Helper caption below (shown once results load): "AI-powered search — results filtered by your query" (`caption`, `var(--color-text-muted)`)

### 9.3 Booking Card

- Horizontal layout: 80×80px thumbnail (`radius-sm`, `object-fit: cover`) — info block — status badge — action
- Info: event name (`h3`) → date+venue (`caption`) → "X seats booked" (`data`, `faChair`) → booking ID e.g. "BK-8F2A91" (`caption`, mono, `var(--color-text-muted)`)
- Status badge: "Upcoming" (`var(--color-success-bg)` bg, `var(--color-success)` text, `faCircleCheck`) / "Past" (`var(--color-surface-elevated)` bg, `var(--color-text-secondary)` text) / "Cancelled" (`var(--color-error-bg)` bg, `var(--color-error)` text, `faCircleXmark`)
- Action: upcoming → ghost "Cancel booking" button (border `var(--color-border)` → hover `var(--color-error)`, text matches); past/cancelled → no action, badge only
- Mobile: thumbnail + info stack on top, status badge + action move to a second row below, full width

### 9.4 Form Inputs

- `height: 48px` minimum (all breakpoints, per section 6.2), `background: var(--color-surface-elevated)`, `border: 1px solid var(--color-border)`, `radius-sm`, padding `0 16px` (or `0 40px 0 16px` if a trailing icon like password-visibility exists)
- Label above, `label` token
- Leading icon (when specified per page, e.g. `faEnvelope`, `faLock`, `faUser`): 16px, `var(--color-text-secondary)`, positioned inset-left 14px
- Focus: border → `var(--color-accent)`, glow `0 0 0 3px var(--color-accent-glow)`
- Error: border → `var(--color-error)`, helper text below in `caption`, `var(--color-error)`, prefixed with `faCircleXmark` at 12px. This state is always triggered by custom JS validation — never by the browser's native `:invalid` styling or its default tooltip. See section 9.9 for full validation behavior.
- Placeholder: `var(--color-text-muted)`

### 9.5 Toast Notifications

- Position: bottom-right (desktop), bottom-center full-width minus 16px margins (mobile) — stacked with 8px gap, newest on top
- `background: var(--color-surface-elevated)`, `border: 1px solid var(--color-border)`, `radius-md`, padding `14px 18px`
- Left accent border, 3px: success → `var(--color-success)`, error → `var(--color-error)`, warning → `var(--color-warning)`
- Icon matches accent type (`faCircleCheck` / `faCircleXmark` / `faTriangleExclamation`)
- Title (`h3`, 14px) + description (`caption`)
- Auto-dismiss 4s, slide-in from right (desktop) / slide-up from bottom (mobile); `faXmark` manual dismiss icon top-right, 12px

### 9.6 Modal

- Overlay: `background: var(--color-overlay)`, `backdrop-filter: blur(4px)`
- Card: `background: var(--color-surface)`, `border: 1px solid var(--color-border)`, `radius-lg`, `max-width: 440px`, padding 32px, centered
- On mobile: becomes a bottom sheet — `radius: 16px 16px 0 0`, slides up from bottom, full width, drag handle bar (4px × 36px, `var(--color-border)`, centered top, 8px from edge)
- Heading (`h3`) + body (`body`, secondary) + button row: ghost (secondary action, left) + filled (primary action, right) — on mobile, buttons stack full-width, primary on top

### 9.7 Buttons (general spec, applies everywhere)

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| Primary (filled) | `var(--color-accent-fill)` | white | none | main CTA per screen — one per view |
| Ghost | transparent | `var(--color-text-primary)` | `1px solid var(--color-border)` | secondary actions |
| Ghost-danger | transparent | `var(--color-error)` | `1px solid var(--color-error)` | destructive secondary actions (e.g. cancel booking) |
| Filled-danger | `var(--color-error)` | white | none | confirmed destructive actions inside modals |
| Text/link | transparent | `var(--color-accent)` | none | inline links, "View event", footer links |

All buttons: `radius-sm`, `height: 44–48px`, `font: Inter 600`, min-width respects 44×44px touch target (section 6.2), `transition: 200ms ease` on background/border/transform, disabled state = `opacity: 0.45, cursor: not-allowed`.

### 9.8 Loading / Skeleton States

- Skeleton cards match real card dimensions exactly; shimmer animation sweeps `var(--color-surface-elevated)` → `var(--color-border)` → `var(--color-surface-elevated)`, 1.5s loop, disabled under `prefers-reduced-motion` (replace with static `var(--color-surface-elevated)` block)
- Inline spinner (inside buttons during submit): 16px ring, `border-color: var(--color-accent)` with transparent top segment, `rotate` animation
- Full-page loader (initial app load): centered wordmark with a 2px underline that sweeps left-to-right in `var(--color-accent)`, 1.2s loop

### 9.9 Form Validation — Custom, No Native Browser Popups

Native browser validation must be **disabled everywhere**. This means: the default tooltip ("Please fill out this field.", "Please include an '@' in the email address.", etc.), the red `:invalid` outline browsers apply automatically, and the native number-input spinner/rejection behavior. These look inconsistent with the dark/light theme, can't be restyled, and break immersion — every screenshot of a real product showing that grey-and-white system tooltip is an instant tell that validation wasn't designed.

**Implementation rule**: every `<form>` element gets the `noValidate` attribute. `required`, `pattern`, `type="email"` etc. can still be present in the markup for semantics/autofill/keyboard-hint purposes, but they must never be the thing that actually blocks submission or shows an error — that logic lives entirely in JS/React state, rendered with the tokens below.

**Validation timing**:
- **On blur** (field loses focus for the first time): validate that field alone, show its inline error if invalid.
- **While typing, after an error is already showing for that field**: re-validate on every keystroke so the error clears the instant the input becomes valid — don't make the user click away again just to see it's fixed.
- **On submit**: validate every field at once. If anything is invalid, block submission, show all inline errors simultaneously, and auto-focus + smooth-scroll to the first invalid field.

**Visual pattern** (reuses tokens already defined in 9.4, nothing new to introduce):
- Invalid field: `border-color: var(--color-error)` + `box-shadow: 0 0 0 3px var(--color-error-bg)` (same construction as the focus glow, just with error tokens)
- Error message: rendered inline directly below the field — `caption` size, `var(--color-error)`, prefixed with `faCircleXmark` at 12px. It is part of normal layout flow (pushes content down), never a floating tooltip/popover that overlaps other fields the way the native one does in the screenshot.
- On a failed submit attempt, the first invalid field plays a single shake: `translateX(-4px → 4px → -4px → 0)` over 300ms. This is action-triggered (a direct response to the user tapping submit), so it's allowed under the motion rules in section 7 even though idle animation generally isn't.
- Valid field, once touched and passing: border returns to `var(--color-border)`. Optional polish for fields where positive confirmation genuinely helps (email format, password match): a small trailing `faCircleCheck` in `var(--color-success)`.
- Every inline error is wrapped in `aria-live="polite"` so it's announced to screen readers the moment it appears (ties to section 10).

**Microcopy — replace every generic browser message with on-brand copy:**

| Field | Native message (never use) | Use instead |
|---|---|---|
| Full Name, empty | "Please fill out this field." | "We'll need your name to get started." |
| Email, empty | "Please fill out this field." | "Enter your email to continue." |
| Email, invalid format | "Please include an '@' in the email address." | "That doesn't look like a valid email." |
| Password, empty | "Please fill out this field." | "Choose a password to secure your account." |
| Password, too short | "Please lengthen this text to 8 characters or more." | "Use at least 8 characters." |
| Confirm Password, mismatch | (no native equivalent) | "Passwords don't match." |
| Seat count, exceeds available | (no native equivalent) | "Only {n} seats left — lower your count." |
| Required select, unselected | "Please select an item in the list." | "Pick one to continue." |

**Numeric-only fields (seat stepper and similar)**: don't use `type="number"` — that's what produces the spinner arrows and the native rejection behavior. Use `type="text"` with `inputMode="numeric"` (keeps the numeric mobile keyboard) and sanitize in the `onChange` handler by stripping any non-digit character as it's typed: `value.replace(/[^0-9]/g, '')`. Invalid characters then never appear in the field at all, instead of being typed and then rejected — so there's nothing to error on for the common case (typos), and the only real validation message left is the genuine logical edge case (count exceeds available seats).

**Server/network errors** are a different category from field validation and use a different pattern: a banner above the form (same construction as the Login error banner in 8.3 — `var(--color-error-bg)` background, `1px solid var(--color-error)` border, `faCircleXmark` icon) for errors discovered on submit, or a Toast (9.5) if the form has already closed (e.g. a booking that fails after its modal was dismissed).

---

## 10. Accessibility Checklist

- All interactive elements have a visible focus state: `outline: none; box-shadow: 0 0 0 3px var(--color-accent-glow)` — never remove focus indication without replacing it.
- Color is never the only signal for state — pair every status color with an icon and/or text label (already reflected throughout section 9).
- All text/background combinations in both themes meet WCAG AA (4.5:1 for body text, 3:1 for large/bold text ≥18px). The light-mode accent (`#E0294F`) was chosen specifically to pass AA on white backgrounds — do not lighten it.
- `prefers-reduced-motion` is respected globally (section 7).
- Touch targets ≥44×44px (section 6.2).
- All icons used as the sole content of a button (no visible text) require an `aria-label` (e.g. theme toggle, hamburger, modal close, password visibility, stepper +/-).
- Form errors are announced via `aria-live="polite"` regions, not just visual color change.

---

## 11. Things to Avoid

- No light backgrounds in dark mode and vice versa — never mix tokens across themes.
- No icons from any library other than FontAwesome Free (no Lucide, Heroicons, emoji, custom SVGs).
- No rounded "pill" buttons for primary CTAs — pills are reserved for badges/tags/filters only; buttons use `radius-sm` (8px).
- No stock-photo-style imagery; use the defined no-image fallback pattern instead.
- No gradients on page backgrounds or cards — gradient (if any) is reserved for the primary CTA button only, and even that is optional given the flat-button spec in 9.7 (flat filled is the default; only use a gradient if Antigravity's component library defaults to one — do not add gradients deliberately).
- No drop shadows for elevation — borders + surface tone only (section 5.3).
- No idle/looping decorative animation anywhere except the single signature pulse ring (section 7).
- No blue links anywhere — all interactive text/links use `var(--color-accent)`.
- No skipping the mobile spec — every component above has a mobile behavior defined; implement it, don't default to "desktop shrunk down."
- No hardcoded hex colors in component code — always reference the CSS variable tokens so theme switching works app-wide.
- No native browser form validation — no default `"Please fill out this field"` tooltips, no `:invalid` red outlines, no native number-input spinners. All validation is custom-built per section 9.9.

---

## 12. Tech Implementation Notes

- Framework: React.js (JavaScript, no TypeScript)
- Styling: Tailwind CSS v3, extended with the CSS variable tokens above via `theme.extend.colors` referencing `var(--color-*)`:

```js
// tailwind.config.js (excerpt)
theme: {
  extend: {
    colors: {
      bg: 'var(--color-bg)',
      surface: 'var(--color-surface)',
      'surface-elevated': 'var(--color-surface-elevated)',
      border: 'var(--color-border)',
      'text-primary': 'var(--color-text-primary)',
      'text-secondary': 'var(--color-text-secondary)',
      'text-muted': 'var(--color-text-muted)',
      accent: 'var(--color-accent)',
      'accent-fill': 'var(--color-accent-fill)',
      success: 'var(--color-success)',
      error: 'var(--color-error)',
      warning: 'var(--color-warning)',
    },
    fontFamily: {
      display: ['Syne', 'sans-serif'],
      body: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    borderRadius: {
      sm: '8px',
      md: '12px',
      lg: '16px',
      pill: '999px',
    },
  },
},
```

- Icons: `@fortawesome/react-fontawesome` + free-solid/free-regular/free-brands packages (section 4.1) — no other icon dependency.
- No external component libraries (no shadcn, no MUI, no Chakra) — build every component from scratch against this spec.
- Theme state: a small `ThemeContext` (React Context + `useState`) reading/writing `localStorage['eventflow-theme']` and toggling `document.documentElement.dataset.theme`.
- File structure suggestion:
```
src/
  components/
    EventCard.jsx
    AISearchBar.jsx
    BookingCard.jsx
    SeatStepper.jsx
    ThemeToggle.jsx
    Toast.jsx
    Modal.jsx
    SkeletonCard.jsx
  pages/
    Home.jsx
    EventDetail.jsx
    Login.jsx
    Register.jsx
    Bookings.jsx
    NotFound.jsx
  context/
    ThemeContext.jsx
    AuthContext.jsx
  styles/
    tokens.css   (the :root / [data-theme] block from section 2.2)
```