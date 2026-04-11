import React, { useState, useEffect } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import BusinessAvatar from "./business/BusinessAvatar";
import AppLogo from "./AppLogo";
import NotificationsDialog from "./notifications/NotificationsDialog";
import { logoutUser } from "../utils/auth";

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function Header({navItems, isProvider}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || null;

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);



    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Syne:wght@700;800&display=swap"
                rel="stylesheet"
            />

            <header
                className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
                    scrolled ? "shadow-md" : ""
                }`}
            >
                {/* Top bar — Logo + Icons */}
                <div className="border-b border-gray-100">
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

                        <AppLogo to="/" size="sm" />

                        <div className="flex items-center justify-end gap-2 shrink-0">
                            <NotificationsDialog />

                            {/* User */}
                            {user && (
                                <div className="flex items-center gap-2 shrink-0">
                                    <div className="hidden sm:flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-2 max-w-[140px]">
                                        <BusinessAvatar
                                            imageUrl={
                                                user.profile?.profile_image
                                                    ? `${media_url}${user.profile.profile_image}`
                                                    : null
                                            }
                                            name={`${user.first_name} ${user.last_name}`}
                                            size="sm"
                                        />
                                        <p className="text-xs font-semibold text-gray-700 truncate">
                                            {user.first_name} {user.last_name}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        title="Log out"
                                        onClick={() => logoutUser(dispatch, navigate)}
                                        className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all duration-200"
                                    >
                                        <LogOut size={20} strokeWidth={1.8} />
                                    </button>
                                </div>
                            )}

                            {/* Hamburger — mobile only */}
                            <button
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all duration-200 md:hidden"
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                {menuOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar — Nav */}
                {!isProvider && <div className="border-b border-gray-100 hidden md:block">
                    <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-center gap-8">
                        {navItems.map((item, i) => (
                            <React.Fragment key={item.path}>
                                <NavLink
                                    to={item.path}
                                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                    className={({ isActive }) =>
                                        `text-[0.75rem] font-600 tracking-wide transition-colors relative pb-1
                                        after:absolute after:bottom-0 after:left-0 after:h-[2px] after:rounded-full after:bg-blue-600
                                        after:transition-all after:duration-300
                                        ${isActive
                                            ? "text-blue-600 font-700 after:w-full"
                                            : "text-gray-500 hover:text-blue-600 after:w-0 hover:after:w-full"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>

                                {i < navItems.length - 1 && (
                                    <span className="text-gray-200 text-sm select-none">|</span>
                                )}
                            </React.Fragment>
                        ))}

                        <span className="text-gray-200 text-sm select-none">|</span>

                    </div>
                </div>}

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white px-6 pb-6 pt-3 flex flex-col gap-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={() => setMenuOpen(false)}
                                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                                className={({ isActive }) =>
                                    `text-sm font-medium py-3 border-b border-gray-100 transition-colors
                                    ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                setMenuOpen(false);
                                logoutUser(dispatch, navigate);
                            }}
                            className="text-left text-sm font-medium py-3 text-red-600 hover:text-red-700"
                        >
                            Log out
                        </button>
                    </div>
                )}
            </header>
        </>
    );
}