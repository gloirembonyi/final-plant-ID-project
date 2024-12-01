

import Navigation from '../components/Navigation';
import '../styles/globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link';
import { Analytics } from "@vercel/analytics/react"

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plant Identifier',
  description: 'Identify plants using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <header className="bg-[#0a0520]/80 text-white backdrop-blur-sm sticky top-0 z-50 transition-all duration-300 ease-in-out border-b border-[#ff00ff]/20">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link href="/">
                <h1 className="text-3xl font-thin text-[#ff00ff] hover:text-[#00ffff] transition-colors duration-300 neon-text">PlantID</h1>
              </Link>
              <Navigation />
            </div>
          </header>

          <div className="fixed inset-0 opacity-10" style={{ zIndex: -1 }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
              <path fill="#4CAF50" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,149.3C672,149,768,171,864,170.7C960,171,1056,149,1152,144C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
    
}
