import AppValues from "src/app/common/app.values";
import * as moment from "moment-timezone";
import {
    DatasetKind,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";

export function datasetKind2String(kind: DatasetKind): string {
    return kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase();
}

export function shortHash(hash: string): string {
    return hash.slice(-8);
}

export function dateTime(rfc3339: string): string {
    const dt = moment(rfc3339);
    return dt.format(AppValues.displayDateFormat);
}

export function relativeTime(
    rfc3339: string,
    threshold?: moment.argThresholdOpts,
): string {
    const dt = moment(rfc3339);
    const delta = moment.duration(dt.diff(moment()));
    if (threshold?.d) {
        if (Math.abs(delta.asDays()) >= threshold.d) {
            return dateTime(rfc3339);
        }
    }
    if (threshold?.w) {
        if (Math.abs(delta.asWeeks()) >= threshold.w) {
            return dateTime(rfc3339);
        }
    }
    return delta.humanize(true);
}

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param decimalPlaces Number of decimal places to display.
 *
 * @return Formatted string.
 */
 export function dataSize(
    bytes: number,
    decimalPlaces = 1,
): string {
    const thresh = 1024;

    if (Math.abs(bytes) < thresh) {
        return `${bytes} B`;
    }

    const units = ["KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    let u = -1;
    const r = 10 ** decimalPlaces;

    do {
        bytes /= thresh;
        ++u;
    } while (
        Math.round(Math.abs(bytes) * r) / r >= thresh &&
        u < units.length - 1
    );

    return bytes.toFixed(decimalPlaces) + " " + units[u];
}

export function descriptionForMetadataBlock(
    block: MetadataBlockFragment,
): string {
    const event = block.event;
    switch (event.__typename) {
        case "AddData":
            return `Added ${
                event.addedOutputData.interval.end - event.addedOutputData.interval.start
            } new records`;
        case "ExecuteQuery":
            return `Transformation produced ${
                event.queryOutputData
                    ? event.queryOutputData.interval.end -
                        event.queryOutputData.interval.start
                    : "0"
            } new records`;
        case "Seed":
            return `Dataset initialized`;
        case "SetTransform":
            return `Query changed`;
        case "SetVocab":
            return `Vocabulary changed`;
        case "SetWatermark":
            return `Watermark updated to ${event.outputWatermark as string}`;
        case "SetPollingSource":
            return `Polling source changed`;
        case "SetInfo":
            return `Basic information updated`;
        case "SetLicense":
            return `License updated: ${event.name}`;
        case "SetAttachments":
            return `Attachments updated`;

        default:
            return "";
    }
}

