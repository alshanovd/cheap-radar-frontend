import { apiFetch } from "./client";
export type RemoteSettings = {
	currency: string;
	theme: string;
	notifications: boolean;
};
export function getSettings() {
	return apiFetch<RemoteSettings>("/api/settings");
}

export function updateSettings(settings: RemoteSettings) {
	return apiFetch<RemoteSettings>("/api/settings", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ ...settings, user_id: 1 }),
	});
}
