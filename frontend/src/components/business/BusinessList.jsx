import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRequest } from '../../utils/reqests/requests'

import BusinessCard from './BusinessCard'
import { Store } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export default function BusinessList({businesses}) {

    const navigate = useNavigate()

    const handleClick = (id) => {
        navigate(`/business/${id}`)
    }



    // ✨ EMPTY STATE (Improved)
    if (businesses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center shadow-sm">
                    <Store size={28} className="text-blue-500" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-gray-800">
                    No businesses found
                </h3>

                <p className="text-sm text-gray-400 mt-1 max-w-xs">
                    Looks like there’s nothing here yet. Try refreshing or check back later.
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
            
            {/* ✨ HEADER */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                

                {/* Optional future filter/search placeholder */}
                <div className="hidden sm:block">
                    <div className="px-4 py-2 rounded-xl bg-gray-50 text-xs text-gray-400 border">
                        Filters coming soon
                    </div>
                </div>
            </div>

            {/* ✨ GRID */}
            <div className="
                grid 
                grid-cols-1 
                sm:grid-cols-2 
                lg:grid-cols-3 
                xl:grid-cols-4 
                gap-6
            ">
                {businesses.map((b) => (
                    <div
                        key={b.id}
                        className="transition-transform duration-200 hover:scale-[1.02]"
                    >
                        <BusinessCard business={b} onClick={() => handleClick(b.id)} />
                    </div>
                ))}
            </div>
        </div>
    );
}