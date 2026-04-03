export default function BusinessAvatar({ name, imageUrl, size = "md" }) {
    const sizeMap = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-sm",
        lg: "w-16 h-16 text-lg",
    }

    const initials = name
        ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
        : "?"

    if (imageUrl) {
        return (
        <img
            src={imageUrl}
            alt={name}
            className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-white border border-gray-200`}
        />
        )
    }

    return (
        <div
        className={`${sizeMap[size]} rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center font-semibold text-blue-600 shrink-0`}
        >
        {initials}
        </div>
    )
}