import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'

export function conversationListener(userId, set, onRefresh) {
    return useWebSocket(
        `ws/conversation/${userId}/`,
        {
            onOpen: () => console.log("Connected to conversation"),
            onRefresh,
            onClose: () => console.log("Disconnected from conversation"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}