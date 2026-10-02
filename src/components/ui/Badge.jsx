

export default function Badge({ children, color = "blue", className = "" }) {
    const colors = {
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/30",
        red: "bg-red-500/10 text-red-400 border-red-500/30",
        green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
        yellow: "bg-amber-500/10 text-amber-400 border-amber-500/30",
        indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/30",
        pink: "bg-pink-500/10 text-pink-400 border-pink-500/30",
        orange: "bg-orange-500/10 text-orange-400 border-orange-500/30",
        gray: "bg-slate-800 text-slate-300 border-slate-700",
    };

    const colorStyles = colors[color] || colors.blue;

    return (
        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border ${colorStyles} ${className}`}>
            {children}
        </span>
    );
}