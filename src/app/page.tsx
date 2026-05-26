import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">NutriMeal Analyzer AI</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your personal AI nutrition coach
      </p>

      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="rounded-lg bg-black text-white px-6 py-3"
        >
          Open Dashboard
        </Link>

        <Link
          href="/upload-meal"
          className="rounded-lg border px-6 py-3"
        >
          Upload Meal
        </Link>
      </div>
    </main>
  );
}
