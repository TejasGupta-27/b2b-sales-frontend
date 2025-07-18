import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '../lib/auth/context';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "B2B Sales Agent",
  description: "AI-powered B2B sales intelligence platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
