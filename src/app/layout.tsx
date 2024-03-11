import type {Metadata} from "next";
import {IBM_Plex_Mono} from 'next/font/google'

import "./globals.css";
import Navbar from "@/components/navbar";
import {Web3ModalProvider} from "@/config/Web3Modal";

const plexmono = IBM_Plex_Mono(
  {weight: "400", subsets: ["latin"]},
);

export const metadata: Metadata = {
  title: "VitAIlik Fight Club",
  description: "Battle with on-chain AI VitAIlik",
  openGraph: {
    images: ["https://vitailik.galadriel.com/og_image.png"],
    description: "Battle with on-chain AI 'VitAIlik'"
  }
};


export default function RootLayout(
  {
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>
) {
  return (
    <html lang="en">
    <body className={plexmono.className}>
      <div className="h-screen bg-fight bg-no-repeat bg-contain bg-center ">
        <Navbar />
        <Web3ModalProvider>{children}</Web3ModalProvider>
      </div>
    </body>
    </html>
  );
}
