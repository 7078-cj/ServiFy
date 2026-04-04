import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getRequest, putRequest } from "../utils/reqests/requests"
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

            <PortfolioGallery portfolio={portfolio} />
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