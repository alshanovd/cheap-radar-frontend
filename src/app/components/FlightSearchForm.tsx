"use client";

import {
	Autocomplete,
	AutocompleteItem,
	Button,
	DatePicker,
	Input,
} from "@heroui/react";
import {
	type CalendarDate,
	getLocalTimeZone,
	today,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import type { Key } from "@react-types/shared";
import { useEffect, useState } from "react";

type AirportOption = {
	id: string;
	code: string;
	label: string;
	city: string;
	country: string;
	name: string;
	icao?: string;
	cityCode?: string;
	lat?: number;
	lng?: number;
	timezone?: string;
};

const MIN_AIRPORT_QUERY_LENGTH = 3;
const SHORT_QUERY_MESSAGE = "Min 3 letters to search";

const DEFAULT_FROM: AirportOption = {
	id: "SYD",
	code: "SYD",
	label: "Sydney (SYD)",
	city: "Sydney",
	country: "AU",
	name: "Sydney Airport",
};

const DEFAULT_TO: AirportOption = {
	id: "MEL",
	code: "MEL",
	label: "Melbourne (MEL)",
	city: "Melbourne",
	country: "AU",
	name: "Melbourne Airport",
};

function useAirportAutocomplete(initialOption: AirportOption) {
	const [query, setQuery] = useState(initialOption.city);
	const [options, setOptions] = useState<AirportOption[]>([initialOption]);
	const [isFocused, setIsFocused] = useState(false);

	useEffect(() => {
		const search = query.trim();
		if (search.length < MIN_AIRPORT_QUERY_LENGTH) return;

		const t = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/airports?q=${encodeURIComponent(search)}`,
				);
				const data = (await res.json()) as { items?: AirportOption[] };
				if (Array.isArray(data.items)) setOptions(data.items);
			} catch {
				// Keep previous options on network/parsing errors.
			}
		}, 300);

		return () => clearTimeout(t);
	}, [query]);

	return {
		options,
		setQuery,
		setIsFocused,
		helperText:
			isFocused &&
			query.trim().length > 0 &&
			query.trim().length < MIN_AIRPORT_QUERY_LENGTH
				? SHORT_QUERY_MESSAGE
				: undefined,
	};
}
export function FlightSearchForm() {
	const [from, setFrom] = useState("SYD");
	const [to, setTo] = useState("MEL");
	const [checksPerDay, setChecksPerDay] = useState("5");
	const [ticketsCount, setTicketsCount] = useState("2");

	const fromAirport = useAirportAutocomplete(DEFAULT_FROM);
	const toAirport = useAirportAutocomplete(DEFAULT_TO);

	const [dateFrom, setDateFrom] = useState<CalendarDate | null>(() => {
		const tz = getLocalTimeZone();
		return today(tz);
	});
	const [dateTo, setDateTo] = useState<CalendarDate | null>(() => {
		const tz = getLocalTimeZone();
		return today(tz).add({ days: 3 });
	});

	const handleSearch = () => {
		// Add TanStack query routing or fetching here later
		console.log("Searching flights", {
			from, // IATA
			to, // IATA
			dateFrom,
			dateTo,
			ticketsCount,
			checksPerDay,
		});
	};

	return (
		<div className="w-full max-w-6xl p-6 bg-content1 rounded-2xl shadow-md flex flex-col lg:flex-row lg:flex-wrap gap-4 items-end">
			<Autocomplete
				label="From"
				placeholder="e.g. Sydney (SYD)"
				description={fromAirport.helperText}
				className="w-full lg:flex-1 lg:min-w-[160px]"
				items={fromAirport.options}
				selectedKey={from || null}
				onSelectionChange={(key: Key | null) => setFrom(key ? String(key) : "")}
				onFocus={() => fromAirport.setIsFocused(true)}
				onBlur={() => fromAirport.setIsFocused(false)}
				onInputChange={fromAirport.setQuery}
			>
				{(airport: AirportOption) => (
					<AutocompleteItem key={airport.code}>
						{airport.label}
					</AutocompleteItem>
				)}
			</Autocomplete>

			<Autocomplete
				label="To"
				placeholder="e.g. Melbourne (MEL)"
				description={toAirport.helperText}
				className="w-full lg:flex-1 lg:min-w-[160px]"
				items={toAirport.options}
				selectedKey={to || null}
				onSelectionChange={(key: Key | null) => setTo(key ? String(key) : "")}
				onFocus={() => toAirport.setIsFocused(true)}
				onBlur={() => toAirport.setIsFocused(false)}
				onInputChange={toAirport.setQuery}
			>
				{(airport: AirportOption) => (
					<AutocompleteItem key={airport.code}>
						{airport.label}
					</AutocompleteItem>
				)}
			</Autocomplete>

			<I18nProvider locale="en-GB">
				<DatePicker
					label="Date From"
					className="w-full lg:flex-1 lg:min-w-[140px]"
					value={dateFrom}
					onChange={setDateFrom}
					granularity="day"
				/>
				<DatePicker
					label="Date To"
					className="w-full lg:flex-1 lg:min-w-[140px]"
					value={dateTo}
					onChange={setDateTo}
					granularity="day"
				/>
			</I18nProvider>

			<Input
				type="number"
				label="Tickets"
				placeholder="e.g. 2"
				value={ticketsCount}
				onValueChange={setTicketsCount}
				min={1}
				className="w-full lg:flex-none lg:w-32"
			/>

			<Input
				type="number"
				label="Checks per day"
				placeholder="e.g. 5"
				value={checksPerDay}
				onValueChange={setChecksPerDay}
				min={1}
				className="w-full lg:flex-none lg:w-32"
			/>

			<Button
				color="primary"
				size="lg"
				className="w-full lg:flex-none lg:w-32 h-14"
				onPress={handleSearch}
			>
				Search
			</Button>
		</div>
	);
}
