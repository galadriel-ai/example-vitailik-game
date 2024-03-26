import {useEffect, useRef, useState} from "react"
import {BuildWithGaladriel} from "../buildwithgaladriel";
import {ProgressBar} from "@/components/ProgressBar";
import Addresses from "../addresses";
import {Contract, JsonRpcProvider} from "ethers";
import {ABI} from "@/types/network";

interface WinningGame {
  index: number
  player: string
  messagesCount: number
  contents: string[]
  hpLeft: number
}

interface Score {
  lastGame: number
  ethAddress: string
  score: number
  totalHp: number
  totalTurns: number
  gamesPlayed: number
}

export function ScoreboardPage() {

  let [isLoading, setIsLoading] = useState<boolean>(false)
  let [scoreboard, setScoreboard] = useState<any | undefined>()

  let [scores, setScores] = useState<Score[]>([])

  let [contract, setContract] = useState<Contract | undefined>()

  const effectRan = useRef(false)
  useEffect(() => {
    if (!effectRan.current) {
      effectRan.current = true;
      if (!scoreboard && !isLoading) {
        setIsLoading(true)
        getScoreboard()
      }
    }
  }, [scoreboard])

  const getScoreboard = async () => {
    let contractInstance
    try {

      if (!contractInstance) {
        const ethersProvider = new JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL || "https://devnet.galadriel.com",
        )
        const signer = await ethersProvider.getSigner()
        const newContract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer)
        setContract(newContract)
        contractInstance = newContract
      }
      if (contractInstance) {
        let count = 0
        let games: any[] = []
        let winningGames: WinningGame[] = []
        for (let i = 0; i < 2000; i++) {
          let game = await contractInstance.games(i)
          if (game[0] == "0x0000000000000000000000000000000000000000") {
            break
          }
          count++
          if (game[3]) {
            let contents = await contractInstance.getMessageHistoryContents(i)
            if (contents) {
              winningGames.push({
                index: i,
                player: game[0],
                messagesCount: Number.parseInt(game[1]),
                contents: contents,
                hpLeft: getHpLeft(contents.at(-1))
              })
            }

          }
          games.push(game)

        }

        setScores(formatScores(winningGames))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getHpLeft = (content: string): number => {
    const regex = /Your HP: ([\d,]+)/;
    const match = content.match(regex);
    if (!match) return 0
    // Extract the HP value, removing commas if any
    return parseInt(match[1].replace(/,/g, ''), 10);
  }

  const formatScores = (winningGames: WinningGame[]) => {
    const ethAddressData: {
      [key: string]: { gamesPlayed: number; totalHp: number; totalTurns: number, lastGame: number }
    } = {};
    for (let game of winningGames) {
      let address = game.player
      if (!ethAddressData[address]) {
        ethAddressData[address] = {gamesPlayed: 0, totalHp: 0, totalTurns: 0, lastGame: 0};
      }
      ethAddressData[address].gamesPlayed += 1
      ethAddressData[address].totalHp += game.hpLeft
      ethAddressData[address].totalTurns += game.messagesCount
      ethAddressData[address].lastGame = game.index
    }
    const scores = Object.entries(ethAddressData).map((
      [ethAddress, data]
    ) => ({
      ethAddress,
      score: Math.floor(data.totalHp / data.totalTurns * data.gamesPlayed),
      totalHp: data.totalHp,
      totalTurns: data.totalTurns,
      lastGame: data.lastGame,
      gamesPlayed: data.gamesPlayed,
    }));

    // Optionally, sort the scores if needed
    return scores.sort((a, b) => b.score - a.score);
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-20 lg:p-12 justify-between z-2 relative">

        <div>
          <div className="text-6xl font-PPMondwest my-10">
            scoreboard to win <span className="text-[#00FF66]">1000 USDC</span>
          </div>
          <div
            className="bg-brand-bluedark p-0 border-t-2 border-white w-full max-w-[1000px] pt-2 pb-2"
          >
            <div
              className="min-h-[40px] flex flex-row justify-between"
            >
              <div className="basis-1/5 text-center">
                Player
              </div>
              <div className="basis-1/5 text-center">
                Total HP
              </div>
              <div className="basis-1/5 text-center">
                Turns
              </div>
              <div className="basis-1/5 text-center">
                Games
              </div>
              <div className="basis-1/5 text-center">
                Points
              </div>
            </div>
            {scores.length === 0 && <div className="flex flex-col items-center p-10">
              <ProgressBar duration={4} message="Fetching scoreboard..."/>
            </div>}
            {scores.map((s: Score, i: number) =>
              <div
                key={`score-${i}`}
                className={"min-h-[40px] flex flex-row items-center" + (i === 0 ? " text-brand-neongreen font-bold" : "") + (i % 2 !== 0 ? " bg-white text-black" : "")}
              >
                <div className="basis-1/5 text-center">
                  <a
                    href={`https://explorer.galadriel.com/address/${s.ethAddress}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {s.ethAddress.slice(0, 7)}...
                  </a>
                </div>
                <div className="basis-1/5 text-center">
                  {s.totalHp}
                </div>
                <div className="basis-1/5 text-center">
                  {s.totalTurns}
                </div>
                <div className="basis-1/5 text-center">
                  {s.gamesPlayed}
                </div>
                <div className="basis-1/5 text-center">
                  {s.score}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0 "}>
          <Addresses/>
          <BuildWithGaladriel/>
        </div>
      </main>
    </>
  )
}
