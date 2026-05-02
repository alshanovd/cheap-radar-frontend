import { apiFetch } from "./client";

export type SearchTicket = {
	airline: string;
	airlineLogo: string;
	airportFrom: string;
	airportTo: string;
	date: string;
	link: string;
	price: number;
	provider: string;
};

export type SearchStatus =
	| "COMPLETED"
	| "ONGOING"
	| "CREATED"
	| "SCHEDULED"
	| (string & {});

export type FlightSearch = {
	searchId: string;
	airportFrom: string;
	airportTo: string;
	checkFinishAt: string;
	checkIntervalHours: number;
	createdAt: string;
	dateFrom: string;
	dateTo: string;
	lastCheckedAt: string | null;
	nextCheckAt: string | null;
	providers: string[];
	status: SearchStatus;
	tickets: SearchTicket[];
};

export type SearchesResponse = {
	searches: FlightSearch[];
};

export type CreateSearchRequest = {
	airportFrom: string;
	airportTo: string;
	dateFrom: string;
	dateTo: string;
	checkIntervalHours: number;
	checkCount: number;
	providers: string[];
};

export type CreateSearchResponse = {
	searchId: string;
};

export function getSearches() {
	return apiFetch<SearchesResponse>("/api/search/all");
}

export function getSearch(searchId: string) {
	return apiFetch<FlightSearch>(`/api/search/${searchId}`);
}

export function createSearch(search: CreateSearchRequest) {
	return apiFetch<CreateSearchResponse>("/api/search", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(search),
	});
}
