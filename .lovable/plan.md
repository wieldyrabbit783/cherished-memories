# MemoryLives — Complete Implementation Plan

## Overview

A digital memorial platform where users create beautiful, permanent memorial pages for loved ones. Built with React + Vite + TypeScript, powered by an external Supabase project for database, auth, and storage.

## Design Direction

**Warm & Soft** — Earth tones (warm beiges, soft browns, muted greens), gentle gradients, serif headings paired with clean sans-serif body text. A comforting, dignified aesthetic that feels respectful and trustworthy. Rounded corners, soft shadows, and generous whitespace throughout.

---

## Phase 1: Foundation & Layout

### Global Layout

- **Top navigation bar** with logo ("MemoryLives"), links to Home, Pricing, About, Contact, Login, Signup. When logged in: Dashboard, Settings, Logout.
- **Footer** on every page with links to About, Contact, Privacy Policy, Terms of Service, Pricing, Login, Signup.
- Fully responsive across desktop, tablet, and mobile.

### Static Pages

- **Homepage** — Hero section with emotional messaging, how-it-works steps, testimonials placeholder, and call-to-action to sign up.
- **About page** — Mission statement, values, and story behind MemoryLives.
- **Pricing page** — Free tier details with teaser for future premium plans.
- **Contact page** — Form with name, email, and message fields (with validation). Submissions stored in Supabase.
- **Privacy Policy** — Full legal content covering data collection, usage, rights, and contact info.
- **Terms of Service** — Acceptable use, account rules, liability, and termination policies.
- **404 page** — Friendly error page with navigation back to home.

---

## Phase 2: Authentication

### Supabase Auth Integration

- **Signup page** — Full name, email, password. Email validation, minimum 8 character password.
- **Login page** — Email and password with error handling.
- **Forgot Password page** — Email input to trigger Supabase password reset.
- **Session management** — Persistent login state, protected routes for dashboard and memorial management.
- **Profiles table** — Auto-created on signup via database trigger, storing user's full name.

---

## Phase 3: Database & Storage Setup

### Database Tables (Supabase)

- **profiles** — id (FK to auth.users), full_name, created_at
- **memorials** — id, user_id (FK), full_name, birth_date, death_date, location, biography, cover_image_url, video_url, tribute_message, slug (unique), created_at
- **memorial_photos** — id, memorial_id (FK), photo_url
- **contacts** — id, name, email, message, created_at

### Row-Level Security

- Users can only read/update/delete their own memorials and photos.
- Public (anonymous) users can read memorials and memorial photos.
- Profiles: users can only read/update their own profile.

### Storage Buckets

- **memorial-images** — Public bucket for cover images and gallery photos. RLS policies so only the memorial owner can upload/delete, but anyone can view.

---

## Phase 4: User Dashboard

- Welcome message with user's name.
- List of user's memorials displayed as cards (cover image, name, dates).
- Buttons: Create New Memorial, Edit, Delete, View (public link).
- Empty state with encouraging message and create button when no memorials exist.

---

## Phase 5: Memorial CRUD

### Create Memorial Page

- Form with required fields: full name, birth date, death date, location, biography, cover image upload.
- Optional fields: additional photos, video URL, custom tribute message.
- Auto-generates a URL-friendly slug from the full name.
- Uploads images to Supabase Storage.

### Edit Memorial Page

- Pre-filled form with existing data.
- Ability to update all fields, replace/add/remove photos.

### Delete Memorial

- Confirmation dialog before deletion.
- Removes memorial, associated photos from database and storage.

---

## Phase 6: Public Memorial Page

- Accessible at `/memorial/:slug` without login.
- Displays: cover image (hero), full name, birth and death dates, location, biography, photo gallery, video embed (if provided), tribute message.
- Beautiful, respectful layout with the warm & soft design.
- Clean, shareable URL.

---

## Phase 7: Account Settings

- View and update profile name.
- Change password functionality.
- Account overview (email, member since).

---

## Phase 8: Polish & Production Readiness

- SEO: Page titles and meta descriptions on all pages.
- Form validation with clear error messages throughout.
- Loading states and skeleton screens.
- Image optimization (compression before upload).
- Mobile-responsive testing across all pages.
- Google Analytics preparation (placeholder for tracking ID).
- Please add production launch essentials: email verification before creating memorials, memorial privacy toggle (public/private with share link), report-abuse feature, basic admin tools to review/hide reported content, rich link previews for memorial pages, unique memorial URL handling, upload limits and validation, soft-delete/recovery, contact form anti-spam protection, terms/privacy acceptance checkbox at signup, sitemap/robots/canonical SEO basics, and global error + loading states.
  &nbsp;