import {
    DatasetKind,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";

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

    public static descriptionForEngine(name: string): {
        name: string;
        url_logo: string;
    } {
        switch (name) {
            case "flink":
                return {
                    name: "Apache Flink",
                    url_logo: "assets/images/apache-flink.png",
                };
            default:
                return {
                    name: "Apache Spark",
                    url_logo: "assets/images/apache-spark.png",
                };
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
                    event.outputData.interval.start
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
