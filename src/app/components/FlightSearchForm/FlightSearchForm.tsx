"use client";

import {
	Button,
	Checkbox,
	CheckboxGroup,
	Chip,
	DatePicker,
	Select,
	SelectItem,
} from "@heroui/react";
import type { CalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createSearch } from "@/app/api/searches";
import {
	AirportAutocompleteField,
	type AirportOption,
} from "./AirportAutocompleteField";
import {
	CHECK_INTERVAL_OPTIONS,
	formatCalendarDate,
	getCurrentCalendarDate,
	getInclusiveDaysCount,
	getLastCheckOptions,
	getSelectedCheckCount,
	type LastCheckOption,
	PROVIDER_OPTIONS,
} from "./utils";

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

const DATE_PICKER_CLASS_NAMES = {
	calendarContent:
		"[&_[data-today=true]]:ring-2 [&_[data-today=true]]:ring-primary [&_[data-today=true]]:ring-offset-2 [&_[data-today=true]]:ring-offset-content1",
};

export function FlightSearchForm() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [checkIntervalKey, setCheckIntervalKey] = useState("");
	const [lastCheckOptions, setLastCheckOptions] = useState<LastCheckOption[]>(
		[],
	);
	const [checkFinishAt, setCheckFinishAt] = useState("");
	const [providers, setProviders] = useState<string[]>(
		PROVIDER_OPTIONS[0] ? [PROVIDER_OPTIONS[0]] : [],
	);

	const [dateFrom, setDateFrom] = useState<CalendarDate | null>(null);
	const [dateTo, setDateTo] = useState<CalendarDate | null>(null);
	const [isChecksTotalHighlighted, setIsChecksTotalHighlighted] =
		useState(false);

	const createSearchMutation = useMutation({
		mutationFn: createSearch,
		onSuccess: (response) => {
			void queryClient.invalidateQueries({ queryKey: ["lookups"] });
			router.push(`/lookups/${response.searchId}`);
		},
	});
	const isSubmitting = createSearchMutation.isPending;
	const checkIntervalHours = checkIntervalKey ? Number(checkIntervalKey) : null;
	const daysCount = getInclusiveDaysCount(dateFrom, dateTo);
	const selectedCheckCount = getSelectedCheckCount(
		checkFinishAt,
		lastCheckOptions,
	);
	const checksTotal = daysCount * providers.length * selectedCheckCount;
	const previousChecksTotalRef = useRef(checksTotal);
	const checksTotalHighlightTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null);

	useEffect(() => {
		setDateFrom(getCurrentCalendarDate());
	}, []);

	useEffect(() => {
		if (previousChecksTotalRef.current === checksTotal) return;

		previousChecksTotalRef.current = checksTotal;
		setIsChecksTotalHighlighted(true);

		if (checksTotalHighlightTimeoutRef.current) {
			clearTimeout(checksTotalHighlightTimeoutRef.current);
		}

		checksTotalHighlightTimeoutRef.current = setTimeout(() => {
			setIsChecksTotalHighlighted(false);
			checksTotalHighlightTimeoutRef.current = null;
		}, 300);

		return () => {
			if (checksTotalHighlightTimeoutRef.current) {
				clearTimeout(checksTotalHighlightTimeoutRef.current);
				checksTotalHighlightTimeoutRef.current = null;
			}
		};
	}, [checksTotal]);

	const handleDateFromChange = (nextDateFrom: CalendarDate | null) => {
		setDateFrom(nextDateFrom);

		if (nextDateFrom && dateTo && dateTo.compare(nextDateFrom) < 0) {
			setDateTo(nextDateFrom);
		}
	};

	const handleSearch = () => {
		if (
			!from ||
			!to ||
			!dateFrom ||
			!dateTo ||
			!checkIntervalHours ||
			!selectedCheckCount ||
			providers.length === 0
		) {
			return;
		}

		createSearchMutation.mutate({
			airportFrom: from,
			airportTo: to,
			dateFrom: formatCalendarDate(dateFrom),
			dateTo: formatCalendarDate(dateTo),
			checkIntervalHours,
			checkCount: selectedCheckCount,
			providers,
		});
	};

	return (
		<div className="w-full max-w-6xl p-6 bg-content1 rounded-2xl shadow-md flex flex-col gap-4">
			<div className="flex flex-col lg:flex-row gap-4 items-end">
				<AirportAutocompleteField
					label="From"
					placeholder="e.g. Sydney (SYD)"
					value={from}
					initialOption={DEFAULT_FROM}
					isDisabled={isSubmitting}
					onChange={setFrom}
				/>

				<AirportAutocompleteField
					label="To"
					placeholder="e.g. Melbourne (MEL)"
					value={to}
					initialOption={DEFAULT_TO}
					isDisabled={isSubmitting}
					onChange={setTo}
				/>

				<I18nProvider locale="en-GB">
					<DatePicker
						label="Date From"
						className="w-full lg:flex-1 lg:min-w-[140px]"
						value={dateFrom}
						onChange={handleDateFromChange}
						granularity="day"
						isDisabled={isSubmitting}
						classNames={DATE_PICKER_CLASS_NAMES}
					/>
					<DatePicker
						label="Date To"
						className="w-full lg:flex-1 lg:min-w-[140px]"
						value={dateTo}
						onChange={setDateTo}
						minValue={dateFrom ?? undefined}
						granularity="day"
						isDisabled={isSubmitting}
						classNames={DATE_PICKER_CLASS_NAMES}
					/>
				</I18nProvider>
			</div>

			<div className="flex flex-col lg:flex-row gap-4 items-end">
				<Select
					label="Check every"
					placeholder="Select period"
					className="w-full lg:w-40"
					selectedKeys={checkIntervalKey ? [checkIntervalKey] : []}
					isDisabled={isSubmitting}
					onSelectionChange={(keys) => {
						if (keys === "all") return;
						const [interval] = Array.from(keys);
						const nextIntervalKey = interval ? String(interval) : "";
						const nextIntervalHours = nextIntervalKey
							? Number(nextIntervalKey)
							: null;

						setCheckIntervalKey(nextIntervalKey);
						if (!nextIntervalHours) {
							setLastCheckOptions([]);
							setCheckFinishAt("");
							return;
						}

						const nextOptions = getLastCheckOptions(nextIntervalHours);
						setLastCheckOptions(nextOptions);
						setCheckFinishAt(nextOptions[0]?.value ?? "");
					}}
				>
					{CHECK_INTERVAL_OPTIONS.map((interval) => (
						<SelectItem key={String(interval)} textValue={`${interval}h`}>
							{interval}h
						</SelectItem>
					))}
				</Select>

				<Select
					label="Last check"
					placeholder="Select last check"
					className="w-full lg:w-72"
					selectedKeys={checkFinishAt ? [checkFinishAt] : []}
					isDisabled={isSubmitting || !checkIntervalHours}
					onSelectionChange={(keys) => {
						if (keys === "all") return;
						const [finishAt] = Array.from(keys);
						setCheckFinishAt(finishAt ? String(finishAt) : "");
					}}
				>
					{lastCheckOptions.map((option) => (
						<SelectItem key={option.value} textValue={option.label}>
							{option.label}
						</SelectItem>
					))}
				</Select>

				<CheckboxGroup
					label="Providers"
					orientation="horizontal"
					value={providers}
					isDisabled={isSubmitting}
					onValueChange={setProviders}
					className="w-full lg:flex-1"
				>
					{PROVIDER_OPTIONS.map((provider) => (
						<Checkbox key={provider} value={provider}>
							{provider.toUpperCase()}
						</Checkbox>
					))}
				</CheckboxGroup>
			</div>

			{createSearchMutation.isError && (
				<p className="text-sm text-danger">Error of creating search</p>
			)}

			<Button
				color="primary"
				size="lg"
				className="w-full self-center lg:w-32 h-14"
				isLoading={isSubmitting}
				isDisabled={isSubmitting}
				onPress={handleSearch}
			>
				Search
			</Button>

			<Chip
				color="primary"
				variant="flat"
				className={`w-fit self-center transform-gpu transition-[transform,background-color,color,box-shadow,scale] duration-150 ease-out ${
					isChecksTotalHighlighted
						? "scale-110 bg-primary-100 text-primary-400 font-black shadow-lg dark:bg-primary-400 dark:text-primary-900"
						: "scale-100"
				}`}
			>
				Checks in total: {checksTotal}
			</Chip>
		</div>
	);
}
