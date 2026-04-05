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
import { updateInAllBusiness } from "../features/business/allBusinessSlice"
import { updateBusiness } from "../features/business/businessSlice"




export default function BusinessPage() {
    const { id } = useParams()
    const { tokens } = useSelector((state) => state.auth)
    const [business, setBusiness] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [businessModalOpen, setBusinessModalOpen] = useState(false);
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem("user")) || null

    const handleBusinessSave = async (formData) => {
        try {
            const res = await putRequest(`businesses/${id}/`, formData, tokens.access, true);
    
            dispatch(updateInAllBusiness(res));
            dispatch(updateBusiness(res));
            setBusiness(res);
            setBusinessModalOpen(false); 
        } catch (error) {
            console.error("Failed to save business:", error);
        }
    };

    const handleUpload = async (files) => {
        try {
            const formData = new FormData()

            files.forEach(file => {
                formData.append("photos", file) 
            })

            const res = await postRequest(
                `businesses/${id}/portfolios/`,
                formData,
                tokens.access,
                true
            )

            
            setBusiness(prev => ({
                ...prev,
                portfolio: [...prev.portfolio, ...res]
            }))

        } catch (err) {
            console.error("Upload failed:", err)
        }
    }

    const handleDelete = async (photoId) => {
        try {
            await deleteRequest(
                `businesses/${id}/portfolios/${photoId}/`, 
                tokens.access
            )

            setBusiness(prev => ({
                ...prev,
                portfolio: prev.portfolio.filter(p => p.id !== photoId)
            }))

        } catch (err) {
            console.error("Delete failed:", err)
        }
    }

    useEffect(() => {
        const fetchBusiness = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await getRequest(`businesses/${id}/`, tokens.access)
            setBusiness(res)
        } catch {
            setError("Failed to load business details.")
        } finally {
            setLoading(false)
        }
        }
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
            <ServicesList services={services} />
            <ReviewsList reviews={reviews} />

            {!services?.length && !reviews?.length && (
                <p className="text-center text-sm text-gray-400 py-4">
                No services or reviews yet.
                </p>
            )}

            

            <AddUpdateBusinessModal
                business={business}
                open={businessModalOpen}
                onClose={() => setBusinessModalOpen(false)}
                onSave={handleBusinessSave} 
            />
        </div>
    )
}