"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/src/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-xl font-bold">NutriMeal Analyzer AI</h1>

      <div className="flex gap-4 items-center">
        <a href="/dashboard">Dashboard</a>
        <a href="/upload-meal">Upload Meal</a>

        <button
          onClick={handleLogout}
          className="border rounded-lg px-4 py-2"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
