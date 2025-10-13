# AI Chat Application Setup Guide

This guide will help you set up the AI Chat application with Supabase authentication.

## Prerequisites

- Node.js >= 18
- npm or yarn
- Supabase account
- Google Cloud account (for Google OAuth, optional)
- Twilio account (for SMS, optional)

## 1. Supabase Setup

### Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Enter your project details
4. Wait for the project to be created

### Configure Authentication

1. In your Supabase project, go to **Authentication** → **Settings**
2. Enable the following providers:
   - Email
   - Phone (configure SMS provider if needed)
   - Google (add credentials from Google Cloud Console)

### Configure Redirect URLs

1. In **Authentication** → **Settings** → **Redirect URLs**
2. Add the following URLs:
   - `http://localhost:3000/*`
   - `http://localhost:3000/auth/callback`
   - Your production URLs

### Get API Keys

1. Go to **Settings** → **API**
2. Copy the following:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Project API Key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service Role Key (`SUPABASE_SERVICE_ROLE_KEY`)

## 2. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Select **Web application**
6. Add the following authorized redirect URIs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
7. Copy the Client ID and Client Secret

## 3. Twilio Setup (Optional)

1. Go to [Twilio Console](https://console.twilio.com/)
2. Get your Account SID and Auth Token
3. Get a Twilio phone number
4. In Supabase, go to **Authentication** → **Settings** → **SMS**
5. Enable SMS and configure Twilio as the provider

## 4. Local Development Setup

### Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google OAuth Configuration (if using Google login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Twilio Configuration (if using Twilio for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Install Dependencies

```bash
npm install
```

### Database Setup

1. In your Supabase project, go to **SQL Editor**
2. Run the SQL script from `src/lib/database-schema.sql`
3. This will create the necessary tables and RLS policies

### Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 5. Production Deployment

### Environment Variables

Set the same environment variables in your production environment (Vercel, Netlify, etc.)

### Build and Deploy

```bash
npm run build
npm start
```

## 6. Testing Authentication

1. Visit `http://localhost:3000/auth/signup` to create an account
2. Verify your email address
3. Visit `http://localhost:3000/auth/login` to log in
4. Test Google OAuth and Phone authentication if configured

## 7. Testing Protected Routes

1. After logging in, you should be redirected to `/chat-session`
2. Try accessing `/chat-session` directly when logged out (should redirect to login)
3. Test the logout functionality

## 8. Testing API Routes

1. Visit `http://localhost:3000/api/protected` when logged in (should return user data)
2. Visit `http://localhost:3000/api/protected` when logged out (should return unauthorized error)

## Troubleshooting

### Common Issues

1. **Authentication not working**: Check your Supabase credentials in `.env.local`
2. **Redirect issues**: Verify redirect URLs in Supabase dashboard
3. **Google OAuth not working**: Check Google Cloud credentials and redirect URIs
4. **Phone authentication not working**: Verify Twilio configuration

### Getting Help

- Check the browser console for errors
- Check the Supabase dashboard for authentication logs
- Review the [Security Checklist](SECURITY_CHECKLIST.md)