import { Separator } from "../../../components/ui/separator"
import { Badge } from "../../../components/ui/badge"

export default function ServicesList({ services }) {
    if (!services?.length) return null

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Services
        </h2>

        <div className="flex flex-col gap-3">
            {services.map((svc, i) => (
            <div key={svc.id ?? i}>
                <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold text-gray-800">{svc.name}</p>
                    {svc.category && (
                        <Badge variant="outline" className="text-[11px] px-2 py-0">
                        {svc.category}
                        </Badge>
                    )}
                    </div>
                    {svc.description && (
                    <p className="text-sm text-gray-500 leading-relaxed">
                        {svc.description}
                    </p>
                    )}
                    {svc.duration && (
                    <p className="text-xs text-gray-400 mt-0.5">{svc.duration}</p>
                    )}
                </div>
                {svc.price && (
                    <span className="text-sm font-semibold text-blue-600 shrink-0">
                    ₱{parseFloat(svc.price).toLocaleString()}
                    </span>
                )}
                </div>
                {i < services.length - 1 && <Separator className="mt-3" />}
            </div>
            ))}
        </div>
        </section>
    )
}