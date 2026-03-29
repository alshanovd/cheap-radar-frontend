import { apiFetch } from "./client";
export type RemoteSettings = {
	currency: string;
	theme: string;
	notifications: boolean;
};
export function getSettings() {
	return apiFetch<RemoteSettings>("/api/setting");
}