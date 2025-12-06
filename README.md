# PlanStack - Vercel Deployment Guide

## Quick Start (5 minutes)

### Option A: Deploy from this folder directly

1. **Download this folder** to your computer

2. **Open terminal** in this folder and run:
   ```bash
   npm install
   npm run dev
   ```

3. **Open browser** to http://localhost:3000

4. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial PlanStack commit"
   ```
   
   Then create a new repo on GitHub and:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/planstack.git
   git push -u origin main
   ```

5. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repo
   - Click "Deploy"
   - Done! You'll get a URL like `planstack-xyz.vercel.app`

---

### Option B: Start fresh with create-next-app

1. **Create project:**
   ```bash
   npx create-next-app@latest planstack
   # Select: Yes to Tailwind, Yes to App Router, No to src/ directory
   cd planstack
   ```

2. **Create the hybrid structure:**
   ```bash
   # Create landing page in Pages Router
   mkdir pages
   # Copy pages/index.js from this repo
   
   # Create main app in nested App Router structure  
   mkdir app/app
   # Copy app/app/page.js from this repo
   # Copy app/layout.js and app/globals.css from this repo
   ```

3. **Run locally:**
   ```bash
   npm run dev
   ```
   - Landing page will be at http://localhost:3000/
   - Main application will be at http://localhost:3000/app

4. **Deploy:** Push to GitHub, import to Vercel

---

## Project Structure

```
planstack/
├── pages/
│   └── index.js           ← Landing page (Pages Router)
├── app/
│   ├── layout.js          ← App Router HTML wrapper
│   ├── globals.css        ← Tailwind imports
│   └── app/
│       └── page.js        ← Main PlanStack application at /app
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── vercel.json            ← Empty for auto-detection
```

**Note**: This project uses a hybrid routing approach with both Next.js Pages Router (for the landing page at `/`) and App Router (for the main application at `/app`).

---

## What's Working

✅ Project dashboard  
✅ Sheet management  
✅ Interactive takeoff canvas  
✅ Manual room drawing  
✅ Room type assignment  
✅ Fixture placement  
✅ Live quantity calculations  
✅ Templates view  
✅ Export view  

## What's Next (Not Yet Built)

❌ Real PDF upload & viewing  
❌ Database persistence (Supabase)  
❌ User authentication  
❌ AI fixture detection  
❌ Real Excel export  

---

## Adding Supabase (Next Step)

1. Create account at [supabase.com](https://supabase.com)

2. Install:
   ```bash
   npm install @supabase/supabase-js
   ```

3. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Create tables in Supabase SQL editor:
   ```sql
   create table projects (
     id uuid default gen_random_uuid() primary key,
     name text not null,
     status text default 'new',
     created_at timestamp default now()
   );

   create table sheets (
     id uuid default gen_random_uuid() primary key,
     project_id uuid references projects(id),
     name text,
     title text,
     pdf_url text,
     created_at timestamp default now()
   );

   create table rooms (
     id uuid default gen_random_uuid() primary key,
     sheet_id uuid references sheets(id),
     template_id text,
     points jsonb,
     area_sqft float
   );
   ```

---

## Need Help?

- Next.js docs: https://nextjs.org/docs
- Vercel docs: https://vercel.com/docs
- Tailwind docs: https://tailwindcss.com/docs
- Supabase docs: https://supabase.com/docs
