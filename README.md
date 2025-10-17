# Chat App - Futuristic Real-time Communication Platform

A cutting-edge chat application with a futuristic dark-themed UI, 3D elements, and smooth animations built with Next.js, TailwindCSS, and GSAP. This application now includes a secure authentication system powered by Supabase Auth.

## Features

- 🌌 **Futuristic Dark Theme**: Sleek dark interface with gradient backgrounds and glassmorphism effects
- 🎨 **3D Interactive Elements**: React Three Fiber powered 3D logo and components
- ✨ **Smooth Animations**: GSAP-powered transitions and micro-interactions
- 💬 **Real-time Chat Interface**: Fully functional chat UI with responsive design
- 🔐 **Secure Authentication**: Complete authentication system with email/password
- 🔑 **Password Reset**: Forgot password functionality with email verification
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🔥 **Modern UI Components**: Glassmorphism cards, gradient text, and glow effects

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: TailwindCSS v4, CSS Modules
- **Animations**: GSAP (GreenSock Animation Platform)
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL with Row Level Security
- **State Management**: React Hooks
- **Deployment**: Node.js Server

## Project Structure

```
src/
├── app/
│   ├── components/        # Reusable UI components
│   ├── chat/             # Chat interface page
│   ├── logo/             # 3D logo showcase
│   ├── test/             # Component testing page
│   ├── layout.tsx        # Root layout with navbar
│   ├── page.tsx          # Main landing page
│   └── globals.css       # Global styles and animations
├── utils/                # Utility functions
├── lib/                  # Library functions and services
├── hooks/                # Custom React hooks
├── contexts/             # React context providers
└── public/               # Static assets
```

## Authentication System

This application includes a comprehensive authentication system with:

- **Email/Password Authentication**: Traditional username/password login
- **Password Reset**: Forgot password functionality with email verification
- **Session Management**: Secure session handling with automatic refresh
- **Protected Routes**: Middleware-based route protection
- **API Security**: JWT-based API endpoint protection
- **Role-Based Access**: Permission-based access control

For detailed information about the authentication system, see:
- [Authentication System Documentation](AUTH_SYSTEM_DOCUMENTATION.md)
- [End-to-End Auth System](END_TO_END_AUTH_SYSTEM.md)

## Admin User Setup

This application has a designated admin user with special privileges:

- **Email**: chiranjeevi8050@gmail.com
- **Password**: Password123

Only this user can access the admin panel at `/admin`. All other users will be redirected to the regular chat interface.

To set up the admin user:

1. Run the admin user creation script:
```bash
node scripts/create-admin-user.js
```

2. Or manually create the user through the signup form, then run:
```bash
node scripts/setup-admin-user.js
```

## Setup Instructions

### 1. Install dependencies:
```bash
npm install
```

### 2. Supabase Setup:
Follow the detailed [Supabase Setup Guide](README_SUPABASE.md) to:
- Create a Supabase project
- Get your API keys
- Set up environment variables
- Create database tables

### 3. Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3003
```

### 4. Set up the database schema:
```bash
node scripts/setup-database.js
```

### 5. Seed initial chat rooms:
```bash
npm run seed
```

### 6. Set up the admin user:
```bash
node scripts/create-admin-user.js
```

### 7. Run the development server:
```bash
npm run dev
```

### 8. Visit `http://localhost:3003` to view the application

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm start` - Starts the production server
- `npm run lint` - Runs the linter

## Vercel Deployment

This application is configured for deployment to Vercel. Follow these steps:

1. Push your code to a GitHub repository
2. Create a new project on Vercel
3. Connect your GitHub repository
4. Configure the environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (set to your Vercel deployment URL)
5. Deploy the project

The application will automatically build and deploy. No additional configuration is needed.

## Password Reset Functionality

This application includes a complete password reset system:

1. Users can request a password reset from the login page
2. An email with a secure reset link is sent to the user
3. Users click the link to access the password update page
4. After updating their password, users are redirected to the login page

The password reset flow includes:
- `/auth/forgot-password` - Request password reset
- `/auth/update-password` - Update password form
- Email verification through Supabase

## Security Features

- Row Level Security (RLS) policies
- Secure session management
- HttpOnly, Secure cookies
- Password strength requirements
- Input validation and sanitization
- Rate limiting for authentication endpoints

## Troubleshooting

If you encounter the "Failed to load rooms" error:
1. Check that your Supabase environment variables are correctly set in `.env.local`
2. Verify that you've created the database tables using the SQL script
3. Ensure your Supabase project URL and API keys are correct
4. Check the browser console for detailed error messages

For detailed Supabase setup instructions, see [README_SUPABASE.md](README_SUPABASE.md)

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.