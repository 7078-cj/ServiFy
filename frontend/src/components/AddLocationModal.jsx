import React, { useState } from "react";
;
import { Button } from "../../components/ui/button";
import MapComponent from "./map/MapComponent"; // adjust path
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../components/ui/dialog";

export default function AddLocationModal({ open, onClose, onSave }) {
    const [location, setLocation] = useState({
        lat: null,
        lng: null,
        full: "",
    });

    const handleSave = () => {
        if (!location.lat || !location.lng) return;

        onSave?.({
            latitude: location.lat,
            longitude: location.lng,
            address: location.full,
        });

        onClose();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <DialogContent className="max-w-3xl bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-blue-500">
                        Select Location
                    </DialogTitle>
                </DialogHeader>

                <div className="h-[400px] rounded-xl overflow-hidden border">
                    <MapComponent
                        location={location}
                        setLocation={setLocation}
                        editMode={true} // ✅ enables click selection
                    />
                </div>

                {/* Preview */}
                {location?.lat && location?.lng && (
                    <div className="text-sm text-gray-600 mt-2">
                        📍 {location.full || "Selected Location"} <br />
                        {parseFloat(location.lat).toFixed(6)},{" "}
                        {parseFloat(location.lng).toFixed(6)}
                    </div>
                )}

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button onClick={handleSave}>
                        Use Location
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}