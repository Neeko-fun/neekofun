// utils/anchorProvider.ts
import { Connection } from "@solana/web3.js";
import { AnchorProvider } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import PREDICTION_MARKET_IDL from "../idls/prediction-market.json";

export const getProvider = (wallet: any) => {
  const connection = new Connection("https://api.devnet.solana.com"); // or your cluster
  return new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
};

export const getProgram = (wallet: any) => {
  const provider = getProvider(wallet);
  return new Program(PREDICTION_MARKET_IDL as any, provider);
};
