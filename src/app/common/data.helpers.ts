import AppValues from "src/app/common/app.values";
import * as moment from "moment-timezone";
import {
    DatasetKind,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";

export class DataHelpers {
    public static datasetKind2String(kind: DatasetKind): string {
        return kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase();
    }

    public static shortHash(hash: string): string {
        return hash.slice(-8);
    }

    public static dateTime(rfc3339: string): string {
        const dt = moment(rfc3339);
        return dt.format(AppValues.displayDateFormat);
    }

    public static relativeTime(
        rfc3339: string,
        threshold?: moment.argThresholdOpts,
    ): string {
        const dt = moment(rfc3339);
        const delta = moment.duration(dt.diff(moment()));
        if (threshold?.d) {
            if (Math.abs(delta.asDays()) >= threshold.d) {
                return DataHelpers.dateTime(rfc3339);
            }
        }
        if (threshold?.w) {
            if (Math.abs(delta.asWeeks()) >= threshold.w) {
                return DataHelpers.dateTime(rfc3339);
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
    public static dataSize(bytes: number, decimalPlaces = 1): string {
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

    public static readonly BLOCK_DESCRIBE_SEED = "Dataset initialized";
    public static readonly BLOCK_DESCRIBE_SET_TRANSFORM = "Query changed";
    public static readonly BLOCK_DESCRIBE_SET_VOCAB = "Vocabulary changed";
    public static readonly BLOCK_DESCRIBE_SET_POLLING_SOURCE =
        "Polling source changed";
    public static readonly BLOCK_DESCRIBE_SET_INFO =
        "Basic information updated";
    public static readonly BLOCK_DESCRIBE_SET_ATTACHMENTS =
        "Attachments updated";

    public static descriptionForMetadataBlock(
        block: MetadataBlockFragment,
    ): string {
        const event = block.event;
        switch (event.__typename) {
            case "AddData":
                return `Added ${
                    event.addedOutputData.interval.end -
                    event.addedOutputData.interval.start
                } new records`;
            case "ExecuteQuery":
                return `Transformation produced ${
                    event.queryOutputData
                        ? event.queryOutputData.interval.end -
                          event.queryOutputData.interval.start
                        : "0"
                } new records`;
            case "Seed":
                return DataHelpers.BLOCK_DESCRIBE_SEED;
            case "SetTransform":
                return DataHelpers.BLOCK_DESCRIBE_SET_TRANSFORM;
            case "SetVocab":
                return DataHelpers.BLOCK_DESCRIBE_SET_VOCAB;
            case "SetWatermark":
                return `Watermark updated to ${
                    event.outputWatermark as string
                }`;
            case "SetPollingSource":
                return DataHelpers.BLOCK_DESCRIBE_SET_POLLING_SOURCE;
            case "SetInfo":
                return DataHelpers.BLOCK_DESCRIBE_SET_INFO;
            case "SetLicense":
                return `License updated: ${event.name}`;
            case "SetAttachments":
                return DataHelpers.BLOCK_DESCRIBE_SET_ATTACHMENTS;
        }
    }
}
