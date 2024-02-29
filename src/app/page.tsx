import Link from 'next/link';

export default function Page() {
    return <>
      <div className="text-center font-PPMondwest mt-40"
        >
        <p className="text-6xl my-5">Battle with on-chain AI "VitAIlik"</p>
        <p className="text-2xl">and</p>
        <p className="text-7xl mt-5">win <span className="text-brand-neongreen">1000 USDC</span></p>

        <button
          className="p-3 px-5 font-PPMondwest font-bold text-2xl bg-brand-neongreen text-brand-bluedark my-20"
        >
          Connect 2 Battle
        </button>

        <div className="text-lg">
          <p>competition until end of ETHDenver</p>
          <p>anyone can play</p>
        </div>
      </div>
    </>
  }
