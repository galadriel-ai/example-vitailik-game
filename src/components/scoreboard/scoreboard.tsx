import {useState} from "react"
import {BuildWithGaladriel} from "../buildwithgaladriel";
import {ProgressBar} from "@/components/ProgressBar";
import Addresses from "../addresses";

interface Score {
  lastGame: string
  ethAddress: string;
  score: number;
  totalHp: number;
  totalTurns: number;
  gamesPlayed: number;
}

export function ScoreboardPage() {
  // const client = useSuiClient()
  //
  // let [isLoading, setIsLoading] = useState<boolean>(false)
  // let [scoreboard, setScoreboard] = useState<any | undefined>()
  //
  let [scores, setScores] = useState<Score[]>([])
  //
  // useEffect(() => {
  //   if (!scoreboard && !isLoading) {
  //     setIsLoading(true)
  //     getScoreboard()
  //   }
  // }, [network, client, scoreboard])
  //
  // const getScoreboard = async () => {
  //   console.log(network)
  //   const object = await getObject(NETWORK_IDS[network].scoreboardObjectId);
  //   const content: SuiParsedData | null | undefined = object.data?.content
  //   if (content && content["fields"]) {
  //     const tableId = content["fields"]["scores"]["fields"]["id"]["id"]
  //     const scores = await getTableData(tableId)
  //     setScores(scores)
  //   }
  // }
  //
  // const getObject = async (objectId: string) => {
  //   return await client.getObject({
  //     id: objectId,
  //     options: {
  //       showContent: true
  //     }
  //   })
  // }
  //
  // const getTableData = async (objectId: string): Promise<Score[]> => {
  //   const dynamicFields = await client.getDynamicFields({ parentId: objectId });
  //   const ethAddressData: { [key: string]: { gamesPlayed: number; totalHp: number; totalTurns: number, lastGame: string } } = {};
  //
  //   for (const d of dynamicFields.data) {
  //     const object = await getObject(d.objectId);
  //     const content: SuiParsedData | null | undefined = object.data?.content;
  //
  //     if (content && ((content["fields"] || {})["value"] || {})["fields"]) {
  //       const fields = content["fields"]["value"]["fields"];
  //       const ethAddress = fields.eth_address;
  //       const hpLeft = parseInt(fields.hp_left);
  //       const turns = parseInt(fields.turns);
  //
  //       // Initialize data for new ethAddress
  //       if (!ethAddressData[ethAddress]) {
  //         ethAddressData[ethAddress] = { gamesPlayed: 0, totalHp: 0, totalTurns: 0, lastGame: ""};
  //       }
  //
  //       // Update totals and counts
  //       ethAddressData[ethAddress].gamesPlayed += 1;
  //       ethAddressData[ethAddress].totalHp += hpLeft;
  //       ethAddressData[ethAddress].totalTurns += turns;
  //       ethAddressData[ethAddress].lastGame = d.objectId;
  //     }
  //   }
  //
  //   // Convert the accumulated data into the final scores array, including total HP and total turns
  //   const scores = Object.entries(ethAddressData).map(([ethAddress, data]) => ({
  //     ethAddress,
  //     score: Math.floor(data.totalHp / data.totalTurns * data.gamesPlayed),
  //     totalHp: data.totalHp,
  //     totalTurns: data.totalTurns,
  //     lastGame: data.lastGame,
  //     gamesPlayed: data.gamesPlayed,
  //   }));
  //
  //   // Optionally, sort the scores if needed
  //   return scores.sort((a, b) => b.score - a.score);
  // };

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
              <div className="basis-1/6 text-center">
                Player
              </div>
              <div className="basis-1/6 text-center">
                Total HP
              </div>
              <div className="basis-1/6 text-center">
                Turns
              </div>
              <div className="basis-1/6 text-center">
                Games
              </div>
              <div className="basis-1/6 text-center">
                Points
              </div>
              <div className="basis-1/6 text-center">
                Last Game
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
                <div className="basis-1/6 text-center">
                  <a
                    href={`https://etherscan.io/address/${s.ethAddress}`}
                    target="_blank"
                    className="hover:underline"
                  >
                    {s.ethAddress.slice(0, 7)}...
                  </a>
                </div>
                <div className="basis-1/6 text-center">
                  {s.totalHp}
                </div>
                <div className="basis-1/6 text-center">
                  {s.totalTurns}
                </div>
                <div className="basis-1/6 text-center">
                  {s.gamesPlayed}
                </div>
                <div className="basis-1/6 text-center">
                  {s.score}
                </div>
                <div className="basis-1/6 text-center">
                  {/*<a*/}
                  {/*  href={`https://suiscan.com/object/${s.lastGame}?network=${network}`}*/}
                  {/*  target={"_blank"}*/}
                  {/*  className="hover:underline"*/}
                  {/*>*/}
                  {/*  Suiscan*/}
                  {/*</a>*/}
                </div>
              </div>
            )}
          </div>
        </div>

        <div
          className={"flex w-full flex-col lg:flex-row lg:justify-between items-end text-xl p-4 lg:p-0 "}>
          <Addresses/>
          <BuildWithGaladriel />
        </div>
      </main>
    </>
  )
}
