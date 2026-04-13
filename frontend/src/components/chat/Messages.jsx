import React, { useEffect, useState, useRef } from 'react'
import { fetchMessages, markMessagesRead } from '../../api/chat'
import MessageCard from './MessageCard'
import AddMessage from './AddMessage'
import { chatListener } from '../../listeners/chatListener'
import BusinessAvatar from '../business/BusinessAvatar'
import { getConversationAvatarParticipant } from '../../utils/chatParticipants'

const media_url = import.meta.env.VITE_MEDIA_URL

export default function Messages({ conversation }) {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const bottomRef = useRef(null)

    const loadMessages = async () => {
        try {
            const res = await fetchMessages(conversation.id)
            setMessages(res)
        } catch (err) {
            console.error("Error fetching messages:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setLoading(true)
        setMessages([])
        loadMessages()
        markMessagesRead(conversation.id).catch(err => console.error("Mark read error:", err))
    }, [conversation.id])

    const { connectionStatus: chatConnectionStatus } = chatListener(conversation.id, setMessages)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const names = conversation.participants?.map(p => p.username).join(', ')
    const primary = getConversationAvatarParticipant(conversation.participants)
    const headerName =
        [primary?.first_name, primary?.last_name].filter(Boolean).join(' ') || primary?.username || ''
    const headerImageUrl = primary?.profile?.profile_image
        ? `${media_url}${primary.profile.profile_image}`
        : null

    return (
        <div className='flex-1 flex flex-col h-full bg-gray-50'>
            <div className='px-6 py-4 bg-white border-b border-gray-200 flex items-center gap-3'>
                <BusinessAvatar name={headerName || names || '?'} imageUrl={headerImageUrl} size="sm" />
                <h3 className='font-semibold text-gray-800 truncate'>{names}</h3>
                <span
                    className={`ml-auto rounded-full px-2.5 py-1 text-xs font-semibold ${
                        chatConnectionStatus === "connected"
                            ? "bg-emerald-100 text-emerald-700"
                            : chatConnectionStatus === "connecting"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-200 text-gray-700"
                    }`}
                >
                    {chatConnectionStatus === "connected"
                        ? "Live"
                        : chatConnectionStatus === "connecting"
                            ? "Connecting..."
                            : "Offline"}
                </span>
            </div>

            <div className='flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2'>
                {loading ? (
                    <p className='text-center text-gray-400 mt-8'>Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className='text-center text-gray-400 mt-8'>No messages yet. Say hello!</p>
                ) : (
                    messages.map(msg => (
                        <MessageCard key={msg.id} message={msg} conversationId={conversation.id} />
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            <AddMessage
                conversationId={conversation.id}
            />
        </div>
    )
}