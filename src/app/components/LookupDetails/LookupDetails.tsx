"use client";

import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Progress,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { use } from "react";
import { getSearch } from "@/app/api/searches";
import {
	formatDate,
	formatDateTime,
	formatPrice,
	getCheapestTicket,
	getLookupRefetchInterval,
	getStatusColor,
	getTicketKey,
	isCompletedStatus,
	isScheduledStatus,
} from "./utils";

const SUMMARY_ROW_CLASS = "flex gap-4 border-b border-divider pb-2";
const SUMMARY_LABEL_CLASS = "text-default-500";
const SUMMARY_VALUE_CLASS = "font-medium";
const CHEAPEST_ROW_CLASS = "bg-success-50 dark:bg-success-900/20";
const LINK_CLASS = "text-primary hover:underline";

type LookupDetailsProps = {
	params: Promise<{ id: string }>;
};

function SummaryRow({
	label,
	value,
	valueClassName = SUMMARY_VALUE_CLASS,
}: {
	label: string;
	value: React.ReactNode;
	valueClassName?: string;
}) {
	return (
		<div className={SUMMARY_ROW_CLASS}>
			<span className={SUMMARY_LABEL_CLASS}>{label}</span>
			<span className={valueClassName}>{value}</span>
		</div>
	);
}

export function LookupDetails({ params }: LookupDetailsProps) {
	const resolvedParams = use(params);
	const id = resolvedParams.id;

	const { data, isLoading, isError } = useQuery({
		queryKey: ["lookups", id],
		queryFn: () => getSearch(id),
		refetchInterval: (query) =>
			getLookupRefetchInterval(query.state.data?.status),
	});

	const cheapestTicket = data ? getCheapestTicket(data.tickets) : null;
	const isCompleted = isCompletedStatus(data?.status);
	const showLoadingBar = !isCompleted && !isScheduledStatus(data?.status);

	return (
		<div className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-3xl font-bold">Search Details</h1>
				<Button as={Link} href="/lookups" variant="flat">
					Back to List
				</Button>
			</div>

			{isLoading ? (
				<div className="flex justify-center p-12">
					<Spinner size="lg" label="Loading search details..." />
				</div>
			) : isError ? (
				<p className="text-sm text-danger">Error of retrieving lookup data</p>
			) : data ? (
				<div className="flex flex-col gap-6">
					<Card className="w-full">
						<CardHeader className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div>
								<p className="text-md font-bold uppercase tracking-wider">
									{data.airportFrom} to {data.airportTo}
								</p>
								<p className="text-small text-default-500">
									ID: {data.searchId}
								</p>
							</div>
							<Chip color={getStatusColor(data.status)} variant="flat">
								{data.status}
							</Chip>
						</CardHeader>
						<Divider />
						<CardBody className="gap-4">
							<div className="grid gap-3 md:grid-cols-2">
								<SummaryRow
									label="Date From"
									value={formatDate(data.dateFrom)}
								/>
								<SummaryRow label="Date To" value={formatDate(data.dateTo)} />
								<SummaryRow
									label="Created At"
									value={formatDateTime(data.createdAt)}
								/>
								<SummaryRow
									label="Check Finish At"
									value={formatDateTime(data.checkFinishAt)}
								/>
								<SummaryRow
									label="Last Checked At"
									value={formatDateTime(data.lastCheckedAt)}
								/>
								<SummaryRow
									label="Next Check At"
									value={formatDateTime(data.nextCheckAt)}
									valueClassName={
										data.nextCheckAt ? "font-bold text-secondary" : undefined
									}
								/>
								<SummaryRow
									label="Check Interval"
									value={`${data.checkIntervalHours} hours`}
								/>
								<SummaryRow
									label="Providers"
									value={data.providers.join(", ") || "-"}
								/>
							</div>
							<div className={SUMMARY_ROW_CLASS}>
								<span className={SUMMARY_LABEL_CLASS}>Cheapest Price</span>
								<span className="text-success font-bold text-lg">
									{cheapestTicket ? formatPrice(cheapestTicket.price) : "-"}
								</span>
							</div>
							<div className="flex items-center justify-between pt-2">
								<span className={SUMMARY_LABEL_CLASS}>Cheapest Option</span>
								{cheapestTicket ? (
									<Button
										as={Link}
										href={cheapestTicket.link}
										target="_blank"
										rel="noreferrer"
										color="primary"
										size="sm"
									>
										Open cheapest option
									</Button>
								) : (
									<Button isDisabled color="primary" size="sm">
										Open cheapest option
									</Button>
								)}
							</div>
						</CardBody>
					</Card>

					<div className="flex flex-col gap-4">
						{showLoadingBar && (
							<Progress
								size="sm"
								isIndeterminate
								aria-label="Searching for more flights..."
								className="w-full"
							/>
						)}

						<Table aria-label="Tickets table">
							<TableHeader>
								<TableColumn>AIRLINE</TableColumn>
								<TableColumn>DEPARTURE</TableColumn>
								<TableColumn>FROM</TableColumn>
								<TableColumn>TO</TableColumn>
								<TableColumn>PROVIDER</TableColumn>
								<TableColumn>PRICE</TableColumn>
								<TableColumn>LINK</TableColumn>
							</TableHeader>
							<TableBody emptyContent="No tickets found.">
								{data.tickets.map((ticket) => {
									const isCheapest =
										cheapestTicket !== null &&
										ticket.price === cheapestTicket.price;

									return (
										<TableRow
											key={getTicketKey(ticket)}
											className={isCheapest ? CHEAPEST_ROW_CLASS : ""}
										>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar
														src={ticket.airlineLogo}
														name={ticket.airline}
														size="sm"
														className="bg-transparent"
													/>
													<span className="font-medium">{ticket.airline}</span>
												</div>
											</TableCell>
											<TableCell>{formatDateTime(ticket.date)}</TableCell>
											<TableCell>{ticket.airportFrom}</TableCell>
											<TableCell>{ticket.airportTo}</TableCell>
											<TableCell>{ticket.provider}</TableCell>
											<TableCell
												className={
													isCheapest
														? "font-bold text-success"
														: SUMMARY_VALUE_CLASS
												}
											>
												{formatPrice(ticket.price)}
											</TableCell>
											<TableCell>
												<Link
													href={ticket.link}
													className={LINK_CLASS}
													target="_blank"
													rel="noreferrer"
												>
													Open
												</Link>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>
			) : (
				<p>No data found.</p>
			)}
		</div>
	);
}
