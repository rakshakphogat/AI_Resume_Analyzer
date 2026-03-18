const TOKEN_KEY = "resume-analyzer-token";
const USER_KEY = "resume-analyzer-user";
const THEME_KEY = "resume-analyzer-theme";

export const tokenStorage = {
    get: () => localStorage.getItem(TOKEN_KEY),
    set: (token) => localStorage.setItem(TOKEN_KEY, token),
    remove: () => localStorage.removeItem(TOKEN_KEY),
};

export const userStorage = {
    get: () => {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    },
    set: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
    remove: () => localStorage.removeItem(USER_KEY),
};

export const themeStorage = {
    get: () => localStorage.getItem(THEME_KEY) || "light",
    set: (theme) => localStorage.setItem(THEME_KEY, theme),
};
