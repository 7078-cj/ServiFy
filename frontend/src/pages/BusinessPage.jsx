import { useEffect, useState } from "react"
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

    const fetchBusiness = async () => {
        await getBusiness(id, setBusiness, setLoading, setError)
    }

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
    }, [id])

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
    } = business

    const hasAbout = !!description
    const hasPricing = min_price || max_price || average_price
    const isOwner = business.owner.id === user?.id

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* LEFT — sticky business info */}
                    <div className="w-full lg:w-[420px] flex-shrink-0 lg:sticky lg:top-8 space-y-4">

                        <BusinessHeader
                            business={business}
                            setBusinessModalOpen={setBusinessModalOpen}
                        />

                        {(hasAbout || hasPricing) && (
                            <div className="space-y-4">
                                {hasAbout && (
                                    <BusinessAbout description={description} />
                                )}
                                {hasPricing && (
                                    <PricingCard
                                        min_price={min_price}
                                        max_price={max_price}
                                        average_price={average_price}
                                    />
                                )}
                            </div>
                        )}

                        {/* Larger portfolio thumbnails */}
                        <div className="[&_img]:!w-32 [&_img]:!h-32 [&_img]:!object-cover [&_.grid]:!gap-3">
                            <PortfolioGallery
                                portfolio={portfolio}
                                isOwner={isOwner}
                                onUpload={handleUpload}
                                onDelete={handleDelete}
                            />
                        </div>
                    </div>

                    {/* RIGHT — services & reviews */}
                    <div className="flex-1 min-w-0 space-y-5">

                        {/* Services header */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Services</h2>
                            {isOwner && (
                                <Button
                                    variant="outline"
                                    onClick={() => setServicesModalOpen(true)}
                                >
                                    <Plus className="mr-2" size={16} />
                                    Add Service
                                </Button>
                            )}
                        </div>

                        {services?.length ? (
                            <ServicesList
                                services={services}
                                owner={business.owner}
                                businessId={id}
                                fetchBusiness={fetchBusiness}
                            />
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">
                                <p className="text-sm text-gray-400">No services yet.</p>
                                {isOwner && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setServicesModalOpen(true)}
                                    >
                                        <Plus className="mr-2" size={16} />
                                        Add your first service
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Reviews */}
                        <ReviewsList
                            reviews={reviews}
                            onAddReview={handleAddReview}
                            onUpdateReview={handleUpdateReview}
                            onDeleteReview={handleDeleteReview}
                            currentUser={user}
                            businessId={id}
                        />
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