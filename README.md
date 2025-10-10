# AI Chat - Futuristic Real-time Communication Platform

A cutting-edge chat application with a futuristic dark-themed UI, 3D elements, and smooth animations built with Next.js, TailwindCSS, and GSAP.

## Features

- 🌌 **Futuristic Dark Theme**: Sleek dark interface with gradient backgrounds and glassmorphism effects
- 🎨 **3D Interactive Elements**: React Three Fiber powered 3D logo and components
- ✨ **Smooth Animations**: GSAP-powered transitions and micro-interactions
- 💬 **Real-time Chat Interface**: Fully functional chat UI with responsive design
- 📱 **Mobile Responsive**: Optimized for all device sizes
- 🔥 **Modern UI Components**: Glassmorphism cards, gradient text, and glow effects

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Styling**: TailwindCSS v4, CSS Modules
- **Animations**: GSAP (GreenSock Animation Platform)
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
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
└── public/               # Static assets
```

## Key Components

### Landing Page
- Hero section with animated 3D logo
- Features section with interactive cards
- Chat preview with sample messages
- Responsive footer

### Chat Interface
- Collapsible sidebar with room list
- Main chat area with message bubbles
- Message input with attachment options
- Online users panel

### Special Effects
- Glassmorphism UI elements
- Gradient text and glow effects
- Floating animations and particle effects
- Scroll-triggered parallax effects

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Start Production Server**:
   ```bash
   npm start
   ```

## Pages

- `/` - Main landing page
- `/chat` - Chat interface
- `/logo` - 3D logo showcase
- `/test` - Component testing page

## Customization

### Colors
The color palette is defined in `src/app/globals.css` using CSS variables:
- Primary: Electric Cyan (#00FFFF)
- Secondary: Violet (#8243CC)
- Background: Dark Gradient (from #0D0D0D to #1A1A1A)

### Animations
All animations are implemented with GSAP and can be customized in:
- Component-specific useEffect hooks
- Global CSS keyframes in `globals.css`

### 3D Components
3D elements use React Three Fiber and can be modified in:
- `src/app/components/ThreeDLogo.tsx`

## Performance Optimizations

- Code splitting with Next.js dynamic imports
- Efficient animations with GSAP
- Responsive images and assets
- Optimized 3D rendering with React Three Fiber

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspiration from Dribbble and Behance
- n8n.io and Linear.app aesthetic influences
- React Three Fiber for 3D components
- GSAP for animations