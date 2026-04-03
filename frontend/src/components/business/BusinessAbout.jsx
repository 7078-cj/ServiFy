export default function BusinessAbout({ description }) {
    if (!description) return null

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            About
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </section>
    )
}