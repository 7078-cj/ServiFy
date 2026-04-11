import { useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import EmailStep from "../components/forgot_password/EmailStep";
import VerifyCodeStep from "../components/forgot_password/VerifyCodeStep";
import ResetPasswordStep from "../components/forgot_password/ResetPasswordStep";
import { requestReset, resendCode, resetPassword, verifyCode } from "../utils/forgot_password";
import AppLogo from "../components/AppLogo";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

const steps = [
    { n: 1, label: "Email" },
    { n: 2, label: "Verify" },
    { n: 3, label: "New password" },
];

export default function ForgotPasswordPage() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");
    const [messageTone, setMessageTone] = useState("info");
    const nav = useNavigate();

    const showMessage = (text, tone = "info") => {
        setMessage(text || "");
        setMessageTone(tone);
    };

    const handleRequestReset = async (emailInput) => {
        const data = await requestReset(emailInput);

        if (data.message) {
            setEmail(emailInput);
            setStep(2);
            showMessage(data.message, "success");
        } else {
            showMessage(data.error, "error");
            if (data.error) toast.error(data.error);
        }
    };

    const handleVerifyCode = async (codeInput) => {
        const data = await verifyCode(email, codeInput);

        if (data.message) {
            setCode(codeInput);
            setStep(3);
            showMessage("", "info");
        } else {
            showMessage(data.error, "error");
            if (data.error) toast.error(data.error);
        }
    };

    const handleResetPassword = async (password) => {
        const data = await resetPassword(email, code, password);

        if (data.message) {
            showMessage(data.message, "success");
            toast.success(data.message);
            setTimeout(() => nav("/login", { replace: true }), 1200);
        } else {
            showMessage(data.error, "error");
            if (data.error) toast.error(data.error);
        }
    };

    const handleResendCode = async () => {
        const data = await resendCode(email);
        showMessage(data.message || data.error, data.message ? "success" : "error");
        if (data.message) toast.success(data.message);
        else if (data.error) toast.error(data.error);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-slate-100 px-4 py-10">
            <div className="w-full max-w-md">
                <div className="mb-6 text-center">
                    <AppLogo to="/login" size="lg" className="justify-center mb-5" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Reset your password</h1>
                    <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                        Enter the email you used to register. We’ll send a code so you can choose a new password.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-100/90 p-6 sm:p-8">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 mb-6 group"
                    >
                        <ArrowLeft
                            size={16}
                            className="transition-transform group-hover:-translate-x-0.5"
                            strokeWidth={2}
                        />
                        Back to sign in
                    </Link>

                    {/* Step indicator */}
                    <ol className="flex items-center justify-center gap-0 mb-8" aria-label="Progress">
                        {steps.map((s, i) => (
                            <li key={s.n} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <span
                                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-colors
                      ${
                          step === s.n
                              ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                              : step > s.n
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-400"
                      }`}
                                    >
                                        {step > s.n ? "✓" : s.n}
                                    </span>
                                    <span
                                        className={`mt-1.5 text-[11px] font-medium uppercase tracking-wide hidden sm:block
                      ${step >= s.n ? "text-gray-700" : "text-gray-400"}`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div
                                        className={`h-0.5 w-8 sm:w-12 mx-1 sm:mx-2 rounded-full mb-6 ${
                                            step > s.n ? "bg-blue-200" : "bg-gray-100"
                                        }`}
                                        aria-hidden
                                    />
                                )}
                            </li>
                        ))}
                    </ol>

                    {message && (
                        <div
                            role="status"
                            className={`mb-6 flex gap-3 rounded-xl border px-4 py-3 text-sm leading-snug
                ${
                    messageTone === "error"
                        ? "border-red-200 bg-red-50 text-red-800"
                        : messageTone === "success"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-blue-100 bg-blue-50 text-blue-900"
                }`}
                        >
                            {messageTone === "error" ? (
                                <AlertCircle className="shrink-0 w-5 h-5 text-red-600 mt-0.5" />
                            ) : messageTone === "success" ? (
                                <CheckCircle2 className="shrink-0 w-5 h-5 text-emerald-600 mt-0.5" />
                            ) : null}
                            <span>{message}</span>
                        </div>
                    )}

                    {step === 1 && <EmailStep onSubmit={handleRequestReset} />}

                    {step === 2 && (
                        <VerifyCodeStep onSubmit={handleVerifyCode} onResend={handleResendCode} email={email} />
                    )}

                    {step === 3 && <ResetPasswordStep onSubmit={handleResetPassword} />}
                </div>

                <p className="text-center text-xs text-gray-400 mt-6">
                    Remember your password?{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
