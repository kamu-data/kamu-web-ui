/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export class SourcesTooltipsTexts {
    public static readonly READ_CSV = "Reader for comma-separated files.";
    public static readonly SCHEMA =
        "A DDL-formatted schema. Schema can be used to coerce values into more appropriate data types.";
    public static readonly SEPARATOR = "Sets a single character as a separator for each field and value.";
    public static readonly ENCODING = "Decodes the CSV files by the given encoding type.";
    public static readonly QUOTE =
        "Sets a single character used for escaping quoted values where the separator can be part of the value. Set an empty string to turn off quotations.";
    public static readonly ESCAPE = "Sets a single character used for escaping quotes inside an already quoted value.";
    public static readonly INFER_SCHEMA =
        "Infers the input schema automatically from data. It requires one extra pass over the data.";
    public static readonly NULL_VALUE = "Sets the string representation of a null value.";
    public static readonly HEADERS = "Headers to pass during the request (e.g. HTTP Authorization)";
    public static readonly HEADER = "Use the first line as names of columns.";
    public static readonly QUERIES = "Queries use for specifying multi-step SQL transformations.";
    public static readonly DATE_FORMAT =
        "Sets the string that indicates a date format. The `rfc3339` is the only required format, the other format strings are implementation-specific.";
    public static readonly TIMESTAMP_FORMAT =
        "Sets the string that indicates a timestamp format. The `rfc3339` is the only required format, the other format strings are implementation-specific.";
    public static readonly MERGE_STRATEGY_APPEND =
        "Merge strategy determines how newly ingested data should be combined with the data that already exists in the dataset.";
    public static readonly ENGINE = "Identifier of the engine used for this transformation.";
    public static readonly MERGE_STRATEGY_LEDGER =
        "Merge strategy determines how newly ingested data should be combined with the data that already exists in the dataset.";
    public static readonly PRIMARY_KEYS =
        "Names of the columns that uniquely identify the record throughout its lifetime";
    public static readonly READ_JSON = "Reader for JSON files that contain an array of objects within them.";
    public static readonly READ_JSON_ENCODING = "Allows to forcibly set one of standard basic or extended encodings.";
    public static readonly READ_GEO_JSON = "Reader for GeoJSON files.";
    public static readonly READ_JSON_SUB_PATH =
        "Path in the form of a.b.c to a sub-element of the root JSON object that is an array or objects. If not specified it is assumed that the root element is an array.";
    public static readonly READ_ND_GEO_JSON =
        "Reader for Newline-delimited GeoJSON files. It is similar to `GeoJson` format but instead of `FeatureCollection` object in the root it expects every individual feature object to appear on its own line.";
    public static readonly SNAPSHOT_STRATEGY =
        "This strategy can be used for data dumps that are taken periodical and contain only the latest state of the observed entity or system.";
    public static readonly COMPARE_COLUMNS =
        "Names of the columns to compared to determine if a row has changed between two snapshots.";
    public static readonly READ_ESRI_SHAPE_FILE = "Reader for ESRI Shapefile format.";
    public static readonly SUB_PATH = "Path to a data file within a multi-file archive. Can contain glob patterns.";
    public static readonly READ_PARQUET = "Reader for Apache Parquet format.";
    public static readonly READ_ND_JSON =
        "Reader for files containing multiple newline-delimited JSON objects with the same schema.";
    public static readonly PRIMITIVE_AS_STRING = "Infers all primitive values as a string type.";
    public static readonly APPEND_STRATEGY =
        "Under this strategy polled data will be appended in its original form to the already ingested data without modifications.";
    public static readonly LEDGER_STRATEGY =
        "This strategy should be used for data sources containing append-only event streams.";
}
