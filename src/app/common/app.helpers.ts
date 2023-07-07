import moment from "moment";
import { MaybeNull } from "./app.types";
import { DataSchema } from "../api/kamu.graphql.interface";
import { DatasetSchema } from "../interface/dataset.interface";

export function requireValue<T>(input: MaybeNull<T>) {
    if (input === null) throw Error("value is required!");
    return input;
}

export function logError<T>(input: T) {
    console.error(input);
}

export function promiseWithCatch<T>(promise: Promise<T>): void {
    promise.catch((e) => logError(e));
}

export function capitalizeFirstLetter(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
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
export function momentConvertDatetoLocalWithFormat(dateParams: {
    date: Date | number;
    format?: string;
    isTextDate?: boolean;
}): string {
    const stringDate: Date = new Date(dateParams.date);

    // solution for all browsers
    const UTCStringDate: string = moment(stringDate).format(
        "YYYY-MM-DDTHH:mm:ss.sss",
    );
    const ISOStringDate: string = new Date(String(UTCStringDate)).toISOString();

    if (dateParams.isTextDate) {
        if (
            moment(dateParams.date).isSame(moment().subtract(1, "day"), "day")
        ) {
            return "Yesterday";
        }
        if (moment(dateParams.date).isSame(moment(), "day")) {
            return "Today";
        }
    }

    return moment(ISOStringDate).format(dateParams.format);
}

export function parseCurrentSchema(
    data: MaybeNull<DataSchema | undefined>,
): MaybeNull<DatasetSchema> {
    return data ? (JSON.parse(data.content) as DatasetSchema) : null;
}
