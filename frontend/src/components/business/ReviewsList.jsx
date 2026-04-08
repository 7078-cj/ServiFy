import { useEffect, useState } from "react"
import BusinessAvatar from "./BusinessAvatar"
import StarRating from "./StarRating"
import AddReview from "./AddReview"
import { Pencil, Trash2, X } from "lucide-react" 
import {useReviewListener } from "../../listeners/reviewListener"

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function ReviewsList({ 
    reviews, 
    onAddReview, 
    onUpdateReview, 
    onDeleteReview, 
    currentUser,
    businessId
}) {
    const [editingId, setEditingId] = useState(null);
    const [rawReviews, setRawReviews] = useState(reviews || []);

    useEffect(() => {
        setRawReviews(reviews || []);
    }, [reviews]);

    const handleUpdate = async (reviewId, data) => {
        await onUpdateReview(reviewId, data);
        setEditingId(null); 
    };

    useReviewListener(businessId, setRawReviews);

    return (
        <section className="max-w-2xl mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">User Reviews</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                    {rawReviews?.length || 0} Total
                </span>
            </div>

            {/* Only show "Add Review" if not currently editing another one */}
            {!editingId && <AddReview onSubmit={onAddReview} />}

            <div className="space-y-4">
                {rawReviews.map((rev, i) => {
                    const isAuthor = currentUser?.id === rev.author?.id;
                    const isEditing = editingId === rev.id;

                    return (
                        <div
                            key={rev.id ?? i}
                            className="group bg-white p-5 rounded-2xl border border-gray-100 hover:border-blue-100 transition-colors"
                        >
                            {isEditing ? (
                                <div className="relative">
                                    <button 
                                        onClick={() => setEditingId(null)}
                                        className="absolute right-0 top-0 text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={18} />
                                    </button>
                                    <AddReview 
                                        onSubmit={(data) => handleUpdate(rev.id, data)} 
                                        initialData={{ rate: rev.rate, message: rev.message }}
                                        buttonText="Update Review"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-start gap-4">
                                    <div className="mt-1">
                                        <BusinessAvatar
                                            name={rev.author?.first_name ?? "A"}
                                            imageUrl={rev.author?.profile?.profile_image ? `${media_url}${rev.author.profile.profile_image}` : undefined}
                                            size="md"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">
                                                    {rev.author?.first_name
                                                        ? `${rev.author.first_name} ${rev.author.last_name ?? ""}`
                                                        : "Anonymous User"}
                                                </p>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold">
                                                    Verified Customer
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <StarRating rating={rev.rate} />
                                                
                                                {/* Edit/Delete Actions */}
                                                {isAuthor && (
                                                    <div className="flex gap-2 ml-2 border-l pl-3 border-gray-100">
                                                        <button 
                                                            onClick={() => setEditingId(rev.id)}
                                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                                        >
                                                            <Pencil size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => onDeleteReview(rev.id)}
                                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {rev.message && (
                                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                                "{rev.message}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    )
}