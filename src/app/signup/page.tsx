"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/src/components/auth/AuthCard";
import { supabase } from "@/src/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });


    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful. Please login.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthCard title="Create NutriMind Account">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <button
          onClick={handleSignup}
          className="w-full rounded-lg p-3 bg-black text-white"
        >
          Sign Up
        </button>
      </AuthCard>
    </div>
  );
}
