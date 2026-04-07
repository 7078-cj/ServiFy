import React, { useEffect, useRef } from 'react'
import BusinessList from '../components/business/BusinessList'
import MapComponent from '../components/map/MapComponent'
import { useDispatch, useSelector } from 'react-redux';
import { getAllBusinesses } from '../api/business';

function DashBoard() {
    const dispatch = useDispatch();
    const { businesses, markers } = useSelector(state => state.allBusinesses);
    const mapRef = useRef(null);

    useEffect(() => {
        getAllBusinesses(dispatch)
    }, []);

    // Called when a business is focused — fly in close
    const handleFocus = (business) => {
        if (business?.latitude && business?.longitude) {
            mapRef.current?.flyTo({
                center: [parseFloat(business.longitude), parseFloat(business.latitude)],
                zoom: 18,
                duration: 1200,
            });
        }
    };

    // Called when unfocused — zoom back out to overview
    const handleUnfocus = () => {
        mapRef.current?.flyTo({
            zoom: 16,
            duration: 800,
        });
    };

    return (
        <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-124px)] relative overflow-hidden">

            {/* Left panel — scrolls internally */}
            <div className="
                w-full lg:w-[45%]
                h-[45%] lg:h-full
                overflow-y-auto overscroll-contain scroll-smooth
                bg-white z-10 relative shadow-xl
            ">
                <BusinessList
                    businesses={businesses}
                    onFocus={handleFocus}
                    onUnfocus={handleUnfocus}
                />
            </div>

            {/* Blur edge overlay (desktop only) */}
            <div
                className="hidden lg:block absolute left-[43%] top-0 h-full w-20 backdrop-blur-md z-20 pointer-events-none"
                style={{
                    WebkitMaskImage: 'linear-gradient(to right, white 0%, white 30%, transparent 100%)',
                    maskImage: 'linear-gradient(to right, white 0%, white 30%, transparent 100%)',
                }}
            />

            {/* Map */}
            <div className="w-full lg:w-[55%] h-[55%] lg:h-full">
                <MapComponent Markers={markers} mapRef={mapRef} />
            </div>

        </div>
    );
}

export default DashBoard;