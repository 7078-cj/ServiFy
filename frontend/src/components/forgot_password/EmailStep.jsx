import { useState } from "react";

export default function EmailStep({ onSubmit }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        try {
            await onSubmit(email);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col text-sm font-medium text-gray-700">
                Email address
                <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                    required
                    disabled={loading}
                    autoComplete="email"
                />
            </label>

            <button
                type="submit"
                disabled={loading}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-md
        ${
            loading
                ? "bg-blue-400 cursor-not-allowed shadow-none"
                : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg"
        }`}
            >
                {loading ? (
                    <>
                        <svg
                            className="animate-spin h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8H4z"
                            />
                        </svg>
                        Sending code…
                    </>
                ) : (
                    "Send reset code"
                )}
            </button>
        </form>
    );
}
