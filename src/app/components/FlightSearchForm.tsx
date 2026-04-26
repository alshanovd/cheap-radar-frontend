"use client";

import {
	Autocomplete,
	AutocompleteItem,
	Button,
	DatePicker,
	Input,
} from "@heroui/react";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import type { Key } from "@react-types/shared";
import { useEffect, useState } from "react";

type AirportOption = {
	iata: string;
	label: string;
	city: string;
	country: string;
	name: string;
};

export function FlightSearchForm() {
	////// Store selected airport IATA codes.
	const [from, setFrom] = useState("SYD");
	const [to, setTo] = useState("MEL");
	const [checksPerDay, setChecksPerDay] = useState("5");
	const [checkFinishAt, setCheckFinishAt] = useState("10");
	const [ticketsCount, setTicketsCount] = useState("2");

	const [fromQuery, setFromQuery] = useState("Sydney");
	const [toQuery, setToQuery] = useState("Melbourne");

	const [fromOptions, setFromOptions] = useState<AirportOption[]>([
		{
			iata: "SYD",
			label: "Sydney (SYD)",
			city: "Sydney",
			country: "AU",
			name: "Sydney Airport",
		},
	]);
	const [toOptions, setToOptions] = useState<AirportOption[]>([
		{
			iata: "MEL",
			label: "Melbourne (MEL)",
			city: "Melbourne",
			country: "AU",
			name: "Melbourne Airport",
		},
	]);

	useEffect(() => {
		if (!fromQuery || fromQuery.trim().length < 2) return;

		const t = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/airports?q=${encodeURIComponent(fromQuery.trim())}`,
				);
				const data = (await res.json()) as { items?: AirportOption[] };
				if (Array.isArray(data.items)) setFromOptions(data.items);
			} catch {
				// Keep previous options on network/parsing errors.
			}
		}, 300);

		return () => clearTimeout(t);
	}, [fromQuery]);

	useEffect(() => {
		if (!toQuery || toQuery.trim().length < 2) return;

		const t = setTimeout(async () => {
			try {
				const res = await fetch(
					`/api/airports?q=${encodeURIComponent(toQuery.trim())}`,
				);
				const data = (await res.json()) as { items?: AirportOption[] };
				if (Array.isArray(data.items)) setToOptions(data.items);
			} catch {
				// Keep previous options on network/parsing errors.
			}
		}, 300);

		return () => clearTimeout(t);
	}, [toQuery]);

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
			checkFinishAt,
		});
	};

	return (
		<div className="w-full max-w-7xl p-6 bg-content1 rounded-2xl shadow-md flex flex-col lg:flex-row lg:flex-wrap gap-4 items-end">
			<Autocomplete
				label="From"
				placeholder="e.g. Sydney (SYD)"
				className="w-full lg:flex-1 lg:min-w-[160px]"
				items={fromOptions}
				selectedKey={from || null}
				onChange={(key: Key | null) => setFrom(key ? String(key) : "")}
				onInputChange={(value) => setFromQuery(value)}
			>
				{(airport: AirportOption) => (
					<AutocompleteItem key={airport.iata}>
						{airport.label}
					</AutocompleteItem>
				)}
			</Autocomplete>

			<Autocomplete
				label="To"
				placeholder="e.g. Melbourne (MEL)"
				className="w-full lg:flex-1 lg:min-w-[160px]"
				items={toOptions}
				selectedKey={to || null}
				onChange={(key: Key | null) => setTo(key ? String(key) : "")}
				onInputChange={(value) => setToQuery(value)}
			>
				{(airport: AirportOption) => (
					<AutocompleteItem key={airport.iata}>
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
{/* 
			<Input
				type="number"
				label="Tickets"
				placeholder="e.g. 2"
				value={ticketsCount}
				onValueChange={setTicketsCount}
				min={1}
				className="w-full lg:flex-none lg:w-32"
			/> */}

			<Input
				type="number"
				label="Checks per day"
				placeholder="e.g. 5"
				value={checksPerDay}
				onValueChange={setChecksPerDay}
				min={1}
				className="w-full lg:flex-none lg:w-32"
			/>

			<Input
				type="number"
				label="Total checks"
				placeholder="e.g. 10"
				value={checkFinishAt}
				onValueChange={setCheckFinishAt}
				min={1}
				className="w-full lg:flex-none lg:w-40"
			/>

			<Button
				color="primary"
				size="lg"
				className="w-full lg:flex-none lg:w-32 h-14 whitespace-nowrap"
				onPress={handleSearch}
			>
				Search
			</Button>
		</div>
	);
}

