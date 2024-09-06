import React from "react";
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`bg-white rounded-lg shadow-md p-6 border-2 ${
            plan.popular ? "border-blue-500" : "border-transparent"
          } ${selectedPlan?.id === plan.id ? "ring-2 ring-blue-500" : ""}`}
        >
          {plan.popular && (
            <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full inline-block mb-2">
              Most Popular
            </div>
          )}
          <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
          <p className="text-3xl font-bold mb-4">
            ${plan.price}
            {plan.interval && (
              <span className="text-sm font-normal">/{plan.interval}</span>
            )}
          </p>
          <ul className="mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center mb-2">
                <svg
                  className="w-4 h-4 mr-2 text-green-500"
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
          {plan.price > 0 ? (
            <button
              onClick={() => onSelectPlan(plan)}
              className={`w-full py-2 px-4 rounded-md ${
                selectedPlan?.id === plan.id
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-600 hover:bg-blue-200"
              } transition-colors duration-200`}
            >
              {plan.buttonText}
            </button>
          ) : (
            <Link
              href={plan.buttonLink}
              className="w-full py-2 px-4 rounded-md bg-green-500 text-white hover:bg-green-600 transition-colors duration-200 text-center block"
            >
              {plan.buttonText}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlanSelector;
