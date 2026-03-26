import { NextResponse } from "next/server";

type Airport = {
	iata: string; // IATA code (3 letters)
	name: string;
	city: string;
	country: string;
};

const AIRPORTS_CSV_URL = "https://ourairports.com/data/airports.csv";

// In-memory cache to avoid downloading/parsing the CSV on every request.
let airportsCache: Airport[] | null = null;

function parseCSV(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [];
	let field = "";
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i]!;

		if (char === `"` ) {
			const next = text[i + 1];
			if (inQuotes && next === `"`) {
				// Escaped quote "" inside a quoted field.
				field += `"`;
				i++;
				continue;
			}

			inQuotes = !inQuotes;
			continue;
		}

		if (!inQuotes && char === ",") {
			row.push(field);
			field = "";
			continue;
		}

		// Handle \n and \r\n.
		if (!inQuotes && (char === "\n" || char === "\r")) {
			if (char === "\r" && text[i + 1] === "\n") i++;
			row.push(field);
			field = "";
			if (row.length > 1) rows.push(row);
			row = [];
			continue;
		}

		field += char;
	}

	// Flush remainder (if file doesn't end with newline).
	if (field.length > 0 || row.length > 0) {
		row.push(field);
		if (row.length > 1) rows.push(row);
	}

	return rows;
}

function parseAirportsCsv(csvText: string): Airport[] {
	const rows = parseCSV(csvText);
	if (rows.length === 0) return [];

	const header = rows[0]!;
	const colIndex = (name: string) => header.findIndex((h) => h === name);

	// OurAirports uses stable column names, but we still support a few variants.
	const iata = colIndex("iata_code");
	const name = colIndex("name");
	const city =
		colIndex("city") >= 0 ? colIndex("city") : colIndex("municipality");
	const country =
		colIndex("country") >= 0 ? colIndex("country") : colIndex("iso_country");

	if (iata < 0 || name < 0 || city < 0 || country < 0) return [];

	const out: Airport[] = [];
	for (let r = 1; r < rows.length; r++) {
		const row = rows[r]!;
		const iataCode = (row[iata] ?? "").trim().toUpperCase();
		if (!iataCode) continue;

		const a: Airport = {
			iata: iataCode,
			name: (row[name] ?? "").trim(),
			city: (row[city] ?? "").trim(),
			// iso_country is 2-letter code (e.g. AU, GB). For UI it is usually OK,
			// but you can map it to full country names later if needed.
			country: (row[country] ?? "").trim(),
		};

		out.push(a);
	}

	return out;
}

const FALLBACK_AIRPORTS: Airport[] = [
	{ iata: "SYD", name: "Sydney Airport", city: "Sydney", country: "AU" },
	{ iata: "MEL", name: "Melbourne Airport", city: "Melbourne", country: "AU" },
	{ iata: "BNE", name: "Brisbane Airport", city: "Brisbane", country: "AU" },
];

async function getAirports(): Promise<Airport[]> {
	if (airportsCache) return airportsCache;

	try {
		const res = await fetch(AIRPORTS_CSV_URL, { method: "GET" });
		if (!res.ok) throw new Error(`Failed to fetch airports.csv: ${res.status}`);
		const text = await res.text();
		const parsed = parseAirportsCsv(text);
		airportsCache = parsed.length ? parsed : FALLBACK_AIRPORTS;
	} catch (e) {
		airportsCache = FALLBACK_AIRPORTS;
	}

	return airportsCache;
}

function toItem(a: Airport) {
	return {
		iata: a.iata,
		label: `${a.city} (${a.iata})`,
		city: a.city,
		country: a.country,
		name: a.name,
	};
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const qRaw = searchParams.get("q") ?? "";
	const q = qRaw.trim().toLowerCase();

	if (!q || q.length < 2) {
		return NextResponse.json({ items: [] });
	}

	const airports = await getAirports();

	const matches = airports
		.filter((a) => {
			const iata = a.iata.toLowerCase();
			const city = a.city.toLowerCase();
			const country = a.country.toLowerCase();
			const name = a.name.toLowerCase();

			// Support queries like "Sydney (SYD)" by matching inside the IATA token too.
			return (
				iata === q ||
				q.includes(iata) ||
				city.includes(q) ||
				name.includes(q) ||
				country.includes(q)
			);
		})
		.slice(0, 20)
		.map(toItem);

	return NextResponse.json({ items: matches });
}

