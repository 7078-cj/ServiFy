import React from "react";
import { Button } from "../../components/ui/button";
import { Bell, User } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Header() {
    const navItems = [
        { name: "Explore", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Bookings", path: "/bookings" },
    ];

    return (
    <header className="w-full border-b bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-2 py-3">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
            <h1 className="text-blue-600 font-semibold text-lg whitespace-nowrap">
                The Editorial Marketplace
            </h1>

        <nav className="flex items-center gap-6">
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
        <div className="flex items-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2">
                JOIN AS PROVIDER
            </Button>

        <button className="p-2 rounded-full hover:bg-gray-100">
            <Bell className="w-5 h-5 text-gray-600" />
        </button>

        <button className="p-2 rounded-full hover:bg-gray-100">
            <User className="w-5 h-5 text-gray-600" />
        </button>
        </div>
    </div>
    </header>
);
}
