"use client"


import {QueryClient} from "@tanstack/query-core";
import {QueryClientProvider} from "@tanstack/react-query";
import {ScoreboardPage} from "@/components/scoreboard/scoreboard";


const queryClient = new QueryClient()

export default function Scoreboard() {


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ScoreboardPage/>
      </QueryClientProvider>
    </>
  )
}
