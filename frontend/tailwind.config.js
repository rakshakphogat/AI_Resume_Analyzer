/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#0f172a",
                skywash: "#e0f2fe",
                mint: "#6ee7b7",
                amberglow: "#f59e0b",
            },
            boxShadow: {
                soft: "0 10px 30px -12px rgba(2, 6, 23, 0.35)",
            },
            fontFamily: {
                display: ["Poppins", "ui-sans-serif", "system-ui"],
                body: ["Manrope", "ui-sans-serif", "system-ui"],
            },
            backgroundImage: {
                "hero-grid":
                    "radial-gradient(circle at 20% 20%, rgba(14,165,233,0.15), transparent 40%), radial-gradient(circle at 80% 0%, rgba(16,185,129,0.18), transparent 35%), linear-gradient(180deg, rgba(248,250,252,1) 0%, rgba(240,249,255,1) 100%)",
                "aurora-light":
                    "radial-gradient(1200px 500px at -10% -20%, rgba(14,165,233,0.35), transparent 55%), radial-gradient(900px 450px at 120% 0%, rgba(16,185,129,0.30), transparent 50%), linear-gradient(180deg, #f8fafc 0%, #e0f2fe 50%, #ecfeff 100%)",
                "aurora-dark":
                    "radial-gradient(900px 450px at 15% -15%, rgba(14,165,233,0.28), transparent 50%), radial-gradient(800px 400px at 95% 0%, rgba(20,184,166,0.26), transparent 45%), linear-gradient(180deg, #020617 0%, #0b1120 60%, #111827 100%)",
                "noise-soft":
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140' viewBox='0 0 140 140'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.12'%3E%3Ccircle cx='8' cy='8' r='1'/%3E%3Ccircle cx='42' cy='27' r='1'/%3E%3Ccircle cx='85' cy='15' r='1'/%3E%3Ccircle cx='130' cy='40' r='1'/%3E%3Ccircle cx='60' cy='78' r='1'/%3E%3Ccircle cx='20' cy='95' r='1'/%3E%3Ccircle cx='100' cy='110' r='1'/%3E%3Ccircle cx='132' cy='122' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            },
        },
    },
    plugins: [],
};
