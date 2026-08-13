# AirClone — Airbnb-Inspired Full-Stack Booking Platform

> **Scaler AI Assignment — Full-Stack Engineering Submission**

AirClone is a full-stack accommodation booking platform built as part of a **Scaler AI assignment**. It recreates the core Airbnb-style discovery and booking experience with a polished Next.js frontend and a FastAPI backend.

Live On : https://air-clone-eta.vercel.app/

The focus was not only on reproducing the UI, but on creating a realistic product flow where a reviewer can **discover a property, open its listing, authenticate, and test the booking journey**.

---

## ✨ What I Built

### Airbnb-inspired marketplace homepage

The landing page follows the interaction patterns and visual language of the Airbnb web experience:

- Airbnb-inspired header and navigation
- All / Homes / Experiences / Services categories
- Large interactive search bar
- Destination, date and guest search controls
- Language & region modal
- Profile and menu controls
- Popular / Arts & culture / Mountains / Beach / Amazing views categories
- Multiple horizontal recommendation rows
- Responsive property cards
- Favourite/heart interactions
- Guest-favourite badges
- Professional spacing, typography, borders, shadows and rounded UI
- Airbnb-inspired footer

Additional marketplace content is **mocked** so the homepage can demonstrate a realistic multi-listing platform even without a production-scale dataset.

---

## 🏠 Homes & Property Discovery

The homepage contains multiple mocked property sections representing different destinations and recommendations.

Every property card can display:

- Property image
- Property title
- Location
- Rating
- Bedrooms / guests
- Price
- Favourite button
- Guest-favourite badge
- Clickable interaction

### The cards are functional

A property is not just a static card.

The main flow is:

```text
Homepage
   ↓
Property Card
   ↓
/listing/[id]
   ↓
Listing Details
   ↓
Booking
   ↓
/booking/[id]
```

This allows the evaluator to start testing the actual booking implementation directly from the landing page.

---

# 📅 End-to-End Booking Flow

The booking journey is the main functional part of the application.

A reviewer can:

1. Open the homepage
2. Browse properties
3. Select a property
4. View listing details
5. Continue into the booking flow
6. Authenticate where required
7. Complete the reservation flow
8. Access booking information

Relevant routes include:

```text
/listing/[id]
/booking/[id]
/bookings
```

The same listing/booking implementation is reused from marketplace discovery surfaces so the reviewer does not need to find a special hidden page to test booking.

---

# 🔐 Authentication

The project includes an authentication flow with:

- Login UI
- Authentication state management
- JWT-based backend authentication support
- Google OAuth support
- User-oriented protected flows

Frontend authentication code is organized under:

```text
frontend/src/components/auth/
frontend/src/lib/api/auth.ts
frontend/src/lib/hooks/useAuth.ts
frontend/src/lib/stores/auth-store.ts
```

---

# ❤️ Wishlist / Favourites

Property cards include favourite interactions and the project contains:

```text
/wishlists
```

along with backend wishlist APIs.

This keeps the marketplace experience interactive instead of making the cards purely visual.

---

# 👤 Profile

A dedicated profile experience is included:

```text
/profile
```

Authentication state is separated from UI components so account functionality can be extended independently.

---

# 🏡 Hosting Flow

The project also includes a host onboarding experience:

```text
/become-a-host
/become-a-host/about-your-place
```

This demonstrates both sides of the marketplace:

```text
Guest → Discover → Book

Host → Create / manage listing
```

---

# 🌎 Experiences & Services

The Airbnb-inspired interface also includes:

- **Experiences**
- **Services**

These sections contain **mocked/demo marketplace content** because the primary assignment focus is the accommodation booking flow.

However, the cards remain clickable and can route into the existing listing/booking experience.

This keeps the interaction model consistent:

```text
Homes
   ↓
Clickable
   ↓
Existing listing / booking flow

Experiences
   ↓
Clickable
   ↓
Existing listing / booking flow

Services
   ↓
Clickable
   ↓
Existing listing / booking flow
```

The objective is to let an evaluator test the implemented booking functionality from different discovery surfaces without duplicating booking business logic.

---

# 🎨 UI / UX

The UI was developed with a strong focus on professional marketplace presentation:

- Airbnb-inspired typography
- Airbnb Cereal font assets
- Consistent spacing
- Large rounded search controls
- Responsive card layouts
- Horizontal carousels
- Subtle borders and shadows
- Hover/click interactions
- Modal-based controls
- Responsive design
- Reusable UI components

The goal was to make the application feel like a real product rather than a collection of assignment pages.

---

# 🧩 Frontend Architecture

Built with:

- **Next.js**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui-style components**
- Custom reusable React components

Important structure:

```text
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── listing/
│   │   ├── booking/
│   │   ├── bookings/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── wishlists/
│   │   └── become-a-host/
│   │
│   ├── components/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── shared/
│   │   └── ui/
│   │
│   ├── data/
│   │   └── mock-properties.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   ├── hooks/
│   │   ├── stores/
│   │   └── utils.ts
│   │
│   └── types/
│
├── public/
│   ├── fonts/
│   └── videos/
└── package.json
```

API calls are separated under `src/lib/api/`, while reusable UI and marketplace components are kept independent from page-level logic.

---

# ⚙️ Backend Architecture

The backend is implemented with **Python and FastAPI**.

```text
backend/
└── app/
    ├── main.py
    ├── routers/
    │   ├── auth.py
    │   ├── listings.py
    │   └── wishlist.py
    │
    └── schemas/
        ├── listing.py
        └── user.py
```

The frontend communicates with the backend through HTTP APIs rather than putting backend business logic inside React components.

```text
Next.js Frontend
       │
       │ HTTP API
       ▼
FastAPI Backend
       │
       ▼
Application / Data Layer
```

---

# 🛠️ Technology Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style components
- Airbnb Cereal fonts

### Backend

- Python
- FastAPI
- Pydantic
- JWT authentication
- OAuth support

### Development

- Git
- GitHub
- VS Code
- REST APIs

---

# 🧪 Functional vs Mocked

A deliberate distinction was made between **core functionality** and **marketplace presentation**.

### Functional

- Homepage navigation
- Property discovery
- Property cards
- Listing detail pages
- Booking flow
- Booking routes
- Authentication flow
- Wishlist/favourites
- Profile
- Host onboarding routes
- Frontend ↔ backend API communication

### Mocked / Demo Content

- Additional properties
- Destination recommendation rows
- Experiences
- Services
- Some secondary marketplace recommendations

The mocked content exists to create a realistic marketplace experience while keeping development focused on the core booking functionality.

---

# 🔄 Reviewer Test Journey

The easiest way to evaluate the project is:

```text
Open AirClone
     ↓
Browse homepage
     ↓
Choose a property
     ↓
Open listing
     ↓
Continue to booking
     ↓
Authenticate if required
     ↓
Complete booking
     ↓
View booking information
```

The same booking implementation can be reached from multiple discovery surfaces.

---

# 📁 Repository Structure

```text
AirClone/
│
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── .gitignore
```

Frontend and backend are intentionally separated so they can be deployed independently.

---

# ☁️ Deployment Architecture

The intended production deployment is:

```text
                 GitHub
                   │
          ┌────────┴────────┐
          ▼                 ▼
       Vercel             Render
          │                 │
       Next.js            FastAPI
       Frontend           Backend API
          │                 │
          └─────── API ─────┘
```

The frontend can consume the deployed backend through an environment variable such as:

```text
NEXT_PUBLIC_API_URL=<deployed-backend-url>
```

---

# 🚀 Running Locally

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

---

# 📌 Current Status

| Area | Status |
|---|---|
| Airbnb-inspired homepage | ✅ |
| Responsive marketplace UI | ✅ |
| Property discovery | ✅ |
| Property cards | ✅ |
| Listing details | ✅ |
| Booking flow | ✅ |
| Authentication | ✅ |
| Wishlist/favourites | ✅ |
| Profile | ✅ |
| Host onboarding | ✅ |
| Experiences UI | ✅ Mocked |
| Services UI | ✅ Mocked |
| Additional marketplace content | ✅ Mocked |
| FastAPI backend | ✅ |
| Frontend/backend separation | ✅ |
| Production deployment | 🚧 |

---

# 🎯 Assignment Objective

This project was built for the **Scaler AI assignment** with emphasis on:

- Full-stack engineering
- UI implementation
- REST API integration
- Authentication
- Booking workflow
- Reusable components
- Responsive design
- Marketplace interactions
- Mock data modelling
- Frontend/backend separation
- Deployable architecture

The implementation intentionally focuses on a **working core product journey** while using mocked marketplace content where a production platform would require a large content dataset.

---

# 💡 Engineering Approach

The project was designed around a simple principle:

> **The UI should look realistic, but the important user journey should actually work.**

Instead of building a static visual clone, the application connects discovery to the implemented listing and booking flow.

This provides a practical evaluation path:

**Discover → Open Listing → Authenticate → Book → Manage Booking**

At the same time, reusable components, API abstractions, centralized state and separated frontend/backend architecture make the project easier to extend.

---

## 👨‍💻 Submission

**Project:** AirClone  
**Assignment:** Scaler AI  
**Repository:** GitHub  
**Frontend:** Next.js / React / TypeScript  
**Backend:** Python / FastAPI  
**Deployment:** Vercel + Render

Built as a full-stack engineering submission with emphasis on **product quality, functional workflows, clean architecture, and a professional user experience**.
