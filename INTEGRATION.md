### Frontend ↔ Backend Integration Guide

This frontend is wired to the backend at `http://localhost:3000/api` using TanStack Query for data fetching and optimistic updates.

- Backend base URL: set `NEXT_PUBLIC_BACKEND_URL` (default fallback is `http://localhost:3000/api`).
- Listings: fetched from `GET /listings`.
- Favorites: `POST /favorites` adds, `DELETE /favorites?listingId=...` removes.
- Auth: backend expects session cookies/JWT; browser requests include credentials for mutations.

Key implementation details

- `app/providers.tsx`: wraps the app with `QueryClientProvider` and React Query Devtools.
- `app/page.tsx`:
  - Query: loads listings via TanStack Query.
  - Mutations: `addFavorite` and `removeFavorite` perform optimistic updates for instant UI feedback.
  - Styling follows the monochromatic palette (white/gray backgrounds, gray text, gray borders).

Environment

Create `frontend/.env.local` with:

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
```

Run locally

1. Backend: `cd backend && npm run dev` (should serve on port 3001)
2. Frontend: `cd frontend && npm run dev` (serves on port 3000)

Notes

- Listings page uses a minimal card UI with a favorite toggle using optimistic updates for immediate response.
- If you need SSR or prefetching, lift queries to server components or integrate `dehydratedState`. For now, client-side fetching was chosen for speed.


