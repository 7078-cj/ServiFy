import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'

export function conversationListener(userId, set) {
    useWebSocket(
        `ws/conversation/${userId}/`,
        {
            onOpen: () => console.log("Connected to conversation"),
            onClose: () => console.log("Disconnected from conversation"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}