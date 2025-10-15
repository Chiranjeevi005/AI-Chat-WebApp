# Chat App - Project Structure

This document outlines the organized file structure for the Chat application, designed for maintainability and scalability.

## Directory Structure

```
.
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── route.ts
│   │   │   ├── ping/
│   │   │   │   └── route.ts
│   │   │   ├── protected/
│   │   │   │   └── route.js
│   │   │   ├── seed-rooms/
│   │   │   │   └── route.ts
│   │   │   ├── socket/
│   │   │   │   └── route.ts
│   │   │   ├── test-session/
│   │   │   │   └── route.ts
│   │   │   └── test-supabase/
│   │   │       └── route.ts
│   │   ├── auth/
│   │   │   ├── callback/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   ├── chat-session/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatArea.tsx
│   │   │   │   └── RoomSidebar.tsx
│   │   │   └── layout/
│   │   │       ├── Footer.tsx
│   │   │       └── Navbar.tsx
│   │   ├── seed-rooms/
│   │   │   └── page.tsx
│   │   ├── test-rooms/
│   │   │   └── page.tsx
│   │   ├── test-supabase-connection/
│   │   │   └── page.tsx
│   │   ├── custom-styles.css
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── lib/
│   │   ├── auth-middleware.ts
│   │   ├── auth-service.ts
│   │   ├── database-schema.sql
│   │   ├── seedRooms.ts
│   │   └── supabaseClient.ts
│   ├── types/
│   │   └── index.ts
│   └── middleware.ts
├── public/
│   ├── assets/
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   └── logo-dark.png
│   └── next.svg
├── scripts/
│   ├── create-tables.js
│   ├── seed-rooms.js
│   └── setup-database.js
├── .env.example
├── .env.local
├── .gitignore
├── AUTH_SYSTEM_DOCUMENTATION.md
├── COMPLETE_AUTH_SYSTEM_SUMMARY.md
├── END_TO_END_AUTH_SYSTEM.md
├── IMPLEMENTATION_SUMMARY.md
├── PROJECT_STRUCTURE.md
├── README.md
├── README_SUPABASE.md
├── SECURITY_CHECKLIST.md
├── SETUP_GUIDE.md
├── eslint.config.mjs
├── generate-favicon.js
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── server.js
├── tailwind.config.ts
└── tsconfig.json
```

## Component Descriptions

### API Routes (`src/app/api/`)
- **auth/**: Authentication-related API endpoints
- **ping/**: Health check endpoint
- **protected/**: Protected API routes requiring authentication
- **seed-rooms/**: Room seeding endpoint
- **socket/**: WebSocket connection endpoint
- **test-session/**: Session testing endpoint
- **test-supabase/**: Supabase connection testing endpoint

### Authentication Pages (`src/app/auth/`)
- **callback/**: OAuth callback handling
- **login/**: User login interface
- **signup/**: User registration interface
- **verify-email/**: Email verification page

### Chat Session (`src/app/chat-session/`)
- **layout.tsx**: Protected layout for authenticated users
- **page.tsx**: Main chat interface with room sidebar and message area

### Components (`src/app/components/`)
- **chat/**: Chat-specific components
  - **ChatArea.tsx**: Main message display and input area
  - **RoomSidebar.tsx**: Room navigation and management sidebar
- **layout/**: Global layout components
  - **Footer.tsx**: Application footer
  - **Navbar.tsx**: Navigation header with branding

### Utility Directories
- **contexts/**: React context providers
  - **AuthContext.tsx**: Authentication state context
- **hooks/**: Custom React hooks
  - **useAuth.ts**: Authentication logic hook
- **lib/**: Library functions and services
  - **auth-middleware.ts**: Authentication middleware
  - **auth-service.ts**: Authentication service utilities
  - **database-schema.sql**: Database schema definition
  - **seedRooms.ts**: Room seeding logic
  - **supabaseClient.ts**: Supabase client configuration
- **types/**: TypeScript type definitions
  - **index.ts**: Shared type definitions

### Public Assets (`public/`)
- **assets/**: Static assets including logos and icons
- **next.svg**: Next.js logo

### Scripts (`scripts/`)
- **create-tables.js**: Database table creation script
- **seed-rooms.js**: Room seeding script
- **setup-database.js**: Database setup script

### Configuration Files
- **.env.example**: Environment variable template
- **.env.local**: Local environment variables
- **.gitignore**: Git ignore patterns
- **eslint.config.mjs**: ESLint configuration
- **generate-favicon.js**: Favicon generation script
- **next.config.ts**: Next.js configuration
- **package.json**: Project dependencies and scripts
- **postcss.config.mjs**: PostCSS configuration
- **server.js**: Custom server configuration
- **tailwind.config.ts**: Tailwind CSS configuration
- **tsconfig.json**: TypeScript configuration

### Documentation
- **AUTH_SYSTEM_DOCUMENTATION.md**: Detailed authentication system documentation
- **COMPLETE_AUTH_SYSTEM_SUMMARY.md**: Authentication system summary
- **END_TO_END_AUTH_SYSTEM.md**: End-to-end authentication system overview
- **IMPLEMENTATION_SUMMARY.md**: Implementation summary
- **PROJECT_STRUCTURE.md**: This document
- **README.md**: Main project documentation
- **README_SUPABASE.md**: Supabase setup guide
- **SECURITY_CHECKLIST.md**: Security implementation checklist
- **SETUP_GUIDE.md**: Project setup instructions

This structure is designed to be modular, maintainable, and scalable, following modern React and Next.js best practices.