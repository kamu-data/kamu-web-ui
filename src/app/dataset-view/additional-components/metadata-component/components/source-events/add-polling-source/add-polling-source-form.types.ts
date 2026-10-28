/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SqlQueryStep, Transform } from "@api/kamu.graphql.interface";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { SourceOrder } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/process-form.service.types";

export enum SetPollingSourceSection {
    READ = "read",
    FETCH = "fetch",
    MERGE = "merge",
    PREPROCESS = "preprocess",
    PREPARE = "prepare",
}

export interface ReadFormatControlType {
    label: string;
    value: string;
}

export enum ControlType {
    TEXT = "text",
    ARRAY_KEY_VALUE = "array-key-value",
    TOPICS = "topics",
    CHECKBOX = "checkbox",
    ARRAY_KEY = "array-key",
    SCHEMA = "schema",
    EVENT_TIME = "event-time",
    CACHE = "cache",
    ORDER = "order",
    TYPEAHEAD = "typeahead",
    JSON_KIND = "json-kind",
    NUMBER = "number",
}

export enum FetchKind {
    URL = "Url",
    FILES_GLOB = "FilesGlob",
    CONTAINER = "Container",
    MQTT = "Mqtt",
    ETHEREUM_LOGS = "EthereumLogs",
}

export enum ReadKind {
    CSV = "Csv",
    ALL_GEO = "AllGeo",
    GEO_JSON = "GeoJson",
    ND_GEO_JSON = "NdGeoJson",
    ESRI_SHAPEFILE = "EsriShapefile",
    PARQUET = "Parquet",
    All_JSON = "AllJson",
    JSON = "Json",
    ND_JSON = "NdJson",
}

export enum MergeKind {
    APPEND = "Append",
    LEDGER = "Ledger",
    SNAPSHOT = "Snapshot",
    CHANGELOG_STREAM = "ChangelogStream",
    UPSERT_STREAM = "UpsertStream",
}

export enum PrepareKind {
    PIPE = "Pipe",
    DECOMPRESS = "Decompress",
}

export enum DecompressFormat {
    ZIP = "Zip",
    GZIP = "Gzip",
}

export enum PreprocessKind {
    SQL = "Sql",
}

export enum EventTimeSourceKind {
    FROM_METADATA = "FromMetadata",
    FROM_PATH = "FromPath",
    FROM_SYSTEM_TIME = "FromSystemTime",
}

export interface EventTimeValue {
    kind: EventTimeSourceKind;
    pattern?: string;
    timestampFormat?: string;
}

/** ODF's `SourceCaching`, whose only variant caches the fetched data forever. */
export interface SourceCachingValue {
    kind: "Forever";
}

export interface FetchStepValue {
    kind: FetchKind;
    url?: string;
    path?: string;
    image?: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    chainId?: number;
    nodeUrl?: string;
    filter?: string;
    signature?: string;
    eventTime?: EventTimeValue;
    headers?: NameValue[];
    env?: EnvVar[];
    command?: string[];
    args?: string[];
    topics?: TopicsType[];
    cache?: SourceCachingValue;
    order?: SourceOrder;
}

export interface ReadStepValue {
    kind: ReadKind;
    jsonKind?: ReadKind;
    schema?: DataSchemaField[];
    subPath?: string;
    header?: boolean;
    inferSchema?: boolean;
    encoding?: string;
    separator?: string;
    quote?: string;
    escape?: string;
    nullValue?: string;
    dateFormat?: string;
    timestampFormat?: string;
}

export interface MergeStepValue {
    kind: MergeKind;
    primaryKey?: string[];
    compareColumns?: string[];
}

export type PrepareStepValue =
    | { kind: PrepareKind.PIPE; command: string[] }
    | { kind: PrepareKind.DECOMPRESS; format: DecompressFormat; subPath?: string };

export interface PreprocessValue extends Transform {
    kind: PreprocessKind.SQL;
    query?: string;
}

/** A `SetPollingSource` event: what the editor reads from YAML and writes back. */
export interface AddPollingSourceEditFormType {
    kind?: string;
    fetch: FetchStepValue;
    prepare?: PrepareStepValue[];
    read: ReadStepValue;
    preprocess?: PreprocessValue;
    merge: MergeStepValue;
}

export interface EditFormParseType {
    content: {
        event: Omit<AddPollingSourceEditFormType, "read"> & {
            read: Omit<ReadStepValue, "schema"> & {
                schema?: {
                    fields: DataSchemaField[];
                };
            };
        };
    };
}

export interface NameValue {
    name: string;
    value: string;
}

/** An environment variable of a container; one without a value takes the value the host sets. */
export interface EnvVar {
    name: string;
    value?: string;
}

export interface TopicsType {
    path: string;
    qos?: string;
}

export interface PreprocessStepValue {
    engine: string;
    queries: Omit<SqlQueryStep, "__typename">[];
}
