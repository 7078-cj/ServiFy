import { Skeleton } from "../ui/skeleton"

export default function BusinessPageSkeleton() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {/* Header skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex gap-5">
            <Skeleton className="w-16 h-16 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            </div>
        </div>

        {/* Body skeletons */}
        <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <Skeleton className="h-3 w-16" />
            <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
            </div>
            </div>
        </div>

        {/* Portfolio skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
            <Skeleton className="h-3 w-20" />
            <div className="grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
            </div>
        </div>
        </div>
    )
}