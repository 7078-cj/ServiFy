import { useState } from "react"
import StarRating from "./StarRating"
import { createFormData } from "../../utils/form/form"

export default function AddReview({ onSubmit, initialData = null, buttonText = "Post Review" }) {
    const [rating, setRating] = useState(initialData?.rate || 0)
    const [comment, setComment] = useState(initialData?.message || "")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!rating) return
        setLoading(true)
        try {
            const data = {
                rate: rating,
                message: comment
            }
            
            await onSubmit(data)
            // Only clear if we're not in "edit mode" (optional, but cleaner)
            if (!initialData) {
                setRating(0)
                setComment("")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`group bg-white rounded-2xl p-5 transition-all ${
                initialData ? "" : "border border-gray-200 shadow-sm hover:shadow-md mb-8"
            }`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">
                    {initialData ? "Edit Your Review" : "Write a Review"}
                </h3>
                <StarRating rating={rating} onChange={setRating} />
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your experience? (Optional)"
                className="w-full text-sm p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none"
                rows={3}
            />

            <div className="flex justify-end mt-4">
                <button
                    type="submit"
                    disabled={loading || !rating}
                    className="relative px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : buttonText}
                </button>
            </div>
        </form>
    )
}