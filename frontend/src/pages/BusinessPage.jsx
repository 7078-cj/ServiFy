import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import BusinessHeader from "../components/business/BusinessHeader"
import BusinessAbout from "../components/business/BusinessAbout"
import PricingCard from "../components/business/PricingCard"
import PortfolioGallery from "../components/business/PortfolioGallery"
import ServicesList from "../components/business/ServiceList"
import ReviewsList from "../components/business/ReviewsList"
import BusinessPageSkeleton from "../components/business/BusinessPageSkeleton"
import AddUpdateBusinessModal from "../components/business/AddUpdateBusinessModal"
import AddUpdateServiceModal from "../components/business/AddUpdateServiceModal"
import MapComponent from "../components/map/MapComponent"
import { Button } from "../components/ui/button"
import { Plus } from "lucide-react"
import { createService } from "../api/services"
import { getBusiness, updateBusiness } from "../api/business"
import { deletePortfolioPhoto, uploadPortfolio } from "../api/portfolio"
import { addReview, deleteReview, updateReview } from "../api/reviews"

export default function BusinessPage() {
    const { id } = useParams()
    const { tokens } = useSelector((state) => state.auth)
    const [business, setBusiness] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [businessModalOpen, setBusinessModalOpen] = useState(false)
    const [servicesModalOpen, setServicesModalOpen] = useState(false)
    const user = JSON.parse(localStorage.getItem("user")) || null

    const fetchBusiness = useCallback(async ({ silent = false } = {}) => {
        if (silent) {
            try {
                setError(null)
                const refreshed = await getBusiness(id)
                setBusiness(refreshed)
            } catch {
                setError("Failed to load business details.")
            }
            return
        }
        await getBusiness(id, setBusiness, setLoading, setError)
    }, [id])

    const handleBusinessSave = async (formData) => {
        await updateBusiness(id, formData, setBusinessModalOpen, setBusiness)
    }

    const handleUpload = async (files) => {
        await uploadPortfolio(id, files, setBusiness)
    }

    const handleDelete = async (photoId) => {
        await deletePortfolioPhoto(id, photoId, setBusiness)
    }

    const handleServiceSave = async (formData) => {
        await createService(id, formData, setServicesModalOpen, fetchBusiness)
    }

    const handleAddReview = async (formData) => {
        return await addReview(id, formData, null)
    }

    const handleUpdateReview = async (reviewId, formData) => {
        return await updateReview(id, reviewId, formData, null)
    }

    const handleDeleteReview = async (reviewId) => {
        return await deleteReview(id, reviewId)
    }

    useEffect(() => {
        fetchBusiness()
    }, [])

    if (loading) return <BusinessPageSkeleton />

    if (error || !business)
        return (
            <div className="flex items-center justify-center h-64 text-sm text-gray-400">
                {error ?? "Business not found."}
            </div>
        )

    const {
        description,
        portfolio,
        services,
        reviews,
        average_price,
        min_price,
        max_price,
        latitude,
        longitude,
        logo,
        name,
        category_details,
    } = business

    const hasAbout = !!description
    const hasPricing = min_price || max_price || average_price
    const isOwner = business.owner.id === user?.id

    const businessLat = parseFloat(latitude)
    const businessLng = parseFloat(longitude)
    const hasLocation = !Number.isNaN(businessLat) && !Number.isNaN(businessLng)

    const mapMarker = hasLocation ? [{
        id: `business-${id}`,
        name: name,
        latitude: businessLat,
        longitude: businessLng,
        logo: logo || null,
        isBusiness: true,
    }] : []

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    <div className="w-full lg:w-[420px] flex-shrink-0 lg:sticky lg:top-8 space-y-4">
                        <BusinessHeader
                            business={business}
                            setBusinessModalOpen={setBusinessModalOpen}
                        />

                        {category_details?.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {category_details.map((cat) => (
                                    <span
                                        key={cat.id}
                                        className="text-md font-serif font-semibold bg-blue-50 text-blue-600 px-3 py-1 rounded-full"
                                    >
                                        {cat.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {(hasAbout || hasPricing) && (
                            <div className="space-y-4">
                                {hasAbout && <BusinessAbout description={description} />}
                                {hasPricing && (
                                    <PricingCard
                                        min_price={min_price}
                                        max_price={max_price}
                                        average_price={average_price}
                                    />
                                )}
                            </div>
                        )}

                        {hasLocation && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-4 pt-4 pb-2">
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                                        Location
                                    </p>
                                </div>
                                <div className="h-52">
                                    <MapComponent
                                        Markers={mapMarker}
                                        userLocation={false}
                                        location={{ lat: businessLat, lng: businessLng }}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="[&_img]:!w-32 [&_img]:!h-32 [&_img]:!object-cover [&_.grid]:!gap-3">
                            <PortfolioGallery
                                portfolio={portfolio}
                                isOwner={isOwner}
                                onUpload={handleUpload}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>

                    <div className="flex-1">

                        <div className="flex items-center justify-between w-full mb-2">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Services</h2>
                            {isOwner && (
                                <Button variant="outline" size="sm" onClick={() => setServicesModalOpen(true)}>
                                    <Plus className="mr-1" size={13} />
                                    Add Service
                                </Button>
                            )}
                        </div>

                        {services?.length ? (
                            <div className="overflow-y-auto max-h-[calc(100vh-16rem)] mb-5">
                                <ServicesList
                                    services={services}
                                    owner={business.owner}
                                    businessId={id}
                                    fetchBusiness={fetchBusiness}
                                />
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 py-4 px-6 text-center mb-5">
                                <p className="text-xs text-gray-400">No services yet.</p>
                                {isOwner && (
                                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setServicesModalOpen(true)}>
                                        <Plus className="mr-1" size={13} />
                                        Add your first service
                                    </Button>
                                )}
                            </div>
                        )}

                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-3">User Reviews</h2>
                            <div className="overflow-y-auto max-h-[calc(100vh-16rem)] pr-1">
                                <ReviewsList
                                    reviews={reviews}
                                    onAddReview={handleAddReview}
                                    onUpdateReview={handleUpdateReview}
                                    onDeleteReview={handleDeleteReview}
                                    currentUser={user}
                                    businessId={id}
                                    onRefresh={() => fetchBusiness({ silent: true })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddUpdateBusinessModal
                business={business}
                open={businessModalOpen}
                onClose={() => setBusinessModalOpen(false)}
                onSave={handleBusinessSave}
            />
            <AddUpdateServiceModal
                open={servicesModalOpen}
                onClose={() => setServicesModalOpen(false)}
                onSave={handleServiceSave}
            />
        </div>
    )
}