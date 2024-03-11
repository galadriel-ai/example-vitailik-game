import {defaultWagmiConfig} from '@web3modal/wagmi/react/config'

import {cookieStorage, createStorage} from 'wagmi'
import {defineChain} from "viem";

// Get projectId at https://cloud.walletconnect.com
export const projectId = "f25128b8bcfc64fb5c124705aa9442b8"

if (!projectId) throw new Error('Project ID is not defined')

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}


export const galadriel = defineChain({
  id: 713715,
  name: 'Galadriel',
  nativeCurrency: {name: 'Galadriel', symbol: 'GAL', decimals: 18},
  rpcUrls: {
    default: {
      http: ["https://testnet.galadriel.com/"],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api',
    },
  },
  contracts: {
    ensRegistry: {
      address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
    },
    ensUniversalResolver: {
      address: '0x8cab227b1162f03b8338331adaad7aadc83b895e',
      blockCreated: 18_958_930,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
})

// Create wagmiConfig
export const config = defaultWagmiConfig({
  chains: [galadriel], // required
  projectId, // required
  metadata, // required
  ssr: true,
  storage: createStorage({
    storage: cookieStorage
  }),
  enableWalletConnect: true, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: true, // Optional - true by default
  enableCoinbase: true, // Optional - true by default
  // ...wagmiOptions // Optional - Override createConfig parameters
})