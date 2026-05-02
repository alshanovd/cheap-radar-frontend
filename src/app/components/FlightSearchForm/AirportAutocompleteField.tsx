"use client";

import { Autocomplete, AutocompleteItem } from "@heroui/react";
import type { Key } from "@react-types/shared";
import { useEffect, useState } from "react";

export type AirportOption = {
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

type AirportAutocompleteFieldProps = {
	label: string;
	placeholder: string;
	value: string;
	initialOption: AirportOption;
	isDisabled?: boolean;
	onChange: (value: string) => void;
};

const MIN_AIRPORT_QUERY_LENGTH = 3;

function useAirportAutocomplete(initialOption: AirportOption) {
	const [query, setQuery] = useState(initialOption.city);
	const [options, setOptions] = useState<AirportOption[]>([initialOption]);

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
	};
}

export function AirportAutocompleteField({
	label,
	placeholder,
	value,
	initialOption,
	isDisabled,
	onChange,
}: AirportAutocompleteFieldProps) {
	const airport = useAirportAutocomplete(initialOption);

	return (
		<Autocomplete
			label={label}
			placeholder={placeholder}
			className="w-full lg:flex-1 lg:min-w-[160px]"
			items={airport.options}
			selectedKey={value || null}
			isDisabled={isDisabled}
			onChange={(key: Key | null) => onChange(key ? String(key) : "")}
			onInputChange={airport.setQuery}
		>
			{(option: AirportOption) => (
				<AutocompleteItem key={option.code}>{option.label}</AutocompleteItem>
			)}
		</Autocomplete>
	);
}
