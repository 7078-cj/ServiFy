import { useEffect } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

const BASE_URL = import.meta.env.VITE_MEDIA_URL

export default function PortfolioPreviewModal({
    portfolio,
    selectedIndex,
    setSelectedIndex,
}) {
    const selected =
        selectedIndex !== null ? portfolio[selectedIndex] : null

    const close = () => setSelectedIndex(null)

    const next = () => {
        if (selectedIndex < portfolio.length - 1) {
            setSelectedIndex((prev) => prev + 1)
        }
    }

    const prev = () => {
        if (selectedIndex > 0) {
            setSelectedIndex((prev) => prev - 1)
        }
    }

    // Keyboard support
    useEffect(() => {
        const handleKey = (e) => {
            if (selectedIndex === null) return

            if (e.key === "ArrowRight") next()
            if (e.key === "ArrowLeft") prev()
            if (e.key === "Escape") close()
        }

        window.addEventListener("keydown", handleKey)
        return () => window.removeEventListener("keydown", handleKey)
    }, [selectedIndex])

    return (
        <Dialog open={selectedIndex !== null} onOpenChange={close}>
            <DialogContent className="max-w-4xl p-0 bg-black border-0 overflow-hidden">

                {selected && (
                    <div className="relative flex items-center justify-center">

                        {/* CLOSE */}
                        <button
                            onClick={close}
                            className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-red-500 text-white p-2 rounded-full"
                        >
                            <X size={18} />
                        </button>

                        {/* PREV */}
                        {selectedIndex > 0 && (
                            <button
                                onClick={prev}
                                className="absolute left-4 z-10 bg-black/60 text-white p-2 rounded-full"
                            >
                                <ChevronLeft size={22} />
                            </button>
                        )}

                        {/* NEXT */}
                        {selectedIndex < portfolio.length - 1 && (
                            <button
                                onClick={next}
                                className="absolute right-4 z-10 bg-black/60 text-white p-2 rounded-full"
                            >
                                <ChevronRight size={22} />
                            </button>
                        )}

                        {/* IMAGE */}
                        <img
                            src={`${BASE_URL}/${selected.photo}`}
                            alt="Preview"
                            className="w-full max-h-[85vh] object-contain"
                        />

                        {/* INDEX */}
                        <div className="absolute bottom-4 text-white text-sm bg-black/60 px-3 py-1 rounded-full">
                            {selectedIndex + 1} / {portfolio.length}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}