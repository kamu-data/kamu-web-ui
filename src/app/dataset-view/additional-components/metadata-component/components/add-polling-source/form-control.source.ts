export interface RadioControlType {
    id: string;
    value: string;
    icon: string;
    label: string;
}

export const FETCH_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "from-url",
        value: "url",
        icon: "link",
        label: "Sync from URL",
    },
    {
        id: "from-filesGlob",
        value: "filesGlob",
        icon: "file_upload",
        label: "Sync from files GLOB",
    },
    {
        id: "from-container",
        value: "container",
        icon: "input",
        label: "Sync from container",
    },
];

export const READ_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "csv",
        value: "csv",
        icon: "format_quote",
        label: "CSV",
    },
    {
        id: "jsonLines",
        value: "jsonLines",
        icon: "document_scanner",
        label: "Json Lines",
    },
    {
        id: "geoJson",
        value: "geoJson",
        icon: "public",
        label: "Geo Json",
    },
    {
        id: "esriShapefile",
        value: "esriShapefile",
        icon: "rounded_corner",
        label: "ESRI Shapefile",
    },
    {
        id: "parquet",
        value: "parquet",
        icon: "view_array",
        label: "Parquet",
    },
];

export const MERGE_STEP_RADIO_CONTROLS: RadioControlType[] = [
    {
        id: "append",
        value: "append",
        icon: "post_add",
        label: "Append strategy",
    },
    {
        id: "ledger",
        value: "ledger",
        icon: "account_tree",
        label: "Ledger strategy",
    },
    {
        id: "snapshot",
        value: "snapshot",
        icon: "filter_center_focus",
        label: "Snapshot strategy",
    },
];
