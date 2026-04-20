# Design System: The Artisanal Autumnal Experience

## 1. Overview & Creative North Star
**Creative North Star: "The Haunted Atelier"**

This design system moves away from the sterile, cookie-cutter aesthetics of standard e-commerce to create a digital space that feels curated, mysterious, and premium. We are not building a simple candy shop; we are designing the digital storefront for an elite, artisanal confectioner.

To achieve this, the system rejects the "flat grid" mentality. We utilize **intentional asymmetry**, where elements may overlap or break traditional container bounds to mimic the organic feel of a hand-poured chocolate or a physical parchment menu. High-contrast typography scales and deep, tonal layering replace the need for structural lines, creating a layout that breathes with "spooky" elegance rather than rigid geometry.

---

## 2. Colors
Our palette balances the deep shadows of midnight with the vibrant, eerie energy of artisanal treats.

*   **Primary (Pumpkin Core):** `primary` (#ffb783) and `primary_container` (#db7619). These are used for moments of high conversion and brand heat.
*   **Secondary (Midnight Atmosphere):** `secondary` (#b5c8df) and `surface_container` (#201f1f). These provide the professional, "charcoal" backdrop that makes the sweets pop.
*   **Tertiary (Eerie Glow):** `tertiary` (#8adb4d). Reserved strictly for success states, accents, and "magical" interactive moments.
*   **Neutral (Parchment & Shadow):** `on_surface` (#e5e2e1) provides the warm off-white needed for elite readability against dark backgrounds.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections. Layout boundaries must be established through color shifts. For example, a `surface_container_low` section should sit directly against a `surface` background. The eye should perceive the change in depth through the shift in hex value, not a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of luxury materials. 
*   **Base:** `surface` (#131313)
*   **Lowered Areas:** `surface_container_lowest` (#0e0e0e) for "sunken" inputs or secondary trays.
*   **Elevated Components:** Use `surface_container_high` (#2a2a2a) to bring artisanal product cards closer to the user.

### Glass & Gradient Rule
Floating elements (modals, dropdowns) should use **Glassmorphism**. Apply `surface_variant` with a 70-80% opacity and a `backdrop-blur` of 12px-20px. For primary CTAs, use a subtle linear gradient from `primary` to `primary_container` to add "soul" and avoid the flat, plastic look of standard buttons.

---

## 3. Typography
The typography strategy pairs historical gravitas with modern precision.

*   **Display & Headlines (Newsreader):** This serif font carries "character"—it is playful yet authoritative. Use `display-lg` for hero headlines to establish the "whimsical high-end" tone. The slight irregularities in the serif evoke the artisanal nature of the brand.
*   **Body & UI (Manrope):** A clean, modern sans-serif that ensures high readability for complex ingredient lists and shipping data. Use `body-lg` for product descriptions and `label-md` for technical metadata.

The contrast between the "ghostly" serif and the "mechanical" sans-serif creates a tension that feels both old-world and high-tech.

---

## 4. Elevation & Depth
Depth is a tool for storytelling, not just organization.

*   **Tonal Layering:** Avoid shadows for static elements. Instead, place a `surface_container_high` card atop a `surface` background to create a "soft lift."
*   **Ambient Shadows:** For interactive "hover" states on product cards, use a tinted shadow: `0px 20px 40px rgba(0, 0, 0, 0.4)`. The shadow should feel like heavy, ambient light hitting a physical object.
*   **The Ghost Border Fallback:** For accessibility in form fields, use a "Ghost Border": `outline_variant` (#594238) at 15% opacity. It should be barely felt, never seen as a hard line.
*   **Signature Texture:** Apply a very low-opacity (2-3%) noise or parchment texture overlay across `surface` levels to break the digital perfection of the hex codes.

---

## 5. Components

### Buttons (The "Confection" Style)
*   **Primary:** Gradient of `primary` to `primary_container`. Corner radius: `md` (0.75rem). Text: `title-sm` in `on_primary_fixed`.
*   **Hover State:** Increase saturation and apply a 4px "glow" using `surface_tint`.
*   **Secondary:** Ghost style. No background, `outline` color for text, and a `Ghost Border`.

### Artisanal Cards
*   **Style:** No borders. Use `surface_container_high`.
*   **Content:** Product images should slightly bleed over the top edge of the card (asymmetric overlap) to break the "boxed-in" feel.
*   **Shadow:** Use the Ambient Shadow on hover only.

### Status Indicators (Order Tracking)
Instead of generic badges, use illustrative "spirit" icons:
*   **Processing:** `primary` (Pumpkin Orange) pulsing icon.
*   **Shipped:** `secondary` (Midnight Blue) with a winged bat motif.
*   **Delivered:** `tertiary` (Eerie Green) with a glowing lantern icon.

### Input Fields
*   **Surface:** `surface_container_lowest`.
*   **Focus:** A subtle `tertiary` (Eerie Green) "Ghost Border" (20% opacity) and the label shifting to `tertiary` color.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical spacing. Allow 80px of top margin and 40px of bottom margin to create a sense of editorial flow.
*   **Do** use the Pumpkin/Bat logo as a watermark in the `surface_container_lowest` of the sidebar or footer.
*   **Do** prioritize white space (or "dark space") over dividers. Let the content breathe.

### Don't
*   **Don't** use pure white (#FFFFFF) or pure black (#000000). Always use the themed neutrals.
*   **Don't** use sharp 0px corners. This brand is "artisanal" and "whimsical," which requires the softness of the `md` and `lg` roundedness scale.
*   **Don't** use standard "Material Design" blue for links. Every interactive element must be tinted by the Autumnal palette.