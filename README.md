# T&D BookVerse

**Read. Review. Discover.**

A polished, animated, full-stack book review platform. Browse books, read
honest reviews, add your own, edit them, or delete them — all backed by a
real REST API and a PostgreSQL database.

---

## 1. Project overview

T&D BookVerse is a two-app monorepo:

- **`apps/web`** — a React + TypeScript + Tailwind CSS + Framer Motion
  single-page app: browsing, search/filter/sort, book details, and the full
  review lifecycle (add / edit / delete with confirmation).
- **`apps/api`** — an Express + TypeScript + Prisma REST API backed by
  PostgreSQL, with validation, rate limiting, and structured error handling.

Ratings are never stored directly — `averageRating` and `reviewCount` are
always computed live from a book's reviews, so they can never drift out of
sync.

---

## 2. Features

- Animated, responsive landing page with a hand-built floating-book hero
- Book catalog with live search, genre/author/rating filters, and sorting
  (Newest, Highest Rated, Most Reviewed, A–Z)
- Book detail page with computed star ratings and a full review list
- Add Book form with validation and a live cover-image preview
- Add / Edit Review forms with an interactive 1–5 star picker
- Delete-review confirmation modal, with an exit animation on removal
- Toast notifications for every success/error path
- Skeleton loaders, empty states, and a friendly 404 page
- Full dark / light mode with persisted preference
- Mobile, tablet, and desktop responsive layouts
- Rate-limited, validated, sanitized REST API with cascading deletes so
  reviews are never orphaned

---

## 3. Tech stack

| Layer      | Tech                                                        |
|------------|--------------------------------------------------------------|
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, React Router, Axios, Lucide React |
| Backend    | Node.js, Express, TypeScript, Zod, Helmet, express-rate-limit |
| Database   | PostgreSQL 16                                                |
| ORM        | Prisma                                                       |
| Infra      | Docker, docker-compose, Nginx (static hosting for the web build) |

---

## 4. Architecture

```
Browser  ─────►  apps/web (Vite/React, port 5173)
                        │  fetch / axios
                        ▼
                 apps/api (Express, port 4000)  ──►  PostgreSQL (port 5432)
                        │
                 Prisma ORM (schema.prisma)
```

`Book 1 ---- N Review`, with `onDelete: Cascade` on the `Review.book`
relation — deleting a book removes its reviews in the same transaction so
no orphan reviews can ever exist.

---

## 5. Folder structure

```
td-bookverse/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/   BookCard, ReviewCard, RatingStars, Navbar, Modal, Toast, ...
│   │   │   ├── pages/        Home, Books, BookDetails, AddBook, AddReview, EditReview, About, NotFound
│   │   │   ├── services/     api.ts (Axios client + typed API calls)
│   │   │   ├── hooks/        useTheme, useToast, useDebounce
│   │   │   └── types/        shared TS interfaces
│   │   ├── public/
│   │   └── package.json
│   │
│   └── api/
│       ├── src/
│       │   ├── routes/       books.ts, reviews.ts
│       │   ├── middleware/   errorHandler.ts (asyncHandler, Prisma/Zod error mapping)
│       │   ├── lib/          prisma.ts (singleton client)
│       │   └── utils/        ApiError, ratings.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── seed.ts
│       │   └── migrations/
│       └── package.json
│
├── docker-compose.yml
├── .env.example
├── package.json      (npm workspaces root)
└── README.md
```

---

## 6. Environment setup

Requires **Node.js 20+**, **npm 10+**, and either a local **PostgreSQL 16**
instance or Docker.

```bash
git clone <this-repo>
cd td-bookverse
npm install                 # installs both workspaces

cp .env.example .env
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Edit `apps/api/.env` if your local Postgres credentials differ from the
defaults in `.env.example`.

---

## 7. Database setup

**Option A — Docker (recommended, no local Postgres install needed):**

```bash
docker compose up -d postgres
```

**Option B — local PostgreSQL:** create a database matching `DATABASE_URL`
in `apps/api/.env` (defaults to `bookverse` / `bookverse` / `bookverse_password`).

---

## 8. Migration commands

```bash
# Apply the committed migration (creates books & reviews tables)
npm run db:migrate --workspace=apps/api -- deploy
# equivalent shorthand from the repo root:
npm run db:migrate:deploy -w apps/api

# Or, while iterating on schema.prisma locally:
npm run db:migrate -w apps/api      # prisma migrate dev
```

---

## 9. Seed commands

```bash
npm run db:seed -w apps/api
```

Seeds 10 books (The Alchemist, Atomic Habits, 1984, The Hobbit, Harry
Potter and the Philosopher's Stone, The Psychology of Money, Ikigai, The
Great Gatsby, Pride and Prejudice, Dune) with 3–4 realistic reviews each.
The seed script clears existing reviews/books first, so it's safe to re-run.

---

## 10. Development commands

```bash
# From the repo root — runs API (4000) and web (5173) together
npm run dev

# Or individually
npm run dev:api
npm run dev:web
```

Visit **http://localhost:5173**. The API is available at
**http://localhost:4000/api** (health check: `GET /api/health`).

---

## 11. Production build commands

```bash
npm run build          # builds apps/api then apps/web
npm run build:api -w apps/api
npm run build:web -w apps/web

# Run the built API
node apps/api/dist/index.js

# Preview the built web app locally
npm run preview -w apps/web
```

---

## 12. API documentation

Base URL: `http://localhost:4000/api`

### Books

| Method | Path                    | Description                                   |
|--------|-------------------------|------------------------------------------------|
| GET    | `/books`                | List books. Query: `search`, `genre`, `author`, `minRating`, `sort` (`newest`\|`rating`\|`reviews`\|`az`) |
| GET    | `/books/:id`            | Single book with its reviews                    |
| POST   | `/books`                | Create a book                                   |
| PUT    | `/books/:id`            | Update a book                                   |
| DELETE | `/books/:id`            | Delete a book (cascades to its reviews)         |

`POST /books` body:
```json
{
  "title": "The Midnight Library",
  "author": "Matt Haig",
  "genre": "Fiction",
  "publicationYear": 2020,
  "coverUrl": "https://example.com/cover.jpg",
  "description": "A library between life and death..."
}
```

### Reviews

| Method | Path                              | Description            |
|--------|------------------------------------|--------------------------|
| GET    | `/books/:bookId/reviews`          | List reviews for a book |
| POST   | `/books/:bookId/reviews`          | Add a review to a book  |
| PUT    | `/reviews/:id`                     | Update a review         |
| DELETE | `/reviews/:id`                     | Delete a review         |

`POST /books/:bookId/reviews` body:
```json
{
  "reviewerName": "Jordan Lee",
  "title": "Loved it",
  "rating": 5,
  "content": "Couldn't put it down."
}
```

### Error format

```json
{ "error": "Human-readable message", "details": { "field": ["reason"] } }
```

Standard status codes: `200` / `201` success, `204` on delete, `400`
validation errors, `404` not found, `409` conflict, `429` rate-limited,
`500` unexpected server error.

---

## 13. Screenshots

_placeholder — add screenshots of the Home, Books, Book Details, and
Review flows here once deployed._

---

## 14. Docker

```bash
# Build and run Postgres + API + web together
docker compose up --build

# Web:  http://localhost:5173
# API:  http://localhost:4000/api
# DB:   postgres://bookverse:bookverse_password@localhost:5432/bookverse
```

The `api` service automatically runs `prisma migrate deploy` before
starting. Seed manually once the stack is up:

```bash
docker compose exec api npx tsx prisma/seed.ts
```

---

## 15. Testing checklist

Use this checklist against your own environment (this project was
generated in a sandboxed environment without network/database access, so
the steps below have not been executed against a live Postgres instance —
run through them once you have Docker or Postgres available):

- [ ] `npm install` completes for both workspaces
- [ ] `docker compose up -d postgres` (or a local Postgres) starts cleanly
- [ ] `npm run db:migrate:deploy -w apps/api` applies the migration
- [ ] `npm run db:seed -w apps/api` seeds 10 books + reviews
- [ ] `npm run dev` starts both API and web without errors
- [ ] Books load on `/books`; search and filters narrow the list
- [ ] Book details page loads reviews and computed rating
- [ ] Add Book creates a book and redirects to its detail page
- [ ] Add Review creates a review and appears immediately
- [ ] Edit Review preloads existing values and updates in place
- [ ] Delete Review shows a confirmation modal before removing
- [ ] Average rating / review count update after add/edit/delete
- [ ] Dark mode toggle persists across reloads
- [ ] Layout works at mobile, tablet, and desktop widths
- [ ] Invalid API responses surface a toast, not a blank screen
- [ ] An unknown route renders the 404 page
- [ ] `npm run build` produces a clean production build for both apps

---

## 16. Future improvements

- Authentication so reviews are tied to real user accounts
- Pagination / infinite scroll for large catalogs
- Image upload for book covers instead of URL-only input
- Server-side full-text search (e.g. Postgres `tsvector`)
- Automated test suite (Vitest + Supertest) and CI pipeline

---

Built as **T&D BookVerse** — *Read. Review. Discover.*


## BookVerse UI update

This version uses a light dreamy pink/lavender visual system with animated ambient background, cursor glitter, motion-enhanced cards and an expandable comment thread under every review. Review comments are stored in PostgreSQL through a Prisma migration.

### Docker

```bash
docker compose up --build
```

The web app is available at `http://localhost:5173`, the API at `http://localhost:4000/api`, and PostgreSQL is exposed on host port `5433` by default. The API still connects to PostgreSQL internally at `postgres:5432`.
