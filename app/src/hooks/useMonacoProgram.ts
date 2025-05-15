import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { AnchorProvider, Program } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../../idls/monacoProtocol/0.12.0.json';

export const useMonacoProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const provider = new AnchorProvider(connection, wallet!, {
    commitment: 'confirmed',
  });

  const program = new Program(
    idl as any,
    new PublicKey('monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih'), // replace with actual ID
    provider
  );

  return program;
};
