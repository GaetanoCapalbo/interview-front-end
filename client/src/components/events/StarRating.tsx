import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

export default function StarRating({ value, onChange, disabled = false }: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleClick = (rating: number) => {
    if (!disabled) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!disabled) {
      setHoveredRating(rating);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };

  const displayRating = hoveredRating || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={disabled}
          className={cn(
            "transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded",
            disabled && "cursor-not-allowed"
          )}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "size-6 sm:size-8 transition-colors",
              star <= displayRating
                ? "text-yellow-500 fill-yellow-500"
                : "text-gray-300 dark:text-gray-600 fill-gray-300 dark:fill-gray-600",
              !disabled && "cursor-pointer hover:text-yellow-400 hover:fill-yellow-400"
            )}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm sm:text-base text-muted-foreground">
          {value}/5
        </span>
      )}
    </div>
  );
}

