import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import ConfirmDialog from "../ui/ConfirmDialog"
import PortfolioPreviewModal from "./PortfolioPreviewModal"

const BASE_URL = import.meta.env.VITE_MEDIA_URL

export default function PortfolioGallery({
    portfolio,
    isOwner,
    onUpload,
    onDelete
}) {
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [pendingDeleteId, setPendingDeleteId] = useState(null)

    if (!portfolio?.length && !isOwner) return null

    const confirmDeletePhoto = () => {
        if (pendingDeleteId == null) return
        onDelete?.(pendingDeleteId)
        toast.success("Photo removed from portfolio.")
        setPendingDeleteId(null)
    }

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <ConfirmDialog
                open={pendingDeleteId != null}
                onClose={() => setPendingDeleteId(null)}
                title="Remove this photo?"
                description="It will be permanently removed from your portfolio."
                confirmText="Remove"
                danger
                onConfirm={confirmDeletePhoto}
            />
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Portfolio
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

                {/* Images */}
                {portfolio?.map((item, index) => (
                    <div key={item.id} className="relative group">
                        <button
                            onClick={() => setSelectedIndex(index)}
                            className="aspect-square w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50"
                        >
                            <img
                                src={`${BASE_URL}/${item.photo}`}
                                alt="Portfolio item"
                                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                        </button>

                        {/* DELETE */}
                        {isOwner && (
                            <button
                                type="button"
                                onClick={() => setPendingDeleteId(item.id)}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                ))}

                {/* UPLOAD */}
                {isOwner && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                        <Plus className="text-gray-400 mb-1" />
                        <span className="text-xs text-gray-400">Upload</span>

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                const files = Array.from(e.target.files)
                                if (files.length) onUpload(files)
                                e.target.value = null
                            }}
                        />
                    </label>
                )}
            </div>

            <PortfolioPreviewModal
                portfolio={portfolio}
                selectedIndex={selectedIndex}
                setSelectedIndex={setSelectedIndex}
            />
        </section>
    )
}