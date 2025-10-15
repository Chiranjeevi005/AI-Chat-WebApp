import type { Metadata } from "next";
import { Inter, Space_Grotesk, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./components/layout/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI Chat - Futuristic Real-time Communication",
  description: "Experience the future of communication with our AI-powered chat platform featuring real-time messaging, 3D interfaces, and cutting-edge design.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${spaceGrotesk.variable} ${poppins.variable}`}
    >
      <body className="font-sans">
        <AuthProvider>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}