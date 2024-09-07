"use client"; // Ensures this is a client component

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

export default function Checkout() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Choose Your Plan - Plant Identifier</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container  mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
        <PlanSelector plans={plans} selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />
        {selectedPlan && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
            {selectedPlan.price > 0 ? (
              <StripePaymentForm plan={selectedPlan} />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg mb-4">You've selected the {selectedPlan.name} plan. No payment is required.</p>
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
