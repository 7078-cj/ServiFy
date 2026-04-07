import { useState } from "react"
import { Dialog, DialogContent } from "../ui/dialog"
import ServiceCard from "./ServiceCard"
import { getRequest } from "../../utils/reqests/requests";

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function ServicesList({ services, owner, businessId, fetchBusiness }) {
    const [previewSvc, setPreviewSvc] = useState(null)

    const user = JSON.parse(localStorage.getItem("user")) || null
    const token = JSON.parse(localStorage.getItem("authTokens")) || null
    const isOwner = user?.id === owner.id



    if (!services?.length) return null

    return (
        <>
            <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
                    Services
                </h2>

                <div className="flex flex-col gap-4">
                    {services.map((svc, i) => (
                        <ServiceCard
                            key={svc.id ?? i}
                            svc={svc}
                            isOwner={isOwner}
                            businessId={businessId}
                            onRefresh={() => fetchBusiness()}
                            onPreview={setPreviewSvc}
                        />
                    ))}
                </div>
            </section>

            {/* Preview Modal */}
            <Dialog
                open={!!previewSvc}
                onOpenChange={(open) => !open && setPreviewSvc(null)}
            >
                <DialogContent className="bg-white rounded-2xl shadow-2xl p-0 overflow-hidden max-w-sm border-0">
                    {previewSvc && (
                        <>
                            <img
                                src={media_url + previewSvc.thumbnail}
                                alt={previewSvc.name}
                                className="w-full object-cover max-h-72"
                            />
                            <div className="px-5 py-4">
                                <p className="text-base font-bold text-gray-800">
                                    {previewSvc.name}
                                </p>

                                {previewSvc.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {previewSvc.description}
                                    </p>
                                )}

                                {previewSvc.price && (
                                    <p className="text-sm font-bold text-blue-600 mt-2">
                                        ₱{parseFloat(previewSvc.price).toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                        })}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}