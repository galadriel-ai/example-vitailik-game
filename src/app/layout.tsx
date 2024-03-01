import type {Metadata} from "next";
import { IBM_Plex_Mono } from 'next/font/google'

import "./globals.css";
import {ContextProvider} from "@/context";
import {cookieToInitialState} from "wagmi";
import {config} from "@/config";
import {headers} from "next/headers";
import Navbar from "@/components/navbar";

const plexmono = IBM_Plex_Mono(
  {weight: "400", subsets: ["latin"]},
);

export const metadata: Metadata = {
  title: "VitAIlik Fight Club",
  description: "Battle with on-chain AI VitAIlik",
  openGraph: {
    images: ["/og_image.png"],
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
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
    <body className={plexmono.className}>
    <ContextProvider initialState={initialState}>
      <Navbar />
      {children}
    </ContextProvider>
    </body>
    </html>
  );
}
