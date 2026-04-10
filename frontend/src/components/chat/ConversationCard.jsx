import React from 'react'

export default function ConversationCard({ conversation, isSelected, onClick }) {
    const { participants, last_message } = conversation
    const names = participants?.map(p => p.username).join(', ')

    const initials = participants
        ?.slice(0, 2)
        .map(p => p.username?.[0]?.toUpperCase())
        .join('')

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors
                ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
        >
            <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm flex items-center justify-center flex-shrink-0'>
                {initials || '?'}
            </div>
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-800 truncate'>{names || 'Unknown'}</p>
                <p className='text-xs text-gray-400 truncate'>
                    {last_message.content || 'No messages yet'}
                </p>
            </div>
        </div>
    )
}