import { Star } from "lucide-react"
import { useState } from "react"

export default function StarRating({ rating, onChange }) {
    const [hover, setHover] = useState(0)

    if (!rating && !onChange)
        return <span className="text-xs font-medium text-gray-400">No reviews yet</span>

    const value = parseFloat(rating) || 0

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((i) => {
                    // Logic: Use hover state if interacting, otherwise use the actual rating
                    const activeRating = hover || value
                    const isFilled = i <= Math.round(activeRating)

                    return (
                        <button
                            key={i}
                            type="button" // Prevents form submission
                            disabled={!onChange}
                            onMouseEnter={() => onChange && setHover(i)}
                            onClick={() => onChange && onChange(i)}
                            className={`transition-all duration-150 ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
                        >
                            <Star
                                className="w-5 h-5"
                                fill={isFilled ? "#f59e0b" : "transparent"}
                                stroke={isFilled ? "#f59e0b" : "#d1d5db"}
                                strokeWidth={isFilled ? 1 : 1.5}
                            />
                        </button>
                    )
                })}
            </div>

            {!onChange && (
                <span className="text-sm font-semibold text-gray-600 ml-1">
                    {value.toFixed(1)}
                </span>
            )}
        </div>
    )
}