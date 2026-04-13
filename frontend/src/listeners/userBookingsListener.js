import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'



export default function userBookingsListener(userId, set, onRefresh) {
    return useWebSocket(
        `ws/user_bookings/${userId}/`,
        {
            onOpen: () => console.log("Connected"),
            onRefresh,
            onClose: () => console.log("Disconnected"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}
