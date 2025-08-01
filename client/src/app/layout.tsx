import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "@/context/Provider";

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
