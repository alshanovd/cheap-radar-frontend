"use client";

import {
	Link,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

type FlightSearch = {
	id: string;
	company: string;
	datetime: string;
	price: string;
	link: string;
};

const fetchOngoingSearches = async (): Promise<FlightSearch[]> => {
	// Mock API delay
	await new Promise((resolve) => setTimeout(resolve, 800));
	return [
		{
			id: "1",
			company: "SkyHigh Airlines",
			datetime: "2026-04-12 10:30",
			price: "$290",
			link: "https://example.com/flight/1",
		},
		{
			id: "2",
			company: "Oceanic Air",
			datetime: "2026-04-15 14:00",
			price: "$450",
			link: "https://example.com/flight/2",
		},
		{
			id: "3",
			company: "Continental",
			datetime: "2026-04-20 08:15",
			price: "$210",
			link: "https://example.com/flight/3",
		},
	];
};

export default function OngoingSearches() {
	const { data, isLoading } = useQuery({
		queryKey: ["ongoing-searches"],
		queryFn: fetchOngoingSearches,
	});

	return (
		<div className="flex flex-col gap-6">
			<h1 className="text-3xl font-bold">Ongoing Searches</h1>

			<div className="w-full overflow-x-auto">
				<Table aria-label="Ongoing searches table" isStriped>
					<TableHeader>
						<TableColumn>FLIGHT COMPANY</TableColumn>
						<TableColumn>DATE / TIME</TableColumn>
						<TableColumn>PRICE</TableColumn>
						<TableColumn>LINK</TableColumn>
					</TableHeader>
					<TableBody
						isLoading={isLoading}
						loadingContent={<Spinner label="Loading..." />}
						emptyContent={!isLoading && "No searches found."}
					>
						{(data || []).map((flight) => (
							<TableRow key={flight.id}>
								<TableCell>
									<Link
										href={`/ongoing-searches/${flight.id}`}
										className="text-primary font-medium"
									>
										{flight.company}
									</Link>
								</TableCell>
								<TableCell>{flight.datetime}</TableCell>
								<TableCell className="text-success font-semibold">
									{flight.price}
								</TableCell>
								<TableCell>
									<Link
										href={flight.link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-blue-500 underline"
									>
										View
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
