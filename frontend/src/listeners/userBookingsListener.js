import React from 'react'
import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'



export default function userBookingsListener(userId,set) {
    const { connected, lastMessage } = useWebSocket(
        `ws/user_bookings/${userId}/`,
        {
            onOpen: () => console.log("Connected"),
            onClose: () => console.log("Disconnected"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}
