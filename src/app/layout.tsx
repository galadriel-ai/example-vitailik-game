import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { IBM_Plex_Mono } from 'next/font/google'

import {Navbar} from "@/components/navbar";

const plexmono = IBM_Plex_Mono(
  {weight: "400", subsets: ["latin"]},
);



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sui dapp",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={plexmono.className}>
        <div className="h-screen bg-fight bg-no-repeat bg-contain bg-center ">
        <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
}