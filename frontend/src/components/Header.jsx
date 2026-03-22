import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Bell, User, Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { name: "Explore", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Bookings", path: "/bookings" },
    ];

    return (
        <header className="w-full border border-gray-300 bg-white relative z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
                {/* Left: Logo + Desktop Nav */}
                <div className="flex items-center gap-8">
                    <h1 className="text-blue-600 font-semibold text-lg whitespace-nowrap">
                        SERVIFY
                    </h1>
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `text-sm font-medium transition relative ${
                                        isActive
                                            ? "text-blue-600 after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-blue-600"
                                            : "text-gray-500 hover:text-black"
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    <Button className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2">
                        JOIN AS PROVIDER
                    </Button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </button>
                    <button className="p-2 rounded-full hover:bg-gray-100">
                        <User className="w-5 h-5 text-gray-600" />
                    </button>
                    {/* Hamburger */}
                    <button
                        className="md:hidden p-2 rounded-full hover:bg-gray-100"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 flex flex-col gap-3">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => setMenuOpen(false)}
                            className={({ isActive }) =>
                                `text-sm font-medium py-1 ${
                                    isActive ? "text-blue-600" : "text-gray-600 hover:text-black"
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    ))}
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 w-full sm:hidden">
                        JOIN AS PROVIDER
                    </Button>
                </div>
            )}
        </header>
    );
}