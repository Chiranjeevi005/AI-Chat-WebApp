# Admin User Setup Guide

This document explains how to set up the designated admin user for the Chat App.

## Designated Admin User

The application has one designated admin user with special privileges:
- **Email**: chiranjeevi8050@gmail.com
- **Password**: Password123

This user is the only one who can access the admin panel at `/admin`.

## Setup Methods

### Method 1: Automated Setup (Recommended)

Run the provided script to automatically create and configure the admin user:

```bash
npm run setup-admin
```

This script will:
1. Create the user account in Supabase Auth
2. Set up the user profile with admin role
3. Skip email confirmation for immediate access

### Method 2: Manual Setup

1. Sign up using the regular signup form with:
   - Email: chiranjeevi8050@gmail.com
   - Password: Password123

2. Run the setup script to assign admin role:
```bash
node scripts/setup-admin-user.js
```

## Admin Features

The admin user has access to:
- Admin dashboard at `/admin`
- Enhanced permissions for managing rooms and users
- Special UI elements and controls

## Security Notes

- Only the user with email `chiranjeevi8050@gmail.com` can access admin features
- All other users, even if they have "admin" role in the database, will be denied access
- The authentication is enforced at both the UI and API levels

## Troubleshooting

If the admin user is not working:

1. Verify the user exists in Supabase Auth:
   - Check the `auth.users` table
   - Ensure the email is exactly `chiranjeevi8050@gmail.com`

2. Verify the profile has admin role:
   - Check the `profiles` table
   - Ensure the `role` field is set to `'admin'`

3. Check the middleware configuration:
   - Review `src/lib/auth-middleware.ts`
   - Ensure the email check is properly implemented

## Changing Admin Credentials

To change the admin email or password:

1. Update the middleware in `src/lib/auth-middleware.ts`
2. Update the authentication hook in `src/hooks/useAuth.ts`
3. Update the admin pages in `src/app/admin/`
4. Recreate the user with new credentials using the scripts