# AI Chat - Futuristic Real-time Communication Platform

A cutting-edge chat application with a futuristic dark-themed UI, 3D elements, and smooth animations built with Next.js, TailwindCSS, and GSAP. This application now includes a secure authentication system powered by Supabase Auth.

## Features

- 🌌 **Futuristic Dark Theme**: Sleek dark interface with gradient backgrounds and glassmorphism effects
- 🎨 **3D Interactive Elements**: React Three Fiber powered 3D logo and components
- ✨ **Smooth Animations**: GSAP-powered transitions and micro-interactions
- 💬 **Real-time Chat Interface**: Fully functional chat UI with responsive design
- 🔐 **Secure Authentication**: Complete authentication system with email/password and OAuth
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
- **OAuth Integration**: Google, GitHub, and Discord login options
- **Session Management**: Secure session handling with automatic refresh
- **Protected Routes**: Middleware-based route protection
- **API Security**: JWT-based API endpoint protection
- **Role-Based Access**: Permission-based access control

For detailed information about the authentication system, see:
- [Authentication System Documentation](AUTH_SYSTEM_DOCUMENTATION.md)
- [End-to-End Auth System](END_TO_END_AUTH_SYSTEM.md)

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:3003` to view the application

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the application for production
- `npm start` - Starts the production server
- `npm run lint` - Runs the linter

## Security Features

- Row Level Security (RLS) policies
- Secure session management
- HttpOnly, Secure cookies
- Password strength requirements
- Input validation and sanitization
- Rate limiting for authentication endpoints

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.