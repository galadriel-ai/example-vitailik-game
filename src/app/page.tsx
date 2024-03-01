import {BuildWithGaladriel} from "@/components/buildwithgaladriel";
import { ExplorerLinks } from "@/components/explorer/explorerLinks";
import {Network, NETWORKS, NETWORK_IDS} from "@/types/network";

const DEFAULT_NETWORK: Network = "devnet"


let currentNetwork: Network = DEFAULT_NETWORK;
if (process.env.NEXT_PUBLIC_NETWORK && NETWORKS.includes(process.env.NEXT_PUBLIC_NETWORK)) {
  currentNetwork = process.env.NEXT_PUBLIC_NETWORK as Network;
}
let formattedNetworkName: string = currentNetwork;
  if (currentNetwork === "localnet") {
    formattedNetworkName = "local"
  }

export default function Page() {
    return <>
      <div className="text-center font-PPMondwest mt-40"
        >
        <p className="text-8xl my-5">Battle with on-chain AI &quot;VitAIlik&quot;</p>
        <p className="text-4xl">and</p>
        <p className="text-9xl mt-5">win <span className="text-brand-neongreen">1000 USDC</span></p>

        <button
          className="p-3 px-5 font-PPNeueBit font-bold text-4xl bg-brand-neongreen text-brand-bluedark my-20"
        >
          <a href="/play">Connect 2 Battle</a>
        </button>

        <div className="text-2xl">
          <p>competition until end of ETHDenver</p>
          <p>anyone can play</p>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 p-4 text-slate-200">
        <div>
          AI contract: 
          <a
            href={`https://suiscan.com/object/${NETWORK_IDS[currentNetwork].packageId}?network=${formattedNetworkName}`}
            target={"_blank"}
            className="underline ml-2"
          >
            {NETWORK_IDS[currentNetwork].packageId.substring(0, 8) + "..."}
          </a>
        </div>
        <div className="pt-4">
          AI registry:
          <a
            href={`https://suiscan.com/object/${NETWORK_IDS[currentNetwork].registryObjectId}?network=${formattedNetworkName}`}
            target={"_blank"}
            className="underline ml-2"
            >
            {NETWORK_IDS[currentNetwork].registryObjectId.substring(0, 8) + "..."}
          </a>
        </div>
      </div>

        <BuildWithGaladriel />
    </>
  }
