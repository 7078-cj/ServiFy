import React from 'react'
import useWebSocket from '../hooks/useWebsocket'
import { handleMessage } from './utils/listenerUtils'



export default function businessBookingsListener(userId,set) {
    const { connected, lastMessage } = useWebSocket(
        `ws/business_bookings/${userId}/`,
        {
            onOpen: () => console.log("Connected"),
            onClose: () => console.log("Disconnected"),
            onMessage: (data) => {
                handleMessage(data, set)
            }
        }
    )
}
