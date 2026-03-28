import React, { useState } from "react";
import { useSelector } from "react-redux";
import EditProfileModal from "../components/profile/EditProfileModal";


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

        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* LEFT SIDE */}
            <div className="flex flex-col items-center text-center border-r pr-6">
                {/* Avatar */}
                {profile.profile_image ? (
                <img
                    src={profile.profile_image}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover shadow-lg border-4"
                    style={{ borderColor: "#1a9cb0", marginTop: "-3rem" }}
                />
                ) : (
                <div
                    className="w-40 h-40 rounded-full flex items-center justify-center text-5xl font-bold shadow-lg border-4"
                    style={{
                    background: "linear-gradient(135deg, #0f6e84, #3182ce)",
                    borderColor: "#fff",
                    color: "#fff",
                    marginTop: "-3rem",
                    }}
                >
                    {profile.first_name?.charAt(0)}
                </div>
                )}

                <h2 className="mt-4 text-xl font-bold text-gray-800">
                {profile.first_name} {profile.last_name}
                </h2>

                <p className="text-gray-400 text-sm mt-0.5">@{profile.username}</p>

                <button

                onClick={() => setModalOpen(true)}
                className="mt-5 w-full py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{
                    background: "linear-gradient(90deg, #0f6e84 0%, #3182ce 100%)",
                }}
                >
                Edit Profile
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="md:col-span-2 space-y-6">
                {/* Contact Info */}
                <div>
                <h3
                    className="text-base font-semibold mb-3 pb-1 border-b"
                    style={{ color: "#3182ce", borderColor: "#e2f4f7" }}
                >
                    Contact Information
                </h3>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-white text-xs font-bold shrink-0"
                        style={{ background: "#3182ce" }}
                    >
                        @
                    </span>
                    <div>
                        <p className="text-xs text-gray-400 leading-none mb-0.5">Email</p>
                        <p className="font-medium">{profile.email}</p>
                    </div>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-gray-700">
                    <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-md text-white text-xs font-bold shrink-0"
                        style={{ background: "#3182ce" }}
                    >
                        #
                    </span>
                    <div>
                        <p className="text-xs text-gray-400 leading-none mb-0.5">Username</p>
                        <p className="font-medium">{profile.username}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

        <EditProfileModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            profile={profile}
            onSave={handleSave}
        />
        </div>
    );
}