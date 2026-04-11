import { toast } from "sonner";

/** Human-readable message from API JSON or thrown Error. */
export function getApiErrorMessage(data) {
    if (data == null) return "Something went wrong.";
    if (typeof data === "string") return data;
    if (data.message && typeof data.message === "string") return data.message;
    if (data.detail) {
        if (typeof data.detail === "string") return data.detail;
        if (Array.isArray(data.detail)) return data.detail.map(String).join(" ");
    }
    if (Array.isArray(data.non_field_errors)) return data.non_field_errors.join(" ");
    const fieldKeys = Object.keys(data).filter((k) => Array.isArray(data[k]));
    if (fieldKeys.length) {
        return fieldKeys.map((k) => `${k}: ${data[k].join(", ")}`).join("; ");
    }
    return "Something went wrong.";
}

export function toastApiError(err, fallback = "Something went wrong.") {
    const msg =
        err && typeof err === "object" && "message" in err && err.message
            ? err.message
            : typeof err === "string"
              ? err
              : fallback;
    toast.error(msg);
}

export function toastApiSuccess(message) {
    toast.success(message);
}
