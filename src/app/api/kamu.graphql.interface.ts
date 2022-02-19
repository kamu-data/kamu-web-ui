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
    perPage?: Scalars["Int"];
};

export type DatasetsByAccountNameArgs = {
    accountName: Scalars["AccountName"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: Scalars["Int"];
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
    tail: DataSlice;
};

export type DatasetDataTailArgs = {
    format?: InputMaybe<DataSliceFormat>;
    numRecords?: InputMaybe<Scalars["Int"]>;
};

export enum DataSliceFormat {
    Csv = "CSV",
    Json = "JSON",
    JsonLd = "JSON_LD",
    JsonSoA = "JSON_SO_A",
}

export type DataSlice = {
    __typename?: "DataSlice";
    content: Scalars["String"];
    format: DataSliceFormat;
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
    /** Latest data schema */
    currentSchema: DataSchema;
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
    blockByHash?: Maybe<MetadataBlock>;
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
    perPage?: Scalars["Int"];
};

export type MetadataBlock = {
    __typename?: "MetadataBlock";
    blockHash: Scalars["Multihash"];
    event: MetadataEvent;
    prevBlockHash?: Maybe<Scalars["Multihash"]>;
    systemTime: Scalars["DateTime"];
};

export type MetadataEvent = {
    dummy: Scalars["String"];
};

export type MetadataBlockConnection = {
    __typename?: "MetadataBlockConnection";
    edges: Array<MetadataBlockEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<MetadataBlock>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount?: Maybe<Scalars["Int"]>;
};

export type MetadataBlockEdge = {
    __typename?: "MetadataBlockEdge";
    node: MetadataBlock;
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

export enum DataSchemaFormat {
    Parquet = "PARQUET",
    ParquetJson = "PARQUET_JSON",
}

export type DataSchema = {
    __typename?: "DataSchema";
    content: Scalars["String"];
    format: DataSchemaFormat;
};

export type Search = {
    __typename?: "Search";
    /** Perform search across all resources */
    query: SearchResultConnection;
};

export type SearchQueryArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: Scalars["Int"];
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

export type BlockInterval = {
    __typename?: "BlockInterval";
    end: Scalars["Multihash"];
    start: Scalars["Multihash"];
};

export type DataSliceMetadata = {
    __typename?: "DataSliceMetadata";
    interval: OffsetInterval;
    logicalHash: Scalars["Multihash"];
    physicalHash: Scalars["Multihash"];
};

export type OffsetInterval = {
    __typename?: "OffsetInterval";
    end: Scalars["Int"];
    start: Scalars["Int"];
};

export type InputSliceMetadata = {
    __typename?: "InputSliceMetadata";
    blockInterval?: Maybe<BlockInterval>;
    dataInterval?: Maybe<OffsetInterval>;
    datasetId: Scalars["DatasetID"];
};

export type MetadataEventAddData = MetadataEvent & {
    __typename?: "MetadataEventAddData";
    dummy: Scalars["String"];
    outputData: DataSliceMetadata;
    outputWatermark?: Maybe<Scalars["DateTime"]>;
};

export type MetadataEventExecuteQuery = MetadataEvent & {
    __typename?: "MetadataEventExecuteQuery";
    dummy: Scalars["String"];
    inputSlices: Array<InputSliceMetadata>;
    outputData?: Maybe<DataSliceMetadata>;
    outputWatermark?: Maybe<Scalars["DateTime"]>;
};

export type MetadataEventSeed = MetadataEvent & {
    __typename?: "MetadataEventSeed";
    datasetId: Scalars["DatasetID"];
    datasetKind: DatasetKind;
    dummy: Scalars["String"];
};

export type MetadataEventSetPollingSource = MetadataEvent & {
    __typename?: "MetadataEventSetPollingSource";
    dummy: Scalars["String"];
};

export type MetadataEventSetTransform = MetadataEvent & {
    __typename?: "MetadataEventSetTransform";
    dummy: Scalars["String"];
};

export type MetadataEventSetVocab = MetadataEvent & {
    __typename?: "MetadataEventSetVocab";
    dummy: Scalars["String"];
};

export type MetadataEventSetWatermark = MetadataEvent & {
    __typename?: "MetadataEventSetWatermark";
    dummy: Scalars["String"];
    outputWatermark: Scalars["DateTime"];
};

export type MetadataEventUnsupported = MetadataEvent & {
    __typename?: "MetadataEventUnsupported";
    dummy: Scalars["String"];
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
                          __typename: "DataSlice";
                          format: DataSliceFormat;
                          content: string;
                      };
                  };
              }
            | null
            | undefined;
    };
};

export type DatasetLinageUpstreamDependenciesQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetLinageUpstreamDependenciesQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
            | {
                  __typename?: "Dataset";
                  id: any;
                  kind: DatasetKind;
                  metadata: {
                      __typename?: "DatasetMetadata";
                      currentUpstreamDependencies: Array<{
                          __typename?: "Dataset";
                          id: any;
                          kind: DatasetKind;
                          metadata: {
                              __typename?: "DatasetMetadata";
                              currentUpstreamDependencies: Array<{
                                  __typename?: "Dataset";
                                  id: any;
                                  kind: DatasetKind;
                              }>;
                          };
                      }>;
                  };
              }
            | null
            | undefined;
    };
};

export type DatasetMetadataDownstreamDependenciesQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetMetadataDownstreamDependenciesQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
            | {
                  __typename?: "Dataset";
                  id: any;
                  kind: DatasetKind;
                  metadata: {
                      __typename?: "DatasetMetadata";
                      currentDownstreamDependencies: Array<{
                          __typename?: "Dataset";
                          id: any;
                          kind: DatasetKind;
                          metadata: {
                              __typename?: "DatasetMetadata";
                              currentDownstreamDependencies: Array<{
                                  __typename?: "Dataset";
                                  id: any;
                                  kind: DatasetKind;
                              }>;
                          };
                      }>;
                  };
              }
            | null
            | undefined;
    };
};

export type DatasetMetadataQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    perPage?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
}>;

export type DatasetMetadataQuery = {
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
                      currentSchema: {
                          __typename?: "DataSchema";
                          content: string;
                      };
                      chain: {
                          __typename?: "MetadataChain";
                          blocks: {
                              __typename?: "MetadataBlockConnection";
                              totalCount?: number | null | undefined;
                              nodes: Array<{
                                  __typename?: "MetadataBlock";
                                  blockHash: any;
                                  systemTime: any;
                                  event:
                                      | {
                                            __typename: "MetadataEventAddData";
                                            outputWatermark?:
                                                | any
                                                | null
                                                | undefined;
                                            outputData: {
                                                __typename?: "DataSliceMetadata";
                                                logicalHash: any;
                                            };
                                        }
                                      | {
                                            __typename: "MetadataEventExecuteQuery";
                                        }
                                      | {
                                            __typename: "MetadataEventSeed";
                                            datasetId: any;
                                            datasetKind: DatasetKind;
                                        }
                                      | {
                                            __typename: "MetadataEventSetPollingSource";
                                        }
                                      | {
                                            __typename: "MetadataEventSetTransform";
                                        }
                                      | { __typename: "MetadataEventSetVocab" }
                                      | {
                                            __typename: "MetadataEventSetWatermark";
                                        }
                                      | {
                                            __typename: "MetadataEventUnsupported";
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

export type DatasetOverviewQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    numRecords?: InputMaybe<Scalars["Int"]>;
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
                          __typename: "DataSlice";
                          format: DataSliceFormat;
                          content: string;
                      };
                  };
              }
            | null
            | undefined;
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
                    tail(numRecords: $numRecords, format: JSON) {
                        format
                        content
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
export const DatasetLinageUpstreamDependenciesDocument = gql`
    query datasetLinageUpstreamDependencies($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                id
                kind
                metadata {
                    currentUpstreamDependencies {
                        id
                        kind
                        metadata {
                            currentUpstreamDependencies {
                                id
                                kind
                            }
                        }
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetLinageUpstreamDependenciesGQL extends Apollo.Query<
    DatasetLinageUpstreamDependenciesQuery,
    DatasetLinageUpstreamDependenciesQueryVariables
> {
    document = DatasetLinageUpstreamDependenciesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetMetadataDownstreamDependenciesDocument = gql`
    query datasetMetadataDownstreamDependencies($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                id
                kind
                metadata {
                    currentDownstreamDependencies {
                        id
                        kind
                        metadata {
                            currentDownstreamDependencies {
                                id
                                kind
                            }
                        }
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetMetadataDownstreamDependenciesGQL extends Apollo.Query<
    DatasetMetadataDownstreamDependenciesQuery,
    DatasetMetadataDownstreamDependenciesQueryVariables
> {
    document = DatasetMetadataDownstreamDependenciesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetMetadataDocument = gql`
    query datasetMetadata($datasetId: DatasetID!, $perPage: Int, $page: Int) {
        datasets {
            byId(datasetId: $datasetId) {
                id
                owner {
                    id
                    name
                }
                name
                metadata {
                    currentSchema(format: PARQUET_JSON) {
                        content
                    }
                    chain {
                        blocks(perPage: $perPage, page: $page) {
                            totalCount
                            nodes {
                                event {
                                    __typename
                                    ... on MetadataEventSeed {
                                        datasetId
                                        datasetKind
                                    }
                                    ... on MetadataEventAddData {
                                        outputData {
                                            logicalHash
                                        }
                                        outputWatermark
                                    }
                                }
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
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetMetadataGQL extends Apollo.Query<
    DatasetMetadataQuery,
    DatasetMetadataQueryVariables
> {
    document = DatasetMetadataDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetOverviewDocument = gql`
    query datasetOverview($datasetId: DatasetID!, $numRecords: Int) {
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
                    tail(numRecords: $numRecords, format: JSON) {
                        format
                        content
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
