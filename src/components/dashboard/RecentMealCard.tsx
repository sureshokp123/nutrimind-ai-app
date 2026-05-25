// src/components/dashboard/RecentMealCard.tsx
import { Meal } from "@/src/types/meal";

interface Props {
  meal: Meal;
  onDelete?: (id: number) => void;
}

export default function RecentMealCard({ meal, onDelete }: Props) {
  return (
    <div className="rounded-2xl border p-4 shadow-sm flex justify-between items-start">
      <div>
        <h3 className="font-semibold">{meal.name}</h3>
        <p>{meal.calories} kcal</p>
        <p>{meal.protein} g protein</p>
         <p>{meal.carbs} g carbs</p>
        <p>{meal.fat} g fat</p>
        <p>{meal.fiber} g fiber</p>
        <p className="text-sm text-gray-500">{meal.time}</p>
        {meal.image_url && (
        <img
          src={meal.image_url}
          alt={meal.name}
          className="h-40 w-full rounded-xl object-cover"
        />
      )}
      </div>     

      <button
        onClick={() => onDelete?.(meal.id)}
        className="text-sm border rounded-lg px-3 py-1"
      >
        Delete
      </button>
    </div>
  );
}
