import {
    DatasetKind,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { EventPropertyLogo } from "../dataset-block/metadata-block/components/event-details/supported.events";

export class DataHelpers {
    public static datasetKind2String(kind: DatasetKind): string {
        return kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase();
    }

    /**
     * Format bytes as human-readable text.
     *
     * @param bytes Number of bytes.
     * @param decimalPlaces Number of decimal places to display.
     *
     * @return Formatted string.
     */

    public static readonly BLOCK_DESCRIBE_SEED = "Dataset initialized";
    public static readonly BLOCK_DESCRIBE_SET_TRANSFORM = "Query changed";
    public static readonly BLOCK_DESCRIBE_SET_VOCAB = "Vocabulary changed";
    public static readonly BLOCK_DESCRIBE_SET_POLLING_SOURCE =
        "Polling source changed";
    public static readonly BLOCK_DESCRIBE_SET_INFO =
        "Basic information updated";
    public static readonly BLOCK_DESCRIBE_SET_ATTACHMENTS =
        "Attachments updated";
    private static SHIFT_ATTACHMENTS_VIEW = "\u00A0".repeat(12);

    public static descriptionForEngine(name: string): EventPropertyLogo {
        switch (name) {
            case "flink":
                return {
                    name: "Apache Flink",
                    url_logo: "assets/images/apache-flink.png",
                };
            case "spark":
                return {
                    name: "Apache Spark",
                    url_logo: "assets/images/apache-spark.png",
                };
            default:
                console.log("Engine is not defined");
                return {
                    name: "Engine is not defined",
                };
        }
    }

    public static descriptionMergeStrategy(
        type: string | undefined,
    ): EventPropertyLogo {
        switch (type) {
            case "MergeStrategyLedger":
                return {
                    name: "Ledger strategy",
                    url_logo: "assets/images/ledger.jpg",
                };
            case "MergeStrategyAppend":
                return {
                    name: "Append strategy",
                    url_logo: "assets/images/append.jpg",
                };
            case "MergeStrategySnapshot":
                return {
                    name: "Snapshot strategy",
                    url_logo: "assets/images/snapshot.jpg",
                };
            default:
                return { name: "Unknown strategy" };
        }
    }

    public static descriptionForMetadataBlock(
        block: MetadataBlockFragment,
    ): string {
        const event = block.event;
        switch (event.__typename) {
            case "AddData":
                return `Added ${
                    event.outputData.interval.end -
                    event.outputData.interval.start +
                    1
                } new records`;
            case "ExecuteQuery":
                return `Transformation produced ${
                    event.queryOutputData
                        ? event.queryOutputData.interval.end -
                          event.queryOutputData.interval.start +
                          1
                        : 0
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

    public static escapeText(text: string): string {
        const htmlEscapes: Record<string, string> = {
            "#": "#",
            "<": "/<",
            ">": "/>",
        };
        const reUnescapedHtml = /[#<>]/g;
        const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
        return reHasUnescapedHtml.test(text)
            ? `|\n${this.SHIFT_ATTACHMENTS_VIEW}${text
                  .replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
                  .replace(
                      /(\r\n|\n|\r)/gm,
                      "\n" + this.SHIFT_ATTACHMENTS_VIEW,
                  )}`
            : text;
    }
}
