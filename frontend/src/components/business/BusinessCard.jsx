import React from "react";
import { MapPin, Star, Users, DollarSign, ImageOff, Crosshair, X } from "lucide-react";

const BASE_URL = import.meta.env.VITE_MEDIA_URL;

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
        category_details,
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

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 rounded-full px-2.5 py-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-800">
                        {average_rating ?? "–"}
                    </span>
                </div>

                {address && (
                    <div className="absolute bottom-3 left-3 right-14 flex items-center gap-1.5 bg-white/90 rounded-full px-3 py-1.5">
                        <MapPin size={11} className="text-blue-500" />
                        <span className="text-xs font-medium text-gray-700 truncate">{address}</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col flex-1 px-4 pt-4 pb-4 gap-3">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                    {name}
                </h3>

                <p className="text-xs text-gray-400 line-clamp-2">
                    {description || "No description provided."}
                </p>

                {category_details?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {category_details.map((cat) => (
                            <span
                                key={cat.id}
                                className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex-1" />

                <div className="h-px bg-gray-100" />

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <Users size={12} className="text-blue-500" />
                        <div>
                            <span className="text-xs font-bold">{reviewCount}</span>
                            <p className="text-[10px] text-gray-400">Reviews</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
                        <DollarSign size={12} className="text-emerald-500" />
                        <div className="min-w-0">
                            <span className="text-xs font-bold truncate">{priceLabel()}</span>
                            <p className="text-[10px] text-gray-400">Price</p>
                        </div>
                    </div>
                </div>

                {isDashboard && (
                    <button
                        onClick={handleFocusClick}
                        className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold ${
                            isFocused
                                ? "bg-blue-500 text-white"
                                : "bg-gray-50 text-gray-500 border"
                        }`}
                    >
                        {isFocused ? <X size={13} /> : <Crosshair size={13} />}
                        {isFocused ? "Unfocus" : "Focus on map"}
                    </button>
                )}
            </div>
        </div>
    );
}