export class TooltipsTexts {
    public static readonly URL = "URL of the data source.";
    public static readonly EVENT_TIME =
        "Describes how event time is extracted from the source metadata.";
    public static readonly EVENT_TIME_FROM_METADATA =
        "Extracts event time from the source's metadata.";
    public static readonly EVENT_TIME_FROM_PATH =
        "Extracts event time from the path component of the source.";
    public static readonly HEADERS =
        "Headers to pass during the request (e.g. HTTP Authorization)";
    public static readonly CACHE =
        "After source was processed once it will never be ingested again.";
    public static readonly PATH = "Path with a glob pattern.";
    public static readonly ORDER =
        "Specifies how input files should be ordered before ingestion. Order is important as every file will be processed individually and will advance the dataset's watermark.";
    public static readonly IMAGE = "Image name and and an optional tag.";
    public static readonly COMMANDS =
        "Specifies the entrypoint. Not executed within a shell. The default OCI image's ENTRYPOINT is used if this is not provided.";
    public static readonly ARGUMENTS =
        "Arguments to the entrypoint. The OCI image's CMD is used if this is not provided.";
    public static readonly ENVIROMENT_VARIABLES =
        "Environment variables to propagate into or set in the container.";
    public static readonly SCHEMA =
        "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.";
    public static readonly HEADER = "Use the first line as names of columns.";
    public static readonly ENCODING =
        "Decodes the CSV files by the given encoding type.";
    public static readonly SEPARATOR =
        "Sets a single character as a separator for each field and value.";
    public static readonly QUOTE =
        "Sets a single character used for escaping quoted values where the separator can be part of the value. Set an empty string to turn off quotations.";
    public static readonly ESCAPE =
        "Sets a single character used for escaping quotes inside an already quoted value.";
    public static readonly COMMENT =
        "Sets a single character used for skipping lines beginning with this character.";
    public static readonly NULL_VALUE =
        "Sets the string representation of a null value.";
    public static readonly EMPTY_VALUE =
        "Sets the string representation of an empty value.";
    public static readonly NAN_VALUE =
        "Sets the string representation of a non-number value.";
    public static readonly POSITIVE_INFINITY =
        "Sets the string representation of a positive infinity value.";
    public static readonly NEGATIVE_INFINITY =
        "Sets the string representation of a negative infinity value.";
    public static readonly DATE_FORMAT =
        "Sets the string that indicates a date format.";
    public static readonly TIMESTAMP_FORMAT =
        "Sets the string that indicates a timestamp format.";
    public static readonly ENFORCE_SCHEMA =
        "If it is set to true, the specified or inferred schema will be forcibly applied to datasource files, and headers in CSV files will be ignored. If the option is set to false, the schema will be validated against all headers in CSV files in the case when the header option is set to true.";
    public static readonly INFER_SCHEMA =
        "Infers the input schema automatically from data. It requires one extra pass over the data.";
    public static readonly IGNORE_LEADING_WHITESPACE =
        "A flag indicating whether or not leading whitespaces from values being read should be skipped.";
    public static readonly QUIGNORE_TRAILING_WHITESPACEOTE =
        "A flag indicating whether or not trailing whitespaces from values being read should be skipped.";
    public static readonly MULTI_LINE =
        "Parse one record, which may span multiple lines.";
    public static readonly PRIMITIVE_AS_STRING =
        "Infers all primitive values as a string type.";
    public static readonly SUB_PATH =
        "Path to a data file within a multi-file archive. Can contain glob patterns.";
    public static readonly PRIMARY_KEYS =
        "Names of the columns that uniquely identify the record throughout its lifetime";
    public static readonly COMPARE_COLUMNS =
        "Names of the columns to compared to determine if a row has changed between two snapshots.";
    public static readonly OBSERVATION_COLUMN =
        "Name of the observation type column that will be added to the data.";
    public static readonly OBSERVATION_ADDED =
        "Name of the observation type when the data with certain primary key is seen for the first time.";
    public static readonly OBSERVATION_CHANGED =
        "Name of the observation type when the data with certain primary key has changed compared to the last time it was seen.";
    public static readonly OBSERVATION_REMOVED =
        "Name of the observation type when the data with certain primary key has been seen before but now is missing from the snapshot.";
    public static readonly MERGE_STRATEGY_LEDGER =
        "Merge strategy determines how newly ingested data should be combined with the data that already exists in the dataset.";
    public static readonly MERGE_STRATEGY_APPEND =
        "Merge strategy determines how newly ingested data should be combined with the data that already exists in the dataset.";
    public static readonly ENGINE =
        "Identifier of the engine used for this transformation.";
    public static readonly QUERIES =
        "Queries use for specifying multi-step SQL transformations.";
    public static readonly DECOMPRESS_FORMAT =
        "Name of a compression algorithm used on data.";
    public static readonly DECOMPRESS_SUB_PATH =
        "Path to a data file within a multi-file archive. Can contain glob patterns.";
    public static readonly COMMAND = "Command to execute and its arguments.";
    public static readonly FROM_URL =
        "Pulls data from one of the supported sources by its URL.";
    public static readonly FROM_FILES_GLOB =
        "Uses glob operator to match files on the local file system.";
    public static readonly FROM_CONTAINER =
        "Runs the specified OCI container to fetch data from an arbitrary source.";
    public static readonly READ_CSV = "Reader for comma-separated files.";
    public static readonly READ_JSON_LINES =
        "Reader for files containing concatenation of multiple JSON records with the same schema.";
    public static readonly READ_GEO_JSON = "Reader for GeoJSON files.";
    public static readonly READ_ESRI_SHAPE_FILE =
        "Reader for ESRI Shapefile format.";
    public static readonly READ_PARQUET = "Reader for Apache Parquet format.";
    public static readonly APPEND_STRATEGY =
        "Under this strategy polled data will be appended in its original form to the already ingested data without modifications.";
    public static readonly LEDGER_STRATEGY =
        "Ledger merge strategy.\n\nThis strategy should be used for data sources containing append-only event\nstreams. New data dumps can have new rows added, but once data already\nmade it into one dump it never changes or disappears.\n\nA system time column will be added to the data to indicate the time\nwhen the record was observed first by the system.\n\nIt relies on a user-specified primary key columns to identify which records\nwere already seen and not duplicate them.\n\nIt will always preserve all columns from existing and new snapshots, so\nthe set of columns can only grow.";
    public static readonly SNAPSHOT_STRATEGY =
        'Snapshot merge strategy.\n\nThis strategy can be used for data dumps that are taken periodical\nand contain only the latest state of the observed entity or system.\nOver time such dumps can have new rows added, and old rows either removed\nor modified.\n\nThis strategy transforms snapshot data into an append-only event stream\nwhere data already added is immutable. It does so by treating rows in\nsnapshots as "observation" events and adding an "observed" column\nthat will contain:\n  - "I" - when a row appears for the first time\n  - "D" - when row disappears\n  - "U" - whenever any row data has changed\n\nIt relies on a user-specified primary key columns to correlate the rows\nbetween the two snapshots.\n\nThe time when a snapshot was taken (event time) is usually captured in some\nform of metadata (e.g. in the name of the snapshot file, or in the caching\nheaders). In order to populate the event time we rely on the `FetchStep`\nto extract the event time from metadata. User then should specify the name\nof the event time column that will be populated from this value.\n\nIf the data contains a column that is guaranteed to change whenever\nany of the data columns changes (for example this can be a last\nmodification timestamp, an incremental version, or a data hash), then\nit can be specified as modification indicator to speed up the detection of\nmodified rows.\n\nSchema Changes:\n\nThis strategy will always preserve all columns from the existing and new snapshots, so the set of columns can only grow.';
}
