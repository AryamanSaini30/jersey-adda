# Football Jersey Store Backend

Phase 1 backend for a football jersey store built with Node.js, Express, Supabase PostgreSQL, and Cloudinary.

## Folder Structure

```text
server/
  src/
  supabase/
  .env.example
  package.json
client/
```

## Environment Variables

Copy `.env.example` to `.env` and set the values.

- `PORT`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `ADMIN_PASSWORD`

## Database Setup

1. Create a Supabase project.
2. Open the SQL editor or use the Supabase CLI.
3. Run `server/supabase/migrations/001_init.sql`.

## Running Locally

```bash
cd server
npm install
npm run dev
```

## API Endpoints

- `GET /api/jerseys`
- `GET /api/jerseys/:slug`
- `POST /api/admin/jerseys`
- `PUT /api/admin/jerseys/:id`
- `DELETE /api/admin/jerseys/:id`