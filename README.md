# Jersey Adda Site ---> The website is deployed at https://www.jerseyadda.co.in/

This repo now has a split frontend setup:

- `public-app` for the storefront
- `admin-app` for the dashboard
- `server` for the shared backend API
- `client` is the old single-app scaffold and is no longer used by the split setup

## Run locally

Start the backend:

```bash
cd server
npm run dev
```

Start the public storefront:

```bash
cd public-app
npm run dev
```

Start the admin dashboard:

```bash
cd admin-app
npm run dev
```

## Local URLs

- Public storefront: `http://127.0.0.1:5173`
- Admin dashboard: `http://127.0.0.1:5174`
- Backend API: `http://localhost:8000/api`

## Environment files

Copy each `.env.example` file to `.env` in the matching app folder.

- `server/.env`
- `public-app/.env`
- `admin-app/.env`

## Notes

- The admin dashboard uses the same jersey filters as the storefront, plus the editing form.
- The backend is shared, so both apps talk to the same API and database.
- The public site no longer links to the admin app.
- For production, deploy the public app and admin app separately, or map them to different domains/subdomains.
