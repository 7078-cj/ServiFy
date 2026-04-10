import { useEffect, useRef, useState } from "react"
import { requireToken } from "../api/access"

export default function useWebSocket(url, options = {}) {
    const BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8000"
    const fullUrl = `${BASE_URL}${url}`
    const socketRef = useRef(null)
    const [connected, setConnected] = useState(false)
    const [lastMessage, setLastMessage] = useState(null)
    const token = requireToken()

    const {
        onOpen,
        onClose,
        onError,
        onMessage,
        reconnect = false,
        reconnectInterval = 3000,
    } = options

    useEffect(() => {
        let socket
        let reconnectTimeout

        const connect = () => {
            socket = new WebSocket(`${fullUrl}?token=${token}`)
            socketRef.current = socket

            socket.onopen = () => {
                setConnected(true)
                onOpen && onOpen()
            }

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)
                    setLastMessage(data)
                    onMessage && onMessage(data)
                } catch {
                    setLastMessage(event.data)
                    onMessage && onMessage(event.data)
                }
            }

            socket.onerror = (err) => {
                onError && onError(err)
            }

            socket.onclose = () => {
                setConnected(false)
                onClose && onClose()

                if (reconnect) {
                    reconnectTimeout = setTimeout(connect, reconnectInterval)
                }
            }
        }

        connect()

        return () => {
            if (reconnectTimeout) clearTimeout(reconnectTimeout)
            socket?.close()
        }
    }, [url])

    const sendMessage = (data) => {
        if (socketRef.current && connected) {
            socketRef.current.send(
                typeof data === "string" ? data : JSON.stringify(data)
            )
        }
    }

    return {
        socket: socketRef.current,
        connected,
        lastMessage,
        sendMessage
    }
}