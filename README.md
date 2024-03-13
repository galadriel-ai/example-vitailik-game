# VitAIlik

This is a demo app for [Galadriel](https://galadriel.com) 

To see the contracts this app uses check this repo: [Contracts](https://github.com/galadriel-ai/contracts)

## Getting Started

```
npm install
cp template.env .env.local
```
Edit .env.local
`NEXT_PUBLIC_NETWORK` "local" defaults to `http://localhost:8545/`   
and anything else uses `https://testnet.galadriel.com/` as the RPC url

The contract addresses in template.env are for the testnet

## Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
