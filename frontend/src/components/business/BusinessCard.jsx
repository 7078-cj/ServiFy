import React from "react";
import { MapPin, Star, Users, DollarSign, ImageOff, Crosshair, X } from "lucide-react";

const BASE_URL = "http://localhost:8000/media/";

export default function BusinessCard({ business, onClick, isFocused, onFocusToggle, isDashboard = true }) {
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

    const coverPhoto = logo
        ? `${BASE_URL}${logo}`
        : portfolio?.[0]
        ? `${BASE_URL}${portfolio[0].photo}`
        : null;

    const reviewCount = reviews?.length ?? 0;

    const priceLabel = () => {
        if (min_price !== null && max_price !== null) {
            if (min_price === max_price) return `$${min_price}`;
            return `$${min_price}–$${max_price}`;
        }
        if (min_price !== null) return `From $${min_price}`;
        return "N/A";
    };

    const handleFocusClick = (e) => {
        e.stopPropagation();
        onFocusToggle?.(business);
    };

    return (
        <div
            className={`group w-full rounded-2xl overflow-hidden bg-white transition-all duration-300 cursor-pointer flex flex-col
                ${isDashboard && isFocused
                    ? "shadow-lg ring-2 ring-blue-400 ring-offset-1"
                    : "shadow-sm hover:shadow-md border border-gray-100"
                }`}
            onClick={onClick}
        >
            {/* Cover image */}
            <div className="relative h-48 bg-gray-100 overflow-hidden flex-shrink-0">
                {coverPhoto ? (
                    <img
                        src={coverPhoto}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 gap-2">
                        <ImageOff size={32} strokeWidth={1.2} className="text-gray-300" />
                        <span className="text-xs text-gray-400 tracking-wide">No photo</span>
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Rating badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                    <Star
                        size={11}
                        className={average_rating !== null ? "text-amber-400 fill-amber-400" : "text-gray-300 fill-gray-300"}
                    />
                    <span className={`text-xs font-semibold ${average_rating !== null ? "text-gray-800" : "text-gray-400"}`}>
                        {average_rating !== null ? average_rating : "–"}
                    </span>
                </div>

                {/* Address pill */}
                {address && (
                    <div className="absolute bottom-3 left-3 right-14 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                        <MapPin size={11} className="text-blue-500 shrink-0" />
                        <span className="text-xs font-medium text-gray-700 truncate">{address}</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 px-4 pt-4 pb-4 gap-3">

                {/* Name */}
                <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1 tracking-tight">
                    {name}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {description || "No description provided."}
                </p>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Divider */}
                <div className="h-px bg-gray-100" />

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-2">
                    {/* Reviews */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                            <Users size={12} className="text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-800 leading-tight">{reviewCount}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide leading-tight">Reviews</span>
                        </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                            <DollarSign size={12} className="text-emerald-500" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-gray-800 leading-tight truncate">{priceLabel()}</span>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wide leading-tight">Price</span>
                        </div>
                    </div>
                </div>

                {/* Focus button — only rendered when used inside the dashboard */}
                {isDashboard && (
                    <button
                        onClick={handleFocusClick}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200
                            ${isFocused
                                ? "bg-blue-500 text-white hover:bg-blue-600 shadow-sm shadow-blue-200"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-200"
                            }`}
                    >
                        {isFocused ? (
                            <>
                                <X size={13} strokeWidth={2.5} />
                                Unfocus
                            </>
                        ) : (
                            <>
                                <Crosshair size={13} strokeWidth={2} />
                                Focus on map
                            </>
                        )}
                    </button>
                )}

            </div>
        </div>
    );
}