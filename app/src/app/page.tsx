'use client';
import { useEffect, useState } from 'react';
import { useMonacoProgram } from '@/hooks/useMonacoProgram';

export default function Home() {
  const program = useMonacoProgram();
  const [markets, setMarkets] = useState<any[]>([]);

  useEffect(() => {
    const fetchMarkets = async () => {
      if (!program) return;
      const result = await program.account.market.all();
      setMarkets(result);
    };

    fetchMarkets();
  }, [program]);

  return (
    <div>
      <h1>Active Markets</h1>
      {markets.map((market, idx) => (
        <div key={idx}>
          <h2>{market.account.name}</h2>
          <p>Market Key: {market.publicKey.toBase58()}</p>
        </div>
      ))}
    </div>
  );
}
