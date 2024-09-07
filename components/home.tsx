'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function Home() {
  const router = useRouter();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Automatically redirect if the user is already authenticated
    if (isLoaded && userId) {
      router.push('/plant-identifier');
    }
  }, [isLoaded, userId, router]);

  const handleStartIdentifying = async () => {
    if (!isLoaded) {
      setError('Authentication is still loading. Please wait...');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (!userId) {
        // User is not signed in, redirect to sign-in page
        router.push('/sign-in');
      } else {
        // User is signed in, attempt to get a token
        const token = await getToken();
        if (token) {
          // Successfully got a token, proceed to plant identifier page
          router.push('/plant-identifier');
        } else {
          // Failed to get a token, ask user to sign in again
          setError('Session expired. Please sign in again.');
          router.push('/sign-in');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen -mt-24 bg-gradient-to-br from-[#1B4332] to-[#081C15] text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <Image
          src="/hero-plant.jpg"
          alt="Beautiful plant"
          layout="fill"
          objectFit="cover"
          className="absolute z-0"
        />
        <div className="relative z-10 text-center">
          <h1 className="text-6xl font-thin mb-4">Discover the World of Plants</h1>
          <p className="text-xl mb-8">Identify, learn, and care for plants with AI-powered technology</p>
          <button
            onClick={handleStartIdentifying}
            disabled={isLoading || !isLoaded}  // Disable button until authentication is loaded
            className={`bg-[#52B788] text-white px-6 py-3 rounded-lg hover:bg-[#3E8E69] transition ${
              isLoading || !isLoaded ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Loading...' : 'Start Identifying'}
          </button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </section>

      {/* Rest of the component remains the same */}
    </div>
  );
}
