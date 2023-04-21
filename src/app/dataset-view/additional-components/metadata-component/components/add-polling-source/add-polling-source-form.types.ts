/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JsonFormValidators {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string | RegExp;
}

interface JsonFormControlOptions {
    buttonText?: string;
    formArrayName?: string;
}

export interface JsonFormControls {
    name: string;
    label: string;
    value: any;
    type: string;
    tooltip?: string;
    placeholder?: string;
    options?: JsonFormControlOptions;
    required?: boolean;
    validators: JsonFormValidators;
    dataTestId?: string;
    list?: string[];
}

export type JsonFormData = Record<
    string,
    {
        controls: JsonFormControls[];
    }
>;

export enum ControlType {
    TEXT = "text",
    ARRAY_KEY_VALUE = "array-key-value",
    CHECKBOX = "checkbox",
    ARRAY_KEY = "array-key",
    SCHEMA = "schema",
    EVENT_TIME = "event-time",
    CACHE = "cache",
    ORDER = "order",
    TYPEAHEAD = "typeahead",
}

export enum FetchKind {
    URL = "url",
    FILES_GLOB = "filesGlob",
    CONTAINER = "container",
}

export enum ReadKind {
    CSV = "csv",
    JSON_LINES = "jsonLines",
    GEO_JSON = "geoJson",
    ESRI_SHAPEFILE = "esriShapefile",
    PARQUET = "parquet",
}

export enum MergeKind {
    APPEND = "append",
    LEDGER = "ledger",
    SNAPSHOT = "snapshot",
}

export enum PrepareKind {
    PIPE = "pipe",
    DECOMPRESS = "decompress",
}

export enum PreprocessKind {
    SQL = "sql",
}

export enum EventTimeSourceKind {
    FROM_METADATA = "fromMetadata",
    FROM_PATH = "fromPath",
}
