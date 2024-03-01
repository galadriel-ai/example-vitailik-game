"use client"


import {useEffect, useState} from "react";
import {createNetworkConfig, SuiClientProvider, WalletProvider} from "@mysten/dapp-kit";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import {getFullnodeUrl, Network, NETWORKS} from "@/types/network";
import {ScoreboardPage} from "@/components/scoreboard/scoreboard";

const {networkConfig} = createNetworkConfig({
  // localnet: {url: getFullnodeUrl("localnet")},
  mainnet: {
    url: getFullnodeUrl("mainnet")
  },
  devnet: {
    url: getFullnodeUrl("devnet"),
  },
  localnet: {
    url: getFullnodeUrl("localnet"),
  },
});

const queryClient = new QueryClient()
const DEFAULT_NETWORK: Network = "devnet"

export default function Scoreboard() {


  const currentNetwork = process.env.NEXT_PUBLIC_NETWORK as Network


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} network={currentNetwork}>
          <WalletProvider>
            <ScoreboardPage network={currentNetwork || DEFAULT_NETWORK}/>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </>
  )
}
