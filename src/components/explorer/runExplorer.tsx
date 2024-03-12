import {useEffect, useState} from "react"
import {FONT} from "@/fonts/fonts";
import ProgressBar from "../ProgressBar";
import {BrowserProvider, Contract} from "ethers";
import {ABI} from "@/types/network";
import {useWeb3ModalAccount, useWeb3ModalProvider} from '@web3modal/ethers/react'


interface Props {
  gameId: number
  connectedAccount: string
}

interface Message {
  role: string
  content: string
  selection?: string
  imageUrl?: string
}

interface Game {
  id: number
  player: string
  messages: Message[]
  imageUrls: string[]
  isFinished: boolean
}

function replaceViilikAndRemoveImageLines(description: string): string {
  const lines = description.split('\n');
  const processedLines = lines.filter(line => !line.startsWith('[IMAGE]'))
    .map(line => line.replace(/viilik/gi, 'VitAIlik'));
  return processedLines.join('\n');
}

const SELECTIONS = ["A", "B", "C", "D"]

export const RunExplorer = ({gameId, connectedAccount}: Props) => {
  const {walletProvider} = useWeb3ModalProvider()
  const {address, isConnected} = useWeb3ModalAccount()

  let [contract, setContract] = useState<Contract | undefined>()

  let [isLoading, setIsLoading] = useState<boolean>(false)
  let [isWaitingPrompt, setIsWaitingPrompt] = useState<boolean>(false)
  let [gameRun, setGameRun] = useState<Game | undefined>()

  useEffect(() => {
    setIsLoading(true)
    getGame(gameId)
  }, [gameId])

  const getGame = async (gameId: number) => {
    setIsLoading(false)
    let currentGameRun: Game | undefined = gameRun
    if (!currentGameRun) {
      currentGameRun = {
        id: gameId,
        player: address || "",
        messages: [],
        imageUrls: [],
        isFinished: false,
      }
    }
    let contractInstance = contract
    if (!contractInstance && walletProvider) {
      const ethersProvider = new BrowserProvider(walletProvider)
      const signer = await ethersProvider.getSigner()
      const newContract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer)
      setContract(newContract)
      contractInstance = newContract
    }
    if (contractInstance) {
      const messages = await contractInstance.getMessages(address, gameId)
      const roles = await contractInstance.getRoles(address, gameId)
      const images = await contractInstance.getImages(gameId)
      const game = await contractInstance.games(gameId)
      currentGameRun.isFinished = game[3]
      let imageIndex: number = 0
      const formattedMessages: Message[] = []
      for (let i = 0; i < messages.length; i++) {
        // Skip system prompt and first user "start" message
        if (i > 1) {
          if (roles[i] !== "user") {
            const newMessage: Message = {
              role: roles[i],
              content: messages[i]
            }
            if (images.length > imageIndex && newMessage.content.includes("[IMAGE")) {
              newMessage.imageUrl = images[imageIndex]
              imageIndex++
            }
            formattedMessages.push(newMessage)
          } else if (formattedMessages.length) {
            formattedMessages[formattedMessages.length - 1].selection = messages[i]
          }
        }
      }
      currentGameRun.messages = formattedMessages
      if (
        !gameRun
        || gameRun.messages.length !== currentGameRun.messages.length
        || gameRun.isFinished != currentGameRun.isFinished
      ) {
        setGameRun(currentGameRun)
      }
      const messagesCount = currentGameRun.messages.length
      let lastMessage = currentGameRun.messages.at(-1)
      if (!messagesCount || (!currentGameRun.isFinished && lastMessage && lastMessage.selection)) {
        setIsWaitingPrompt(true)
      } else {
        setIsWaitingPrompt(false)
      }
    }
    if (!currentGameRun.isFinished) {
      await new Promise(r => setTimeout(r, 3000))
      await getGame(gameId)
    }
  }

  const onNewSelection = (selection: number) => {
    let lastMessage = gameRun?.messages.at(-1)
    if (lastMessage) {
      lastMessage.selection = ["A", "B", "C", "D"][selection]
      setGameRun(gameRun)
    }
  }

  return <>
    <div className="flex flex-col gap-y-2 w-full pt-10 pb-32">
      {(gameRun && !isLoading) &&
        <GameDisplay
          game={gameRun}
          onNewSelection={onNewSelection}
          connectedAccount={connectedAccount}
          isWaitingPrompt={isWaitingPrompt}
        />
      }
      {isLoading && <ProgressBar duration={10} message="Starting game..."/>}
    </div>

  </>
}

const GameDisplay = ({game, onNewSelection, connectedAccount, isWaitingPrompt}: {
  game: Game,
  onNewSelection: (selection: number) => void,
  connectedAccount: string,
  isWaitingPrompt: boolean,
}) => {
  const {walletProvider} = useWeb3ModalProvider()

  let [isSelectionLoading, setIsSelectionLoading] = useState<boolean>(false)

  const onSelection = async (selection: number): Promise<void> => {
    if (!walletProvider) return
    setIsSelectionLoading(true)
    const ethersProvider = new BrowserProvider(walletProvider)
    const signer = await ethersProvider.getSigner()
    const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "", ABI, signer)
    const tx = await contract.addSelection(selection, game.id)
    const receipt = await tx.wait()
    if (receipt.status) {
      setIsSelectionLoading(false)
      onNewSelection(selection)
    } else {
      setIsSelectionLoading(false)
    }
  }

  return <>
    <div className="flex flex-col gap-y-10 pt-10">
      {game && <>
        {game.messages.map((d, i) =>
          <div
            key={`message-${i}`}
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
              <div>{replaceViilikAndRemoveImageLines(d.content)}</div>
            </div>
            {(!game.isFinished && !d.selection) &&
              <>
                {isSelectionLoading ?
                  <ProgressBar duration={10} message="Executing your choice..."/>
                  :
                  <Selector onSelection={onSelection}/>
                }
              </>
            }
            {d.selection &&
              <div className="p-4">
                User selection: {d.selection}
              </div>
            }
          </div>
        )}

        {isWaitingPrompt &&
          <ProgressBar duration={10} message="Waiting for VitAIlik's move..."/>}
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
            <div>Game id: {game.id}</div>
          </div>
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="hidden lg:inline">Player: {game.player}</div>
            <div className="inline lg:hidden">Player: {game.player.slice(0, 10)}...</div>
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

