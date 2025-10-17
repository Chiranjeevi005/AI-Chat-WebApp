# Vercel Deployment Guide

This guide provides step-by-step instructions for deploying the Chat App to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. A GitHub account with the repository pushed
3. A Supabase account with a project created

## Deployment Steps

### 1. Push Code to GitHub

Make sure all your code is committed and pushed to a GitHub repository:

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings:
   - Framework Preset: Next.js
   - Root Directory: Leave as is
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. Configure Environment Variables

In the Vercel project settings, add the following environment variables:

| Variable Name | Description | Example Value |
|---------------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | Get from Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | Get from Supabase dashboard |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL | `https://your-app.vercel.app` |

### 4. Set Up Supabase Database

Before deploying, you need to set up your Supabase database:

1. Run the database setup script locally:
   ```bash
   node scripts/setup-database.js
   ```

2. Seed the initial rooms:
   ```bash
   npm run seed
   ```

3. Create the admin user:
   ```bash
   node scripts/create-admin-user.js
   ```

### 5. Deploy

Click "Deploy" in Vercel. The deployment process will:

1. Clone your repository
2. Install dependencies
3. Run the build command
4. Deploy the application

### 6. Post-Deployment Setup

After deployment, you may need to run additional setup:

1. Visit your deployed application
2. Test the authentication flow
3. Verify chat functionality
4. Test admin access with the credentials:
   - Email: `chiranjeevi8050@gmail.com`
   - Password: `Password123`

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Ensure all required environment variables are set in Vercel
   - Check for typos in variable names

2. **Supabase Connection Issues**
   - Verify Supabase project URL and keys
   - Check Supabase database schema
   - Ensure RLS policies are properly configured

3. **Build Failures**
   - Check build logs for specific error messages
   - Ensure all dependencies are correctly specified in package.json

4. **Runtime Errors**
   - Check browser console for JavaScript errors
   - Verify Supabase connection settings
   - Check server logs in Vercel

### Support

If you encounter issues during deployment:

1. Check the Vercel documentation: https://vercel.com/docs
2. Check the Next.js documentation: https://nextjs.org/docs
3. Check the Supabase documentation: https://supabase.io/docs

## Custom Domain (Optional)

To use a custom domain:

1. In Vercel dashboard, go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow the DNS configuration instructions
5. Wait for DNS propagation (may take up to 24 hours)

## Monitoring and Analytics

Vercel provides built-in monitoring and analytics:

1. Performance metrics
2. Server logs
3. Client-side analytics
4. Error tracking

You can also integrate third-party monitoring tools as needed.

## Updating Your Deployment

To update your deployed application:

1. Push changes to your GitHub repository
2. Vercel will automatically trigger a new deployment
3. Monitor the build process in the Vercel dashboard

For major updates, consider using Vercel's preview deployments feature to test changes before going live.