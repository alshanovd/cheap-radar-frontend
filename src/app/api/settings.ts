import { apiFetch } from "./client";

export type RemoteSettings = {
	currency: string;
	theme: string;
	notifications: boolean;
};

export type RemoteSettingsPatch = Partial<
	Pick<RemoteSettings, "currency" | "theme" | "notifications">
>;

export function getSettings() {
	return apiFetch<RemoteSettings>("/api/setting");
}

export function patchSettings(patch: RemoteSettingsPatch) {
	return apiFetch<RemoteSettings | undefined>("/api/setting", {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(patch),
	});
}