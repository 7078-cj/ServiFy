import { getRequest, postRequest, putRequest, deleteRequest } from "../utils/reqests/requests"
import { requireToken } from "./access"

export function fetchMessages(conversationId) {
    const access = requireToken()
    return getRequest(
        `chat/conversations/${conversationId}/messages/`,
        access
    )
}

export function createMessage(conversationId, formData) {
    const access = requireToken()
    return postRequest(
        `chat/conversations/${conversationId}/messages/`,
        formData,
        access,
        true
    )
}

export function updateMessage(conversationId, messageId, formData) {
    const access = requireToken()
    return putRequest(
        `chat/conversations/${conversationId}/messages/${messageId}/`,
        formData,
        access,
        true
    )
}

export function deleteMessage(conversationId, messageId) {
    const access = requireToken()
    return deleteRequest(
        `chat/conversations/${conversationId}/messages/${messageId}/`,
        access
    )
}