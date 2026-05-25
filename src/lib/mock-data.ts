import { Meal } from "@/src/types/meal";

export const dashboardStats = [
  { title: "Calories", value: "1200 kcal" },
  { title: "Protein", value: "85 g" },
  { title: "Water", value: "2.5 L" },
];

export const recentMeals: Meal[] = [
  {
    id: 1,
    name: "Oats with Banana",
    calories: 320,
    protein: 12,
    carbs: 50,
    fat: 5,
    fiber: 8,
    time: "8:00 AM",
  },
  {
    id: 2,
    name: "Chicken Rice Bowl",
    calories: 540,
    protein: 35,
    carbs: 60,
    fat: 15,
    fiber: 5,
    time: "1:00 PM",
  },
];
