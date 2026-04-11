import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditProfileModal from "../components/profile/EditProfileModal";
import ProfileDetails from "../components/profile/ProfileDetails";
import { setProfile } from "../features/profile/profileSlice";
import { Button } from "../components/ui/button";
import AddUpdateBusinessModal from "../components/business/AddUpdateBusinessModal";
import { Plus } from "lucide-react";
import BusinessList from "../components/business/BusinessList";
import { createBusiness, getUserBusinesses } from "../api/business";
import { editProfile } from "../api/profile";

export default function Profile() {
    const { profile } = useSelector((state) => state.profile);
    const { businesses } = useSelector((state) => state.business);
    const { tokens } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const [modalOpen, setModalOpen] = useState(false);
    const [businessModalOpen, setBusinessModalOpen] = useState(false);

    const handleProfileSave = (formData) => editProfile(formData, setModalOpen, dispatch);

    const handleBusinessSave = (formData) =>
        createBusiness(formData, dispatch, setBusinessModalOpen);

    useEffect(() => {
        if (tokens.access) {
            getUserBusinesses(dispatch);
        } else {
            dispatch(setProfile(null));
        }
    }, [tokens.access]);

    if (!profile) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-400">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* LEFT — sticky profile card */}
                    <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-8">
                        <div className="rounded-2xl overflow-hidden shadow-sm bg-white border border-gray-100">
                            {/* Gradient cover */}
                            <div className="h-20 bg-gradient-to-r from-[#0f6e84] to-blue-500" />
                            {/* Profile details */}
                            <div className="px-5 pb-5">
                                <ProfileDetails
                                    profile={profile}
                                    setModalOpen={setModalOpen}
                                />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — businesses */}
                    <div className="flex-1 min-w-0 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Your Businesses
                                </h3>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {businesses?.length ?? 0} business{businesses?.length === 1 ? "" : "es"}
                                </p>
                            </div>
                            <Button
                                onClick={() => setBusinessModalOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus size={16} />
                                Add Business
                            </Button>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <BusinessList businesses={businesses} isDashboard={false} />
                        </div>
                    </div>
                </div>
            </div>

            <AddUpdateBusinessModal
                open={businessModalOpen}
                onClose={() => setBusinessModalOpen(false)}
                onSave={handleBusinessSave}
            />

            <EditProfileModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                profile={profile}
                onSave={handleProfileSave}
            />
        </div>
    );
}