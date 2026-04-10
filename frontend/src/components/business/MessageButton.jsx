import React from 'react'
import { createConversation } from '../../api/conversation'
import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { MessageCircle } from 'lucide-react'

export default function MessageButton({ providerId }) {
    const nav = useNavigate()

    const onExisting = (convo_id) => {
        nav(`/chats/${convo_id}`)
    }
    

    const handlePress = async () => {
        const res = await createConversation(providerId, onExisting)
        nav(`/chats/${res.id}`)
    }

    return (
        <Button variant="outline" onClick={handlePress} className="flex items-center gap-2">
            <MessageCircle size={16} />
            Message
        </Button>
    )
}