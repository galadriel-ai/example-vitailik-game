import {useEffect, useState} from "react"
import {useCurrentAccount, useSuiClient, useSignAndExecuteTransactionBlock} from "@mysten/dapp-kit"
// @ts-ignore
import {SuiParsedData} from "@mysten/sui.js/src/types"
import {ExplorerLinks} from "@/components/explorer/explorerLinks"
import {Network, NETWORK_IDS} from "@/types/network";
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {FONT, FONT_BOLD} from "@/fonts/fonts";

interface Props {
  network: Network
}

export function ScoreboardPage({network}: Props) {
  const client = useSuiClient()

  let [isLoading, setIsLoading] = useState<boolean>(false)
  let [scoreboard, setScoreboard] = useState<any | undefined>()

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
      const fields = content["fields"]
      const tableId = fields.id.id
      await getTableData(tableId)
      // const gameRun: Game = {
      //   id: objectId,
      //   index: fields.index,
      //   player: fields.player,
      //   ethAddress: fields.eth_address,
      //   isFinished: fields.is_finished,
      //   promptsId: fields.prompts.fields.id.id,
      //   prompts: [],
      //   userSelectionsId: fields.user_selections.fields.id.id,
      //   userSelections: []
      // }
      // gameRun.prompts = await getGamePrompts(gameRun.promptsId)
      // gameRun.userSelections = await getUserSelections(gameRun.userSelectionsId)
      // setIsLoading(false)
      // setGameRun(gameRun)
      // if (!gameRun.isFinished) {
      //   await new Promise(r => setTimeout(r, 3000))
      //   await getGameObject(objectId)
      // }
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

  const getTableData = async (objectId: string) => {
    const dynamicFields = await client.getDynamicFields({
      parentId: objectId,
    })
    console.log("dynamicFields")
    console.log(dynamicFields)
    // const prompts: GamePrompt[] = []
    // for (const d of dynamicFields.data) {
    //   const object = await getObject(d.objectId)
    //   const content: SuiParsedData | null | undefined = object.data?.content
    //   if (content && ((content["fields"] || {})["value"] || {})["fields"]) {
    //     const fields = content["fields"]["value"]["fields"]
    //     prompts.push({
    //       id: d.objectId,
    //       index: parseInt(content["fields"].name),
    //       imageUrl: fields.image_url,
    //       content: fields.content,
    //     })
    //   }
    // }
    // return prompts.sort((d1, d2) => d1.index - d2.index)
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
            href="/scoreboard"
          >
            Scoreboard
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
