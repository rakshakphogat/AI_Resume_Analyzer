import { useEffect, useState } from "react";

import { themeStorage } from "./storage";

export const useTheme = () => {
    const [theme, setTheme] = useState(() => themeStorage.get());

    useEffect(() => {
        const html = document.documentElement;
        if (theme === "dark") {
            html.classList.add("dark");
        } else {
            html.classList.remove("dark");
        }
        themeStorage.set(theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((current) => (current === "light" ? "dark" : "light"));
    };

    return { theme, toggleTheme };
};
