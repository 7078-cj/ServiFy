import { getRequest, postRequest, putRequest } from "../utils/reqests/requests"
import { requireToken } from "./access"

export function fetchConversations() {
    const access = requireToken()
    return getRequest(
        `chat/conversations/`,
        access
    )
}

export function createConversation(providerId) {
    const access = requireToken()
    return postRequest(
        `chat/conversations/${providerId}/`,
        {'null':null},
        access,
    )
}

export function deleteConversation(conversationId) {
    const access = requireToken()
    return deleteRequest(
        `chat/conversations/delete/${conversationId}/`,
        access,
    )
}