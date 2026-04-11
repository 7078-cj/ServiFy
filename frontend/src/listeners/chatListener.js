import { markMessagesRead } from '../api/chat'
import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'

export function chatListener(conversationId, set) {
    useWebSocket(
        `ws/chat/${conversationId}/`,
        {
            onOpen: () => console.log("Connected to chat"),
            onClose: () => console.log("Disconnected from chat"),
            onMessage: (data) => {
                handleMessage(data, set)
                if (data.type === 'created') {
                    markMessagesRead(conversationId).catch(err => console.error("Mark read error:", err))
                }
            }
        }
    )
}