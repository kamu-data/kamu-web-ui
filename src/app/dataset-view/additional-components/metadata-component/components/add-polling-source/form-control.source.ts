export interface RadioControlType {
    id: string;
    value: string;
    icon: string;
    label: string;
    tooltip: string;
}

export const FETCH_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "from-url",
        value: "url",
        icon: "link",
        label: "Sync from URL",
        tooltip: "Pulls data from one of the supported sources by its URL.",
    },
    {
        id: "from-filesGlob",
        value: "filesGlob",
        icon: "file_upload",
        label: "Sync from files GLOB",
        tooltip: "Uses glob operator to match files on the local file system.",
    },
    {
        id: "from-container",
        value: "container",
        icon: "input",
        label: "Sync from container",
        tooltip:
            "Runs the specified OCI container to fetch data from an arbitrary source.",
    },
];

export const READ_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "csv",
        value: "csv",
        icon: "format_quote",
        label: "CSV",
        tooltip: "Reader for comma-separated files.",
    },
    {
        id: "jsonLines",
        value: "jsonLines",
        icon: "document_scanner",
        label: "Json Lines",
        tooltip:
            "Reader for files containing concatenation of multiple JSON records with the same schema.",
    },
    {
        id: "geoJson",
        value: "geoJson",
        icon: "public",
        label: "Geo Json",
        tooltip: "Reader for GeoJSON files.",
    },
    {
        id: "esriShapefile",
        value: "esriShapefile",
        icon: "rounded_corner",
        label: "ESRI Shapefile",
        tooltip: "Reader for ESRI Shapefile format.",
    },
    {
        id: "parquet",
        value: "parquet",
        icon: "view_array",
        label: "Parquet",
        tooltip: "Reader for Apache Parquet format.",
    },
];

export const MERGE_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "append",
        value: "append",
        icon: "post_add",
        label: "Append strategy",
        tooltip:
            "Under this strategy polled data will be appended in its original form to the already ingested data without modifications.",
    },
    {
        id: "ledger",
        value: "ledger",
        icon: "account_tree",
        label: "Ledger strategy",
        tooltip:
            "Ledger merge strategy.\n\nThis strategy should be used for data sources containing append-only event\nstreams. New data dumps can have new rows added, but once data already\nmade it into one dump it never changes or disappears.\n\nA system time column will be added to the data to indicate the time\nwhen the record was observed first by the system.\n\nIt relies on a user-specified primary key columns to identify which records\nwere already seen and not duplicate them.\n\nIt will always preserve all columns from existing and new snapshots, so\nthe set of columns can only grow.",
    },
    {
        id: "snapshot",
        value: "snapshot",
        icon: "filter_center_focus",
        label: "Snapshot strategy",
        tooltip:
            'Snapshot merge strategy.\n\nThis strategy can be used for data dumps that are taken periodical\nand contain only the latest state of the observed entity or system.\nOver time such dumps can have new rows added, and old rows either removed\nor modified.\n\nThis strategy transforms snapshot data into an append-only event stream\nwhere data already added is immutable. It does so by treating rows in\nsnapshots as "observation" events and adding an "observed" column\nthat will contain:\n  - "I" - when a row appears for the first time\n  - "D" - when row disappears\n  - "U" - whenever any row data has changed\n\nIt relies on a user-specified primary key columns to correlate the rows\nbetween the two snapshots.\n\nThe time when a snapshot was taken (event time) is usually captured in some\nform of metadata (e.g. in the name of the snapshot file, or in the caching\nheaders). In order to populate the event time we rely on the `FetchStep`\nto extract the event time from metadata. User then should specify the name\nof the event time column that will be populated from this value.\n\nIf the data contains a column that is guaranteed to change whenever\nany of the data columns changes (for example this can be a last\nmodification timestamp, an incremental version, or a data hash), then\nit can be specified as modification indicator to speed up the detection of\nmodified rows.\n\nSchema Changes:\n\nThis strategy will always preserve all columns from the existing and new snapshots, so the set of columns can only grow.',
    },
];
