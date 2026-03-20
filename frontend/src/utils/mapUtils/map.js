export default async function MapClickHandler({ lat, lng, setLocation, editMode }) {
    if (!editMode) return;

    try {
    const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await res.json();

    setLocation({
        lat,
        lng,
        city:
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "",
        country: data.address.country || "",
        full: data.display_name || "",
    });
    } catch (err) {
        console.error("Reverse geocoding failed:", err);
        setLocation({ lat, lng, city: "", country: "", full: "" });
    }
}

export const initLocation = async (location, setLocation) => {
    if (location?.lat && location?.lng) {
        setUserLoc(location);
        return;
    }

    if (user?.latitude && user?.longitude) {
        const newLoc = {
            lat: user.latitude,
            lng: user.longitude,
            city: user.location || "",
            country: "",
            full: user.location || "",
        };
        setLocation(newLoc);
        return;
    }

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
            try {
                var newLoc = ReverseGeolocation(lat, lng) 
                setUserLoc(newLoc);
                setLocation(newLoc);
            } catch {
                setLocation({ lat, lng, city: "", country: "", full: "" });
            }
        },
            (err) => console.error("Geolocation error:", err)
        );
        }
    };