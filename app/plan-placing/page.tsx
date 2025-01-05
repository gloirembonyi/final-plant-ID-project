//app/plan-placing/page.tsx

"use client";
import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import PlanSelector from './PlanSelector';
import StripePaymentForm from './StripePaymentForm';
import { Plan } from '@/types/Plan';

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: ['Basic features', 'Limited storage', 'Email support'],
    buttonText: 'Start Free',
    buttonLink: './plant-identifier'
  },
  {
    id: 'pro-monthly',
    name: 'Pro Monthly',
    price: 9.99,
    interval: 'month',
    features: ['All Free features', 'Advanced tools', 'Priority support'],
    popular: true,
    buttonText: 'Start Pro Monthly',
    buttonLink: '/checkout?plan=pro-monthly'
  },
  {
    id: 'pro-yearly',
    name: 'Pro Yearly',
    price: 99.99,
    interval: 'year',
    features: ['All Pro Monthly features', '2 months free', 'Annual reporting'],
    buttonText: 'Start Pro Yearly',
    buttonLink: '/checkout?plan=pro-yearly'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 199.99,
    interval: 'year',
    features: ['All Pro features', 'Dedicated account manager', 'Custom integrations'],
    buttonText: 'Contact Sales',
     buttonLink: '/contact-sales'
  }
];

const LoadingAnimation = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = (plan: Plan) => {
    setLoading(true);
    setSelectedPlan(null);
    
    // Simulate a delay to show the loading animation
    setTimeout(() => {
      setSelectedPlan(plan);
      setLoading(false);
    }, 1500); 
  };

  return (
    <div className="bg-gradient-to-br from-[#101329] to-[#222c3c] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Choose Your Plan - Plant Identifier</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <PlanSelector 
          plans={plans} 
          selectedPlan={selectedPlan} 
          onSelectPlan={handlePlanSelect} 
        />
        {loading && (
          <div className="mt-12">
            <LoadingAnimation />
          </div>
        )}
        {!loading && selectedPlan && (
          <div className="mt-12 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4 text-white">Checkout</h2>
            {selectedPlan.price > 0 ? (
              <StripePaymentForm plan={selectedPlan} />
            ) : (
              <div>
                <p className="text-lg mb-4 text-gray-300">You&apos;ve selected the {selectedPlan.name} plan. No payment is required.</p>
                <Link
                  href={selectedPlan.buttonLink}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
                >
                  {selectedPlan.buttonText}
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}