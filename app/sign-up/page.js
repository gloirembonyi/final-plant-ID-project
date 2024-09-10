'use client';

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SignUp
        path="/sign-up"
        routing="path"
        SignUpUrl="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/plan-placing"
        afterSignUpUrl="/plan-placing"
      />
    </div>
  );
}