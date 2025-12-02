import { Star } from "lucide-react";

export function RatingStars({ rating = 0, reviews = 0, onRate }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={20}
          onClick={() => onRate && onRate(i + 1)}
          className={`cursor-pointer ${
            i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
      {reviews > 0 && !onRate && (
        <span className="ml-2 text-sm text-gray-500">({reviews} reviews)</span>
      )}
    </div>
  );
}
