const THEME_KEY = "resume-analyzer-theme";

// Theme storage remains as it's not auth-related and is safe for localStorage
export const themeStorage = {
    get: () => localStorage.getItem(THEME_KEY) || "light",
    set: (theme) => localStorage.setItem(THEME_KEY, theme),
};
