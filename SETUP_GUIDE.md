# Chat Application Setup Guide

This guide will help you set up the Chat application with Supabase authentication.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- A Supabase account (free tier available)

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd chat-app
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Note down your project URL and API keys from the project settings

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

Replace the placeholder values with your actual Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `NEXT_PUBLIC_APP_URL`: Your application URL (localhost for development)

## Step 5: Set Up Database Tables

### Option 1: Using the Setup Script (Recommended)

Run the database setup script:

```bash
node scripts/setup-database.js
```

This will:
- Create the required database tables
- Set up Row Level Security policies
- Create the initial rooms

### Option 2: Manual Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL editor
3. Run the SQL commands from `src/lib/database-schema.sql`

## Step 6: Configure Authentication

In your Supabase project dashboard:

1. Go to Authentication > Settings
2. Update the Site URL to match your application URL
3. Add your application URL to the Additional Redirect URLs
4. Enable Email Confirmations if desired
5. Configure OAuth providers (Google)

### Google OAuth Configuration

1. Create a Google OAuth app in the Google Cloud Console
2. Add your redirect URLs:
   - `http://localhost:3003/auth/callback` (for development)
   - Your production callback URL
3. Add your Google OAuth credentials to Supabase:
   - Client ID
   - Client Secret

## Step 7: Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3003` to view the application.

## Step 8: Test the Authentication

1. Navigate to the login page
2. Try signing up with a new account
3. Verify your email address
4. Log in with your credentials
5. Test OAuth login with Google

## Troubleshooting

### Common Issues

1. **"Failed to load rooms" error**
   - Check that your Supabase environment variables are correctly set in `.env.local`
   - Verify that you've created the database tables using the SQL script
   - Ensure your Supabase project URL and API keys are correct
   - Check the browser console for detailed error messages

2. **Authentication errors**
   - Verify your Supabase credentials in `.env.local`
   - Check that your redirect URLs are correctly configured in Supabase
   - Ensure you're using HTTPS in production

3. **OAuth issues**
   - Verify your OAuth provider configuration in Supabase
   - Check that your OAuth app credentials are correct
   - Ensure your redirect URLs match exactly

### Environment Variables

Make sure all required environment variables are set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

## Production Deployment

### Environment Variables

For production deployment, update your environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_supabase_service_role_key
NEXT_PUBLIC_APP_URL=your_production_app_url
```

### Build and Deploy

```bash
npm run build
npm start
```

Or deploy using your preferred hosting platform (Vercel, Netlify, etc.).

## Additional Configuration

### Customizing the Application

1. Update branding in `src/app/components/layout/Navbar.tsx`
2. Modify color scheme in `src/app/globals.css`
3. Adjust authentication flows in `src/hooks/useAuth.ts`

### Adding New Features

1. Create new API routes in `src/app/api/`
2. Add new components in `src/app/components/`
3. Extend database schema as needed
4. Update authentication middleware for new protected routes

This setup guide provides everything you need to get the Chat application running with secure authentication.