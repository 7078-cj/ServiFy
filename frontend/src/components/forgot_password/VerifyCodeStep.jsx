import { useState, useEffect } from "react";

export default function VerifyCodeStep({ onSubmit, onResend, email }) {
    const [code, setCode] = useState("");
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(code);
    };

    const handleResend = () => {
        onResend();
        setTimeLeft(300);
    };

    const formatTime = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {email && (
                <p className="text-sm text-gray-600 -mt-1">
                    We sent a code to{" "}
                    <span className="font-semibold text-gray-900">{email}</span>
                </p>
            )}

            <label className="flex flex-col text-sm font-medium text-gray-700">
                Verification code
                <input
                    type="text"
                    inputMode="numeric"
                    placeholder="••••"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    className="mt-1.5 px-4 py-3 border border-gray-300 rounded-xl text-center tracking-[0.35em] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
                    maxLength={4}
                    required
                    autoComplete="one-time-code"
                />
            </label>

            <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm transition shadow-md hover:shadow-lg"
            >
                Verify code
            </button>

            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-center">
                <p className="text-xs text-gray-500">
                    Code expires in{" "}
                    <span className="font-semibold tabular-nums text-gray-800">{formatTime()}</span>
                </p>
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={timeLeft > 0}
                    className={`mt-2 text-sm font-medium transition ${
                        timeLeft > 0
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-blue-600 hover:text-blue-700 hover:underline"
                    }`}
                >
                    Resend code
                </button>
            </div>
        </form>
    );
}
