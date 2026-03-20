import React, { useEffect, useState } from "react";
import Map from "../components/map/MapComponent";
import { initLocation } from "../utils/mapUtils/map";




function Test() {
    const [location, setLocation] = useState(null);
    const editMode = true;

    const Businesses = [
    {
        "name": "Saint Peter the Apostle Parish Church",
        "latitude": 14.95373,
        "longitude": 120.77241
    },
    {
        "name": "Apalit Municipal Hall",
        "latitude": 14.9538,
        "longitude": 120.76853
    },
    {
        "name": "La Verdad Christian School and Colleges",
        "latitude": 14.95937,
        "longitude": 120.75923
    },
    {
        "name": "Ang Dating Daan / ADD Convention Center",
        "latitude": 14.95976,
        "longitude": 120.76143
    },
    {
        "name": "Members Church of God International (MCGI)",
        "latitude": 14.95993,
        "longitude": 120.76181
    },
    {
        "name": "MCGI Chapel",
        "latitude": 14.96065,
        "longitude": 120.76038
    },
    {
        "name": "Walk of Faith Fountain",
        "latitude": 14.95911,
        "longitude": 120.76007
    },
    {
        "name": "Apalit Town Center (approx.)",
        "latitude": 14.94956,
        "longitude": 120.75869
    }
    ]

    useEffect(() => {
        
        const fetchLocation = async () => {
            try {
            await initLocation(location, setLocation);
            } catch (err) {
            console.error("Failed to initialize location:", err);
            }
        };

        fetchLocation();
    }, []);



    return (
    <div className="h-[400px] w-full">
        <Map location={location} setLocation={setLocation} Markers={Businesses}/>
    </div>
    );
}

export default Test;