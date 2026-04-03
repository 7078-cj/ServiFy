import { Star } from "lucide-react"

export default function StarRating({ rating }) {
    if (!rating)
        return <span className="text-xs text-gray-400">No reviews yet</span>

    const rounded = Math.round(parseFloat(rating))

    return (
        <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
            <Star
            key={i}
            className="w-3.5 h-3.5"
            fill={i <= rounded ? "#f59e0b" : "none"}
            stroke={i <= rounded ? "#f59e0b" : "#d1d5db"}
            />
        ))}
        <span className="text-xs text-gray-500 ml-1">
            {parseFloat(rating).toFixed(1)}
        </span>
        </div>
    )
}