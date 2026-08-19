# Architectural & Design Decisions: VÉRITÉ ESCAPES

## 1. Assessment Track & Scope Selection
For this submission, **Part 2 (Frontend Homepage Prototype)** was selected. The primary goal of this submission is to demonstrate production-grade frontend engineering, refined editorial UI/UX design, smooth component micro-interactions, responsive layouts across all viewports (390px–1440px+), and clean component state management.

---

## 2. Major UX & Design Decisions

- **Original Brand & Aesthetic**: Designed an original luxury travel identity—**VÉRITÉ ESCAPES** (*"Discover places worth travelling for"*). Uses a deep charcoal base (`#0B0B0E`), warm champagne gold accents (`#E2C08D`), serif editorial typography, and subtle glassmorphism surfaces.
- **Scroll-Responsive Glass Navbar**: Floating header with background backdrop blur that transitions seamlessly on scroll to prevent text collision while keeping global controls (Wishlist, Currency, Filters) accessible.
- **Integrated Discovery Bar**: Embedded hero search interface featuring popovers for destination suggestions (Udaipur, Shimla, Coorg, Goa, Wayanad, Leh), trip horizon date presets, and guest counter controls.
- **Reactive Local Wishlist**: Powered by a lightweight Zustand store with `localStorage` persistence, enabling real-time wishlist toggling, badge counters, and a slide-over wishlist drawer.
- **Storytelling Layout**: Structured into 10 cohesive sections (Hero, Search, Categories, Infinite Editorial Ticker, Property Grid, Magazine Spread, Collections Carousel, Reviews, Newsletter CTA, and Footer) to create a flowing discovery narrative.

---

## 3. Key Technical Trade-Off Under Time Constraints

- **Local State & Client Mocking vs. Live API Backend**:
  *Trade-Off*: Rather than wiring a complex multi-container backend that risks runtime setup failures or network latency during review, all search queries, category filters, wishlist states, and modal previews operate deterministically in frontend state using clean TypeScript data models (`src/data/mock-properties.ts`).
  *Benefit*: Ensures instantaneous UI response times, zero external runtime dependencies, 100% reliable local demo execution (`npm install && npm run dev`), and pure focus on component architecture.

---

## 4. AI Tool Usage Statement

AI tools were used during development for ideation, implementation assistance, debugging, and refinement. I personally reviewed, tested, modified, and verified the resulting implementation.

---

## 5. Verification & Quality Control

The following aspects were manually tested and verified:
- **Build & Compilation**: Clean Next.js 16 build (`npm run build`) with zero TypeScript errors or warnings.
- **Responsive Layout**: Verified across 390px, 430px, 768px, 1024px, and 1440px+ viewports without horizontal overflow.
- **Accessibility & Semantics**: Semantic HTML `<button>` and `<nav>` elements, explicit `aria-label` attributes on icon-only triggers, high contrast dark theme, and visible keyboard focus rings.
