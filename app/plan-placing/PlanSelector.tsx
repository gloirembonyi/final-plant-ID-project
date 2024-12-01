import React, { useState } from "react";
import Link from "next/link";
import { Plan } from "@/types/Plan";

interface PlanSelectorProps {
  plans: Plan[];
  selectedPlan: Plan | null;
  onSelectPlan: (plan: Plan) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({
  plans,
  selectedPlan,
  onSelectPlan,
}) => {
  const [activePro, setActivePro] = useState<'monthly' | 'yearly'>('monthly');

  const freePlan = plans.find(plan => plan.id === 'free');
  const proMonthly = plans.find(plan => plan.id === 'pro-monthly');
  const proYearly = plans.find(plan => plan.id === 'pro-yearly');
  const premiumPlan = plans.find(plan => plan.id === 'premium');

  const renderPlanCard = (plan: Plan | undefined, isProPlan: boolean = false) => {
    if (!plan) return null;

    return (
      <div
        className={`bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8 border-2 ${
          plan.popular ? "border-blue-400" : "border-transparent"
        } ${selectedPlan?.id === plan.id ? "ring-2 ring-blue-400" : ""} transition-all duration-300 hover:transform hover:scale-105`}
      >
        {plan.popular && (
          <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
            Most Popular
          </div>
        )}
        <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>
        <p className="text-4xl font-extrabold mb-6 text-white">
          ${plan.price}
          {plan.interval && (
            <span className="text-lg font-normal text-gray-300">/{plan.interval}</span>
          )}
        </p>
        <ul className="mb-8 text-gray-300">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center mb-3">
              <svg
                className="w-5 h-5 mr-3 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
        {isProPlan ? (
          <button
            onClick={() => onSelectPlan(plan)}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors duration-200 ${
              selectedPlan?.id === plan.id
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-400 text-white hover:bg-blue-500"
            }`}
          >
            {plan.buttonText}
          </button>
        ) : (
          <Link
            href={plan.buttonLink}
            className="w-full py-3 px-6 rounded-lg font-semibold text-lg bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 text-center block"
          >
            {plan.buttonText}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-[#101329] to-[#222c3c]">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-extrabold text-center text-white mb-12">Choose Your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {renderPlanCard(freePlan)}
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8 border-2 border-blue-400">
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-2 text-sm font-medium ${
                  activePro === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                } rounded-l-lg transition-colors duration-200`}
                onClick={() => setActivePro('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 text-sm font-medium ${
                  activePro === 'yearly' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'
                } rounded-r-lg transition-colors duration-200`}
                onClick={() => setActivePro('yearly')}
              >
                Yearly
              </button>
            </div>
            {renderPlanCard(activePro === 'monthly' ? proMonthly : proYearly, true)}
          </div>
          {renderPlanCard(premiumPlan)}
        </div>
      </div>
    </div>
  );
};

export default PlanSelector;