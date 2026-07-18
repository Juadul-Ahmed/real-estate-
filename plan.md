# Real Estate Platform — Implementation Plan

## Overview

A full working real estate web application with **3 roles**:

1. **Renter/Buyer** — browse rent & sale listings, search/filter, save favorites, send inquiries.
2. **Broker** — manage their own listings, view inquiries/messages, broker dashboard, profile.
3. **Admin** — manage users, approve/reject listings, moderate content, site analytics.

### Tech Stack

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4.
- **Backend:** Express.js + TypeScript (separate `/server` folder), REST API.
- **Database:** MongoDB (via Mongoose).
- **Auth:** JWT (email + password), role embedded in token (`buyer` | `broker` | `admin`).
- **Validation:** Zod on API; client-side form validation in React.



### Repo Layout

```
real-estate/
  src/                 # Next.js App Router frontend
    app/
      (public)/        # home, listings, listing/[id]
      buyer/           # dashboard, saved, inquiries
      broker/          # manage listings, dashboard, profile, inquiries
      admin/           # users, approvals, moderation, analytics
      login/ register/
    components/        # shared UI (Navbar, ListingCard, Filters, etc.)
    lib/               # api client, auth context, types
    middleware.ts      # route protection by role (client-side guard)
  server/              # Express + TS API
    src/
      index.ts         # express app entry
      models/          # User, Property, Inquiry, Message
      routes/          # auth, users, properties, inquiries, admin
      middleware/      # auth, roleGuard
      controllers/
      config/          # db connection, env
    tests/
  .env                 # MONGO_URI, JWT_SECRET, PORT, NEXT_PUBLIC_API_URL
```

---



## Phase 1 — Project Setup

- [ ] Install backend deps: `express`, `mongoose`, `jsonwebtoken`, `bcryptjs`, `zod`, `cors`, `dotenv`, `ts-node-dev`, `typescript`, `@types/*`.
- [ ] Create `server/` with `tsconfig.json`, `package.json` scripts (`dev`, `build`, `start`).
- [ ] Configure MongoDB connection (local or Atlas) via `MONGO_URI`.
- [ ] Add CORS + `.env` + `NEXT_PUBLIC_API_URL` so Next talks to Express (default `http://localhost:4000`).
- [ ] Set up Tailwind v4 (already present) and base layout/Navbar.



## Phase 2 — Data Models (Mongoose)

- [ ] **User**: name, email, passwordHash, role, phone, avatar, brokerApproved (bool), createdAt.
- [ ] **Property**: title, type (rent/sale), category (house/apartment/...), price, rentPrice, location {city, address}, bedrooms, bathrooms, area, description, images[], owner (broker ref), status (pending/approved/rejected), createdAt.
- [ ] **Inquiry**: property ref, buyer ref, message, status, createdAt.
- [ ] **Message**: inquiry ref, sender, text, createdAt.



## Phase 3 — Auth & Roles (Express)

- [ ] `POST /api/auth/register` (role = buyer or broker; brokers start `brokerApproved=false`).
- [ ] `POST /api/auth/login` → returns JWT.
- [ ] `GET /api/auth/me` → current user from token.
- [ ] `auth` middleware (verify JWT) + `roleGuard(['admin'])` etc.
- [ ] Frontend: AuthContext, login/register pages, store token in localStorage, axios interceptor.



## Phase 4 — Public + Buyer Features

- [ ] Home page with hero + featured listings.
- [ ] Listings page: fetch rent & sale, with **Search & Filters** (location, price range, type, bedrooms, rent/sale).
- [ ] Listing detail page: gallery, info, "Contact broker" → creates Inquiry.
- [ ] Buyer dashboard: saved/favorites, my inquiries.
- [ ] Save favorites (localStorage or user.favorites array).



## Phase 5 — Broker Features

- [ ] Broker dashboard: stats (active listings, total inquiries, pending approvals).
- [ ] Manage listings: create/edit/delete own properties (status starts `pending`).
- [ ] Inquiries/Messages: view inquiries on their listings, reply via Message.
- [ ] Broker profile: edit name, phone, bio, avatar.



## Phase 6 — Admin Features

- [ ] Manage users: list/create/edit/delete buyers & brokers; toggle `brokerApproved`.
- [ ] Approve listings: review pending properties → approve/reject.
- [ ] Moderate content: delete any listing or user.
- [ ] Site analytics: counts of users, listings, inquiries; simple charts/tables.



## Phase 7 — Polish & Verify

- [ ] Role-based route guards on both frontend (`middleware.ts`/context) and backend.
- [ ] Loading/empty/error states, responsive UI.
- [ ] Seed script (admin + sample broker + sample listings).
- [ ] Run `npm run lint` and `tsc --noEmit`; fix issues.
- [ ] README: how to run frontend + backend.

---



## Key Decisions (from Q&A)

- Backend: **Express + TypeScript + MongoDB**, separate from Next.js.
- Auth: **JWT, email/password**, role in token.
- Listings: **rent + sale**, with **search & filters**.
- Broker: manage listings, dashboard, profile, inquiries/messages.
- Admin: manage users, approve listings, moderate content, analytics.
- Scope: **full working application**.



## Notes / Risks

- Next.js 16 has breaking changes — consult `node_modules/next/dist/docs/` before coding App Router specifics.
- Brokers cannot publish until admin approves (per admin "approve listings" feature; combined with `brokerApproved` for account-level gating).
- Ensure `.env` is gitignored; provide `.env.example`.

