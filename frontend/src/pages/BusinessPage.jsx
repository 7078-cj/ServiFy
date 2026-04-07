import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { deleteRequest, getRequest, postRequest, putRequest } from "../utils/reqests/requests"
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
    const [businessModalOpen, setBusinessModalOpen] = useState(false);
    const [servicesModalOpen, setServicesModalOpen] = useState(false);
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user")) || null

    const fetchBusiness = async () => {
        await getBusiness(id, setBusiness, setLoading, setError)
    }

    const handleBusinessSave = async (formData) => {
        await updateBusiness(id, formData, setBusinessModalOpen, setBusiness)
    };

    const handleUpload = async (files) => {
        await uploadPortfolio(id, files, setBusiness)
    }

    const handleDelete = async (photoId) => {
        await deletePortfolioPhoto(id, photoId, setBusiness)
    }

    const handleServiceSave = async (formData) => {
        await createService(
            id,
            formData,
            setServicesModalOpen,
            fetchBusiness
        )
    }


    const handleAddReview = async (formData) => {
        return await addReview(
            id,
            formData,
            null,
            fetchBusiness
        )
    }

    const handleUpdateReview = async (reviewId, formData) => {
        return await updateReview(  
            id,
            reviewId,
            formData,
            null,
            fetchBusiness
        )
    }

    const handleDeleteReview = async (reviewId) => {
        return await deleteReview(
            id,
            reviewId,
            fetchBusiness

        )
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
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
            <BusinessHeader business={business} setBusinessModalOpen={setBusinessModalOpen} />

            {(hasAbout || hasPricing) && (
                <div className="grid sm:grid-cols-2 gap-5">
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

            <PortfolioGallery 
                portfolio={portfolio}
                isOwner={isOwner}
                onUpload={handleUpload}
                onDelete={handleDelete}
            />
            {isOwner &&
                <Button variant="outline" onClick={() => setServicesModalOpen(true)}>
                    <Plus className="mr-2" size={16} />
                    Add Service
                </Button>
            }
            <ServicesList services={services} owner={business.owner} businessId={id} fetchBusiness={fetchBusiness} />
            <ReviewsList 
            reviews={reviews} 
            onAddReview={handleAddReview}
            onUpdateReview={handleUpdateReview} 
            onDeleteReview={handleDeleteReview} 
            currentUser={user} />

            {!services?.length  && (
                <p className="text-center text-sm text-gray-400 py-4">
                No services  yet.
                </p>
            )}

            

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