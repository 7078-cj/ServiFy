import React, { useState } from 'react'
import ConversationList from '../components/chat/ConversationList'
import Messages from '../components/chat/Messages'

export default function Chats() {
    const [selectedConversation, setSelectedConversation] = useState(null)

    return (
        <div className='flex flex-row h-screen bg-gray-100'>
            <ConversationList
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