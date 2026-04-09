import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'

export function chatListener(userId, set) {
    useWebSocket(
        `ws/conversation/${userId}/`,
        {
            onOpen: () => console.log("Connected to chat"),
            onClose: () => console.log("Disconnected from chat"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}