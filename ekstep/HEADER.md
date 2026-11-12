# EkStep bot header (EkStep builds only)

**This file is for EkStep's own prototypes.** It is not part of the shared skill. Other teams use their own branding, and `starter/UI-SPEC.md` stays brand-neutral. Never copy the Blue Dots logo into someone else's build.

Every EkStep bot page uses the header from Divya 2.0 (Purple Dots, Lovable project `3b35a5d0`).

## Layout
- A fixed bar, 80 px high (`h-20`), full width, with a gradient from left to right in the programme colour. A thin white line sits at the bottom (`border-white/10`).
- Content width: `max-w-[1400px] mx-auto`, with side padding `px-6 md:px-10 lg:px-[60px]`.
- Left to right:
  1. **The Blue Dots AI logo**, `h-12 w-auto`. The alt text is "Blue Dots AI — Seeded by EkStep".
  2. **A divider:** `h-9 w-px bg-white/25`.
  3. **The bot name** in bold white, `text-2xl`.
  4. **The tagline** under the name: `text-xs text-white/80`, cut short on one line if it's long.
- **On a phone** (below 640 px), so the name stays on one line: logo `h-9 sm:h-12`, divider `h-7 sm:h-9`, name `block text-lg sm:text-2xl truncate`, gap `gap-3 sm:gap-4`. Give the img `width={899} height={290}`.
- **On the right**, only if the bot has a map: "See the map →" in white, `text-sm font-semibold`. Hide it below 640 px if space is short.
- The page content starts below the bar (`pt-20` or equal).

## The logo is an asset, never a drawing
- File: `ekstep/assets/blue-dots-logo.png`. It is 899 × 290, with a transparent background and white text, made for dark or coloured bars.
- Upload this exact file to each project. Never redraw it, recolour it, crop it, or let an app builder generate a lookalike.
- When you upload it, tell the builder to keep the favicon as it is (LESSONS 65). Upload it again for each project, because an upload works only once (LESSONS 64).
- Older remixes carry an earlier JPEG logo, asset `aa688eae…`. Replace it with this one.

## Gradient per programme
White text must stay readable (WCAG AA) across the whole bar. For light colours, use the deeper shades.

| Programme | From | To |
|---|---|---|
| Purple (Divya) | `#7B5EA7` | `#534AB7` |
| Pink (Sakhi) | `#C2185B` | `#6A1B4D` |
| Red (Sahai Line) | `#DC143C` | `#8B0000` |
| Green (Kisaan Saathi) | `#2D6A2E` | `#1F4D21` |
| Orange (Udupi) | `#B34E0E` | `#8B3A1A` |
| Golden (Sahayika) | `#9A6B00` | `#5C4000` |
| White (Parivar Saathi) | `#475569` | `#1E293B` |
| Blue | `#0B63CE` | `#0A3D8F` |

White Dots has no strong colour of its own, so it uses slate.

## Check
- `python3 scripts/ui_check.py bot <folder> --ekstep` checks for the logo and the gradient bar.
- On a screenshot, the logo must be crisp, never stretched, and the same height on every bot.
