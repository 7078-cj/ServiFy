import { MapPin, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import BusinessAvatar from "./BusinessAvatar"
import StarRating from "./StarRating"
import { Button } from "../ui/button"
import MessageButton from "./MessageButton"
import { deleteBusiness } from "../../api/business"
import { DeleteConfirmModal } from "./DeleteConfirmModal"

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function BusinessHeader({ business, setBusinessModalOpen }) {
    const { id, owner, logo, name, address, average_rating } = business
    const user = JSON.parse(localStorage.getItem("user")) || null
    const isOwner = user?.id === owner.id
    const navigate = useNavigate()

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const handleDelete = () => {
        deleteBusiness(id, setDeleting, () => {
            setShowDeleteModal(false)
            navigate("/")
        })
    }

    return (
        <>
            {showDeleteModal && (
                <DeleteConfirmModal
                    businessName={name}
                    onConfirm={handleDelete}
                    onCancel={() => setShowDeleteModal(false)}
                    loading={deleting}
                />
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

                {/* Cover */}
                <div className="h-32 bg-gradient-to-r from-[#0f6e84] to-blue-400" />

                <div className="px-5 pb-5">

                    {/* Avatar — overlapping cover */}
                    <div className="-mt-14 mb-4">
                        {logo ? (
                            <img
                                src={`${media_url}${logo}`}
                                alt={name}
                                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#0f6e84] to-blue-400 border-4 border-white shadow-md flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">
                                    {name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="text-lg font-semibold text-gray-900 leading-snug">{name}</h1>

                    {/* Address */}
                    {address && (
                        <p className="flex items-start gap-1.5 text-xs text-gray-500 mt-1.5">
                            <MapPin className="w-3.5 h-3.5 shrink-0 mt-px" />
                            <span>{address}</span>
                        </p>
                    )}

                    {/* Rating */}
                    <div className="mt-2.5">
                        <StarRating rating={average_rating} />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-4" />

                    {/* Owner pill */}
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                        <BusinessAvatar
                            imageUrl={owner.profile?.profile_image ? `${media_url}${owner.profile.profile_image}` : null}
                            name={`${owner.first_name} ${owner.last_name}`}
                            size="sm"
                        />
                        <div className="leading-tight min-w-0">
                            <p className="text-xs font-semibold text-gray-700 truncate">
                                {owner.first_name} {owner.last_name}
                            </p>
                            <p className="text-[11px] text-gray-400">Owner</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-3 flex flex-col gap-2">
                        {isOwner ? (
                            <>
                                <Button
                                    onClick={() => setBusinessModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-2"
                                >
                                    <Plus size={15} />
                                    Edit Business
                                </Button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete Business
                                </button>
                            </>
                        ) : (
                            user && <MessageButton providerId={owner.id} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}