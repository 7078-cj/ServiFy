import { markMessagesRead } from '../api/chat'
import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'

export function chatListener(conversationId, set, onRefresh) {
    return useWebSocket(
        `ws/chat/${conversationId}/`,
        {
            onOpen: () => console.log("Connected to chat"),
            onRefresh,
            onClose: () => console.log("Disconnected from chat"),
            onMessage: (data) => {
                handleMessage(data, set, { appendCreated: true })
                if (data.type === 'created') {
                    markMessagesRead(conversationId).catch(err => console.error("Mark read error:", err))
                }
            }
        }
    )
}