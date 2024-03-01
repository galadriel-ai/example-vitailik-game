"use client"

import {useState} from "react"
import {RunExplorer} from "@/components/explorer/runExplorer";
import {ExplorerLinks} from "@/components/explorer/explorerLinks";
import {Network, NETWORK_IDS} from "@/types/network";
import {Web3} from "web3";
import {FONT, FONT_BOLD} from "@/fonts/fonts";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'
import { BuildWithGaladriel } from "./buildwithgaladriel";
import Addresses from "./addresses";

interface Props {
  network: Network
  onSwitchNetwork: (network: Network) => void
}

export function Landing(props: Props) {
  const {open} = useWeb3Modal()
  const { address, isConnecting, isDisconnected } = useAccount()
  const [connectedAccount, setConnectedAccount] = useState<string>("");

  const [isGameStartLoading, setIsGameStartLoading] = useState<boolean>(false)

  // 0x07a0f3be68f6469f7f4a8ffade9480be0818e7b1f230a95d9a03080f162405af
  // TODO: revert
  const [gameId, setGameId] = useState<string | undefined>()
  // const [gameId, setGameId] = useState<string | undefined>("0x07a0f3be68f6469f7f4a8ffade9480be0818e7b1f230a95d9a03080f162405af")

  const connectWeb3 = async (): Promise<void> => {
    // @ts-ignore
    if (window.ethereum) {
      // instantiate Web3 with the injected provider
      // @ts-ignore
      const web3 = new Web3(window.ethereum);

      //request user to connect accounts (Metamask will prompt)
      // @ts-ignore
      await window.ethereum.request({method: 'eth_requestAccounts'});

      //get the connected accounts
      const accounts = await web3.eth.getAccounts();

      //show the first connected account in the react page
      setConnectedAccount(accounts[0]);
    } else {
      alert('Please download metamask');
    }
  }

  const onStartGame = async (): Promise<void> => {
    if (!address) {
      console.log("Not connected")
      return
    }
    setIsGameStartLoading(true)
    const response = await fetch(
      "/api/startGame",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
          address: address
        }),
      }
    )
    const {gameId} = await response.json()
    if (gameId) {
      setGameId(gameId)
    }
    setIsGameStartLoading(false)
  }

  return (
    <>
      {!address &&
        <div
          className="absolute z-0"
          style={{width: "100%", height: "100%"}}
        />
      }
      <main className="flex min-h-screen flex-col items-center gap-20 lg:p-12 justify-between z-2 relative">

        {!address ?
          <>
            <div
              className={"flex flex-col gap-6 text-center text-xl " + FONT.className}
            >
              <div className="text-7xl">
                <div>
                  Battle with on-chain AI “VitAIlik”
                </div>
              </div>
              <div className="text-3xl">
                and
              </div>
              <div
                className="text-6xl"
              >
                win <span className="text-[#00FF66]">1000 USDC</span>
              </div>
              <div className="pt-[100px]">
                <button
                  // onClick={() => connectWeb3()}
                  onClick={() => open()}
                  className={"p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200 " + FONT.className}
                >
                  Connect wallet to Battle
                </button>
              </div>
              <div className="pt-10 flex flex-col gap-2">
                <div>
                  competition until end of ETH Denver
                </div>
                <div>
                  no skills required
                </div>
              </div>
            </div>
          </>
          :
          <>
            {!gameId ?
              <>
                <div
                  className="bg-brand-bluedark p-5 lg:p-10 border-t-2 border-white"
                >
                  <div className="flex flex-row gap-4 max-w-[1000px]">
                    <div className="lg:basis-4/5">
                      <div className={"text-4xl " + FONT.className}>
                        Ah, brave wanderer of ETH Denver, welcome to my realm!
                      </div>
                      <div className={"flex flex-col gap-8 p-2 pt-6"}>
                        <div>
                          I am VitAIlik, your AI foe and guardian of the Web3 galaxy!
                        </div>
                        <div>
                          Your goal: drain my 10,000 HP before I deplete yours. Triumph, and your remaining HP boosts
                          your
                          score on the scoreboard, The highest scorer wins 1000 USDC by end of ETH Denver and eternal
                          glory
                          in the Web3 galaxy.
                        </div>
                        <div>
                          Choose from four actions each turn but beware, every move is a double-edged sword. Choose
                          wisely,
                          for each action you take will influence the tide of battle, affecting both our HPs. Remember,
                          in
                          this arena, every move can lead to victory or defeat and every attack you unleash comes with
                          its
                          own risks.
                        </div>
                        <div>
                          The crowd roars in anticipation. Ready your arms, brave challenger. Let the battle begin!
                        </div>
                        <div className="text-center pt-6">
                          <button
                            onClick={() => {
                              if (!isGameStartLoading) {
                                onStartGame()
                              }
                            }}
                            className={"pl-12 pr-12 p-4 bg-[#00FF66] text-3xl text-black hover:bg-[#00b548] duration-200 " + FONT.className}
                          >
                            {isGameStartLoading ? "Loading" : "GO!"}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="hidden lg:inline lg:basis-1/5">
                      <img
                        src="/vitailik.png"
                        alt="pixels"
                      />
                    </div>

                  </div>
                </div>
              </>
              :
              <>
                <div
                  className="flex flex-col grow gap-4 max-w-8xl w-full relative place-items-center h-full">

                  {gameId &&
                    <RunExplorer
                      gameObjectId={gameId}
                      network={props.network}
                      connectedAccount={address}
                    />
                  }
                </div>
              </>
            }
          </>
        }


        <div
          className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0"}>
          <Addresses network={props.network} />
          <BuildWithGaladriel />
        </div>
      </main>
    </>
  )
}
