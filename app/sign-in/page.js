'use client';

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CustomSignInPage() {
  const router = useRouter();
  const { isLoaded, userId } = useAuth();
  const [error, setError] = useState("");

  // Memoize handleRedirect to prevent infinite loops
  const handleRedirect = useCallback(async () => {
    try {
      router.push("/plan-placing");
    } catch (error) {
      console.error("Redirection error:", error);
      setError("An error occurred during redirection. Please try again.");
    }
  }, [router]);

  useEffect(() => {
    if (isLoaded && userId) {
      handleRedirect();
    }
  }, [isLoaded, userId, handleRedirect]); // Add handleRedirect to dependencies

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Continue
          </h2>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-green-600 hover:bg-green-700 text-sm normal-case",
            },
          }}
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          redirectUrl="/plan-placing"
          afterSignInUrl="/plan-placing"
        />
      </div>
    </div>
  );
}


// 'use client';

// import Navigation from '@/components/Navigation';
// import React, { useState } from 'react';
// import api from '../utils/api';
// import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/users/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       // Redirect to main page or update app state
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
//       <div className="bg-white p-8 rounded-lg shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
//         <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Login</h2>
//         <form onSubmit={handleLogin} className="space-y-6">
//           <div className="relative">
//             <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="Email"
//               required
//               className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 text-gray-800 outline-none focus:border-indigo-500"
//             />
//           </div>
//           <div className="relative">
//             <FaLock className="absolute top-3 left-3 text-gray-400" />
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               placeholder="Password"
//               required
//               className="w-full pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 text-gray-800 outline-none focus:border-indigo-500"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full flex justify-center items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-colors duration-300"
//           >
//             <FaSignInAlt className="mr-2" />
//             Login
//           </button>
//         </form>
//         <div className="mt-6 text-center">
//           <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-300">Forgot password?</a>
//         </div>
//       </div>
//     </div>
//   );
// }
