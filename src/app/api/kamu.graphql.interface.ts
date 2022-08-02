// THIS FILE IS GENERATED, DO NOT EDIT!
import { gql } from "@apollo/client/core";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    AccountID: any;
    /**
     * Implement the DateTime<Utc> scalar
     *
     * The input/output is a string in RFC3339 format.
     */
    DateTime: any;
    DatasetID: any;
    Multihash: any;
    DatasetName: any;
    AccountName: any;
};

export type Query = {
    __typename?: "Query";
    /** Account-related functionality group */
    accounts: Accounts;
    /** Returns the version of the GQL API */
    apiVersion: Scalars["String"];
    /** Querying and data manipulations */
    data: DataQueries;
    /** Dataset-related functionality group */
    datasets: Datasets;
    /** Search-related functionality group */
    search: Search;
};

export type Accounts = {
    __typename?: "Accounts";
    /** Returns account by its ID */
    byId?: Maybe<Account>;
    /** Returns account by its name */
    byName?: Maybe<Account>;
};

export type AccountsByIdArgs = {
    accountId: Scalars["AccountID"];
};

export type AccountsByNameArgs = {
    name: Scalars["String"];
};

export type Account = {
    id: Scalars["AccountID"];
    name: Scalars["String"];
};

export type DataQueries = {
    __typename?: "DataQueries";
    /** Executes a specified query and returns its result */
    query: DataQueryResult;
};

export type DataQueriesQueryArgs = {
    dataFormat?: InputMaybe<DataBatchFormat>;
    limit?: InputMaybe<Scalars["Int"]>;
    query: Scalars["String"];
    queryDialect: QueryDialect;
    schemaFormat?: InputMaybe<DataSchemaFormat>;
};

export enum DataBatchFormat {
    Csv = "CSV",
    Json = "JSON",
    JsonLd = "JSON_LD",
    JsonSoa = "JSON_SOA",
}

export enum QueryDialect {
    DataFusion = "DATA_FUSION",
}

export enum DataSchemaFormat {
    Parquet = "PARQUET",
    ParquetJson = "PARQUET_JSON",
}

export type DataQueryResult = {
    __typename?: "DataQueryResult";
    data: DataBatch;
    limit: Scalars["Int"];
    schema: DataSchema;
};

export type DataBatch = {
    __typename?: "DataBatch";
    content: Scalars["String"];
    format: DataBatchFormat;
    numRecords: Scalars["Int"];
};

export type DataSchema = {
    __typename?: "DataSchema";
    content: Scalars["String"];
    format: DataSchemaFormat;
};

export type Datasets = {
    __typename?: "Datasets";
    /** Returns datasets belonging to the specified account */
    byAccountId: DatasetConnection;
    /** Returns datasets belonging to the specified account */
    byAccountName: DatasetConnection;
    /** Returns dataset by its ID */
    byId?: Maybe<Dataset>;
    /** Returns dataset by its owner and name */
    byOwnerAndName?: Maybe<Dataset>;
};

export type DatasetsByAccountIdArgs = {
    accountId: Scalars["AccountID"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type DatasetsByAccountNameArgs = {
    accountName: Scalars["AccountName"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type DatasetsByIdArgs = {
    datasetId: Scalars["DatasetID"];
};

export type DatasetsByOwnerAndNameArgs = {
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
};

export type DatasetConnection = {
    __typename?: "DatasetConnection";
    edges: Array<DatasetEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<Dataset>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type DatasetEdge = {
    __typename?: "DatasetEdge";
    node: Dataset;
};

export type Dataset = {
    __typename?: "Dataset";
    /** Creation time of the first metadata block in the chain */
    createdAt: Scalars["DateTime"];
    /** Access to the data of the dataset */
    data: DatasetData;
    /** Unique identifier of the dataset */
    id: Scalars["DatasetID"];
    /** Returns the kind of a dataset (Root or Derivative) */
    kind: DatasetKind;
    /** Creation time of the most recent metadata block in the chain */
    lastUpdatedAt: Scalars["DateTime"];
    /** Access to the metadata of the dataset */
    metadata: DatasetMetadata;
    /**
     * Symbolic name of the dataset.
     * Name can change over the dataset's lifetime. For unique identifier use `id()`.
     */
    name: Scalars["DatasetName"];
    /** Returns the user or organization that owns this dataset */
    owner: Account;
};

export type DatasetData = {
    __typename?: "DatasetData";
    /** An estimated size of data on disk not accounting for replication or caching */
    estimatedSize: Scalars["Int"];
    /** Total number of records in this dataset */
    numRecordsTotal: Scalars["Int"];
    /**
     * Returns the specified number of the latest records in the dataset
     * This is equivalent to the SQL query: `SELECT * FROM dataset ORDER BY event_time DESC LIMIT N`
     */
    tail: DataQueryResult;
};

export type DatasetDataTailArgs = {
    dataFormat?: InputMaybe<DataBatchFormat>;
    limit?: InputMaybe<Scalars["Int"]>;
    schemaFormat?: InputMaybe<DataSchemaFormat>;
};

export enum DatasetKind {
    Derivative = "DERIVATIVE",
    Root = "ROOT",
}

export type DatasetMetadata = {
    __typename?: "DatasetMetadata";
    /** Access to the temporal metadata chain of the dataset */
    chain: MetadataChain;
    /** Current downstream dependencies of a dataset */
    currentDownstreamDependencies: Array<Dataset>;
    /** Current descriptive information about the dataset */
    currentInfo: SetInfo;
    /** Current license associated with the dataset */
    currentLicense?: Maybe<SetLicense>;
    /** Current readme file as discovered from attachments associated with the dataset */
    currentReadme?: Maybe<Scalars["String"]>;
    /** Latest data schema */
    currentSchema: DataSchema;
    /** Current source used by the root dataset */
    currentSource?: Maybe<SetPollingSource>;
    /** Current transformation used by the derivative dataset */
    currentTransform?: Maybe<SetTransform>;
    /** Current upstream dependencies of a dataset */
    currentUpstreamDependencies: Array<Dataset>;
    /** Last recorded watermark */
    currentWatermark?: Maybe<Scalars["DateTime"]>;
};

export type DatasetMetadataCurrentSchemaArgs = {
    format?: InputMaybe<DataSchemaFormat>;
};

export type MetadataChain = {
    __typename?: "MetadataChain";
    /** Returns a metadata block corresponding to the specified hash */
    blockByHash?: Maybe<MetadataBlockExtended>;
    /** Iterates all metadata blocks in the reverse chronological order */
    blocks: MetadataBlockConnection;
    /** Returns all named metadata block references */
    refs: Array<BlockRef>;
};

export type MetadataChainBlockByHashArgs = {
    hash: Scalars["Multihash"];
};

export type MetadataChainBlocksArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type MetadataBlockExtended = {
    __typename?: "MetadataBlockExtended";
    author: Account;
    blockHash: Scalars["Multihash"];
    event: MetadataEvent;
    prevBlockHash?: Maybe<Scalars["Multihash"]>;
    systemTime: Scalars["DateTime"];
};

export type MetadataEvent =
    | AddData
    | ExecuteQuery
    | Seed
    | SetAttachments
    | SetInfo
    | SetLicense
    | SetPollingSource
    | SetTransform
    | SetVocab
    | SetWatermark;

export type AddData = {
    __typename?: "AddData";
    inputCheckpoint?: Maybe<Scalars["Multihash"]>;
    outputCheckpoint?: Maybe<Checkpoint>;
    outputData: DataSlice;
    outputWatermark?: Maybe<Scalars["DateTime"]>;
};

export type Checkpoint = {
    __typename?: "Checkpoint";
    physicalHash: Scalars["Multihash"];
    size: Scalars["Int"];
};

export type DataSlice = {
    __typename?: "DataSlice";
    interval: OffsetInterval;
    logicalHash: Scalars["Multihash"];
    physicalHash: Scalars["Multihash"];
    size: Scalars["Int"];
};

export type OffsetInterval = {
    __typename?: "OffsetInterval";
    end: Scalars["Int"];
    start: Scalars["Int"];
};

export type ExecuteQuery = {
    __typename?: "ExecuteQuery";
    inputCheckpoint?: Maybe<Scalars["Multihash"]>;
    inputSlices: Array<InputSlice>;
    outputCheckpoint?: Maybe<Checkpoint>;
    outputData?: Maybe<DataSlice>;
    outputWatermark?: Maybe<Scalars["DateTime"]>;
};

export type InputSlice = {
    __typename?: "InputSlice";
    blockInterval?: Maybe<BlockInterval>;
    dataInterval?: Maybe<OffsetInterval>;
    datasetId: Scalars["DatasetID"];
};

export type BlockInterval = {
    __typename?: "BlockInterval";
    end: Scalars["Multihash"];
    start: Scalars["Multihash"];
};

export type Seed = {
    __typename?: "Seed";
    datasetId: Scalars["DatasetID"];
    datasetKind: DatasetKind;
};

export type SetAttachments = {
    __typename?: "SetAttachments";
    attachments: Attachments;
};

export type Attachments = AttachmentsEmbedded;

export type AttachmentsEmbedded = {
    __typename?: "AttachmentsEmbedded";
    items: Array<AttachmentEmbedded>;
};

export type AttachmentEmbedded = {
    __typename?: "AttachmentEmbedded";
    content: Scalars["String"];
    path: Scalars["String"];
};

export type SetInfo = {
    __typename?: "SetInfo";
    description?: Maybe<Scalars["String"]>;
    keywords?: Maybe<Array<Scalars["String"]>>;
};

export type SetLicense = {
    __typename?: "SetLicense";
    name: Scalars["String"];
    shortName: Scalars["String"];
    spdxId?: Maybe<Scalars["String"]>;
    websiteUrl: Scalars["String"];
};

export type SetPollingSource = {
    __typename?: "SetPollingSource";
    fetch: FetchStep;
    merge: MergeStrategy;
    prepare?: Maybe<Array<PrepStep>>;
    preprocess?: Maybe<Transform>;
    read: ReadStep;
};

export type FetchStep = FetchStepContainer | FetchStepFilesGlob | FetchStepUrl;

export type FetchStepContainer = {
    __typename?: "FetchStepContainer";
    args?: Maybe<Array<Scalars["String"]>>;
    command?: Maybe<Array<Scalars["String"]>>;
    env?: Maybe<Array<EnvVar>>;
    image: Scalars["String"];
};

export type EnvVar = {
    __typename?: "EnvVar";
    name: Scalars["String"];
    value?: Maybe<Scalars["String"]>;
};

export type FetchStepFilesGlob = {
    __typename?: "FetchStepFilesGlob";
    cache?: Maybe<SourceCaching>;
    eventTime?: Maybe<EventTimeSource>;
    order?: Maybe<SourceOrdering>;
    path: Scalars["String"];
};

export type SourceCaching = SourceCachingForever;

export type SourceCachingForever = {
    __typename?: "SourceCachingForever";
    dummy?: Maybe<Scalars["String"]>;
};

export type EventTimeSource =
    | EventTimeSourceFromMetadata
    | EventTimeSourceFromPath;

export type EventTimeSourceFromMetadata = {
    __typename?: "EventTimeSourceFromMetadata";
    dummy?: Maybe<Scalars["String"]>;
};

export type EventTimeSourceFromPath = {
    __typename?: "EventTimeSourceFromPath";
    pattern: Scalars["String"];
    timestampFormat?: Maybe<Scalars["String"]>;
};

export enum SourceOrdering {
    ByEventTime = "BY_EVENT_TIME",
    ByName = "BY_NAME",
}

export type FetchStepUrl = {
    __typename?: "FetchStepUrl";
    cache?: Maybe<SourceCaching>;
    eventTime?: Maybe<EventTimeSource>;
    url: Scalars["String"];
};

export type MergeStrategy =
    | MergeStrategyAppend
    | MergeStrategyLedger
    | MergeStrategySnapshot;

export type MergeStrategyAppend = {
    __typename?: "MergeStrategyAppend";
    dummy?: Maybe<Scalars["String"]>;
};

export type MergeStrategyLedger = {
    __typename?: "MergeStrategyLedger";
    primaryKey: Array<Scalars["String"]>;
};

export type MergeStrategySnapshot = {
    __typename?: "MergeStrategySnapshot";
    compareColumns?: Maybe<Array<Scalars["String"]>>;
    observationColumn?: Maybe<Scalars["String"]>;
    obsvAdded?: Maybe<Scalars["String"]>;
    obsvChanged?: Maybe<Scalars["String"]>;
    obsvRemoved?: Maybe<Scalars["String"]>;
    primaryKey: Array<Scalars["String"]>;
};

export type PrepStep = PrepStepDecompress | PrepStepPipe;

export type PrepStepDecompress = {
    __typename?: "PrepStepDecompress";
    format: CompressionFormat;
    subPath?: Maybe<Scalars["String"]>;
};

export enum CompressionFormat {
    Gzip = "GZIP",
    Zip = "ZIP",
}

export type PrepStepPipe = {
    __typename?: "PrepStepPipe";
    command: Array<Scalars["String"]>;
};

export type Transform = TransformSql;

export type TransformSql = {
    __typename?: "TransformSql";
    engine: Scalars["String"];
    queries: Array<SqlQueryStep>;
    temporalTables?: Maybe<Array<TemporalTable>>;
    version?: Maybe<Scalars["String"]>;
};

export type SqlQueryStep = {
    __typename?: "SqlQueryStep";
    alias?: Maybe<Scalars["String"]>;
    query: Scalars["String"];
};

export type TemporalTable = {
    __typename?: "TemporalTable";
    name: Scalars["String"];
    primaryKey: Array<Scalars["String"]>;
};

export type ReadStep =
    | ReadStepCsv
    | ReadStepEsriShapefile
    | ReadStepGeoJson
    | ReadStepJsonLines
    | ReadStepParquet;

export type ReadStepCsv = {
    __typename?: "ReadStepCsv";
    comment?: Maybe<Scalars["String"]>;
    dateFormat?: Maybe<Scalars["String"]>;
    emptyValue?: Maybe<Scalars["String"]>;
    encoding?: Maybe<Scalars["String"]>;
    enforceSchema?: Maybe<Scalars["Boolean"]>;
    escape?: Maybe<Scalars["String"]>;
    header?: Maybe<Scalars["Boolean"]>;
    ignoreLeadingWhiteSpace?: Maybe<Scalars["Boolean"]>;
    ignoreTrailingWhiteSpace?: Maybe<Scalars["Boolean"]>;
    inferSchema?: Maybe<Scalars["Boolean"]>;
    multiLine?: Maybe<Scalars["Boolean"]>;
    nanValue?: Maybe<Scalars["String"]>;
    negativeInf?: Maybe<Scalars["String"]>;
    nullValue?: Maybe<Scalars["String"]>;
    positiveInf?: Maybe<Scalars["String"]>;
    quote?: Maybe<Scalars["String"]>;
    schema?: Maybe<Array<Scalars["String"]>>;
    separator?: Maybe<Scalars["String"]>;
    timestampFormat?: Maybe<Scalars["String"]>;
};

export type ReadStepEsriShapefile = {
    __typename?: "ReadStepEsriShapefile";
    schema?: Maybe<Array<Scalars["String"]>>;
    subPath?: Maybe<Scalars["String"]>;
};

export type ReadStepGeoJson = {
    __typename?: "ReadStepGeoJson";
    schema?: Maybe<Array<Scalars["String"]>>;
};

export type ReadStepJsonLines = {
    __typename?: "ReadStepJsonLines";
    dateFormat?: Maybe<Scalars["String"]>;
    encoding?: Maybe<Scalars["String"]>;
    multiLine?: Maybe<Scalars["Boolean"]>;
    primitivesAsString?: Maybe<Scalars["Boolean"]>;
    schema?: Maybe<Array<Scalars["String"]>>;
    timestampFormat?: Maybe<Scalars["String"]>;
};

export type ReadStepParquet = {
    __typename?: "ReadStepParquet";
    schema?: Maybe<Array<Scalars["String"]>>;
};

export type SetTransform = {
    __typename?: "SetTransform";
    inputs: Array<TransformInput>;
    transform: Transform;
};

export type TransformInput = {
    __typename?: "TransformInput";
    dataset: Dataset;
    id?: Maybe<Scalars["DatasetID"]>;
    name: Scalars["DatasetName"];
};

export type SetVocab = {
    __typename?: "SetVocab";
    eventTimeColumn?: Maybe<Scalars["String"]>;
    offsetColumn?: Maybe<Scalars["String"]>;
    systemTimeColumn?: Maybe<Scalars["String"]>;
};

export type SetWatermark = {
    __typename?: "SetWatermark";
    outputWatermark: Scalars["DateTime"];
};

export type MetadataBlockConnection = {
    __typename?: "MetadataBlockConnection";
    edges: Array<MetadataBlockEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<MetadataBlockExtended>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type MetadataBlockEdge = {
    __typename?: "MetadataBlockEdge";
    node: MetadataBlockExtended;
};

export type PageBasedInfo = {
    __typename?: "PageBasedInfo";
    /** Index of the current page */
    currentPage: Scalars["Int"];
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars["Boolean"];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars["Boolean"];
    /** Approximate number of total pages assuming number of nodes per page stays the same */
    totalPages?: Maybe<Scalars["Int"]>;
};

export type BlockRef = {
    __typename?: "BlockRef";
    blockHash: Scalars["Multihash"];
    name: Scalars["String"];
};

export type Search = {
    __typename?: "Search";
    /** Perform search across all resources */
    query: SearchResultConnection;
};

export type SearchQueryArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
    query: Scalars["String"];
};

export type SearchResultConnection = {
    __typename?: "SearchResultConnection";
    edges: Array<SearchResultEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<SearchResult>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type SearchResultEdge = {
    __typename?: "SearchResultEdge";
    node: SearchResult;
};

export type SearchResult = Dataset;

export type Mutation = {
    __typename?: "Mutation";
    auth: Auth;
};

export type Auth = {
    __typename?: "Auth";
    accountInfo: AccountInfo;
    githubLogin: LoginResponse;
};

export type AuthAccountInfoArgs = {
    accessToken: Scalars["String"];
};

export type AuthGithubLoginArgs = {
    code: Scalars["String"];
};

export type AccountInfo = {
    __typename?: "AccountInfo";
    avatarUrl?: Maybe<Scalars["String"]>;
    email?: Maybe<Scalars["String"]>;
    gravatarId?: Maybe<Scalars["String"]>;
    login: Scalars["String"];
    name: Scalars["String"];
};

export type LoginResponse = {
    __typename?: "LoginResponse";
    accountInfo: AccountInfo;
    token: AccessToken;
};

export type AccessToken = {
    __typename?: "AccessToken";
    accessToken: Scalars["String"];
    scope: Scalars["String"];
    tokenType: Scalars["String"];
};

export type Organization = Account & {
    __typename?: "Organization";
    /** Unique and stable identitfier of this organization account */
    id: Scalars["AccountID"];
    /** Symbolic account name */
    name: Scalars["String"];
};

export type User = Account & {
    __typename?: "User";
    /** Unique and stable identitfier of this user account */
    id: Scalars["AccountID"];
    /** Symbolic account name */
    name: Scalars["String"];
};

export type AccountInfoMutationVariables = Exact<{
    accessToken: Scalars["String"];
}>;

export type AccountInfoMutation = {
    __typename?: "Mutation";
    auth: {
        __typename?: "Auth";
        accountInfo: {
            __typename?: "AccountInfo";
            login: string;
            name: string;
            email?: string | null | undefined;
            avatarUrl?: string | null | undefined;
            gravatarId?: string | null | undefined;
        };
    };
};

export type GetDatasetDataSchemaQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    numRecords?: InputMaybe<Scalars["Int"]>;
    numPage?: InputMaybe<Scalars["Int"]>;
}>;

export type GetDatasetDataSchemaQuery = {
    __typename?: "Query";
    datasets: {
        __typename: "Datasets";
        byId?:
        | {
            __typename: "Dataset";
            id: any;
            name: any;
            kind: DatasetKind;
            createdAt: any;
            lastUpdatedAt: any;
            owner:
            | { __typename?: "Organization"; id: any; name: string }
            | { __typename?: "User"; id: any; name: string };
            metadata: {
                __typename: "DatasetMetadata";
                currentWatermark?: any | null | undefined;
                currentSchema: {
                    __typename: "DataSchema";
                    format: DataSchemaFormat;
                    content: string;
                };
            };
            data: {
                __typename: "DatasetData";
                numRecordsTotal: number;
                estimatedSize: number;
                tail: {
                    __typename: "DataQueryResult";
                    limit: number;
                    schema: {
                        __typename?: "DataSchema";
                        format: DataSchemaFormat;
                        content: string;
                    };
                    data: {
                        __typename?: "DataBatch";
                        format: DataBatchFormat;
                        content: string;
                        numRecords: number;
                    };
                };
            };
        }
        | null
        | undefined;
    };
};

export type GetDatasetDataSqlRunQueryVariables = Exact<{
    query: Scalars["String"];
    limit: Scalars["Int"];
}>;

export type GetDatasetDataSqlRunQuery = {
    __typename?: "Query";
    data: {
        __typename?: "DataQueries";
        query: {
            __typename?: "DataQueryResult";
            limit: number;
            schema: {
                __typename?: "DataSchema";
                format: DataSchemaFormat;
                content: string;
            };
            data: {
                __typename?: "DataBatch";
                format: DataBatchFormat;
                content: string;
                numRecords: number;
            };
        };
    };
};

export type GetDatasetHistoryQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    perPage?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
}>;

export type GetDatasetHistoryQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
        | {
            __typename?: "Dataset";
            id: any;
            name: any;
            owner:
            | { __typename?: "Organization"; id: any; name: string }
            | { __typename?: "User"; id: any; name: string };
            metadata: {
                __typename?: "DatasetMetadata";
                chain: {
                    __typename?: "MetadataChain";
                    blocks: {
                        __typename?: "MetadataBlockConnection";
                        totalCount?: number | null | undefined;
                        nodes: Array<{
                            __typename?: "MetadataBlockExtended";
                            blockHash: any;
                            prevBlockHash?: any | null | undefined;
                            systemTime: any;
                            author:
                            | {
                                __typename: "Organization";
                                id: any;
                                name: string;
                            }
                            | {
                                __typename: "User";
                                id: any;
                                name: string;
                            };
                            event:
                            | {
                                __typename: "AddData";
                                addedOutputData: {
                                    __typename?: "DataSlice";
                                    logicalHash: any;
                                    physicalHash: any;
                                    interval: {
                                        __typename?: "OffsetInterval";
                                        start: number;
                                        end: number;
                                    };
                                };
                            }
                            | {
                                __typename: "ExecuteQuery";
                                queryOutputData?:
                                | {
                                    __typename?: "DataSlice";
                                    logicalHash: any;
                                    physicalHash: any;
                                    interval: {
                                        __typename?: "OffsetInterval";
                                        start: number;
                                        end: number;
                                    };
                                }
                                | null
                                | undefined;
                            }
                            | {
                                __typename: "Seed";
                                datasetId: any;
                                datasetKind: DatasetKind;
                            }
                            | { __typename: "SetAttachments" }
                            | { __typename: "SetInfo" }
                            | {
                                __typename: "SetLicense";
                                name: string;
                            }
                            | { __typename: "SetPollingSource" }
                            | { __typename: "SetTransform" }
                            | { __typename: "SetVocab" }
                            | {
                                __typename: "SetWatermark";
                                outputWatermark: any;
                            };
                        }>;
                        pageInfo: {
                            __typename?: "PageBasedInfo";
                            hasNextPage: boolean;
                            hasPreviousPage: boolean;
                            totalPages?: number | null | undefined;
                        };
                    };
                };
            };
        }
        | null
        | undefined;
    };
};

export type LineageDatasetInfoFragment = {
    __typename?: "Dataset";
    id: any;
    kind: DatasetKind;
    name: any;
    owner:
    | { __typename?: "Organization"; id: any; name: string }
    | { __typename?: "User"; id: any; name: string };
};

export type GetDatasetLineageQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type GetDatasetLineageQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
        | {
            __typename?: "Dataset";
            id: any;
            kind: DatasetKind;
            name: any;
            metadata: {
                __typename?: "DatasetMetadata";
                currentUpstreamDependencies: Array<{
                    __typename?: "Dataset";
                    id: any;
                    kind: DatasetKind;
                    name: any;
                    metadata: {
                        __typename?: "DatasetMetadata";
                        currentUpstreamDependencies: Array<{
                            __typename?: "Dataset";
                            id: any;
                            kind: DatasetKind;
                            name: any;
                            metadata: {
                                __typename?: "DatasetMetadata";
                                currentUpstreamDependencies: Array<{
                                    __typename?: "Dataset";
                                    id: any;
                                    kind: DatasetKind;
                                    name: any;
                                    metadata: {
                                        __typename?: "DatasetMetadata";
                                        currentUpstreamDependencies: Array<{
                                            __typename?: "Dataset";
                                            id: any;
                                            kind: DatasetKind;
                                            name: any;
                                            metadata: {
                                                __typename?: "DatasetMetadata";
                                                currentUpstreamDependencies: Array<{
                                                    __typename?: "Dataset";
                                                    id: any;
                                                    kind: DatasetKind;
                                                    name: any;
                                                    owner:
                                                    | {
                                                        __typename?: "Organization";
                                                        id: any;
                                                        name: string;
                                                    }
                                                    | {
                                                        __typename?: "User";
                                                        id: any;
                                                        name: string;
                                                    };
                                                }>;
                                            };
                                            owner:
                                            | {
                                                __typename?: "Organization";
                                                id: any;
                                                name: string;
                                            }
                                            | {
                                                __typename?: "User";
                                                id: any;
                                                name: string;
                                            };
                                        }>;
                                    };
                                    owner:
                                    | {
                                        __typename?: "Organization";
                                        id: any;
                                        name: string;
                                    }
                                    | {
                                        __typename?: "User";
                                        id: any;
                                        name: string;
                                    };
                                }>;
                            };
                            owner:
                            | {
                                __typename?: "Organization";
                                id: any;
                                name: string;
                            }
                            | {
                                __typename?: "User";
                                id: any;
                                name: string;
                            };
                        }>;
                    };
                    owner:
                    | {
                        __typename?: "Organization";
                        id: any;
                        name: string;
                    }
                    | { __typename?: "User"; id: any; name: string };
                }>;
                currentDownstreamDependencies: Array<{
                    __typename?: "Dataset";
                    id: any;
                    kind: DatasetKind;
                    name: any;
                    metadata: {
                        __typename?: "DatasetMetadata";
                        currentDownstreamDependencies: Array<{
                            __typename?: "Dataset";
                            id: any;
                            kind: DatasetKind;
                            name: any;
                            metadata: {
                                __typename?: "DatasetMetadata";
                                currentDownstreamDependencies: Array<{
                                    __typename?: "Dataset";
                                    id: any;
                                    kind: DatasetKind;
                                    name: any;
                                    metadata: {
                                        __typename?: "DatasetMetadata";
                                        currentDownstreamDependencies: Array<{
                                            __typename?: "Dataset";
                                            id: any;
                                            kind: DatasetKind;
                                            name: any;
                                            metadata: {
                                                __typename?: "DatasetMetadata";
                                                currentDownstreamDependencies: Array<{
                                                    __typename?: "Dataset";
                                                    id: any;
                                                    kind: DatasetKind;
                                                    name: any;
                                                    owner:
                                                    | {
                                                        __typename?: "Organization";
                                                        id: any;
                                                        name: string;
                                                    }
                                                    | {
                                                        __typename?: "User";
                                                        id: any;
                                                        name: string;
                                                    };
                                                }>;
                                            };
                                            owner:
                                            | {
                                                __typename?: "Organization";
                                                id: any;
                                                name: string;
                                            }
                                            | {
                                                __typename?: "User";
                                                id: any;
                                                name: string;
                                            };
                                        }>;
                                    };
                                    owner:
                                    | {
                                        __typename?: "Organization";
                                        id: any;
                                        name: string;
                                    }
                                    | {
                                        __typename?: "User";
                                        id: any;
                                        name: string;
                                    };
                                }>;
                            };
                            owner:
                            | {
                                __typename?: "Organization";
                                id: any;
                                name: string;
                            }
                            | {
                                __typename?: "User";
                                id: any;
                                name: string;
                            };
                        }>;
                    };
                    owner:
                    | {
                        __typename?: "Organization";
                        id: any;
                        name: string;
                    }
                    | { __typename?: "User"; id: any; name: string };
                }>;
            };
            owner:
            | { __typename?: "Organization"; id: any; name: string }
            | { __typename?: "User"; id: any; name: string };
        }
        | null
        | undefined;
    };
};

export type GetDatasetMetadataSchemaQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    numRecords?: InputMaybe<Scalars["Int"]>;
    numPage?: InputMaybe<Scalars["Int"]>;
}>;

export type GetDatasetMetadataSchemaQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
        | {
            __typename?: "Dataset";
            id: any;
            name: any;
            kind: DatasetKind;
            owner:
            | { __typename?: "Organization"; id: any; name: string }
            | { __typename?: "User"; id: any; name: string };
            metadata: {
                __typename?: "DatasetMetadata";
                chain: {
                    __typename?: "MetadataChain";
                    blocks: {
                        __typename?: "MetadataBlockConnection";
                        totalCount?: number | null | undefined;
                        nodes: Array<{
                            __typename?: "MetadataBlockExtended";
                            blockHash: any;
                            systemTime: any;
                        }>;
                        pageInfo: {
                            __typename?: "PageBasedInfo";
                            hasNextPage: boolean;
                            hasPreviousPage: boolean;
                            totalPages?: number | null | undefined;
                        };
                    };
                };
                currentSchema: {
                    __typename?: "DataSchema";
                    content: string;
                };
                currentTransform?:
                | {
                    __typename?: "SetTransform";
                    inputs: Array<{
                        __typename?: "TransformInput";
                        dataset: {
                            __typename?: "Dataset";
                            id: any;
                            name: any;
                            kind: DatasetKind;
                            owner:
                            | {
                                __typename?: "Organization";
                                id: any;
                                name: string;
                            }
                            | {
                                __typename?: "User";
                                id: any;
                                name: string;
                            };
                        };
                    }>;
                    transform: {
                        __typename?: "TransformSql";
                        queries: Array<{
                            __typename?: "SqlQueryStep";
                            alias?: string | null | undefined;
                            query: string;
                        }>;
                    };
                }
                | null
                | undefined;
                currentLicense?:
                | {
                    __typename?: "SetLicense";
                    shortName: string;
                    name: string;
                    spdxId?: string | null | undefined;
                    websiteUrl: string;
                }
                | null
                | undefined;
            };
        }
        | null
        | undefined;
    };
};

export type DatasetOverviewQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    limit?: InputMaybe<Scalars["Int"]>;
}>;

export type DatasetOverviewQuery = {
    __typename?: "Query";
    datasets: {
        __typename: "Datasets";
        byId?:
        | {
            __typename: "Dataset";
            id: any;
            name: any;
            kind: DatasetKind;
            createdAt: any;
            lastUpdatedAt: any;
            owner:
            | { __typename?: "Organization"; id: any; name: string }
            | { __typename?: "User"; id: any; name: string };
            metadata: {
                __typename: "DatasetMetadata";
                currentReadme?: string | null | undefined;
                currentWatermark?: any | null | undefined;
                currentInfo: {
                    __typename?: "SetInfo";
                    description?: string | null | undefined;
                    keywords?: Array<string> | null | undefined;
                };
                currentLicense?:
                | {
                    __typename?: "SetLicense";
                    shortName: string;
                    name: string;
                    spdxId?: string | null | undefined;
                    websiteUrl: string;
                }
                | null
                | undefined;
                currentSchema: {
                    __typename: "DataSchema";
                    format: DataSchemaFormat;
                    content: string;
                };
                chain: {
                    __typename?: "MetadataChain";
                    blocks: {
                        __typename?: "MetadataBlockConnection";
                        totalCount?: number | null | undefined;
                        nodes: Array<{
                            __typename?: "MetadataBlockExtended";
                            blockHash: any;
                            prevBlockHash?: any | null | undefined;
                            systemTime: any;
                            author:
                            | {
                                __typename: "Organization";
                                id: any;
                                name: string;
                            }
                            | {
                                __typename: "User";
                                id: any;
                                name: string;
                            };
                            event:
                            | {
                                __typename: "AddData";
                                addedOutputData: {
                                    __typename?: "DataSlice";
                                    logicalHash: any;
                                    physicalHash: any;
                                    interval: {
                                        __typename?: "OffsetInterval";
                                        start: number;
                                        end: number;
                                    };
                                };
                            }
                            | {
                                __typename: "ExecuteQuery";
                                queryOutputData?:
                                | {
                                    __typename?: "DataSlice";
                                    logicalHash: any;
                                    physicalHash: any;
                                    interval: {
                                        __typename?: "OffsetInterval";
                                        start: number;
                                        end: number;
                                    };
                                }
                                | null
                                | undefined;
                            }
                            | {
                                __typename: "Seed";
                                datasetId: any;
                                datasetKind: DatasetKind;
                            }
                            | { __typename: "SetAttachments" }
                            | { __typename: "SetInfo" }
                            | {
                                __typename: "SetLicense";
                                name: string;
                            }
                            | { __typename: "SetPollingSource" }
                            | { __typename: "SetTransform" }
                            | { __typename: "SetVocab" }
                            | {
                                __typename: "SetWatermark";
                                outputWatermark: any;
                            };
                        }>;
                    };
                };
            };
            data: {
                __typename: "DatasetData";
                numRecordsTotal: number;
                estimatedSize: number;
                tail: {
                    __typename: "DataQueryResult";
                    schema: {
                        __typename?: "DataSchema";
                        format: DataSchemaFormat;
                        content: string;
                    };
                    data: {
                        __typename?: "DataBatch";
                        format: DataBatchFormat;
                        content: string;
                    };
                };
            };
        }
        | null
        | undefined;
    };
};

export type LicenseFragment = {
    __typename?: "SetLicense";
    shortName: string;
    name: string;
    spdxId?: string | null | undefined;
    websiteUrl: string;
};

export type MetadataBlockFragment = {
    __typename?: "MetadataBlockExtended";
    blockHash: any;
    prevBlockHash?: any | null | undefined;
    systemTime: any;
    author:
    | { __typename: "Organization"; id: any; name: string }
    | { __typename: "User"; id: any; name: string };
    event:
    | {
        __typename: "AddData";
        addedOutputData: {
            __typename?: "DataSlice";
            logicalHash: any;
            physicalHash: any;
            interval: {
                __typename?: "OffsetInterval";
                start: number;
                end: number;
            };
        };
    }
    | {
        __typename: "ExecuteQuery";
        queryOutputData?:
        | {
            __typename?: "DataSlice";
            logicalHash: any;
            physicalHash: any;
            interval: {
                __typename?: "OffsetInterval";
                start: number;
                end: number;
            };
        }
        | null
        | undefined;
    }
    | { __typename: "Seed"; datasetId: any; datasetKind: DatasetKind }
    | { __typename: "SetAttachments" }
    | { __typename: "SetInfo" }
    | { __typename: "SetLicense"; name: string }
    | { __typename: "SetPollingSource" }
    | { __typename: "SetTransform" }
    | { __typename: "SetVocab" }
    | { __typename: "SetWatermark"; outputWatermark: any };
};

export type SearchDatasetsAutocompleteQueryVariables = Exact<{
    query: Scalars["String"];
    perPage?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
}>;

export type SearchDatasetsAutocompleteQuery = {
    __typename?: "Query";
    search: {
        __typename?: "Search";
        query: {
            __typename?: "SearchResultConnection";
            nodes: Array<{
                __typename: "Dataset";
                id: any;
                name: any;
                kind: DatasetKind;
            }>;
        };
    };
};

export type SearchDatasetsOverviewQueryVariables = Exact<{
    query: Scalars["String"];
    perPage?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
}>;

export type SearchDatasetsOverviewQuery = {
    __typename?: "Query";
    search: {
        __typename?: "Search";
        query: {
            __typename?: "SearchResultConnection";
            totalCount?: number | null | undefined;
            nodes: Array<{
                __typename: "Dataset";
                id: any;
                name: any;
                kind: DatasetKind;
                createdAt: any;
                lastUpdatedAt: any;
                owner:
                | { __typename?: "Organization"; id: any; name: string }
                | { __typename?: "User"; id: any; name: string };
                metadata: {
                    __typename?: "DatasetMetadata";
                    currentInfo: {
                        __typename?: "SetInfo";
                        description?: string | null | undefined;
                        keywords?: Array<string> | null | undefined;
                    };
                    currentLicense?:
                    | {
                        __typename?: "SetLicense";
                        shortName: string;
                        name: string;
                        spdxId?: string | null | undefined;
                        websiteUrl: string;
                    }
                    | null
                    | undefined;
                    currentDownstreamDependencies: Array<{
                        __typename?: "Dataset";
                        id: any;
                        kind: DatasetKind;
                    }>;
                };
            }>;
            pageInfo: {
                __typename?: "PageBasedInfo";
                hasNextPage: boolean;
                hasPreviousPage: boolean;
                currentPage: number;
                totalPages?: number | null | undefined;
            };
        };
    };
};

export const LineageDatasetInfoFragmentDoc = gql`
    fragment LineageDatasetInfo on Dataset {
        id
        kind
        name
        owner {
            id
            name
        }
    }
`;
export const LicenseFragmentDoc = gql`
    fragment License on SetLicense {
        shortName
        name
        spdxId
        websiteUrl
    }
`;
export const MetadataBlockFragmentDoc = gql`
    fragment MetadataBlock on MetadataBlockExtended {
        blockHash
        prevBlockHash
        systemTime
        author {
            __typename
            id
            name
        }
        event {
            __typename
            ... on Seed {
                datasetId
                datasetKind
            }
            ... on SetWatermark {
                outputWatermark
            }
            ... on SetTransform {
                __typename
            }
            ... on ExecuteQuery {
                queryOutputData: outputData {
                    interval {
                        start
                        end
                    }
                    logicalHash
                    physicalHash
                }
            }
            ... on AddData {
                addedOutputData: outputData {
                    interval {
                        start
                        end
                    }
                    logicalHash
                    physicalHash
                }
            }
            ... on SetAttachments {
                __typename
            }
            ... on SetInfo {
                __typename
            }
            ... on SetLicense {
                name
            }
        }
    }
`;
export const AccountInfoDocument = gql`
    mutation AccountInfo($accessToken: String!) {
        auth {
            accountInfo(accessToken: $accessToken) {
                login
                name
                email
                avatarUrl
                gravatarId
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class AccountInfoGQL extends Apollo.Mutation<
AccountInfoMutation,
AccountInfoMutationVariables
> {
    document = AccountInfoDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetDataSchemaDocument = gql`
    query getDatasetDataSchema(
        $datasetId: DatasetID!
        $numRecords: Int
        $numPage: Int
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                id
                owner {
                    id
                    name
                }
                name
                kind
                createdAt
                lastUpdatedAt
                metadata {
                    currentWatermark
                    currentSchema(format: PARQUET_JSON) {
                        format
                        content
                        __typename
                    }
                    __typename
                }
                data {
                    numRecordsTotal
                    estimatedSize
                    tail(limit: $numRecords, dataFormat: JSON) {
                        schema {
                            format
                            content
                        }
                        data {
                            format
                            content
                            numRecords
                        }
                        limit
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetDataSchemaGQL extends Apollo.Query<
GetDatasetDataSchemaQuery,
GetDatasetDataSchemaQueryVariables
> {
    document = GetDatasetDataSchemaDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetDataSqlRunDocument = gql`
    query getDatasetDataSQLRun($query: String!, $limit: Int!) {
        data {
            query(
                query: $query
                queryDialect: DATA_FUSION
                schemaFormat: PARQUET_JSON
                dataFormat: JSON
                limit: $limit
            ) {
                schema {
                    format
                    content
                }
                data {
                    format
                    content
                    numRecords
                }
                limit
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetDataSqlRunGQL extends Apollo.Query<
GetDatasetDataSqlRunQuery,
GetDatasetDataSqlRunQueryVariables
> {
    document = GetDatasetDataSqlRunDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetHistoryDocument = gql`
    query getDatasetHistory($datasetId: DatasetID!, $perPage: Int, $page: Int) {
        datasets {
            byId(datasetId: $datasetId) {
                id
                owner {
                    id
                    name
                }
                name
                metadata {
                    chain {
                        blocks(perPage: $perPage, page: $page) {
                            totalCount
                            nodes {
                                ...MetadataBlock
                            }
                            pageInfo {
                                hasNextPage
                                hasPreviousPage
                                totalPages
                            }
                        }
                    }
                }
            }
        }
    }
    ${MetadataBlockFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetHistoryGQL extends Apollo.Query<
GetDatasetHistoryQuery,
GetDatasetHistoryQueryVariables
> {
    document = GetDatasetHistoryDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetLineageDocument = gql`
    query getDatasetLineage($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                ...LineageDatasetInfo
                metadata {
                    currentUpstreamDependencies {
                        ...LineageDatasetInfo
                        metadata {
                            currentUpstreamDependencies {
                                ...LineageDatasetInfo
                                metadata {
                                    currentUpstreamDependencies {
                                        ...LineageDatasetInfo
                                        metadata {
                                            currentUpstreamDependencies {
                                                ...LineageDatasetInfo
                                                metadata {
                                                    currentUpstreamDependencies {
                                                        ...LineageDatasetInfo
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    currentDownstreamDependencies {
                        ...LineageDatasetInfo
                        metadata {
                            currentDownstreamDependencies {
                                ...LineageDatasetInfo
                                metadata {
                                    currentDownstreamDependencies {
                                        ...LineageDatasetInfo
                                        metadata {
                                            currentDownstreamDependencies {
                                                ...LineageDatasetInfo
                                                metadata {
                                                    currentDownstreamDependencies {
                                                        ...LineageDatasetInfo
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ${LineageDatasetInfoFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetLineageGQL extends Apollo.Query<
GetDatasetLineageQuery,
GetDatasetLineageQueryVariables
> {
    document = GetDatasetLineageDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetMetadataSchemaDocument = gql`
    query getDatasetMetadataSchema(
        $datasetId: DatasetID!
        $numRecords: Int
        $numPage: Int
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                id
                name
                kind
                owner {
                    id
                    name
                }
                metadata {
                    chain {
                        blocks(perPage: $numRecords, page: $numPage) {
                            totalCount
                            nodes {
                                blockHash
                                systemTime
                            }
                            pageInfo {
                                hasNextPage
                                hasPreviousPage
                                totalPages
                            }
                        }
                    }
                    currentSchema(format: PARQUET_JSON) {
                        content
                    }
                    currentTransform {
                        inputs {
                            dataset {
                                id
                                name
                                kind
                                owner {
                                    id
                                    name
                                }
                            }
                        }
                        transform {
                            ... on TransformSql {
                                queries {
                                    alias
                                    query
                                }
                            }
                        }
                    }
                    currentLicense {
                        ...License
                    }
                }
            }
        }
    }
    ${LicenseFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetMetadataSchemaGQL extends Apollo.Query<
GetDatasetMetadataSchemaQuery,
GetDatasetMetadataSchemaQueryVariables
> {
    document = GetDatasetMetadataSchemaDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetOverviewDocument = gql`
    query datasetOverview($datasetId: DatasetID!, $limit: Int) {
        datasets {
            byId(datasetId: $datasetId) {
                id
                owner {
                    id
                    name
                }
                name
                kind
                createdAt
                lastUpdatedAt
                metadata {
                    currentInfo {
                        description
                        keywords
                    }
                    currentLicense {
                        ...License
                    }
                    currentReadme
                    currentWatermark
                    currentSchema(format: PARQUET_JSON) {
                        format
                        content
                        __typename
                    }
                    __typename
                    chain {
                        blocks(page: 0, perPage: 1) {
                            nodes {
                                ...MetadataBlock
                            }
                            totalCount
                        }
                    }
                }
                data {
                    numRecordsTotal
                    estimatedSize
                    tail(limit: $limit, dataFormat: JSON) {
                        schema {
                            format
                            content
                        }
                        data {
                            format
                            content
                        }
                        __typename
                    }
                    __typename
                }
                __typename
            }
            __typename
        }
    }
    ${LicenseFragmentDoc}
    ${MetadataBlockFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetOverviewGQL extends Apollo.Query<
DatasetOverviewQuery,
DatasetOverviewQueryVariables
> {
    document = DatasetOverviewDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SearchDatasetsAutocompleteDocument = gql`
    query searchDatasetsAutocomplete(
        $query: String!
        $perPage: Int
        $page: Int
    ) {
        search {
            query(query: $query, perPage: $perPage, page: $page) {
                nodes {
                    __typename
                    ... on Dataset {
                        id
                        name
                        kind
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class SearchDatasetsAutocompleteGQL extends Apollo.Query<
SearchDatasetsAutocompleteQuery,
SearchDatasetsAutocompleteQueryVariables
> {
    document = SearchDatasetsAutocompleteDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SearchDatasetsOverviewDocument = gql`
    query searchDatasetsOverview($query: String!, $perPage: Int, $page: Int) {
        search {
            query(query: $query, perPage: $perPage, page: $page) {
                nodes {
                    __typename
                    ... on Dataset {
                        id
                        name
                        owner {
                            id
                            name
                        }
                        kind
                        metadata {
                            currentInfo {
                                description
                                keywords
                            }
                            currentLicense {
                                ...License
                            }
                            currentDownstreamDependencies {
                                id
                                kind
                            }
                        }
                        createdAt
                        lastUpdatedAt
                        __typename
                    }
                }
                totalCount
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                    currentPage
                    totalPages
                }
            }
        }
    }
    ${LicenseFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class SearchDatasetsOverviewGQL extends Apollo.Query<
SearchDatasetsOverviewQuery,
SearchDatasetsOverviewQueryVariables
> {
    document = SearchDatasetsOverviewDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
