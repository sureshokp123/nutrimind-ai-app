import { supabase } from "./supabase";

export async function saveMealToDB(meal: {
    name: string;
    calories: number;
    protein: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
    image_url?: string;
}) {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not logged in");

    const { error } = await supabase.from("meals").insert({
        user_id: user.id,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        image_url: meal.image_url || "",
        carbs: meal.carbs || 0,
        fat: meal.fat || 0,
        fiber: meal.fiber || 0,

    });


    if (error) throw error;
}

export async function getMealsFromDB() {
    const { data, error } = await supabase
        .from("meals")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) throw error;

    return data;
}

export async function deleteMealFromDB(id: number) {
    const { error } = await supabase
        .from("meals")
        .delete()
        .eq("id", id);

    if (error) throw error;
}

export async function clearAllMealsFromDB() {
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("User not logged in");

    const { error } = await supabase
        .from("meals")
        .delete()
        .eq("user_id", user.id);

    if (error) throw error;
}
