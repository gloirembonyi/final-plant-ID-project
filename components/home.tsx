'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';  // Changed from 'next/router'
import Navigation from '@/components/Navigation';

// Rest of your component code...


export default function Home() {

  const router = useRouter();

  // useEffect(() => {
  //   router.push('/plant-identifier');
  // }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] to-[#081C15] text-white">
      
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
          <Link href="/plant-identifier" className="bg-[#52B788] text-white px-6 py-3 rounded-lg hover:bg-[#3E8E69] transition">
            Start Identifying
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#081C15]/80">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-thin text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add steps here */}
          </div>
        </div>
      </section>

      {/* Featured Plants Carousel */}
      {/* User Testimonials */}
      {/* Latest Blog Posts */}
      {/* Newsletter Signup */}
    </div>
  );
}