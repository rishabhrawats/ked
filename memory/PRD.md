# KED (Kutch Entrepreneur Divas) - Product Requirements Document

## Original Problem Statement
Build the first frontend showcase version of Kutch Entrepreneur Divas (KED) - India's first structured income platform for women entrepreneurs. A women-first income, commerce, visibility, and growth platform designed for women-led businesses.

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion + Shadcn UI components
- **Design System**: Cormorant Garamond (serif headings) + Outfit (sans-serif body), soft rose/beige/ivory palette
- **Backend**: FastAPI (minimal, not used in current version)
- **Database**: MongoDB (not used in current frontend-only version)

## User Personas
1. **Women Product Sellers** - Handmade products, clothing, food, crafts
2. **Women Service Providers** - Consultants, trainers, coaches, wellness
3. **Buyers** - Trusted discovery and purchase from women-led businesses
4. **Community Members** - Learning, visibility, collaboration

## Core Requirements (Static)
- Premium feminine design (dusty rose, blush, beige, warm ivory)
- Trust-led commerce with verification badges
- Income growth focused (not just networking)
- Simple digital selling experience
- Women-first ecosystem
- Local-to-national discoverability

## What's Been Implemented (Feb 2026)
### Pages (12 total):
1. **Homepage** - Hero, trust strip, daily highlights, featured businesses, products, services, spotlight, how it works, why KED, workshops, testimonials
2. **Marketplace** - Product grid with search, category filters, verified badges
3. **Services** - Service cards with type filters (Workshop, Course, Consultation, etc.)
4. **Entrepreneur Profile** - Full profile with story, products, services, trust badges
5. **Product Detail** - Images, pricing, trust indicators, related products
6. **Service Detail** - Session details, available slots, booking UI, provider info
7. **Community/Learning** - Workshops, learning paths, events, mentorship CTA
8. **Spotlight/Stories** - Featured stories, rising stars, editorial layout
9. **Bulk Orders** - B2B categories, MOQ/lead time, inquiry form
10. **Seller Onboarding** - 4-step guided flow (Business Type → Info → Profile → Complete)
11. **About KED** - Vision, values, impact numbers, roots in Kutch
12. **Auth** - Mock login/signup with Google option

### Shared Components:
- Glass morphism header with navigation
- Footer with CTA section
- Mobile bottom navigation
- Page transition animations (framer-motion)
- Product/Service/Founder cards
- Trust badges system
- Section heading component
- Language toggle (English/Hindi/Gujarati)

### Mock Data:
- 8 founders with detailed profiles
- 8 products across categories
- 6 services
- 4 spotlight stories
- 4 workshops
- 5 bulk order categories
- Testimonials, trust stats, how-it-works

## Prioritized Backlog

### P0 (Next Sprint)
- Backend API integration (products CRUD, services CRUD, user auth)
- Real authentication with JWT
- Database models for products, services, users, orders
- Search functionality with backend

### P1
- Shopping cart and checkout flow
- Order management for sellers
- Real image upload for products/services
- WhatsApp integration for inquiries
- Payment gateway (Razorpay/Stripe)

### P2
- Regional language translation (actual i18n)
- Push notifications
- Seller analytics dashboard
- Review and rating system
- Wishlist/saved items persistence
- Admin panel for KED team

## Next Tasks
1. Set up backend models and CRUD APIs
2. Implement real authentication
3. Connect frontend to backend APIs
4. Add image upload capability
5. Build checkout and payment flow
