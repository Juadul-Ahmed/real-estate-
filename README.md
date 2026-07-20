# EstateHub — Real Estate Platform

A full-stack real estate web application with role-based access for **buyers**, **brokers**, and **admins**. Browse listings, manage properties, send inquiries, and track analytics — all in one place.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38bdf8)
![Express](https://img.shields.io/badge/Express-4-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green)

---
[Live URL](https://real-estate-pi-livid-80.vercel.app)

## Features

### Buyer
- Browse approved listings with search & filters
- Save favorite properties
- Send inquiries to brokers
- Track inquiry history

### Broker
- Dashboard with listing & inquiry stats
- Create, edit, and delete property listings
- Manage inquiries and messages
- Edit public profile (name, phone, bio)

### Admin
- Manage users (buyers & brokers)
- Approve or reject broker accounts
- Review and approve/reject property listings
- Moderate content (delete listings/users)
- View site analytics dashboard

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Express.js, TypeScript |
| Database | MongoDB (Mongoose) |
| Auth | JWT (email/password), role-based guards |
| Validation | Zod (API), React (client) |

---

## Project Structure

```
real-estate/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home / landing page
│   │   ├── listings/             # Browse & search listings
│   │   ├── listings/[id]/        # Listing detail
│   │   ├── login/                # Sign in
│   │   ├── register/             # Sign up
│   │   ├── buyer/                # Buyer dashboard
│   │   ├── broker/               # Broker dashboard, listings, profile, inquiries
│   │   └── admin/                # Admin console (users, approvals, analytics)
│   ├── components/               # Shared UI components
│   ├── lib/                      # API client, auth context, types, guards
│   └── globals.css               # Tailwind + theme + animations
├── server/
│   ├── src/
│   │   ├── index.ts              # Express entry point
│   │   ├── models/               # Mongoose models (User, Property, Inquiry, Message)
│   │   ├── routes/               # Auth, properties, inquiries, admin routes
│   │   ├── controllers/          # Request handlers
│   │   ├── middleware/           # Auth, role guards, validation
│   │   └── validators/           # Zod schemas
│   ├── .env.example
│   └── package.json
├── .env.example
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas)
- npm or pnpm

### 1. Clone the repository

```bash
git clone https://github.com/Juadul-Ahmed/real-estate-.git
cd real-estate
```

### 2. Install dependencies

```bash
npm install
npm run server:install
```

### 3. Configure environment variables

Create `.env` in the root:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Create `server/.env`:
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 4. Seed the database (optional)

```bash
npm run server:seed
```



### 5. Run the development servers

In one terminal:
```bash
npm run server:dev
```

In another terminal:
```bash
npm run dev
```

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js frontend dev server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint |
| `npm run server:dev` | Start Express backend with ts-node-dev |
| `npm run server:seed` | Seed database with sample data |
| `npm run server:build` | Compile backend TypeScript |
| `npm run server:start` | Start compiled backend |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login, returns JWT
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/profile` — Update profile

### Properties
- `GET /api/properties` — List properties (with filters)
- `GET /api/properties/:id` — Get single property
- `POST /api/properties` — Create listing (broker)
- `PUT /api/properties/:id` — Update listing (broker/admin)
- `DELETE /api/properties/:id` — Delete listing

### Inquiries
- `POST /api/inquiries` — Create inquiry
- `GET /api/inquiries` — List inquiries
- `POST /api/inquiries/:id/messages` — Send message

### Admin
- `GET /api/admin/analytics` — Site analytics
- `GET /api/admin/users` — List users
- `PUT /api/admin/users/:id` — Update user
- `DELETE /api/admin/users/:id` — Delete user
- `GET /api/admin/properties/pending` — Pending listings
- `PUT /api/admin/properties/:id/status` — Approve/reject listing
- `DELETE /api/admin/properties/:id` — Delete any listing

---

## Role-Based Access

| Role | Access |
|------|--------|
| **Buyer** | Browse listings, save favorites, send inquiries |
| **Broker** | Buyer features + manage listings, inquiries, profile |
| **Admin** | Full access — user management, approvals, moderation, analytics |

---

## Design Decisions

- **Separate backend**: Express + TypeScript runs independently on port 4000, making the API reusable for mobile or other clients.
- **JWT auth**: Role is embedded in the token; both frontend and backend enforce access control.
- **Broker approval flow**: Brokers register with `brokerApproved=false`; admins must approve before listings go live.
- **Tailwind v4**: Uses CSS-based theme tokens for consistent colors, fonts, and spacing.
- **Next.js 16**: Built with the latest App Router conventions.

---

