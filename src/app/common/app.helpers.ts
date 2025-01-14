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
    return data ? (JSON.parse(removeAllLineBreaks(data.content)) as DatasetSchema) : null;
}

export function removeAllLineBreaks(value: string): string {
    return value.replace(/(\r\n|\n|\r)/gm, "");
}

export function excludeAgoWord(value: string): string {
    return value.replace("ago", "");
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

export function capitalizeString(value: string): string {
    return value[0].toUpperCase() + value.slice(1).toLowerCase();
}

// After the set time in the timeout, the class("clipboard-btn--success") is removed.
// The result will be a change in the icon. The function looks like a swap
export function changeCopyIcon(event: MouseEvent): void {
    if (event.currentTarget !== null) {
        const htmlButtonElement: HTMLButtonElement = event.currentTarget as HTMLButtonElement;
        const iconsPair: HTMLCollectionOf<HTMLElement> = htmlButtonElement.children as HTMLCollectionOf<HTMLElement>;
        setTimeout(() => {
            iconsPair[0].style.display = "inline-block";
            iconsPair[1].style.display = "none";
            htmlButtonElement.classList.remove("clipboard-btn--success");
        }, AppValues.LONG_DELAY_MS);
        iconsPair[0].style.display = "none";
        iconsPair[1].style.display = "inline-block";
        htmlButtonElement.classList.add("clipboard-btn--success");
    }
}

export function addMarkdownRunButton(sqlQueries: RegExpMatchArray | null, path: string): void {
    const containerRunButtonElement: HTMLCollectionOf<Element> =
        document.getElementsByClassName("container-run-button");

    if (sqlQueries?.length && !containerRunButtonElement.length) {
        const preElements: NodeListOf<Element> = document.querySelectorAll("pre.language-sql");
        preElements.forEach((preElement: Element, index: number) => {
            const divElement: HTMLDivElement = document.createElement("div");
            divElement.classList.add("container-run-button");
            divElement.style.position = "absolute";
            divElement.style.top = "10px";
            divElement.style.right = "65px";
            const linkElement = document.createElement("a");
            linkElement.classList.add("markdown-run-button");
            linkElement.style.padding = "3.6px 16px";
            linkElement.style.color = "#ffff";
            linkElement.style.fontSize = "13px";
            linkElement.style.textDecoration = "none";
            linkElement.style.backgroundColor = "rgba(255,255, 255, 0.07)";
            linkElement.style.borderRadius = "4px";
            linkElement.style.transition = "all 250ms ease-out";
            linkElement.setAttribute("target", "_blank");
            linkElement.setAttribute("href", `${path}=${encodeURI(sqlQueries[index])}`);
            linkElement.addEventListener("mouseover", () => {
                linkElement.style.backgroundColor = "rgba(255,255, 255, 0.14)";
            });
            linkElement.addEventListener("mouseleave", () => {
                linkElement.style.backgroundColor = "rgba(255,255, 255, 0.07)";
            });
            linkElement.innerHTML = "Run";
            divElement.appendChild(linkElement);
            preElement.after(divElement);
        });
    }
}
