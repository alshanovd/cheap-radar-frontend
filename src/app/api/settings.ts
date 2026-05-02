import { apiFetch } from "./client";

const SETTINGS_USER_ID = 1;

export type Theme = "dark" | "light";

export type RemoteSettings = {
	currency: string;
	theme: Theme;
	notifications: boolean;
};

export function isTheme(theme: string | undefined): theme is Theme {
	return theme === "dark" || theme === "light";
}

export function getSettings(signal?: AbortSignal) {
	return apiFetch<RemoteSettings>(`/api/settings?user_id=${SETTINGS_USER_ID}`, {
		signal,
	});
}

export function updateSettings(settings: RemoteSettings) {
	return apiFetch<RemoteSettings>("/api/settings", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ...settings, user_id: SETTINGS_USER_ID }),
	});
}
