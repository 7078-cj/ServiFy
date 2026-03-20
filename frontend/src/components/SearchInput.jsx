import React from 'react'

export default function SearchInput({searchQuery, setSearchQuery, action=null}) {
    return (
        <div className="absolute top-2 left-2 z-10 flex space-x-2">
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a place..."
                className="px-2 py-1 border rounded-md shadow text-sm"
            />
            <button
                onClick={action}
                className="px-3 py-1 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 text-sm"
            >
                Search
            </button>
        </div>
    )
}
