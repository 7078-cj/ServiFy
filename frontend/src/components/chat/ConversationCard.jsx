import React from 'react'
import BusinessAvatar from '../business/BusinessAvatar'
import { getConversationAvatarParticipant } from '../../utils/chatParticipants'

const media_url = import.meta.env.VITE_MEDIA_URL

export default function ConversationCard({ conversation, isSelected, onClick }) {
    const { participants } = conversation
    const names = participants?.map(p => p.username).join(', ')

    const primary = getConversationAvatarParticipant(participants)
    const avatarName =
        [primary?.first_name, primary?.last_name].filter(Boolean).join(' ') || primary?.username || '?'
    const imageUrl = primary?.profile?.profile_image ? `${media_url}${primary.profile.profile_image}` : null

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors
                ${isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
        >
            <BusinessAvatar name={avatarName} imageUrl={imageUrl} size="sm" />
            <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-800 truncate'>{names || 'Unknown'}</p>
                <p className='text-xs text-gray-400 truncate'>
                    {conversation.last_message?.content || 'No messages yet'}
                </p>
            </div>
        </div>
    )
}