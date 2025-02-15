import React, { useState } from "react";

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>

        <input 
          type="email" 
          placeholder="Email" 
          className="w-full p-2 border rounded-md mb-3"
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full p-2 border rounded-md mb-3"
        />

        <button className="w-full bg-amber-400 p-2 rounded-md text-white font-semibold">
          {isSignUp ? "Create Account" : "Login"}
        </button>

        <p className="mt-3 text-center text-sm">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <span 
            className="text-blue-500 cursor-pointer font-semibold"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
