"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveMealToDB } from "@/src/lib/mealService";
import { uploadMealImage } from "@/src/lib/storageService";

type AIResult = {
    name: string;
    calories: number;
    protein: number;
};

export default function MealUploadForm() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [previewUrl, setPreviewUrl] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");
    const [fiber, setFiber] = useState("");
    const [sugar, setSugar] = useState("");
    const [sodium, setSodium] = useState("");


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        if (file) {
            const localPreview = URL.createObjectURL(file);
            setPreviewUrl(localPreview);
        }
    };

    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                const result = reader.result as string;
                resolve(result.split(",")[1]);
            };

            reader.onerror = reject;
        });
    };


    const handleAnalyzeMeal = async () => {
        if (!image) return;

        try {
            setAnalyzing(true);

            const base64 = await fileToBase64(image);

            const res = await fetch("/api/analyze-meal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ base64 }),
            });

            const data = await res.json();

            console.log("FULL AI RESPONSE:", data);

            if (!res.ok) {
                alert(data.error || "AI request failed");
                return;
            }

            if (!data.result) {
                alert("AI result missing");
                return;
            }

            try {
                const cleaned = data.result
                    .replace(/```json/g, "")
                    .replace(/```/g, "")
                    .trim();

                const parsed = JSON.parse(cleaned);

                setName(parsed.name || "");
                setCalories(String(parsed.calories || ""));
                setProtein(String(parsed.protein || ""));
                setCarbs(String(parsed.carbs || ""));
                setFat(String(parsed.fat || ""));
                setFiber(String(parsed.fiber || ""));
                setSugar(String(parsed.sugar || ""));
                setSodium(String(parsed.sodium || ""));
            } catch (error) {
                console.error("JSON parse failed", data.result);
            }         

        } catch (error) {
            console.error(error);
        } finally {
            setAnalyzing(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            let imageUrl = "";

            // upload image if user selected one
            if (image) {
                imageUrl = await uploadMealImage(image);
            }

            await saveMealToDB({
                name,
                calories: Number(calories),
                protein: Number(protein),
                carbs: Number(carbs),
                fat: Number(fat),
                fiber: Number(fiber),
                image_url: imageUrl,
            });


            router.push("/dashboard");
            router.refresh();
        } catch (error) {
            console.error("Meal save failed", error);
            alert("Failed to save meal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mx-auto max-w-lg space-y-4 rounded-2xl border p-6 shadow-sm"
        >
            <h2 className="text-2xl font-bold">Upload Meal</h2>

            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border p-3"
            />

            {previewUrl && (
                <img
                    src={previewUrl}
                    alt="Meal preview"
                    className="h-48 w-full rounded-xl object-cover"
                />
            )}

            <button
                type="button"
                onClick={handleAnalyzeMeal}
                disabled={analyzing || !image}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white disabled:opacity-50"
            >
                {analyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
            <label className="block text-sm font-medium">Meal Name</label>
            <input
                type="text"
                placeholder="Meal name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border p-3"
                required
            />
            <label className="block text-sm font-medium">Calories</label>
            <input
                type="number"
                placeholder="Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full rounded-xl border p-3"
                required
            />
            <label className="block text-sm font-medium">Protein (g)</label>
            <input
                type="number"
                placeholder="Protein (g)"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full rounded-xl border p-3"
                required
            />
            <label className="block text-sm font-medium">Carbs (g)</label>
            <input
                type="number"
                placeholder="Carbs (g)"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                className="w-full rounded-xl border p-3"
            />
            <label className="block text-sm font-medium">Fat (g)</label>
            <input
                type="number"
                placeholder="Fat (g)"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                className="w-full rounded-xl border p-3"
            />
            <label className="block text-sm font-medium">Fiber (g)</label>
            <input
                type="number"
                placeholder="Fiber (g)"
                value={fiber}
                onChange={(e) => setFiber(e.target.value)}
                className="w-full rounded-xl border p-3"
            />
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-green-600 px-4 py-3 text-white disabled:opacity-50"
            >
                {loading ? "Saving..." : "Save Meal"}
            </button>
        </form>
    );
}
