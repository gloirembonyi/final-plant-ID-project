'use client';

import dynamic from 'next/dynamic';

const PlantIdentifier = dynamic(() => import('@/components/home'), { ssr: false });

export default function Home() {
  return (
    <main>
      <div>
        <PlantIdentifier />
      </div>
    </main>
  );
}