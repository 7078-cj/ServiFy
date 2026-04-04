import { MapPin, Plus } from "lucide-react"
import { Badge } from "../ui/badge"
import BusinessAvatar from "./BusinessAvatar"
import StarRating from "./StarRating"
import { useSelector } from "react-redux"
import { Button } from "../ui/button"

const BASE_URL = import.meta.env.VITE_MEDIA_URL

export default function BusinessHeader({ business, setBusinessModalOpen }) {
    const { owner, logo, name, address, average_rating, reviews } = business
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row items-start gap-5 shadow-sm">
        <BusinessAvatar
            name={name}
            imageUrl={logo ? `${BASE_URL}/${logo}` : null}
            size="lg"
        />

        <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-xl font-semibold text-gray-900 truncate">{name}</h1>
            {reviews?.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </Badge>
            )}
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
            {user?.id === owner.id && (
                <Button
                    onClick={() => setBusinessModalOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus size={16} />
                    Edit Business
                </Button>
            )}
        </div>
        </div>
    )
}