import React from "react";
import { MapPin, Star, Users, DollarSign, ImageOff } from "lucide-react";

const BASE_URL = "http://localhost:8000/media/";

export default function BusinessCard({ business, onClick }) {
    const {
        name,
        description,
        address,
        logo,
        portfolio,
        average_rating,
        min_price,
        max_price,
        reviews,
    } = business;

    const coverPhoto = logo ? `${BASE_URL}${logo}` : portfolio?.[0] ? `${BASE_URL}${portfolio[0]}` : null;

    const reviewCount = reviews?.length ?? 0;

    const priceLabel = () => {
        if (min_price !== null && max_price !== null) {
            if (min_price === max_price) return `$${min_price}`;
            return `$${min_price} – $${max_price}`;
        }
        if (min_price !== null) return `From $${min_price}`;
        return "N/A";
    };

    return (
        <div className="group w-full max-w-sm rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer" onClick={onClick}>

            {/* Cover image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
                {coverPhoto ? (
                    <img
                        src={coverPhoto}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-300 gap-2">
                        <ImageOff size={32} strokeWidth={1.5} />
                        <span className="text-xs">No photo</span>
                    </div>
                )}

                {/* Rating badge */}
                {average_rating !== null ? (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-2.5 py-1 shadow-sm">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="text-xs font-semibold text-gray-800">
                            {average_rating}
                        </span>
                    </div>
                ) : (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-2.5 py-1 shadow-sm">
                        <Star size={13} className="text-gray-300 fill-gray-300" />
                        <span className="text-xs text-gray-400">No rating</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-[0.95rem] font-semibold text-gray-900 leading-snug line-clamp-1 mb-1">
                    {name}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                    {description}
                </p>

                <div className="border-t border-gray-100 mb-3" />

                {/* Stats row */}
                <div className="flex items-center justify-between">

                    {/* Location */}
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[0.6rem] text-gray-400 uppercase tracking-widest">Location</span>
                        <div className="flex items-center gap-1 text-gray-700">
                            <MapPin size={11} className="text-blue-500 shrink-0" />
                            <span className="text-xs font-medium truncate max-w-[80px]">
                                {address || "N/A"}
                            </span>
                        </div>
                    </div>

                    {/* Reviews */}
                    <div className="flex flex-col gap-0.5 items-center">
                        <span className="text-[0.6rem] text-gray-400 uppercase tracking-widest">Reviews</span>
                        <div className="flex items-center gap-1 text-gray-700">
                            <Users size={11} className="text-blue-500" />
                            <span className="text-xs font-medium">{reviewCount} total</span>
                        </div>
                    </div>

                    {/* Price range */}
                    <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[0.6rem] text-gray-400 uppercase tracking-widest">Price range</span>
                        <div className="flex items-center gap-0.5 text-gray-700">
                            <DollarSign size={11} className="text-blue-500" />
                            <span className="text-xs font-medium">{priceLabel()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}