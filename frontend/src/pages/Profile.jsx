import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditProfileModal from "../components/profile/EditProfileModal";
import ProfileDetails from "../components/profile/ProfileDetails";
import { getRequest, postRequest, putRequest } from "../utils/reqests/requests";
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

    const handleProfileSave = async (formData) => {
        await editProfile(formData, setModalOpen, dispatch)
    };

    const handleBusinessSave = async (formData) => {
        await createBusiness(formData, dispatch, setBusinessModalOpen)
    };

    useEffect(() => {
        if (tokens.access){
            getUserBusinesses(dispatch)
        }
        else {
            dispatch(setProfile(null))
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* ✨ HEADER CARD */}
                <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white">
                    
                    {/* Gradient Cover */}
                    <div className="h-24 bg-gradient-to-r from-[#0f6e84] to-blue-500" />

                    {/* Profile Section */}
                    <div className="px-6 pb-6">
                        <ProfileDetails 
                            profile={profile} 
                            setModalOpen={setModalOpen} 
                        />
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Your Businesses
                    </h3>

                    <Button
                        onClick={() => setBusinessModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Add Business
                    </Button>
                </div>


                <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
                    <BusinessList businesses={businesses} isDashboard={false} />
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