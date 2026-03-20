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