# Supabase + Vercel Setup

## 1) Create Supabase table and policies

1. Open your Supabase project.
2. Go to SQL Editor.
3. Run [`supabase/schema.sql`](./supabase/schema.sql).

## 2) Create admin user

1. In Supabase, open Authentication -> Users.
2. Create a user with email + password.
3. Use these credentials on `/ribal`.

## 3) Add environment variables

Use the values from Supabase Project Settings -> API.

Local (`.env`):

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Vercel:

1. Project Settings -> Environment Variables.
2. Add `VITE_SUPABASE_URL`.
3. Add `VITE_SUPABASE_ANON_KEY`.
4. Redeploy.

## 4) Open Admin and seed content

1. Visit `/ribal`.
2. Sign in.
3. Click `Import Defaults` once to move current portfolio content into Supabase.
4. Edit/add/delete entries and save.

## Notes

- Public website reads content without login.
- Admin writes require authenticated Supabase user (RLS protected).
- If Supabase env vars are missing, the website still works with local fallback content.
- `vercel.json` rewrite is included so `/ribal` works on Vercel free plan.
