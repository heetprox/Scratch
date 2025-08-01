import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/context/Provider";
import { useEffect } from 'react';

// Initialize database on server startup
async function initDatabase() {
  try {
    const response = await fetch('/api/init-db', { cache: 'no-store' });
    const data = await response.json();
    console.log('Database initialization:', data);
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Call database initialization on server
if (typeof window !== 'undefined') {
  initDatabase();
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Scratch - Peer-to-Peer Payments',
  description: 'Send and receive cryptocurrency payments easily',
  keywords: ['crypto', 'payments', 'ethereum', 'web3', 'blockchain'],
  authors: [{ name: 'Heet Vavadiya' }],
  openGraph: {
    title: 'Scratch - Peer-to-Peer Payments',
    description: 'Send and receive cryptocurrency payments easily',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize database when the app loads on client
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <div className="min-h-screen w-full">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
