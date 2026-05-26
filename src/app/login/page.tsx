"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthCard from "@/src/components/auth/AuthCard";
import { supabase } from "@/src/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthCard title="Login to NutriMeal Analyzer AI">
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
          onClick={handleLogin}
          className="w-full rounded-lg p-3 bg-black text-white"
        >
          Login
        </button>
      </AuthCard>
    </div>
  );
}
