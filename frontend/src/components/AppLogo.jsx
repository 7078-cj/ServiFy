import { Link } from "react-router-dom";
import logoImg from "../assets/logo.png";

/**
 * App brand mark — image + wordmark. Use `asLink={false}` when nested inside another link.
 */
export default function AppLogo({
    to = "/",
    className = "",
    size = "md",
    showWordmark = true,
    asLink = true,
}) {
    const sizes = {
        sm: { img: "h-8 w-8", text: "text-lg" },
        md: { img: "h-10 w-10", text: "text-xl" },
        lg: { img: "h-12 w-12", text: "text-2xl" },
    };
    const s = sizes[size] || sizes.md;

    const inner = (
        <>
            <img
                src={logoImg}
                alt=""
                className={`${s.img} object-contain shrink-0 rounded-lg`}
            />
            {showWordmark && (
                <span
                    className={`${s.text} font-extrabold tracking-tight text-gray-900 leading-none`}
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    SERVI<span className="text-blue-600">FY</span>
                </span>
            )}
        </>
    );

    const wrapClass = `inline-flex items-center gap-2.5 ${className}`;

    if (asLink) {
        return (
            <Link to={to} className={`${wrapClass} hover:opacity-90 transition-opacity`}>
                {inner}
            </Link>
        );
    }

    return <span className={wrapClass}>{inner}</span>;
}
