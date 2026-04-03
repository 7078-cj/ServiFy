export default function PricingCard({ min_price, max_price, average_price }) {
    const metrics = [
        { label: "Min Price", value: min_price },
        { label: "Avg Price", value: average_price },
        { label: "Max Price", value: max_price },
    ].filter((m) => m.value != null)

    if (!metrics.length) return null

    return (
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Pricing
        </h2>
        <div className="grid grid-cols-3 gap-3">
            {metrics.map(({ label, value }) => (
            <div
                key={label}
                className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-center"
            >
                <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">
                {label}
                </p>
                <p className="text-base font-semibold text-gray-800">
                ₱{parseFloat(value).toLocaleString()}
                </p>
            </div>
            ))}
        </div>
        </section>
    )
}