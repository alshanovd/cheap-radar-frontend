import { apiFetch } from "./client";

const SETTINGS_USER_ID = 1;

export type RemoteSettings = {
	currency: string;
	theme: string;
	notifications: boolean;
};
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
