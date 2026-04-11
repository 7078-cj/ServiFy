import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { validateProfileFields } from "../../utils/validation";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const media_url = import.meta.env.VITE_MEDIA_URL;
export default function EditProfileModal({ open, onClose, profile, onSave }) {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        profile_image: null,
        phone: "",
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [fieldErrors, setFieldErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && profile) {
        setFormData({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            username: profile.username || "",
            email: profile.email || "",
            profile_image: null,
            phone: profile.profile.phone || "",
        });
        setImagePreview(media_url + profile.profile.profile_image || null);
        setFieldErrors({});
        }
    }, [open, profile]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "profile_image") {
        const file = files[0];
        setFormData((prev) => ({ ...prev, profile_image: file }));
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
        } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = async () => {
        const { valid, errors } = validateProfileFields(formData);
        if (!valid) {
            setFieldErrors(errors);
            toast.error(Object.values(errors)[0]);
            return;
        }
        setFieldErrors({});
        const data = new FormData();
        data.append("first_name", formData.first_name);
        data.append("last_name", formData.last_name);
        data.append("username", formData.username);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        if (formData.profile_image) {
            data.append("profile_image", formData.profile_image);
        }
        setSaving(true);
        try {
            await onSave?.(data);
            toast.success("Profile updated.");
        } catch (e) {
            toast.error(e?.message || "Could not update profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setImagePreview(null);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="bg-white border shadow-xl max-w-md">
            <DialogHeader>
            <DialogTitle
                className="text-lg font-bold"
                style={{ color: "#3182ce" }}
            >
                Edit Profile
            </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
            {Object.keys(fieldErrors).length > 0 && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                    {Object.values(fieldErrors)[0]}
                </p>
            )}
            {/* Image Preview + Upload */}
            <div className="flex flex-col items-center gap-3">
                {imagePreview ? (
                <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 shadow"
                    style={{ borderColor: "#1a9cb0" }}
                />
                ) : (
                <div
                    className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold shadow border-4"
                    style={{
                    background: "linear-gradient(135deg, #0f6e84, #3182ce)",
                    borderColor: "#e2f4f7",
                    color: "#fff",
                    }}
                >
                    {formData.first_name?.charAt(0) || profile?.first_name?.charAt(0)}
                </div>
                )}

                <div className="w-full">
                <Label className="text-xs text-gray-500 mb-1 block">
                    Profile Image
                </Label>
                <Input
                    type="file"
                    name="profile_image"
                    accept="image/*"
                    onChange={handleChange}
                    className="text-sm"
                />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                <Label className="text-xs text-gray-500 mb-1 block">First Name</Label>
                <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                />
                </div>
                <div>
                <Label className="text-xs text-gray-500 mb-1 block">Last Name</Label>
                <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                />
                </div>
            </div>

            <div>
                <Label className="text-xs text-gray-500 mb-1 block">Username</Label>
                <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                />
            </div>

            <div>
                <Label className="text-xs text-gray-500 mb-1 block">Phone Number</Label>
                <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                />
            </div>

            <div>
                <Label className="text-xs text-gray-500 mb-1 block">Email</Label>
                <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                />
            </div>
            </div>

            <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={handleClose}>
                Cancel
            </Button>
            <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 rounded-md text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{
                background: "linear-gradient(90deg, #0f6e84 0%, #3182ce 100%)",
                }}
            >
                {saving ? "Saving…" : "Save Changes"}
            </button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    );
}