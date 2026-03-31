import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getRequest } from '../../utils/reqests/requests'
import { setBusinesses } from '../../features/business/allBusinessSlice'
import BusinessCard from './BusinessCard'
import { Store } from 'lucide-react'

export default function BusinessList() {
    const dispatch = useDispatch();
    const { businesses } = useSelector(state => state.allBusinesses);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const res = await getRequest("all_businesses/");
            dispatch(setBusinesses(res));
        };
        fetchBusinesses();
    }, []);

    if (businesses.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <Store size={26} className="text-blue-400" />
                </div>
                <p className="text-sm font-semibold text-gray-700">No businesses found</p>
                <p className="text-xs text-gray-400">Check back later or try a different search.</p>
            </div>
        );
    }

    return (
        <div className="px-4 py-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-gray-900">Explore Businesses</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{businesses.length} businesses available</p>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {businesses.map(b => (
                    <BusinessCard key={b.id} business={b} />
                ))}
            </div>
        </div>
    );
}