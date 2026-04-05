# Design System Strategy: The Luminous Sanctuary

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Luminous Sanctuary."** This philosophy treats the smart home dashboard not as a utility grid, but as a living, atmospheric environment. We move beyond the "template" look by rejecting rigid line-work in favor of glowing objects floating in a void. 

The aesthetic is anchored in **Sophisticated Noir**—utilizing a deep charcoal base where depth is defined by light and translucency rather than borders. We challenge traditional layouts by using intentional asymmetry and varying card sizes to mirror the organic way humans interact with their homes. High-contrast typography scales create an editorial feel, ensuring that vital information (like temperature or status) feels like a headline, not just a data point.

## 2. Colors
Our palette is high-contrast and purposeful, designed to guide the eye through "glow-states."

### Color Roles
- **Primary (`#fdd34d`):** Reserved for "Active Light" states. It should feel like a warm, incandescent glow.
- **Secondary (`#f5d1fb`):** Used for "Atmospheric Actions"—mood lighting, secondary scene toggles, and soft UI highlights.
- **Tertiary (`#ebffe7`):** Indicative of "Eco/Status"—battery levels, air quality, or connectivity.
- **Neutral/Surface (`#0e0e0e`):** The foundation. It creates the "void" that allows colors to pop.

### The Rules of Engagement
- **The "No-Line" Rule:** 1px solid borders are strictly prohibited for sectioning. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit on a `surface` background to create a "soft-edge" transition.
- **Surface Hierarchy & Nesting:** Use surface tiers (`lowest` to `highest`) to create nested depth. An interactive slider should use `surface-container-highest` to sit "above" a card using `surface-container-low`.
- **The "Glass & Gradient" Rule:** To achieve a premium feel, floating elements (like pop-over controls) should use Glassmorphism. Utilize `surface-variant` with a `0.6` opacity and a `20px` backdrop-blur. 
- **Signature Textures:** For main CTA buttons or active hero states, use a subtle linear gradient from `primary` to `primary_container`. This adds a "physicality" and visual soul that flat hex codes cannot replicate.

## 3. Typography
We utilize a dual-font approach to balance human-centric warmth with high-tech precision.

- **Editorial Headings (Manrope):** All `display`, `headline`, and `title` levels use Manrope. Its geometric yet friendly curves allow large numbers (e.g., `display-lg` for temperature) to feel like intentional design elements.
- **Technical Labels (Plus Jakarta Sans):** All `label-md` and `label-sm` levels use Plus Jakarta Sans. This font’s high x-height ensures maximum legibility at tiny scales, perfect for device names or micro-status updates.
- **Hierarchy as Identity:** Use extreme scale differences. A `display-lg` temperature (3.5rem) next to a `label-md` room name (0.75rem) creates a sophisticated, editorial contrast that feels premium.

## 4. Elevation & Depth
Depth in this system is an "Atmospheric Stack." We avoid the "stuck-on" look of traditional Material Design.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift without the "heaviness" of a shadow.
- **Ambient Shadows:** For floating modals, use a "glow-shadow." The shadow should be tinted with `on-surface` at 5% opacity, with a massive `48px` blur and `0` spread. It should feel like a soft occlusion of light, not a drop shadow.
- **The "Ghost Border" Fallback:** If a container requires more definition (e.g., over a complex background), use the `outline-variant` at 15% opacity. High-contrast, 100% opaque borders are forbidden.
- **Glassmorphism:** Use `surface_container_highest` with `80%` opacity and `blur(12px)` for navigation bars to allow the "glow" of active light cards to bleed through as the user scrolls.

## 5. Components

### Cards & Control Blocks
- **The Rule:** Forbid divider lines. Use `1.5rem` (`xl`) vertical white space to separate content.
- **Active State:** When a light is "on," the card background transitions from `surface-container-low` to the solid `primary` (`#fdd34d`). The text color shifts to `on-primary` (`#5c4900`).

### Buttons
- **Primary:** High-pill shape (`full` roundedness), using the `primary` to `primary_container` gradient. 
- **Secondary:** Glassmorphic background with a `secondary` text color. No background fill unless hovered.

### Sliders (Dimmer Controls)
- Inspired by the reference image: The track should be a dark `surface-container-highest`. The "filled" portion should be a vibrant gradient of `primary`. The "thumb" should be a high-contrast `surface-container-lowest` circle to provide a clear tactile target.

### Chips (Scene Selectors)
- Use `md` (0.75rem) rounded corners. Active chips should use `secondary_container` with `on_secondary_container` text to distinguish them from "On/Off" light states.

### Custom Component: "The Aura Header"
- A large `display-md` value (e.g., "21.5°") sitting above a custom SVG sparkline representing 24-hour trends. The sparkline should use the `primary` color with a soft glow filter (`drop-shadow(0 0 8px #fdd34d)`).

## 6. Do's and Don'ts

### Do:
- **Use "Breathing Room":** Leverage the `spacing-12` (3rem) and `spacing-16` (4rem) tokens for external margins.
- **Embrace Asymmetry:** It is okay for a "Living Room" card to be double the width of a "Kitchen" card if it houses more complex data.
- **Color with Intent:** Only use `primary` for light; use `secondary` for environment moods (music, scenes); use `tertiary` for health/green status.

### Don't:
- **Don't use pure White (#FFFFFF) for text:** Use `on_surface_variant` (#adaaaa) for secondary labels to maintain the "dark room" ambiance. Reserve pure white for high-priority headlines.
- **Don't use hard shadows:** If a shadow is visible as a "line," it is too dark. It should be felt, not seen.
- **Don't use standard grids:** Avoid making every card the same height. Let the content dictate the container size.