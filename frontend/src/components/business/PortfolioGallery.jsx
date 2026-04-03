import { useState } from "react"
import { X } from "lucide-react"
import { Dialog, DialogContent } from "../../../components/ui/dialog"

const BASE_URL = import.meta.env.VITE_MEDIA_URL

export default function PortfolioGallery({ portfolio }) {
    const [selected, setSelected] = useState(null)

    if (!portfolio?.length) return null

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Portfolio
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {portfolio.map((item) => (
            <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 group focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <img
                src={`${BASE_URL}/${item.photo}`}
                alt="Portfolio item"
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
            </button>
            ))}
        </div>

        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
            <DialogContent className="max-w-2xl p-2 bg-black border-0">
            {selected && (
                <img
                src={`${BASE_URL}/${selected.photo}`}
                alt="Portfolio preview"
                className="w-full max-h-[80vh] object-contain rounded-lg"
                />
            )}
            </DialogContent>
        </Dialog>
        </section>
    )
}