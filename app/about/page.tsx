
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';  // Changed from 'next/router'
import Navigation from '@/components/Navigation';

export default function About() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1B4332] to-[#081C15] text-black">

        <section className="relative h-screen flex items-center justify-center">
          <Image
            src="/about-plant.jpg"
            alt="Beautiful plant"
            layout="fill"
            objectFit="cover"
            className="absolute z-0"
          />
          <div className="container mx-auto px-4 relative z-10 text-center">
              <h1 className="text-4xl font-thin text-center mb-8">About Plant Identifier</h1>
            <div className="max-w-3xl mx-auto">
              <p className="mb-6">
                Plant Identifier is a cutting-edge AI-powered platform dedicated to helping plant enthusiasts, gardeners, and nature lovers identify and learn about various plant species.
              </p>
              <p className="mb-6">
                Our mission is to connect people with nature by providing accurate and instant plant identification, along with valuable information about plant care, characteristics, and interesting facts.
              </p>
              <p className="mb-6">
                Using advanced machine learning algorithms and a vast database of plant species, our application can quickly analyze images of plants and provide detailed information about them.
              </p>
              <h2 className="text-2xl font-thin mb-4">Our Team</h2>
              <p className="mb-6">
                We are a diverse group of botanists, developers, and AI specialists passionate about bridging the gap between technology and nature.
              </p>
              {/* Add team member profiles or additional sections as needed */}
            </div>
          </div>
          
        </section>
      </div>
    );
  }