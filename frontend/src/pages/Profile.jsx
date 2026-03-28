import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileModal from "../components/profile/EditProfileModal";
import ProfileDetails from "../components/profile/ProfileDetails";


export default function Profile() {
    const { profile } = useSelector((state) => state.profile);

    const [modalOpen, setModalOpen] = useState(false);

    const handleSave = (formData) => {
        console.log("Updating...", formData);
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