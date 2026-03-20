export const createFormData = (data = {}) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
        const value = data[key];

        // Handle arrays (e.g., multiple files)
        if (Array.isArray(value)) {
            value.forEach((item) => {
                formData.append(key, item);
            });
        }
        // Handle nested objects (optional)
        else if (typeof value === "object" && value !== null && !(value instanceof File)) {
            formData.append(key, JSON.stringify(value));
        }
        // Handle normal values + File
        else {
            formData.append(key, value);
        }
    });

    return formData;
};