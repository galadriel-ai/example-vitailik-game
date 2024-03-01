import {useEffect, useState} from "react"
import {useSuiClient} from "@mysten/dapp-kit"
// @ts-ignore
import {SuiParsedData} from "@mysten/sui.js/src/types"
import {ExplorerLinks} from "@/components/explorer/explorerLinks"
import {Network} from "@/types/network";
import {FONT} from "@/fonts/fonts";
import ProgressBar from "../ProgressBar";


interface Props {
  gameObjectId: string
  network: Network
  connectedAccount: string
}

interface GamePrompt {
  id: string
  index: number
  imageUrl: string
  content: string
}

interface UserSelection {
  // Not yet indexed
  id: string | undefined
  index: number
  selection: number
}

interface Game {
  id: string
  index: number
  player: string
  ethAddress: string
  isFinished: boolean
  promptsId: string
  prompts: GamePrompt[]
  userSelectionsId: string
  userSelections: UserSelection[]
}

const SELECTIONS = ["A", "B", "C", "D"]

export const RunExplorer = ({gameObjectId, network, connectedAccount}: Props) => {
  const client = useSuiClient()

  let [isLoading, setIsLoading] = useState<boolean>(false)
  let [gameRun, setGameRun] = useState<Game | undefined>()

  useEffect(() => {
    if (gameObjectId) {
      setIsLoading(true)
      getGameObject(gameObjectId)
    }
  }, [client, gameObjectId])

  const getObject = async (objectId: string) => {
    return await client.getObject({
      id: objectId,
      options: {
        showContent: true
      }
    })
  }

  const getGameObject = async (objectId: string) => {
    const object = await getObject(objectId);
    const content: SuiParsedData | null | undefined = object.data?.content
    if (content && content["fields"]) {
      const fields = content["fields"]["value"]["fields"]
      const gameRun: Game = {
        id: objectId,
        index: fields.index,
        player: fields.player,
        ethAddress: fields.eth_address,
        isFinished: fields.is_finished,
        promptsId: fields.prompts.fields.id.id,
        prompts: [],
        userSelectionsId: fields.user_selections.fields.id.id,
        userSelections: []
      }
      gameRun.prompts = await getGamePrompts(gameRun.promptsId)
      gameRun.userSelections = await getUserSelections(gameRun.userSelectionsId)
      setIsLoading(false)
      setGameRun(gameRun)
      if (!gameRun.isFinished) {
        await new Promise(r => setTimeout(r, 3000))
        await getGameObject(objectId)
      }
    }
  }

  const getGamePrompts = async (objectId: string): Promise<GamePrompt[]> => {
    const dynamicFields = await client.getDynamicFields({
      parentId: objectId,
    })
    const prompts: GamePrompt[] = []
    for (const d of dynamicFields.data) {
      const object = await getObject(d.objectId)
      const content: SuiParsedData | null | undefined = object.data?.content
      if (content && ((content["fields"] || {})["value"] || {})["fields"]) {
        const fields = content["fields"]["value"]["fields"]
        prompts.push({
          id: d.objectId,
          index: parseInt(content["fields"].name),
          imageUrl: fields.image_url,
          content: fields.content,
        })
      }
    }
    return prompts.sort((d1, d2) => d1.index - d2.index)
  }

  const getUserSelections = async (objectId: string): Promise<UserSelection[]> => {
    const dynamicFields = await client.getDynamicFields({
      parentId: objectId,
    })
    const selections: UserSelection[] = []
    for (const d of dynamicFields.data) {
      const object = await getObject(d.objectId)
      const content: SuiParsedData | null | undefined = object.data?.content
      if (content && content.fields) {
        const fields = content.fields
        selections.push({
          id: d.objectId,
          index: parseInt(content["fields"].name),
          selection: fields.value,
        })
      }
    }
    return selections.sort((d1, d2) => d1.index - d2.index)
  }

  const onNewSelection = (selection: number) => {
    if (gameRun && gameRun.userSelections) {
      gameRun.userSelections.push({
        id: undefined,
        index: gameRun.userSelections.length - 1,
        selection: selection,
      })
      setGameRun(gameRun)
    }
  }

  return <>
    <div className="flex flex-col gap-y-2 w-full pt-10 pb-32">
      {(gameRun && !isLoading) &&
        <GameDisplay
          game={gameRun}
          network={network}
          onNewSelection={onNewSelection}
          connectedAccount={connectedAccount}
        />
      }
      {isLoading && <ProgressBar duration={10} message="Starting game..."/>}
    </div>

  </>
}

const GameDisplay = ({game, network, onNewSelection, connectedAccount}: {
  game: Game,
  network: Network,
  onNewSelection: (selection: number) => void,
  connectedAccount: string,
}) => {

  let [isSelectionLoading, setIsSelectionLoading] = useState<boolean>(false)

  const onSelection = async (selection: number): Promise<void> => {
    setIsSelectionLoading(true)
    const response = await fetch(
      "/api/selectGame",
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
          selection: selection,
          gameIndex: game.index,
        }),
      }
    )
    if (response.ok && (await response.json()).status) {
      setIsSelectionLoading(false)
      onNewSelection(selection)
    } else {
      setIsSelectionLoading(false)
    }
  }

  return <>
    <div className="flex flex-col gap-y-10 pt-10">
      {game && <>
        {game.prompts.map((d, i) =>
          <div
            key={d.id}
            className="flex flex-col gap-10 pt-10 border-t-2 bg-brand-bluedark p-1 lg:p-4 border-white"
          >
            <div className="whitespace-pre-line bg-[#111723] bg-opacity-80 p-4">
              {d.imageUrl &&
                <img
                  className="mx-auto pt-10 h-auto w-full md:float-right md:w-96 xl:w-1/3"
                  src={d.imageUrl}
                  alt={`Story illustration ${i}`}
                  width={1000}
                  height={1000}
                />
              }
              <div>{d.content}</div>
            </div>
            {(!game.isFinished && game.userSelections.length < (i + 1) && connectedAccount === game.ethAddress) &&
              <>
                {isSelectionLoading ?
                  <ProgressBar duration={10} message="Executing your choice..." />
                  :
                  <Selector onSelection={onSelection}/>
                }
              </>
            }
            {game.userSelections.length > i &&
              <div className="p-4">
                User selection: {SELECTIONS[game.userSelections[i].selection]}
                <div className="pt-2">
                  {(game.userSelections.length > i && game.userSelections[i].id) &&
                    <ExplorerLinks objectId={game.userSelections[i].id || ""} type={"object"} network={network}/>
                  }
                </div>
              </div>
            }
            <div className="flex flex-col gap-2 p-4 lg:p-0">
              <div>Index: {d.index}</div>
              <div className="flex flex-col lg:flex-row gap-2 items-start lg:items-center">
                <span className="text-xs hidden lg:inline">Player: {d.id}</span>
                <span className="text-xs inline lg:hidden">Player: {d.id.slice(0, 10)}...</span>
                <ExplorerLinks objectId={d.id} type={"object"} network={network}/>
              </div>
            </div>
          </div>
        )}

        {(!game.isFinished && game.prompts.length == game.userSelections.length) && <ProgressBar duration={10} message="Waiting for VitAIlik's move..." />}
        {game.isFinished &&
          <div className="w-full text-center">
            Thank you for playing!
            <br/>
            To play again just refresh the page!
          </div>
        }
      </>
      }
      
      <div className="bg-brand-bluedark p-4 border-t-2 border-white">
      <h1 className={"text-4xl " + FONT.className}>
        Game details
      </h1>
      <div className="flex flex-col gap-5 pt-5">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="hidden lg:inline">Object id: {game.id}</div>
          <div className="inline lg:hidden">Object id: {game.id.slice(0, 10)}...</div>
          <ExplorerLinks objectId={game.id} type={"object"} network={network}/>
        </div>
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="hidden lg:inline">Player: {game.ethAddress}</div>
          <div className="inline lg:hidden">Player: {game.ethAddress.slice(0, 10)}...</div>
          <ExplorerLinks objectId={game.player} type={"address"} network={network}/>
        </div>
        <div className="flex flex-row gap-5">

        </div>
        <div className="flex flex-row gap-5">
          <div><span className="text-blue-200">Status:</span> {game.isFinished ? "Finished" : "Running"}</div>
        </div>
      </div>
    </div>

    </div>
  </>
}

const Selector = ({onSelection}: { onSelection: (selection: number) => Promise<void> }) => {

  return <div className="flex flex-col gap-6 p-6">
    Choose your next step!
    <div className="hidden lg:flex flex-row gap-12">
      {SELECTIONS.map((selection: string, i: number) =>
        <div
          className="border-2 rounded p-4 cursor-pointer hover:bg-white hover:text-black duration-150"
          key={`selection-${i}`}
          onClick={() => onSelection(i)}
        >
          {selection}
        </div>
      )}
    </div>
    <div className="flex lg:hidden flex-col gap-12">
      {SELECTIONS.map((selection: string, i: number) =>
        <div
          className="border-2 rounded p-4 cursor-pointer hover:bg-white hover:text-black duration-150"
          key={`selection-${i}`}
          onClick={() => onSelection(i)}
        >
          {selection}
        </div>
      )}
    </div>
  </div>
}

