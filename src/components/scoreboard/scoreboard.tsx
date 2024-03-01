import {useEffect, useState} from "react"
import {useSuiClient} from "@mysten/dapp-kit"
// @ts-ignore
import {SuiParsedData} from "@mysten/sui.js/src/types"
import {ExplorerLinks} from "@/components/explorer/explorerLinks"
import {Network, NETWORK_IDS} from "@/types/network";
import {FONT, FONT_BOLD} from "@/fonts/fonts";
import {Loader} from "@/components/Loader";

interface Props {
  network: Network
}

interface Score {
  id: string
  ethAddress: string
  hpLeft: number
  turns: number
}

export function ScoreboardPage({network}: Props) {
  const client = useSuiClient()

  let [isLoading, setIsLoading] = useState<boolean>(false)
  let [scoreboard, setScoreboard] = useState<any | undefined>()

  let [scores, setScores] = useState<Score[]>([])

  useEffect(() => {
    if (!scoreboard && !isLoading) {
      setIsLoading(true)
      getScoreboard()
    }
  }, [network, client, scoreboard])

  const getScoreboard = async () => {
    console.log(network)
    const object = await getObject(NETWORK_IDS[network].scoreboardObjectId);
    const content: SuiParsedData | null | undefined = object.data?.content
    if (content && content["fields"]) {
      const tableId = content["fields"]["scores"]["fields"]["id"]["id"]
      const scores = await getTableData(tableId)
      setScores(scores)
    }
  }

  const getObject = async (objectId: string) => {
    return await client.getObject({
      id: objectId,
      options: {
        showContent: true
      }
    })
  }

  const getTableData = async (objectId: string): Promise<Score[]> => {
    const dynamicFields = await client.getDynamicFields({
      parentId: objectId,
    })
    const scores: Score[] = []
    for (const d of dynamicFields.data) {
      const object = await getObject(d.objectId)
      const content: SuiParsedData | null | undefined = object.data?.content
      if (content && ((content["fields"] || {})["value"] || {})["fields"]) {
        const fields = content["fields"]["value"]["fields"]
        scores.push({
          id: d.objectId,
          ethAddress: fields.eth_address,
          hpLeft: parseInt(fields.hp_left),
          turns: parseInt(fields.turns),
        })
      }
    }
    return scores.sort((d1, d2) => (d2.hpLeft - d1.hpLeft) || (d1.turns - d2.turns))
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-20 lg:p-12 justify-between z-2 relative">
        <div className="flex flex-row gap-6 w-full justify-end p-6 lg:p-0">
          <a
            className="hover:underline cursor-pointer"
            href="/"
          >
            Home
          </a>
          <a
            className="hover:underline cursor-pointer"
            href="https://galadriel.com"
            target="_blank"
          >
            About
          </a>
        </div>


        <div
          className="bg-[#002360] p-0 border-t-2 border-white w-full max-w-[1000px] pt-2 pb-2"
        >
          <div
            className="min-h-[40px] flex flex-row justify-between"
          >
            <div className="basis-1/4 text-center">
              Player
            </div>
            <div className="basis-1/4 text-center">
              HP
            </div>
            <div className="basis-1/4 text-center">
              Turns
            </div>
            <div className="basis-1/4 text-center">
              Game
            </div>
          </div>
          {scores.length === 0 && <div className="flex flex-col items-center p-10">
            <Loader/>
          </div>}
          {scores.map((s: Score, i: number) =>
            <div
              key={`score-${i}`}
              className={"min-h-[40px] flex flex-row items-center " + (i === 0 ? "text-green-400 " : "") + (i % 2 !== 0 ? "bg-white text-black " : "")}
            >
              <div className="basis-1/4 text-center">
                {s.ethAddress.slice(0, 10)}...
              </div>
              <div className="basis-1/4 text-center">
                {s.hpLeft}
              </div>
              <div className="basis-1/4 text-center">
                {s.turns}
              </div>
              <div className="basis-1/4 text-center">
                <a
                  href={`https://suiscan.com/object/${s.id}?network=${network}`}
                  target={"_blank"}
                  className="underline"
                >
                  Suiscan.com
                </a>
              </div>
            </div>
          )}
        </div>

        <div
          className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0 " + FONT.className}>
          <div className="text-left text-sm w-full">
            <div>
              <div className="hidden lg:inline">AI contract: {NETWORK_IDS[network].packageId}</div>
              <div className="inline lg:hidden">AI contract: {NETWORK_IDS[network].packageId.slice(0, 10)}...
              </div>
              <ExplorerLinks
                objectId={NETWORK_IDS[network].packageId}
                type={"object"}
                network={network}
              />
            </div>
            <div className="pt-4">
              <div className="hidden lg:inline">
                AI registry object: {NETWORK_IDS[network].registryObjectId}
              </div>
              <div className="inline lg:hidden">
                AI registry object: {NETWORK_IDS[network].registryObjectId.slice(0, 10)}...
              </div>
              <ExplorerLinks
                objectId={NETWORK_IDS[network].registryObjectId}
                type={"object"}
                network={network}
              />
            </div>
          </div>
          <div className="pb-1">build on-chain AI with</div>
          <a
            className={"hover:underline cursor-pointer pl-2 text-6xl flex flex-col items-end" + FONT_BOLD.className}
            href="https://galadriel.com"
            target="_blank"
          >
            Galadriel
          </a>
        </div>
      </main>
    </>
  )
}
