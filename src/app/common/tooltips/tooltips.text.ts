export class SetPollingSourceTooltipsTexts {
    public static readonly URL = "URL of the data source.";
    public static readonly EVENT_TIME = "Describes how event time is extracted from the source metadata.";
    public static readonly EVENT_TIME_FROM_METADATA = "Extracts event time from the source's metadata.";
    public static readonly EVENT_TIME_FROM_PATH = "Extracts event time from the path component of the source.";
    public static readonly EVENT_TIME_SYSTEM_TIME = "Assigns event time from the system time source.";
    public static readonly CACHE = "After source was processed once it will never be ingested again.";
    public static readonly PATH = "Path with a glob pattern.";
    public static readonly ORDER =
        "Specifies how input files should be ordered before ingestion. Order is important as every file will be processed individually and will advance the dataset's watermark.";
    public static readonly IMAGE = "Image name and and an optional tag.";
    public static readonly COMMANDS =
        "Specifies the entrypoint. Not executed within a shell. The default OCI image's ENTRYPOINT is used if this is not provided.";
    public static readonly ARGUMENTS =
        "Arguments to the entrypoint. The OCI image's CMD is used if this is not provided.";
    public static readonly ENVIRONMENT_VARIABLES = "Environment variables to propagate into or set in the container.";
    public static readonly DECOMPRESS_FORMAT = "Name of a compression algorithm used on data.";
    public static readonly DECOMPRESS_SUB_PATH =
        "Path to a data file within a multi-file archive. Can contain glob patterns.";
    public static readonly COMMAND = "Command to execute and its arguments.";
    public static readonly FROM_URL = "Pulls data from one of the supported sources by its URL.";
    public static readonly FROM_FILES_GLOB = "Uses glob operator to match files on the local file system.";
    public static readonly FROM_CONTAINER = "Runs the specified OCI container to fetch data from an arbitrary source.";
    public static readonly FROM_MQTT = "Connects to an MQTT broker to fetch events from the specified topic.";
    public static readonly MQTT_HOST = "Hostname of the MQTT broker.";
    public static readonly MQTT_PORT = "Port of the MQTT broker.";
    public static readonly MQTT_USERNAME = "Username to use for auth with the broker.";
    public static readonly MQTT_PASSWORD = "Password to use for auth with the broker (can be templated).";
    public static readonly MQTT_TOPICS = "List of topic subscription parameters.";
    public static readonly FROM_ETHEREUM_LOGS = "Connects to an Ethereum node to stream transaction logs.";
    public static readonly ETHEREUM_LOGS_CHAIN_ID = "Identifier of the chain to scan logs from.";
    public static readonly ETHEREUM_LOGS_NODE_URL = "Url of the node.";
    public static readonly ETHEREUM_LOGS_FILTER =
        "An SQL WHERE clause that can be used to pre-filter the logs before fetching them from the ETH node.";
    public static readonly ETHEREUM_LOGS_SIGNATURE =
        "Solidity log event signature to use for decoding. Using this field adds event to the output containing decoded log as JSON.";
}
