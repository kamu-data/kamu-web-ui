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
export interface Scalars {
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
    Sha3256: any;
}

export interface Query {
    __typename?: "Query";
    /** Account-related functionality group */
    accounts: Accounts;
    /** Returns the version of the GQL API */
    apiVersion: Scalars["String"];
    /** Dataset-related functionality group */
    datasets: Datasets;
    /** Search-related functionality group */
    search: Search;
}

export interface Accounts {
    __typename?: "Accounts";
    /** Returns account by its ID */
    byId?: Maybe<Account>;
    /** Returns account by its name */
    byName?: Maybe<Account>;
}

export interface AccountsByIdArgs {
    accountId: Scalars["AccountID"];
}

export interface AccountsByNameArgs {
    name: Scalars["String"];
}

export interface Account {
    id: Scalars["AccountID"];
    name: Scalars["String"];
}

export interface Datasets {
    __typename?: "Datasets";
    /** Returns datasets belonging to the specified account */
    byAccountId: DatasetConnection;
    /** Returns dataset by its ID */
    byId?: Maybe<Dataset>;
}

export interface DatasetsByAccountIdArgs {
    accountId: Scalars["AccountID"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: Scalars["Int"];
}

export interface DatasetsByIdArgs {
    datasetId: Scalars["DatasetID"];
}

export interface DatasetConnection {
    __typename?: "DatasetConnection";
    edges: Array<DatasetEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<Dataset>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount?: Maybe<Scalars["Int"]>;
}

export interface DatasetEdge {
    __typename?: "DatasetEdge";
    node: Dataset;
}

export interface Dataset {
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
    name: Scalars["String"];
    /** Returns the user or organization that owns this dataset */
    owner: Account;
}

export interface DatasetData {
    __typename?: "DatasetData";
    datasetId: Scalars["DatasetID"];
    /** An estimated size of data on disk not accounting for replication or caching */
    estimatedSize: Scalars["Int"];
    /** Total number of records in this dataset */
    numRecordsTotal: Scalars["Int"];
    /**
     * Returns the specified number of the latest records in the dataset
     * This is equivalent to the SQL query: `SELECT * FROM dataset ORDER BY event_time DESC LIMIT N`
     */
    tail: DataSlice;
}

export interface DatasetDataTailArgs {
    format?: InputMaybe<DataSliceFormat>;
    numRecords?: InputMaybe<Scalars["Int"]>;
}

export enum DataSliceFormat {
    Csv = "CSV",
    Json = "JSON",
    JsonLd = "JSON_LD",
    JsonSoA = "JSON_SO_A",
}

export interface DataSlice {
    __typename?: "DataSlice";
    content: Scalars["String"];
    format: DataSliceFormat;
}

export enum DatasetKind {
    Derivative = "DERIVATIVE",
    Root = "ROOT",
}

export interface DatasetMetadata {
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
    datasetId: Scalars["DatasetID"];
}

export interface DatasetMetadataCurrentSchemaArgs {
    format?: InputMaybe<DataSchemaFormat>;
}

export interface MetadataChain {
    __typename?: "MetadataChain";
    /** Returns a metadata block corresponding to the specified hash */
    blockByHash?: Maybe<MetadataBlock>;
    /** Iterates all metadata blocks in the reverse chronological order */
    blocks: MetadataBlockConnection;
    /** Returns all named metadata block references */
    refs: Array<BlockRef>;
}

export interface MetadataChainBlockByHashArgs {
    hash: Scalars["Sha3256"];
}

export interface MetadataChainBlocksArgs {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: Scalars["Int"];
}

export interface MetadataBlock {
    __typename?: "MetadataBlock";
    blockHash: Scalars["Sha3256"];
    outputWatermark?: Maybe<Scalars["DateTime"]>;
    prevBlockHash?: Maybe<Scalars["Sha3256"]>;
    systemTime: Scalars["DateTime"];
}

export interface MetadataBlockConnection {
    __typename?: "MetadataBlockConnection";
    edges: Array<MetadataBlockEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<MetadataBlock>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount?: Maybe<Scalars["Int"]>;
}

export interface MetadataBlockEdge {
    __typename?: "MetadataBlockEdge";
    node: MetadataBlock;
}

export interface PageBasedInfo {
    __typename?: "PageBasedInfo";
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars["Boolean"];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars["Boolean"];
    /** Approximate number of total pages assuming number of nodes per page stays the same */
    totalPages?: Maybe<Scalars["Int"]>;
}

export interface BlockRef {
    __typename?: "BlockRef";
    blockHash: Scalars["Sha3256"];
    name: Scalars["String"];
}

export enum DataSchemaFormat {
    Parquet = "PARQUET",
    ParquetJson = "PARQUET_JSON",
}

export interface DataSchema {
    __typename?: "DataSchema";
    content: Scalars["String"];
    format: DataSchemaFormat;
}

export interface Search {
    __typename?: "Search";
    /** Perform search across all resources */
    query: SearchResultConnection;
}

export interface SearchQueryArgs {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: Scalars["Int"];
    query: Scalars["String"];
}

export interface SearchResultConnection {
    __typename?: "SearchResultConnection";
    edges: Array<SearchResultEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<SearchResult>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount?: Maybe<Scalars["Int"]>;
}

export interface SearchResultEdge {
    __typename?: "SearchResultEdge";
    node: SearchResult;
}

export type SearchResult = Dataset;

export interface Mutation {
    __typename?: "Mutation";
    auth: Auth;
}

export interface Auth {
    __typename?: "Auth";
    accountInfo: AccountInfo;
    githubLogin: LoginResponse;
}

export interface AuthAccountInfoArgs {
    accessToken: Scalars["String"];
}

export interface AuthGithubLoginArgs {
    code: Scalars["String"];
}

export interface AccountInfo {
    __typename?: "AccountInfo";
    avatarUrl?: Maybe<Scalars["String"]>;
    email?: Maybe<Scalars["String"]>;
    gravatarId?: Maybe<Scalars["String"]>;
    login: Scalars["String"];
    name: Scalars["String"];
}

export interface LoginResponse {
    __typename?: "LoginResponse";
    accountInfo: AccountInfo;
    token: AccessToken;
}

export interface AccessToken {
    __typename?: "AccessToken";
    accessToken: Scalars["String"];
    scope: Scalars["String"];
    tokenType: Scalars["String"];
}

export type Organization = Account & {
    __typename?: "Organization";
    /** Unique identifier of this organization account */
    id: Scalars["AccountID"];
    /** Symbolic name */
    name: Scalars["String"];
};

export type User = Account & {
    __typename?: "User";
    /** Unique identifier of this user account */
    id: Scalars["AccountID"];
    /** Symbolic name */
    name: Scalars["String"];
};

export type SearchAutocompleteQueryVariables = Exact<{
    query: Scalars["String"];
    perPage?: InputMaybe<Scalars["Int"]>;
}>;

export interface SearchAutocompleteQuery {
    __typename?: "Query";
    search: {
        __typename?: "Search";
        query: {
            __typename?: "SearchResultConnection";
            nodes: Array<{
                __typename: "Dataset";
                id: any;
                name: string;
                kind: DatasetKind;
            }>;
        };
    };
}

export const SearchAutocompleteDocument = gql`
    query searchAutocomplete($query: String!, $perPage: Int) {
        search {
            query(query: $query, perPage: $perPage) {
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
export class SearchAutocompleteGQL extends Apollo.Query<
    SearchAutocompleteQuery,
    SearchAutocompleteQueryVariables
> {
    document = SearchAutocompleteDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
