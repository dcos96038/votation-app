import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";

import { CONSTANTS } from "@/lib/constants";

import { Toaster } from "@/components/ui/sonner";

// import { Button } from "@/components/ui/button";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Votation App",
  description: "Votation App for los pibes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-background">
          <header className="container mx-auto px-4 py-6">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                {CONSTANTS.APP_NAME}
              </Link>
              {/* <Button variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button> */}
            </nav>
          </header>
          {children}
          <footer className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {CONSTANTS.APP_NAME}. All rights
            reserved.
          </footer>
        </div>
        <Toaster richColors duration={2000} />
      </body>
    </html>
  );
}
