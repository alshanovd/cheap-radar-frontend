import type { ChipProps } from "@heroui/react";
import moment from "moment";
import type { FlightSearch, SearchTicket } from "@/app/api/searches";

export const LOOKUP_REFETCH_INTERVAL_MS = 10_000;

export const isCompletedStatus = (status?: FlightSearch["status"]) =>
	status?.toLowerCase() === "completed";

export const formatDate = (date: string) => moment(date).format("DD MMM YYYY");

export const formatDateTime = (date: string | null) =>
	date ? moment(date).format("DD MMM YYYY, HH:mm") : "-";

export const formatTime = (date: string) => moment(date).format("HH:mm");

export const formatPrice = (price: number) => `$${price.toFixed(2)}`;

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
	if (status.toLowerCase() === "scheduled") return "secondary";

	return "default";
}

export function getTicketKey(ticket: SearchTicket) {
	return `${ticket.provider}-${ticket.date}-${ticket.price}-${ticket.link}`;
}
