import { Injectable } from "@angular/core";
import * as moment from "moment-timezone";
import {
    AddData,
    DatasetKind, MetadataEvent,
} from "../api/kamu.graphql.interface";
import {MetadataBlockExtendedFragment} from "../interface/metadata.interface";

@Injectable()
export class DataHelpersService {
    public datasetKind(kind: DatasetKind): string {
        return kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase();
    }

    public shortHash(hash: string): string {
        return hash.slice(-8);
    }

    public dateTime(rfc3339: string): string {
        const dt = moment(rfc3339);
        return dt.format("YYYY-MM-DD");
    }

    public relativeTime(
        rfc3339: string,
        threshold?: moment.argThresholdOpts,
    ): string {
        const dt = moment(rfc3339);
        const delta = moment.duration(dt.diff(moment()));
        if (threshold?.d) {
            if (Math.abs(delta.asDays()) >= threshold.d) {
                return this.dateTime(rfc3339);
            }
        }
        if (threshold?.w) {
            if (Math.abs(delta.asWeeks()) >= threshold.w) {
                return this.dateTime(rfc3339);
            }
        }
        return delta.humanize(true);
    }

    /**
     * Format bytes as human-readable text.
     *
     * @param bytes Number of bytes.
     * @param si True to use metric (SI) units, aka powers of 1000. False to use
     *           binary (IEC), aka powers of 1024.
     * @param decimal_places Number of decimal places to display.
     *
     * @return Formatted string.
     */
    public dataSize(
        bytes: number,
        si: boolean = false,
        decimal_places: number = 1,
    ) {
        const thresh = si ? 1000 : 1024;

        if (Math.abs(bytes) < thresh) {
            return bytes + " B";
        }

        const units = si
            ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
            : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
        let u = -1;
        const r = 10 ** decimal_places;

        do {
            bytes /= thresh;
            ++u;
        } while (
            Math.round(Math.abs(bytes) * r) / r >= thresh &&
            u < units.length - 1
        );

        return bytes.toFixed(decimal_places) + " " + units[u];
    }

    // What is the MetadataBlockFragment? Why not MetadataBlockExtended?
    // Need to resolve!!!
    public descriptionForMetadataBlock(block: MetadataBlockExtendedFragment): string {
        const event: MetadataEvent = block.event as MetadataEvent;
        switch (event.__typename) {
            case "AddData":
                return `Added ${
                    event.outputData
                        ? event.outputData.interval.end -
                          event.outputData.interval.start
                        : "0"
                } new records`;
            case "ExecuteQuery":
                return `Transformation produced ${
                    event.outputData
                        ? event.outputData.interval.end -
                          event.outputData.interval.start
                        : "0"
                } new records`;
            case "Seed":
                return `Dataset initialized`;
            case "SetTransform":
                return `Query changed`;
            case "SetVocab":
                return `Vocabulary changed`;
            case "SetWatermark":
                return `Watermark updated to ${event.outputWatermark}`;
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
}
