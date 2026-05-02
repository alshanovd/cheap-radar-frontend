"use client";

import {
	Chip,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import { useRouter } from "next/navigation";
import { type FlightSearch, getSearches } from "@/app/api/searches";

const formatDate = (date: string) => moment(date).format("D MMM");

const formatDateTime = (date: string | null) =>
	date ? moment(date).format("HH:mm - D MMM") : "-";

const formatPrice = (price: number) => `$${price.toFixed(2)}`;

const getDaysCount = (search: FlightSearch) =>
	moment(search.dateTo).diff(moment(search.dateFrom), "days");

const getInclusiveDaysCount = (search: FlightSearch) => {
	const daysDiff = getDaysCount(search);

	return daysDiff < 0 ? 0 : daysDiff + 1;
};

const getTotalChecks = (search: FlightSearch) =>
	getInclusiveDaysCount(search) * search.providers.length * search.checkCount;

const getLowestTicketPrice = (search: FlightSearch) => {
	if (search.tickets.length === 0) return null;

	return Math.min(...search.tickets.map((ticket) => ticket.price));
};

const getStatusColor = (status: FlightSearch["status"]) => {
	if (status === "COMPLETED") return "success";
	if (status === "ONGOING") return "primary";
	if (status === "CREATED") return "warning";
	if (status === "SCHEDULED") return "secondary";

	return "default";
};

function InfoIcon() {
	return (
		<span className="inline-flex size-4 items-center justify-center rounded-full border border-default-400 text-[10px] font-semibold text-default-500">
			i
		</span>
	);
}

export default function Lookups() {
	const router = useRouter();
	const { data, isLoading, isError } = useQuery({
		queryKey: ["lookups"],
		queryFn: getSearches,
	});

	const searches = data?.searches ?? [];

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold">Lookups</h1>

			{isError && (
				<p className="text-sm text-danger">Error of retrieving lookups data</p>
			)}

			<div className="w-full overflow-x-auto">
				<Table
					aria-label="Lookups table"
					isStriped
					onRowAction={(key) => router.push(`/lookups/${String(key)}`)}
				>
					<TableHeader>
						<TableColumn>FROM</TableColumn>
						<TableColumn>TO</TableColumn>
						<TableColumn>DATE FROM</TableColumn>
						<TableColumn>DATE TO</TableColumn>
						<TableColumn>DAYS</TableColumn>
						<TableColumn>PROVIDERS</TableColumn>
						<TableColumn>STATUS</TableColumn>
						<TableColumn>LOWEST PRICE</TableColumn>
						<TableColumn>STARTED AT</TableColumn>
						<TableColumn>NEXT CHECK AT</TableColumn>
						<TableColumn>TOTAL CHECKS</TableColumn>
					</TableHeader>
					<TableBody
						isLoading={isLoading}
						loadingContent={<Spinner label="Loading..." />}
						emptyContent={!isLoading && "No searches found."}
					>
						{searches.map((search) => {
							const lowestPrice = getLowestTicketPrice(search);

							return (
								<TableRow
									key={search.searchId}
									className="cursor-pointer transition-colors hover:bg-sky-100 dark:hover:bg-sky-900/40"
								>
									<TableCell>{search.airportFrom}</TableCell>
									<TableCell>{search.airportTo}</TableCell>
									<TableCell>{formatDate(search.dateFrom)}</TableCell>
									<TableCell>{formatDate(search.dateTo)}</TableCell>
									<TableCell>{getDaysCount(search)}</TableCell>
									<TableCell>
										<Tooltip
											content={search.providers.join(", ") || "No providers"}
										>
											<span className="inline-flex cursor-help items-center gap-1">
												{search.providers.length}
												<InfoIcon />
											</span>
										</Tooltip>
									</TableCell>
									<TableCell>
										<Chip
											color={getStatusColor(search.status)}
											size="sm"
											variant="flat"
										>
											{search.status}
										</Chip>
									</TableCell>
									<TableCell className="text-success font-semibold">
										{lowestPrice === null ? "-" : formatPrice(lowestPrice)}
									</TableCell>
									<TableCell>{formatDateTime(search.createdAt)}</TableCell>
									<TableCell>{formatDateTime(search.nextCheckAt)}</TableCell>
									<TableCell>{getTotalChecks(search)}</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
