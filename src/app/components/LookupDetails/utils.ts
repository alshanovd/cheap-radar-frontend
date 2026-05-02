import type { ChipProps } from "@heroui/react";
import moment from "moment";
import type { FlightSearch, SearchTicket } from "@/app/api/searches";

export const LOOKUP_REFETCH_INTERVAL_MS = 10_000;
export const LOOKUP_SCHEDULED_REFETCH_INTERVAL_MS = 60_000;

export const isCompletedStatus = (status?: FlightSearch["status"]) =>
	status?.toLowerCase() === "completed";

export const isScheduledStatus = (status?: FlightSearch["status"]) =>
	status?.toLowerCase() === "scheduled";

export function getLookupRefetchInterval(status?: FlightSearch["status"]) {
	if (isCompletedStatus(status)) return false;
	if (isScheduledStatus(status)) return LOOKUP_SCHEDULED_REFETCH_INTERVAL_MS;

	return LOOKUP_REFETCH_INTERVAL_MS;
}

export const formatDate = (date: string) => moment(date).format("D MMM");

export const formatDateTime = (date: string | null) =>
	date ? moment(date).format("HH:mm - D MMM") : "-";

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;

export function getLookupCheckDates(
	checkFinishAt: string,
	nextCheckAt: string | null,
) {
	if (!nextCheckAt) {
		return { checkFinishAt, nextCheckAt };
	}

	const laterDate = moment(nextCheckAt).isAfter(checkFinishAt)
		? nextCheckAt
		: checkFinishAt;

	return { checkFinishAt: laterDate, nextCheckAt: laterDate };
}

export function getCheapestTicket(tickets: SearchTicket[]) {
	if (tickets.length === 0) return null;

	return tickets.reduce((cheapest, ticket) =>
		ticket.price < cheapest.price ? ticket : cheapest,
	);
}

export function getStatusColor(
	status: FlightSearch["status"],
): ChipProps["color"] {
	if (isCompletedStatus(status)) return "success";
	if (status.toLowerCase() === "ongoing") return "primary";
	if (status.toLowerCase() === "created") return "warning";
	if (isScheduledStatus(status)) return "secondary";

	return "default";
}

export function getTicketKey(ticket: SearchTicket) {
	return `${ticket.provider}-${ticket.date}-${ticket.price}-${ticket.link}`;
}
