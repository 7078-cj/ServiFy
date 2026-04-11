import React from 'react'

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function ProfileDetails({ profile, setModalOpen }) {
    return (
        <div>
            {/* Avatar — overlapping cover */}
            <div className="-mt-12 mb-4 flex justify-start">
                {profile.profile.profile_image ? (
                    <img
                        src={media_url + profile.profile.profile_image}
                        alt="Profile"
                        className="w-20 h-20 rounded-2xl object-cover shadow-md border-4 border-white"
                    />
                ) : (
                    <div
                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-md border-4 border-white"
                        style={{ background: "linear-gradient(135deg, #0f6e84, #3182ce)", color: "#fff" }}
                    >
                        {profile.first_name?.charAt(0)}
                    </div>
                )}
            </div>

            {/* Name & username */}
            <h2 className="text-base font-semibold text-gray-900">
                {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">@{profile.username}</p>

            {/* Divider */}
            <div className="border-t border-gray-100 my-4" />

            {/* Contact info */}
            <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Contact
                </p>

                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold shrink-0"
                        style={{ background: "#3182ce" }}>
                        @
                    </span>
                    <div className="min-w-0">
                        <p className="text-[11px] text-gray-400 leading-none mb-0.5">Email</p>
                        <p className="text-sm font-medium text-gray-700 truncate">{profile.email}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold shrink-0"
                        style={{ background: "#3182ce" }}>
                        #
                    </span>
                    <div className="min-w-0">
                        <p className="text-[11px] text-gray-400 leading-none mb-0.5">Username</p>
                        <p className="text-sm font-medium text-gray-700 truncate">{profile.username}</p>
                    </div>
                </div>

                {profile.profile.phone && (
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-white text-xs font-bold shrink-0"
                            style={{ background: "#3182ce" }}>
                            #
                        </span>
                        <div className="min-w-0">
                            <p className="text-[11px] text-gray-400 leading-none mb-0.5">Phone</p>
                            <p className="text-sm font-medium text-gray-700 truncate">{profile.profile.phone}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit button */}
            <button
                onClick={() => setModalOpen(true)}
                className="mt-5 w-full py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(90deg, #0f6e84 0%, #3182ce 100%)" }}
            >
                Edit Profile
            </button>
        </div>
    )
}