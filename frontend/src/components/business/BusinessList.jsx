import React, { useState } from 'react'
import BusinessCard from './BusinessCard'
import { Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function BusinessList({ businesses, onFocus, onUnfocus, isDashboard = true }) {
    const navigate = useNavigate()
    const [focusedId, setFocusedId] = useState(null)

    const handleClick = (id) => {
        navigate(`/business/${id}`)
    }

    const handleFocusToggle = (business) => {
        if (focusedId === business.id) {
            // Same card — unfocus
            setFocusedId(null)
            onUnfocus?.()
        } else {
            // Different card — switch focus
            setFocusedId(business.id)
            onFocus?.(business)
        }
    }

    if (businesses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
                    <Store size={28} className="text-blue-500" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-gray-800">No businesses found</h3>
                <p className="text-sm text-gray-400 mt-1.5 max-w-xs leading-relaxed">
                    Looks like there's nothing here yet. Try refreshing or check back later.
                </p>
            </div>
        )
    }

    return (
        <div className="px-5 py-6">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-3">
                <div className="hidden sm:block px-3 py-1.5 rounded-xl bg-gray-50 text-xs text-gray-400 border border-gray-100 whitespace-nowrap select-none">
                    Filters coming soon
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {businesses.map((b) => (
                    <BusinessCard
                        key={b.id}
                        business={b}
                        isDashboard={isDashboard}
                        isFocused={focusedId === b.id}
                        onFocusToggle={handleFocusToggle}
                        onClick={() => handleClick(b.id)}
                    />
                ))}
            </div>

            <div className="h-8" />
        </div>
    )
}