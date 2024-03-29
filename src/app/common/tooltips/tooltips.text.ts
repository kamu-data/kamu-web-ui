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
}
