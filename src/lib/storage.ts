import { Meal } from "@/src/types/meal";

const STORAGE_KEY = "nutrimeal_analyzer_meals";

export function saveMeal(meal: Meal) {
  const existing = getMeals();
  const updated = [meal, ...existing];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function getMeals(): Meal[] {
  const meals = localStorage.getItem(STORAGE_KEY);
  return meals ? JSON.parse(meals) : [];
}

export function deleteMeal(id: number) {
  const updated = getMeals().filter((meal) => meal.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function clearMeals() {
  localStorage.removeItem(STORAGE_KEY);
}
