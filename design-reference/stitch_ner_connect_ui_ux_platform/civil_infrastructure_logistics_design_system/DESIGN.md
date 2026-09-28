---
name: Civil Infrastructure & Logistics Design System
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#404849'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#70797a'
  outline-variant: '#bfc8c9'
  surface-tint: '#30666c'
  primary: '#002b2f'
  on-primary: '#ffffff'
  primary-container: '#004349'
  on-primary-container: '#7aafb6'
  inverse-primary: '#9ad0d7'
  secondary: '#006d3d'
  on-secondary: '#ffffff'
  secondary-container: '#99f3b6'
  on-secondary-container: '#0b7141'
  tertiary: '#180088'
  on-tertiary: '#ffffff'
  tertiary-container: '#2c18b5'
  on-tertiary-container: '#a09cff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b6ecf3'
  primary-fixed-dim: '#9ad0d7'
  on-primary-fixed: '#001f23'
  on-primary-fixed-variant: '#134e54'
  secondary-fixed: '#9cf6b9'
  secondary-fixed-dim: '#80d99e'
  on-secondary-fixed: '#00210f'
  on-secondary-fixed-variant: '#00522d'
  tertiary-fixed: '#e3dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#100069'
  on-tertiary-fixed-variant: '#382abf'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.03em
  telemetry-num:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 3rem
---

## Brand & Style

This design system establishes a high-reliability, mission-critical framework for public infrastructure monitoring, heavy transit coordination, and disaster logistics across the eight states of North Eastern India. Operating under severe topography, erratic monsoonal disruptions, and variable network environments, the interface serves field officers, logistical dispatchers, national disaster response coordinators, and civil freight operators.

The visual style is rooted in **Structural Civic-Tech**:
- **Authoritative & Functional:** Visual noise is stripped down in favor of structured data, unambiguous color status tiers, and rigid spatial hierarchy.
- **High Field Visibility:** High-contrast text layers and dense surface differentiation guarantee instant comprehension under direct sunlight and on lower-grade ruggedized mobile terminals.
- **Operational Calm:** The palette balances state authority with quiet urgency. Routine states maintain clean, cool structural neutrality, reserving high-chroma alert pigments strictly for acute geological or atmospheric disruption.

## Colors

The color system operates under strict semantic categorization to eliminate cognitive latency during emergency deployments, landslide blockades, and convoy routings.

### Core Brand & Operational Hues
- **Primary (`#004349`):** Command blue-spruce. Encapsulates state authority, structural navigation, primary action bars, and top-tier headers.
  - *Primary Container:* `#0D5C63`
  - *On-Primary Container:* `#90D2DA`
  - *On-Primary:* `#FFFFFF`
- **Secondary (`#006D3D`):** Infrastructure green. Reserved for normal logistical operations, cleared arterial corridors, and verified freight manifests.
  - *Secondary Container:* `#97F3B5`
  - *On-Secondary Container:* `#00210E`
- **Tertiary (`#2C18B5`):** Critical medical and emergency relief transit priority. Demarks life-saving supply corridors, air-lift junctions, and prioritized ambulance movements.
  - *Tertiary Container:* `#453ACC`
  - *Tertiary Tint / Surface:* `#EEF2FF`
  - *Tertiary Text / Border:* `#3730A3`
- **Error / Failure (`#BA1A1A`):** Systemic faults, sensor disconnects, invalid clearances.
  - *Error Container:* `#FFDAD6`
  - *On-Error:* `#FFFFFF`

### Surface & Neutral Architecture
- **Root Background:** `#FAF8FF`
- **Neutral Canvas / Layout Backing:** `#F8FAFB`
- **Card & Table Surface:** `#FFFFFF`
- **Primary Text:** `#0F172A` (98:1 contrast against `#FFFFFF` for zero-ambiguity reading)
- **Secondary Text:** `#475569`
- **Muted Text / Metadata:** `#64748B`
- **Borders & Dividers:** Subtle structural `#E2E8F0`; focused container delineation `#CBD5E1`.

### IMD 4-Tier Road & Weather Risk Severity Matrix
The Indian Meteorological Department (IMD) 4-tier alert system is integrated directly into road passability and transit status tokens:
- **Tier 1 - Clear / No Action Needed:**
  - Base: `#2E8B57` | Surface Tint: `#EAF5EE` | Border: `#A3D9B1` | Text: `#1B5E20`
- **Tier 2 - Watch / Caution (Moderate Rainfall, Potential Slips):**
  - Base: `#E8A317` | Surface Tint: `#FEF7E6` | Border: `#FAD98C` | Text: `#946200`
- **Tier 3 - Be Prepared / Delay (Active Mudslides, Convoy Halts):**
  - Base: `#E8590C` | Surface Tint: `#FFEDE0` | Border: `#F7B98A` | Text: `#9A3412`
- **Tier 4 - Take Action / Blocked (Severe Washouts, Flash Floods, Road Inundated):**
  - Base: `#C0392B` | Surface Tint: `#FCECEB` | Border: `#F5A8A3` | Text: `#8A1F11`

## Typography

This design system uses a unified typographic scale powered exclusively by **Inter**. Using a single grotesque sans family prevents rendering bottlenecks over constrained networks and guarantees clean vertical rhythm.

### Tabular Numbers & Data Precision
All tables, chainage markers (e.g., `NH-29 KM 42+200`), bridge load metrics, rainfall levels (mm/hr), convoy time stamps, and GPS coordinates must mandate OpenType feature `tnum` (tabular numbers) and `cv05` for lowercase l clarity. This prevents optical jitter on real-time dashboards updating via telemetry feeds.

### Hierarchy & Mobile Behavior
- Display and `headline-lg` styles downscale dynamically on viewports narrower than 768px (`headline-lg-mobile`).
- Operational metadata, badge text, and highway codes leverage `label-sm` and `label-md` with slight positive tracking (`+0.02em` to `+0.03em`) to preserve legibility on low-resolution displays.

## Layout & Spacing

The layout is constructed on an 8pt base grid with a 4pt micro-subgrid for dense tabular layouts and compact incident trackers.

### Grid Models
- **Desktop (>= 1200px):** 12-column responsive fluid grid with `2rem` (`32px`) margins and `1.5rem` (`24px`) gutters. Heavy operations consoles can toggle a collapsed 320px fixed left sidebar for highway segment filtering.
- **Tablet (768px – 1199px):** 8-column layout with `1.5rem` margins and `1rem` gutters. Map and card splits stack vertically.
- **Mobile (< 768px):** 4-column layout with `1rem` (`16px`) safe canvas margins and `0.75rem` gutters. Floating action buttons and high-priority distress triggers pin to safe bottom areas.

### Density & Rhythms
Telemetry data grids, convoy clearance logs, and route-check tables utilize condensed cell padding (`space-xs` vertical, `space-sm` horizontal) to maximize immediate vertical situational awareness without forced scrolling.

## Elevation & Depth

Visual hierarchy uses a combined model of low-contrast borders and utilitarian ambient shadows. The platform rejects skeuomorphic heavy drop-shadows to ensure high rendering performance on field hardware and avoid visual ambiguity around critical map overlays.

- **Level 0 (Flat / Canvas):** Surface color `#F8FAFB`. No shadow. Bounded by structural border `#E2E8F0` where division is required.
- **Level 1 (Data Cards, Table Rows, Panels):** 
  - Background: `#FFFFFF`
  - Border: 1px solid `#E2E8F0`
  - Shadow: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`
  - Use case: Standard transit manifests, route telemetry cards, weather summary widgets.
- **Level 2 (Active Alerts, Hover States, Floating Toolbars):**
  - Background: `#FFFFFF`
  - Border: 1px solid `#CBD5E1`
  - Shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`
  - Use case: Focused transit alerts, active map overlays, dropdown panels.
- **Level 3 (Emergency Overlays, Modals, Critical Distress Broadcasts):**
  - Background: `#FFFFFF`
  - Border: 1px solid `#94A3B8`
  - Shadow: `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)`
  - Use case: Civil disaster escalations, corridor closure confirmation modals.

## Shapes

The geometric framework balances administrative precision with accessible human factors:

- **Cards & Data Panels:** Exact `10px` border-radius (`0.625rem`). This provides structural compartmentalization without soft, playful aesthetics.
- **Interactive Controls (Buttons, Inputs, Selects, Search Fields):** Exact `8px` border-radius (`0.5rem`). Conforms to standard industrial touch/click targets while maintaining sharp functional definition.
- **Status Badges, IMD Alert Indicators, and Priority Tags:** `9999px` (Pill). High visual distinction against square panels; identifies real-time systemic states at a glance.
- **Nested Inner Containers:** `6px` radius inside `10px` card frames to maintain clean concentric corner curves.

## Components

### Buttons
- **Primary:** Filled `#004349`, text `#FFFFFF`, radius `8px`. Hover: `#0D5C63`. Active: `#002E32`. Focused: 2px offset ring in `#90D2DA`.
- **Secondary / Operational:** Surface `#FFFFFF`, border 1px solid `#CBD5E1`, text `#0F172A`. Hover: `#F8FAFB` with border `#94A3B8`.
- **Tertiary Medical / Rapid Deployment:** Filled `#2C18B5`, text `#FFFFFF`. Hover: `#453ACC`. Used strictly for urgent humanitarian actions and medical transit dispatch.
- **Emergency Distress Action:** Filled `#BA1A1A`, text `#FFFFFF`. High-contrast action for declaring sector blackouts or road collapses.

### Status Chips & IMD Weather Badges
- Constructed as `9999px` pills with `4px 10px` padding, typography `label-sm`.
- Every chip pairs a text label with an explicit left indicator dot (`6px` circular) to assist color-blind personnel.
- **Tier 1 (Clear):** Background `#EAF5EE`, border `#A3D9B1`, text & dot `#1B5E20`.
- **Tier 2 (Caution):** Background `#FEF7E6`, border `#FAD98C`, text & dot `#946200`.
- **Tier 3 (Delay / Prep):** Background `#FFEDE0`, border `#F7B98A`, text & dot `#9A3412`.
- **Tier 4 (Blocked):** Background `#FCECEB`, border `#F5A8A3`, text & dot `#8A1F11`.

### Data Cards
- Pure white `#FFFFFF` surface, `10px` radius, 1px border in `#E2E8F0`, Elevation Level 1.
- Header block separated by a 1px border `#F1F5F9`.
- Critical alert cards append a thick 4px solid left border matching the corresponding IMD alert or emergency token.

### Input Fields & Controls
- Height: `40px` (desktop), `44px` (mobile touch-accessible).
- Base: `#FFFFFF` fill, 1px border `#CBD5E1`, radius `8px`, typography `body-md`.
- Focus state: Border `#004349` with a 2px outline in `#90D2DA` (30% alpha).
- Checkboxes & Radios: `#CBD5E1` border in idle state; active states fill `#004349` with `#FFFFFF` glyph. Minimum touch wrapper target `44px × 44px`.

### Telemetry Lists & Manifest Rows
- Alternating subtle row zebra striping (`#FFFFFF` to `#F8FAFB`) for dense tables containing 20+ records.
- Numerical values (speeds, tonnages, chainages, durations) styled in `telemetry-num` with font-variant-numeric: `tabular-nums`.
- Right-aligned figures, left-aligned labels, centered risk pills.

### Specialized Logistics Components
- **Corridor Passability Bar:** Segmented micro-progress line indicating sequential highway sections from origin to destination, color-coded by IMD status.
- **Medical Corridor Banner:** Tint `#EEF2FF`, border `#3730A3` (1px dashed), text `#2C18B5`, displaying transit convoy clearance tokens.