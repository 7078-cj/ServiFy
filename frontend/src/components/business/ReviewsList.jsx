import BusinessAvatar from "./BusinessAvatar"
import StarRating from "./StarRating"

export default function ReviewsList({ reviews }) {
    if (!reviews?.length) return null

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Reviews
        </h2>

        <div className="flex flex-col gap-4">
            {reviews.map((rev, i) => (
            <div
                key={rev.id ?? i}
                className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
                <div className="flex items-start gap-3">
                <BusinessAvatar
                    name={rev.user?.first_name ?? "A"}
                    size="sm"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-gray-700">
                        {rev.user?.first_name
                        ? `${rev.user.first_name} ${rev.user.last_name ?? ""}`
                        : "Anonymous"}
                    </p>
                    <StarRating rating={rev.rating} />
                    </div>
                    {rev.comment && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {rev.comment}
                    </p>
                    )}
                </div>
                </div>
            </div>
            ))}
        </div>
        </section>
    )
}