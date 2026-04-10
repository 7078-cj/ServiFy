import React, { useEffect, useState, useRef } from 'react'
import { fetchMessages } from '../../api/chat'
import MessageCard from './MessageCard'
import AddMessage from './AddMessage'
import { chatListener } from '../../listeners/chatListener'

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
    }, [conversation.id])

    chatListener(conversation.id,setMessages)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const names = conversation.participants?.map(p => p.username).join(', ')

    return (
        <div className='flex-1 flex flex-col h-full bg-gray-50'>
            <div className='px-6 py-4 bg-white border-b border-gray-200'>
                <h3 className='font-semibold text-gray-800'>{names}</h3>
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
                onMessageSent={(newMsg) => setMessages(prev => [...prev, newMsg])}
            />
        </div>
    )
}