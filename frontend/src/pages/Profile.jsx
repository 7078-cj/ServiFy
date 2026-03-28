import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileModal from "../components/profile/EditProfileModal";
import ProfileDetails from "../components/profile/ProfileDetails";
import { putRequest } from "../utils/reqests/requests";


export default function Profile() {
    const { profile } = useSelector((state) => state.profile);
    const {tokens} = useSelector((state) => state.auth);

    const [modalOpen, setModalOpen] = useState(false);

    const handleSave = async (formData) => {         // ← async
        try {
            const updatedProfile = await putRequest(  // ← await
                "user/profile/update",
                formData,
                tokens.access,
                true
            );
            console.log("Profile updated:", updatedProfile);
            setModalOpen(false);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    if (!profile) {
        return (
        <div className="flex items-center justify-center h-64 text-gray-500">
            Loading profile...
        </div>
        );
    }

    return (
        <div
        className="max-w-screen mx-auto rounded-2xl shadow-md overflow-hidden"
        style={{ background: "#fff" }}
        >
        {/* Top teal/blue banner */}
        <div
            className="h-16 w-full"
            style={{
            background: "linear-gradient(90deg, #0f6e84 0%, #3182ce 100%)",
            }}
        />

        <ProfileDetails profile={profile} setModalOpen={setModalOpen} />

        <EditProfileModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            profile={profile}
            onSave={handleSave}
        />
        </div>
    );
}