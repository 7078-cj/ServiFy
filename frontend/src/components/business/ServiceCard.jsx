import { Pencil, Trash2 } from "lucide-react"
import AddUpdateServiceModal from "./AddUpdateServiceModal";
import { useState } from "react";
import { putRequest, deleteRequest } from "../../utils/reqests/requests"
import { deleteService, updateService } from "../../api/services";

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function ServiceCard({
    svc,
    isOwner,
    onPreview,
    businessId,
    onRefresh 
}) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleUpdate = async (formData) => {
        await updateService(
            businessId,
            svc.id,
            formData,
            setLoading,
            setShowEditModal,
            onRefresh
        )
    }

    
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Delete this service?")
        if (!confirmDelete) return

        await deleteService(
            businessId,
            svc.id,
            setLoading,
            onRefresh
        )
    }

    return (
        <div className="flex gap-4 bg-gray-50 rounded-2xl p-4 hover:shadow-md transition-all group">
            {/* Image */}
            <div
                className="w-28 h-28 shrink-0 rounded-xl overflow-hidden bg-gray-200 cursor-pointer"
                onClick={() => svc.thumbnail && onPreview(svc)}
            >
                {svc.thumbnail ? (
                    <img
                        src={media_url + svc.thumbnail}
                        alt={svc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">
                        {svc.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-base font-semibold text-gray-800">
                            {svc.name}
                        </h3>

                        {/* Actions */}
                        {isOwner && (
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                                <button
                                    disabled={loading}
                                    className="text-gray-400 hover:text-blue-500"
                                    onClick={() => setShowEditModal(true)}
                                >
                                    <Pencil size={16} />
                                </button>

                                <button
                                    disabled={loading}
                                    className="text-gray-400 hover:text-red-500"
                                    onClick={handleDelete}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </div>

                    {svc.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {svc.description}
                        </p>
                    )}
                </div>

                {/* Bottom Meta */}
                <div className="flex items-end justify-between mt-3">
                    <div className="flex gap-6 text-xs text-gray-400">
                        {svc.price && (
                            <div>
                                <p className="uppercase text-[10px]">Rate</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    ₱{parseFloat(svc.price).toLocaleString(undefined, {
                                        minimumFractionDigits: 2,
                                    })}
                                </p>
                            </div>
                        )}

                        {svc.duration && (
                            <div>
                                <p className="uppercase text-[10px]">Time</p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {svc.duration}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            
            <AddUpdateServiceModal
                open={showEditModal}
                onClose={() => setShowEditModal(false)}
                service={svc}
                onSave={handleUpdate}
                loading={loading}
            />
        </div>
    )
}