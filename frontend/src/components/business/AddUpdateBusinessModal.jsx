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
        address: "",
        latitude: "",
        longitude: "",
        logo: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [locationModalOpen, setLocationModalOpen] = useState(false); // ✅ NEW

    useEffect(() => {
        if (open) {
            setFormData({
                name: business?.name || "",
                description: business?.description || "",
                address: business?.address || "",
                latitude: business?.latitude || "",
                longitude: business?.longitude || "",
                logo: null,
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

    // ✅ HANDLE LOCATION FROM MAP
    const handleLocationSelect = (loc) => {
        setFormData((prev) => ({
            ...prev,
            latitude: loc.latitude,
            longitude: loc.longitude,
            address: loc.address || prev.address,
        }));
    };

    const handleSave = () => {
        const payload = {
            name: formData.name,
            description: formData.description,
            address: formData.address,
            latitude: formData.latitude || null,
            longitude: formData.longitude || null,
        };

        if (formData.logo) {
            payload.logo = formData.logo;
        }

        const formDataObj = createFormData(payload);

        onSave?.(formDataObj);
        onClose();
    };

    return (
        <>
            <Dialog
                open={open}
                onOpenChange={(isOpen) => {
                    if (!isOpen) onClose();
                }}
            >
                <DialogContent className="bg-white border shadow-xl max-w-md">
                    <DialogHeader>
                        <DialogTitle
                            className="text-lg font-bold"
                            style={{ color: "#3182ce" }}
                        >
                            {business ? "Update Business" : "Register Business"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Logo Upload */}
                        <div className="flex flex-col items-center gap-3">
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Logo Preview"
                                    className="w-24 h-24 rounded-full object-cover border-4 shadow"
                                    style={{ borderColor: "#1a9cb0" }}
                                />
                            ) : (
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center text-xl font-bold shadow border-4"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #0f6e84, #3182ce)",
                                        color: "#fff",
                                    }}
                                >
                                    {formData.name?.charAt(0) || "B"}
                                </div>
                            )}

                            <Input
                                type="file"
                                name="logo"
                                accept="image/*"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Name */}
                        <div>
                            <Label>Business Name</Label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label>Description</Label>
                            <Input
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <Label>Address</Label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Latitude</Label>
                                    <Input
                                        name="latitude"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label>Longitude</Label>
                                    <Input
                                        name="longitude"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* ✅ MAP BUTTON */}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setLocationModalOpen(true)}
                                className="w-full"
                            >
                                📍 Pick Location from Map
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <button
                            onClick={handleSave}
                            className="px-4 py-2 rounded-md text-white font-semibold"
                            style={{
                                background:
                                    "linear-gradient(90deg, #0f6e84, #3182ce)",
                            }}
                        >
                            {business ? "Update" : "Create"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ✅ LOCATION MODAL */}
            <AddLocationModal
                open={locationModalOpen}
                onClose={() => setLocationModalOpen(false)}
                onSave={handleLocationSelect}
            />
        </>
    );
}