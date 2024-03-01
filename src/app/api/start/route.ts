import {TransactionBlock} from '@mysten/sui.js/transactions';
import {getFullnodeUrl, Network, NETWORK_IDS} from "@/types/network";
import {Ed25519Keypair} from '@mysten/sui.js/keypairs/ed25519';
import {fromHEX} from '@mysten/sui.js/utils';
import {SuiClient} from "@mysten/sui.js/client";

export const runtime = 'edge'


export async function POST(req: Request): Promise<Response> {
  const {address} = await req.json()
  if (!address) {
    return new Response(
      JSON.stringify({
        gameId: null,
        error: "No address"
      }),
      {
        headers: {'Content-Type': 'application/json'},
      });
  }
  console.log("address")
  console.log(address)
  const gameId = await startGame(address)
  return new Response(
    JSON.stringify({
      gameId
    }),
    {
      headers: {'Content-Type': 'application/json'},
    });
}

async function startGame(ethAddress: string): Promise<string | null> {
  let network: Network = (process.env.NEXT_PUBLIC_NETWORK || "localnet") as Network
  const rpcUrl = getFullnodeUrl(network);

  const client = new SuiClient({url: rpcUrl});

  const keypair = Ed25519Keypair.fromSecretKey(fromHEX(process.env.PRIVATE_KEY || ""));

  const txb = new TransactionBlock()
  const packageName: string = "rpg"
  const functionName: string = "start_game"
  txb.moveCall({
    target: `${NETWORK_IDS[network].packageId}::${packageName}::${functionName}`,
    // object IDs must be wrapped in moveCall arguments
    arguments: [
      txb.pure.string(ethAddress),
      txb.object(NETWORK_IDS[network].registryObjectId),
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
  console.log("start TX resul")
  console.log(result)
  let gameId: string | null = null;
  (result.objectChanges || []).forEach((o: any) => {
    if (o.objectType.includes("Game") && !o.objectType.includes("GamesRegistry")) {
      gameId = o.objectId
    }
  })
  return gameId
}