import { type CalendarDate, parseDate } from "@internationalized/date";
import moment from "moment";

export const CHECK_INTERVAL_OPTIONS = [3, 6, 9, 12, 15, 18, 21, 24];
export const PROVIDER_OPTIONS = ["GOOGLE", "TEST"];

const CHECK_OPTION_COUNT = 9;
const API_DATE_FORMAT = "YYYY-MM-DD";

function toCalendarDate(date: moment.Moment) {
	return parseDate(date.format(API_DATE_FORMAT));
}

export function getInitialDateFrom() {
	return toCalendarDate(moment());
}

export function getInitialDateTo() {
	return toCalendarDate(moment().add(3, "days"));
}

export function formatCalendarDate(date: CalendarDate) {
	return moment(date.toString(), API_DATE_FORMAT).format(API_DATE_FORMAT);
}

export function getLastCheckOptions(intervalHours: number) {
	const start = moment();

	return Array.from({ length: CHECK_OPTION_COUNT }, (_, index) => {
		const date = start.clone().add(intervalHours * index, "hours");
		const checkNumber = index + 1;

		return {
			value: date.format("YYYY-MM-DD HH:mm:ss"),
			label: `${date.format("h:mma D MMM")} - ${checkNumber} ${
				checkNumber === 1 ? "check" : "checks"
			}`,
		};
	});
}
