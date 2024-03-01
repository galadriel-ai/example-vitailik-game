import {useEffect, useState} from "react"
import {useCurrentAccount, useSuiClient, useSignAndExecuteTransactionBlock} from "@mysten/dapp-kit"
// @ts-ignore
import {SuiParsedData} from "@mysten/sui.js/src/types"
import {ExplorerLinks} from "@/components/explorer/explorerLinks"
import {Network, NETWORK_IDS} from "@/types/network";
import {TransactionBlock} from '@mysten/sui.js/transactions';
import {FONT} from "@/fonts/fonts";

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

  return <div>
    Scoreboard
  </div>
}
