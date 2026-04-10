import React from 'react'

const currentUserId = JSON.parse(localStorage.getItem('user'))?.id

export default function MessageCard({ message }) {
    const { sender, content, image, created_at, is_read } = message
    const isOwn = sender?.id === currentUserId

    const time = new Date(created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    })

    return (
        <div className={`flex flex-col max-w-xs ${isOwn ? 'self-end items-end' : 'self-start items-start'}`}>
            {!isOwn && (
                <span className='text-xs text-gray-400 mb-1 ml-1'>{sender?.username}</span>
            )}
            <div className={`px-4 py-2 rounded-2xl text-sm
                ${isOwn
                    ? 'bg-blue-500 text-white rounded-br-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                }`}
            >
                {image && (
                    <img
                        src={image}
                        alt='attachment'
                        className='rounded-lg mb-2 max-w-full'
                    />
                )}
                <p>{content}</p>
            </div>
            <div className='flex items-center gap-1 mt-1 px-1'>
                <span className='text-xs text-gray-400'>{time}</span>
                {isOwn && (
                    <span className='text-xs text-gray-400'>{is_read ? '✓✓' : '✓'}</span>
                )}
            </div>
        </div>
    )
}