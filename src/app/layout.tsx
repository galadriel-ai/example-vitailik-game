import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ContextProvider} from "@/context";
import {cookieToInitialState} from "wagmi";
import {config} from "@/config";
import {headers} from "next/headers";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "VitAIlik Fight Club",
  description: "Battle with on-chain AI 'VitAIlik'",
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
    <body className={inter.className}>
    <ContextProvider initialState={initialState}>{children}</ContextProvider>
    </body>
    </html>
  );
}
