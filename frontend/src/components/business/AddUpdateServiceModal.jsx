import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { validateServiceBasics } from "../../utils/validation";
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

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function AddUpdateServiceModal({
    open,
    onClose,
    service = undefined,
    onSave,
}) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        thumbnail: null,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData({
                name: service?.name || "",
                description: service?.description || "",
                price: service?.price || "",
                thumbnail: null,
            });

            setThumbnailPreview(
                service?.thumbnail ? media_url + service.thumbnail : null
            );
        }
    }, [open, service]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "thumbnail") {
            const file = files[0];

            setFormData((prev) => ({
                ...prev,
                thumbnail: file,
            }));

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setThumbnailPreview(reader.result);
                reader.readAsDataURL(file);
            } else {
                setThumbnailPreview(null);
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSave = async () => {
        const { valid, errors } = validateServiceBasics({
            name: formData.name,
            price: formData.price,
        });
        if (!valid) {
            toast.error(errors.name || errors.price);
            return;
        }

        const payload = {
            name: formData.name.trim(),
            description: formData.description,
            price: formData.price,
        };

        if (formData.thumbnail) {
            payload.thumbnail = formData.thumbnail;
        }

        const formDataObj = createFormData(payload);
        setSaving(true);
        try {
            await onSave?.(formDataObj);
            toast.success(service ? "Service updated." : "Service created.");
            setFormData({
                name: "",
                description: "",
                price: "",
                thumbnail: null,
            });
            setThumbnailPreview(null);
        } catch (e) {
            toast.error(e?.message || "Could not save service.");
        } finally {
            setSaving(false);
        }
    };

    const isValid =
        formData.name?.trim() &&
        formData.price !== "" &&
        formData.price != null &&
        !Number.isNaN(parseFloat(formData.price)) &&
        parseFloat(formData.price) >= 0;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent className="bg-white border shadow-2xl max-w-md rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-blue-600">
                        {service ? "Update Service" : "Add Service"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5">
                    {/* THUMBNAIL */}
                    <div className="flex flex-col items-center gap-3">
                        {thumbnailPreview ? (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                className="w-24 h-24 rounded-xl object-cover border-4 shadow-lg border-blue-500"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-blue-500 bg-gradient-to-br from-cyan-600 to-blue-500 text-white">
                                {formData.name?.charAt(0) || "S"}
                            </div>
                        )}

                        <Input
                            type="file"
                            name="thumbnail"
                            accept="image/*"
                            onChange={handleChange}
                            className="text-sm"
                        />
                    </div>

                    {/* NAME */}
                    <div>
                        <Label>Service Name</Label>
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Haircut, Massage, Consultation"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <Label>Description</Label>
                        <Input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description of the service"
                        />
                    </div>

                    {/* PRICE */}
                    <div>
                        <Label>Price</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                ₱
                            </span>
                            <Input
                                name="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="pl-7"
                            />
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-5 flex justify-between">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !isValid}
                        className={`px-4 py-2 rounded-md text-white font-semibold transition ${
                            saving || !isValid
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-cyan-600 to-blue-500 hover:opacity-90"
                        }`}
                    >
                        {saving ? "Saving…" : service ? "Update" : "Create"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}