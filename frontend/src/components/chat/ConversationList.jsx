import React, { useEffect, useState } from 'react'
import { fetchConversations } from '../../api/conversation'
import ConversationCard from './ConversationCard'
import { conversationListener } from '../../listeners/conversationListener'

export default function ConversationList({ selectedConversation, setSelectedConversation }) {
    const [conversations, setConversations] = useState([])
    const [loading, setLoading] = useState(true)
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

    conversationListener(user.id, setConversations)

    return (
        <div className='w-80 h-full bg-white border-r border-gray-200 flex flex-col'>
            <div className='p-4 border-b border-gray-200'>
                <h2 className='text-lg font-semibold text-gray-800'>Messages</h2>
            </div>

            <div className='flex-1 overflow-y-auto'>
                {loading ? (
                    <p className='text-center text-gray-400 mt-8'>Loading...</p>
                ) : conversations.length === 0 ? (
                    <p className='text-center text-gray-400 mt-8'>No conversations yet</p>
                ) : (
                    conversations.map(convo => (
                        <ConversationCard
                            key={convo.id}
                            conversation={convo}
                            isSelected={selectedConversation?.id === convo.id}
                            onClick={() => setSelectedConversation(convo)}
                        />
                    ))
                )}
            </div>
        </div>
    )
}