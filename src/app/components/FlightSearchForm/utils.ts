import { type CalendarDate, parseDate } from "@internationalized/date";
import moment from "moment";

export const CHECK_INTERVAL_OPTIONS = [3, 6, 9, 12, 15, 18, 21, 24];
export const PROVIDER_OPTIONS = ["GOOGLE", "TEST"];

const CHECK_OPTION_COUNT = 9;
const API_DATE_FORMAT = "YYYY-MM-DD";

export type LastCheckOption = {
	value: string;
	label: string;
};

export function getCurrentCalendarDate() {
	return parseDate(moment().format(API_DATE_FORMAT));
}

export function formatCalendarDate(date: CalendarDate) {
	return moment(date.toString(), API_DATE_FORMAT).format(API_DATE_FORMAT);
}

export function getInclusiveDaysCount(
	dateFrom: CalendarDate | null,
	dateTo: CalendarDate | null,
) {
	if (!dateFrom || !dateTo) return 0;

	const from = moment(formatCalendarDate(dateFrom), API_DATE_FORMAT);
	const to = moment(formatCalendarDate(dateTo), API_DATE_FORMAT);
	const daysDiff = to.diff(from, "days");

	return daysDiff < 0 ? 0 : daysDiff + 1;
}

export function getSelectedCheckCount(
	checkFinishAt: string,
	lastCheckOptions: LastCheckOption[],
) {
	const selectedIndex = lastCheckOptions.findIndex(
		(option) => option.value === checkFinishAt,
	);

	return selectedIndex === -1 ? 0 : selectedIndex + 1;
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
