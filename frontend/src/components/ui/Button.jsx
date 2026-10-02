



export default function Button({ children, variant = "primary", className = "", ...props }) {
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 disabled:bg-slate-700",
        secondary: "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 disabled:bg-slate-800",
        outline: "border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-50",
        danger: "bg-red-600 text-white hover:bg-red-500 shadow-md shadow-red-600/20 disabled:bg-slate-700",
        warning: "bg-amber-600 text-white hover:bg-amber-500 shadow-md shadow-amber-600/20 disabled:bg-slate-700",
        info: "bg-cyan-600 text-white hover:bg-cyan-500 disabled:bg-slate-700",
        light: "bg-slate-200 text-slate-900 hover:bg-white disabled:bg-slate-400",
        dark: "bg-slate-900 text-white border border-slate-800 hover:bg-slate-850 disabled:bg-slate-900",
    };

    const variantStyles = variants[variant] || variants.primary;

    return (
        <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${variantStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}