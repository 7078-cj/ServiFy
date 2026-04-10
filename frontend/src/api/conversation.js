import { getRequest, postRequest, putRequest } from "../utils/reqests/requests"
import { requireToken } from "./access"

export function fetchConversations() {
    const access = requireToken()
    return getRequest(
        `chat/conversations/`,
        access
    )
}

export async function createConversation(providerId,onExisting) {

    const access = requireToken()
        try {
            return await postRequest(
                `chat/conversations/`,
                { provider_id: providerId },
                access,
            )
        } catch (err) {
            
            if (err.conversation_id) {
                onExisting?.(err.conversation_id)
                return null
            }
            throw err
        }
}

export function deleteConversation(conversationId) {
    const access = requireToken()
    return deleteRequest(
        `chat/conversations/delete/${conversationId}/`,
        access,
    )
}