import { apiFetch } from "./client";

export type SearchTicket = {
	airportFrom: string;
	airportTo: string;
	date: string;
	link: string;
	price: number;
	provider: string;
};

export type SearchStatus = "COMPLETED" | "PROCESSING" | (string & {});

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

export function getSearches() {
	return apiFetch<SearchesResponse>("/api/search/all");
}
