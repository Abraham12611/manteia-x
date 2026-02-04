import type { Metadata } from "next";
import { Inter, Playfair_Display, Roboto_Mono } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { Providers } from "./providers"; // We will create this next

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manteia | Zero-Knowledge Revenue Financing",
  description: "Get funded instantly on Mantle Network without revealing your private revenue data.",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${robotoMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster closeButton cancelButton={false} style={{ backgroundColor: '#1E222E', borderColor: '#252931', color: 'white' }} />
      </body>
    </html>
  );
}
