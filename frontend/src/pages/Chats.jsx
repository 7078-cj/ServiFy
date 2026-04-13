import React, { useState, useEffect } from 'react'
import ConversationList from '../components/chat/ConversationList'
import Messages from '../components/chat/Messages'
import { useParams } from 'react-router-dom'
import { fetchConversations } from '../api/conversation'
import { conversationListener } from '../listeners/conversationListener'

export default function Chats() {
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    const user = JSON.parse(localStorage.getItem("user")) || null

    useEffect(() => {
        const loadConversations = async () => {
            try {
                const res = await fetchConversations()
                setConversations(res)
            } catch (err) {
                console.error("Error fetching conversations:", err)
            } finally {
                setLoading(false)
            }
        }
        loadConversations()
    }, [])

    // Once conversations are loaded, auto-select based on URL param
    useEffect(() => {
        if (id && conversations.length > 0) {
            const match = conversations.find(c => String(c.id) === String(id))
            if (match) setSelectedConversation(match)
        }
    }, [id, conversations])

    const { connectionStatus: conversationsSocketStatus } = conversationListener(user?.id, setConversations)

    return (
        <div className='flex flex-row h-screen bg-gray-100 relative'>
            <div className="absolute top-3 right-4 z-10">
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        conversationsSocketStatus === "connected"
                            ? "bg-emerald-100 text-emerald-700"
                            : conversationsSocketStatus === "connecting"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-200 text-gray-700"
                    }`}
                >
                    {conversationsSocketStatus === "connected"
                        ? "Realtime: Live"
                        : conversationsSocketStatus === "connecting"
                            ? "Realtime: Connecting..."
                            : "Realtime: Offline"}
                </span>
            </div>
            <ConversationList
                conversations={conversations}
                loading={loading}
                selectedConversation={selectedConversation}
                setSelectedConversation={setSelectedConversation}
            />
            {selectedConversation
                ? <Messages conversation={selectedConversation} />
                : (
                    <div className='flex-1 flex items-center justify-center text-gray-400'>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )
            }
        </div>
    )
}