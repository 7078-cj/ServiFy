import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'

export function useReviewListener(businessId, set) {
    return useWebSocket(
        `ws/business_reviews/${businessId}/`,
        {
            onOpen: () => console.log("Connected to reviews"),
            onClose: () => console.log("Disconnected from reviews"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}