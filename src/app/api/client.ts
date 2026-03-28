/** Меняй URL здесь, если бэкенд переедет (без .env). */
const API_BASE = "https://cheap-radar-backend-1215e7aa2560.herokuapp.com".replace(
	/\/$/,
	"",
);

export async function apiFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const url = path.startsWith("http")
		? path
		: `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
	const res = await fetch(url, {
		...init,
		headers: {
			Accept: "application/json",
			...init?.headers,
		},
	});
	if (!res.ok) {
		throw new Error(`API ${res.status}: ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}
