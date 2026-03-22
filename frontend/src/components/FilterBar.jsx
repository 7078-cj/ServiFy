import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";

const filters = [
    { label: "Price", options: ["Option 1", "Option 2", "Option 3"] },
    { label: "Rating", options: ["Option 1", "Option 2"] },
    { label: "Distance", options: ["Option 1", "Option 2", "Option 3"] },
    { label: "Availability", options: ["Option 1"] }
];

export default function FilterBar() {
    const [selected, setSelected] = useState({});

    const handleSelect = (filterLabel, option) => {
        setSelected(prev => ({ ...prev, [filterLabel]: option }));
    };

    return (
        <div className='w-full border-b border-gray-300 bg-white px-4 py-3'>
            {/* Scrollable filter row on mobile, centered on desktop */}
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide md:justify-center">
                {filters.map((filter) => (
                    <DropdownMenu key={filter.label}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="rounded-full text-sm flex items-center gap-2 px-4 py-1.5 
                                        hover:bg-gray-100 data-[state=open]:bg-gray-100 
                                        transition whitespace-nowrap flex-shrink-0"
                            >
                                {filter.label}
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="min-w-[150px]">
                            {filter.options.map((option) => (
                                <DropdownMenuItem
                                    key={option}
                                    onClick={() => handleSelect(filter.label, option)}
                                    className="flex items-center justify-between cursor-pointer"
                                >
                                    {option}
                                    {selected[filter.label] === option && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                ))}
            </div>
        </div>
    );
}