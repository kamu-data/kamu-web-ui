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
    AccountName: any;
    DatasetID: any;
    DatasetName: any;
    /**
     * Implement the DateTime<Utc> scalar
     *
     * The input/output is a string in RFC3339 format.
     */
    DateTime: any;
    Multihash: any;
};

export type AccessToken = {
    __typename?: "AccessToken";
    accessToken: Scalars["String"];
    scope: Scalars["String"];
    tokenType: Scalars["String"];
};

export type Account = {
    id: Scalars["AccountID"];
    name: Scalars["String"];
};

export type AccountInfo = {
    __typename?: "AccountInfo";
    avatarUrl?: Maybe<Scalars["String"]>;
    email?: Maybe<Scalars["String"]>;
    gravatarId?: Maybe<Scalars["String"]>;
    login: Scalars["String"];
    name: Scalars["String"];
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

export type AddData = {
    __typename?: "AddData";
    inputCheckpoint?: Maybe<Scalars["Multihash"]>;
    outputCheckpoint?: Maybe<Checkpoint>;
    outputData: DataSlice;
    outputWatermark?: Maybe<Scalars["DateTime"]>;
};

export type AttachmentEmbedded = {
    __typename?: "AttachmentEmbedded";
    content: Scalars["String"];
    path: Scalars["String"];
};

export type Attachments = AttachmentsEmbedded;

export type AttachmentsEmbedded = {
    __typename?: "AttachmentsEmbedded";
    items: Array<AttachmentEmbedded>;
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

export type BlockInterval = {
    __typename?: "BlockInterval";
    end: Scalars["Multihash"];
    start: Scalars["Multihash"];
};

export type BlockRef = {
    __typename?: "BlockRef";
    blockHash: Scalars["Multihash"];
    name: Scalars["String"];
};

export type Checkpoint = {
    __typename?: "Checkpoint";
    physicalHash: Scalars["Multihash"];
    size: Scalars["Int"];
};

export enum CompressionFormat {
    Gzip = "GZIP",
    Zip = "ZIP",
}

export type DataBatch = {
    __typename?: "DataBatch";
    content: Scalars["String"];
    format: DataBatchFormat;
    numRecords: Scalars["Int"];
};

export enum DataBatchFormat {
    Csv = "CSV",
    Json = "JSON",
    JsonLd = "JSON_LD",
    JsonSoa = "JSON_SOA",
}

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

export type DataQueryResult = DataQueryResultError | DataQueryResultSuccess;

export type DataQueryResultError = {
    __typename?: "DataQueryResultError";
    errorKind: DataQueryResultErrorKind;
    errorMessage: Scalars["String"];
};

export enum DataQueryResultErrorKind {
    InternalError = "INTERNAL_ERROR",
    InvalidSql = "INVALID_SQL",
}

export type DataQueryResultSuccess = {
    __typename?: "DataQueryResultSuccess";
    data: DataBatch;
    limit: Scalars["Int"];
    schema: DataSchema;
};

export type DataSchema = {
    __typename?: "DataSchema";
    content: Scalars["String"];
    format: DataSchemaFormat;
};

export enum DataSchemaFormat {
    Parquet = "PARQUET",
    ParquetJson = "PARQUET_JSON",
}

export type DataSlice = {
    __typename?: "DataSlice";
    interval: OffsetInterval;
    logicalHash: Scalars["Multihash"];
    physicalHash: Scalars["Multihash"];
    size: Scalars["Int"];
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

export type DatasetConnection = {
    __typename?: "DatasetConnection";
    edges: Array<DatasetEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<Dataset>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
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

export type DatasetEdge = {
    __typename?: "DatasetEdge";
    node: Dataset;
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

export type EnvVar = {
    __typename?: "EnvVar";
    name: Scalars["String"];
    value?: Maybe<Scalars["String"]>;
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

export type ExecuteQuery = {
    __typename?: "ExecuteQuery";
    inputCheckpoint?: Maybe<Scalars["Multihash"]>;
    inputSlices: Array<InputSlice>;
    outputCheckpoint?: Maybe<Checkpoint>;
    outputData?: Maybe<DataSlice>;
    outputWatermark?: Maybe<Scalars["DateTime"]>;
};

export type FetchStep = FetchStepContainer | FetchStepFilesGlob | FetchStepUrl;

export type FetchStepContainer = {
    __typename?: "FetchStepContainer";
    args?: Maybe<Array<Scalars["String"]>>;
    command?: Maybe<Array<Scalars["String"]>>;
    env?: Maybe<Array<EnvVar>>;
    image: Scalars["String"];
};

export type FetchStepFilesGlob = {
    __typename?: "FetchStepFilesGlob";
    cache?: Maybe<SourceCaching>;
    eventTime?: Maybe<EventTimeSource>;
    order?: Maybe<SourceOrdering>;
    path: Scalars["String"];
};

export type FetchStepUrl = {
    __typename?: "FetchStepUrl";
    cache?: Maybe<SourceCaching>;
    eventTime?: Maybe<EventTimeSource>;
    headers?: Maybe<Array<RequestHeader>>;
    url: Scalars["String"];
};

export type InputSlice = {
    __typename?: "InputSlice";
    blockInterval?: Maybe<BlockInterval>;
    dataInterval?: Maybe<OffsetInterval>;
    datasetId: Scalars["DatasetID"];
};

export type LoginResponse = {
    __typename?: "LoginResponse";
    accountInfo: AccountInfo;
    token: AccessToken;
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

export type MetadataBlockConnection = {
    __typename?: "MetadataBlockConnection";
    edges: Array<MetadataBlockEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<MetadataBlockExtended>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type MetadataBlockEdge = {
    __typename?: "MetadataBlockEdge";
    node: MetadataBlockExtended;
};

export type MetadataBlockExtended = {
    __typename?: "MetadataBlockExtended";
    author: Account;
    blockHash: Scalars["Multihash"];
    event: MetadataEvent;
    prevBlockHash?: Maybe<Scalars["Multihash"]>;
    sequenceNumber: Scalars["Int"];
    systemTime: Scalars["DateTime"];
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

export type Mutation = {
    __typename?: "Mutation";
    auth: Auth;
};

export type OffsetInterval = {
    __typename?: "OffsetInterval";
    end: Scalars["Int"];
    start: Scalars["Int"];
};

export type Organization = Account & {
    __typename?: "Organization";
    /** Unique and stable identitfier of this organization account */
    id: Scalars["AccountID"];
    /** Symbolic account name */
    name: Scalars["String"];
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

export type PrepStep = PrepStepDecompress | PrepStepPipe;

export type PrepStepDecompress = {
    __typename?: "PrepStepDecompress";
    format: CompressionFormat;
    subPath?: Maybe<Scalars["String"]>;
};

export type PrepStepPipe = {
    __typename?: "PrepStepPipe";
    command: Array<Scalars["String"]>;
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

export enum QueryDialect {
    DataFusion = "DATA_FUSION",
}

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

export type RequestHeader = {
    __typename?: "RequestHeader";
    name: Scalars["String"];
    value: Scalars["String"];
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

export type SearchResult = Dataset;

export type SearchResultConnection = {
    __typename?: "SearchResultConnection";
    edges: Array<SearchResultEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<SearchResult>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type SearchResultEdge = {
    __typename?: "SearchResultEdge";
    node: SearchResult;
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

export type SetTransform = {
    __typename?: "SetTransform";
    inputs: Array<TransformInput>;
    transform: Transform;
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

export type SourceCaching = SourceCachingForever;

export type SourceCachingForever = {
    __typename?: "SourceCachingForever";
    dummy?: Maybe<Scalars["String"]>;
};

export enum SourceOrdering {
    ByEventTime = "BY_EVENT_TIME",
    ByName = "BY_NAME",
}

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

export type Transform = TransformSql;

export type TransformInput = {
    __typename?: "TransformInput";
    dataset: Dataset;
    id?: Maybe<Scalars["DatasetID"]>;
    name: Scalars["DatasetName"];
};

export type TransformSql = {
    __typename?: "TransformSql";
    engine: Scalars["String"];
    queries: Array<SqlQueryStep>;
    temporalTables?: Maybe<Array<TemporalTable>>;
    version?: Maybe<Scalars["String"]>;
};

export type User = Account & {
    __typename?: "User";
    /** Unique and stable identitfier of this user account */
    id: Scalars["AccountID"];
    /** Symbolic account name */
    name: Scalars["String"];
};

export type DatasetByIdQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetByIdQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: ({ __typename?: "Dataset" } & DatasetBasicsFragment) | null;
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
        query:
            | {
                  __typename: "DataQueryResultError";
                  errorMessage: string;
                  errorKind: DataQueryResultErrorKind;
              }
            | ({
                  __typename: "DataQueryResultSuccess";
                  limit: number;
              } & DataQueryResultSuccessViewFragment);
    };
};

export type GetDatasetHistoryQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
    perPage?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
}>;

export type GetDatasetHistoryQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?:
            | ({
                  __typename?: "Dataset";
                  metadata: {
                      __typename?: "DatasetMetadata";
                      chain: {
                          __typename?: "MetadataChain";
                          blocks: {
                              __typename?: "MetadataBlockConnection";
                              totalCount: number;
                              nodes: Array<
                                  {
                                      __typename?: "MetadataBlockExtended";
                                  } & MetadataBlockFragment
                              >;
                              pageInfo: {
                                  __typename?: "PageBasedInfo";
                              } & DatasetPageInfoFragment;
                          };
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type GetDatasetMainDataQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
    limit?: InputMaybe<Scalars["Int"]>;
}>;

export type GetDatasetMainDataQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?:
            | ({ __typename?: "Dataset" } & DatasetBasicsFragment &
                  DatasetOverviewFragment &
                  DatasetDataFragment &
                  DatasetMetadataSummaryFragment &
                  DatasetLineageFragment)
            | null;
    };
};

export type DatasetsByAccountNameQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    perPage?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
}>;

export type DatasetsByAccountNameQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byAccountName: {
            __typename?: "DatasetConnection";
            totalCount: number;
            nodes: Array<
                { __typename: "Dataset" } & DatasetSearchOverviewFragment
            >;
            pageInfo: {
                __typename?: "PageBasedInfo";
            } & DatasetPageInfoFragment;
        };
    };
};

export type AddDataEventFragment = {
    __typename?: "AddData";
    inputCheckpoint?: any | null;
    addDataWatermark?: any | null;
    outputData: {
        __typename?: "DataSlice";
        logicalHash: any;
        physicalHash: any;
        size: number;
        interval: { __typename?: "OffsetInterval"; start: number; end: number };
    };
    outputCheckpoint?: {
        __typename?: "Checkpoint";
        physicalHash: any;
        size: number;
    } | null;
};

export type ExecuteQueryEventFragment = {
    __typename?: "ExecuteQuery";
    inputCheckpoint?: any | null;
    watermark?: any | null;
    queryOutputData?: {
        __typename?: "DataSlice";
        logicalHash: any;
        physicalHash: any;
        interval: { __typename?: "OffsetInterval"; start: number; end: number };
    } | null;
    inputSlices: Array<{
        __typename?: "InputSlice";
        datasetId: any;
        blockInterval?: {
            __typename?: "BlockInterval";
            start: any;
            end: any;
        } | null;
        dataInterval?: {
            __typename?: "OffsetInterval";
            start: number;
            end: number;
        } | null;
    }>;
    outputCheckpoint?: {
        __typename?: "Checkpoint";
        physicalHash: any;
        size: number;
    } | null;
};

export type SetPollingSourceEventFragment = {
    __typename?: "SetPollingSource";
    fetch:
        | {
              __typename?: "FetchStepContainer";
              image: string;
              command?: Array<string> | null;
              args?: Array<string> | null;
              env?: Array<{
                  __typename?: "EnvVar";
                  name: string;
                  value?: string | null;
              }> | null;
          }
        | {
              __typename?: "FetchStepFilesGlob";
              path: string;
              order?: SourceOrdering | null;
              eventTime?:
                  | { __typename: "EventTimeSourceFromMetadata" }
                  | {
                        __typename?: "EventTimeSourceFromPath";
                        pattern: string;
                        timestampFormat?: string | null;
                    }
                  | null;
              cache?: { __typename: "SourceCachingForever" } | null;
          }
        | {
              __typename?: "FetchStepUrl";
              url: string;
              eventTime?:
                  | { __typename: "EventTimeSourceFromMetadata" }
                  | {
                        __typename?: "EventTimeSourceFromPath";
                        pattern: string;
                        timestampFormat?: string | null;
                    }
                  | null;
          };
    read:
        | {
              __typename?: "ReadStepCsv";
              schema?: Array<string> | null;
              separator?: string | null;
              encoding?: string | null;
              quote?: string | null;
              escape?: string | null;
              comment?: string | null;
              header?: boolean | null;
              enforceSchema?: boolean | null;
              inferSchema?: boolean | null;
              ignoreLeadingWhiteSpace?: boolean | null;
              ignoreTrailingWhiteSpace?: boolean | null;
              nullValue?: string | null;
              emptyValue?: string | null;
              nanValue?: string | null;
              positiveInf?: string | null;
              negativeInf?: string | null;
              dateFormat?: string | null;
              timestampFormat?: string | null;
              multiLine?: boolean | null;
          }
        | {
              __typename?: "ReadStepEsriShapefile";
              schema?: Array<string> | null;
              subPath?: string | null;
          }
        | { __typename?: "ReadStepGeoJson"; schema?: Array<string> | null }
        | {
              __typename?: "ReadStepJsonLines";
              schema?: Array<string> | null;
              dateFormat?: string | null;
              encoding?: string | null;
              multiLine?: boolean | null;
              primitivesAsString?: boolean | null;
              timestampFormat?: string | null;
          }
        | { __typename?: "ReadStepParquet"; schema?: Array<string> | null };
    merge:
        | { __typename: "MergeStrategyAppend" }
        | { __typename?: "MergeStrategyLedger"; primaryKey: Array<string> }
        | {
              __typename?: "MergeStrategySnapshot";
              primaryKey: Array<string>;
              compareColumns?: Array<string> | null;
              observationColumn?: string | null;
              obsvAdded?: string | null;
              obsvChanged?: string | null;
              obsvRemoved?: string | null;
          };
    prepare?: Array<
        | {
              __typename?: "PrepStepDecompress";
              format: CompressionFormat;
              subPath?: string | null;
          }
        | { __typename?: "PrepStepPipe"; command: Array<string> }
    > | null;
    preprocess?: {
        __typename?: "TransformSql";
        engine: string;
        version?: string | null;
        queries: Array<{
            __typename?: "SqlQueryStep";
            query: string;
            alias?: string | null;
        }>;
        temporalTables?: Array<{
            __typename?: "TemporalTable";
            name: string;
            primaryKey: Array<string>;
        }> | null;
    } | null;
};

export type AccountDetailsFragment = {
    __typename?: "AccountInfo";
    login: string;
    name: string;
    email?: string | null;
    avatarUrl?: string | null;
    gravatarId?: string | null;
};

export type DataQueryResultSuccessViewFragment = {
    __typename?: "DataQueryResultSuccess";
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

export type DatasetBasicsFragment = {
    __typename?: "Dataset";
    id: any;
    kind: DatasetKind;
    name: any;
    owner:
        | { __typename?: "Organization"; id: any; name: string }
        | { __typename?: "User"; id: any; name: string };
};

export type DatasetCurrentInfoFragment = {
    __typename?: "SetInfo";
    description?: string | null;
    keywords?: Array<string> | null;
};

export type DatasetDataSizeFragment = {
    __typename?: "DatasetData";
    numRecordsTotal: number;
    estimatedSize: number;
};

export type DatasetDataFragment = {
    __typename?: "Dataset";
    data: {
        __typename: "DatasetData";
        tail:
            | {
                  __typename: "DataQueryResultError";
                  errorMessage: string;
                  errorKind: DataQueryResultErrorKind;
              }
            | ({
                  __typename: "DataQueryResultSuccess";
              } & DataQueryResultSuccessViewFragment);
    } & DatasetDataSizeFragment;
};

export type DatasetDescriptionFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        currentInfo: { __typename?: "SetInfo" } & DatasetCurrentInfoFragment;
        currentLicense?:
            | ({ __typename?: "SetLicense" } & LicenseFragment)
            | null;
    };
};

export type DatasetDetailsFragment = {
    __typename?: "Dataset";
    kind: DatasetKind;
    createdAt: any;
    lastUpdatedAt: any;
    data: {
        __typename?: "DatasetData";
        estimatedSize: number;
        numRecordsTotal: number;
    };
    metadata: {
        __typename?: "DatasetMetadata";
        currentWatermark?: any | null;
        currentLicense?:
            | ({ __typename?: "SetLicense" } & LicenseFragment)
            | null;
    };
};

export type DatasetLastUpdateFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        chain: {
            __typename?: "MetadataChain";
            blocks: {
                __typename?: "MetadataBlockConnection";
                totalCount: number;
                nodes: Array<
                    {
                        __typename?: "MetadataBlockExtended";
                    } & MetadataBlockFragment
                >;
                pageInfo: {
                    __typename?: "PageBasedInfo";
                } & DatasetPageInfoFragment;
            };
        };
    };
};

export type DatasetLineageFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        currentUpstreamDependencies: Array<
            {
                __typename?: "Dataset";
                metadata: {
                    __typename?: "DatasetMetadata";
                    currentUpstreamDependencies: Array<
                        {
                            __typename?: "Dataset";
                            metadata: {
                                __typename?: "DatasetMetadata";
                                currentUpstreamDependencies: Array<
                                    {
                                        __typename?: "Dataset";
                                        metadata: {
                                            __typename?: "DatasetMetadata";
                                            currentUpstreamDependencies: Array<
                                                {
                                                    __typename?: "Dataset";
                                                    metadata: {
                                                        __typename?: "DatasetMetadata";
                                                        currentUpstreamDependencies: Array<
                                                            {
                                                                __typename?: "Dataset";
                                                            } & DatasetBasicsFragment
                                                        >;
                                                    };
                                                } & DatasetBasicsFragment
                                            >;
                                        };
                                    } & DatasetBasicsFragment
                                >;
                            };
                        } & DatasetBasicsFragment
                    >;
                };
            } & DatasetBasicsFragment
        >;
        currentDownstreamDependencies: Array<
            {
                __typename?: "Dataset";
                metadata: {
                    __typename?: "DatasetMetadata";
                    currentDownstreamDependencies: Array<
                        {
                            __typename?: "Dataset";
                            metadata: {
                                __typename?: "DatasetMetadata";
                                currentDownstreamDependencies: Array<
                                    {
                                        __typename?: "Dataset";
                                        metadata: {
                                            __typename?: "DatasetMetadata";
                                            currentDownstreamDependencies: Array<
                                                {
                                                    __typename?: "Dataset";
                                                    metadata: {
                                                        __typename?: "DatasetMetadata";
                                                        currentDownstreamDependencies: Array<
                                                            {
                                                                __typename?: "Dataset";
                                                            } & DatasetBasicsFragment
                                                        >;
                                                    };
                                                } & DatasetBasicsFragment
                                            >;
                                        };
                                    } & DatasetBasicsFragment
                                >;
                            };
                        } & DatasetBasicsFragment
                    >;
                };
            } & DatasetBasicsFragment
        >;
    };
};

export type DatasetMetadataSummaryFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename: "DatasetMetadata";
        currentWatermark?: any | null;
        currentInfo: { __typename?: "SetInfo" } & DatasetCurrentInfoFragment;
        currentLicense?:
            | ({ __typename?: "SetLicense" } & LicenseFragment)
            | null;
        currentTransform?:
            | ({ __typename?: "SetTransform" } & DatasetTransformFragment)
            | null;
        currentSchema: {
            __typename: "DataSchema";
            format: DataSchemaFormat;
            content: string;
        };
    };
} & DatasetReadmeFragment &
    DatasetLastUpdateFragment;

export type DatasetOverviewFragment = {
    __typename?: "Dataset";
} & DatasetDescriptionFragment &
    DatasetDetailsFragment &
    DatasetReadmeFragment &
    DatasetLastUpdateFragment;

export type DatasetPageInfoFragment = {
    __typename?: "PageBasedInfo";
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    currentPage: number;
    totalPages?: number | null;
};

export type DatasetReadmeFragment = {
    __typename?: "Dataset";
    metadata: { __typename?: "DatasetMetadata"; currentReadme?: string | null };
};

export type DatasetSearchOverviewFragment = {
    __typename?: "Dataset";
    createdAt: any;
    lastUpdatedAt: any;
    metadata: {
        __typename?: "DatasetMetadata";
        currentInfo: { __typename?: "SetInfo" } & DatasetCurrentInfoFragment;
        currentLicense?:
            | ({ __typename?: "SetLicense" } & LicenseFragment)
            | null;
        currentDownstreamDependencies: Array<{
            __typename?: "Dataset";
            id: any;
            kind: DatasetKind;
        }>;
    };
} & DatasetBasicsFragment;

export type DatasetTransformContentFragment = {
    __typename?: "TransformSql";
    engine: string;
    version?: string | null;
    queries: Array<{
        __typename?: "SqlQueryStep";
        alias?: string | null;
        query: string;
    }>;
    temporalTables?: Array<{
        __typename?: "TemporalTable";
        name: string;
        primaryKey: Array<string>;
    }> | null;
};

export type DatasetTransformFragment = {
    __typename?: "SetTransform";
    inputs: Array<{
        __typename?: "TransformInput";
        dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
    }>;
    transform: {
        __typename?: "TransformSql";
    } & DatasetTransformContentFragment;
};

export type LicenseFragment = {
    __typename?: "SetLicense";
    shortName: string;
    name: string;
    spdxId?: string | null;
    websiteUrl: string;
};

export type MetadataBlockFragment = {
    __typename?: "MetadataBlockExtended";
    blockHash: any;
    prevBlockHash?: any | null;
    systemTime: any;
    sequenceNumber: number;
    author:
        | { __typename: "Organization"; id: any; name: string }
        | { __typename: "User"; id: any; name: string };
    event:
        | ({ __typename: "AddData" } & AddDataEventFragment)
        | ({ __typename: "ExecuteQuery" } & ExecuteQueryEventFragment)
        | { __typename: "Seed"; datasetId: any; datasetKind: DatasetKind }
        | { __typename: "SetAttachments" }
        | { __typename: "SetInfo" }
        | { __typename: "SetLicense"; name: string }
        | ({ __typename: "SetPollingSource" } & SetPollingSourceEventFragment)
        | ({ __typename: "SetTransform" } & DatasetTransformFragment)
        | { __typename: "SetVocab" }
        | { __typename: "SetWatermark"; outputWatermark: any };
};

export type GithubLoginMutationVariables = Exact<{
    code: Scalars["String"];
}>;

export type GithubLoginMutation = {
    __typename?: "Mutation";
    auth: {
        __typename?: "Auth";
        githubLogin: {
            __typename?: "LoginResponse";
            token: {
                __typename?: "AccessToken";
                accessToken: string;
                scope: string;
                tokenType: string;
            };
            accountInfo: {
                __typename?: "AccountInfo";
            } & AccountDetailsFragment;
        };
    };
};

export type FetchAccountInfoMutationVariables = Exact<{
    accessToken: Scalars["String"];
}>;

export type FetchAccountInfoMutation = {
    __typename?: "Mutation";
    auth: {
        __typename?: "Auth";
        accountInfo: { __typename?: "AccountInfo" } & AccountDetailsFragment;
    };
};

export type GetMetadataBlockQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
    blockHash: Scalars["Multihash"];
}>;

export type GetMetadataBlockQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?: {
            __typename?: "Dataset";
            metadata: {
                __typename?: "DatasetMetadata";
                chain: {
                    __typename?: "MetadataChain";
                    blockByHash?:
                        | ({
                              __typename?: "MetadataBlockExtended";
                          } & MetadataBlockFragment)
                        | null;
                };
            };
        } | null;
    };
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
            nodes: Array<{ __typename: "Dataset" } & DatasetBasicsFragment>;
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
            totalCount: number;
            nodes: Array<
                { __typename: "Dataset" } & DatasetSearchOverviewFragment
            >;
            pageInfo: {
                __typename?: "PageBasedInfo";
            } & DatasetPageInfoFragment;
        };
    };
};

export const AccountDetailsFragmentDoc = gql`
    fragment AccountDetails on AccountInfo {
        login
        name
        email
        avatarUrl
        gravatarId
    }
`;
export const DatasetDataSizeFragmentDoc = gql`
    fragment DatasetDataSize on DatasetData {
        numRecordsTotal
        estimatedSize
    }
`;
export const DataQueryResultSuccessViewFragmentDoc = gql`
    fragment DataQueryResultSuccessView on DataQueryResultSuccess {
        schema {
            format
            content
        }
        data {
            format
            content
        }
    }
`;
export const DatasetDataFragmentDoc = gql`
    fragment DatasetData on Dataset {
        data {
            ...DatasetDataSize
            tail(limit: $limit, dataFormat: JSON) {
                __typename
                ... on DataQueryResultSuccess {
                    ...DataQueryResultSuccessView
                }
                ... on DataQueryResultError {
                    errorMessage
                    errorKind
                }
            }
            __typename
        }
    }
    ${DatasetDataSizeFragmentDoc}
    ${DataQueryResultSuccessViewFragmentDoc}
`;
export const DatasetBasicsFragmentDoc = gql`
    fragment DatasetBasics on Dataset {
        id
        kind
        name
        owner {
            id
            name
        }
    }
`;
export const DatasetLineageFragmentDoc = gql`
    fragment DatasetLineage on Dataset {
        metadata {
            currentUpstreamDependencies {
                ...DatasetBasics
                metadata {
                    currentUpstreamDependencies {
                        ...DatasetBasics
                        metadata {
                            currentUpstreamDependencies {
                                ...DatasetBasics
                                metadata {
                                    currentUpstreamDependencies {
                                        ...DatasetBasics
                                        metadata {
                                            currentUpstreamDependencies {
                                                ...DatasetBasics
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
                ...DatasetBasics
                metadata {
                    currentDownstreamDependencies {
                        ...DatasetBasics
                        metadata {
                            currentDownstreamDependencies {
                                ...DatasetBasics
                                metadata {
                                    currentDownstreamDependencies {
                                        ...DatasetBasics
                                        metadata {
                                            currentDownstreamDependencies {
                                                ...DatasetBasics
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
    ${DatasetBasicsFragmentDoc}
`;
export const DatasetCurrentInfoFragmentDoc = gql`
    fragment DatasetCurrentInfo on SetInfo {
        description
        keywords
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
export const DatasetTransformContentFragmentDoc = gql`
    fragment DatasetTransformContent on TransformSql {
        engine
        version
        queries {
            alias
            query
        }
        temporalTables {
            name
            primaryKey
        }
    }
`;
export const DatasetTransformFragmentDoc = gql`
    fragment DatasetTransform on SetTransform {
        inputs {
            dataset {
                ...DatasetBasics
            }
        }
        transform {
            ...DatasetTransformContent
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetTransformContentFragmentDoc}
`;
export const DatasetReadmeFragmentDoc = gql`
    fragment DatasetReadme on Dataset {
        metadata {
            currentReadme
        }
    }
`;
export const ExecuteQueryEventFragmentDoc = gql`
    fragment ExecuteQueryEvent on ExecuteQuery {
        queryOutputData: outputData {
            interval {
                start
                end
            }
            logicalHash
            physicalHash
        }
        inputCheckpoint
        watermark: outputWatermark
        inputSlices {
            datasetId
            blockInterval {
                start
                end
            }
            dataInterval {
                start
                end
            }
        }
        outputCheckpoint {
            physicalHash
            size
        }
    }
`;
export const AddDataEventFragmentDoc = gql`
    fragment AddDataEvent on AddData {
        addDataWatermark: outputWatermark
        inputCheckpoint
        outputData {
            interval {
                start
                end
            }
            logicalHash
            physicalHash
            size
        }
        outputCheckpoint {
            physicalHash
            size
        }
    }
`;
export const SetPollingSourceEventFragmentDoc = gql`
    fragment SetPollingSourceEvent on SetPollingSource {
        fetch {
            ... on FetchStepUrl {
                url
                eventTime {
                    ... on EventTimeSourceFromPath {
                        pattern
                        timestampFormat
                    }
                    ... on EventTimeSourceFromMetadata {
                        __typename
                    }
                }
            }
            ... on FetchStepFilesGlob {
                path
                eventTime {
                    ... on EventTimeSourceFromPath {
                        pattern
                        timestampFormat
                    }
                    ... on EventTimeSourceFromMetadata {
                        __typename
                    }
                }
                cache {
                    __typename
                }
                order
            }
            ... on FetchStepContainer {
                image
                command
                args
                env {
                    name
                    value
                }
            }
        }
        read {
            ... on ReadStepCsv {
                schema
                separator
                encoding
                quote
                escape
                comment
                header
                enforceSchema
                inferSchema
                ignoreLeadingWhiteSpace
                ignoreTrailingWhiteSpace
                nullValue
                emptyValue
                nanValue
                positiveInf
                negativeInf
                dateFormat
                timestampFormat
                multiLine
            }
            ... on ReadStepGeoJson {
                schema
            }
            ... on ReadStepParquet {
                schema
            }
            ... on ReadStepJsonLines {
                schema
                dateFormat
                encoding
                multiLine
                primitivesAsString
                timestampFormat
            }
            ... on ReadStepEsriShapefile {
                schema
                subPath
            }
        }
        merge {
            ... on MergeStrategySnapshot {
                primaryKey
                compareColumns
                observationColumn
                obsvAdded
                obsvChanged
                obsvRemoved
            }
            ... on MergeStrategyLedger {
                primaryKey
            }
            ... on MergeStrategyAppend {
                __typename
            }
        }
        prepare {
            ... on PrepStepDecompress {
                format
                subPath
            }
            ... on PrepStepPipe {
                command
            }
        }
        preprocess {
            ... on TransformSql {
                engine
                version
                queries {
                    query
                    alias
                }
                temporalTables {
                    name
                    primaryKey
                }
            }
        }
    }
`;
export const MetadataBlockFragmentDoc = gql`
    fragment MetadataBlock on MetadataBlockExtended {
        blockHash
        prevBlockHash
        systemTime
        sequenceNumber
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
            ...DatasetTransform
            ...ExecuteQueryEvent
            ...AddDataEvent
            ... on SetAttachments {
                __typename
            }
            ... on SetInfo {
                __typename
            }
            ... on SetLicense {
                name
            }
            ...SetPollingSourceEvent
        }
    }
    ${DatasetTransformFragmentDoc}
    ${ExecuteQueryEventFragmentDoc}
    ${AddDataEventFragmentDoc}
    ${SetPollingSourceEventFragmentDoc}
`;
export const DatasetPageInfoFragmentDoc = gql`
    fragment DatasetPageInfo on PageBasedInfo {
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
    }
`;
export const DatasetLastUpdateFragmentDoc = gql`
    fragment DatasetLastUpdate on Dataset {
        metadata {
            chain {
                blocks(page: 0, perPage: 1) {
                    nodes {
                        ...MetadataBlock
                    }
                    totalCount
                    pageInfo {
                        ...DatasetPageInfo
                    }
                }
            }
        }
    }
    ${MetadataBlockFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
`;
export const DatasetMetadataSummaryFragmentDoc = gql`
    fragment DatasetMetadataSummary on Dataset {
        metadata {
            currentInfo {
                ...DatasetCurrentInfo
            }
            currentLicense {
                ...License
            }
            currentWatermark
            currentTransform {
                ...DatasetTransform
            }
            currentSchema(format: PARQUET_JSON) {
                format
                content
                __typename
            }
            __typename
        }
        ...DatasetReadme
        ...DatasetLastUpdate
    }
    ${DatasetCurrentInfoFragmentDoc}
    ${LicenseFragmentDoc}
    ${DatasetTransformFragmentDoc}
    ${DatasetReadmeFragmentDoc}
    ${DatasetLastUpdateFragmentDoc}
`;
export const DatasetDescriptionFragmentDoc = gql`
    fragment DatasetDescription on Dataset {
        metadata {
            currentInfo {
                ...DatasetCurrentInfo
            }
            currentLicense {
                ...License
            }
        }
    }
    ${DatasetCurrentInfoFragmentDoc}
    ${LicenseFragmentDoc}
`;
export const DatasetDetailsFragmentDoc = gql`
    fragment DatasetDetails on Dataset {
        kind
        createdAt
        lastUpdatedAt
        data {
            estimatedSize
            numRecordsTotal
        }
        metadata {
            currentLicense {
                ...License
            }
            currentWatermark
        }
    }
    ${LicenseFragmentDoc}
`;
export const DatasetOverviewFragmentDoc = gql`
    fragment DatasetOverview on Dataset {
        ...DatasetDescription
        ...DatasetDetails
        ...DatasetReadme
        ...DatasetLastUpdate
    }
    ${DatasetDescriptionFragmentDoc}
    ${DatasetDetailsFragmentDoc}
    ${DatasetReadmeFragmentDoc}
    ${DatasetLastUpdateFragmentDoc}
`;
export const DatasetSearchOverviewFragmentDoc = gql`
    fragment DatasetSearchOverview on Dataset {
        ...DatasetBasics
        createdAt
        lastUpdatedAt
        metadata {
            currentInfo {
                ...DatasetCurrentInfo
            }
            currentLicense {
                ...License
            }
            currentDownstreamDependencies {
                id
                kind
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetCurrentInfoFragmentDoc}
    ${LicenseFragmentDoc}
`;
export const DatasetByIdDocument = gql`
    query datasetById($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                ...DatasetBasics
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetByIdGQL extends Apollo.Query<
    DatasetByIdQuery,
    DatasetByIdQueryVariables
> {
    document = DatasetByIdDocument;

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
                __typename
                ... on DataQueryResultSuccess {
                    ...DataQueryResultSuccessView
                    limit
                }
                ... on DataQueryResultError {
                    errorMessage
                    errorKind
                }
            }
        }
    }
    ${DataQueryResultSuccessViewFragmentDoc}
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
    query getDatasetHistory(
        $accountName: AccountName!
        $datasetName: DatasetName!
        $perPage: Int
        $page: Int
    ) {
        datasets {
            byOwnerAndName(
                accountName: $accountName
                datasetName: $datasetName
            ) {
                ...DatasetBasics
                metadata {
                    chain {
                        blocks(perPage: $perPage, page: $page) {
                            totalCount
                            nodes {
                                ...MetadataBlock
                            }
                            pageInfo {
                                ...DatasetPageInfo
                            }
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${MetadataBlockFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
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
export const GetDatasetMainDataDocument = gql`
    query getDatasetMainData(
        $accountName: AccountName!
        $datasetName: DatasetName!
        $limit: Int
    ) {
        datasets {
            byOwnerAndName(
                accountName: $accountName
                datasetName: $datasetName
            ) {
                ...DatasetBasics
                ...DatasetOverview
                ...DatasetData
                ...DatasetMetadataSummary
                ...DatasetLineage
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetOverviewFragmentDoc}
    ${DatasetDataFragmentDoc}
    ${DatasetMetadataSummaryFragmentDoc}
    ${DatasetLineageFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetMainDataGQL extends Apollo.Query<
    GetDatasetMainDataQuery,
    GetDatasetMainDataQueryVariables
> {
    document = GetDatasetMainDataDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetsByAccountNameDocument = gql`
    query datasetsByAccountName(
        $accountName: AccountName!
        $perPage: Int
        $page: Int
    ) {
        datasets {
            byAccountName(
                accountName: $accountName
                perPage: $perPage
                page: $page
            ) {
                nodes {
                    ...DatasetSearchOverview
                    __typename
                }
                totalCount
                pageInfo {
                    ...DatasetPageInfo
                }
            }
        }
    }
    ${DatasetSearchOverviewFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetsByAccountNameGQL extends Apollo.Query<
    DatasetsByAccountNameQuery,
    DatasetsByAccountNameQueryVariables
> {
    document = DatasetsByAccountNameDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GithubLoginDocument = gql`
    mutation GithubLogin($code: String!) {
        auth {
            githubLogin(code: $code) {
                token {
                    accessToken
                    scope
                    tokenType
                }
                accountInfo {
                    ...AccountDetails
                }
            }
        }
    }
    ${AccountDetailsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GithubLoginGQL extends Apollo.Mutation<
    GithubLoginMutation,
    GithubLoginMutationVariables
> {
    document = GithubLoginDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const FetchAccountInfoDocument = gql`
    mutation FetchAccountInfo($accessToken: String!) {
        auth {
            accountInfo(accessToken: $accessToken) {
                ...AccountDetails
            }
        }
    }
    ${AccountDetailsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class FetchAccountInfoGQL extends Apollo.Mutation<
    FetchAccountInfoMutation,
    FetchAccountInfoMutationVariables
> {
    document = FetchAccountInfoDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetMetadataBlockDocument = gql`
    query getMetadataBlock(
        $accountName: AccountName!
        $datasetName: DatasetName!
        $blockHash: Multihash!
    ) {
        datasets {
            byOwnerAndName(
                accountName: $accountName
                datasetName: $datasetName
            ) {
                metadata {
                    chain {
                        blockByHash(hash: $blockHash) {
                            ...MetadataBlock
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
export class GetMetadataBlockGQL extends Apollo.Query<
    GetMetadataBlockQuery,
    GetMetadataBlockQueryVariables
> {
    document = GetMetadataBlockDocument;

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
                    ...DatasetBasics
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
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
                    ...DatasetSearchOverview
                    __typename
                }
                totalCount
                pageInfo {
                    ...DatasetPageInfo
                }
            }
        }
    }
    ${DatasetSearchOverviewFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
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
