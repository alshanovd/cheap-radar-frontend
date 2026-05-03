export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME = "dark";
export const THEMES = ["dark", "light"] as const;

export type Theme = (typeof THEMES)[number];

export function isTheme(value: string | null): value is Theme {
	return value === "dark" || value === "light";
}

export function applyTheme(theme: Theme) {
	if (typeof document === "undefined") return;

	document.documentElement.classList.toggle("dark", theme === "dark");
}

export function getStoredTheme(): Theme {
	if (typeof window === "undefined") return DEFAULT_THEME;

	const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

	return isTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
}

export function saveTheme(theme: Theme) {
	window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	applyTheme(theme);
}

export function syncStoredTheme() {
	const theme = getStoredTheme();

	if (!isTheme(window.localStorage.getItem(THEME_STORAGE_KEY))) {
		window.localStorage.setItem(THEME_STORAGE_KEY, theme);
	}

	applyTheme(theme);

	return theme;
}
