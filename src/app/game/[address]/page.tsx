"use client"

import { RunExplorer } from "@/components/explorer/runExplorer";
import {createNetworkConfig, SuiClientProvider, WalletProvider} from "@mysten/dapp-kit";
import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import {getFullnodeUrl, Network, NETWORKS, NETWORK_IDS} from "@/types/network";
import { BuildWithGaladriel } from "@/components/buildwithgaladriel";

const DEFAULT_NETWORK: Network = "devnet"

let currentNetwork: Network = DEFAULT_NETWORK;
if (process.env.NEXT_PUBLIC_NETWORK && NETWORKS.includes(process.env.NEXT_PUBLIC_NETWORK)) {
  currentNetwork = process.env.NEXT_PUBLIC_NETWORK as Network;
}
let formattedNetworkName: string = currentNetwork;
  if (currentNetwork === "localnet") {
    formattedNetworkName = "local"
  }

const {networkConfig} = createNetworkConfig({
  // localnet: {url: getFullnodeUrl("localnet")},
  devnet: {
    url: getFullnodeUrl("devnet"),
  },
  // mainnet: {url: getFullnodeUrl("mainnet")},
  localnet: {
    url: getFullnodeUrl("localnet"),
  },
});


const SUI_ADDRESS_LENGTH: number = 32;

const isHex = (value: string): boolean => {
  return /^(0x|0X)?[a-fA-F0-9]+$/.test(value) && value.length % 2 === 0;
}

const getHexByteLength = (value: string): number => {
  return /^(0x|0X)/.test(value) ? (value.length - 2) / 2 : value.length / 2;
}

const isValidSuiAddress = (value: string): boolean => {
  return isHex(value) && getHexByteLength(value) === SUI_ADDRESS_LENGTH;
}

const queryClient = new QueryClient()

const onSwitchNetwork = (network: Network) => {
   // TODO Kristjan pls help all I am just copy pasting things with chatgpt
}


export default function Page({
  params,
}: {
  params: { address: string }
}) {
  return <>
    <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} network={currentNetwork}>
            <WalletProvider>
              <main className="flex min-h-screen flex-col items-center gap-20 p-12 justify-between">
                <RunExplorer gameObjectId={params.address} network={currentNetwork}/>
              </main>
              <BuildWithGaladriel />
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
  </>
}