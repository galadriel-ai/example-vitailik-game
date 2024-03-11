"use client"


import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";


const queryClient = new QueryClient()

export default function Scoreboard() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/*<ScoreboardPage network={currentNetwork || DEFAULT_NETWORK}/>*/}
        TODO
      </QueryClientProvider>
    </>
  )
}
