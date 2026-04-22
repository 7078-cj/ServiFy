import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { validateBusinessBasics } from "../../utils/validation";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { createFormData } from "../../utils/form/form";
import AddLocationModal from "../AddLocationModal";

const media_url = import.meta.env.VITE_MEDIA_URL;

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
        categories: [],
    });

    const [categoryInput, setCategoryInput] = useState("");
    const [logoPreview, setLogoPreview] = useState(null);
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            const existingCategories =
                business?.category_details?.map((c) => c.name) || [];

            setFormData({
                name: business?.name || "",
                description: business?.description || "",
                logo: null,
                latitude: business?.latitude || "",
                longitude: business?.longitude || "",
                address: business?.address || "",
                categories: existingCategories,
            });

            // setCategoryInput(existingCategories.join(" "));

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

    const handleCategoryKeyDown = (e) => {
        if (e.key === " " || e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            const value = categoryInput.trim();

            if (!value) return;

            if (!formData.categories.includes(value)) {
                setFormData((prev) => ({
                    ...prev,
                    categories: [...prev.categories, value],
                }));
            }

            setCategoryInput("");
        }

        if (e.key === "Backspace" && !categoryInput) {
            setFormData((prev) => ({
                ...prev,
                categories: prev.categories.slice(0, -1),
            }));
        }
    };

    const removeCategory = (cat) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.filter((c) => c !== cat),
        }));
    };

    const handleLocationSelect = (loc) => {
        const format = (val) => (val ? parseFloat(val).toFixed(6) : "");

        setFormData((prev) => ({
            ...prev,
            latitude: format(loc.latitude),
            longitude: format(loc.longitude),
            address: loc.address || "Selected location",
        }));
    };

    const handleSave = async () => {
        const { valid, errors } = validateBusinessBasics({
            name: formData.name,
            latitude: formData.latitude,
            longitude: formData.longitude,
        });

        if (!valid) {
            toast.error(errors.name || errors.location);
            return;
        }

        const payload = {
            name: formData.name.trim(),
            description: formData.description,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
            categories: formData.categories,
        };

        if (formData.logo) {
            payload.logo = formData.logo;
        }

        const formDataObj = createFormData(payload);
        setSaving(true);

        try {
            await onSave?.(formDataObj);
            toast.success(business ? "Business updated." : "Business created.");
            setFormData({
                name: "",
                description: "",
                logo: null,
                latitude: "",
                longitude: "",
                address: "",
                categories: [],
            });
            setCategoryInput("");
            setLogoPreview(null);
        } catch (e) {
            toast.error(e?.message || "Could not save business.");
        } finally {
            setSaving(false);
        }
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

                            <Input type="file" name="logo" accept="image/*" onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Business Name</Label>
                            <Input name="name" value={formData.name} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Description</Label>
                            <Input name="description" value={formData.description} onChange={handleChange} />
                        </div>

                        <div>
                            <Label>Categories</Label>
                            <div className="flex flex-wrap gap-2 p-2 border rounded-xl">
                                {formData.categories.map((cat) => (
                                    <span
                                        key={cat}
                                        className="flex items-center gap-1 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs"
                                    >
                                        {cat}
                                        <button onClick={() => removeCategory(cat)}>×</button>
                                    </span>
                                ))}
                                <input
                                    className="flex-1 outline-none text-sm"
                                    value={categoryInput}
                                    onChange={(e) => setCategoryInput(e.target.value)}
                                    onKeyDown={handleCategoryKeyDown}
                                    placeholder="Type and press space..."
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Location</Label>

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

                            <Button
                                type="button"
                                onClick={() => setLocationModalOpen(true)}
                                className="w-full text-white"
                            >
                                {hasLocation ? "Change Location" : "Pick Location"}
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="mt-5 flex justify-between">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving || !formData.name || !hasLocation}
                            className={`px-4 py-2 rounded-md text-white ${
                                saving || !formData.name || !hasLocation
                                    ? "bg-gray-300"
                                    : "bg-blue-500"
                            }`}
                        >
                            {saving ? "Saving…" : business ? "Update" : "Create"}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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