const base = (process.env.NEXT_PUBLIC_API_BASE ?? "").replace(/\/$/, "");

export async function apiFetch<T>(
	path: string,
	init?: RequestInit,
): Promise<T> {
	const url = path.startsWith("http")
		? path
		: `${base}${path.startsWith("/") ? "" : "/"}${path}`;
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
