import moment from "moment";
import cronParser from "cron-parser";

import { MaybeNull, MaybeNullOrUndefined } from "./app.types";
import { DataSchema } from "../api/kamu.graphql.interface";
import { DatasetSchema } from "../interface/dataset.interface";
import AppValues from "./app.values";

export function requireValue<T>(input: MaybeNull<T>) {
    if (input === null) throw Error("value is required!");
    return input;
}

export function logError<T>(input: T) {
    // eslint-disable-next-line no-console
    console.error(input);
}

export function promiseWithCatch<T>(promise: Promise<T>): void {
    promise.catch((e) => logError(e));
}

export function isMobileView(): boolean {
    return window.innerWidth < window.innerHeight;
}

/**
 * Using for ISO format date from server '2021-02-26 00:13:11.959000'
 * This method converts the date from the format ISO used to the format UTC
 * and then to the local format by displaying it in the specified pattern
 * @param dateParams {Date} date new Date('2021-02-26 00:13:11.959000')
 * @param dateParams {string} format 'MMMM DD, YYYY'
 * @param dateParams {boolean} isTextDate for example 'Today', 'Yesterday'
 * @return {string}
 */
export function momentConvertDateToLocalWithFormat(dateParams: {
    date: Date | number;
    format?: string;
    isTextDate?: boolean;
}): string {
    const stringDate: Date = new Date(dateParams.date);

    // solution for all browsers
    const UTCStringDate: string = moment(stringDate).format("YYYY-MM-DDTHH:mm:ss.sss");
    const ISOStringDate: string = new Date(String(UTCStringDate)).toISOString();

    if (dateParams.isTextDate) {
        if (moment(dateParams.date).isSame(moment().subtract(1, "day"), "day")) {
            return "Yesterday";
        }
        if (moment(dateParams.date).isSame(moment(), "day")) {
            return "Today";
        }
    }

    return moment(ISOStringDate).format(dateParams.format);
}

export function parseCurrentSchema(data: MaybeNullOrUndefined<DataSchema>): MaybeNull<DatasetSchema> {
    return data ? (JSON.parse(data.content) as DatasetSchema) : null;
}

export function cronExpressionNextTime(cronExpression: string): string {
    const date = cronParser.parseExpression(cronExpression).next().toDate();
    return moment(date).format(AppValues.CRON_EXPRESSION_DATE_FORMAT as string);
}

export function convertSecondsToHumanReadableFormat(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
    const minuteString = minutes > 0 ? `${minutes} minute${minutes > 1 ? "s" : ""}` : "";
    const secondString = remainingSeconds >= 1 ? `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}` : "";

    if (hours > 0) {
        return `${hourString}   ${minuteString || "0 minute"} ${secondString && `  ${secondString}`}`;
    } else if (!hours && minutes > 0) {
        return `${minuteString} ${secondString && `  ${secondString}`}`;
    }

    return secondString;
}
