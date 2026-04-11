import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

/**
 * Reusable confirmation modal (fixed overlay, above header z-50).
 */
export default function ConfirmDialog({
    open,
    onClose,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    loading = false,
    danger = false,
}) {
    const Icon = danger ? Trash2 : AlertTriangle;
    if (!open) return null;

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget && !loading) onClose?.();
    };

    return (
        <div
            className="fixed inset-0 z-[220] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
            onClick={handleBackdrop}
            role="presentation"
        >
            <div
                className="w-full max-w-sm rounded-2xl border border-gray-100 bg-white p-6 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                        danger ? "bg-red-50" : "bg-blue-50"
                    }`}
                >
                    <Icon className={`h-5 w-5 ${danger ? "text-red-500" : "text-blue-600"}`} />
                </div>
                <h2 id="confirm-dialog-title" className="text-center text-base font-semibold text-gray-900">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 text-center text-sm text-gray-500">{description}</p>
                )}
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={() => !loading && onClose?.()}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={() => !loading && onConfirm?.()}
                        disabled={loading}
                        className={`flex-1 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                            danger
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Please wait…" : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
