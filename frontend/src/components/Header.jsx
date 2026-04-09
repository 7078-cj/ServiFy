import React, { useState, useEffect } from "react";
import { Bell, User, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import BusinessAvatar from "./business/BusinessAvatar";

const media_url = import.meta.env.VITE_MEDIA_URL;

export default function Header({navItems, isProvider}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const user = JSON.parse(localStorage.getItem("user")) || null

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
                    <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">

                        {/* Left spacer */}
                        <div className="w-32" />

                        {/* Logo */}
                        <h1
                            className="text-[1.9rem] tracking-tight text-gray-900 select-none leading-none"
                            style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800 }}
                        >
                            SERVI<span className="text-blue-600">FY</span>
                        </h1>

                        {/* Right — icons */}
                        <div className="w-32 flex items-center justify-end gap-2">
                            {/* Bell */}
                            <button className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-500 hover:text-blue-600 transition-all duration-200">
                                <Bell size={22} strokeWidth={1.8} />
                                {/* notification dot */}
                                {/* <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full ring-2 ring-white" /> */}
                            </button>

                            {/* User */}
                            {user && <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-2 shrink-0">
                                <BusinessAvatar
                                                imageUrl={user.profile.profile_image ? `${media_url}${user.profile.profile_image}` : null}
                                                name={`${user.first_name} ${user.last_name}`}
                                                size="sm"
                                                />
                                <p className="text-xs font-semibold text-gray-700">
                                    {user.first_name} {user.last_name}
                                </p>
                            </div>}

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

                {/* Bottom bar — Nav + CTA */}
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
                    </div>
                )}
            </header>
        </>
    );
}