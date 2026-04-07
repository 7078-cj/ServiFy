export function getAccessToken() {
    try {
        const stored = localStorage.getItem("authTokens")
        if (!stored) return null
        return JSON.parse(stored)?.access
    } catch (err) {
        console.error("Invalid token format:", err)
        return null
    }
}



export function requireToken() {
    const token = getAccessToken()
    if (!token) {
        console.warn("No access token found")
        throw new Error("Unauthorized")
    }
    return token
}
