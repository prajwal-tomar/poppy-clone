# Design System Style Guide

This document contains the final design tokens extracted from the visual direction, providing a comprehensive reference for colors, typography, spacing, and component styles.

## Color Palette

| Token | Hex Code | Usage |
|-------|----------|-------|
| Background | `#FDFBF7` | Main page background |
| Surface | `#FFFFFF` | Cards, floating elements |
| Primary | `#1A1A1A` | Near-black for CTAs |
| Secondary | `#F2F0EB` | Secondary button/tags |
| Accent | `#FF5C35` | Highlights, logo |
| Text Primary | `#1A1A1A` | Headings, primary copy |
| Text Secondary | `#666666` | Descriptions, subtext |
| Border | `#EAEAEA` | Subtle boundaries |

## Typography

| Level | Font Family | Size | Weight | Line Height |
|-------|-------------|------|--------|-------------|
| H1 (Hero) | Plus Jakarta Sans | 64px | Extra Bold (800) | 1.1 |
| H2 (Section titles) | Plus Jakarta Sans | 40px | Bold (700) | 1.2 |
| H3 (Card titles) | Plus Jakarta Sans | 24px | Semi-Bold (600) | 1.3 |
| Body | Inter | 16px | Regular (400) | 1.6 |
| Body Small | Inter | 14px | Regular (400) | 1.5 |
| Caption | Inter | 12px | Medium (500) | 1.4 |

## Spacing System

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight grouping |
| sm | 8px | Small gaps |
| md | 16px | Standard spacing |
| lg | 24px | Component padding |
| xl | 32px | Large component spacing |
| 2xl | 64px | Minor section spacing |
| 3xl | 128px | Major section spacing |

## Border Radius

| Token | Value | Note |
|-------|-------|------|
| sm | 4px | |
| md | 8px | |
| lg | 16px | |
| xl | 24px | |
| full (pill) | 9999px | Used for buttons, badges, single-line inputs |

## Shadows

| Token | Box Shadow Value | Usage |
|-------|------------------|-------|
| sm | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Minor interactive elements |
| md | `0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` | Floating navbars / hover states |
| lg | `0 20px 25px -5px rgba(0, 0, 0, 0.03), 0 8px 10px -6px rgba(0, 0, 0, 0.03)` | Main product mockups |

## Component Styles

### Buttons

| Variant | State | Background | Text Color | Border | Note |
|---------|-------|------------|------------|--------|------|
| **Primary** | Default | `#1A1A1A` | `#FFFFFF` | None | Pill shape (`px-5 py-2.5`) |
| | Hover | `#333333` | `#FFFFFF` | None | |
| | Disabled | `#1A1A1A` (50% opacity) | `#FFFFFF` | None | |
| **Secondary**| Default | `#FFFFFF` | `#1A1A1A` | `1px solid #EAEAEA` | Pill shape (`px-5 py-2.5`) |
| | Hover | `#F9F9F9` | `#1A1A1A` | `1px solid #EAEAEA` | |
| | Disabled | `#FFFFFF` | `#1A1A1A` (50% opacity) | `1px solid #EAEAEA` (50% opacity) | |
| **Ghost** | Default | Transparent | `#666666` | None | Pill shape (`px-5 py-2.5`) |
| | Hover | `#000000` (5% opacity) | `#1A1A1A` | None | |
| | Disabled | Transparent | `#666666` (50% opacity) | None | |

### Cards

| Property | Value | Description |
|----------|-------|-------------|
| Background | `#FFFFFF` | Standard white background |
| Border | `1px solid #EAEAEA` | Subtle gray border |
| Radius | `16px` (lg) | Large border radius |
| Padding | `24px` (p-6) | Generous internal padding |

### Input Fields

| Property | Default State | Focus State |
|----------|---------------|-------------|
| Background | `#FFFFFF` | `#FFFFFF` |
| Border | `1px solid #EAEAEA` | `1px solid #1A1A1A` |
| Border Radius | `8px` (md) | `8px` (md) |
| Padding | `12px 20px` (`px-[20px] py-[12px]`) | `12px 20px` |
| Text Color | `#1A1A1A` (16px, font-sans) | `#1A1A1A` |
| Placeholder | `#999999` | `#999999` |
| Outline | None | `2px solid rgba(26,26,26,0.2)` with `2px` offset |
