import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Button } from "../../../components/ui/button";
import { createFormData } from "../../utils/form/form";
import AddLocationModal from "../AddLocationModal";

const media_url = import.meta.env.VITE_API_MEDIA;

export default function AddUpdateBusinessModal({
    open,
    onClose,
    business = undefined,
    onSave,
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        logo: null,
        latitude: "",
        longitude: "",
        address: "",
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [locationModalOpen, setLocationModalOpen] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData({
                name: business?.name || "",
                description: business?.description || "",
                logo: null,
                latitude: business?.latitude || "",
                longitude: business?.longitude || "",
                address: business?.address || "",
            });

            setLogoPreview(
                business?.logo ? media_url + business.logo : null
            );
        }
    }, [open, business]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "logo") {
            const file = files[0];

            setFormData((prev) => ({
                ...prev,
                logo: file,
            }));

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setLogoPreview(null);
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // ✅ Handle map selection (clean + formatted)
    const handleLocationSelect = (loc) => {
        const format = (val) =>
            val ? parseFloat(val).toFixed(6) : "";

        setFormData((prev) => ({
            ...prev,
            latitude: format(loc.latitude),
            longitude: format(loc.longitude),
            address: loc.address || "Selected location",
        }));
    };

    const handleSave = () => {
        const payload = {
            name: formData.name,
            description: formData.description,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
        };

        if (formData.logo) {
            payload.logo = formData.logo;
        }

        const formDataObj = createFormData(payload);

        onSave?.(formDataObj);

        // reset
        setFormData({
            name: "",
            description: "",
            logo: null,
            latitude: "",
            longitude: "",
            address: "",
        });
        setLogoPreview(null);
        onClose();
    };

    const hasLocation = formData.latitude && formData.longitude;

    return (
        <>
            <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
                <DialogContent className="bg-white border shadow-2xl max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-600">
                            {business ? "Update Business" : "Register Business"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-5">
                        {/* 🔵 LOGO */}
                        <div className="flex flex-col items-center gap-3">
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 shadow-lg border-blue-500"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-blue-500 bg-gradient-to-br from-cyan-600 to-blue-500 text-white">
                                    {formData.name?.charAt(0) || "B"}
                                </div>
                            )}

                            <Input
                                type="file"
                                name="logo"
                                accept="image/*"
                                onChange={handleChange}
                                className="text-sm"
                            />
                        </div>

                        {/* 🔵 NAME */}
                        <div>
                            <Label>Business Name</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 🔵 DESCRIPTION */}
                        <div>
                            <Label>Description</Label>
                            <Input
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 🗺️ LOCATION SECTION */}
                        <div className="space-y-3">
                            <Label>Location</Label>

                            {/* ✅ LOCATION DISPLAY CARD */}
                            <div className="rounded-xl border p-3 bg-gray-50 shadow-sm">
                                {hasLocation ? (
                                    <>
                                        <p className="text-sm font-medium text-gray-700">
                                            📍 {formData.address}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Lat: {formData.latitude} | Lng: {formData.longitude}
                                        </p>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">
                                        No location selected yet
                                    </p>
                                )}
                            </div>

                            {/* ✅ IMPROVED BUTTON */}
                            <Button
                                type="button"
                                onClick={() => setLocationModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 text-white font-semibold rounded-lg shadow-md hover:scale-[1.02] transition"
                                style={{
                                    background:
                                        "linear-gradient(90deg, #0f6e84, #3182ce)",
                                }}
                            >
                                🗺️ {hasLocation ? "Change Location" : "Pick Location on Map"}
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="mt-5 flex justify-between">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <button
                            onClick={handleSave}
                            disabled={!formData.name || !hasLocation}
                            className={`px-4 py-2 rounded-md text-white font-semibold transition ${
                                !formData.name || !hasLocation
                                    ? "bg-gray-300 cursor-not-allowed"
                                    : "bg-gradient-to-r from-cyan-600 to-blue-500 hover:opacity-90"
                            }`}
                        >
                            {business ? "Update" : "Create"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* 🗺️ LOCATION MODAL */}
            <AddLocationModal
                open={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
                onSave={(loc) => {
                    handleLocationSelect(loc);
                    setLocationModalOpen(false);
                }}
            />
        </>
    );
}