import {TransactionBlock} from '@mysten/sui.js/transactions';
import {getFullnodeUrl, Network, NETWORK_IDS} from "@/types/network";
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';
import {fromHEX} from '@mysten/sui.js/utils';
import {SuiClient} from "@mysten/sui.js/client";

export const runtime = 'edge'


export async function POST(req: Request): Promise<Response> {
  const {selection, gameIndex} = await req.json()
  if (selection === undefined || gameIndex === undefined) {
    return new Response(
      JSON.stringify({
        gameId: null,
        error: "No selection or game index"
      }),
      {
        headers: {'Content-Type': 'application/json'},
      });
  }
  const status = await makeSelection(selection, gameIndex)
  return new Response(
    JSON.stringify({
      status
    }),
    {
      headers: {'Content-Type': 'application/json'},
    });
}

async function makeSelection(selection: number, gameIndex: number): Promise<boolean> {
  let network: Network = (process.env.NEXT_PUBLIC_NETWORK || "localnet") as Network
  const rpcUrl = getFullnodeUrl(network);

  const client = new SuiClient({url: rpcUrl});

  const keypair = Ed25519Keypair.fromSecretKey(fromHEX(process.env.PRIVATE_KEY || ""));

  const txb = new TransactionBlock()
  const packageName: string = "rpg"
  const functionName: string = "add_game_answer"
  txb.moveCall({
    target: `${NETWORK_IDS[network].packageId}::${packageName}::${functionName}`,
    // object IDs must be wrapped in moveCall arguments
    arguments: [
      txb.pure.u8(selection),
      txb.object(NETWORK_IDS[network].registryObjectId),
      txb.pure.u64(gameIndex),
    ],
  })
  const result = await client.signAndExecuteTransactionBlock(
    {
      signer: keypair,
      transactionBlock: txb,
      // chain: `sui:${process.env.NETWORK || "devnet"}`,
      options: {
        showObjectChanges: true
      }
    },
    // {
    //   onSuccess: (result: any) => {
    //     console.log("Executed transaction block");
    //     console.log(result);
    //     // (result.objectChanges || []).forEach((o: any) => {
    //     //   if (o.objectType.includes("Game") && !o.objectType.includes("GamesRegistry")) {
    //     //     setGameId(o.objectId)
    //     //   }
    //     // })
    //   },
    //   onError: (error: any) => {
    //     console.log("Transaction error")
    //     console.log(error)
    //   }
    // },
  );
  console.log("selection TX resul")
  console.log(result)
  // TODO: check status
  return true
}