import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'

export function useNotificationListener(userId, set, onRefresh, normalize) {
    return useWebSocket(
        `ws/notification/${userId}/`,
        {
            onOpen: () => console.log("Connected to notification"),
            onRefresh,
            onClose: () => console.log("Disconnected from notification"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}