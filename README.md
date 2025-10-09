# AI Chat App

Full-Stack Chat Application with Next.js, MongoDB, Socket.IO, TailwindCSS, and GSAP

## Tech Stack

- **Frontend**: Next.js 15, TailwindCSS, GSAP
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: LoginRadius (scaffolded)
- **Deployment**: Vercel

## Project Structure

```
chat-app/
├─ src/
│  ├─ app/                 # Next.js app directory
│  │  ├─ page.tsx          # Homepage with GSAP animation
│  │  ├─ layout.tsx        # Root layout
│  │  ├─ globals.css       # Global styles
│  │  └─ api/              # API routes
│  │      ├─ ping/route.ts # Test API route
│  │      └─ auth/route.ts # LoginRadius scaffold
│  ├─ utils/               # Utility functions
│  │  ├─ database.js       # MongoDB connection
│  │  ├─ socket.js         # Socket.IO client setup
│  │  └─ socket-server.js  # Socket.IO server setup
├─ public/                 # Static assets
├─ server.js               # Custom Express server with Socket.IO
├─ tailwind.config.js      # TailwindCSS configuration
├─ package.json            # Project dependencies
└─ .env.local              # Environment variables
```

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGO_URI=<your_mongo_uri>
   LOGINRADIUS_API_KEY=<your_api_key>
   LOGINRADIUS_API_SECRET=<your_api_secret>
   JWT_SECRET=<your_jwt_secret>
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Test API routes**:
   - Ping route: http://localhost:3000/api/ping
   - Auth route: http://localhost:3000/api/auth

## Features Implemented

- ✅ Next.js 15 with App Router
- ✅ TailwindCSS styling
- ✅ GSAP animation on homepage
- ✅ MongoDB connection with Mongoose
- ✅ Socket.IO server with connection logging
- ✅ LoginRadius authentication scaffold
- ✅ Environment variable configuration

## Development

The application will be available at http://localhost:3000

### Testing

1. **Verify GSAP animation**: Visit the homepage and observe the "Hello World" animation
2. **Verify MongoDB connection**: Check the server console after visiting `/api/ping`
3. **Verify Socket.IO connection**: Check the server console for connection logs
4. **Verify LoginRadius scaffold**: Visit `/api/auth` and check the response

## Deployment

This app can be deployed to Vercel or any Node.js hosting platform that supports custom servers.