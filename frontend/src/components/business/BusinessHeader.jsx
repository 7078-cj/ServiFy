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

            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-start gap-5 shadow-sm">
                <BusinessAvatar
                    name={name}
                    imageUrl={logo ? `${media_url}${logo}` : null}
                    size="lg"
                />

                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h1 className="text-xl font-semibold text-gray-900 truncate">{name}</h1>
                    </div>

                    {address && (
                        <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-2">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {address}
                        </p>
                    )}

                    <StarRating rating={average_rating} />
                </div>

                <div className="flex flex-col gap-4">
                    {/* Owner pill */}
                    <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-2 shrink-0">
                        <BusinessAvatar
                            imageUrl={owner.profile.profile_image ? `${media_url}${owner.profile.profile_image}` : null}
                            name={`${owner.first_name} ${owner.last_name}`}
                            size="sm"
                        />
                        <div className="leading-tight">
                            <p className="text-xs font-semibold text-gray-700">
                                {owner.first_name} {owner.last_name}
                            </p>
                            <p className="text-[11px] text-gray-400">Owner</p>
                        </div>
                    </div>

                    {isOwner ? (
                        <div className="flex flex-col gap-2">
                            <Button
                                onClick={() => setBusinessModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Edit Business
                            </Button>
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <Trash2 size={14} />
                                Delete Business
                            </button>
                        </div>
                    ) : (
                        user && <MessageButton providerId={owner.id} />
                    )}
                </div>
            </div>
        </>
    )
}