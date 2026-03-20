const API = import.meta.env.VITE_API_URL;

export const getRequest = async (endpoint, token = null) => {
    try {
        const res = await fetch(`${API}${endpoint}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Request failed");
        }

        return await res.json();

    } catch (error) {
        console.error("GET REQUEST ERROR:", error);
        throw error;
    }
};

export const postRequest = async (endpoint, data = {}, token = null, isForm = false) => {
    try {
        const headers = {
            ...(token && { Authorization: `Bearer ${token}` })
        };

        
        if (!isForm) {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetch(`${API}${endpoint}`, {
            method: "POST",
            headers,
            body: isForm ? data : JSON.stringify(data)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Request failed");
        }

        return await res.json();

    } catch (error) {
        console.error("POST REQUEST ERROR:", error);
        throw error;
    }
};

