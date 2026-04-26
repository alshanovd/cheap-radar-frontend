import { NextResponse } from "next/server";

type AirLabsAirport = {
	iata_code?: string;
	icao_code?: string;
	name?: string;
	city?: string;
	city_code?: string;
	country_code?: string;
	lat?: number;
	lng?: number;
	timezone?: string;
	popularity?: number;
};

type AirLabsCity = {
	name?: string;
	city_code?: string;
};

type AirLabsSuggestPayload = {
	airports?: AirLabsAirport[];
	airports_by_cities?: AirLabsAirport[];
	airports_by_countries?: AirLabsAirport[];
	cities?: AirLabsCity[];
	cities_by_airports?: AirLabsCity[];
	cities_by_countries?: AirLabsCity[];
};

const AIRLABS_SUGGEST_URL = "https://airlabs.co/api/v9/suggest";
const AIRLABS_FIELDS =
	"name,iata_code,icao_code,city,city_code,country_code,lat,lng,timezone,popularity";
const AIRPORT_RESULT_KEYS = [
	"airports",
	"airports_by_cities",
	"airports_by_countries",
] as const;
const CITY_RESULT_KEYS = [
	"cities",
	"cities_by_airports",
	"cities_by_countries",
] as const;

function getPayload(
	data: AirLabsSuggestPayload & { response?: AirLabsSuggestPayload },
) {
	return data.response ?? data;
}

function cleanCityName(value: string | undefined) {
	return value
		?.replace(
			/\s+(?:International|Regional|Domestic|Municipal)?\s*Airport$/i,
			"",
		)
		.trim();
}

function toItem(a: AirLabsAirport, cityNamesByCode: Map<string, string>) {
	const code = a.iata_code?.trim().toUpperCase();
	if (!code) return null;

	const cityCode = a.city_code?.trim().toUpperCase();
	const city =
		(cityCode ? cityNamesByCode.get(cityCode) : undefined) ||
		cleanCityName(a.city) ||
		cleanCityName(a.name) ||
		code;

	return {
		id: code,
		code,
		label: `${city} (${code})`,
		name: a.name ?? "",
		city,
		country: a.country_code ?? "",
		icao: a.icao_code,
		cityCode,
		lat: a.lat,
		lng: a.lng,
		timezone: a.timezone,
		popularity: a.popularity ?? 0,
	};
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const qRaw = searchParams.get("q") ?? "";
	const q = qRaw.trim().slice(0, 30);

	if (q.length < 3) {
		return NextResponse.json({ items: [] });
	}

	const apiKey = process.env.AIRLABS_KEY;
	if (!apiKey) {
		return NextResponse.json(
			{ items: [], error: "AIRLABS_KEY is not configured" },
			{ status: 500 },
		);
	}

	const url = new URL(AIRLABS_SUGGEST_URL);
	url.searchParams.set("q", q);
	url.searchParams.set("api_key", apiKey);
	url.searchParams.set("_fields", AIRLABS_FIELDS);

	try {
		const res = await fetch(url, { method: "GET" });
		if (!res.ok) {
			return NextResponse.json({ items: [] }, { status: res.status });
		}

		const data = getPayload(await res.json());
		const itemsByCode = new Map<
			string,
			NonNullable<ReturnType<typeof toItem>>
		>();
		const cityNamesByCode = new Map<string, string>();

		for (const key of CITY_RESULT_KEYS) {
			for (const city of data[key] ?? []) {
				const cityCode = city.city_code?.trim().toUpperCase();
				const cityName = city.name?.trim();
				if (cityCode && cityName && !cityNamesByCode.has(cityCode)) {
					cityNamesByCode.set(cityCode, cityName);
				}
			}
		}

		for (const key of AIRPORT_RESULT_KEYS) {
			for (const airport of data[key] ?? []) {
				const item = toItem(airport, cityNamesByCode);
				if (!item || itemsByCode.has(item.code)) continue;
				itemsByCode.set(item.code, item);
			}
		}

		const items = Array.from(itemsByCode.values())
			.sort((a, b) => b.popularity - a.popularity)
			.slice(0, 20);

		return NextResponse.json({ items });
	} catch {
		return NextResponse.json({ items: [] }, { status: 502 });
	}
}
