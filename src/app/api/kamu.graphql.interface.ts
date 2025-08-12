// THIS FILE IS GENERATED, DO NOT EDIT!
import { gql } from "@apollo/client/core";
import { Injectable } from "@angular/core";
import * as Apollo from "apollo-angular";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    AccessTokenID: string;
    AccountDisplayName: string;
    AccountID: string;
    AccountName: string;
    AccountPassword: string;
    /** Base64-encoded binary data (url-safe, no padding) */
    Base64Usnp: string;
    /** Collection entry paths are similar to HTTP path components. They are rooted (start with `/`), separated by forward slashes, with elements URL-encoded (e.g. `/foo%20bar/baz`) */
    CollectionPath: string;
    DatasetAlias: string;
    DatasetEnvVarID: string;
    DatasetID: string;
    DatasetName: string;
    DatasetRef: string;
    DatasetRefRemote: string;
    /**
     * Implement the DateTime<Utc> scalar
     *
     * The input/output is a string in RFC3339 format.
     */
    DateTime: string;
    DeviceCode: string;
    /**
     * Wallet address in did:pkh format.
     *
     * Example: did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a
     */
    DidPkh: string;
    Eip4361AuthNonce: string;
    Email: string;
    EventID: string;
    EvmWalletAddress: string;
    ExtraData: string;
    FlowID: string;
    Multihash: string;
    TaskID: string;
    URL: string;
    /** URL is a String implementing the [URL Standard](http://url.spec.whatwg.org/) */
    Url: string;
    WebhookEventType: string;
    WebhookSubscriptionID: string;
    WebhookSubscriptionLabel: string;
};

export type AccessTokenConnection = {
    __typename?: "AccessTokenConnection";
    edges: Array<AccessTokenEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<ViewAccessToken>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type AccessTokenEdge = {
    __typename?: "AccessTokenEdge";
    node: ViewAccessToken;
};

export type Account = {
    __typename?: "Account";
    /** Access to the flow configurations of this account */
    accessTokens: AccountAccessTokens;
    /** Symbolic account name */
    accountName: Scalars["AccountName"];
    /** Account provider */
    accountProvider: AccountProvider;
    /** Account type */
    accountType: AccountType;
    /** Avatar URL */
    avatarUrl?: Maybe<Scalars["String"]>;
    /** Account name to display */
    displayName: Scalars["AccountDisplayName"];
    /** Email address */
    email: Scalars["String"];
    /** Access to the flow configurations of this account */
    flows: AccountFlows;
    /** Unique and stable identifier of this account */
    id: Scalars["AccountID"];
    /** Indicates the administrator status */
    isAdmin: Scalars["Boolean"];
};

export type AccountAccessTokens = {
    __typename?: "AccountAccessTokens";
    listAccessTokens: AccessTokenConnection;
};

export type AccountAccessTokensListAccessTokensArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type AccountAccessTokensMut = {
    __typename?: "AccountAccessTokensMut";
    createAccessToken: CreateTokenResult;
    revokeAccessToken: RevokeResult;
};

export type AccountAccessTokensMutCreateAccessTokenArgs = {
    tokenName: Scalars["String"];
};

export type AccountAccessTokensMutRevokeAccessTokenArgs = {
    tokenId: Scalars["AccessTokenID"];
};

export type AccountConnection = {
    __typename?: "AccountConnection";
    edges: Array<AccountEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<Account>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type AccountDatasetRelationOperation = {
    accountId: Scalars["AccountID"];
    datasetId: Scalars["DatasetID"];
    operation: DatasetRoleOperation;
};

export type AccountEdge = {
    __typename?: "AccountEdge";
    node: Account;
};

export type AccountFieldNonUnique = CreateAccountResult & {
    __typename?: "AccountFieldNonUnique";
    field: Scalars["String"];
    message: Scalars["String"];
};

export type AccountFlowFilters = {
    byDatasetIds: Array<Scalars["DatasetID"]>;
    byFlowType?: InputMaybe<DatasetFlowType>;
    byInitiator?: InputMaybe<InitiatorFilterInput>;
    byStatus?: InputMaybe<FlowStatus>;
};

export type AccountFlowRuns = {
    __typename?: "AccountFlowRuns";
    listDatasetsWithFlow: DatasetConnection;
    listFlows: FlowConnection;
};

export type AccountFlowRunsListFlowsArgs = {
    filters?: InputMaybe<AccountFlowFilters>;
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type AccountFlowTriggers = {
    __typename?: "AccountFlowTriggers";
    /** Checks if all triggers of all datasets in account are disabled */
    allPaused: Scalars["Boolean"];
};

export type AccountFlowTriggersMut = {
    __typename?: "AccountFlowTriggersMut";
    pauseAccountDatasetFlows: Scalars["Boolean"];
    resumeAccountDatasetFlows: Scalars["Boolean"];
};

export type AccountFlows = {
    __typename?: "AccountFlows";
    /** Returns interface for flow runs queries */
    runs: AccountFlowRuns;
    /** Returns interface for flow triggers queries */
    triggers: AccountFlowTriggers;
};

export type AccountFlowsMut = {
    __typename?: "AccountFlowsMut";
    triggers: AccountFlowTriggersMut;
};

export type AccountLookupFilter = {
    excludeAccountsByIds: Array<Scalars["AccountID"]>;
};

export type AccountMut = {
    __typename?: "AccountMut";
    /** Access to the mutable flow configurations of this account */
    accessTokens: AccountAccessTokensMut;
    /** Delete a selected account. Allowed only for admin users */
    delete: DeleteAccountResult;
    /** Access to the mutable flow configurations of this account */
    flows: AccountFlowsMut;
    /** Reset password for a selected account. Allowed only for admin users */
    modifyPassword: ModifyPasswordResult;
    /** Change password with confirmation */
    modifyPasswordWithConfirmation: ModifyPasswordResult;
    /** Update account name */
    rename: RenameAccountResult;
    /** Update account email */
    updateEmail: UpdateEmailResult;
};

export type AccountMutModifyPasswordArgs = {
    password: Scalars["AccountPassword"];
};

export type AccountMutModifyPasswordWithConfirmationArgs = {
    newPassword: Scalars["AccountPassword"];
    oldPassword: Scalars["AccountPassword"];
};

export type AccountMutRenameArgs = {
    newName: Scalars["AccountName"];
};

export type AccountMutUpdateEmailArgs = {
    newEmail: Scalars["Email"];
};

export enum AccountProvider {
    OauthGithub = "OAUTH_GITHUB",
    Password = "PASSWORD",
    Web3Wallet = "WEB3_WALLET",
}

export enum AccountType {
    Organization = "ORGANIZATION",
    User = "USER",
}

export type AccountWithRole = {
    __typename?: "AccountWithRole";
    account: Account;
    role: DatasetAccessRole;
};

export type AccountWithRoleConnection = {
    __typename?: "AccountWithRoleConnection";
    edges: Array<AccountWithRoleEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<AccountWithRole>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type AccountWithRoleEdge = {
    __typename?: "AccountWithRoleEdge";
    node: AccountWithRole;
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
    name: Scalars["AccountName"];
};

export type AccountsMut = {
    __typename?: "AccountsMut";
    /** Returns a mutable account by its id */
    byId?: Maybe<AccountMut>;
    /** Returns a mutable account by its name */
    byName?: Maybe<AccountMut>;
    /** Create a new account */
    createAccount: CreateAccountResult;
    /** Create wallet accounts */
    createWalletAccounts: CreateWalletAccountsResult;
};

export type AccountsMutByIdArgs = {
    accountId: Scalars["AccountID"];
};

export type AccountsMutByNameArgs = {
    accountName: Scalars["AccountName"];
};

export type AccountsMutCreateAccountArgs = {
    accountName: Scalars["AccountName"];
    email?: InputMaybe<Scalars["Email"]>;
};

export type AccountsMutCreateWalletAccountsArgs = {
    walletAddresses: Array<Scalars["DidPkh"]>;
};

/**
 * Indicates that data has been ingested into a root dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#adddata-schema
 */
export type AddData = {
    __typename?: "AddData";
    /**
     * Describes checkpoint written during this transaction, if any. If an
     * engine operation resulted in no updates to the checkpoint, but
     * checkpoint is still relevant for subsequent runs - a hash of the
     * previous checkpoint should be specified.
     */
    newCheckpoint?: Maybe<Checkpoint>;
    /** Describes output data written during this transaction, if any. */
    newData?: Maybe<DataSlice>;
    /**
     * The state of the source the data was added from to allow fast resuming.
     * If the state did not change but is still relevant for subsequent runs it
     * should be carried, i.e. only the last state per source is considered
     * when resuming.
     */
    newSourceState?: Maybe<SourceState>;
    /**
     * Last watermark of the output data stream, if any. Initial blocks may not
     * have watermarks, but once watermark is set - all subsequent blocks
     * should either carry the same watermark or specify a new (greater) one.
     * Thus, watermarks are monotonically non-decreasing.
     */
    newWatermark?: Maybe<Scalars["DateTime"]>;
    /** Hash of the checkpoint file used to restore ingestion state, if any. */
    prevCheckpoint?: Maybe<Scalars["Multihash"]>;
    /**
     * Last offset of the previous data slice, if any. Must be equal to the
     * last non-empty `newData.offsetInterval.end`.
     */
    prevOffset?: Maybe<Scalars["Int"]>;
};

/**
 * Describes how to ingest data into a root dataset from a certain logical
 * source.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#addpushsource-schema
 */
export type AddPushSource = {
    __typename?: "AddPushSource";
    /**
     * Determines how newly-ingested data should be merged with existing
     * history.
     */
    merge: MergeStrategy;
    /** Pre-processing query that shapes the data. */
    preprocess?: Maybe<Transform>;
    /** Defines how data is read into structured format. */
    read: ReadStep;
    /** Identifies the source within this dataset. */
    sourceName: Scalars["String"];
};

export type Admin = {
    __typename?: "Admin";
    selfTest: Scalars["String"];
};

export type ApplyRolesMatrixResult = {
    __typename?: "ApplyRolesMatrixResult";
    message: Scalars["String"];
};

/**
 * Embedded attachment item.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#attachmentembedded-schema
 */
export type AttachmentEmbedded = {
    __typename?: "AttachmentEmbedded";
    /** Content of the attachment. */
    content: Scalars["String"];
    /** Path to an attachment if it was materialized into a file. */
    path: Scalars["String"];
};

/**
 * Defines the source of attachment files.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#attachments-schema
 */
export type Attachments = AttachmentsEmbedded;

/**
 * For attachments that are specified inline and are embedded in the metadata.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#attachmentsembedded-schema
 */
export type AttachmentsEmbedded = {
    __typename?: "AttachmentsEmbedded";
    /** List of embedded items. */
    items: Array<AttachmentEmbedded>;
};

export type Auth = {
    __typename?: "Auth";
    enabledProviders: Array<AccountProvider>;
};

export type AuthMut = {
    __typename?: "AuthMut";
    accountDetails: Account;
    login: LoginResponse;
    /** Web3-related functionality group */
    web3: AuthWeb3Mut;
};

export type AuthMutAccountDetailsArgs = {
    accessToken: Scalars["String"];
};

export type AuthMutLoginArgs = {
    deviceCode?: InputMaybe<Scalars["DeviceCode"]>;
    loginCredentialsJson: Scalars["String"];
    loginMethod: AccountProvider;
};

export type AuthWeb3Mut = {
    __typename?: "AuthWeb3Mut";
    eip4361AuthNonce: Eip4361AuthNonceResponse;
};

export type AuthWeb3MutEip4361AuthNonceArgs = {
    account: Scalars["EvmWalletAddress"];
};

export type BatchingInput = {
    maxBatchingInterval?: InputMaybe<TimeDeltaInput>;
    minRecordsToAwait: Scalars["Int"];
};

export type BlockRef = {
    __typename?: "BlockRef";
    blockHash: Scalars["Multihash"];
    name: Scalars["String"];
};

export enum BreakingChangeRule {
    NoAction = "NO_ACTION",
    Recover = "RECOVER",
}

export type BuildInfo = {
    __typename?: "BuildInfo";
    appVersion: Scalars["String"];
    buildTimestamp?: Maybe<Scalars["String"]>;
    cargoFeatures?: Maybe<Scalars["String"]>;
    cargoOptLevel?: Maybe<Scalars["String"]>;
    cargoTargetTriple?: Maybe<Scalars["String"]>;
    gitBranch?: Maybe<Scalars["String"]>;
    gitCommitDate?: Maybe<Scalars["String"]>;
    gitDescribe?: Maybe<Scalars["String"]>;
    gitSha?: Maybe<Scalars["String"]>;
    rustcChannel?: Maybe<Scalars["String"]>;
    rustcCommitSha?: Maybe<Scalars["String"]>;
    rustcHostTriple?: Maybe<Scalars["String"]>;
    rustcSemver?: Maybe<Scalars["String"]>;
};

export type CancelScheduledTasksResult = {
    message: Scalars["String"];
};

export type CancelScheduledTasksSuccess = CancelScheduledTasksResult & {
    __typename?: "CancelScheduledTasksSuccess";
    flow: Flow;
    message: Scalars["String"];
};

/**
 * Describes a checkpoint produced by an engine
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#checkpoint-schema
 */
export type Checkpoint = {
    __typename?: "Checkpoint";
    /** Hash sum of the checkpoint file. */
    physicalHash: Scalars["Multihash"];
    /** Size of checkpoint file in bytes. */
    size: Scalars["Int"];
};

export type CliProtocolDesc = {
    __typename?: "CliProtocolDesc";
    pullCommand: Scalars["String"];
    pushCommand: Scalars["String"];
};

export type CollaborationMut = {
    __typename?: "CollaborationMut";
    /** Batch application of relations between accounts and datasets */
    applyAccountDatasetRelations: ApplyRolesMatrixResult;
};

export type CollaborationMutApplyAccountDatasetRelationsArgs = {
    operations: Array<AccountDatasetRelationOperation>;
};

export type Collection = {
    __typename?: "Collection";
    /**
     * State projection of the state of a collection at the specified point in
     * time
     */
    asOf: CollectionProjection;
    /** Latest state projection of the state of a collection */
    latest: CollectionProjection;
};

export type CollectionAsOfArgs = {
    blockHash: Scalars["Multihash"];
};

export type CollectionEntry = {
    __typename?: "CollectionEntry";
    /** Resolves the reference to linked dataset */
    asDataset?: Maybe<Dataset>;
    /** Time when this version was created */
    eventTime: Scalars["DateTime"];
    /** Extra data associated with this entry */
    extraData: Scalars["ExtraData"];
    /**
     * File system-like path
     * Rooted, separated by forward slashes, with elements URL-encoded
     * (e.g. `/foo%20bar/baz`)
     */
    path: Scalars["CollectionPath"];
    /** DID of the linked dataset */
    ref: Scalars["DatasetID"];
    /** Time when this version was created */
    systemTime: Scalars["DateTime"];
};

export type CollectionEntryConnection = {
    __typename?: "CollectionEntryConnection";
    edges: Array<CollectionEntryEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<CollectionEntry>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type CollectionEntryEdge = {
    __typename?: "CollectionEntryEdge";
    node: CollectionEntry;
};

export type CollectionEntryInput = {
    /** Json object containing extra column values */
    extraData?: InputMaybe<Scalars["ExtraData"]>;
    /** Entry path */
    path: Scalars["CollectionPath"];
    /** DID of the linked dataset */
    ref: Scalars["DatasetID"];
};

export type CollectionMut = {
    __typename?: "CollectionMut";
    /** Links new entry to this collection */
    addEntry: CollectionUpdateResult;
    /** Moves or renames an entry */
    moveEntry: CollectionUpdateResult;
    /** Remove an entry from this collection */
    removeEntry: CollectionUpdateResult;
    /** Execute multiple add / move / unlink operations as a single transaction */
    updateEntries: CollectionUpdateResult;
};

export type CollectionMutAddEntryArgs = {
    entry: CollectionEntryInput;
    expectedHead?: InputMaybe<Scalars["Multihash"]>;
};

export type CollectionMutMoveEntryArgs = {
    expectedHead?: InputMaybe<Scalars["Multihash"]>;
    extraData?: InputMaybe<Scalars["ExtraData"]>;
    pathFrom: Scalars["CollectionPath"];
    pathTo: Scalars["CollectionPath"];
};

export type CollectionMutRemoveEntryArgs = {
    expectedHead?: InputMaybe<Scalars["Multihash"]>;
    path: Scalars["CollectionPath"];
};

export type CollectionMutUpdateEntriesArgs = {
    expectedHead?: InputMaybe<Scalars["Multihash"]>;
    operations: Array<CollectionUpdateInput>;
};

export type CollectionProjection = {
    __typename?: "CollectionProjection";
    /**
     * Returns the state of entries as they existed at a specified point in
     * time
     */
    entries: CollectionEntryConnection;
    /** Find entries that link to specified DIDs */
    entriesByRef: Array<CollectionEntry>;
    /** Returns an entry at the specified path */
    entry?: Maybe<CollectionEntry>;
};

export type CollectionProjectionEntriesArgs = {
    maxDepth?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
    pathPrefix?: InputMaybe<Scalars["CollectionPath"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type CollectionProjectionEntriesByRefArgs = {
    refs: Array<Scalars["DatasetID"]>;
};

export type CollectionProjectionEntryArgs = {
    path: Scalars["CollectionPath"];
};

export type CollectionUpdateErrorCasFailed = CollectionUpdateResult & {
    __typename?: "CollectionUpdateErrorCasFailed";
    actualHead: Scalars["Multihash"];
    expectedHead: Scalars["Multihash"];
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type CollectionUpdateErrorNotFound = CollectionUpdateResult & {
    __typename?: "CollectionUpdateErrorNotFound";
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
    path: Scalars["CollectionPath"];
};

export type CollectionUpdateInput = {
    /**
     * Inserts a new entry under the specified path. If an entry at the target
     * path already exists, it will be retracted.
     */
    add?: InputMaybe<CollectionUpdateInputAdd>;
    /**
     * Retracts and appends an entry under the new path. Returns error if from
     * path does not exist. If an entry at the target path already exists, it
     * will be retracted. Use this to update extra data by specifying the same
     * source and target paths.
     */
    move?: InputMaybe<CollectionUpdateInputMove>;
    /** Removes the collection entry. Does nothing if entry does not exist. */
    remove?: InputMaybe<CollectionUpdateInputRemove>;
};

export type CollectionUpdateInputAdd = {
    entry: CollectionEntryInput;
};

export type CollectionUpdateInputMove = {
    /** Optionally update the extra data */
    extraData?: InputMaybe<Scalars["ExtraData"]>;
    pathFrom: Scalars["CollectionPath"];
    pathTo: Scalars["CollectionPath"];
};

export type CollectionUpdateInputRemove = {
    path: Scalars["CollectionPath"];
};

export type CollectionUpdateResult = {
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type CollectionUpdateSuccess = CollectionUpdateResult & {
    __typename?: "CollectionUpdateSuccess";
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
    newHead: Scalars["Multihash"];
    oldHead: Scalars["Multihash"];
};

export type CollectionUpdateUpToDate = CollectionUpdateResult & {
    __typename?: "CollectionUpdateUpToDate";
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

/** Defines a dataset column */
export type ColumnInput = {
    /** Column name */
    name: Scalars["String"];
    /** Column data type */
    type: DataTypeInput;
};

export type CommitResult = {
    message: Scalars["String"];
};

export type CommitResultAppendError = CommitResult &
    UpdateReadmeResult & {
        __typename?: "CommitResultAppendError";
        message: Scalars["String"];
    };

export type CommitResultSuccess = CommitResult &
    UpdateReadmeResult & {
        __typename?: "CommitResultSuccess";
        message: Scalars["String"];
        newHead: Scalars["Multihash"];
        oldHead?: Maybe<Scalars["Multihash"]>;
    };

export type CompareChainsResult = CompareChainsResultError | CompareChainsResultStatus;

export type CompareChainsResultError = {
    __typename?: "CompareChainsResultError";
    reason: CompareChainsResultReason;
};

export type CompareChainsResultReason = {
    __typename?: "CompareChainsResultReason";
    message: Scalars["String"];
};

export type CompareChainsResultStatus = {
    __typename?: "CompareChainsResultStatus";
    message: CompareChainsStatus;
};

export enum CompareChainsStatus {
    Ahead = "AHEAD",
    Behind = "BEHIND",
    Diverged = "DIVERGED",
    Equal = "EQUAL",
}

/**
 * Defines a compression algorithm.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#compressionformat-schema
 */
export enum CompressionFormat {
    Gzip = "GZIP",
    Zip = "ZIP",
}

export type CreateAccessTokenResultDuplicate = CreateTokenResult & {
    __typename?: "CreateAccessTokenResultDuplicate";
    message: Scalars["String"];
    tokenName: Scalars["String"];
};

export type CreateAccessTokenResultSuccess = CreateTokenResult & {
    __typename?: "CreateAccessTokenResultSuccess";
    message: Scalars["String"];
    token: CreatedAccessToken;
};

export type CreateAccountResult = {
    message: Scalars["String"];
};

export type CreateAccountSuccess = CreateAccountResult & {
    __typename?: "CreateAccountSuccess";
    account: Account;
    message: Scalars["String"];
};

export type CreateDatasetFromSnapshotResult = {
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type CreateDatasetResult = {
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type CreateDatasetResultInvalidSnapshot = CreateDatasetFromSnapshotResult & {
    __typename?: "CreateDatasetResultInvalidSnapshot";
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type CreateDatasetResultMissingInputs = CreateDatasetFromSnapshotResult & {
    __typename?: "CreateDatasetResultMissingInputs";
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
    missingInputs: Array<Scalars["String"]>;
};

export type CreateDatasetResultNameCollision = CreateDatasetFromSnapshotResult &
    CreateDatasetResult & {
        __typename?: "CreateDatasetResultNameCollision";
        accountName?: Maybe<Scalars["AccountName"]>;
        datasetName: Scalars["DatasetName"];
        isSuccess: Scalars["Boolean"];
        message: Scalars["String"];
    };

export type CreateDatasetResultSuccess = CreateDatasetFromSnapshotResult &
    CreateDatasetResult & {
        __typename?: "CreateDatasetResultSuccess";
        dataset: Dataset;
        isSuccess: Scalars["Boolean"];
        message: Scalars["String"];
    };

export type CreateTokenResult = {
    message: Scalars["String"];
};

export type CreateWalletAccountsResult = {
    message: Scalars["String"];
};

export type CreateWalletAccountsSuccess = CreateWalletAccountsResult & {
    __typename?: "CreateWalletAccountsSuccess";
    accounts: Array<Account>;
    message: Scalars["String"];
};

export type CreateWebhookSubscriptionResult = {
    message: Scalars["String"];
};

export type CreateWebhookSubscriptionResultSuccess = CreateWebhookSubscriptionResult & {
    __typename?: "CreateWebhookSubscriptionResultSuccess";
    message: Scalars["String"];
    secret: Scalars["String"];
    subscriptionId: Scalars["String"];
};

export type CreatedAccessToken = {
    __typename?: "CreatedAccessToken";
    /** Access token account owner */
    account: Account;
    /** Composed original token */
    composed: Scalars["String"];
    /** Unique identifier of the access token */
    id: Scalars["AccessTokenID"];
    /** Name of the access token */
    name: Scalars["String"];
};

export type Cron5ComponentExpression = {
    __typename?: "Cron5ComponentExpression";
    cron5ComponentExpression: Scalars["String"];
};

export type DataBatch = {
    __typename?: "DataBatch";
    content: Scalars["String"];
    format: DataBatchFormat;
    numRecords: Scalars["Int"];
};

export enum DataBatchFormat {
    Csv = "CSV",
    /**
     * Deprecated: Use `JSON_AOS` instead and expect it to become default in
     * future versions
     */
    Json = "JSON",
    JsonAoa = "JSON_AOA",
    JsonAos = "JSON_AOS",
    /** Deprecated: Use `ND_JSON` instead */
    JsonLd = "JSON_LD",
    JsonSoa = "JSON_SOA",
    NdJson = "ND_JSON",
}

export type DataQueries = {
    __typename?: "DataQueries";
    /** Lists engines known to the system and recommended for use */
    knownEngines: Array<EngineDesc>;
    /** Executes a specified query and returns its result */
    query: DataQueryResult;
};

export type DataQueriesQueryArgs = {
    dataFormat?: InputMaybe<DataBatchFormat>;
    limit?: InputMaybe<Scalars["Int"]>;
    query: Scalars["String"];
    queryDialect: QueryDialect;
    schemaFormat?: InputMaybe<DataSchemaFormat>;
    skip?: InputMaybe<Scalars["Int"]>;
};

export type DataQueryResult = DataQueryResultError | DataQueryResultSuccess;

export type DataQueryResultError = {
    __typename?: "DataQueryResultError";
    errorKind: DataQueryResultErrorKind;
    errorMessage: Scalars["String"];
};

export enum DataQueryResultErrorKind {
    InvalidSql = "INVALID_SQL",
}

export type DataQueryResultSuccess = {
    __typename?: "DataQueryResultSuccess";
    data: DataBatch;
    datasets: Array<DatasetState>;
    limit: Scalars["Int"];
    schema: DataSchema;
};

export type DataSchema = {
    __typename?: "DataSchema";
    content: Scalars["String"];
    format: DataSchemaFormat;
};

export enum DataSchemaFormat {
    ArrowJson = "ARROW_JSON",
    Parquet = "PARQUET",
    ParquetJson = "PARQUET_JSON",
}

/**
 * Describes a slice of data added to a dataset or produced via transformation
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#dataslice-schema
 */
export type DataSlice = {
    __typename?: "DataSlice";
    /** Logical hash sum of the data in this slice. */
    logicalHash: Scalars["Multihash"];
    /** Data slice produced by the transaction. */
    offsetInterval: OffsetInterval;
    /** Hash sum of the data part file. */
    physicalHash: Scalars["Multihash"];
    /** Size of data file in bytes. */
    size: Scalars["Int"];
};

export type DataTypeInput = {
    /** Defines type using DDL syntax */
    ddl: Scalars["String"];
};

export type Dataset = {
    __typename?: "Dataset";
    /** Returns dataset alias (user + name) */
    alias: Scalars["DatasetAlias"];
    /** Downcast a dataset to a collection interface */
    asCollection?: Maybe<Collection>;
    /** Downcast a dataset to a versioned file interface */
    asVersionedFile?: Maybe<VersionedFile>;
    /** Access to the dataset collaboration data */
    collaboration: DatasetCollaboration;
    /** Creation time of the first metadata block in the chain */
    createdAt: Scalars["DateTime"];
    /** Access to the data of the dataset */
    data: DatasetData;
    /** Various endpoints for interacting with data */
    endpoints: DatasetEndpoints;
    /** Access to the environment variable of this dataset */
    envVars: DatasetEnvVars;
    /** Access to the flow configurations of this dataset */
    flows: DatasetFlows;
    /** Quick access to `head` block hash */
    head: Scalars["Multihash"];
    /** Unique identifier of the dataset */
    id: Scalars["DatasetID"];
    /** Returns the kind of dataset (Root or Derivative) */
    kind: DatasetKind;
    /** Creation time of the most recent metadata block in the chain */
    lastUpdatedAt: Scalars["DateTime"];
    /** Access to the metadata of the dataset */
    metadata: DatasetMetadata;
    /**
     * Symbolic name of the dataset.
     * Name can change over the dataset's lifetime. For unique identifier use
     * `id()`.
     */
    name: Scalars["DatasetName"];
    /** Returns the user or organization that owns this dataset */
    owner: Account;
    /** Permissions of the current user */
    permissions: DatasetPermissions;
    /** Current user's role in relation to the dataset */
    role?: Maybe<DatasetAccessRole>;
    /** Returns the visibility of dataset */
    visibility: DatasetVisibilityOutput;
    /** Access to the dataset's webhooks management functionality */
    webhooks: DatasetWebhooks;
};

export enum DatasetAccessRole {
    /** Role allows modifying dataset data */
    Editor = "EDITOR",
    /** Role to maintain the dataset */
    Maintainer = "MAINTAINER",
    /** Role opening the possibility for read-only access */
    Reader = "READER",
}

export type DatasetCollaboration = {
    __typename?: "DatasetCollaboration";
    /** Accounts (and their roles) that have access to the dataset */
    accountRoles: AccountWithRoleConnection;
};

export type DatasetCollaborationAccountRolesArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type DatasetCollaborationMut = {
    __typename?: "DatasetCollaborationMut";
    /** Grant account access as the specified role for the dataset */
    setRole: SetRoleResult;
    /** Revoking account accesses for the dataset */
    unsetRoles: UnsetRoleResult;
};

export type DatasetCollaborationMutSetRoleArgs = {
    accountId: Scalars["AccountID"];
    role: DatasetAccessRole;
};

export type DatasetCollaborationMutUnsetRolesArgs = {
    accountIds: Array<Scalars["AccountID"]>;
};

export type DatasetCollaborationPermissions = {
    __typename?: "DatasetCollaborationPermissions";
    canUpdate: Scalars["Boolean"];
    canView: Scalars["Boolean"];
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
    /**
     * An estimated size of data on disk not accounting for replication or
     * caching
     */
    estimatedSize: Scalars["Int"];
    /** Total number of records in this dataset */
    numRecordsTotal: Scalars["Int"];
    /**
     * Returns the specified number of the latest records in the dataset
     * This is equivalent to SQL query like:
     *
     * ```text
     * select * from (
     * select
     * *
     * from dataset
     * order by offset desc
     * limit lim
     * offset skip
     * )
     * order by offset
     * ```
     */
    tail: DataQueryResult;
};

export type DatasetDataTailArgs = {
    dataFormat?: InputMaybe<DataBatchFormat>;
    limit?: InputMaybe<Scalars["Int"]>;
    schemaFormat?: InputMaybe<DataSchemaFormat>;
    skip?: InputMaybe<Scalars["Int"]>;
};

export type DatasetEdge = {
    __typename?: "DatasetEdge";
    node: Dataset;
};

export type DatasetEndpoints = {
    __typename?: "DatasetEndpoints";
    cli: CliProtocolDesc;
    flightsql: FlightSqlDesc;
    jdbc: JdbcDesc;
    kafka: KafkaProtocolDesc;
    odata: OdataProtocolDesc;
    postgresql: PostgreSqlDesl;
    rest: RestProtocolDesc;
    webLink: LinkProtocolDesc;
    websocket: WebSocketProtocolDesc;
};

export type DatasetEnvVars = {
    __typename?: "DatasetEnvVars";
    exposedValue: Scalars["String"];
    listEnvVariables: ViewDatasetEnvVarConnection;
};

export type DatasetEnvVarsExposedValueArgs = {
    datasetEnvVarId: Scalars["DatasetEnvVarID"];
};

export type DatasetEnvVarsListEnvVariablesArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type DatasetEnvVarsMut = {
    __typename?: "DatasetEnvVarsMut";
    deleteEnvVariable: DeleteDatasetEnvVarResult;
    upsertEnvVariable: UpsertDatasetEnvVarResult;
};

export type DatasetEnvVarsMutDeleteEnvVariableArgs = {
    id: Scalars["DatasetEnvVarID"];
};

export type DatasetEnvVarsMutUpsertEnvVariableArgs = {
    isSecret: Scalars["Boolean"];
    key: Scalars["String"];
    value: Scalars["String"];
};

export type DatasetEnvVarsPermissions = {
    __typename?: "DatasetEnvVarsPermissions";
    canUpdate: Scalars["Boolean"];
    canView: Scalars["Boolean"];
};

export type DatasetFlowConfigs = {
    __typename?: "DatasetFlowConfigs";
    /** Returns defined configuration for a flow of specified type */
    byType?: Maybe<FlowConfiguration>;
};

export type DatasetFlowConfigsByTypeArgs = {
    datasetFlowType: DatasetFlowType;
};

export type DatasetFlowConfigsMut = {
    __typename?: "DatasetFlowConfigsMut";
    setCompactionConfig: SetFlowConfigResult;
    setIngestConfig: SetFlowConfigResult;
};

export type DatasetFlowConfigsMutSetCompactionConfigArgs = {
    compactionConfigInput: FlowConfigCompactionInput;
};

export type DatasetFlowConfigsMutSetIngestConfigArgs = {
    ingestConfigInput: FlowConfigIngestInput;
    retryPolicyInput?: InputMaybe<FlowRetryPolicyInput>;
};

export type DatasetFlowFilters = {
    byFlowType?: InputMaybe<DatasetFlowType>;
    byInitiator?: InputMaybe<InitiatorFilterInput>;
    byStatus?: InputMaybe<FlowStatus>;
};

export type DatasetFlowRuns = {
    __typename?: "DatasetFlowRuns";
    getFlow: GetFlowResult;
    listFlowInitiators: AccountConnection;
    listFlows: FlowConnection;
};

export type DatasetFlowRunsGetFlowArgs = {
    flowId: Scalars["FlowID"];
};

export type DatasetFlowRunsListFlowsArgs = {
    filters?: InputMaybe<DatasetFlowFilters>;
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type DatasetFlowRunsMut = {
    __typename?: "DatasetFlowRunsMut";
    cancelScheduledTasks: CancelScheduledTasksResult;
    triggerCompactionFlow: TriggerFlowResult;
    triggerIngestFlow: TriggerFlowResult;
    triggerResetFlow: TriggerFlowResult;
    triggerResetToMetadataFlow: TriggerFlowResult;
    triggerTransformFlow: TriggerFlowResult;
};

export type DatasetFlowRunsMutCancelScheduledTasksArgs = {
    flowId: Scalars["FlowID"];
};

export type DatasetFlowRunsMutTriggerCompactionFlowArgs = {
    compactionConfigInput?: InputMaybe<FlowConfigCompactionInput>;
};

export type DatasetFlowRunsMutTriggerIngestFlowArgs = {
    ingestConfigInput?: InputMaybe<FlowConfigIngestInput>;
};

export type DatasetFlowRunsMutTriggerResetFlowArgs = {
    resetConfigInput?: InputMaybe<FlowConfigResetInput>;
};

export type DatasetFlowTriggers = {
    __typename?: "DatasetFlowTriggers";
    /** Checks if all triggers of this dataset are disabled */
    allPaused: Scalars["Boolean"];
    /** Returns defined trigger for a flow of specified type */
    byType?: Maybe<FlowTrigger>;
};

export type DatasetFlowTriggersByTypeArgs = {
    datasetFlowType: DatasetFlowType;
};

export type DatasetFlowTriggersMut = {
    __typename?: "DatasetFlowTriggersMut";
    pauseFlow: Scalars["Boolean"];
    pauseFlows: Scalars["Boolean"];
    resumeFlow: Scalars["Boolean"];
    resumeFlows: Scalars["Boolean"];
    setTrigger: SetFlowTriggerResult;
};

export type DatasetFlowTriggersMutPauseFlowArgs = {
    datasetFlowType: DatasetFlowType;
};

export type DatasetFlowTriggersMutResumeFlowArgs = {
    datasetFlowType: DatasetFlowType;
};

export type DatasetFlowTriggersMutSetTriggerArgs = {
    datasetFlowType: DatasetFlowType;
    paused: Scalars["Boolean"];
    triggerInput: FlowTriggerInput;
};

export enum DatasetFlowType {
    ExecuteTransform = "EXECUTE_TRANSFORM",
    HardCompaction = "HARD_COMPACTION",
    Ingest = "INGEST",
    Reset = "RESET",
    ResetToMetadata = "RESET_TO_METADATA",
}

export type DatasetFlows = {
    __typename?: "DatasetFlows";
    /** Returns interface for flow configurations queries */
    configs: DatasetFlowConfigs;
    /** Returns interface for flow runs queries */
    runs: DatasetFlowRuns;
    /** Returns interface for flow triggers queries */
    triggers: DatasetFlowTriggers;
};

export type DatasetFlowsMut = {
    __typename?: "DatasetFlowsMut";
    configs: DatasetFlowConfigsMut;
    runs: DatasetFlowRunsMut;
    triggers: DatasetFlowTriggersMut;
};

export type DatasetFlowsPermissions = {
    __typename?: "DatasetFlowsPermissions";
    canRun: Scalars["Boolean"];
    canView: Scalars["Boolean"];
};

export type DatasetGeneralPermissions = {
    __typename?: "DatasetGeneralPermissions";
    canDelete: Scalars["Boolean"];
    canRename: Scalars["Boolean"];
    canSetVisibility: Scalars["Boolean"];
};

/**
 * Represents type of the dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#datasetkind-schema
 */
export enum DatasetKind {
    Derivative = "DERIVATIVE",
    Root = "ROOT",
}

export type DatasetMetadata = {
    __typename?: "DatasetMetadata";
    /** Access to the temporal metadata chain of the dataset */
    chain: MetadataChain;
    /** Current downstream dependencies of a dataset */
    currentDownstreamDependencies: Array<DependencyDatasetResult>;
    /** Current descriptive information about the dataset */
    currentInfo: SetInfo;
    /** Current license associated with the dataset */
    currentLicense?: Maybe<SetLicense>;
    /** Current polling source used by the root dataset */
    currentPollingSource?: Maybe<SetPollingSource>;
    /** Current push sources used by the root dataset */
    currentPushSources: Array<AddPushSource>;
    /**
     * Current readme file as discovered from attachments associated with the
     * dataset
     */
    currentReadme?: Maybe<Scalars["String"]>;
    /** Latest data schema */
    currentSchema?: Maybe<DataSchema>;
    /** Current transformation used by the derivative dataset */
    currentTransform?: Maybe<SetTransform>;
    /** Current upstream dependencies of a dataset */
    currentUpstreamDependencies: Array<DependencyDatasetResult>;
    /** Current vocabulary associated with the dataset */
    currentVocab?: Maybe<SetVocab>;
    /** Last recorded watermark */
    currentWatermark?: Maybe<Scalars["DateTime"]>;
    metadataProjection: Array<MetadataBlockExtended>;
    /** Sync statuses of push remotes */
    pushSyncStatuses: DatasetPushStatuses;
};

export type DatasetMetadataCurrentSchemaArgs = {
    format?: InputMaybe<DataSchemaFormat>;
};

export type DatasetMetadataMetadataProjectionArgs = {
    eventTypes: Array<MetadataEventType>;
    head?: InputMaybe<Scalars["Multihash"]>;
};

export type DatasetMetadataMut = {
    __typename?: "DatasetMetadataMut";
    /** Access to the mutable metadata chain of the dataset */
    chain: MetadataChainMut;
    /** Updates or clears the dataset readme */
    updateReadme: UpdateReadmeResult;
};

export type DatasetMetadataMutUpdateReadmeArgs = {
    content?: InputMaybe<Scalars["String"]>;
};

export type DatasetMetadataPermissions = {
    __typename?: "DatasetMetadataPermissions";
    canCommit: Scalars["Boolean"];
};

export type DatasetMut = {
    __typename?: "DatasetMut";
    /** Downcast a dataset to a collection interface */
    asCollection?: Maybe<CollectionMut>;
    /** Downcast a dataset to a versioned file interface */
    asVersionedFile?: Maybe<VersionedFileMut>;
    /** Access to collaboration management methods */
    collaboration: DatasetCollaborationMut;
    /** Delete the dataset */
    delete: DeleteResult;
    /** Access to the mutable flow configurations of this dataset */
    envVars: DatasetEnvVarsMut;
    /** Access to the mutable flow configurations of this dataset */
    flows: DatasetFlowsMut;
    /** Access to the mutable metadata of the dataset */
    metadata: DatasetMetadataMut;
    /** Rename the dataset */
    rename: RenameResult;
    /** Set visibility for the dataset */
    setVisibility: SetDatasetVisibilityResult;
    /** Manually advances the watermark of a root dataset */
    setWatermark: SetWatermarkResult;
    /** Access to webhooks management methods */
    webhooks: DatasetWebhooksMut;
};

export type DatasetMutRenameArgs = {
    newName: Scalars["DatasetName"];
};

export type DatasetMutSetVisibilityArgs = {
    visibility: DatasetVisibilityInput;
};

export type DatasetMutSetWatermarkArgs = {
    watermark: Scalars["DateTime"];
};

export type DatasetPermissions = {
    __typename?: "DatasetPermissions";
    collaboration: DatasetCollaborationPermissions;
    envVars: DatasetEnvVarsPermissions;
    flows: DatasetFlowsPermissions;
    general: DatasetGeneralPermissions;
    metadata: DatasetMetadataPermissions;
    webhooks: DatasetWebhooksPermissions;
};

export type DatasetPushStatus = {
    __typename?: "DatasetPushStatus";
    remote: Scalars["DatasetRefRemote"];
    result: CompareChainsResult;
};

export type DatasetPushStatuses = {
    __typename?: "DatasetPushStatuses";
    statuses: Array<DatasetPushStatus>;
};

export type DatasetRoleOperation =
    | { set: DatasetRoleSetOperation; unset?: never }
    | { set?: never; unset: DatasetRoleUnsetOperation };

export type DatasetRoleSetOperation = {
    role: DatasetAccessRole;
};

export type DatasetRoleUnsetOperation = {
    dummy: Scalars["Boolean"];
};

export type DatasetState = {
    __typename?: "DatasetState";
    /** Alias to be used in the query */
    alias: Scalars["String"];
    /**
     * Last block hash of the input datasets that was or should be considered
     * during the query planning
     */
    blockHash?: Maybe<Scalars["Multihash"]>;
    /** Globally unique identity of the dataset */
    id: Scalars["DatasetID"];
};

export enum DatasetVisibility {
    Private = "PRIVATE",
    Public = "PUBLIC",
}

export type DatasetVisibilityInput =
    | { private: PrivateDatasetVisibilityInput; public?: never }
    | { private?: never; public: PublicDatasetVisibilityInput };

export type DatasetVisibilityOutput = PrivateDatasetVisibility | PublicDatasetVisibility;

export type DatasetWebhooks = {
    __typename?: "DatasetWebhooks";
    /** Returns a webhook subscription by ID */
    subscription?: Maybe<WebhookSubscription>;
    /** Lists all webhook subscriptions for the dataset */
    subscriptions: Array<WebhookSubscription>;
};

export type DatasetWebhooksSubscriptionArgs = {
    id: Scalars["WebhookSubscriptionID"];
};

export type DatasetWebhooksMut = {
    __typename?: "DatasetWebhooksMut";
    createSubscription: CreateWebhookSubscriptionResult;
    /** Returns a webhook subscription management API by ID */
    subscription?: Maybe<WebhookSubscriptionMut>;
};

export type DatasetWebhooksMutCreateSubscriptionArgs = {
    input: WebhookSubscriptionInput;
};

export type DatasetWebhooksMutSubscriptionArgs = {
    id: Scalars["WebhookSubscriptionID"];
};

export type DatasetWebhooksPermissions = {
    __typename?: "DatasetWebhooksPermissions";
    canUpdate: Scalars["Boolean"];
    canView: Scalars["Boolean"];
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

export type DatasetsMut = {
    __typename?: "DatasetsMut";
    /** Returns a mutable dataset by its ID */
    byId?: Maybe<DatasetMut>;
    /**
     * Creates a new collection dataset.
     * Can include schema for extra columns, dataset metadata, and initial
     * collection entries.
     */
    createCollection: CreateDatasetFromSnapshotResult;
    /** Creates a new empty dataset */
    createEmpty: CreateDatasetResult;
    /** Creates a new dataset from provided DatasetSnapshot manifest */
    createFromSnapshot: CreateDatasetFromSnapshotResult;
    /**
     * Creates new versioned file dataset.
     * Can include schema for extra columns and dataset metadata events (e.g.
     * adding description and readme).
     */
    createVersionedFile: CreateDatasetFromSnapshotResult;
};

export type DatasetsMutByIdArgs = {
    datasetId: Scalars["DatasetID"];
};

export type DatasetsMutCreateCollectionArgs = {
    datasetAlias: Scalars["DatasetAlias"];
    datasetVisibility: DatasetVisibility;
    extraColumns?: InputMaybe<Array<ColumnInput>>;
    extraEvents?: InputMaybe<Array<Scalars["String"]>>;
    extraEventsFormat?: InputMaybe<MetadataManifestFormat>;
};

export type DatasetsMutCreateEmptyArgs = {
    datasetAlias: Scalars["DatasetAlias"];
    datasetKind: DatasetKind;
    datasetVisibility: DatasetVisibility;
};

export type DatasetsMutCreateFromSnapshotArgs = {
    datasetVisibility: DatasetVisibility;
    snapshot: Scalars["String"];
    snapshotFormat: MetadataManifestFormat;
};

export type DatasetsMutCreateVersionedFileArgs = {
    datasetAlias: Scalars["DatasetAlias"];
    datasetVisibility: DatasetVisibility;
    extraColumns?: InputMaybe<Array<ColumnInput>>;
    extraEvents?: InputMaybe<Array<Scalars["String"]>>;
    extraEventsFormat?: InputMaybe<MetadataManifestFormat>;
};

export type DeleteAccountResult = {
    message: Scalars["String"];
};

export type DeleteAccountSuccess = DeleteAccountResult & {
    __typename?: "DeleteAccountSuccess";
    message: Scalars["String"];
};

export type DeleteDatasetEnvVarResult = {
    message: Scalars["String"];
};

export type DeleteDatasetEnvVarResultNotFound = DeleteDatasetEnvVarResult & {
    __typename?: "DeleteDatasetEnvVarResultNotFound";
    envVarId: Scalars["DatasetEnvVarID"];
    message: Scalars["String"];
};

export type DeleteDatasetEnvVarResultSuccess = DeleteDatasetEnvVarResult & {
    __typename?: "DeleteDatasetEnvVarResultSuccess";
    envVarId: Scalars["DatasetEnvVarID"];
    message: Scalars["String"];
};

export type DeleteResult = {
    message: Scalars["String"];
};

export type DeleteResultDanglingReference = DeleteResult & {
    __typename?: "DeleteResultDanglingReference";
    danglingChildRefs: Array<Scalars["DatasetRef"]>;
    message: Scalars["String"];
    notDeletedDataset: Scalars["DatasetAlias"];
};

export type DeleteResultSuccess = DeleteResult & {
    __typename?: "DeleteResultSuccess";
    deletedDataset: Scalars["DatasetAlias"];
    message: Scalars["String"];
};

export type DependencyDatasetResult = {
    message: Scalars["String"];
};

export type DependencyDatasetResultAccessible = DependencyDatasetResult & {
    __typename?: "DependencyDatasetResultAccessible";
    dataset: Dataset;
    message: Scalars["String"];
};

export type DependencyDatasetResultNotAccessible = DependencyDatasetResult & {
    __typename?: "DependencyDatasetResultNotAccessible";
    id: Scalars["DatasetID"];
    message: Scalars["String"];
};

/**
 * Disables the previously defined polling source.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#disablepollingsource-schema
 */
export type DisablePollingSource = {
    __typename?: "DisablePollingSource";
    dummy?: Maybe<Scalars["String"]>;
};

/**
 * Disables the previously defined source.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#disablepushsource-schema
 */
export type DisablePushSource = {
    __typename?: "DisablePushSource";
    /** Identifies the source to be disabled. */
    sourceName: Scalars["String"];
};

export type Eip4361AuthNonceResponse = {
    __typename?: "Eip4361AuthNonceResponse";
    value: Scalars["Eip4361AuthNonce"];
};

export type EncodedBlock = {
    __typename?: "EncodedBlock";
    content: Scalars["String"];
    encoding: MetadataManifestFormat;
};

export type EngineDesc = {
    __typename?: "EngineDesc";
    /**
     * Language and dialect this engine is using for queries
     * Indented for configuring code highlighting and completions.
     */
    dialect: QueryDialect;
    /**
     * OCI image repository and a tag of the latest engine image, e.g.
     * "ghcr.io/kamu-data/engine-datafusion:0.1.2"
     */
    latestImage: Scalars["String"];
    /**
     * A short name of the engine, e.g. "Spark", "Flink".
     * Intended for use in UI for quick engine identification and selection.
     */
    name: Scalars["String"];
};

/**
 * Defines an environment variable passed into some job.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#envvar-schema
 */
export type EnvVar = {
    __typename?: "EnvVar";
    /** Name of the variable. */
    name: Scalars["String"];
    /** Value of the variable. */
    value?: Maybe<Scalars["String"]>;
};

/**
 * Defines the external source of data.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#eventtimesource-schema
 */
export type EventTimeSource = EventTimeSourceFromMetadata | EventTimeSourceFromPath | EventTimeSourceFromSystemTime;

/**
 * Extracts event time from the source's metadata.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#eventtimesourcefrommetadata-schema
 */
export type EventTimeSourceFromMetadata = {
    __typename?: "EventTimeSourceFromMetadata";
    dummy?: Maybe<Scalars["String"]>;
};

/**
 * Extracts event time from the path component of the source.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#eventtimesourcefrompath-schema
 */
export type EventTimeSourceFromPath = {
    __typename?: "EventTimeSourceFromPath";
    /** Regular expression where first group contains the timestamp string. */
    pattern: Scalars["String"];
    /** Format of the expected timestamp in java.text.SimpleDateFormat form. */
    timestampFormat?: Maybe<Scalars["String"]>;
};

/**
 * Assigns event time from the system time source.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#eventtimesourcefromsystemtime-schema
 */
export type EventTimeSourceFromSystemTime = {
    __typename?: "EventTimeSourceFromSystemTime";
    dummy?: Maybe<Scalars["String"]>;
};

/**
 * Indicates that derivative transformation has been performed.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#executetransform-schema
 */
export type ExecuteTransform = {
    __typename?: "ExecuteTransform";
    /**
     * Describes checkpoint written during this transaction, if any. If an
     * engine operation resulted in no updates to the checkpoint, but
     * checkpoint is still relevant for subsequent runs - a hash of the
     * previous checkpoint should be specified.
     */
    newCheckpoint?: Maybe<Checkpoint>;
    /** Describes output data written during this transaction, if any. */
    newData?: Maybe<DataSlice>;
    /**
     * Last watermark of the output data stream, if any. Initial blocks may not
     * have watermarks, but once watermark is set - all subsequent blocks
     * should either carry the same watermark or specify a new (greater) one.
     * Thus, watermarks are monotonically non-decreasing.
     */
    newWatermark?: Maybe<Scalars["DateTime"]>;
    /**
     * Hash of the checkpoint file used to restore transformation state, if
     * any.
     */
    prevCheckpoint?: Maybe<Scalars["Multihash"]>;
    /**
     * Last offset of the previous data slice, if any. Must be equal to the
     * last non-empty `newData.offsetInterval.end`.
     */
    prevOffset?: Maybe<Scalars["Int"]>;
    /**
     * Defines inputs used in this transaction. Slices corresponding to every
     * input dataset must be present.
     */
    queryInputs: Array<ExecuteTransformInput>;
};

/**
 * Describes a slice of the input dataset used during a transformation
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#executetransforminput-schema
 */
export type ExecuteTransformInput = {
    __typename?: "ExecuteTransformInput";
    /** Input dataset identifier. */
    datasetId: Scalars["DatasetID"];
    /**
     * Hash of the last block that will be incorporated into the derivative
     * transformation. When present, defines a half-open `(prevBlockHash,
     * newBlockHash]` interval of blocks that will be considered in this
     * transaction.
     */
    newBlockHash?: Maybe<Scalars["Multihash"]>;
    /**
     * Offset of the last data record that will be incorporated into the
     * derivative transformation, if any. When present, defines a half-open
     * `(prevOffset, newOffset]` interval of data records that will be
     * considered in this transaction.
     */
    newOffset?: Maybe<Scalars["Int"]>;
    /**
     * Last block of the input dataset that was previously incorporated into
     * the derivative transformation, if any. Must be equal to the last
     * non-empty `newBlockHash`. Together with `newBlockHash` defines a
     * half-open `(prevBlockHash, newBlockHash]` interval of blocks that will
     * be considered in this transaction.
     */
    prevBlockHash?: Maybe<Scalars["Multihash"]>;
    /**
     * Last data record offset in the input dataset that was previously
     * incorporated into the derivative transformation, if any. Must be equal
     * to the last non-empty `newOffset`. Together with `newOffset` defines a
     * half-open `(prevOffset, newOffset]` interval of data records that will
     * be considered in this transaction.
     */
    prevOffset?: Maybe<Scalars["Int"]>;
};

/**
 * Defines the external source of data.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#fetchstep-schema
 */
export type FetchStep = FetchStepContainer | FetchStepEthereumLogs | FetchStepFilesGlob | FetchStepMqtt | FetchStepUrl;

/**
 * Runs the specified OCI container to fetch data from an arbitrary source.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#fetchstepcontainer-schema
 */
export type FetchStepContainer = {
    __typename?: "FetchStepContainer";
    /**
     * Arguments to the entrypoint. The OCI image's CMD is used if this is not
     * provided.
     */
    args?: Maybe<Array<Scalars["String"]>>;
    /**
     * Specifies the entrypoint. Not executed within a shell. The default OCI
     * image's ENTRYPOINT is used if this is not provided.
     */
    command?: Maybe<Array<Scalars["String"]>>;
    /** Environment variables to propagate into or set in the container. */
    env?: Maybe<Array<EnvVar>>;
    /** Image name and and an optional tag. */
    image: Scalars["String"];
};

/**
 * Connects to an Ethereum node to stream transaction logs.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#fetchstepethereumlogs-schema
 */
export type FetchStepEthereumLogs = {
    __typename?: "FetchStepEthereumLogs";
    /**
     * Identifier of the chain to scan logs from. This parameter may be used
     * for RPC endpoint lookup as well as asserting that provided `nodeUrl`
     * corresponds to the expected chain.
     */
    chainId?: Maybe<Scalars["Int"]>;
    /**
     * An SQL WHERE clause that can be used to pre-filter the logs before
     * fetching them from the ETH node.
     *
     * Examples:
     * - "block_number > 123 and address =
     * X'5fbdb2315678afecb367f032d93f642f64180aa3' and topic1 =
     * X'000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266'"
     */
    filter?: Maybe<Scalars["String"]>;
    /** Url of the node. */
    nodeUrl?: Maybe<Scalars["String"]>;
    /**
     * Solidity log event signature to use for decoding. Using this field adds
     * `event` to the output containing decoded log as JSON.
     */
    signature?: Maybe<Scalars["String"]>;
};

/**
 * Uses glob operator to match files on the local file system.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#fetchstepfilesglob-schema
 */
export type FetchStepFilesGlob = {
    __typename?: "FetchStepFilesGlob";
    /** Describes the caching settings used for this source. */
    cache?: Maybe<SourceCaching>;
    /** Describes how event time is extracted from the source metadata. */
    eventTime?: Maybe<EventTimeSource>;
    /**
     * Specifies how input files should be ordered before ingestion.
     * Order is important as every file will be processed individually
     * and will advance the dataset's watermark.
     */
    order?: Maybe<SourceOrdering>;
    /** Path with a glob pattern. */
    path: Scalars["String"];
};

/**
 * Connects to an MQTT broker to fetch events from the specified topic.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#fetchstepmqtt-schema
 */
export type FetchStepMqtt = {
    __typename?: "FetchStepMqtt";
    /** Hostname of the MQTT broker. */
    host: Scalars["String"];
    /** Password to use for auth with the broker (can be templated). */
    password?: Maybe<Scalars["String"]>;
    /** Port of the MQTT broker. */
    port: Scalars["Int"];
    /** List of topic subscription parameters. */
    topics: Array<MqttTopicSubscription>;
    /** Username to use for auth with the broker. */
    username?: Maybe<Scalars["String"]>;
};

/**
 * Pulls data from one of the supported sources by its URL.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#fetchstepurl-schema
 */
export type FetchStepUrl = {
    __typename?: "FetchStepUrl";
    /** Describes the caching settings used for this source. */
    cache?: Maybe<SourceCaching>;
    /** Describes how event time is extracted from the source metadata. */
    eventTime?: Maybe<EventTimeSource>;
    /** Headers to pass during the request (e.g. HTTP Authorization) */
    headers?: Maybe<Array<RequestHeader>>;
    /** URL of the data source */
    url: Scalars["String"];
};

export type FlightSqlDesc = {
    __typename?: "FlightSqlDesc";
    url: Scalars["String"];
};

export type Flow = {
    __typename?: "Flow";
    /** Flow config snapshot */
    configSnapshot?: Maybe<FlowConfigRule>;
    /** Associated dataset ID, if any */
    datasetId?: Maybe<Scalars["DatasetID"]>;
    /** Description of key flow parameters */
    description: FlowDescription;
    /** Unique identifier of the flow */
    flowId: Scalars["FlowID"];
    /** History of flow events */
    history: Array<FlowEvent>;
    /** A user, who initiated the flow run. None for system-initiated flows */
    initiator?: Maybe<Account>;
    /** Outcome of the flow (Finished state only) */
    outcome?: Maybe<FlowOutcome>;
    /** Primary flow activation cause */
    primaryActivationCause: FlowActivationCause;
    /** Flow retry policy */
    retryPolicy?: Maybe<FlowRetryPolicy>;
    /** Start condition */
    startCondition?: Maybe<FlowStartCondition>;
    /** Status of the flow */
    status: FlowStatus;
    /** IDs of associated tasks */
    taskIds: Array<Scalars["TaskID"]>;
    /** Timing records associated with the flow lifecycle */
    timing: FlowTimingRecords;
};

export type FlowAbortedResult = {
    __typename?: "FlowAbortedResult";
    message: Scalars["String"];
};

export type FlowActivationCause =
    | FlowActivationCauseAutoPolling
    | FlowActivationCauseDatasetUpdate
    | FlowActivationCauseManual;

export type FlowActivationCauseAutoPolling = {
    __typename?: "FlowActivationCauseAutoPolling";
    dummy: Scalars["Boolean"];
};

export type FlowActivationCauseDatasetUpdate = {
    __typename?: "FlowActivationCauseDatasetUpdate";
    dataset: Dataset;
    source: FlowActivationCauseDatasetUpdateSource;
};

export type FlowActivationCauseDatasetUpdateSource =
    | FlowActivationCauseDatasetUpdateSourceHttpIngest
    | FlowActivationCauseDatasetUpdateSourceSmartProtocolPush
    | FlowActivationCauseDatasetUpdateSourceUpstreamFlow;

export type FlowActivationCauseDatasetUpdateSourceHttpIngest = {
    __typename?: "FlowActivationCauseDatasetUpdateSourceHttpIngest";
    sourceName?: Maybe<Scalars["String"]>;
};

export type FlowActivationCauseDatasetUpdateSourceSmartProtocolPush = {
    __typename?: "FlowActivationCauseDatasetUpdateSourceSmartProtocolPush";
    accountName?: Maybe<Scalars["AccountName"]>;
    isForce: Scalars["Boolean"];
};

export type FlowActivationCauseDatasetUpdateSourceUpstreamFlow = {
    __typename?: "FlowActivationCauseDatasetUpdateSourceUpstreamFlow";
    flowId: Scalars["FlowID"];
};

export type FlowActivationCauseManual = {
    __typename?: "FlowActivationCauseManual";
    initiator: Account;
};

export type FlowConfigCompactionInput = {
    maxSliceRecords: Scalars["Int"];
    maxSliceSize: Scalars["Int"];
};

export type FlowConfigIngestInput = {
    /** Flag indicates to ignore cache during ingest step for API calls */
    fetchUncacheable: Scalars["Boolean"];
};

export type FlowConfigInputResetPropagationMode =
    | { custom: FlowConfigInputResetPropagationModeCustom; toSeed?: never }
    | { custom?: never; toSeed: FlowConfigInputResetPropagationModeToSeed };

export type FlowConfigInputResetPropagationModeCustom = {
    newHeadHash: Scalars["Multihash"];
};

export type FlowConfigInputResetPropagationModeToSeed = {
    dummy?: InputMaybe<Scalars["String"]>;
};

export type FlowConfigResetInput = {
    mode: FlowConfigInputResetPropagationMode;
    oldHeadHash?: InputMaybe<Scalars["Multihash"]>;
};

export type FlowConfigResetPropagationMode =
    | FlowConfigResetPropagationModeCustom
    | FlowConfigResetPropagationModeToSeed;

export type FlowConfigResetPropagationModeCustom = {
    __typename?: "FlowConfigResetPropagationModeCustom";
    newHeadHash: Scalars["Multihash"];
};

export type FlowConfigResetPropagationModeToSeed = {
    __typename?: "FlowConfigResetPropagationModeToSeed";
    dummy?: Maybe<Scalars["String"]>;
};

export type FlowConfigRule = FlowConfigRuleCompaction | FlowConfigRuleIngest | FlowConfigRuleReset;

export type FlowConfigRuleCompaction = {
    __typename?: "FlowConfigRuleCompaction";
    maxSliceRecords: Scalars["Int"];
    maxSliceSize: Scalars["Int"];
};

export type FlowConfigRuleIngest = {
    __typename?: "FlowConfigRuleIngest";
    fetchUncacheable: Scalars["Boolean"];
};

export type FlowConfigRuleReset = {
    __typename?: "FlowConfigRuleReset";
    mode: FlowConfigResetPropagationMode;
    oldHeadHash?: Maybe<Scalars["Multihash"]>;
};

export type FlowConfigSnapshotModified = FlowEvent & {
    __typename?: "FlowConfigSnapshotModified";
    configSnapshot: FlowConfigRule;
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
};

export type FlowConfiguration = {
    __typename?: "FlowConfiguration";
    retryPolicy?: Maybe<FlowRetryPolicy>;
    rule: FlowConfigRule;
};

export type FlowConnection = {
    __typename?: "FlowConnection";
    edges: Array<FlowEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<Flow>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type FlowDescription =
    | FlowDescriptionDatasetExecuteTransform
    | FlowDescriptionDatasetHardCompaction
    | FlowDescriptionDatasetPollingIngest
    | FlowDescriptionDatasetPushIngest
    | FlowDescriptionDatasetReset
    | FlowDescriptionDatasetResetToMetadata
    | FlowDescriptionSystemGc
    | FlowDescriptionUnknown
    | FlowDescriptionWebhookDeliver;

export type FlowDescriptionDatasetExecuteTransform = {
    __typename?: "FlowDescriptionDatasetExecuteTransform";
    transform: SetTransform;
    transformResult?: Maybe<FlowDescriptionUpdateResult>;
};

export type FlowDescriptionDatasetHardCompaction = {
    __typename?: "FlowDescriptionDatasetHardCompaction";
    compactionResult?: Maybe<FlowDescriptionDatasetReorganizationResult>;
};

export type FlowDescriptionDatasetPollingIngest = {
    __typename?: "FlowDescriptionDatasetPollingIngest";
    ingestResult?: Maybe<FlowDescriptionUpdateResult>;
    pollingSource: SetPollingSource;
};

export type FlowDescriptionDatasetPushIngest = {
    __typename?: "FlowDescriptionDatasetPushIngest";
    ingestResult?: Maybe<FlowDescriptionUpdateResult>;
    message: Scalars["String"];
    sourceName?: Maybe<Scalars["String"]>;
};

export type FlowDescriptionDatasetReorganizationResult =
    | FlowDescriptionReorganizationNothingToDo
    | FlowDescriptionReorganizationSuccess;

export type FlowDescriptionDatasetReset = {
    __typename?: "FlowDescriptionDatasetReset";
    resetResult?: Maybe<FlowDescriptionResetResult>;
};

export type FlowDescriptionDatasetResetToMetadata = {
    __typename?: "FlowDescriptionDatasetResetToMetadata";
    resetToMetadataResult?: Maybe<FlowDescriptionDatasetReorganizationResult>;
};

export type FlowDescriptionReorganizationNothingToDo = {
    __typename?: "FlowDescriptionReorganizationNothingToDo";
    dummy?: Maybe<Scalars["String"]>;
    message: Scalars["String"];
};

export type FlowDescriptionReorganizationSuccess = {
    __typename?: "FlowDescriptionReorganizationSuccess";
    newHead: Scalars["Multihash"];
    originalBlocksCount: Scalars["Int"];
    resultingBlocksCount: Scalars["Int"];
};

export type FlowDescriptionResetResult = {
    __typename?: "FlowDescriptionResetResult";
    newHead: Scalars["Multihash"];
};

export type FlowDescriptionSystemGc = {
    __typename?: "FlowDescriptionSystemGC";
    dummy: Scalars["Boolean"];
};

export type FlowDescriptionUnknown = {
    __typename?: "FlowDescriptionUnknown";
    message: Scalars["String"];
};

export type FlowDescriptionUpdateResult =
    | FlowDescriptionUpdateResultSuccess
    | FlowDescriptionUpdateResultUnknown
    | FlowDescriptionUpdateResultUpToDate;

export type FlowDescriptionUpdateResultSuccess = {
    __typename?: "FlowDescriptionUpdateResultSuccess";
    numBlocks: Scalars["Int"];
    numRecords: Scalars["Int"];
    updatedWatermark?: Maybe<Scalars["DateTime"]>;
};

export type FlowDescriptionUpdateResultUnknown = {
    __typename?: "FlowDescriptionUpdateResultUnknown";
    message: Scalars["String"];
};

export type FlowDescriptionUpdateResultUpToDate = {
    __typename?: "FlowDescriptionUpdateResultUpToDate";
    /** The value indicates whether the api cache was used */
    uncacheable: Scalars["Boolean"];
};

export type FlowDescriptionWebhookDeliver = {
    __typename?: "FlowDescriptionWebhookDeliver";
    eventType: Scalars["String"];
    label: Scalars["String"];
    targetUrl: Scalars["Url"];
};

export type FlowEdge = {
    __typename?: "FlowEdge";
    node: Flow;
};

export type FlowEvent = {
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
};

export type FlowEventAborted = FlowEvent & {
    __typename?: "FlowEventAborted";
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
};

export type FlowEventActivationCauseAdded = FlowEvent & {
    __typename?: "FlowEventActivationCauseAdded";
    activationCause: FlowActivationCause;
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
};

export type FlowEventInitiated = FlowEvent & {
    __typename?: "FlowEventInitiated";
    activationCause: FlowActivationCause;
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
};

export type FlowEventScheduledForActivation = FlowEvent & {
    __typename?: "FlowEventScheduledForActivation";
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
    scheduledForActivationAt: Scalars["DateTime"];
};

export type FlowEventStartConditionUpdated = FlowEvent & {
    __typename?: "FlowEventStartConditionUpdated";
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
    startCondition: FlowStartCondition;
};

export type FlowEventTaskChanged = FlowEvent & {
    __typename?: "FlowEventTaskChanged";
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
    nextAttemptAt?: Maybe<Scalars["DateTime"]>;
    task: Task;
    taskId: Scalars["TaskID"];
    taskStatus: TaskStatus;
};

export type FlowFailedError = {
    __typename?: "FlowFailedError";
    reason: TaskFailureReason;
};

export type FlowIncompatibleDatasetKind = SetFlowConfigResult &
    SetFlowTriggerResult &
    TriggerFlowResult & {
        __typename?: "FlowIncompatibleDatasetKind";
        actualDatasetKind: DatasetKind;
        expectedDatasetKind: DatasetKind;
        message: Scalars["String"];
    };

export type FlowInvalidConfigInputError = SetFlowConfigResult & {
    __typename?: "FlowInvalidConfigInputError";
    message: Scalars["String"];
    reason: Scalars["String"];
};

export type FlowInvalidRunConfigurations = TriggerFlowResult & {
    __typename?: "FlowInvalidRunConfigurations";
    error: Scalars["String"];
    message: Scalars["String"];
};

export type FlowInvalidTriggerInputError = SetFlowTriggerResult & {
    __typename?: "FlowInvalidTriggerInputError";
    message: Scalars["String"];
    reason: Scalars["String"];
};

export type FlowNotFound = CancelScheduledTasksResult &
    GetFlowResult & {
        __typename?: "FlowNotFound";
        flowId: Scalars["FlowID"];
        message: Scalars["String"];
    };

export type FlowOutcome = FlowAbortedResult | FlowFailedError | FlowSuccessResult;

export type FlowPreconditionsNotMet = SetFlowConfigResult &
    SetFlowTriggerResult &
    TriggerFlowResult & {
        __typename?: "FlowPreconditionsNotMet";
        message: Scalars["String"];
        preconditions: Scalars["String"];
    };

export enum FlowRetryBackoffType {
    Exponential = "EXPONENTIAL",
    ExponentialWithJitter = "EXPONENTIAL_WITH_JITTER",
    Fixed = "FIXED",
    Linear = "LINEAR",
}

export type FlowRetryPolicy = {
    __typename?: "FlowRetryPolicy";
    backoffType: FlowRetryBackoffType;
    maxAttempts: Scalars["Int"];
    minDelay: TimeDelta;
};

export type FlowRetryPolicyInput = {
    backoffType: FlowRetryBackoffType;
    maxAttempts: Scalars["Int"];
    minDelay: TimeDeltaInput;
};

export type FlowStartCondition =
    | FlowStartConditionExecutor
    | FlowStartConditionReactive
    | FlowStartConditionSchedule
    | FlowStartConditionThrottling;

export type FlowStartConditionExecutor = {
    __typename?: "FlowStartConditionExecutor";
    taskId: Scalars["TaskID"];
};

export type FlowStartConditionReactive = {
    __typename?: "FlowStartConditionReactive";
    accumulatedRecordsCount: Scalars["Int"];
    activeBatchingRule: FlowTriggerBatchingRule;
    batchingDeadline: Scalars["DateTime"];
    forBreakingChange: BreakingChangeRule;
    watermarkModified: Scalars["Boolean"];
};

export type FlowStartConditionSchedule = {
    __typename?: "FlowStartConditionSchedule";
    wakeUpAt: Scalars["DateTime"];
};

export type FlowStartConditionThrottling = {
    __typename?: "FlowStartConditionThrottling";
    intervalSec: Scalars["Int"];
    shiftedFrom: Scalars["DateTime"];
    wakeUpAt: Scalars["DateTime"];
};

export enum FlowStatus {
    Finished = "FINISHED",
    Retrying = "RETRYING",
    Running = "RUNNING",
    Waiting = "WAITING",
}

export type FlowSuccessResult = {
    __typename?: "FlowSuccessResult";
    message: Scalars["String"];
};

export type FlowTimingRecords = {
    __typename?: "FlowTimingRecords";
    /** Recorded time of last task scheduling */
    awaitingExecutorSince?: Maybe<Scalars["DateTime"]>;
    /** First scheduling time */
    firstAttemptScheduledAt?: Maybe<Scalars["DateTime"]>;
    /** Initiation time */
    initiatedAt: Scalars["DateTime"];
    /**
     * Recorded time of finish (successful or failed after retry) or abortion
     * (Finished state seen at least once)
     */
    lastAttemptFinishedAt?: Maybe<Scalars["DateTime"]>;
    /** Recorded start of running (Running state seen at least once) */
    runningSince?: Maybe<Scalars["DateTime"]>;
    /** Planned scheduling time (different than first in case of retries) */
    scheduledAt?: Maybe<Scalars["DateTime"]>;
};

export type FlowTrigger = {
    __typename?: "FlowTrigger";
    paused: Scalars["Boolean"];
    reactive?: Maybe<FlowTriggerReactiveRule>;
    schedule?: Maybe<FlowTriggerScheduleRule>;
};

export type FlowTriggerBatchingRule = {
    __typename?: "FlowTriggerBatchingRule";
    maxBatchingInterval?: Maybe<TimeDelta>;
    minRecordsToAwait: Scalars["Int"];
};

export type FlowTriggerInput =
    | { reactive: ReactiveInput; schedule?: never }
    | { reactive?: never; schedule: ScheduleInput };

export type FlowTriggerReactiveRule = {
    __typename?: "FlowTriggerReactiveRule";
    forBreakingChange: BreakingChangeRule;
    forNewData: FlowTriggerBatchingRule;
};

export type FlowTriggerScheduleRule = Cron5ComponentExpression | TimeDelta;

export type FlowTypeIsNotSupported = SetFlowTriggerResult & {
    __typename?: "FlowTypeIsNotSupported";
    message: Scalars["String"];
};

export type GetFlowResult = {
    message: Scalars["String"];
};

export type GetFlowSuccess = GetFlowResult & {
    __typename?: "GetFlowSuccess";
    flow: Flow;
    message: Scalars["String"];
};

export type InitiatorFilterInput =
    | { accounts: Array<Scalars["AccountID"]>; system?: never }
    | { accounts?: never; system: Scalars["Boolean"] };

export type JdbcDesc = {
    __typename?: "JdbcDesc";
    url: Scalars["String"];
};

export type KafkaProtocolDesc = {
    __typename?: "KafkaProtocolDesc";
    url: Scalars["String"];
};

/** Represents base64-encoded binary data using standard encoding */
export type KeyValue = {
    __typename?: "KeyValue";
    key: Scalars["String"];
    value: Scalars["String"];
};

export type LinkProtocolDesc = {
    __typename?: "LinkProtocolDesc";
    url: Scalars["String"];
};

export type LoginResponse = {
    __typename?: "LoginResponse";
    accessToken: Scalars["String"];
    account: Account;
};

export type LookupFilters = {
    byAccount?: InputMaybe<AccountLookupFilter>;
};

/**
 * Merge strategy determines how newly ingested data should be combined with
 * the data that already exists in the dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mergestrategy-schema
 */
export type MergeStrategy =
    | MergeStrategyAppend
    | MergeStrategyChangelogStream
    | MergeStrategyLedger
    | MergeStrategySnapshot
    | MergeStrategyUpsertStream;

/**
 * Append merge strategy.
 *
 * Under this strategy new data will be appended to the dataset in its
 * entirety, without any deduplication.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mergestrategyappend-schema
 */
export type MergeStrategyAppend = {
    __typename?: "MergeStrategyAppend";
    dummy?: Maybe<Scalars["String"]>;
};

/**
 * Changelog stream merge strategy.
 *
 * This is the native stream format for ODF that accurately describes the
 * evolution of all event records including appends, retractions, and
 * corrections as per RFC-015. No pre-processing except for format validation
 * is done.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mergestrategychangelogstream-schema
 */
export type MergeStrategyChangelogStream = {
    __typename?: "MergeStrategyChangelogStream";
    /**
     * Names of the columns that uniquely identify the record throughout its
     * lifetime
     */
    primaryKey: Array<Scalars["String"]>;
};

/**
 * Ledger merge strategy.
 *
 * This strategy should be used for data sources containing ledgers of events.
 * Currently this strategy will only perform deduplication of events using
 * user-specified primary key columns. This means that the source data can
 * contain partially overlapping set of records and only those records that
 * were not previously seen will be appended.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mergestrategyledger-schema
 */
export type MergeStrategyLedger = {
    __typename?: "MergeStrategyLedger";
    /**
     * Names of the columns that uniquely identify the record throughout its
     * lifetime
     */
    primaryKey: Array<Scalars["String"]>;
};

/**
 * Snapshot merge strategy.
 *
 * This strategy can be used for data state snapshots that are taken
 * periodically and contain only the latest state of the observed entity or
 * system. Over time such snapshots can have new rows added, and old rows
 * either removed or modified.
 *
 * This strategy transforms snapshot data into an append-only event stream
 * where data already added is immutable. It does so by performing Change Data
 * Capture - essentially diffing the current state of data against the
 * reconstructed previous state and recording differences as retractions or
 * corrections. The Operation Type "op" column will contain:
 * - append (`+A`) when a row appears for the first time
 * - retraction (`-D`) when row disappears
 * - correction (`-C`, `+C`) when row data has changed, with `-C` event
 * carrying the old value of the row and `+C` carrying the new value.
 *
 * To correctly associate rows between old and new snapshots this strategy
 * relies on user-specified primary key columns.
 *
 * To identify whether a row has changed this strategy will compare all other
 * columns one by one. If the data contains a column that is guaranteed to
 * change whenever any of the data columns changes (for example a last
 * modification timestamp, an incremental version, or a data hash), then it can
 * be specified in `compareColumns` property to speed up the detection of
 * modified rows.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mergestrategysnapshot-schema
 */
export type MergeStrategySnapshot = {
    __typename?: "MergeStrategySnapshot";
    /**
     * Names of the columns to compared to determine if a row has changed
     * between two snapshots.
     */
    compareColumns?: Maybe<Array<Scalars["String"]>>;
    /**
     * Names of the columns that uniquely identify the record throughout its
     * lifetime.
     */
    primaryKey: Array<Scalars["String"]>;
};

/**
 * Upsert stream merge strategy.
 *
 * This strategy should be used for data sources containing ledgers of
 * insert-or-update and delete events. Unlike ChangelogStream the
 * insert-or-update events only carry the new values, so this strategy will use
 * primary key to re-classify the events into an append or a correction from/to
 * pair, looking up the previous values.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mergestrategyupsertstream-schema
 */
export type MergeStrategyUpsertStream = {
    __typename?: "MergeStrategyUpsertStream";
    /**
     * Names of the columns that uniquely identify the record throughout its
     * lifetime
     */
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
    encoded?: Maybe<EncodedBlock>;
    event: MetadataEvent;
    prevBlockHash?: Maybe<Scalars["Multihash"]>;
    sequenceNumber: Scalars["Int"];
    systemTime: Scalars["DateTime"];
};

export type MetadataBlockExtendedEncodedArgs = {
    encoding: MetadataManifestFormat;
};

export type MetadataChain = {
    __typename?: "MetadataChain";
    /** Returns a metadata block corresponding to the specified hash */
    blockByHash?: Maybe<MetadataBlockExtended>;
    /**
     * Returns a metadata block corresponding to the specified hash and encoded
     * in desired format
     */
    blockByHashEncoded?: Maybe<Scalars["String"]>;
    /** Iterates all metadata blocks in the reverse chronological order */
    blocks: MetadataBlockConnection;
    /** Returns all named metadata block references */
    refs: Array<BlockRef>;
};

export type MetadataChainBlockByHashArgs = {
    hash: Scalars["Multihash"];
};

export type MetadataChainBlockByHashEncodedArgs = {
    format: MetadataManifestFormat;
    hash: Scalars["Multihash"];
};

export type MetadataChainBlocksArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type MetadataChainMut = {
    __typename?: "MetadataChainMut";
    /** Commits new event to the metadata chain */
    commitEvent: CommitResult;
};

export type MetadataChainMutCommitEventArgs = {
    event: Scalars["String"];
    eventFormat: MetadataManifestFormat;
};

/**
 * Represents a transaction that occurred on a dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#metadataevent-schema
 */
export type MetadataEvent =
    | AddData
    | AddPushSource
    | DisablePollingSource
    | DisablePushSource
    | ExecuteTransform
    | Seed
    | SetAttachments
    | SetDataSchema
    | SetInfo
    | SetLicense
    | SetPollingSource
    | SetTransform
    | SetVocab;

export enum MetadataEventType {
    AddPushSource = "ADD_PUSH_SOURCE",
    Seed = "SEED",
    SetAttachments = "SET_ATTACHMENTS",
    SetDataSchema = "SET_DATA_SCHEMA",
    SetInfo = "SET_INFO",
    SetLicense = "SET_LICENSE",
    SetPollingSource = "SET_POLLING_SOURCE",
    SetTransform = "SET_TRANSFORM",
    SetVocab = "SET_VOCAB",
}

export enum MetadataManifestFormat {
    Yaml = "YAML",
}

export type MetadataManifestMalformed = CommitResult &
    CreateDatasetFromSnapshotResult & {
        __typename?: "MetadataManifestMalformed";
        isSuccess: Scalars["Boolean"];
        message: Scalars["String"];
    };

export type MetadataManifestUnsupportedVersion = CommitResult &
    CreateDatasetFromSnapshotResult & {
        __typename?: "MetadataManifestUnsupportedVersion";
        isSuccess: Scalars["Boolean"];
        message: Scalars["String"];
    };

export type ModifyPasswordResult = {
    message: Scalars["String"];
};

export type ModifyPasswordSuccess = ModifyPasswordResult & {
    __typename?: "ModifyPasswordSuccess";
    message: Scalars["String"];
};

export type ModifyPasswordWrongOldPassword = ModifyPasswordResult & {
    __typename?: "ModifyPasswordWrongOldPassword";
    message: Scalars["String"];
};

/**
 * MQTT quality of service class.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mqttqos-schema
 */
export enum MqttQos {
    AtLeastOnce = "AT_LEAST_ONCE",
    AtMostOnce = "AT_MOST_ONCE",
    ExactlyOnce = "EXACTLY_ONCE",
}

/**
 * MQTT topic subscription parameters.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#mqtttopicsubscription-schema
 */
export type MqttTopicSubscription = {
    __typename?: "MqttTopicSubscription";
    /** Name of the topic (may include patterns). */
    path: Scalars["String"];
    /**
     * Quality of service class.
     *
     * Defaults to: "AtMostOnce"
     */
    qos?: Maybe<MqttQos>;
};

export type Mutation = {
    __typename?: "Mutation";
    /**
     * Account-related functionality group.
     *
     * Accounts can be individual users or organizations registered in the
     * system. This groups deals with their identities and permissions.
     */
    accounts: AccountsMut;
    /** Authentication and authorization-related functionality group */
    auth: AuthMut;
    /**
     * Collaboration-related functionality group
     *
     * Allows setting permissions for multiple datasets in batch mode
     */
    collaboration: CollaborationMut;
    /**
     * Dataset-related functionality group.
     *
     * Datasets are historical streams of events recorded under a certain
     * schema.
     */
    datasets: DatasetsMut;
};

export type NameLookupResult = Account;

export type NameLookupResultConnection = {
    __typename?: "NameLookupResultConnection";
    edges: Array<NameLookupResultEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<NameLookupResult>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type NameLookupResultEdge = {
    __typename?: "NameLookupResultEdge";
    node: NameLookupResult;
};

export type NoChanges = CommitResult &
    UpdateReadmeResult & {
        __typename?: "NoChanges";
        message: Scalars["String"];
    };

export type OdataProtocolDesc = {
    __typename?: "OdataProtocolDesc";
    collectionUrl: Scalars["String"];
    serviceUrl: Scalars["String"];
};

/**
 * Describes a range of data as a closed arithmetic interval of offsets
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#offsetinterval-schema
 */
export type OffsetInterval = {
    __typename?: "OffsetInterval";
    /** End of the closed interval [start; end]. */
    end: Scalars["Int"];
    /** Start of the closed interval [start; end]. */
    start: Scalars["Int"];
};

export type PageBasedInfo = {
    __typename?: "PageBasedInfo";
    /** Index of the current page */
    currentPage: Scalars["Int"];
    /** When paginating forwards, are there more items? */
    hasNextPage: Scalars["Boolean"];
    /** When paginating backwards, are there more items? */
    hasPreviousPage: Scalars["Boolean"];
    /**
     * Approximate number of total pages assuming number of nodes per page
     * stays the same
     */
    totalPages?: Maybe<Scalars["Int"]>;
};

export type PauseWebhookSubscriptionResult = {
    message: Scalars["String"];
};

export type PauseWebhookSubscriptionResultSuccess = PauseWebhookSubscriptionResult & {
    __typename?: "PauseWebhookSubscriptionResultSuccess";
    message: Scalars["String"];
    paused: Scalars["Boolean"];
};

export type PauseWebhookSubscriptionResultUnexpected = PauseWebhookSubscriptionResult & {
    __typename?: "PauseWebhookSubscriptionResultUnexpected";
    message: Scalars["String"];
    status: WebhookSubscriptionStatus;
};

export type PostgreSqlDesl = {
    __typename?: "PostgreSqlDesl";
    url: Scalars["String"];
};

/**
 * Defines the steps to prepare raw data for ingestion.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#prepstep-schema
 */
export type PrepStep = PrepStepDecompress | PrepStepPipe;

/**
 * Pulls data from one of the supported sources by its URL.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#prepstepdecompress-schema
 */
export type PrepStepDecompress = {
    __typename?: "PrepStepDecompress";
    /** Name of a compression algorithm used on data. */
    format: CompressionFormat;
    /**
     * Path to a data file within a multi-file archive. Can contain glob
     * patterns.
     */
    subPath?: Maybe<Scalars["String"]>;
};

/**
 * Executes external command to process the data using piped input/output.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#prepsteppipe-schema
 */
export type PrepStepPipe = {
    __typename?: "PrepStepPipe";
    /** Command to execute and its arguments. */
    command: Array<Scalars["String"]>;
};

export type PrivateDatasetVisibility = {
    __typename?: "PrivateDatasetVisibility";
    dummy?: Maybe<Scalars["String"]>;
};

export type PrivateDatasetVisibilityInput = {
    dummy?: InputMaybe<Scalars["String"]>;
};

export type PublicDatasetVisibility = {
    __typename?: "PublicDatasetVisibility";
    anonymousAvailable: Scalars["Boolean"];
};

export type PublicDatasetVisibilityInput = {
    anonymousAvailable: Scalars["Boolean"];
};

export type Query = {
    __typename?: "Query";
    /**
     * Account-related functionality group.
     *
     * Accounts can be individual users or organizations registered in the
     * system. This groups deals with their identities and permissions.
     */
    accounts: Accounts;
    /** Admin-related functionality group */
    admin: Admin;
    /** Returns the version of the GQL API */
    apiVersion: Scalars["String"];
    /** Authentication and authorization-related functionality group */
    auth: Auth;
    /** Returns server's version and build configuration information */
    buildInfo: BuildInfo;
    /** Querying and data manipulations */
    data: DataQueries;
    /**
     * Dataset-related functionality group.
     *
     * Datasets are historical streams of events recorded under a certain
     * schema.
     */
    datasets: Datasets;
    /** Search-related functionality group */
    search: Search;
    /**
     * Webhook-related functionality group
     *
     * Webhooks are used to send notifications about events happening in the
     * system. This groups deals with their management and subscriptions.
     */
    webhooks: Webhooks;
};

export enum QueryDialect {
    SqlDataFusion = "SQL_DATA_FUSION",
    SqlFlink = "SQL_FLINK",
    SqlRisingWave = "SQL_RISING_WAVE",
    SqlSpark = "SQL_SPARK",
}

export type ReactiveInput = {
    forBreakingChange: BreakingChangeRule;
    forNewData: BatchingInput;
};

/**
 * Defines how raw data should be read into the structured form.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstep-schema
 */
export type ReadStep =
    | ReadStepCsv
    | ReadStepEsriShapefile
    | ReadStepGeoJson
    | ReadStepJson
    | ReadStepNdGeoJson
    | ReadStepNdJson
    | ReadStepParquet;

/**
 * Reader for comma-separated files.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstepcsv-schema
 */
export type ReadStepCsv = {
    __typename?: "ReadStepCsv";
    /**
     * Sets the string that indicates a date format. The `rfc3339` is the only
     * required format, the other format strings are implementation-specific.
     *
     * Defaults to: "rfc3339"
     */
    dateFormat?: Maybe<Scalars["String"]>;
    /**
     * Decodes the CSV files by the given encoding type.
     *
     * Defaults to: "utf8"
     */
    encoding?: Maybe<Scalars["String"]>;
    /**
     * Sets a single character used for escaping quotes inside an already
     * quoted value.
     *
     * Defaults to: "\\"
     */
    escape?: Maybe<Scalars["String"]>;
    /**
     * Use the first line as names of columns.
     *
     * Defaults to: false
     */
    header?: Maybe<Scalars["Boolean"]>;
    /**
     * Infers the input schema automatically from data. It requires one extra
     * pass over the data.
     *
     * Defaults to: false
     */
    inferSchema?: Maybe<Scalars["Boolean"]>;
    /**
     * Sets the string representation of a null value.
     *
     * Defaults to: ""
     */
    nullValue?: Maybe<Scalars["String"]>;
    /**
     * Sets a single character used for escaping quoted values where the
     * separator can be part of the value. Set an empty string to turn off
     * quotations.
     *
     * Defaults to: "\""
     */
    quote?: Maybe<Scalars["String"]>;
    /**
     * A DDL-formatted schema. Schema can be used to coerce values into more
     * appropriate data types.
     *
     * Examples:
     * - ["date TIMESTAMP","city STRING","population INT"]
     */
    schema?: Maybe<Array<Scalars["String"]>>;
    /**
     * Sets a single character as a separator for each field and value.
     *
     * Defaults to: ","
     */
    separator?: Maybe<Scalars["String"]>;
    /**
     * Sets the string that indicates a timestamp format. The `rfc3339` is the
     * only required format, the other format strings are
     * implementation-specific.
     *
     * Defaults to: "rfc3339"
     */
    timestampFormat?: Maybe<Scalars["String"]>;
};

/**
 * Reader for ESRI Shapefile format.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstepesrishapefile-schema
 */
export type ReadStepEsriShapefile = {
    __typename?: "ReadStepEsriShapefile";
    /**
     * A DDL-formatted schema. Schema can be used to coerce values into more
     * appropriate data types.
     */
    schema?: Maybe<Array<Scalars["String"]>>;
    /**
     * If the ZIP archive contains multiple shapefiles use this field to
     * specify a sub-path to the desired `.shp` file. Can contain glob patterns
     * to act as a filter.
     */
    subPath?: Maybe<Scalars["String"]>;
};

/**
 * Reader for GeoJSON files. It expects one `FeatureCollection` object in the
 * root and will create a record per each `Feature` inside it extracting the
 * properties into individual columns and leaving the feature geometry in its
 * own column.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstepgeojson-schema
 */
export type ReadStepGeoJson = {
    __typename?: "ReadStepGeoJson";
    /**
     * A DDL-formatted schema. Schema can be used to coerce values into more
     * appropriate data types.
     */
    schema?: Maybe<Array<Scalars["String"]>>;
};

/**
 * Reader for JSON files that contain an array of objects within them.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstepjson-schema
 */
export type ReadStepJson = {
    __typename?: "ReadStepJson";
    /**
     * Sets the string that indicates a date format. The `rfc3339` is the only
     * required format, the other format strings are implementation-specific.
     *
     * Defaults to: "rfc3339"
     */
    dateFormat?: Maybe<Scalars["String"]>;
    /**
     * Allows to forcibly set one of standard basic or extended encodings.
     *
     * Defaults to: "utf8"
     */
    encoding?: Maybe<Scalars["String"]>;
    /**
     * A DDL-formatted schema. Schema can be used to coerce values into more
     * appropriate data types.
     */
    schema?: Maybe<Array<Scalars["String"]>>;
    /**
     * Path in the form of `a.b.c` to a sub-element of the root JSON object
     * that is an array or objects. If not specified it is assumed that the
     * root element is an array.
     */
    subPath?: Maybe<Scalars["String"]>;
    /**
     * Sets the string that indicates a timestamp format. The `rfc3339` is the
     * only required format, the other format strings are
     * implementation-specific.
     *
     * Defaults to: "rfc3339"
     */
    timestampFormat?: Maybe<Scalars["String"]>;
};

/**
 * Reader for Newline-delimited GeoJSON files. It is similar to `GeoJson`
 * format but instead of `FeatureCollection` object in the root it expects
 * every individual feature object to appear on its own line.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstepndgeojson-schema
 */
export type ReadStepNdGeoJson = {
    __typename?: "ReadStepNdGeoJson";
    /**
     * A DDL-formatted schema. Schema can be used to coerce values into more
     * appropriate data types.
     */
    schema?: Maybe<Array<Scalars["String"]>>;
};

/**
 * Reader for files containing multiple newline-delimited JSON objects with the
 * same schema.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstepndjson-schema
 */
export type ReadStepNdJson = {
    __typename?: "ReadStepNdJson";
    /**
     * Sets the string that indicates a date format. The `rfc3339` is the only
     * required format, the other format strings are implementation-specific.
     *
     * Defaults to: "rfc3339"
     */
    dateFormat?: Maybe<Scalars["String"]>;
    /**
     * Allows to forcibly set one of standard basic or extended encodings.
     *
     * Defaults to: "utf8"
     */
    encoding?: Maybe<Scalars["String"]>;
    /**
     * A DDL-formatted schema. Schema can be used to coerce values into more
     * appropriate data types.
     */
    schema?: Maybe<Array<Scalars["String"]>>;
    /**
     * Sets the string that indicates a timestamp format. The `rfc3339` is the
     * only required format, the other format strings are
     * implementation-specific.
     *
     * Defaults to: "rfc3339"
     */
    timestampFormat?: Maybe<Scalars["String"]>;
};

/**
 * Reader for Apache Parquet format.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#readstepparquet-schema
 */
export type ReadStepParquet = {
    __typename?: "ReadStepParquet";
    /**
     * A DDL-formatted schema. Schema can be used to coerce values into more
     * appropriate data types.
     */
    schema?: Maybe<Array<Scalars["String"]>>;
};

export type RemoveWebhookSubscriptionResult = {
    message: Scalars["String"];
};

export type RemoveWebhookSubscriptionResultSuccess = RemoveWebhookSubscriptionResult & {
    __typename?: "RemoveWebhookSubscriptionResultSuccess";
    message: Scalars["String"];
    removed: Scalars["Boolean"];
};

export type RenameAccountNameNotUnique = RenameAccountResult & {
    __typename?: "RenameAccountNameNotUnique";
    message: Scalars["String"];
};

export type RenameAccountResult = {
    message: Scalars["String"];
};

export type RenameAccountSuccess = RenameAccountResult & {
    __typename?: "RenameAccountSuccess";
    message: Scalars["String"];
    newName: Scalars["String"];
};

export type RenameResult = {
    message: Scalars["String"];
};

export type RenameResultNameCollision = RenameResult & {
    __typename?: "RenameResultNameCollision";
    collidingAlias: Scalars["DatasetAlias"];
    message: Scalars["String"];
};

export type RenameResultNoChanges = RenameResult & {
    __typename?: "RenameResultNoChanges";
    message: Scalars["String"];
    preservedName: Scalars["DatasetName"];
};

export type RenameResultSuccess = RenameResult & {
    __typename?: "RenameResultSuccess";
    message: Scalars["String"];
    newName: Scalars["DatasetName"];
    oldName: Scalars["DatasetName"];
};

/**
 * Defines a header (e.g. HTTP) to be passed into some request.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#requestheader-schema
 */
export type RequestHeader = {
    __typename?: "RequestHeader";
    /** Name of the header. */
    name: Scalars["String"];
    /** Value of the header. */
    value: Scalars["String"];
};

export type RestProtocolDesc = {
    __typename?: "RestProtocolDesc";
    pushUrl: Scalars["String"];
    queryUrl: Scalars["String"];
    tailUrl: Scalars["String"];
};

export type ResumeWebhookSubscriptionResult = {
    message: Scalars["String"];
};

export type ResumeWebhookSubscriptionResultSuccess = ResumeWebhookSubscriptionResult & {
    __typename?: "ResumeWebhookSubscriptionResultSuccess";
    message: Scalars["String"];
    resumed: Scalars["Boolean"];
};

export type ResumeWebhookSubscriptionResultUnexpected = ResumeWebhookSubscriptionResult & {
    __typename?: "ResumeWebhookSubscriptionResultUnexpected";
    message: Scalars["String"];
    status: WebhookSubscriptionStatus;
};

export type RevokeResult = {
    message: Scalars["String"];
};

export type RevokeResultAlreadyRevoked = RevokeResult & {
    __typename?: "RevokeResultAlreadyRevoked";
    message: Scalars["String"];
    tokenId: Scalars["AccessTokenID"];
};

export type RevokeResultSuccess = RevokeResult & {
    __typename?: "RevokeResultSuccess";
    message: Scalars["String"];
    tokenId: Scalars["AccessTokenID"];
};

export type ScheduleInput =
    /** Supported CRON syntax: min hour dayOfMonth month dayOfWeek */
    | { cron5ComponentExpression: Scalars["String"]; timeDelta?: never }
    | { cron5ComponentExpression?: never; timeDelta: TimeDeltaInput };

export type Search = {
    __typename?: "Search";
    /**
     * Perform lightweight search among resource names.
     * Useful for autocomplete.
     */
    nameLookup: NameLookupResultConnection;
    /**
     * This endpoint uses heuristics to infer whether the query string is a DSL
     * or a natural language query and is suitable to present the most
     * versatile interface to the user consisting of just one input field.
     */
    query: SearchResultConnection;
    /**
     * Searches for datasets and other objects managed by the
     * current node using a prompt in natural language
     */
    queryNaturalLanguage: SearchResultExConnection;
};

export type SearchNameLookupArgs = {
    filters: LookupFilters;
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
    query: Scalars["String"];
};

export type SearchQueryArgs = {
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
    query: Scalars["String"];
};

export type SearchQueryNaturalLanguageArgs = {
    perPage?: InputMaybe<Scalars["Int"]>;
    prompt: Scalars["String"];
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

export type SearchResultEx = {
    __typename?: "SearchResultEx";
    item: SearchResult;
    score: Scalars["Float"];
};

export type SearchResultExConnection = {
    __typename?: "SearchResultExConnection";
    edges: Array<SearchResultExEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<SearchResultEx>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type SearchResultExEdge = {
    __typename?: "SearchResultExEdge";
    node: SearchResultEx;
};

/**
 * Establishes the identity of the dataset. Always the first metadata event in
 * the chain.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#seed-schema
 */
export type Seed = {
    __typename?: "Seed";
    /** Unique identity of the dataset. */
    datasetId: Scalars["DatasetID"];
    /** Type of the dataset. */
    datasetKind: DatasetKind;
};

/**
 * Associates a set of files with this dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#setattachments-schema
 */
export type SetAttachments = {
    __typename?: "SetAttachments";
    /** One of the supported attachment sources. */
    attachments: Attachments;
};

/**
 * Specifies the complete schema of Data Slices added to the Dataset following
 * this event.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#setdataschema-schema
 */
export type SetDataSchema = {
    __typename?: "SetDataSchema";
    schema: DataSchema;
};

export type SetDatasetVisibilityResult = {
    message: Scalars["String"];
};

export type SetDatasetVisibilityResultSuccess = SetDatasetVisibilityResult & {
    __typename?: "SetDatasetVisibilityResultSuccess";
    message: Scalars["String"];
};

export type SetFlowConfigResult = {
    message: Scalars["String"];
};

export type SetFlowConfigSuccess = SetFlowConfigResult & {
    __typename?: "SetFlowConfigSuccess";
    config: FlowConfiguration;
    message: Scalars["String"];
};

export type SetFlowTriggerResult = {
    message: Scalars["String"];
};

export type SetFlowTriggerSuccess = SetFlowTriggerResult & {
    __typename?: "SetFlowTriggerSuccess";
    message: Scalars["String"];
    trigger: FlowTrigger;
};

/**
 * Provides basic human-readable information about a dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#setinfo-schema
 */
export type SetInfo = {
    __typename?: "SetInfo";
    /** Brief single-sentence summary of a dataset. */
    description?: Maybe<Scalars["String"]>;
    /** Keywords, search terms, or tags used to describe the dataset. */
    keywords?: Maybe<Array<Scalars["String"]>>;
};

/**
 * Defines a license that applies to this dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#setlicense-schema
 */
export type SetLicense = {
    __typename?: "SetLicense";
    /** Full name of the license. */
    name: Scalars["String"];
    /** Abbreviated name of the license. */
    shortName: Scalars["String"];
    /** License identifier from the SPDX License List. */
    spdxId?: Maybe<Scalars["String"]>;
    /** URL where licensing terms can be found. */
    websiteUrl: Scalars["String"];
};

/**
 * Contains information on how externally-hosted data can be ingested into the
 * root dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#setpollingsource-schema
 */
export type SetPollingSource = {
    __typename?: "SetPollingSource";
    /** Determines where data is sourced from. */
    fetch: FetchStep;
    /**
     * Determines how newly-ingested data should be merged with existing
     * history.
     */
    merge: MergeStrategy;
    /** Defines how raw data is prepared before reading. */
    prepare?: Maybe<Array<PrepStep>>;
    /** Pre-processing query that shapes the data. */
    preprocess?: Maybe<Transform>;
    /** Defines how data is read into structured format. */
    read: ReadStep;
};

export type SetRoleResult = {
    message: Scalars["String"];
};

export type SetRoleResultSuccess = SetRoleResult & {
    __typename?: "SetRoleResultSuccess";
    message: Scalars["String"];
};

/**
 * Defines a transformation that produces data in a derivative dataset.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#settransform-schema
 */
export type SetTransform = {
    __typename?: "SetTransform";
    /** Datasets that will be used as sources. */
    inputs: Array<TransformInput>;
    /** Transformation that will be applied to produce new data. */
    transform: Transform;
};

/**
 * Lets you manipulate names of the system columns to avoid conflicts.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#setvocab-schema
 */
export type SetVocab = {
    __typename?: "SetVocab";
    /** Name of the event time column. */
    eventTimeColumn?: Maybe<Scalars["String"]>;
    /** Name of the offset column. */
    offsetColumn?: Maybe<Scalars["String"]>;
    /** Name of the operation type column. */
    operationTypeColumn?: Maybe<Scalars["String"]>;
    /** Name of the system time column. */
    systemTimeColumn?: Maybe<Scalars["String"]>;
};

export type SetWatermarkIsDerivative = SetWatermarkResult & {
    __typename?: "SetWatermarkIsDerivative";
    message: Scalars["String"];
};

export type SetWatermarkResult = {
    message: Scalars["String"];
};

export type SetWatermarkUpToDate = SetWatermarkResult & {
    __typename?: "SetWatermarkUpToDate";
    message: Scalars["String"];
};

export type SetWatermarkUpdated = SetWatermarkResult & {
    __typename?: "SetWatermarkUpdated";
    message: Scalars["String"];
    newHead: Scalars["Multihash"];
};

/**
 * Defines how external data should be cached.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#sourcecaching-schema
 */
export type SourceCaching = SourceCachingForever;

/**
 * After source was processed once it will never be ingested again.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#sourcecachingforever-schema
 */
export type SourceCachingForever = {
    __typename?: "SourceCachingForever";
    dummy?: Maybe<Scalars["String"]>;
};

/**
 * Specifies how input files should be ordered before ingestion.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#sourceordering-schema
 */
export enum SourceOrdering {
    ByEventTime = "BY_EVENT_TIME",
    ByName = "BY_NAME",
}

/**
 * The state of the source the data was added from to allow fast resuming.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#sourcestate-schema
 */
export type SourceState = {
    __typename?: "SourceState";
    /**
     * Identifies the type of the state. Standard types include: `odf/etag`,
     * `odf/last-modified`.
     */
    kind: Scalars["String"];
    /** Identifies the source that the state corresponds to. */
    sourceName: Scalars["String"];
    /** Opaque value representing the state. */
    value: Scalars["String"];
};

/**
 * Defines a query in a multi-step SQL transformation.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#sqlquerystep-schema
 */
export type SqlQueryStep = {
    __typename?: "SqlQueryStep";
    /**
     * Name of the temporary view that will be created from result of the
     * query. Step without this alias will be treated as an output of the
     * transformation.
     */
    alias?: Maybe<Scalars["String"]>;
    /** SQL query the result of which will be exposed under the alias. */
    query: Scalars["String"];
};

export type StartUploadVersionErrorTooLarge = StartUploadVersionResult & {
    __typename?: "StartUploadVersionErrorTooLarge";
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
    uploadLimit: Scalars["Int"];
    uploadSize: Scalars["Int"];
};

export type StartUploadVersionResult = {
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type StartUploadVersionSuccess = StartUploadVersionResult & {
    __typename?: "StartUploadVersionSuccess";
    headers: Array<KeyValue>;
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
    method: Scalars["String"];
    uploadToken: Scalars["String"];
    url: Scalars["String"];
    useMultipart: Scalars["Boolean"];
};

export type Task = {
    __typename?: "Task";
    /** Whether the task was ordered to be cancelled */
    cancellationRequested: Scalars["Boolean"];
    /** Time when cancellation of task was requested */
    cancellationRequestedAt?: Maybe<Scalars["DateTime"]>;
    /** Time when task was originally created and placed in a queue */
    createdAt: Scalars["DateTime"];
    /** Time when task has reached a final outcome */
    finishedAt?: Maybe<Scalars["DateTime"]>;
    /**
     * Describes a certain final outcome of the task once it reaches the
     * "finished" status
     */
    outcome?: Maybe<TaskOutcome>;
    /** Time when task transitioned into a running state */
    ranAt?: Maybe<Scalars["DateTime"]>;
    /** Life-cycle status of a task */
    status: TaskStatus;
    /** Unique and stable identifier of this task */
    taskId: Scalars["TaskID"];
};

export type TaskFailureReason = TaskFailureReasonGeneral | TaskFailureReasonInputDatasetCompacted;

export type TaskFailureReasonGeneral = {
    __typename?: "TaskFailureReasonGeneral";
    message: Scalars["String"];
};

export type TaskFailureReasonInputDatasetCompacted = {
    __typename?: "TaskFailureReasonInputDatasetCompacted";
    inputDataset: Dataset;
    message: Scalars["String"];
};

/** Describes a certain final outcome of the task */
export type TaskOutcome = TaskOutcomeCancelled | TaskOutcomeFailed | TaskOutcomeSuccess;

export type TaskOutcomeCancelled = {
    __typename?: "TaskOutcomeCancelled";
    message: Scalars["String"];
};

export type TaskOutcomeFailed = {
    __typename?: "TaskOutcomeFailed";
    reason: TaskFailureReason;
};

export type TaskOutcomeSuccess = {
    __typename?: "TaskOutcomeSuccess";
    message: Scalars["String"];
};

/** Life-cycle status of a task */
export enum TaskStatus {
    /** Task has reached a certain final outcome (see [`TaskOutcome`]) */
    Finished = "FINISHED",
    /** Task is waiting for capacity to be allocated to it */
    Queued = "QUEUED",
    /** Task is being executed */
    Running = "RUNNING",
}

/**
 * Temporary Flink-specific extension for creating temporal tables from
 * streams.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#temporaltable-schema
 */
export type TemporalTable = {
    __typename?: "TemporalTable";
    /** Name of the dataset to be converted into a temporal table. */
    name: Scalars["String"];
    /** Column names used as the primary key for creating a table. */
    primaryKey: Array<Scalars["String"]>;
};

export type TimeDelta = {
    __typename?: "TimeDelta";
    every: Scalars["Int"];
    unit: TimeUnit;
};

export type TimeDeltaInput = {
    every: Scalars["Int"];
    unit: TimeUnit;
};

export enum TimeUnit {
    Days = "DAYS",
    Hours = "HOURS",
    Minutes = "MINUTES",
    Weeks = "WEEKS",
}

/**
 * Engine-specific processing queries that shape the resulting data.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#transform-schema
 */
export type Transform = TransformSql;

export type TransformInput = {
    __typename?: "TransformInput";
    alias: Scalars["String"];
    datasetRef: Scalars["DatasetRef"];
    inputDataset: TransformInputDataset;
};

/**
 * Describes a derivative transformation input
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#transforminput-schema
 */
export type TransformInputDataset = {
    message: Scalars["String"];
};

export type TransformInputDatasetAccessible = TransformInputDataset & {
    __typename?: "TransformInputDatasetAccessible";
    dataset: Dataset;
    message: Scalars["String"];
};

export type TransformInputDatasetNotAccessible = TransformInputDataset & {
    __typename?: "TransformInputDatasetNotAccessible";
    datasetRef: Scalars["DatasetRef"];
    message: Scalars["String"];
};

/**
 * Transform using one of the SQL dialects.
 *
 * See: https://github.com/kamu-data/open-data-fabric/blob/master/open-data-fabric.md#transformsql-schema
 */
export type TransformSql = {
    __typename?: "TransformSql";
    engine: Scalars["String"];
    queries: Array<SqlQueryStep>;
    temporalTables?: Maybe<Array<TemporalTable>>;
    version?: Maybe<Scalars["String"]>;
};

export type TriggerFlowResult = {
    message: Scalars["String"];
};

export type TriggerFlowSuccess = TriggerFlowResult & {
    __typename?: "TriggerFlowSuccess";
    flow: Flow;
    message: Scalars["String"];
};

export type UnsetRoleResult = {
    message: Scalars["String"];
};

export type UnsetRoleResultSuccess = UnsetRoleResult & {
    __typename?: "UnsetRoleResultSuccess";
    message: Scalars["String"];
};

export type UpdateEmailNonUnique = UpdateEmailResult & {
    __typename?: "UpdateEmailNonUnique";
    message: Scalars["String"];
};

export type UpdateEmailResult = {
    message: Scalars["String"];
};

export type UpdateEmailSuccess = UpdateEmailResult & {
    __typename?: "UpdateEmailSuccess";
    message: Scalars["String"];
    newEmail: Scalars["String"];
};

export type UpdateReadmeResult = {
    message: Scalars["String"];
};

export type UpdateVersionErrorCasFailed = UpdateVersionResult & {
    __typename?: "UpdateVersionErrorCasFailed";
    actualHead: Scalars["Multihash"];
    expectedHead: Scalars["Multihash"];
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type UpdateVersionErrorInvalidExtraData = UpdateVersionResult & {
    __typename?: "UpdateVersionErrorInvalidExtraData";
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type UpdateVersionResult = {
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
};

export type UpdateVersionSuccess = UpdateVersionResult & {
    __typename?: "UpdateVersionSuccess";
    contentHash: Scalars["Multihash"];
    isSuccess: Scalars["Boolean"];
    message: Scalars["String"];
    newHead: Scalars["Multihash"];
    newVersion: Scalars["Int"];
    oldHead: Scalars["Multihash"];
};

export type UpdateWebhookSubscriptionResult = {
    message: Scalars["String"];
};

export type UpdateWebhookSubscriptionResultSuccess = UpdateWebhookSubscriptionResult & {
    __typename?: "UpdateWebhookSubscriptionResultSuccess";
    message: Scalars["String"];
    updated: Scalars["Boolean"];
};

export type UpdateWebhookSubscriptionResultUnexpected = UpdateWebhookSubscriptionResult & {
    __typename?: "UpdateWebhookSubscriptionResultUnexpected";
    message: Scalars["String"];
    status: WebhookSubscriptionStatus;
};

export type UpsertDatasetEnvVarResult = {
    message: Scalars["String"];
};

export type UpsertDatasetEnvVarResultCreated = UpsertDatasetEnvVarResult & {
    __typename?: "UpsertDatasetEnvVarResultCreated";
    envVar: ViewDatasetEnvVar;
    message: Scalars["String"];
};

export type UpsertDatasetEnvVarResultUpdated = UpsertDatasetEnvVarResult & {
    __typename?: "UpsertDatasetEnvVarResultUpdated";
    envVar: ViewDatasetEnvVar;
    message: Scalars["String"];
};

export type UpsertDatasetEnvVarUpToDate = UpsertDatasetEnvVarResult & {
    __typename?: "UpsertDatasetEnvVarUpToDate";
    message: Scalars["String"];
};

export type VersionedFile = {
    __typename?: "VersionedFile";
    /** Returns the specified entry by block or version number */
    asOf?: Maybe<VersionedFileEntry>;
    /** Returns the latest version entry, if any */
    latest?: Maybe<VersionedFileEntry>;
    /** Returns list of versions in reverse chronological order */
    versions: VersionedFileEntryConnection;
};

export type VersionedFileAsOfArgs = {
    blockHash?: InputMaybe<Scalars["Multihash"]>;
    version?: InputMaybe<Scalars["Int"]>;
};

export type VersionedFileVersionsArgs = {
    maxVersion?: InputMaybe<Scalars["Int"]>;
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type VersionedFileContentDownload = {
    __typename?: "VersionedFileContentDownload";
    /** Download URL expiration timestamp */
    expiresAt?: Maybe<Scalars["DateTime"]>;
    /** Headers to include in the request */
    headers: Array<KeyValue>;
    /** Direct download URL */
    url: Scalars["String"];
};

export type VersionedFileEntry = {
    __typename?: "VersionedFileEntry";
    /**
     * Returns encoded content in-band. Should be used for small files only and
     * will return an error if called on large data.
     */
    content: Scalars["Base64Usnp"];
    /** Multihash of the file content */
    contentHash: Scalars["Multihash"];
    /** Size of the content in bytes */
    contentLength: Scalars["Int"];
    /** Media type of the file content */
    contentType: Scalars["String"];
    /** Returns a direct download URL */
    contentUrl: VersionedFileContentDownload;
    /** Event time when this version was created/updated */
    eventTime: Scalars["DateTime"];
    /** Extra data associated with this file version */
    extraData: Scalars["ExtraData"];
    /** System time when this version was created/updated */
    systemTime: Scalars["DateTime"];
    /** File version */
    version: Scalars["Int"];
};

export type VersionedFileEntryConnection = {
    __typename?: "VersionedFileEntryConnection";
    edges: Array<VersionedFileEntryEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<VersionedFileEntry>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type VersionedFileEntryEdge = {
    __typename?: "VersionedFileEntryEdge";
    node: VersionedFileEntry;
};

export type VersionedFileMut = {
    __typename?: "VersionedFileMut";
    /**
     * Finalizes the content upload by incorporating the content into the
     * dataset as a new version
     */
    finishUploadNewVersion: UpdateVersionResult;
    /**
     * Returns a pre-signed URL and upload token for direct uploads of large
     * files
     */
    startUploadNewVersion: StartUploadVersionResult;
    /**
     * Creating a new version with that has updated values of extra columns but
     * with the file content unchanged
     */
    updateExtraData: UpdateVersionResult;
    /**
     * Uploads a new version of content in-band. Can be used for very small
     * files only.
     */
    uploadNewVersion: UpdateVersionResult;
};

export type VersionedFileMutFinishUploadNewVersionArgs = {
    expectedHead?: InputMaybe<Scalars["Multihash"]>;
    extraData?: InputMaybe<Scalars["ExtraData"]>;
    uploadToken: Scalars["String"];
};

export type VersionedFileMutStartUploadNewVersionArgs = {
    contentLength: Scalars["Int"];
    contentType?: InputMaybe<Scalars["String"]>;
};

export type VersionedFileMutUpdateExtraDataArgs = {
    expectedHead?: InputMaybe<Scalars["Multihash"]>;
    extraData: Scalars["ExtraData"];
};

export type VersionedFileMutUploadNewVersionArgs = {
    content: Scalars["Base64Usnp"];
    contentType?: InputMaybe<Scalars["String"]>;
    expectedHead?: InputMaybe<Scalars["Multihash"]>;
    extraData?: InputMaybe<Scalars["ExtraData"]>;
};

export type ViewAccessToken = {
    __typename?: "ViewAccessToken";
    /** Access token account owner */
    account: Account;
    /** Date of token creation */
    createdAt: Scalars["DateTime"];
    /** Unique identifier of the access token */
    id: Scalars["AccessTokenID"];
    /** Name of the access token */
    name: Scalars["String"];
    /** Date of token revocation */
    revokedAt?: Maybe<Scalars["DateTime"]>;
};

export type ViewDatasetEnvVar = {
    __typename?: "ViewDatasetEnvVar";
    /** Date of the dataset environment variable creation */
    createdAt: Scalars["DateTime"];
    /** Unique identifier of the dataset environment variable */
    id: Scalars["DatasetEnvVarID"];
    isSecret: Scalars["Boolean"];
    /** Key of the dataset environment variable */
    key: Scalars["String"];
    /** Non secret value of dataset environment variable */
    value?: Maybe<Scalars["String"]>;
};

export type ViewDatasetEnvVarConnection = {
    __typename?: "ViewDatasetEnvVarConnection";
    edges: Array<ViewDatasetEnvVarEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<ViewDatasetEnvVar>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type ViewDatasetEnvVarEdge = {
    __typename?: "ViewDatasetEnvVarEdge";
    node: ViewDatasetEnvVar;
};

export type WebSocketProtocolDesc = {
    __typename?: "WebSocketProtocolDesc";
    url: Scalars["String"];
};

export type WebhookSubscription = {
    __typename?: "WebhookSubscription";
    /**
     * Associated dataset ID
     * Not present for system subscriptions
     */
    datasetId?: Maybe<Scalars["DatasetID"]>;
    /** List of events that trigger the webhook */
    eventTypes: Array<Scalars["String"]>;
    /** Unique identifier of the webhook subscription */
    id: Scalars["WebhookSubscriptionID"];
    /** Optional label for the subscription. Maybe an empty string. */
    label: Scalars["String"];
    /** Status of the subscription */
    status: WebhookSubscriptionStatus;
    /** Target URL for the webhook */
    targetUrl: Scalars["String"];
};

export type WebhookSubscriptionDuplicateLabel = CreateWebhookSubscriptionResult &
    UpdateWebhookSubscriptionResult & {
        __typename?: "WebhookSubscriptionDuplicateLabel";
        label: Scalars["String"];
        message: Scalars["String"];
    };

export type WebhookSubscriptionInput = {
    eventTypes: Array<Scalars["WebhookEventType"]>;
    label: Scalars["WebhookSubscriptionLabel"];
    targetUrl: Scalars["URL"];
};

export type WebhookSubscriptionInvalidTargetUrl = CreateWebhookSubscriptionResult &
    UpdateWebhookSubscriptionResult & {
        __typename?: "WebhookSubscriptionInvalidTargetUrl";
        innerMessage: Scalars["String"];
        message: Scalars["String"];
    };

export type WebhookSubscriptionMut = {
    __typename?: "WebhookSubscriptionMut";
    pause: PauseWebhookSubscriptionResult;
    remove: RemoveWebhookSubscriptionResult;
    resume: ResumeWebhookSubscriptionResult;
    update: UpdateWebhookSubscriptionResult;
};

export type WebhookSubscriptionMutUpdateArgs = {
    input: WebhookSubscriptionInput;
};

export type WebhookSubscriptionNoEventTypesProvided = CreateWebhookSubscriptionResult &
    UpdateWebhookSubscriptionResult & {
        __typename?: "WebhookSubscriptionNoEventTypesProvided";
        message: Scalars["String"];
        numEventTypes: Scalars["Int"];
    };

export enum WebhookSubscriptionStatus {
    Enabled = "ENABLED",
    Paused = "PAUSED",
    Removed = "REMOVED",
    Unreachable = "UNREACHABLE",
    Unverified = "UNVERIFIED",
}

export type Webhooks = {
    __typename?: "Webhooks";
    /** List of supported event types */
    eventTypes: Array<Scalars["String"]>;
};

export type CreateAccessTokenMutationVariables = Exact<{
    accountId: Scalars["AccountID"];
    tokenName: Scalars["String"];
}>;

export type CreateAccessTokenMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byId?: {
            __typename?: "AccountMut";
            accessTokens: {
                __typename?: "AccountAccessTokensMut";
                createAccessToken:
                    | { __typename?: "CreateAccessTokenResultDuplicate"; message: string; tokenName: string }
                    | {
                          __typename?: "CreateAccessTokenResultSuccess";
                          message: string;
                          token: {
                              __typename?: "CreatedAccessToken";
                              id: string;
                              name: string;
                              composed: string;
                              account: { __typename?: "Account" } & AccountFragment;
                          };
                      };
            };
        } | null;
    };
};

export type ListAccessTokensQueryVariables = Exact<{
    accountId: Scalars["AccountID"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
}>;

export type ListAccessTokensQuery = {
    __typename?: "Query";
    accounts: {
        __typename?: "Accounts";
        byId?: {
            __typename?: "Account";
            accessTokens: {
                __typename?: "AccountAccessTokens";
                listAccessTokens: {
                    __typename?: "AccessTokenConnection";
                    totalCount: number;
                    nodes: Array<{ __typename?: "ViewAccessToken" } & AccessTokenDataFragment>;
                    pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
                };
            };
        } | null;
    };
};

export type RevokeAccessTokenMutationVariables = Exact<{
    accountId: Scalars["AccountID"];
    tokenId: Scalars["AccessTokenID"];
}>;

export type RevokeAccessTokenMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byId?: {
            __typename?: "AccountMut";
            accessTokens: {
                __typename?: "AccountAccessTokensMut";
                revokeAccessToken:
                    | { __typename?: "RevokeResultAlreadyRevoked"; tokenId: string; message: string }
                    | { __typename?: "RevokeResultSuccess"; tokenId: string; message: string };
            };
        } | null;
    };
};

export type AccountByNameQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type AccountByNameQuery = {
    __typename?: "Query";
    accounts: { __typename?: "Accounts"; byName?: ({ __typename?: "Account" } & AccountFragment) | null };
};

export type AccountChangeEmailMutationVariables = Exact<{
    accountName: Scalars["AccountName"];
    newEmail: Scalars["Email"];
}>;

export type AccountChangeEmailMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byName?: {
            __typename?: "AccountMut";
            updateEmail:
                | { __typename?: "UpdateEmailNonUnique"; message: string }
                | { __typename?: "UpdateEmailSuccess"; newEmail: string; message: string };
        } | null;
    };
};

export type AccountDatasetFlowsPausedQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type AccountDatasetFlowsPausedQuery = {
    __typename?: "Query";
    accounts: {
        __typename?: "Accounts";
        byName?: {
            __typename?: "Account";
            flows: {
                __typename?: "AccountFlows";
                triggers: { __typename?: "AccountFlowTriggers"; allPaused: boolean };
            };
        } | null;
    };
};

export type AccountListDatasetsWithFlowsQueryVariables = Exact<{
    name: Scalars["AccountName"];
}>;

export type AccountListDatasetsWithFlowsQuery = {
    __typename?: "Query";
    accounts: {
        __typename?: "Accounts";
        byName?: {
            __typename?: "Account";
            flows: {
                __typename?: "AccountFlows";
                runs: {
                    __typename?: "AccountFlowRuns";
                    listDatasetsWithFlow: { __typename?: "DatasetConnection" } & DatasetConnectionDataFragment;
                };
            };
        } | null;
    };
};

export type AccountListFlowsQueryVariables = Exact<{
    name: Scalars["AccountName"];
    page?: InputMaybe<Scalars["Int"]>;
    perPageTable?: InputMaybe<Scalars["Int"]>;
    perPageTiles?: InputMaybe<Scalars["Int"]>;
    filters?: InputMaybe<AccountFlowFilters>;
}>;

export type AccountListFlowsQuery = {
    __typename?: "Query";
    accounts: {
        __typename?: "Accounts";
        byName?: {
            __typename?: "Account";
            flows: {
                __typename?: "AccountFlows";
                runs: {
                    __typename?: "AccountFlowRuns";
                    table: { __typename?: "FlowConnection" } & FlowConnectionDataFragment;
                    tiles: { __typename?: "FlowConnection" } & FlowConnectionWidgetDataFragment;
                };
            };
        } | null;
    };
};

export type AccountPauseFlowsMutationVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type AccountPauseFlowsMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byName?: {
            __typename?: "AccountMut";
            flows: {
                __typename?: "AccountFlowsMut";
                triggers: { __typename?: "AccountFlowTriggersMut"; pauseAccountDatasetFlows: boolean };
            };
        } | null;
    };
};

export type AccountResumeFlowsMutationVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type AccountResumeFlowsMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byName?: {
            __typename?: "AccountMut";
            flows: {
                __typename?: "AccountFlowsMut";
                triggers: { __typename?: "AccountFlowTriggersMut"; resumeAccountDatasetFlows: boolean };
            };
        } | null;
    };
};

export type AccountWithEmailQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type AccountWithEmailQuery = {
    __typename?: "Query";
    accounts: { __typename?: "Accounts"; byName?: ({ __typename?: "Account" } & AccountWithEmailFragment) | null };
};

export type ChangeAccountUsernameMutationVariables = Exact<{
    accountName: Scalars["AccountName"];
    newName: Scalars["AccountName"];
}>;

export type ChangeAccountUsernameMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byName?: {
            __typename?: "AccountMut";
            rename:
                | { __typename?: "RenameAccountNameNotUnique"; message: string }
                | { __typename?: "RenameAccountSuccess"; newName: string; message: string };
        } | null;
    };
};

export type ChangeAdminPasswordMutationVariables = Exact<{
    accountName: Scalars["AccountName"];
    password: Scalars["AccountPassword"];
}>;

export type ChangeAdminPasswordMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byName?: {
            __typename?: "AccountMut";
            modifyPassword:
                | { __typename?: "ModifyPasswordSuccess"; message: string }
                | { __typename?: "ModifyPasswordWrongOldPassword" };
        } | null;
    };
};

export type ChangeUserPasswordMutationVariables = Exact<{
    accountName: Scalars["AccountName"];
    oldPassword: Scalars["AccountPassword"];
    newPassword: Scalars["AccountPassword"];
}>;

export type ChangeUserPasswordMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byName?: {
            __typename?: "AccountMut";
            modifyPasswordWithConfirmation:
                | { __typename?: "ModifyPasswordSuccess"; message: string }
                | { __typename?: "ModifyPasswordWrongOldPassword"; message: string };
        } | null;
    };
};

export type DeleteAccountByNameMutationVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type DeleteAccountByNameMutation = {
    __typename?: "Mutation";
    accounts: {
        __typename?: "AccountsMut";
        byName?: { __typename?: "AccountMut"; delete: { __typename?: "DeleteAccountSuccess"; message: string } } | null;
    };
};

export type AccountBasicsFragment = {
    __typename?: "Account";
    id: string;
    accountName: string;
    accountProvider: AccountProvider;
};

export type DatasetConnectionDataFragment = {
    __typename?: "DatasetConnection";
    nodes: Array<
        {
            __typename?: "Dataset";
            metadata: {
                __typename?: "DatasetMetadata";
                currentPollingSource?: {
                    __typename?: "SetPollingSource";
                    fetch:
                        | ({ __typename?: "FetchStepContainer" } & FetchStepContainerDataFragment)
                        | { __typename?: "FetchStepEthereumLogs" }
                        | ({ __typename?: "FetchStepFilesGlob" } & FetchStepFilesGlobDataFragment)
                        | { __typename?: "FetchStepMqtt" }
                        | ({ __typename?: "FetchStepUrl" } & FetchStepUrlDataFragment);
                } | null;
                currentTransform?: {
                    __typename?: "SetTransform";
                    inputs: Array<{ __typename: "TransformInput" }>;
                    transform: { __typename?: "TransformSql"; engine: string };
                } | null;
            };
        } & DatasetBasicsFragment
    >;
};

export type AccountExtendedFragment = {
    __typename?: "Account";
    id: string;
    accountName: string;
    avatarUrl?: string | null;
};

export type AccountWithEmailFragment = {
    __typename?: "Account";
    id: string;
    accountName: string;
    displayName: string;
    avatarUrl?: string | null;
    email: string;
};

export type AccountFragment = {
    __typename?: "Account";
    id: string;
    accountName: string;
    displayName: string;
    accountType: AccountType;
    avatarUrl?: string | null;
    isAdmin: boolean;
    accountProvider: AccountProvider;
};

export type LoginWeb3WalletMutationVariables = Exact<{
    account: Scalars["EvmWalletAddress"];
}>;

export type LoginWeb3WalletMutation = {
    __typename?: "Mutation";
    auth: {
        __typename?: "AuthMut";
        web3: {
            __typename?: "AuthWeb3Mut";
            eip4361AuthNonce: { __typename?: "Eip4361AuthNonceResponse"; value: string };
        };
    };
};

export type LoginMutationVariables = Exact<{
    login_method: AccountProvider;
    login_credentials_json: Scalars["String"];
    deviceCode?: InputMaybe<Scalars["DeviceCode"]>;
}>;

export type LoginMutation = {
    __typename?: "Mutation";
    auth: {
        __typename?: "AuthMut";
        login: {
            __typename?: "LoginResponse";
            accessToken: string;
            account: { __typename?: "Account" } & AccountFragment;
        };
    };
};

export type FetchAccountDetailsMutationVariables = Exact<{
    accessToken: Scalars["String"];
}>;

export type FetchAccountDetailsMutation = {
    __typename?: "Mutation";
    auth: { __typename?: "AuthMut"; accountDetails: { __typename?: "Account" } & AccountFragment };
};

export type SetVisibilityDatasetMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    visibility: DatasetVisibilityInput;
}>;

export type SetVisibilityDatasetMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            setVisibility: { __typename?: "SetDatasetVisibilityResultSuccess"; message: string };
        } | null;
    };
};

export type CommitEventToDatasetMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    event: Scalars["String"];
}>;

export type CommitEventToDatasetMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            metadata: {
                __typename?: "DatasetMetadataMut";
                chain: {
                    __typename?: "MetadataChainMut";
                    commitEvent:
                        | { __typename: "CommitResultAppendError"; message: string }
                        | {
                              __typename: "CommitResultSuccess";
                              message: string;
                              oldHead?: string | null;
                              newHead: string;
                          }
                        | { __typename: "MetadataManifestMalformed"; message: string }
                        | { __typename: "MetadataManifestUnsupportedVersion"; message: string }
                        | { __typename: "NoChanges"; message: string };
                };
            };
        } | null;
    };
};

export type CreateEmptyDatasetMutationVariables = Exact<{
    datasetKind: DatasetKind;
    datasetAlias: Scalars["DatasetAlias"];
    datasetVisibility: DatasetVisibility;
}>;

export type CreateEmptyDatasetMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        createEmpty:
            | {
                  __typename?: "CreateDatasetResultNameCollision";
                  message: string;
                  accountName?: string | null;
                  datasetName: string;
              }
            | {
                  __typename?: "CreateDatasetResultSuccess";
                  message: string;
                  dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
              };
    };
};

export type CreateDatasetFromSnapshotMutationVariables = Exact<{
    snapshot: Scalars["String"];
    datasetVisibility: DatasetVisibility;
}>;

export type CreateDatasetFromSnapshotMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        createFromSnapshot:
            | { __typename?: "CreateDatasetResultInvalidSnapshot"; message: string }
            | { __typename?: "CreateDatasetResultMissingInputs"; missingInputs: Array<string>; message: string }
            | {
                  __typename?: "CreateDatasetResultNameCollision";
                  message: string;
                  accountName?: string | null;
                  datasetName: string;
              }
            | {
                  __typename?: "CreateDatasetResultSuccess";
                  message: string;
                  dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
              }
            | { __typename?: "MetadataManifestMalformed"; message: string }
            | { __typename?: "MetadataManifestUnsupportedVersion"; message: string };
    };
};

export type UpdateReadmeMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    content: Scalars["String"];
}>;

export type UpdateReadmeMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            metadata: {
                __typename?: "DatasetMetadataMut";
                updateReadme:
                    | { __typename: "CommitResultAppendError"; message: string }
                    | { __typename: "CommitResultSuccess"; oldHead?: string | null; message: string }
                    | { __typename: "NoChanges"; message: string };
            };
        } | null;
    };
};

export type UpdateWatermarkMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    watermark: Scalars["DateTime"];
}>;

export type UpdateWatermarkMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            setWatermark:
                | { __typename?: "SetWatermarkIsDerivative"; message: string }
                | { __typename?: "SetWatermarkUpToDate"; message: string }
                | { __typename?: "SetWatermarkUpdated"; newHead: string; message: string };
        } | null;
    };
};

export type GetDatasetBasicsWithPermissionsQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
}>;

export type GetDatasetBasicsWithPermissionsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?: ({ __typename?: "Dataset" } & DatasetBasicsFragment & DatasetPermissionsFragment) | null;
    };
};

export type DatasetByAccountAndDatasetNameQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
}>;

export type DatasetByAccountAndDatasetNameQuery = {
    __typename?: "Query";
    datasets: { __typename?: "Datasets"; byOwnerAndName?: ({ __typename?: "Dataset" } & DatasetBasicsFragment) | null };
};

export type DatasetByIdQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetByIdQuery = {
    __typename?: "Query";
    datasets: { __typename?: "Datasets"; byId?: ({ __typename?: "Dataset" } & DatasetBasicsFragment) | null };
};

export type DatasetListCollaboratorsQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
}>;

export type DatasetListCollaboratorsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
            | ({
                  __typename?: "Dataset";
                  collaboration: {
                      __typename?: "DatasetCollaboration";
                      accountRoles: {
                          __typename?: "AccountWithRoleConnection";
                          totalCount: number;
                          nodes: Array<{
                              __typename?: "AccountWithRole";
                              role: DatasetAccessRole;
                              account: { __typename?: "Account" } & AccountFragment;
                          }>;
                          pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type SetRoleCollaboratorMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    accountId: Scalars["AccountID"];
    role: DatasetAccessRole;
}>;

export type SetRoleCollaboratorMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            collaboration: {
                __typename?: "DatasetCollaborationMut";
                setRole: { __typename?: "SetRoleResultSuccess"; message: string };
            };
        } | null;
    };
};

export type UnsetRoleCollaboratorMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    accountIds: Array<Scalars["AccountID"]> | Scalars["AccountID"];
}>;

export type UnsetRoleCollaboratorMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            collaboration: {
                __typename?: "DatasetCollaborationMut";
                unsetRoles: { __typename?: "UnsetRoleResultSuccess"; message: string };
            };
        } | null;
    };
};

export type GetDatasetDataSqlRunQueryVariables = Exact<{
    query: Scalars["String"];
    limit: Scalars["Int"];
    skip?: InputMaybe<Scalars["Int"]>;
}>;

export type GetDatasetDataSqlRunQuery = {
    __typename?: "Query";
    data: {
        __typename?: "DataQueries";
        query:
            | { __typename: "DataQueryResultError"; errorMessage: string; errorKind: DataQueryResultErrorKind }
            | ({ __typename: "DataQueryResultSuccess"; limit: number } & DataQueryResultSuccessViewFragment);
    };
};

export type DatasetHeadBlockHashQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
}>;

export type DatasetHeadBlockHashQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?: {
            __typename?: "Dataset";
            metadata: {
                __typename?: "DatasetMetadata";
                chain: {
                    __typename?: "MetadataChain";
                    refs: Array<{ __typename?: "BlockRef"; name: string; blockHash: string }>;
                };
            };
        } | null;
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
                              nodes: Array<{ __typename?: "MetadataBlockExtended" } & MetadataBlockFragment>;
                              pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
                          };
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type GetDatasetLineageQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
}>;

export type GetDatasetLineageQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?: ({ __typename?: "Dataset" } & DatasetBasicsFragment & DatasetLineageFragment) | null;
    };
};

export type DatasetListDownstreamsQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetListDownstreamsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            metadata: {
                __typename?: "DatasetMetadata";
                currentDownstreamDependencies: Array<
                    | {
                          __typename?: "DependencyDatasetResultAccessible";
                          dataset: {
                              __typename?: "Dataset";
                              name: string;
                              owner: { __typename?: "Account"; accountName: string; avatarUrl?: string | null };
                          };
                      }
                    | { __typename?: "DependencyDatasetResultNotAccessible" }
                >;
            };
        } | null;
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
                  DatasetPermissionsFragment)
            | null;
    };
};

export type DatasetProtocolsQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
}>;

export type DatasetProtocolsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?:
            | ({
                  __typename?: "Dataset";
                  endpoints: {
                      __typename?: "DatasetEndpoints";
                      cli: { __typename?: "CliProtocolDesc"; pullCommand: string; pushCommand: string };
                      webLink: { __typename?: "LinkProtocolDesc"; url: string };
                      rest: { __typename?: "RestProtocolDesc"; tailUrl: string; queryUrl: string; pushUrl: string };
                      flightsql: { __typename?: "FlightSqlDesc"; url: string };
                      jdbc: { __typename?: "JdbcDesc"; url: string };
                      postgresql: { __typename?: "PostgreSqlDesl"; url: string };
                      kafka: { __typename?: "KafkaProtocolDesc"; url: string };
                      websocket: { __typename?: "WebSocketProtocolDesc"; url: string };
                      odata: { __typename?: "OdataProtocolDesc"; serviceUrl: string; collectionUrl: string };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type DatasetPushSyncStatusesQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetPushSyncStatusesQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            metadata: {
                __typename?: "DatasetMetadata";
                pushSyncStatuses: {
                    __typename?: "DatasetPushStatuses";
                    statuses: Array<{
                        __typename?: "DatasetPushStatus";
                        remote: string;
                        result:
                            | {
                                  __typename?: "CompareChainsResultError";
                                  reason: { __typename?: "CompareChainsResultReason"; message: string };
                              }
                            | { __typename?: "CompareChainsResultStatus"; message: CompareChainsStatus };
                    }>;
                };
            };
        } | null;
    };
};

export type GetDatasetSchemaQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type GetDatasetSchemaQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
            | ({
                  __typename?: "Dataset";
                  metadata: {
                      __typename?: "DatasetMetadata";
                      currentSchema?: { __typename?: "DataSchema"; format: DataSchemaFormat; content: string } | null;
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type DatasetSystemTimeBlockByHashQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    blockHash: Scalars["Multihash"];
}>;

export type DatasetSystemTimeBlockByHashQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
            | ({
                  __typename?: "Dataset";
                  metadata: {
                      __typename?: "DatasetMetadata";
                      chain: {
                          __typename?: "MetadataChain";
                          blockByHash?: { __typename?: "MetadataBlockExtended"; systemTime: string } | null;
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type DatasetUserRoleQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetUserRoleQuery = {
    __typename?: "Query";
    datasets: { __typename?: "Datasets"; byId?: { __typename?: "Dataset"; role?: DatasetAccessRole | null } | null };
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
            nodes: Array<{ __typename: "Dataset" } & DatasetSearchOverviewFragment>;
            pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
        };
    };
};

export type DatasetsTotalCountByAccountNameQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type DatasetsTotalCountByAccountNameQuery = {
    __typename?: "Query";
    datasets: { __typename?: "Datasets"; byAccountName: { __typename?: "DatasetConnection"; totalCount: number } };
};

export type DeleteDatasetMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DeleteDatasetMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            delete:
                | {
                      __typename?: "DeleteResultDanglingReference";
                      message: string;
                      danglingChildRefs: Array<string>;
                      notDeletedDataset: string;
                  }
                | { __typename?: "DeleteResultSuccess"; message: string; deletedDataset: string };
        } | null;
    };
};

export type GetEnabledLoginMethodsQueryVariables = Exact<{ [key: string]: never }>;

export type GetEnabledLoginMethodsQuery = {
    __typename?: "Query";
    auth: { __typename?: "Auth"; enabledProviders: Array<AccountProvider> };
};

export type EnginesQueryVariables = Exact<{ [key: string]: never }>;

export type EnginesQuery = {
    __typename?: "Query";
    data: {
        __typename?: "DataQueries";
        knownEngines: Array<{ __typename?: "EngineDesc"; name: string; dialect: QueryDialect; latestImage: string }>;
    };
};

export type DeleteEnvVariableMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetEnvVarId: Scalars["DatasetEnvVarID"];
}>;

export type DeleteEnvVariableMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            envVars: {
                __typename?: "DatasetEnvVarsMut";
                deleteEnvVariable:
                    | { __typename?: "DeleteDatasetEnvVarResultNotFound"; message: string; envVarId: string }
                    | { __typename?: "DeleteDatasetEnvVarResultSuccess"; message: string; envVarId: string };
            };
        } | null;
    };
};

export type ExposedEnvVariableValueQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
    datasetEnvVarId: Scalars["DatasetEnvVarID"];
}>;

export type ExposedEnvVariableValueQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?: {
            __typename?: "Dataset";
            envVars: { __typename?: "DatasetEnvVars"; exposedValue: string };
        } | null;
    };
};

export type ViewDatasetEnvVarDataFragment = {
    __typename?: "ViewDatasetEnvVar";
    id: string;
    key: string;
    value?: string | null;
    isSecret: boolean;
};

export type ListEnvVariablesQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
    datasetName: Scalars["DatasetName"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
}>;

export type ListEnvVariablesQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byOwnerAndName?:
            | ({
                  __typename?: "Dataset";
                  envVars: {
                      __typename?: "DatasetEnvVars";
                      listEnvVariables: {
                          __typename?: "ViewDatasetEnvVarConnection";
                          totalCount: number;
                          nodes: Array<{ __typename?: "ViewDatasetEnvVar" } & ViewDatasetEnvVarDataFragment>;
                          pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type UpsertEnvVariableMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    key: Scalars["String"];
    value: Scalars["String"];
    isSecret: Scalars["Boolean"];
}>;

export type UpsertEnvVariableMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            envVars: {
                __typename?: "DatasetEnvVarsMut";
                upsertEnvVariable:
                    | {
                          __typename?: "UpsertDatasetEnvVarResultCreated";
                          message: string;
                          envVar: { __typename?: "ViewDatasetEnvVar" } & ViewDatasetEnvVarDataFragment;
                      }
                    | {
                          __typename?: "UpsertDatasetEnvVarResultUpdated";
                          message: string;
                          envVar: { __typename?: "ViewDatasetEnvVar" } & ViewDatasetEnvVarDataFragment;
                      }
                    | { __typename?: "UpsertDatasetEnvVarUpToDate"; message: string };
            };
        } | null;
    };
};

export type GetDatasetFlowConfigsQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType: DatasetFlowType;
}>;

export type GetDatasetFlowConfigsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
            | ({
                  __typename?: "Dataset";
                  flows: {
                      __typename?: "DatasetFlows";
                      configs: {
                          __typename: "DatasetFlowConfigs";
                          byType?: {
                              __typename: "FlowConfiguration";
                              rule:
                                  | {
                                        __typename?: "FlowConfigRuleCompaction";
                                        maxSliceSize: number;
                                        maxSliceRecords: number;
                                    }
                                  | { __typename?: "FlowConfigRuleIngest"; fetchUncacheable: boolean }
                                  | {
                                        __typename?: "FlowConfigRuleReset";
                                        oldHeadHash?: string | null;
                                        mode:
                                            | { __typename?: "FlowConfigResetPropagationModeCustom" }
                                            | {
                                                  __typename?: "FlowConfigResetPropagationModeToSeed";
                                                  dummy?: string | null;
                                              };
                                    };
                              retryPolicy?: {
                                  __typename?: "FlowRetryPolicy";
                                  maxAttempts: number;
                                  backoffType: FlowRetryBackoffType;
                                  minDelay: { __typename?: "TimeDelta" } & TimeDeltaDataFragment;
                              } | null;
                          } | null;
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type SetCompactionFlowConfigMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    compactionConfigInput: FlowConfigCompactionInput;
}>;

export type SetCompactionFlowConfigMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                configs: {
                    __typename?: "DatasetFlowConfigsMut";
                    setCompactionConfig:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              message: string;
                              actualDatasetKind: DatasetKind;
                              expectedDatasetKind: DatasetKind;
                          }
                        | { __typename?: "FlowInvalidConfigInputError"; message: string; reason: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string; preconditions: string }
                        | { __typename?: "SetFlowConfigSuccess"; message: string };
                };
            };
        } | null;
    };
};

export type SetIngestFlowConfigMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    ingestConfigInput: FlowConfigIngestInput;
    retryPolicyInput?: InputMaybe<FlowRetryPolicyInput>;
}>;

export type SetIngestFlowConfigMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                configs: {
                    __typename?: "DatasetFlowConfigsMut";
                    setIngestConfig:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              message: string;
                              actualDatasetKind: DatasetKind;
                              expectedDatasetKind: DatasetKind;
                          }
                        | { __typename?: "FlowInvalidConfigInputError"; message: string; reason: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string; preconditions: string }
                        | { __typename?: "SetFlowConfigSuccess"; message: string };
                };
            };
        } | null;
    };
};

export type SetDatasetFlowTriggersMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType: DatasetFlowType;
    paused: Scalars["Boolean"];
    triggerInput: FlowTriggerInput;
}>;

export type SetDatasetFlowTriggersMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                triggers: {
                    __typename?: "DatasetFlowTriggersMut";
                    setTrigger:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              message: string;
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                          }
                        | { __typename?: "FlowInvalidTriggerInputError"; message: string; reason: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string }
                        | { __typename?: "FlowTypeIsNotSupported"; message: string }
                        | { __typename?: "SetFlowTriggerSuccess"; message: string };
                };
            };
        } | null;
    };
};

export type GetDatasetFlowTriggersQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType: DatasetFlowType;
}>;

export type GetDatasetFlowTriggersQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            flows: {
                __typename?: "DatasetFlows";
                triggers: {
                    __typename?: "DatasetFlowTriggers";
                    byType?: {
                        __typename?: "FlowTrigger";
                        paused: boolean;
                        schedule?:
                            | { __typename?: "Cron5ComponentExpression"; cron5ComponentExpression: string }
                            | ({ __typename?: "TimeDelta" } & TimeDeltaDataFragment)
                            | null;
                        reactive?: {
                            __typename?: "FlowTriggerReactiveRule";
                            forBreakingChange: BreakingChangeRule;
                            forNewData: {
                                __typename?: "FlowTriggerBatchingRule";
                                minRecordsToAwait: number;
                                maxBatchingInterval?: ({ __typename?: "TimeDelta" } & TimeDeltaDataFragment) | null;
                            };
                        } | null;
                    } | null;
                };
            };
        } | null;
    };
};

export type TimeDeltaDataFragment = { __typename?: "TimeDelta"; every: number; unit: TimeUnit };

export type DatasetAllFlowsPausedQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetAllFlowsPausedQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            flows: {
                __typename?: "DatasetFlows";
                triggers: { __typename?: "DatasetFlowTriggers"; allPaused: boolean };
            };
        } | null;
    };
};

export type CancelScheduledTasksMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    flowId: Scalars["FlowID"];
}>;

export type CancelScheduledTasksMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                runs: {
                    __typename?: "DatasetFlowRunsMut";
                    cancelScheduledTasks:
                        | {
                              __typename?: "CancelScheduledTasksSuccess";
                              message: string;
                              flow: { __typename?: "Flow" } & FlowSummaryDataFragment;
                          }
                        | { __typename?: "FlowNotFound"; flowId: string; message: string };
                };
            };
        } | null;
    };
};

export type GetFlowByIdQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    flowId: Scalars["FlowID"];
}>;

export type GetFlowByIdQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            flows: {
                __typename?: "DatasetFlows";
                runs: {
                    __typename?: "DatasetFlowRuns";
                    getFlow:
                        | { __typename?: "FlowNotFound"; message: string; flowId: string }
                        | {
                              __typename?: "GetFlowSuccess";
                              flow: {
                                  __typename?: "Flow";
                                  history: Array<
                                      | ({
                                            __typename?: "FlowConfigSnapshotModified";
                                        } & FlowHistoryData_FlowConfigSnapshotModified_Fragment)
                                      | ({
                                            __typename?: "FlowEventAborted";
                                        } & FlowHistoryData_FlowEventAborted_Fragment)
                                      | ({
                                            __typename?: "FlowEventActivationCauseAdded";
                                        } & FlowHistoryData_FlowEventActivationCauseAdded_Fragment)
                                      | ({
                                            __typename?: "FlowEventInitiated";
                                        } & FlowHistoryData_FlowEventInitiated_Fragment)
                                      | ({
                                            __typename?: "FlowEventScheduledForActivation";
                                        } & FlowHistoryData_FlowEventScheduledForActivation_Fragment)
                                      | ({
                                            __typename?: "FlowEventStartConditionUpdated";
                                        } & FlowHistoryData_FlowEventStartConditionUpdated_Fragment)
                                      | ({
                                            __typename?: "FlowEventTaskChanged";
                                        } & FlowHistoryData_FlowEventTaskChanged_Fragment)
                                  >;
                              } & FlowSummaryDataFragment;
                          };
                };
            };
        } | null;
    };
};

export type DatasetFlowsInitiatorsQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetFlowsInitiatorsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            flows: {
                __typename?: "DatasetFlows";
                runs: {
                    __typename?: "DatasetFlowRuns";
                    listFlowInitiators: {
                        __typename?: "AccountConnection";
                        totalCount: number;
                        nodes: Array<{ __typename?: "Account" } & AccountFragment>;
                    };
                };
            };
        } | null;
    };
};

export type GetDatasetListFlowsQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    page?: InputMaybe<Scalars["Int"]>;
    perPageTable?: InputMaybe<Scalars["Int"]>;
    perPageTiles?: InputMaybe<Scalars["Int"]>;
    filters?: InputMaybe<DatasetFlowFilters>;
}>;

export type GetDatasetListFlowsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?:
            | ({
                  __typename?: "Dataset";
                  flows: {
                      __typename?: "DatasetFlows";
                      runs: {
                          __typename?: "DatasetFlowRuns";
                          table: { __typename?: "FlowConnection" } & FlowConnectionDataFragment;
                          tiles: { __typename?: "FlowConnection" } & FlowConnectionWidgetDataFragment;
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type DatasetPauseFlowsMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetPauseFlowsMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                triggers: { __typename?: "DatasetFlowTriggersMut"; pauseFlows: boolean };
            };
        } | null;
    };
};

export type DatasetResumeFlowsMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetResumeFlowsMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                triggers: { __typename?: "DatasetFlowTriggersMut"; resumeFlows: boolean };
            };
        } | null;
    };
};

export type FlowConnectionDataFragment = {
    __typename?: "FlowConnection";
    totalCount: number;
    nodes: Array<{ __typename?: "Flow" } & FlowSummaryDataFragment>;
    pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
};

type FlowHistoryData_FlowConfigSnapshotModified_Fragment = {
    __typename: "FlowConfigSnapshotModified";
    eventId: string;
    eventTime: string;
    configSnapshot:
        | { __typename: "FlowConfigRuleCompaction" }
        | { __typename: "FlowConfigRuleIngest" }
        | { __typename: "FlowConfigRuleReset" };
};

type FlowHistoryData_FlowEventAborted_Fragment = { __typename: "FlowEventAborted"; eventId: string; eventTime: string };

type FlowHistoryData_FlowEventActivationCauseAdded_Fragment = {
    __typename: "FlowEventActivationCauseAdded";
    eventId: string;
    eventTime: string;
    activationCause:
        | { __typename: "FlowActivationCauseAutoPolling" }
        | {
              __typename: "FlowActivationCauseDatasetUpdate";
              dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
              source:
                  | { __typename: "FlowActivationCauseDatasetUpdateSourceHttpIngest"; sourceName?: string | null }
                  | {
                        __typename: "FlowActivationCauseDatasetUpdateSourceSmartProtocolPush";
                        accountName?: string | null;
                        isForce: boolean;
                    }
                  | { __typename: "FlowActivationCauseDatasetUpdateSourceUpstreamFlow"; flowId: string };
          }
        | { __typename: "FlowActivationCauseManual"; initiator: { __typename?: "Account" } & AccountFragment };
};

type FlowHistoryData_FlowEventInitiated_Fragment = {
    __typename: "FlowEventInitiated";
    eventId: string;
    eventTime: string;
    activationCause:
        | { __typename: "FlowActivationCauseAutoPolling" }
        | {
              __typename: "FlowActivationCauseDatasetUpdate";
              dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
              source:
                  | { __typename: "FlowActivationCauseDatasetUpdateSourceHttpIngest"; sourceName?: string | null }
                  | {
                        __typename: "FlowActivationCauseDatasetUpdateSourceSmartProtocolPush";
                        accountName?: string | null;
                        isForce: boolean;
                    }
                  | { __typename: "FlowActivationCauseDatasetUpdateSourceUpstreamFlow"; flowId: string };
          }
        | { __typename: "FlowActivationCauseManual"; initiator: { __typename?: "Account" } & AccountFragment };
};

type FlowHistoryData_FlowEventScheduledForActivation_Fragment = {
    __typename: "FlowEventScheduledForActivation";
    scheduledForActivationAt: string;
    eventId: string;
    eventTime: string;
};

type FlowHistoryData_FlowEventStartConditionUpdated_Fragment = {
    __typename: "FlowEventStartConditionUpdated";
    eventId: string;
    eventTime: string;
    startCondition:
        | { __typename: "FlowStartConditionExecutor"; taskId: string }
        | {
              __typename: "FlowStartConditionReactive";
              batchingDeadline: string;
              accumulatedRecordsCount: number;
              watermarkModified: boolean;
              activeBatchingRule: {
                  __typename?: "FlowTriggerBatchingRule";
                  minRecordsToAwait: number;
                  maxBatchingInterval?: ({ __typename?: "TimeDelta" } & TimeDeltaDataFragment) | null;
              };
          }
        | { __typename: "FlowStartConditionSchedule"; wakeUpAt: string }
        | { __typename: "FlowStartConditionThrottling"; intervalSec: number; wakeUpAt: string; shiftedFrom: string };
};

type FlowHistoryData_FlowEventTaskChanged_Fragment = {
    __typename: "FlowEventTaskChanged";
    taskId: string;
    taskStatus: TaskStatus;
    nextAttemptAt?: string | null;
    eventId: string;
    eventTime: string;
    task: {
        __typename?: "Task";
        outcome?:
            | { __typename: "TaskOutcomeCancelled" }
            | {
                  __typename: "TaskOutcomeFailed";
                  reason:
                      | { __typename: "TaskFailureReasonGeneral"; message: string }
                      | {
                            __typename: "TaskFailureReasonInputDatasetCompacted";
                            message: string;
                            inputDataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
                        };
              }
            | { __typename: "TaskOutcomeSuccess" }
            | null;
    };
};

export type FlowHistoryDataFragment =
    | FlowHistoryData_FlowConfigSnapshotModified_Fragment
    | FlowHistoryData_FlowEventAborted_Fragment
    | FlowHistoryData_FlowEventActivationCauseAdded_Fragment
    | FlowHistoryData_FlowEventInitiated_Fragment
    | FlowHistoryData_FlowEventScheduledForActivation_Fragment
    | FlowHistoryData_FlowEventStartConditionUpdated_Fragment
    | FlowHistoryData_FlowEventTaskChanged_Fragment;

export type FlowItemWidgetDataFragment = {
    __typename?: "Flow";
    flowId: string;
    datasetId?: string | null;
    status: FlowStatus;
    initiator?: { __typename?: "Account"; accountName: string } | null;
    outcome?:
        | ({ __typename?: "FlowAbortedResult" } & FlowOutcomeData_FlowAbortedResult_Fragment)
        | ({ __typename?: "FlowFailedError" } & FlowOutcomeData_FlowFailedError_Fragment)
        | ({ __typename?: "FlowSuccessResult" } & FlowOutcomeData_FlowSuccessResult_Fragment)
        | null;
    timing: {
        __typename?: "FlowTimingRecords";
        initiatedAt: string;
        firstAttemptScheduledAt?: string | null;
        scheduledAt?: string | null;
        awaitingExecutorSince?: string | null;
        runningSince?: string | null;
        lastAttemptFinishedAt?: string | null;
    };
};

type FlowOutcomeData_FlowAbortedResult_Fragment = { __typename?: "FlowAbortedResult"; message: string };

type FlowOutcomeData_FlowFailedError_Fragment = {
    __typename?: "FlowFailedError";
    reason:
        | { __typename?: "TaskFailureReasonGeneral"; message: string }
        | {
              __typename?: "TaskFailureReasonInputDatasetCompacted";
              message: string;
              inputDataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
          };
};

type FlowOutcomeData_FlowSuccessResult_Fragment = { __typename?: "FlowSuccessResult"; message: string };

export type FlowOutcomeDataFragment =
    | FlowOutcomeData_FlowAbortedResult_Fragment
    | FlowOutcomeData_FlowFailedError_Fragment
    | FlowOutcomeData_FlowSuccessResult_Fragment;

export type FlowSummaryDataFragment = {
    __typename?: "Flow";
    flowId: string;
    datasetId?: string | null;
    status: FlowStatus;
    taskIds: Array<string>;
    description:
        | {
              __typename?: "FlowDescriptionDatasetExecuteTransform";
              transform: {
                  __typename?: "SetTransform";
                  inputs: Array<{ __typename: "TransformInput" }>;
                  transform: { __typename?: "TransformSql"; engine: string };
              };
              transformResult?:
                  | {
                        __typename?: "FlowDescriptionUpdateResultSuccess";
                        numBlocks: number;
                        numRecords: number;
                        updatedWatermark?: string | null;
                    }
                  | { __typename?: "FlowDescriptionUpdateResultUnknown"; message: string }
                  | { __typename?: "FlowDescriptionUpdateResultUpToDate"; uncacheable: boolean }
                  | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetHardCompaction";
              compactionResult?:
                  | { __typename?: "FlowDescriptionReorganizationNothingToDo"; message: string; dummy?: string | null }
                  | {
                        __typename?: "FlowDescriptionReorganizationSuccess";
                        originalBlocksCount: number;
                        resultingBlocksCount: number;
                        newHead: string;
                    }
                  | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetPollingIngest";
              pollingSource: {
                  __typename?: "SetPollingSource";
                  fetch:
                      | ({ __typename?: "FetchStepContainer" } & FetchStepContainerDataFragment)
                      | { __typename?: "FetchStepEthereumLogs" }
                      | ({ __typename?: "FetchStepFilesGlob" } & FetchStepFilesGlobDataFragment)
                      | { __typename?: "FetchStepMqtt" }
                      | ({ __typename?: "FetchStepUrl" } & FetchStepUrlDataFragment);
              };
              ingestResult?:
                  | {
                        __typename?: "FlowDescriptionUpdateResultSuccess";
                        numBlocks: number;
                        numRecords: number;
                        updatedWatermark?: string | null;
                    }
                  | { __typename?: "FlowDescriptionUpdateResultUnknown"; message: string }
                  | { __typename?: "FlowDescriptionUpdateResultUpToDate"; uncacheable: boolean }
                  | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetPushIngest";
              sourceName?: string | null;
              ingestResult?:
                  | {
                        __typename?: "FlowDescriptionUpdateResultSuccess";
                        numBlocks: number;
                        numRecords: number;
                        updatedWatermark?: string | null;
                    }
                  | { __typename?: "FlowDescriptionUpdateResultUnknown"; message: string }
                  | { __typename?: "FlowDescriptionUpdateResultUpToDate"; uncacheable: boolean }
                  | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetReset";
              resetResult?: { __typename?: "FlowDescriptionResetResult"; newHead: string } | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetResetToMetadata";
              resetToMetadataResult?:
                  | { __typename?: "FlowDescriptionReorganizationNothingToDo"; message: string; dummy?: string | null }
                  | {
                        __typename?: "FlowDescriptionReorganizationSuccess";
                        originalBlocksCount: number;
                        resultingBlocksCount: number;
                        newHead: string;
                    }
                  | null;
          }
        | { __typename?: "FlowDescriptionSystemGC"; dummy: boolean }
        | { __typename?: "FlowDescriptionUnknown" }
        | { __typename?: "FlowDescriptionWebhookDeliver"; targetUrl: string; label: string; eventType: string };
    initiator?: ({ __typename?: "Account" } & AccountFragment) | null;
    outcome?:
        | ({ __typename?: "FlowAbortedResult" } & FlowOutcomeData_FlowAbortedResult_Fragment)
        | ({ __typename?: "FlowFailedError" } & FlowOutcomeData_FlowFailedError_Fragment)
        | ({ __typename?: "FlowSuccessResult" } & FlowOutcomeData_FlowSuccessResult_Fragment)
        | null;
    timing: {
        __typename?: "FlowTimingRecords";
        initiatedAt: string;
        firstAttemptScheduledAt?: string | null;
        scheduledAt?: string | null;
        awaitingExecutorSince?: string | null;
        runningSince?: string | null;
        lastAttemptFinishedAt?: string | null;
    };
    startCondition?:
        | { __typename: "FlowStartConditionExecutor"; taskId: string }
        | {
              __typename: "FlowStartConditionReactive";
              batchingDeadline: string;
              accumulatedRecordsCount: number;
              watermarkModified: boolean;
              activeBatchingRule: {
                  __typename?: "FlowTriggerBatchingRule";
                  minRecordsToAwait: number;
                  maxBatchingInterval?: ({ __typename?: "TimeDelta" } & TimeDeltaDataFragment) | null;
              };
          }
        | { __typename: "FlowStartConditionSchedule"; wakeUpAt: string }
        | { __typename: "FlowStartConditionThrottling"; intervalSec: number; wakeUpAt: string; shiftedFrom: string }
        | null;
    configSnapshot?:
        | { __typename?: "FlowConfigRuleCompaction" }
        | { __typename?: "FlowConfigRuleIngest"; fetchUncacheable: boolean }
        | { __typename?: "FlowConfigRuleReset" }
        | null;
    retryPolicy?: { __typename?: "FlowRetryPolicy"; maxAttempts: number } | null;
};

export type FlowConnectionWidgetDataFragment = {
    __typename?: "FlowConnection";
    totalCount: number;
    nodes: Array<{ __typename?: "Flow" } & FlowItemWidgetDataFragment>;
};

export type DatasetTriggerCompactionFlowMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    compactionConfigInput?: InputMaybe<FlowConfigCompactionInput>;
}>;

export type DatasetTriggerCompactionFlowMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                runs: {
                    __typename?: "DatasetFlowRunsMut";
                    triggerCompactionFlow:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                              message: string;
                          }
                        | { __typename?: "FlowInvalidRunConfigurations"; error: string; message: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string }
                        | {
                              __typename?: "TriggerFlowSuccess";
                              message: string;
                              flow: { __typename?: "Flow" } & FlowSummaryDataFragment;
                          };
                };
            };
        } | null;
    };
};

export type DatasetTriggerIngestFlowMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    ingestConfigInput?: InputMaybe<FlowConfigIngestInput>;
}>;

export type DatasetTriggerIngestFlowMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                runs: {
                    __typename?: "DatasetFlowRunsMut";
                    triggerIngestFlow:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                              message: string;
                          }
                        | { __typename?: "FlowInvalidRunConfigurations"; error: string; message: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string }
                        | {
                              __typename?: "TriggerFlowSuccess";
                              message: string;
                              flow: { __typename?: "Flow" } & FlowSummaryDataFragment;
                          };
                };
            };
        } | null;
    };
};

export type DatasetTriggerResetFlowMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    resetConfigInput: FlowConfigResetInput;
}>;

export type DatasetTriggerResetFlowMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                runs: {
                    __typename?: "DatasetFlowRunsMut";
                    triggerResetFlow:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                              message: string;
                          }
                        | { __typename?: "FlowInvalidRunConfigurations"; error: string; message: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string }
                        | {
                              __typename?: "TriggerFlowSuccess";
                              message: string;
                              flow: { __typename?: "Flow" } & FlowSummaryDataFragment;
                          };
                };
            };
        } | null;
    };
};

export type DatasetTriggerResetToMetadataFlowMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetTriggerResetToMetadataFlowMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                runs: {
                    __typename?: "DatasetFlowRunsMut";
                    triggerResetToMetadataFlow:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                              message: string;
                          }
                        | { __typename?: "FlowInvalidRunConfigurations"; error: string; message: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string }
                        | {
                              __typename?: "TriggerFlowSuccess";
                              message: string;
                              flow: { __typename?: "Flow" } & FlowSummaryDataFragment;
                          };
                };
            };
        } | null;
    };
};

export type DatasetTriggerTransformFlowMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetTriggerTransformFlowMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                runs: {
                    __typename?: "DatasetFlowRunsMut";
                    triggerTransformFlow:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                              message: string;
                          }
                        | { __typename?: "FlowInvalidRunConfigurations"; error: string; message: string }
                        | { __typename?: "FlowPreconditionsNotMet"; message: string }
                        | {
                              __typename?: "TriggerFlowSuccess";
                              message: string;
                              flow: { __typename?: "Flow" } & FlowSummaryDataFragment;
                          };
                };
            };
        } | null;
    };
};

export type AddDataEventFragment = {
    __typename?: "AddData";
    prevCheckpoint?: string | null;
    prevOffset?: number | null;
    newWatermark?: string | null;
    newData?: {
        __typename?: "DataSlice";
        logicalHash: string;
        physicalHash: string;
        size: number;
        offsetInterval: { __typename?: "OffsetInterval"; start: number; end: number };
    } | null;
    newCheckpoint?: { __typename?: "Checkpoint"; physicalHash: string; size: number } | null;
    newSourceState?: { __typename?: "SourceState"; sourceName: string; kind: string; value: string } | null;
};

export type AddPushSourceEventFragment = {
    __typename?: "AddPushSource";
    sourceName: string;
    read:
        | ({ __typename?: "ReadStepCsv" } & ReadStepCsvDataFragment)
        | ({ __typename?: "ReadStepEsriShapefile" } & ReadStepEsriShapefileDataFragment)
        | ({ __typename?: "ReadStepGeoJson" } & ReadStepGeoJsonDataFragment)
        | ({ __typename?: "ReadStepJson" } & ReadStepJsonDataFragment)
        | ({ __typename?: "ReadStepNdGeoJson" } & ReadStepNdGeoJsonDataFragment)
        | ({ __typename?: "ReadStepNdJson" } & ReadStepNdJsonDataFragment)
        | ({ __typename?: "ReadStepParquet" } & ReadStepParquetDataFragment);
    merge:
        | ({ __typename?: "MergeStrategyAppend" } & MergeStrategyAppendDataFragment)
        | ({ __typename?: "MergeStrategyChangelogStream" } & MergeStrategyChangelogStreamDataFragment)
        | ({ __typename?: "MergeStrategyLedger" } & MergeStrategyLedgerDataFragment)
        | ({ __typename?: "MergeStrategySnapshot" } & MergeStrategySnapshotDataFragment)
        | ({ __typename?: "MergeStrategyUpsertStream" } & MergeStrategyUpsertStreamDataFragment);
    preprocess?: ({ __typename?: "TransformSql" } & PreprocessStepDataFragment) | null;
};

export type DisablePollingSourceEventFragment = { __typename?: "DisablePollingSource"; dummy?: string | null };

export type ExecuteTransformEventFragment = {
    __typename?: "ExecuteTransform";
    prevCheckpoint?: string | null;
    prevOffset?: number | null;
    newWatermark?: string | null;
    queryInputs: Array<{
        __typename?: "ExecuteTransformInput";
        datasetId: string;
        prevBlockHash?: string | null;
        newBlockHash?: string | null;
        prevOffset?: number | null;
        newOffset?: number | null;
    }>;
    newData?: {
        __typename?: "DataSlice";
        logicalHash: string;
        physicalHash: string;
        size: number;
        offsetInterval: { __typename?: "OffsetInterval"; start: number; end: number };
    } | null;
    newCheckpoint?: { __typename?: "Checkpoint"; physicalHash: string; size: number } | null;
};

export type SeedEventFragment = { __typename?: "Seed"; datasetId: string; datasetKind: DatasetKind };

export type SetAttachmentsEventFragment = {
    __typename?: "SetAttachments";
    attachments: {
        __typename?: "AttachmentsEmbedded";
        items: Array<{ __typename?: "AttachmentEmbedded"; path: string; content: string }>;
    };
};

export type SetDataSchemaEventFragment = {
    __typename?: "SetDataSchema";
    schema: { __typename?: "DataSchema"; format: DataSchemaFormat; content: string };
};

export type SetLicenseEventFragment = {
    __typename?: "SetLicense";
    shortName: string;
    name: string;
    spdxId?: string | null;
    websiteUrl: string;
};

export type SetPollingSourceEventFragment = {
    __typename?: "SetPollingSource";
    fetch:
        | ({ __typename?: "FetchStepContainer" } & FetchStepContainerDataFragment)
        | ({ __typename?: "FetchStepEthereumLogs" } & FetchStepEthereumLogsDataFragment)
        | ({ __typename?: "FetchStepFilesGlob" } & FetchStepFilesGlobDataFragment)
        | ({ __typename?: "FetchStepMqtt" } & FetchStepMqttDataFragment)
        | ({ __typename?: "FetchStepUrl" } & FetchStepUrlDataFragment);
    read:
        | ({ __typename?: "ReadStepCsv" } & ReadStepCsvDataFragment)
        | ({ __typename?: "ReadStepEsriShapefile" } & ReadStepEsriShapefileDataFragment)
        | ({ __typename?: "ReadStepGeoJson" } & ReadStepGeoJsonDataFragment)
        | ({ __typename?: "ReadStepJson" } & ReadStepJsonDataFragment)
        | ({ __typename?: "ReadStepNdGeoJson" } & ReadStepNdGeoJsonDataFragment)
        | ({ __typename?: "ReadStepNdJson" } & ReadStepNdJsonDataFragment)
        | ({ __typename?: "ReadStepParquet" } & ReadStepParquetDataFragment);
    merge:
        | ({ __typename?: "MergeStrategyAppend" } & MergeStrategyAppendDataFragment)
        | ({ __typename?: "MergeStrategyChangelogStream" } & MergeStrategyChangelogStreamDataFragment)
        | ({ __typename?: "MergeStrategyLedger" } & MergeStrategyLedgerDataFragment)
        | ({ __typename?: "MergeStrategySnapshot" } & MergeStrategySnapshotDataFragment)
        | ({ __typename?: "MergeStrategyUpsertStream" } & MergeStrategyUpsertStreamDataFragment);
    prepare?: Array<
        | ({ __typename?: "PrepStepDecompress" } & PrepStepDecompressDataFragment)
        | ({ __typename?: "PrepStepPipe" } & PrepStepPipeDataFragment)
    > | null;
    preprocess?: ({ __typename?: "TransformSql" } & PreprocessStepDataFragment) | null;
};

export type SetVocabEventFragment = {
    __typename?: "SetVocab";
    offsetColumn?: string | null;
    operationTypeColumn?: string | null;
    systemTimeColumn?: string | null;
    eventTimeColumn?: string | null;
};

export type FetchStepContainerDataFragment = {
    __typename?: "FetchStepContainer";
    image: string;
    command?: Array<string> | null;
    args?: Array<string> | null;
    env?: Array<{ __typename?: "EnvVar"; name: string; value?: string | null }> | null;
};

export type FetchStepEthereumLogsDataFragment = {
    __typename?: "FetchStepEthereumLogs";
    chainId?: number | null;
    nodeUrl?: string | null;
    filter?: string | null;
    signature?: string | null;
};

export type FetchStepFilesGlobDataFragment = {
    __typename?: "FetchStepFilesGlob";
    path: string;
    order?: SourceOrdering | null;
    eventTime?:
        | { __typename: "EventTimeSourceFromMetadata" }
        | { __typename?: "EventTimeSourceFromPath"; pattern: string; timestampFormat?: string | null }
        | { __typename: "EventTimeSourceFromSystemTime" }
        | null;
    cache?: { __typename: "SourceCachingForever" } | null;
};

export type FetchStepMqttDataFragment = {
    __typename?: "FetchStepMqtt";
    host: string;
    port: number;
    username?: string | null;
    password?: string | null;
    topics: Array<{ __typename?: "MqttTopicSubscription"; path: string; qos?: MqttQos | null }>;
};

export type FetchStepUrlDataFragment = {
    __typename?: "FetchStepUrl";
    url: string;
    eventTime?:
        | { __typename: "EventTimeSourceFromMetadata" }
        | { __typename?: "EventTimeSourceFromPath"; pattern: string; timestampFormat?: string | null }
        | { __typename: "EventTimeSourceFromSystemTime" }
        | null;
    headers?: Array<{ __typename?: "RequestHeader"; name: string; value: string }> | null;
    cache?: { __typename: "SourceCachingForever" } | null;
};

export type MergeStrategyAppendDataFragment = { __typename: "MergeStrategyAppend" };

export type MergeStrategyChangelogStreamDataFragment = {
    __typename?: "MergeStrategyChangelogStream";
    primaryKey: Array<string>;
};

export type MergeStrategyLedgerDataFragment = { __typename?: "MergeStrategyLedger"; primaryKey: Array<string> };

export type MergeStrategySnapshotDataFragment = {
    __typename?: "MergeStrategySnapshot";
    primaryKey: Array<string>;
    compareColumns?: Array<string> | null;
};

export type MergeStrategyUpsertStreamDataFragment = {
    __typename?: "MergeStrategyUpsertStream";
    primaryKey: Array<string>;
};

export type PrepStepDecompressDataFragment = {
    __typename?: "PrepStepDecompress";
    format: CompressionFormat;
    subPath?: string | null;
};

export type PrepStepPipeDataFragment = { __typename?: "PrepStepPipe"; command: Array<string> };

export type PreprocessStepDataFragment = {
    __typename?: "TransformSql";
    engine: string;
    version?: string | null;
    queries: Array<{ __typename?: "SqlQueryStep"; query: string; alias?: string | null }>;
    temporalTables?: Array<{ __typename?: "TemporalTable"; name: string; primaryKey: Array<string> }> | null;
};

export type ReadStepCsvDataFragment = {
    __typename?: "ReadStepCsv";
    schema?: Array<string> | null;
    separator?: string | null;
    encoding?: string | null;
    quote?: string | null;
    escape?: string | null;
    header?: boolean | null;
    inferSchema?: boolean | null;
    nullValue?: string | null;
    dateFormat?: string | null;
    timestampFormat?: string | null;
};

export type ReadStepEsriShapefileDataFragment = {
    __typename?: "ReadStepEsriShapefile";
    schema?: Array<string> | null;
    subPath?: string | null;
};

export type ReadStepGeoJsonDataFragment = { __typename?: "ReadStepGeoJson"; schema?: Array<string> | null };

export type ReadStepJsonDataFragment = {
    __typename?: "ReadStepJson";
    subPath?: string | null;
    schema?: Array<string> | null;
    dateFormat?: string | null;
    encoding?: string | null;
    timestampFormat?: string | null;
};

export type ReadStepNdGeoJsonDataFragment = { __typename?: "ReadStepNdGeoJson"; schema?: Array<string> | null };

export type ReadStepNdJsonDataFragment = {
    __typename?: "ReadStepNdJson";
    dateFormat?: string | null;
    encoding?: string | null;
    schema?: Array<string> | null;
    timestampFormat?: string | null;
};

export type ReadStepParquetDataFragment = { __typename?: "ReadStepParquet"; schema?: Array<string> | null };

export type AccessTokenDataFragment = {
    __typename?: "ViewAccessToken";
    id: string;
    name: string;
    createdAt: string;
    revokedAt?: string | null;
    account: { __typename?: "Account" } & AccountFragment;
};

export type CurrentSourceFetchUrlFragment = {
    __typename?: "DatasetMetadata";
    currentPollingSource?: {
        __typename?: "SetPollingSource";
        fetch:
            | { __typename?: "FetchStepContainer" }
            | { __typename?: "FetchStepEthereumLogs"; nodeUrl?: string | null }
            | { __typename?: "FetchStepFilesGlob" }
            | { __typename?: "FetchStepMqtt"; host: string; port: number }
            | { __typename?: "FetchStepUrl"; url: string };
    } | null;
};

export type DataQueryResultSuccessViewFragment = {
    __typename?: "DataQueryResultSuccess";
    schema: { __typename?: "DataSchema"; format: DataSchemaFormat; content: string };
    data: { __typename?: "DataBatch"; format: DataBatchFormat; content: string };
    datasets: Array<{ __typename?: "DatasetState"; id: string; alias: string; blockHash?: string | null }>;
};

export type DatasetBasicsFragment = {
    __typename?: "Dataset";
    id: string;
    kind: DatasetKind;
    name: string;
    alias: string;
    owner: { __typename?: "Account" } & AccountBasicsFragment;
    visibility:
        | { __typename: "PrivateDatasetVisibility" }
        | { __typename?: "PublicDatasetVisibility"; anonymousAvailable: boolean };
};

export type DatasetCurrentInfoFragment = {
    __typename?: "SetInfo";
    description?: string | null;
    keywords?: Array<string> | null;
};

export type DatasetDataSizeFragment = { __typename?: "DatasetData"; numRecordsTotal: number; estimatedSize: number };

export type DatasetDataFragment = {
    __typename?: "Dataset";
    data: {
        __typename: "DatasetData";
        tail:
            | { __typename: "DataQueryResultError"; errorMessage: string; errorKind: DataQueryResultErrorKind }
            | ({ __typename: "DataQueryResultSuccess" } & DataQueryResultSuccessViewFragment);
    } & DatasetDataSizeFragment;
};

export type DatasetDescriptionFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        currentInfo: { __typename?: "SetInfo" } & DatasetCurrentInfoFragment;
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
    };
};

export type DatasetDetailsFragment = {
    __typename?: "Dataset";
    createdAt: string;
    lastUpdatedAt: string;
    data: { __typename?: "DatasetData"; estimatedSize: number; numRecordsTotal: number };
    metadata: {
        __typename?: "DatasetMetadata";
        currentWatermark?: string | null;
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
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
                nodes: Array<{ __typename?: "MetadataBlockExtended" } & MetadataBlockFragment>;
                pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
            };
        };
    };
};

export type DatasetLineageFragment = {
    __typename: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        currentWatermark?: string | null;
        currentPushSources: Array<{ __typename?: "AddPushSource"; sourceName: string }>;
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
        currentUpstreamDependencies: Array<
            | {
                  __typename?: "DependencyDatasetResultAccessible";
                  dataset: {
                      __typename?: "Dataset";
                      metadata: {
                          __typename?: "DatasetMetadata";
                          currentWatermark?: string | null;
                          currentPushSources: Array<{ __typename?: "AddPushSource"; sourceName: string }>;
                          currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
                          currentUpstreamDependencies: Array<
                              | {
                                    __typename?: "DependencyDatasetResultAccessible";
                                    dataset: {
                                        __typename?: "Dataset";
                                        metadata: {
                                            __typename?: "DatasetMetadata";
                                            currentWatermark?: string | null;
                                            currentPushSources: Array<{
                                                __typename?: "AddPushSource";
                                                sourceName: string;
                                            }>;
                                            currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
                                            currentUpstreamDependencies: Array<
                                                | {
                                                      __typename?: "DependencyDatasetResultAccessible";
                                                      dataset: {
                                                          __typename?: "Dataset";
                                                          metadata: {
                                                              __typename?: "DatasetMetadata";
                                                              currentWatermark?: string | null;
                                                              currentPushSources: Array<{
                                                                  __typename?: "AddPushSource";
                                                                  sourceName: string;
                                                              }>;
                                                              currentLicense?:
                                                                  | ({ __typename?: "SetLicense" } & LicenseFragment)
                                                                  | null;
                                                              currentUpstreamDependencies: Array<
                                                                  | {
                                                                        __typename?: "DependencyDatasetResultAccessible";
                                                                        dataset: {
                                                                            __typename?: "Dataset";
                                                                            metadata: {
                                                                                __typename?: "DatasetMetadata";
                                                                                currentWatermark?: string | null;
                                                                                currentPushSources: Array<{
                                                                                    __typename?: "AddPushSource";
                                                                                    sourceName: string;
                                                                                }>;
                                                                                currentLicense?:
                                                                                    | ({
                                                                                          __typename?: "SetLicense";
                                                                                      } & LicenseFragment)
                                                                                    | null;
                                                                                currentUpstreamDependencies: Array<
                                                                                    | {
                                                                                          __typename?: "DependencyDatasetResultAccessible";
                                                                                          dataset: {
                                                                                              __typename?: "Dataset";
                                                                                              metadata: {
                                                                                                  __typename?: "DatasetMetadata";
                                                                                                  currentWatermark?:
                                                                                                      | string
                                                                                                      | null;
                                                                                                  currentPushSources: Array<{
                                                                                                      __typename?: "AddPushSource";
                                                                                                      sourceName: string;
                                                                                                  }>;
                                                                                                  currentLicense?:
                                                                                                      | ({
                                                                                                            __typename?: "SetLicense";
                                                                                                        } & LicenseFragment)
                                                                                                      | null;
                                                                                                  currentUpstreamDependencies: Array<
                                                                                                      | {
                                                                                                            __typename?: "DependencyDatasetResultAccessible";
                                                                                                            dataset: {
                                                                                                                __typename?: "Dataset";
                                                                                                                metadata: {
                                                                                                                    __typename?: "DatasetMetadata";
                                                                                                                    currentWatermark?:
                                                                                                                        | string
                                                                                                                        | null;
                                                                                                                    currentPushSources: Array<{
                                                                                                                        __typename?: "AddPushSource";
                                                                                                                        sourceName: string;
                                                                                                                    }>;
                                                                                                                    currentLicense?:
                                                                                                                        | ({
                                                                                                                              __typename?: "SetLicense";
                                                                                                                          } & LicenseFragment)
                                                                                                                        | null;
                                                                                                                } & CurrentSourceFetchUrlFragment;
                                                                                                            } & DatasetStreamLineageBasicsFragment;
                                                                                                        }
                                                                                                      | {
                                                                                                            __typename?: "DependencyDatasetResultNotAccessible";
                                                                                                            id: string;
                                                                                                        }
                                                                                                  >;
                                                                                              } & CurrentSourceFetchUrlFragment;
                                                                                          } & DatasetStreamLineageBasicsFragment;
                                                                                      }
                                                                                    | {
                                                                                          __typename?: "DependencyDatasetResultNotAccessible";
                                                                                          id: string;
                                                                                      }
                                                                                >;
                                                                            } & CurrentSourceFetchUrlFragment;
                                                                        } & DatasetStreamLineageBasicsFragment;
                                                                    }
                                                                  | {
                                                                        __typename?: "DependencyDatasetResultNotAccessible";
                                                                        id: string;
                                                                    }
                                                              >;
                                                          } & CurrentSourceFetchUrlFragment;
                                                      } & DatasetStreamLineageBasicsFragment;
                                                  }
                                                | { __typename?: "DependencyDatasetResultNotAccessible"; id: string }
                                            >;
                                        } & CurrentSourceFetchUrlFragment;
                                    } & DatasetStreamLineageBasicsFragment;
                                }
                              | { __typename?: "DependencyDatasetResultNotAccessible"; id: string }
                          >;
                      } & CurrentSourceFetchUrlFragment;
                  } & DatasetStreamLineageBasicsFragment;
              }
            | { __typename?: "DependencyDatasetResultNotAccessible"; id: string }
        >;
        currentDownstreamDependencies: Array<
            | {
                  __typename?: "DependencyDatasetResultAccessible";
                  dataset: {
                      __typename?: "Dataset";
                      metadata: {
                          __typename?: "DatasetMetadata";
                          currentPushSources: Array<{ __typename?: "AddPushSource"; sourceName: string }>;
                          currentDownstreamDependencies: Array<
                              | {
                                    __typename?: "DependencyDatasetResultAccessible";
                                    dataset: {
                                        __typename?: "Dataset";
                                        metadata: {
                                            __typename?: "DatasetMetadata";
                                            currentPushSources: Array<{
                                                __typename?: "AddPushSource";
                                                sourceName: string;
                                            }>;
                                            currentDownstreamDependencies: Array<
                                                | {
                                                      __typename?: "DependencyDatasetResultAccessible";
                                                      dataset: {
                                                          __typename?: "Dataset";
                                                          metadata: {
                                                              __typename?: "DatasetMetadata";
                                                              currentPushSources: Array<{
                                                                  __typename?: "AddPushSource";
                                                                  sourceName: string;
                                                              }>;
                                                              currentDownstreamDependencies: Array<
                                                                  | {
                                                                        __typename?: "DependencyDatasetResultAccessible";
                                                                        dataset: {
                                                                            __typename?: "Dataset";
                                                                            metadata: {
                                                                                __typename?: "DatasetMetadata";
                                                                                currentPushSources: Array<{
                                                                                    __typename?: "AddPushSource";
                                                                                    sourceName: string;
                                                                                }>;
                                                                                currentDownstreamDependencies: Array<
                                                                                    | {
                                                                                          __typename?: "DependencyDatasetResultAccessible";
                                                                                          dataset: {
                                                                                              __typename?: "Dataset";
                                                                                          } & DatasetStreamLineageBasicsFragment;
                                                                                      }
                                                                                    | {
                                                                                          __typename?: "DependencyDatasetResultNotAccessible";
                                                                                          id: string;
                                                                                      }
                                                                                >;
                                                                            };
                                                                        } & DatasetStreamLineageBasicsFragment;
                                                                    }
                                                                  | {
                                                                        __typename?: "DependencyDatasetResultNotAccessible";
                                                                        id: string;
                                                                    }
                                                              >;
                                                          };
                                                      } & DatasetStreamLineageBasicsFragment;
                                                  }
                                                | { __typename?: "DependencyDatasetResultNotAccessible"; id: string }
                                            >;
                                        };
                                    } & DatasetStreamLineageBasicsFragment;
                                }
                              | { __typename?: "DependencyDatasetResultNotAccessible"; id: string }
                          >;
                      };
                  } & DatasetStreamLineageBasicsFragment;
              }
            | { __typename?: "DependencyDatasetResultNotAccessible"; id: string }
        >;
    } & CurrentSourceFetchUrlFragment;
} & DatasetLineageBasicsFragment;

export type DatasetLineageBasicsFragment = {
    __typename?: "Dataset";
    createdAt: string;
    lastUpdatedAt: string;
    data: { __typename?: "DatasetData" } & DatasetDataSizeFragment;
    metadata: {
        __typename?: "DatasetMetadata";
        currentWatermark?: string | null;
        currentPushSources: Array<{ __typename?: "AddPushSource"; sourceName: string }>;
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
    } & CurrentSourceFetchUrlFragment;
    owner: { __typename?: "Account"; avatarUrl?: string | null };
} & DatasetBasicsFragment;

export type DatasetStreamLineageBasicsFragment = {
    __typename?: "Dataset";
    createdAt: string;
    lastUpdatedAt: string;
    data: { __typename?: "DatasetData" } & DatasetDataSizeFragment;
    owner: { __typename?: "Account"; avatarUrl?: string | null };
} & DatasetBasicsFragment;

export type DatasetMetadataSummaryFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        currentWatermark?: string | null;
        chain: {
            __typename?: "MetadataChain";
            refs: Array<{ __typename?: "BlockRef"; name: string; blockHash: string }>;
        };
        currentInfo: { __typename?: "SetInfo" } & DatasetCurrentInfoFragment;
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
        currentPollingSource?: ({ __typename?: "SetPollingSource" } & SetPollingSourceEventFragment) | null;
        currentTransform?: ({ __typename?: "SetTransform" } & DatasetTransformFragment) | null;
        currentSchema?: { __typename?: "DataSchema"; format: DataSchemaFormat; content: string } | null;
        currentVocab?: ({ __typename?: "SetVocab" } & SetVocabEventFragment) | null;
        currentPushSources: Array<{ __typename?: "AddPushSource" } & AddPushSourceEventFragment>;
        currentDownstreamDependencies: Array<
            { __typename: "DependencyDatasetResultAccessible" } | { __typename: "DependencyDatasetResultNotAccessible" }
        >;
    };
} & DatasetReadmeFragment &
    DatasetLastUpdateFragment;

export type DatasetOverviewFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        currentPollingSource?: { __typename: "SetPollingSource" } | null;
        currentTransform?: { __typename: "SetTransform" } | null;
        currentPushSources: Array<{ __typename: "AddPushSource" }>;
    };
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

export type DatasetPermissionsFragment = {
    __typename?: "Dataset";
    permissions: {
        __typename?: "DatasetPermissions";
        collaboration: { __typename?: "DatasetCollaborationPermissions"; canView: boolean; canUpdate: boolean };
        envVars: { __typename?: "DatasetEnvVarsPermissions"; canView: boolean; canUpdate: boolean };
        flows: { __typename?: "DatasetFlowsPermissions"; canView: boolean; canRun: boolean };
        general: {
            __typename?: "DatasetGeneralPermissions";
            canRename: boolean;
            canSetVisibility: boolean;
            canDelete: boolean;
        };
        metadata: { __typename?: "DatasetMetadataPermissions"; canCommit: boolean };
        webhooks: { __typename?: "DatasetWebhooksPermissions"; canView: boolean; canUpdate: boolean };
    };
};

export type DatasetReadmeFragment = {
    __typename?: "Dataset";
    metadata: { __typename?: "DatasetMetadata"; currentReadme?: string | null };
};

export type DatasetSearchOverviewFragment = {
    __typename?: "Dataset";
    createdAt: string;
    lastUpdatedAt: string;
    metadata: {
        __typename?: "DatasetMetadata";
        currentInfo: { __typename?: "SetInfo" } & DatasetCurrentInfoFragment;
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
        currentDownstreamDependencies: Array<
            | {
                  __typename?: "DependencyDatasetResultAccessible";
                  dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
              }
            | { __typename?: "DependencyDatasetResultNotAccessible"; id: string }
        >;
    };
} & DatasetBasicsFragment;

export type DatasetTransformContentFragment = {
    __typename?: "TransformSql";
    engine: string;
    version?: string | null;
    queries: Array<{ __typename?: "SqlQueryStep"; alias?: string | null; query: string }>;
    temporalTables?: Array<{ __typename?: "TemporalTable"; name: string; primaryKey: Array<string> }> | null;
};

export type DatasetTransformFragment = {
    __typename?: "SetTransform";
    inputs: Array<{
        __typename?: "TransformInput";
        datasetRef: string;
        alias: string;
        inputDataset:
            | {
                  __typename?: "TransformInputDatasetAccessible";
                  message: string;
                  dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
              }
            | { __typename?: "TransformInputDatasetNotAccessible"; message: string; datasetRef: string };
    }>;
    transform: { __typename?: "TransformSql" } & DatasetTransformContentFragment;
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
    blockHash: string;
    prevBlockHash?: string | null;
    systemTime: string;
    sequenceNumber: number;
    author: { __typename?: "Account" } & AccountExtendedFragment;
    event:
        | ({ __typename: "AddData" } & AddDataEventFragment)
        | ({ __typename: "AddPushSource" } & AddPushSourceEventFragment)
        | ({ __typename: "DisablePollingSource" } & DisablePollingSourceEventFragment)
        | { __typename: "DisablePushSource" }
        | ({ __typename: "ExecuteTransform" } & ExecuteTransformEventFragment)
        | ({ __typename: "Seed" } & SeedEventFragment)
        | ({ __typename: "SetAttachments" } & SetAttachmentsEventFragment)
        | ({ __typename: "SetDataSchema" } & SetDataSchemaEventFragment)
        | ({ __typename: "SetInfo" } & DatasetCurrentInfoFragment)
        | ({ __typename: "SetLicense" } & SetLicenseEventFragment)
        | ({ __typename: "SetPollingSource" } & SetPollingSourceEventFragment)
        | ({ __typename: "SetTransform" } & DatasetTransformFragment)
        | ({ __typename: "SetVocab" } & SetVocabEventFragment);
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
        byOwnerAndName?:
            | ({
                  __typename?: "Dataset";
                  metadata: {
                      __typename?: "DatasetMetadata";
                      chain: {
                          __typename?: "MetadataChain";
                          blockByHashEncoded?: string | null;
                          blockByHash?: ({ __typename?: "MetadataBlockExtended" } & MetadataBlockFragment) | null;
                      };
                      currentDownstreamDependencies: Array<
                          | { __typename: "DependencyDatasetResultAccessible" }
                          | { __typename: "DependencyDatasetResultNotAccessible" }
                      >;
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type RenameDatasetMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    newName: Scalars["DatasetName"];
}>;

export type RenameDatasetMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            rename:
                | { __typename: "RenameResultNameCollision"; message: string; collidingAlias: string }
                | { __typename: "RenameResultNoChanges"; preservedName: string; message: string }
                | { __typename: "RenameResultSuccess"; message: string; oldName: string; newName: string };
        } | null;
    };
};

export type SearchCollaboratorQueryVariables = Exact<{
    query: Scalars["String"];
    filters: LookupFilters;
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
}>;

export type SearchCollaboratorQuery = {
    __typename?: "Query";
    search: {
        __typename?: "Search";
        nameLookup: {
            __typename?: "NameLookupResultConnection";
            nodes: Array<{ __typename?: "Account" } & AccountFragment>;
        };
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
            nodes: Array<{ __typename: "Dataset" } & DatasetSearchOverviewFragment>;
            pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
        };
    };
};

export type SemanticSearchDatasetsOverviewQueryVariables = Exact<{
    prompt: Scalars["String"];
    perPage?: InputMaybe<Scalars["Int"]>;
}>;

export type SemanticSearchDatasetsOverviewQuery = {
    __typename?: "Query";
    search: {
        __typename?: "Search";
        queryNaturalLanguage: {
            __typename?: "SearchResultExConnection";
            totalCount: number;
            nodes: Array<{
                __typename?: "SearchResultEx";
                score: number;
                item: { __typename?: "Dataset" } & DatasetSearchOverviewFragment;
            }>;
            pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
        };
    };
};

export type DatasetWebhookCreateSubscriptionMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    input: WebhookSubscriptionInput;
}>;

export type DatasetWebhookCreateSubscriptionMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            webhooks: {
                __typename?: "DatasetWebhooksMut";
                createSubscription:
                    | {
                          __typename: "CreateWebhookSubscriptionResultSuccess";
                          secret: string;
                          subscriptionId: string;
                          message: string;
                      }
                    | { __typename: "WebhookSubscriptionDuplicateLabel"; message: string; label: string }
                    | { __typename: "WebhookSubscriptionInvalidTargetUrl"; innerMessage: string; message: string }
                    | { __typename: "WebhookSubscriptionNoEventTypesProvided"; numEventTypes: number; message: string };
            };
        } | null;
    };
};

export type DatasetWebhookPauseSubscriptionMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    id: Scalars["WebhookSubscriptionID"];
}>;

export type DatasetWebhookPauseSubscriptionMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            webhooks: {
                __typename?: "DatasetWebhooksMut";
                subscription?: {
                    __typename?: "WebhookSubscriptionMut";
                    pause:
                        | { __typename?: "PauseWebhookSubscriptionResultSuccess"; paused: boolean; message: string }
                        | {
                              __typename?: "PauseWebhookSubscriptionResultUnexpected";
                              status: WebhookSubscriptionStatus;
                              message: string;
                          };
                } | null;
            };
        } | null;
    };
};

export type DatasetWebhookRemoveSubscriptionMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    id: Scalars["WebhookSubscriptionID"];
}>;

export type DatasetWebhookRemoveSubscriptionMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            webhooks: {
                __typename?: "DatasetWebhooksMut";
                subscription?: {
                    __typename?: "WebhookSubscriptionMut";
                    remove: {
                        __typename?: "RemoveWebhookSubscriptionResultSuccess";
                        removed: boolean;
                        message: string;
                    };
                } | null;
            };
        } | null;
    };
};

export type DatasetWebhookResumeSubscriptionMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    id: Scalars["WebhookSubscriptionID"];
}>;

export type DatasetWebhookResumeSubscriptionMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            webhooks: {
                __typename?: "DatasetWebhooksMut";
                subscription?: {
                    __typename?: "WebhookSubscriptionMut";
                    resume:
                        | { __typename?: "ResumeWebhookSubscriptionResultSuccess"; resumed: boolean; message: string }
                        | {
                              __typename?: "ResumeWebhookSubscriptionResultUnexpected";
                              status: WebhookSubscriptionStatus;
                              message: string;
                          };
                } | null;
            };
        } | null;
    };
};

export type DatasetWebhookSubscriptionsQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetWebhookSubscriptionsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            webhooks: {
                __typename?: "DatasetWebhooks";
                subscriptions: Array<{
                    __typename?: "WebhookSubscription";
                    label: string;
                    id: string;
                    targetUrl: string;
                    status: WebhookSubscriptionStatus;
                    datasetId?: string | null;
                    eventTypes: Array<string>;
                }>;
            };
        } | null;
    };
};

export type DatasetWebhookUpdateSubscriptionMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    id: Scalars["WebhookSubscriptionID"];
    input: WebhookSubscriptionInput;
}>;

export type DatasetWebhookUpdateSubscriptionMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            webhooks: {
                __typename?: "DatasetWebhooksMut";
                subscription?: {
                    __typename?: "WebhookSubscriptionMut";
                    update:
                        | { __typename?: "UpdateWebhookSubscriptionResultSuccess"; updated: boolean; message: string }
                        | {
                              __typename?: "UpdateWebhookSubscriptionResultUnexpected";
                              status: WebhookSubscriptionStatus;
                              message: string;
                          }
                        | { __typename?: "WebhookSubscriptionDuplicateLabel"; label: string; message: string }
                        | { __typename?: "WebhookSubscriptionInvalidTargetUrl"; innerMessage: string; message: string }
                        | {
                              __typename?: "WebhookSubscriptionNoEventTypesProvided";
                              numEventTypes: number;
                              message: string;
                          };
                } | null;
            };
        } | null;
    };
};

export type WebhookEventTypesQueryVariables = Exact<{ [key: string]: never }>;

export type WebhookEventTypesQuery = {
    __typename?: "Query";
    webhooks: { __typename?: "Webhooks"; eventTypes: Array<string> };
};

export const AccountBasicsFragmentDoc = gql`
    fragment AccountBasics on Account {
        id
        accountName
        accountProvider
    }
`;
export const DatasetBasicsFragmentDoc = gql`
    fragment DatasetBasics on Dataset {
        id
        kind
        name
        owner {
            ...AccountBasics
        }
        alias
        visibility {
            ... on PrivateDatasetVisibility {
                __typename
            }
            ... on PublicDatasetVisibility {
                anonymousAvailable
            }
        }
    }
    ${AccountBasicsFragmentDoc}
`;
export const FetchStepUrlDataFragmentDoc = gql`
    fragment FetchStepUrlData on FetchStepUrl {
        url
        eventTime {
            ... on EventTimeSourceFromPath {
                pattern
                timestampFormat
            }
            ... on EventTimeSourceFromMetadata {
                __typename
            }
            ... on EventTimeSourceFromSystemTime {
                __typename
            }
        }
        headers {
            name
            value
        }
        cache {
            __typename
        }
    }
`;
export const FetchStepFilesGlobDataFragmentDoc = gql`
    fragment FetchStepFilesGlobData on FetchStepFilesGlob {
        path
        eventTime {
            ... on EventTimeSourceFromPath {
                pattern
                timestampFormat
            }
            ... on EventTimeSourceFromMetadata {
                __typename
            }
            ... on EventTimeSourceFromSystemTime {
                __typename
            }
        }
        cache {
            __typename
        }
        order
    }
`;
export const FetchStepContainerDataFragmentDoc = gql`
    fragment FetchStepContainerData on FetchStepContainer {
        image
        command
        args
        env {
            name
            value
        }
    }
`;
export const DatasetConnectionDataFragmentDoc = gql`
    fragment DatasetConnectionData on DatasetConnection {
        nodes {
            ...DatasetBasics
            metadata {
                currentPollingSource {
                    fetch {
                        ...FetchStepUrlData
                        ...FetchStepFilesGlobData
                        ...FetchStepContainerData
                    }
                }
                currentTransform {
                    inputs {
                        __typename
                    }
                    transform {
                        ... on TransformSql {
                            engine
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${FetchStepUrlDataFragmentDoc}
    ${FetchStepFilesGlobDataFragmentDoc}
    ${FetchStepContainerDataFragmentDoc}
`;
export const AccountWithEmailFragmentDoc = gql`
    fragment AccountWithEmail on Account {
        id
        accountName
        displayName
        avatarUrl
        email
    }
`;
export const ViewDatasetEnvVarDataFragmentDoc = gql`
    fragment ViewDatasetEnvVarData on ViewDatasetEnvVar {
        id
        key
        value
        isSecret
    }
`;
export const AccountFragmentDoc = gql`
    fragment Account on Account {
        id
        accountName
        displayName
        accountType
        avatarUrl
        isAdmin
        accountProvider
    }
`;
export const FlowOutcomeDataFragmentDoc = gql`
    fragment FlowOutcomeData on FlowOutcome {
        ... on FlowSuccessResult {
            message
        }
        ... on FlowFailedError {
            reason {
                ... on TaskFailureReasonGeneral {
                    message
                }
                ... on TaskFailureReasonInputDatasetCompacted {
                    message
                    inputDataset {
                        ...DatasetBasics
                    }
                }
            }
        }
        ... on FlowAbortedResult {
            message
        }
    }
    ${DatasetBasicsFragmentDoc}
`;
export const TimeDeltaDataFragmentDoc = gql`
    fragment TimeDeltaData on TimeDelta {
        every
        unit
    }
`;
export const FlowSummaryDataFragmentDoc = gql`
    fragment FlowSummaryData on Flow {
        description {
            ... on FlowDescriptionDatasetPollingIngest {
                pollingSource {
                    fetch {
                        ...FetchStepUrlData
                        ...FetchStepFilesGlobData
                        ...FetchStepContainerData
                    }
                }
                ingestResult {
                    ... on FlowDescriptionUpdateResultUpToDate {
                        uncacheable
                    }
                    ... on FlowDescriptionUpdateResultSuccess {
                        numBlocks
                        numRecords
                        updatedWatermark
                    }
                    ... on FlowDescriptionUpdateResultUnknown {
                        message
                    }
                }
            }
            ... on FlowDescriptionDatasetPushIngest {
                sourceName
                ingestResult {
                    ... on FlowDescriptionUpdateResultUpToDate {
                        uncacheable
                    }
                    ... on FlowDescriptionUpdateResultSuccess {
                        numBlocks
                        numRecords
                        updatedWatermark
                    }
                    ... on FlowDescriptionUpdateResultUnknown {
                        message
                    }
                }
            }
            ... on FlowDescriptionDatasetExecuteTransform {
                transform {
                    inputs {
                        __typename
                    }
                    transform {
                        ... on TransformSql {
                            engine
                        }
                    }
                }
                transformResult {
                    ... on FlowDescriptionUpdateResultUpToDate {
                        uncacheable
                    }
                    ... on FlowDescriptionUpdateResultSuccess {
                        numBlocks
                        numRecords
                        updatedWatermark
                    }
                    ... on FlowDescriptionUpdateResultUnknown {
                        message
                    }
                }
            }
            ... on FlowDescriptionDatasetHardCompaction {
                compactionResult {
                    ... on FlowDescriptionReorganizationSuccess {
                        originalBlocksCount
                        resultingBlocksCount
                        newHead
                    }
                    ... on FlowDescriptionReorganizationNothingToDo {
                        message
                        dummy
                    }
                }
            }
            ... on FlowDescriptionSystemGC {
                dummy
            }
            ... on FlowDescriptionDatasetReset {
                resetResult {
                    newHead
                }
            }
            ... on FlowDescriptionDatasetResetToMetadata {
                resetToMetadataResult {
                    ... on FlowDescriptionReorganizationSuccess {
                        originalBlocksCount
                        resultingBlocksCount
                        newHead
                    }
                    ... on FlowDescriptionReorganizationNothingToDo {
                        message
                        dummy
                    }
                }
            }
            ... on FlowDescriptionWebhookDeliver {
                targetUrl
                label
                eventType
            }
        }
        flowId
        datasetId
        status
        initiator {
            ...Account
        }
        outcome {
            ...FlowOutcomeData
        }
        timing {
            initiatedAt
            firstAttemptScheduledAt
            scheduledAt
            awaitingExecutorSince
            runningSince
            lastAttemptFinishedAt
        }
        startCondition {
            __typename
            ... on FlowStartConditionThrottling {
                intervalSec
                wakeUpAt
                shiftedFrom
            }
            ... on FlowStartConditionReactive {
                activeBatchingRule {
                    minRecordsToAwait
                    maxBatchingInterval {
                        ...TimeDeltaData
                    }
                }
                batchingDeadline
                accumulatedRecordsCount
                watermarkModified
            }
            ... on FlowStartConditionSchedule {
                wakeUpAt
            }
            ... on FlowStartConditionExecutor {
                taskId
            }
        }
        configSnapshot {
            ... on FlowConfigRuleIngest {
                fetchUncacheable
            }
        }
        taskIds
        retryPolicy {
            maxAttempts
        }
    }
    ${FetchStepUrlDataFragmentDoc}
    ${FetchStepFilesGlobDataFragmentDoc}
    ${FetchStepContainerDataFragmentDoc}
    ${AccountFragmentDoc}
    ${FlowOutcomeDataFragmentDoc}
    ${TimeDeltaDataFragmentDoc}
`;
export const DatasetPageInfoFragmentDoc = gql`
    fragment DatasetPageInfo on PageBasedInfo {
        hasNextPage
        hasPreviousPage
        currentPage
        totalPages
    }
`;
export const FlowConnectionDataFragmentDoc = gql`
    fragment FlowConnectionData on FlowConnection {
        nodes {
            ...FlowSummaryData
        }
        totalCount
        pageInfo {
            ...DatasetPageInfo
        }
    }
    ${FlowSummaryDataFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
`;
export const FlowHistoryDataFragmentDoc = gql`
    fragment FlowHistoryData on FlowEvent {
        __typename
        eventId
        eventTime
        ... on FlowEventAborted {
            __typename
        }
        ... on FlowEventInitiated {
            activationCause {
                __typename
                ... on FlowActivationCauseAutoPolling {
                    __typename
                }
                ... on FlowActivationCauseManual {
                    initiator {
                        ...Account
                    }
                }
                ... on FlowActivationCauseDatasetUpdate {
                    dataset {
                        ...DatasetBasics
                    }
                    source {
                        __typename
                        ... on FlowActivationCauseDatasetUpdateSourceUpstreamFlow {
                            flowId
                        }
                        ... on FlowActivationCauseDatasetUpdateSourceHttpIngest {
                            sourceName
                        }
                        ... on FlowActivationCauseDatasetUpdateSourceSmartProtocolPush {
                            accountName
                            isForce
                        }
                    }
                }
            }
        }
        ... on FlowEventStartConditionUpdated {
            startCondition {
                __typename
                ... on FlowStartConditionThrottling {
                    intervalSec
                    wakeUpAt
                    shiftedFrom
                }
                ... on FlowStartConditionReactive {
                    activeBatchingRule {
                        minRecordsToAwait
                        maxBatchingInterval {
                            ...TimeDeltaData
                        }
                    }
                    batchingDeadline
                    accumulatedRecordsCount
                    watermarkModified
                }
                ... on FlowStartConditionSchedule {
                    wakeUpAt
                }
                ... on FlowStartConditionExecutor {
                    taskId
                }
            }
        }
        ... on FlowEventScheduledForActivation {
            __typename
            scheduledForActivationAt
        }
        ... on FlowEventTaskChanged {
            __typename
            taskId
            taskStatus
            task {
                outcome {
                    __typename
                    ... on TaskOutcomeFailed {
                        reason {
                            __typename
                            ... on TaskFailureReasonGeneral {
                                message
                            }
                            ... on TaskFailureReasonInputDatasetCompacted {
                                message
                                inputDataset {
                                    ...DatasetBasics
                                }
                            }
                        }
                    }
                }
            }
            nextAttemptAt
        }
        ... on FlowEventActivationCauseAdded {
            activationCause {
                __typename
                ... on FlowActivationCauseAutoPolling {
                    __typename
                }
                ... on FlowActivationCauseManual {
                    initiator {
                        ...Account
                    }
                }
                ... on FlowActivationCauseDatasetUpdate {
                    dataset {
                        ...DatasetBasics
                    }
                    source {
                        __typename
                        ... on FlowActivationCauseDatasetUpdateSourceUpstreamFlow {
                            flowId
                        }
                        ... on FlowActivationCauseDatasetUpdateSourceHttpIngest {
                            sourceName
                        }
                        ... on FlowActivationCauseDatasetUpdateSourceSmartProtocolPush {
                            accountName
                            isForce
                        }
                    }
                }
            }
        }
        ... on FlowConfigSnapshotModified {
            configSnapshot {
                __typename
            }
        }
    }
    ${AccountFragmentDoc}
    ${DatasetBasicsFragmentDoc}
    ${TimeDeltaDataFragmentDoc}
`;
export const FlowItemWidgetDataFragmentDoc = gql`
    fragment FlowItemWidgetData on Flow {
        flowId
        datasetId
        status
        initiator {
            accountName
        }
        outcome {
            ...FlowOutcomeData
        }
        timing {
            initiatedAt
            firstAttemptScheduledAt
            scheduledAt
            awaitingExecutorSince
            runningSince
            lastAttemptFinishedAt
        }
    }
    ${FlowOutcomeDataFragmentDoc}
`;
export const FlowConnectionWidgetDataFragmentDoc = gql`
    fragment FlowConnectionWidgetData on FlowConnection {
        nodes {
            ...FlowItemWidgetData
        }
        totalCount
    }
    ${FlowItemWidgetDataFragmentDoc}
`;
export const AccessTokenDataFragmentDoc = gql`
    fragment AccessTokenData on ViewAccessToken {
        id
        name
        createdAt
        revokedAt
        account {
            ...Account
        }
    }
    ${AccountFragmentDoc}
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
        datasets {
            id
            alias
            blockHash
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
export const CurrentSourceFetchUrlFragmentDoc = gql`
    fragment CurrentSourceFetchUrl on DatasetMetadata {
        currentPollingSource {
            fetch {
                ... on FetchStepUrl {
                    url
                }
                ... on FetchStepMqtt {
                    host
                    port
                }
                ... on FetchStepEthereumLogs {
                    nodeUrl
                }
            }
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
export const DatasetLineageBasicsFragmentDoc = gql`
    fragment DatasetLineageBasics on Dataset {
        createdAt
        lastUpdatedAt
        ...DatasetBasics
        data {
            ...DatasetDataSize
        }
        metadata {
            ...CurrentSourceFetchUrl
            currentPushSources {
                sourceName
            }
            currentLicense {
                ...License
            }
            currentWatermark
        }
        owner {
            avatarUrl
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetDataSizeFragmentDoc}
    ${CurrentSourceFetchUrlFragmentDoc}
    ${LicenseFragmentDoc}
`;
export const DatasetStreamLineageBasicsFragmentDoc = gql`
    fragment DatasetStreamLineageBasics on Dataset {
        createdAt
        lastUpdatedAt
        ...DatasetBasics
        data {
            ...DatasetDataSize
        }
        owner {
            avatarUrl
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetDataSizeFragmentDoc}
`;
export const DatasetLineageFragmentDoc = gql`
    fragment DatasetLineage on Dataset {
        __typename
        ...DatasetLineageBasics
        metadata {
            ...CurrentSourceFetchUrl
            currentPushSources {
                sourceName
            }
            currentLicense {
                ...License
            }
            currentWatermark
            currentUpstreamDependencies {
                ... on DependencyDatasetResultNotAccessible {
                    id
                }
                ... on DependencyDatasetResultAccessible {
                    dataset {
                        ...DatasetStreamLineageBasics
                        metadata {
                            ...CurrentSourceFetchUrl
                            currentPushSources {
                                sourceName
                            }
                            currentLicense {
                                ...License
                            }
                            currentWatermark
                            currentUpstreamDependencies {
                                ... on DependencyDatasetResultNotAccessible {
                                    id
                                }
                                ... on DependencyDatasetResultAccessible {
                                    dataset {
                                        ...DatasetStreamLineageBasics
                                        metadata {
                                            ...CurrentSourceFetchUrl
                                            currentPushSources {
                                                sourceName
                                            }
                                            currentLicense {
                                                ...License
                                            }
                                            currentWatermark
                                            currentUpstreamDependencies {
                                                ... on DependencyDatasetResultNotAccessible {
                                                    id
                                                }
                                                ... on DependencyDatasetResultAccessible {
                                                    dataset {
                                                        ...DatasetStreamLineageBasics
                                                        metadata {
                                                            ...CurrentSourceFetchUrl
                                                            currentPushSources {
                                                                sourceName
                                                            }
                                                            currentLicense {
                                                                ...License
                                                            }
                                                            currentWatermark
                                                            currentUpstreamDependencies {
                                                                ... on DependencyDatasetResultNotAccessible {
                                                                    id
                                                                }
                                                                ... on DependencyDatasetResultAccessible {
                                                                    dataset {
                                                                        ...DatasetStreamLineageBasics
                                                                        metadata {
                                                                            ...CurrentSourceFetchUrl
                                                                            currentPushSources {
                                                                                sourceName
                                                                            }
                                                                            currentLicense {
                                                                                ...License
                                                                            }
                                                                            currentWatermark
                                                                            currentUpstreamDependencies {
                                                                                ... on DependencyDatasetResultNotAccessible {
                                                                                    id
                                                                                }
                                                                                ... on DependencyDatasetResultAccessible {
                                                                                    dataset {
                                                                                        ...DatasetStreamLineageBasics
                                                                                        metadata {
                                                                                            ...CurrentSourceFetchUrl
                                                                                            currentPushSources {
                                                                                                sourceName
                                                                                            }
                                                                                            currentLicense {
                                                                                                ...License
                                                                                            }
                                                                                            currentWatermark
                                                                                            currentUpstreamDependencies {
                                                                                                ... on DependencyDatasetResultNotAccessible {
                                                                                                    id
                                                                                                }
                                                                                                ... on DependencyDatasetResultAccessible {
                                                                                                    dataset {
                                                                                                        ...DatasetStreamLineageBasics
                                                                                                        metadata {
                                                                                                            ...CurrentSourceFetchUrl
                                                                                                            currentPushSources {
                                                                                                                sourceName
                                                                                                            }
                                                                                                            currentLicense {
                                                                                                                ...License
                                                                                                            }
                                                                                                            currentWatermark
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
            currentDownstreamDependencies {
                ... on DependencyDatasetResultNotAccessible {
                    id
                }
                ... on DependencyDatasetResultAccessible {
                    dataset {
                        ...DatasetStreamLineageBasics
                        metadata {
                            currentPushSources {
                                sourceName
                            }
                            currentDownstreamDependencies {
                                ... on DependencyDatasetResultNotAccessible {
                                    id
                                }
                                ... on DependencyDatasetResultAccessible {
                                    dataset {
                                        ...DatasetStreamLineageBasics
                                        metadata {
                                            currentPushSources {
                                                sourceName
                                            }
                                            currentDownstreamDependencies {
                                                ... on DependencyDatasetResultNotAccessible {
                                                    id
                                                }
                                                ... on DependencyDatasetResultAccessible {
                                                    dataset {
                                                        ...DatasetStreamLineageBasics
                                                        metadata {
                                                            currentPushSources {
                                                                sourceName
                                                            }
                                                            currentDownstreamDependencies {
                                                                ... on DependencyDatasetResultNotAccessible {
                                                                    id
                                                                }
                                                                ... on DependencyDatasetResultAccessible {
                                                                    dataset {
                                                                        ...DatasetStreamLineageBasics
                                                                        metadata {
                                                                            currentPushSources {
                                                                                sourceName
                                                                            }
                                                                            currentDownstreamDependencies {
                                                                                ... on DependencyDatasetResultNotAccessible {
                                                                                    id
                                                                                }
                                                                                ... on DependencyDatasetResultAccessible {
                                                                                    dataset {
                                                                                        ...DatasetStreamLineageBasics
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
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ${DatasetLineageBasicsFragmentDoc}
    ${CurrentSourceFetchUrlFragmentDoc}
    ${LicenseFragmentDoc}
    ${DatasetStreamLineageBasicsFragmentDoc}
`;
export const DatasetCurrentInfoFragmentDoc = gql`
    fragment DatasetCurrentInfo on SetInfo {
        description
        keywords
    }
`;
export const FetchStepMqttDataFragmentDoc = gql`
    fragment FetchStepMqttData on FetchStepMqtt {
        host
        port
        username
        password
        topics {
            path
            qos
        }
    }
`;
export const FetchStepEthereumLogsDataFragmentDoc = gql`
    fragment FetchStepEthereumLogsData on FetchStepEthereumLogs {
        chainId
        nodeUrl
        filter
        signature
    }
`;
export const ReadStepCsvDataFragmentDoc = gql`
    fragment ReadStepCsvData on ReadStepCsv {
        schema
        separator
        encoding
        quote
        escape
        header
        inferSchema
        nullValue
        dateFormat
        timestampFormat
    }
`;
export const ReadStepJsonDataFragmentDoc = gql`
    fragment ReadStepJsonData on ReadStepJson {
        subPath
        schema
        dateFormat
        encoding
        timestampFormat
    }
`;
export const ReadStepNdJsonDataFragmentDoc = gql`
    fragment ReadStepNdJsonData on ReadStepNdJson {
        dateFormat
        encoding
        schema
        timestampFormat
    }
`;
export const ReadStepGeoJsonDataFragmentDoc = gql`
    fragment ReadStepGeoJsonData on ReadStepGeoJson {
        schema
    }
`;
export const ReadStepNdGeoJsonDataFragmentDoc = gql`
    fragment ReadStepNdGeoJsonData on ReadStepNdGeoJson {
        schema
    }
`;
export const ReadStepEsriShapefileDataFragmentDoc = gql`
    fragment ReadStepEsriShapefileData on ReadStepEsriShapefile {
        schema
        subPath
    }
`;
export const ReadStepParquetDataFragmentDoc = gql`
    fragment ReadStepParquetData on ReadStepParquet {
        schema
    }
`;
export const MergeStrategySnapshotDataFragmentDoc = gql`
    fragment MergeStrategySnapshotData on MergeStrategySnapshot {
        primaryKey
        compareColumns
    }
`;
export const MergeStrategyLedgerDataFragmentDoc = gql`
    fragment MergeStrategyLedgerData on MergeStrategyLedger {
        primaryKey
    }
`;
export const MergeStrategyAppendDataFragmentDoc = gql`
    fragment MergeStrategyAppendData on MergeStrategyAppend {
        __typename
    }
`;
export const MergeStrategyChangelogStreamDataFragmentDoc = gql`
    fragment MergeStrategyChangelogStreamData on MergeStrategyChangelogStream {
        primaryKey
    }
`;
export const MergeStrategyUpsertStreamDataFragmentDoc = gql`
    fragment MergeStrategyUpsertStreamData on MergeStrategyUpsertStream {
        primaryKey
    }
`;
export const PrepStepDecompressDataFragmentDoc = gql`
    fragment PrepStepDecompressData on PrepStepDecompress {
        format
        subPath
    }
`;
export const PrepStepPipeDataFragmentDoc = gql`
    fragment PrepStepPipeData on PrepStepPipe {
        command
    }
`;
export const PreprocessStepDataFragmentDoc = gql`
    fragment PreprocessStepData on TransformSql {
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
`;
export const SetPollingSourceEventFragmentDoc = gql`
    fragment SetPollingSourceEvent on SetPollingSource {
        fetch {
            ...FetchStepUrlData
            ...FetchStepFilesGlobData
            ...FetchStepContainerData
            ...FetchStepMqttData
            ...FetchStepEthereumLogsData
        }
        read {
            ...ReadStepCsvData
            ...ReadStepJsonData
            ...ReadStepNdJsonData
            ...ReadStepGeoJsonData
            ...ReadStepNdGeoJsonData
            ...ReadStepEsriShapefileData
            ...ReadStepParquetData
        }
        merge {
            ...MergeStrategySnapshotData
            ...MergeStrategyLedgerData
            ...MergeStrategyAppendData
            ...MergeStrategyChangelogStreamData
            ...MergeStrategyUpsertStreamData
        }
        prepare {
            ...PrepStepDecompressData
            ...PrepStepPipeData
        }
        preprocess {
            ...PreprocessStepData
        }
    }
    ${FetchStepUrlDataFragmentDoc}
    ${FetchStepFilesGlobDataFragmentDoc}
    ${FetchStepContainerDataFragmentDoc}
    ${FetchStepMqttDataFragmentDoc}
    ${FetchStepEthereumLogsDataFragmentDoc}
    ${ReadStepCsvDataFragmentDoc}
    ${ReadStepJsonDataFragmentDoc}
    ${ReadStepNdJsonDataFragmentDoc}
    ${ReadStepGeoJsonDataFragmentDoc}
    ${ReadStepNdGeoJsonDataFragmentDoc}
    ${ReadStepEsriShapefileDataFragmentDoc}
    ${ReadStepParquetDataFragmentDoc}
    ${MergeStrategySnapshotDataFragmentDoc}
    ${MergeStrategyLedgerDataFragmentDoc}
    ${MergeStrategyAppendDataFragmentDoc}
    ${MergeStrategyChangelogStreamDataFragmentDoc}
    ${MergeStrategyUpsertStreamDataFragmentDoc}
    ${PrepStepDecompressDataFragmentDoc}
    ${PrepStepPipeDataFragmentDoc}
    ${PreprocessStepDataFragmentDoc}
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
            datasetRef
            alias
            inputDataset {
                ... on TransformInputDatasetAccessible {
                    message
                    dataset {
                        ...DatasetBasics
                    }
                }
                ... on TransformInputDatasetNotAccessible {
                    message
                    datasetRef
                }
            }
        }
        transform {
            ...DatasetTransformContent
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetTransformContentFragmentDoc}
`;
export const SetVocabEventFragmentDoc = gql`
    fragment SetVocabEvent on SetVocab {
        offsetColumn
        operationTypeColumn
        systemTimeColumn
        eventTimeColumn
    }
`;
export const AddPushSourceEventFragmentDoc = gql`
    fragment AddPushSourceEvent on AddPushSource {
        sourceName
        read {
            ...ReadStepCsvData
            ...ReadStepJsonData
            ...ReadStepNdJsonData
            ...ReadStepGeoJsonData
            ...ReadStepNdGeoJsonData
            ...ReadStepEsriShapefileData
            ...ReadStepParquetData
        }
        merge {
            ...MergeStrategySnapshotData
            ...MergeStrategyLedgerData
            ...MergeStrategyAppendData
            ...MergeStrategyChangelogStreamData
            ...MergeStrategyUpsertStreamData
        }
        preprocess {
            ...PreprocessStepData
        }
    }
    ${ReadStepCsvDataFragmentDoc}
    ${ReadStepJsonDataFragmentDoc}
    ${ReadStepNdJsonDataFragmentDoc}
    ${ReadStepGeoJsonDataFragmentDoc}
    ${ReadStepNdGeoJsonDataFragmentDoc}
    ${ReadStepEsriShapefileDataFragmentDoc}
    ${ReadStepParquetDataFragmentDoc}
    ${MergeStrategySnapshotDataFragmentDoc}
    ${MergeStrategyLedgerDataFragmentDoc}
    ${MergeStrategyAppendDataFragmentDoc}
    ${MergeStrategyChangelogStreamDataFragmentDoc}
    ${MergeStrategyUpsertStreamDataFragmentDoc}
    ${PreprocessStepDataFragmentDoc}
`;
export const DatasetReadmeFragmentDoc = gql`
    fragment DatasetReadme on Dataset {
        metadata {
            currentReadme
        }
    }
`;
export const AccountExtendedFragmentDoc = gql`
    fragment AccountExtended on Account {
        id
        accountName
        avatarUrl
    }
`;
export const SeedEventFragmentDoc = gql`
    fragment SeedEvent on Seed {
        datasetId
        datasetKind
    }
`;
export const ExecuteTransformEventFragmentDoc = gql`
    fragment ExecuteTransformEvent on ExecuteTransform {
        queryInputs {
            datasetId
            prevBlockHash
            newBlockHash
            prevOffset
            newOffset
        }
        prevCheckpoint
        prevOffset
        newData {
            offsetInterval {
                start
                end
            }
            logicalHash
            physicalHash
            size
        }
        newCheckpoint {
            physicalHash
            size
        }
        newWatermark
    }
`;
export const AddDataEventFragmentDoc = gql`
    fragment AddDataEvent on AddData {
        prevCheckpoint
        prevOffset
        newData {
            offsetInterval {
                start
                end
            }
            logicalHash
            physicalHash
            size
        }
        newCheckpoint {
            physicalHash
            size
        }
        newWatermark
        newSourceState {
            sourceName
            kind
            value
        }
    }
`;
export const SetAttachmentsEventFragmentDoc = gql`
    fragment SetAttachmentsEvent on SetAttachments {
        attachments {
            ... on AttachmentsEmbedded {
                items {
                    path
                    content
                }
            }
        }
    }
`;
export const SetLicenseEventFragmentDoc = gql`
    fragment SetLicenseEvent on SetLicense {
        shortName
        name
        spdxId
        websiteUrl
    }
`;
export const SetDataSchemaEventFragmentDoc = gql`
    fragment SetDataSchemaEvent on SetDataSchema {
        schema {
            format
            content
        }
    }
`;
export const DisablePollingSourceEventFragmentDoc = gql`
    fragment DisablePollingSourceEvent on DisablePollingSource {
        dummy
    }
`;
export const MetadataBlockFragmentDoc = gql`
    fragment MetadataBlock on MetadataBlockExtended {
        blockHash
        prevBlockHash
        systemTime
        sequenceNumber
        author {
            ...AccountExtended
        }
        event {
            __typename
            ...SeedEvent
            ...SetVocabEvent
            ...DatasetTransform
            ...ExecuteTransformEvent
            ...AddDataEvent
            ...SetAttachmentsEvent
            ...DatasetCurrentInfo
            ...SetLicenseEvent
            ...SetPollingSourceEvent
            ...AddPushSourceEvent
            ...SetDataSchemaEvent
            ...DisablePollingSourceEvent
        }
    }
    ${AccountExtendedFragmentDoc}
    ${SeedEventFragmentDoc}
    ${SetVocabEventFragmentDoc}
    ${DatasetTransformFragmentDoc}
    ${ExecuteTransformEventFragmentDoc}
    ${AddDataEventFragmentDoc}
    ${SetAttachmentsEventFragmentDoc}
    ${DatasetCurrentInfoFragmentDoc}
    ${SetLicenseEventFragmentDoc}
    ${SetPollingSourceEventFragmentDoc}
    ${AddPushSourceEventFragmentDoc}
    ${SetDataSchemaEventFragmentDoc}
    ${DisablePollingSourceEventFragmentDoc}
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
            chain {
                refs {
                    name
                    blockHash
                }
            }
            currentInfo {
                ...DatasetCurrentInfo
            }
            currentLicense {
                ...License
            }
            currentPollingSource {
                ...SetPollingSourceEvent
            }
            currentWatermark
            currentTransform {
                ...DatasetTransform
            }
            currentSchema(format: PARQUET_JSON) {
                format
                content
            }
            currentVocab {
                ...SetVocabEvent
            }
            currentPushSources {
                ...AddPushSourceEvent
            }
            currentDownstreamDependencies {
                ... on DependencyDatasetResultNotAccessible {
                    __typename
                }
                ... on DependencyDatasetResultAccessible {
                    __typename
                }
            }
        }
        ...DatasetReadme
        ...DatasetLastUpdate
    }
    ${DatasetCurrentInfoFragmentDoc}
    ${LicenseFragmentDoc}
    ${SetPollingSourceEventFragmentDoc}
    ${DatasetTransformFragmentDoc}
    ${SetVocabEventFragmentDoc}
    ${AddPushSourceEventFragmentDoc}
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
        metadata {
            currentPollingSource {
                __typename
            }
            currentTransform {
                __typename
            }
            currentPushSources {
                __typename
            }
        }
    }
    ${DatasetDescriptionFragmentDoc}
    ${DatasetDetailsFragmentDoc}
    ${DatasetReadmeFragmentDoc}
    ${DatasetLastUpdateFragmentDoc}
`;
export const DatasetPermissionsFragmentDoc = gql`
    fragment DatasetPermissions on Dataset {
        permissions {
            collaboration {
                canView
                canUpdate
            }
            envVars {
                canView
                canUpdate
            }
            flows {
                canView
                canRun
            }
            general {
                canRename
                canSetVisibility
                canDelete
            }
            metadata {
                canCommit
            }
            webhooks {
                canView
                canUpdate
            }
        }
    }
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
                ... on DependencyDatasetResultNotAccessible {
                    id
                }
                ... on DependencyDatasetResultAccessible {
                    dataset {
                        ...DatasetBasics
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetCurrentInfoFragmentDoc}
    ${LicenseFragmentDoc}
`;
export const CreateAccessTokenDocument = gql`
    mutation createAccessToken($accountId: AccountID!, $tokenName: String!) {
        accounts {
            byId(accountId: $accountId) {
                accessTokens {
                    createAccessToken(tokenName: $tokenName) {
                        ... on CreateAccessTokenResultSuccess {
                            message
                            token {
                                id
                                name
                                composed
                                account {
                                    ...Account
                                }
                            }
                        }
                        ... on CreateAccessTokenResultDuplicate {
                            message
                            tokenName
                        }
                    }
                }
            }
        }
    }
    ${AccountFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class CreateAccessTokenGQL extends Apollo.Mutation<
    CreateAccessTokenMutation,
    CreateAccessTokenMutationVariables
> {
    document = CreateAccessTokenDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ListAccessTokensDocument = gql`
    query listAccessTokens($accountId: AccountID!, $page: Int, $perPage: Int) {
        accounts {
            byId(accountId: $accountId) {
                accessTokens {
                    listAccessTokens(page: $page, perPage: $perPage) {
                        nodes {
                            ...AccessTokenData
                        }
                        totalCount
                        pageInfo {
                            ...DatasetPageInfo
                        }
                    }
                }
            }
        }
    }
    ${AccessTokenDataFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class ListAccessTokensGQL extends Apollo.Query<ListAccessTokensQuery, ListAccessTokensQueryVariables> {
    document = ListAccessTokensDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const RevokeAccessTokenDocument = gql`
    mutation revokeAccessToken($accountId: AccountID!, $tokenId: AccessTokenID!) {
        accounts {
            byId(accountId: $accountId) {
                accessTokens {
                    revokeAccessToken(tokenId: $tokenId) {
                        ... on RevokeResultSuccess {
                            tokenId
                            message
                        }
                        ... on RevokeResultAlreadyRevoked {
                            tokenId
                            message
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
export class RevokeAccessTokenGQL extends Apollo.Mutation<
    RevokeAccessTokenMutation,
    RevokeAccessTokenMutationVariables
> {
    document = RevokeAccessTokenDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountByNameDocument = gql`
    query accountByName($accountName: AccountName!) {
        accounts {
            byName(name: $accountName) {
                ...Account
            }
        }
    }
    ${AccountFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class AccountByNameGQL extends Apollo.Query<AccountByNameQuery, AccountByNameQueryVariables> {
    document = AccountByNameDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountChangeEmailDocument = gql`
    mutation accountChangeEmail($accountName: AccountName!, $newEmail: Email!) {
        accounts {
            byName(accountName: $accountName) {
                updateEmail(newEmail: $newEmail) {
                    ... on UpdateEmailSuccess {
                        newEmail
                        message
                    }
                    ... on UpdateEmailNonUnique {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class AccountChangeEmailGQL extends Apollo.Mutation<
    AccountChangeEmailMutation,
    AccountChangeEmailMutationVariables
> {
    document = AccountChangeEmailDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountDatasetFlowsPausedDocument = gql`
    query accountDatasetFlowsPaused($accountName: AccountName!) {
        accounts {
            byName(name: $accountName) {
                flows {
                    triggers {
                        allPaused
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class AccountDatasetFlowsPausedGQL extends Apollo.Query<
    AccountDatasetFlowsPausedQuery,
    AccountDatasetFlowsPausedQueryVariables
> {
    document = AccountDatasetFlowsPausedDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountListDatasetsWithFlowsDocument = gql`
    query accountListDatasetsWithFlows($name: AccountName!) {
        accounts {
            byName(name: $name) {
                flows {
                    runs {
                        listDatasetsWithFlow {
                            ...DatasetConnectionData
                        }
                    }
                }
            }
        }
    }
    ${DatasetConnectionDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class AccountListDatasetsWithFlowsGQL extends Apollo.Query<
    AccountListDatasetsWithFlowsQuery,
    AccountListDatasetsWithFlowsQueryVariables
> {
    document = AccountListDatasetsWithFlowsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountListFlowsDocument = gql`
    query accountListFlows(
        $name: AccountName!
        $page: Int
        $perPageTable: Int
        $perPageTiles: Int
        $filters: AccountFlowFilters
    ) {
        accounts {
            byName(name: $name) {
                flows {
                    runs {
                        table: listFlows(page: $page, perPage: $perPageTable, filters: $filters) {
                            ...FlowConnectionData
                        }
                        tiles: listFlows(
                            page: 0
                            perPage: $perPageTiles
                            filters: { byFlowType: null, byStatus: null, byInitiator: null, byDatasetIds: [] }
                        ) {
                            ...FlowConnectionWidgetData
                        }
                    }
                }
            }
        }
    }
    ${FlowConnectionDataFragmentDoc}
    ${FlowConnectionWidgetDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class AccountListFlowsGQL extends Apollo.Query<AccountListFlowsQuery, AccountListFlowsQueryVariables> {
    document = AccountListFlowsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountPauseFlowsDocument = gql`
    mutation accountPauseFlows($accountName: AccountName!) {
        accounts {
            byName(accountName: $accountName) {
                flows {
                    triggers {
                        pauseAccountDatasetFlows
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class AccountPauseFlowsGQL extends Apollo.Mutation<
    AccountPauseFlowsMutation,
    AccountPauseFlowsMutationVariables
> {
    document = AccountPauseFlowsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountResumeFlowsDocument = gql`
    mutation accountResumeFlows($accountName: AccountName!) {
        accounts {
            byName(accountName: $accountName) {
                flows {
                    triggers {
                        resumeAccountDatasetFlows
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class AccountResumeFlowsGQL extends Apollo.Mutation<
    AccountResumeFlowsMutation,
    AccountResumeFlowsMutationVariables
> {
    document = AccountResumeFlowsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const AccountWithEmailDocument = gql`
    query accountWithEmail($accountName: AccountName!) {
        accounts {
            byName(name: $accountName) {
                ...AccountWithEmail
            }
        }
    }
    ${AccountWithEmailFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class AccountWithEmailGQL extends Apollo.Query<AccountWithEmailQuery, AccountWithEmailQueryVariables> {
    document = AccountWithEmailDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ChangeAccountUsernameDocument = gql`
    mutation changeAccountUsername($accountName: AccountName!, $newName: AccountName!) {
        accounts {
            byName(accountName: $accountName) {
                rename(newName: $newName) {
                    ... on RenameAccountSuccess {
                        newName
                        message
                    }
                    ... on RenameAccountNameNotUnique {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class ChangeAccountUsernameGQL extends Apollo.Mutation<
    ChangeAccountUsernameMutation,
    ChangeAccountUsernameMutationVariables
> {
    document = ChangeAccountUsernameDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ChangeAdminPasswordDocument = gql`
    mutation changeAdminPassword($accountName: AccountName!, $password: AccountPassword!) {
        accounts {
            byName(accountName: $accountName) {
                modifyPassword(password: $password) {
                    ... on ModifyPasswordSuccess {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class ChangeAdminPasswordGQL extends Apollo.Mutation<
    ChangeAdminPasswordMutation,
    ChangeAdminPasswordMutationVariables
> {
    document = ChangeAdminPasswordDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ChangeUserPasswordDocument = gql`
    mutation changeUserPassword(
        $accountName: AccountName!
        $oldPassword: AccountPassword!
        $newPassword: AccountPassword!
    ) {
        accounts {
            byName(accountName: $accountName) {
                modifyPasswordWithConfirmation(oldPassword: $oldPassword, newPassword: $newPassword) {
                    ... on ModifyPasswordSuccess {
                        message
                    }
                    ... on ModifyPasswordWrongOldPassword {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class ChangeUserPasswordGQL extends Apollo.Mutation<
    ChangeUserPasswordMutation,
    ChangeUserPasswordMutationVariables
> {
    document = ChangeUserPasswordDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DeleteAccountByNameDocument = gql`
    mutation deleteAccountByName($accountName: AccountName!) {
        accounts {
            byName(accountName: $accountName) {
                delete {
                    ... on DeleteAccountSuccess {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DeleteAccountByNameGQL extends Apollo.Mutation<
    DeleteAccountByNameMutation,
    DeleteAccountByNameMutationVariables
> {
    document = DeleteAccountByNameDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const LoginWeb3WalletDocument = gql`
    mutation LoginWeb3Wallet($account: EvmWalletAddress!) {
        auth {
            web3 {
                eip4361AuthNonce(account: $account) {
                    value
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class LoginWeb3WalletGQL extends Apollo.Mutation<LoginWeb3WalletMutation, LoginWeb3WalletMutationVariables> {
    document = LoginWeb3WalletDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const LoginDocument = gql`
    mutation Login($login_method: AccountProvider!, $login_credentials_json: String!, $deviceCode: DeviceCode) {
        auth {
            login(loginMethod: $login_method, loginCredentialsJson: $login_credentials_json, deviceCode: $deviceCode) {
                accessToken
                account {
                    ...Account
                }
            }
        }
    }
    ${AccountFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class LoginGQL extends Apollo.Mutation<LoginMutation, LoginMutationVariables> {
    document = LoginDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const FetchAccountDetailsDocument = gql`
    mutation FetchAccountDetails($accessToken: String!) {
        auth {
            accountDetails(accessToken: $accessToken) {
                ...Account
            }
        }
    }
    ${AccountFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class FetchAccountDetailsGQL extends Apollo.Mutation<
    FetchAccountDetailsMutation,
    FetchAccountDetailsMutationVariables
> {
    document = FetchAccountDetailsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SetVisibilityDatasetDocument = gql`
    mutation setVisibilityDataset($datasetId: DatasetID!, $visibility: DatasetVisibilityInput!) {
        datasets {
            byId(datasetId: $datasetId) {
                setVisibility(visibility: $visibility) {
                    ... on SetDatasetVisibilityResultSuccess {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class SetVisibilityDatasetGQL extends Apollo.Mutation<
    SetVisibilityDatasetMutation,
    SetVisibilityDatasetMutationVariables
> {
    document = SetVisibilityDatasetDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const CommitEventToDatasetDocument = gql`
    mutation commitEventToDataset($datasetId: DatasetID!, $event: String!) {
        datasets {
            byId(datasetId: $datasetId) {
                metadata {
                    chain {
                        commitEvent(event: $event, eventFormat: YAML) {
                            __typename
                            ... on CommitResultSuccess {
                                message
                                oldHead
                                newHead
                            }
                            ... on MetadataManifestMalformed {
                                message
                            }
                            ... on CommitResultAppendError {
                                message
                            }
                            ... on MetadataManifestUnsupportedVersion {
                                message
                            }
                            ... on NoChanges {
                                message
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
export class CommitEventToDatasetGQL extends Apollo.Mutation<
    CommitEventToDatasetMutation,
    CommitEventToDatasetMutationVariables
> {
    document = CommitEventToDatasetDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const CreateEmptyDatasetDocument = gql`
    mutation createEmptyDataset(
        $datasetKind: DatasetKind!
        $datasetAlias: DatasetAlias!
        $datasetVisibility: DatasetVisibility!
    ) {
        datasets {
            createEmpty(datasetKind: $datasetKind, datasetAlias: $datasetAlias, datasetVisibility: $datasetVisibility) {
                ... on CreateDatasetResultSuccess {
                    dataset {
                        ...DatasetBasics
                    }
                    message
                }
                ... on CreateDatasetResultNameCollision {
                    message
                    accountName
                    datasetName
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class CreateEmptyDatasetGQL extends Apollo.Mutation<
    CreateEmptyDatasetMutation,
    CreateEmptyDatasetMutationVariables
> {
    document = CreateEmptyDatasetDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const CreateDatasetFromSnapshotDocument = gql`
    mutation createDatasetFromSnapshot($snapshot: String!, $datasetVisibility: DatasetVisibility!) {
        datasets {
            createFromSnapshot(snapshot: $snapshot, snapshotFormat: YAML, datasetVisibility: $datasetVisibility) {
                ... on CreateDatasetResultSuccess {
                    dataset {
                        ...DatasetBasics
                    }
                    message
                }
                ... on CreateDatasetResultNameCollision {
                    message
                    accountName
                    datasetName
                }
                ... on CreateDatasetResultInvalidSnapshot {
                    message
                }
                ... on CreateDatasetResultMissingInputs {
                    missingInputs
                    message
                }
                ... on MetadataManifestMalformed {
                    message
                }
                ... on MetadataManifestUnsupportedVersion {
                    message
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class CreateDatasetFromSnapshotGQL extends Apollo.Mutation<
    CreateDatasetFromSnapshotMutation,
    CreateDatasetFromSnapshotMutationVariables
> {
    document = CreateDatasetFromSnapshotDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UpdateReadmeDocument = gql`
    mutation updateReadme($datasetId: DatasetID!, $content: String!) {
        datasets {
            byId(datasetId: $datasetId) {
                metadata {
                    updateReadme(content: $content) {
                        __typename
                        message
                        ... on CommitResultSuccess {
                            oldHead
                        }
                        ... on CommitResultAppendError {
                            message
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
export class UpdateReadmeGQL extends Apollo.Mutation<UpdateReadmeMutation, UpdateReadmeMutationVariables> {
    document = UpdateReadmeDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UpdateWatermarkDocument = gql`
    mutation updateWatermark($datasetId: DatasetID!, $watermark: DateTime!) {
        datasets {
            byId(datasetId: $datasetId) {
                setWatermark(watermark: $watermark) {
                    ... on SetWatermarkUpdated {
                        newHead
                        message
                    }
                    ... on SetWatermarkUpToDate {
                        message
                    }
                    ... on SetWatermarkIsDerivative {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class UpdateWatermarkGQL extends Apollo.Mutation<UpdateWatermarkMutation, UpdateWatermarkMutationVariables> {
    document = UpdateWatermarkDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetBasicsWithPermissionsDocument = gql`
    query getDatasetBasicsWithPermissions($accountName: AccountName!, $datasetName: DatasetName!) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                ...DatasetBasics
                ...DatasetPermissions
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetPermissionsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetBasicsWithPermissionsGQL extends Apollo.Query<
    GetDatasetBasicsWithPermissionsQuery,
    GetDatasetBasicsWithPermissionsQueryVariables
> {
    document = GetDatasetBasicsWithPermissionsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetByAccountAndDatasetNameDocument = gql`
    query datasetByAccountAndDatasetName($accountName: AccountName!, $datasetName: DatasetName!) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                ...DatasetBasics
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetByAccountAndDatasetNameGQL extends Apollo.Query<
    DatasetByAccountAndDatasetNameQuery,
    DatasetByAccountAndDatasetNameQueryVariables
> {
    document = DatasetByAccountAndDatasetNameDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
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
export class DatasetByIdGQL extends Apollo.Query<DatasetByIdQuery, DatasetByIdQueryVariables> {
    document = DatasetByIdDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetListCollaboratorsDocument = gql`
    query datasetListCollaborators($datasetId: DatasetID!, $page: Int, $perPage: Int) {
        datasets {
            byId(datasetId: $datasetId) {
                ...DatasetBasics
                collaboration {
                    accountRoles(page: $page, perPage: $perPage) {
                        nodes {
                            account {
                                ...Account
                            }
                            role
                        }
                        totalCount
                        pageInfo {
                            ...DatasetPageInfo
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${AccountFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetListCollaboratorsGQL extends Apollo.Query<
    DatasetListCollaboratorsQuery,
    DatasetListCollaboratorsQueryVariables
> {
    document = DatasetListCollaboratorsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SetRoleCollaboratorDocument = gql`
    mutation setRoleCollaborator($datasetId: DatasetID!, $accountId: AccountID!, $role: DatasetAccessRole!) {
        datasets {
            byId(datasetId: $datasetId) {
                collaboration {
                    setRole(accountId: $accountId, role: $role) {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class SetRoleCollaboratorGQL extends Apollo.Mutation<
    SetRoleCollaboratorMutation,
    SetRoleCollaboratorMutationVariables
> {
    document = SetRoleCollaboratorDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UnsetRoleCollaboratorDocument = gql`
    mutation unsetRoleCollaborator($datasetId: DatasetID!, $accountIds: [AccountID!]!) {
        datasets {
            byId(datasetId: $datasetId) {
                collaboration {
                    unsetRoles(accountIds: $accountIds) {
                        message
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class UnsetRoleCollaboratorGQL extends Apollo.Mutation<
    UnsetRoleCollaboratorMutation,
    UnsetRoleCollaboratorMutationVariables
> {
    document = UnsetRoleCollaboratorDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetDataSqlRunDocument = gql`
    query getDatasetDataSQLRun($query: String!, $limit: Int!, $skip: Int) {
        data {
            query(
                query: $query
                queryDialect: SQL_DATA_FUSION
                schemaFormat: PARQUET_JSON
                dataFormat: JSON_AOS
                limit: $limit
                skip: $skip
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
export const DatasetHeadBlockHashDocument = gql`
    query datasetHeadBlockHash($accountName: AccountName!, $datasetName: DatasetName!) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                metadata {
                    chain {
                        refs {
                            name
                            blockHash
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
export class DatasetHeadBlockHashGQL extends Apollo.Query<
    DatasetHeadBlockHashQuery,
    DatasetHeadBlockHashQueryVariables
> {
    document = DatasetHeadBlockHashDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetHistoryDocument = gql`
    query getDatasetHistory($accountName: AccountName!, $datasetName: DatasetName!, $perPage: Int, $page: Int) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
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
export class GetDatasetHistoryGQL extends Apollo.Query<GetDatasetHistoryQuery, GetDatasetHistoryQueryVariables> {
    document = GetDatasetHistoryDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetLineageDocument = gql`
    query getDatasetLineage($accountName: AccountName!, $datasetName: DatasetName!) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                ...DatasetBasics
                ...DatasetLineage
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetLineageFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetLineageGQL extends Apollo.Query<GetDatasetLineageQuery, GetDatasetLineageQueryVariables> {
    document = GetDatasetLineageDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetListDownstreamsDocument = gql`
    query datasetListDownstreams($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                metadata {
                    currentDownstreamDependencies {
                        ... on DependencyDatasetResultAccessible {
                            dataset {
                                name
                                owner {
                                    accountName
                                    avatarUrl
                                }
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
export class DatasetListDownstreamsGQL extends Apollo.Query<
    DatasetListDownstreamsQuery,
    DatasetListDownstreamsQueryVariables
> {
    document = DatasetListDownstreamsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetMainDataDocument = gql`
    query getDatasetMainData($accountName: AccountName!, $datasetName: DatasetName!, $limit: Int) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                ...DatasetBasics
                ...DatasetOverview
                ...DatasetData
                ...DatasetMetadataSummary
                ...DatasetPermissions
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetOverviewFragmentDoc}
    ${DatasetDataFragmentDoc}
    ${DatasetMetadataSummaryFragmentDoc}
    ${DatasetPermissionsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetMainDataGQL extends Apollo.Query<GetDatasetMainDataQuery, GetDatasetMainDataQueryVariables> {
    document = GetDatasetMainDataDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetProtocolsDocument = gql`
    query datasetProtocols($accountName: AccountName!, $datasetName: DatasetName!) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                ...DatasetBasics
                endpoints {
                    cli {
                        pullCommand
                        pushCommand
                    }
                    webLink {
                        url
                    }
                    rest {
                        tailUrl
                        queryUrl
                        pushUrl
                    }
                    flightsql {
                        url
                    }
                    jdbc {
                        url
                    }
                    postgresql {
                        url
                    }
                    kafka {
                        url
                    }
                    websocket {
                        url
                    }
                    odata {
                        serviceUrl
                        collectionUrl
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetProtocolsGQL extends Apollo.Query<DatasetProtocolsQuery, DatasetProtocolsQueryVariables> {
    document = DatasetProtocolsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetPushSyncStatusesDocument = gql`
    query datasetPushSyncStatuses($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                metadata {
                    pushSyncStatuses {
                        statuses {
                            remote
                            result {
                                ... on CompareChainsResultStatus {
                                    message
                                }
                                ... on CompareChainsResultError {
                                    reason {
                                        message
                                    }
                                }
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
export class DatasetPushSyncStatusesGQL extends Apollo.Query<
    DatasetPushSyncStatusesQuery,
    DatasetPushSyncStatusesQueryVariables
> {
    document = DatasetPushSyncStatusesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetSchemaDocument = gql`
    query getDatasetSchema($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                ...DatasetBasics
                metadata {
                    currentSchema(format: PARQUET_JSON) {
                        format
                        content
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetSchemaGQL extends Apollo.Query<GetDatasetSchemaQuery, GetDatasetSchemaQueryVariables> {
    document = GetDatasetSchemaDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetSystemTimeBlockByHashDocument = gql`
    query datasetSystemTimeBlockByHash($datasetId: DatasetID!, $blockHash: Multihash!) {
        datasets {
            byId(datasetId: $datasetId) {
                ...DatasetBasics
                metadata {
                    chain {
                        blockByHash(hash: $blockHash) {
                            systemTime
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetSystemTimeBlockByHashGQL extends Apollo.Query<
    DatasetSystemTimeBlockByHashQuery,
    DatasetSystemTimeBlockByHashQueryVariables
> {
    document = DatasetSystemTimeBlockByHashDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetUserRoleDocument = gql`
    query datasetUserRole($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                role
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetUserRoleGQL extends Apollo.Query<DatasetUserRoleQuery, DatasetUserRoleQueryVariables> {
    document = DatasetUserRoleDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetsByAccountNameDocument = gql`
    query datasetsByAccountName($accountName: AccountName!, $perPage: Int, $page: Int) {
        datasets {
            byAccountName(accountName: $accountName, perPage: $perPage, page: $page) {
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
export const DatasetsTotalCountByAccountNameDocument = gql`
    query datasetsTotalCountByAccountName($accountName: AccountName!) {
        datasets {
            byAccountName(accountName: $accountName, perPage: 0, page: 0) {
                totalCount
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetsTotalCountByAccountNameGQL extends Apollo.Query<
    DatasetsTotalCountByAccountNameQuery,
    DatasetsTotalCountByAccountNameQueryVariables
> {
    document = DatasetsTotalCountByAccountNameDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DeleteDatasetDocument = gql`
    mutation deleteDataset($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                delete {
                    ... on DeleteResultDanglingReference {
                        message
                        danglingChildRefs
                        notDeletedDataset
                    }
                    ... on DeleteResultSuccess {
                        message
                        deletedDataset
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DeleteDatasetGQL extends Apollo.Mutation<DeleteDatasetMutation, DeleteDatasetMutationVariables> {
    document = DeleteDatasetDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetEnabledLoginMethodsDocument = gql`
    query getEnabledLoginMethods {
        auth {
            enabledProviders
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class GetEnabledLoginMethodsGQL extends Apollo.Query<
    GetEnabledLoginMethodsQuery,
    GetEnabledLoginMethodsQueryVariables
> {
    document = GetEnabledLoginMethodsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const EnginesDocument = gql`
    query engines {
        data {
            knownEngines {
                name
                dialect
                latestImage
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class EnginesGQL extends Apollo.Query<EnginesQuery, EnginesQueryVariables> {
    document = EnginesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DeleteEnvVariableDocument = gql`
    mutation deleteEnvVariable($datasetId: DatasetID!, $datasetEnvVarId: DatasetEnvVarID!) {
        datasets {
            byId(datasetId: $datasetId) {
                envVars {
                    deleteEnvVariable(id: $datasetEnvVarId) {
                        ... on DeleteDatasetEnvVarResultSuccess {
                            message
                            envVarId
                        }
                        ... on DeleteDatasetEnvVarResultNotFound {
                            message
                            envVarId
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
export class DeleteEnvVariableGQL extends Apollo.Mutation<
    DeleteEnvVariableMutation,
    DeleteEnvVariableMutationVariables
> {
    document = DeleteEnvVariableDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ExposedEnvVariableValueDocument = gql`
    query exposedEnvVariableValue(
        $accountName: AccountName!
        $datasetName: DatasetName!
        $datasetEnvVarId: DatasetEnvVarID!
    ) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                envVars {
                    exposedValue(datasetEnvVarId: $datasetEnvVarId)
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class ExposedEnvVariableValueGQL extends Apollo.Query<
    ExposedEnvVariableValueQuery,
    ExposedEnvVariableValueQueryVariables
> {
    document = ExposedEnvVariableValueDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const ListEnvVariablesDocument = gql`
    query listEnvVariables($accountName: AccountName!, $datasetName: DatasetName!, $page: Int, $perPage: Int) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                ...DatasetBasics
                envVars {
                    listEnvVariables(page: $page, perPage: $perPage) {
                        totalCount
                        nodes {
                            ...ViewDatasetEnvVarData
                        }
                        pageInfo {
                            ...DatasetPageInfo
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${ViewDatasetEnvVarDataFragmentDoc}
    ${DatasetPageInfoFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class ListEnvVariablesGQL extends Apollo.Query<ListEnvVariablesQuery, ListEnvVariablesQueryVariables> {
    document = ListEnvVariablesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const UpsertEnvVariableDocument = gql`
    mutation upsertEnvVariable($datasetId: DatasetID!, $key: String!, $value: String!, $isSecret: Boolean!) {
        datasets {
            byId(datasetId: $datasetId) {
                envVars {
                    upsertEnvVariable(key: $key, value: $value, isSecret: $isSecret) {
                        ... on UpsertDatasetEnvVarUpToDate {
                            message
                        }
                        ... on UpsertDatasetEnvVarResultCreated {
                            message
                            envVar {
                                ...ViewDatasetEnvVarData
                            }
                        }
                        ... on UpsertDatasetEnvVarResultUpdated {
                            message
                            envVar {
                                ...ViewDatasetEnvVarData
                            }
                        }
                    }
                }
            }
        }
    }
    ${ViewDatasetEnvVarDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class UpsertEnvVariableGQL extends Apollo.Mutation<
    UpsertEnvVariableMutation,
    UpsertEnvVariableMutationVariables
> {
    document = UpsertEnvVariableDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetFlowConfigsDocument = gql`
    query getDatasetFlowConfigs($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType!) {
        datasets {
            byId(datasetId: $datasetId) {
                ...DatasetBasics
                flows {
                    configs {
                        __typename
                        byType(datasetFlowType: $datasetFlowType) {
                            __typename
                            rule {
                                ... on FlowConfigRuleIngest {
                                    fetchUncacheable
                                }
                                ... on FlowConfigRuleReset {
                                    oldHeadHash
                                    mode {
                                        ... on FlowConfigResetPropagationModeToSeed {
                                            dummy
                                        }
                                    }
                                }
                                ... on FlowConfigRuleCompaction {
                                    maxSliceSize
                                    maxSliceRecords
                                }
                            }
                            retryPolicy {
                                maxAttempts
                                minDelay {
                                    ...TimeDeltaData
                                }
                                backoffType
                            }
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${TimeDeltaDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetFlowConfigsGQL extends Apollo.Query<
    GetDatasetFlowConfigsQuery,
    GetDatasetFlowConfigsQueryVariables
> {
    document = GetDatasetFlowConfigsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SetCompactionFlowConfigDocument = gql`
    mutation setCompactionFlowConfig($datasetId: DatasetID!, $compactionConfigInput: FlowConfigCompactionInput!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
                        setCompactionConfig(compactionConfigInput: $compactionConfigInput) {
                            ... on SetFlowConfigSuccess {
                                message
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                                preconditions
                            }
                            ... on FlowInvalidConfigInputError {
                                message
                                reason
                            }
                            ... on FlowIncompatibleDatasetKind {
                                message
                                actualDatasetKind
                                expectedDatasetKind
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
export class SetCompactionFlowConfigGQL extends Apollo.Mutation<
    SetCompactionFlowConfigMutation,
    SetCompactionFlowConfigMutationVariables
> {
    document = SetCompactionFlowConfigDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SetIngestFlowConfigDocument = gql`
    mutation setIngestFlowConfig(
        $datasetId: DatasetID!
        $ingestConfigInput: FlowConfigIngestInput!
        $retryPolicyInput: FlowRetryPolicyInput
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
                        setIngestConfig(ingestConfigInput: $ingestConfigInput, retryPolicyInput: $retryPolicyInput) {
                            ... on SetFlowConfigSuccess {
                                message
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                                preconditions
                            }
                            ... on FlowInvalidConfigInputError {
                                message
                                reason
                            }
                            ... on FlowIncompatibleDatasetKind {
                                message
                                actualDatasetKind
                                expectedDatasetKind
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
export class SetIngestFlowConfigGQL extends Apollo.Mutation<
    SetIngestFlowConfigMutation,
    SetIngestFlowConfigMutationVariables
> {
    document = SetIngestFlowConfigDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SetDatasetFlowTriggersDocument = gql`
    mutation setDatasetFlowTriggers(
        $datasetId: DatasetID!
        $datasetFlowType: DatasetFlowType!
        $paused: Boolean!
        $triggerInput: FlowTriggerInput!
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    triggers {
                        setTrigger(datasetFlowType: $datasetFlowType, paused: $paused, triggerInput: $triggerInput) {
                            ... on SetFlowTriggerSuccess {
                                message
                            }
                            ... on FlowIncompatibleDatasetKind {
                                message
                                expectedDatasetKind
                                actualDatasetKind
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                            }
                            ... on FlowTypeIsNotSupported {
                                message
                            }
                            ... on FlowInvalidTriggerInputError {
                                message
                                reason
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
export class SetDatasetFlowTriggersGQL extends Apollo.Mutation<
    SetDatasetFlowTriggersMutation,
    SetDatasetFlowTriggersMutationVariables
> {
    document = SetDatasetFlowTriggersDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetFlowTriggersDocument = gql`
    query getDatasetFlowTriggers($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    triggers {
                        byType(datasetFlowType: $datasetFlowType) {
                            paused
                            schedule {
                                ... on TimeDelta {
                                    ...TimeDeltaData
                                }
                                ... on Cron5ComponentExpression {
                                    cron5ComponentExpression
                                }
                            }
                            reactive {
                                forNewData {
                                    maxBatchingInterval {
                                        ...TimeDeltaData
                                    }
                                    minRecordsToAwait
                                }
                                forBreakingChange
                            }
                        }
                    }
                }
            }
        }
    }
    ${TimeDeltaDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetFlowTriggersGQL extends Apollo.Query<
    GetDatasetFlowTriggersQuery,
    GetDatasetFlowTriggersQueryVariables
> {
    document = GetDatasetFlowTriggersDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetAllFlowsPausedDocument = gql`
    query datasetAllFlowsPaused($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    triggers {
                        allPaused
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetAllFlowsPausedGQL extends Apollo.Query<
    DatasetAllFlowsPausedQuery,
    DatasetAllFlowsPausedQueryVariables
> {
    document = DatasetAllFlowsPausedDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const CancelScheduledTasksDocument = gql`
    mutation cancelScheduledTasks($datasetId: DatasetID!, $flowId: FlowID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        cancelScheduledTasks(flowId: $flowId) {
                            ... on FlowNotFound {
                                flowId
                                message
                            }
                            ... on CancelScheduledTasksSuccess {
                                message
                                flow {
                                    ...FlowSummaryData
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    ${FlowSummaryDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class CancelScheduledTasksGQL extends Apollo.Mutation<
    CancelScheduledTasksMutation,
    CancelScheduledTasksMutationVariables
> {
    document = CancelScheduledTasksDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetFlowByIdDocument = gql`
    query getFlowById($datasetId: DatasetID!, $flowId: FlowID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        getFlow(flowId: $flowId) {
                            ... on GetFlowSuccess {
                                flow {
                                    ...FlowSummaryData
                                    history {
                                        ...FlowHistoryData
                                    }
                                }
                            }
                            ... on FlowNotFound {
                                message
                                flowId
                            }
                        }
                    }
                }
            }
        }
    }
    ${FlowSummaryDataFragmentDoc}
    ${FlowHistoryDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetFlowByIdGQL extends Apollo.Query<GetFlowByIdQuery, GetFlowByIdQueryVariables> {
    document = GetFlowByIdDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetFlowsInitiatorsDocument = gql`
    query datasetFlowsInitiators($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        listFlowInitiators {
                            totalCount
                            nodes {
                                ...Account
                            }
                        }
                    }
                }
            }
        }
    }
    ${AccountFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetFlowsInitiatorsGQL extends Apollo.Query<
    DatasetFlowsInitiatorsQuery,
    DatasetFlowsInitiatorsQueryVariables
> {
    document = DatasetFlowsInitiatorsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetDatasetListFlowsDocument = gql`
    query getDatasetListFlows(
        $datasetId: DatasetID!
        $page: Int
        $perPageTable: Int
        $perPageTiles: Int
        $filters: DatasetFlowFilters
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                ...DatasetBasics
                flows {
                    runs {
                        table: listFlows(page: $page, perPage: $perPageTable, filters: $filters) {
                            ...FlowConnectionData
                        }
                        tiles: listFlows(
                            page: 0
                            perPage: $perPageTiles
                            filters: { byFlowType: null, byStatus: null, byInitiator: null }
                        ) {
                            ...FlowConnectionWidgetData
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${FlowConnectionDataFragmentDoc}
    ${FlowConnectionWidgetDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetDatasetListFlowsGQL extends Apollo.Query<GetDatasetListFlowsQuery, GetDatasetListFlowsQueryVariables> {
    document = GetDatasetListFlowsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetPauseFlowsDocument = gql`
    mutation datasetPauseFlows($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    triggers {
                        pauseFlows
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetPauseFlowsGQL extends Apollo.Mutation<
    DatasetPauseFlowsMutation,
    DatasetPauseFlowsMutationVariables
> {
    document = DatasetPauseFlowsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetResumeFlowsDocument = gql`
    mutation datasetResumeFlows($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    triggers {
                        resumeFlows
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetResumeFlowsGQL extends Apollo.Mutation<
    DatasetResumeFlowsMutation,
    DatasetResumeFlowsMutationVariables
> {
    document = DatasetResumeFlowsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetTriggerCompactionFlowDocument = gql`
    mutation datasetTriggerCompactionFlow($datasetId: DatasetID!, $compactionConfigInput: FlowConfigCompactionInput) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        triggerCompactionFlow(compactionConfigInput: $compactionConfigInput) {
                            ... on TriggerFlowSuccess {
                                flow {
                                    ...FlowSummaryData
                                }
                                message
                            }
                            ... on FlowIncompatibleDatasetKind {
                                expectedDatasetKind
                                actualDatasetKind
                                message
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                            }
                            ... on FlowInvalidRunConfigurations {
                                error
                                message
                            }
                        }
                    }
                }
            }
        }
    }
    ${FlowSummaryDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetTriggerCompactionFlowGQL extends Apollo.Mutation<
    DatasetTriggerCompactionFlowMutation,
    DatasetTriggerCompactionFlowMutationVariables
> {
    document = DatasetTriggerCompactionFlowDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetTriggerIngestFlowDocument = gql`
    mutation datasetTriggerIngestFlow($datasetId: DatasetID!, $ingestConfigInput: FlowConfigIngestInput) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        triggerIngestFlow(ingestConfigInput: $ingestConfigInput) {
                            ... on TriggerFlowSuccess {
                                flow {
                                    ...FlowSummaryData
                                }
                                message
                            }
                            ... on FlowIncompatibleDatasetKind {
                                expectedDatasetKind
                                actualDatasetKind
                                message
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                            }
                            ... on FlowInvalidRunConfigurations {
                                error
                                message
                            }
                        }
                    }
                }
            }
        }
    }
    ${FlowSummaryDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetTriggerIngestFlowGQL extends Apollo.Mutation<
    DatasetTriggerIngestFlowMutation,
    DatasetTriggerIngestFlowMutationVariables
> {
    document = DatasetTriggerIngestFlowDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetTriggerResetFlowDocument = gql`
    mutation datasetTriggerResetFlow($datasetId: DatasetID!, $resetConfigInput: FlowConfigResetInput!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        triggerResetFlow(resetConfigInput: $resetConfigInput) {
                            ... on TriggerFlowSuccess {
                                flow {
                                    ...FlowSummaryData
                                }
                                message
                            }
                            ... on FlowIncompatibleDatasetKind {
                                expectedDatasetKind
                                actualDatasetKind
                                message
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                            }
                            ... on FlowInvalidRunConfigurations {
                                error
                                message
                            }
                        }
                    }
                }
            }
        }
    }
    ${FlowSummaryDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetTriggerResetFlowGQL extends Apollo.Mutation<
    DatasetTriggerResetFlowMutation,
    DatasetTriggerResetFlowMutationVariables
> {
    document = DatasetTriggerResetFlowDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetTriggerResetToMetadataFlowDocument = gql`
    mutation datasetTriggerResetToMetadataFlow($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        triggerResetToMetadataFlow {
                            ... on TriggerFlowSuccess {
                                flow {
                                    ...FlowSummaryData
                                }
                                message
                            }
                            ... on FlowIncompatibleDatasetKind {
                                expectedDatasetKind
                                actualDatasetKind
                                message
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                            }
                            ... on FlowInvalidRunConfigurations {
                                error
                                message
                            }
                        }
                    }
                }
            }
        }
    }
    ${FlowSummaryDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetTriggerResetToMetadataFlowGQL extends Apollo.Mutation<
    DatasetTriggerResetToMetadataFlowMutation,
    DatasetTriggerResetToMetadataFlowMutationVariables
> {
    document = DatasetTriggerResetToMetadataFlowDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetTriggerTransformFlowDocument = gql`
    mutation datasetTriggerTransformFlow($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        triggerTransformFlow {
                            ... on TriggerFlowSuccess {
                                flow {
                                    ...FlowSummaryData
                                }
                                message
                            }
                            ... on FlowIncompatibleDatasetKind {
                                expectedDatasetKind
                                actualDatasetKind
                                message
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                            }
                            ... on FlowInvalidRunConfigurations {
                                error
                                message
                            }
                        }
                    }
                }
            }
        }
    }
    ${FlowSummaryDataFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class DatasetTriggerTransformFlowGQL extends Apollo.Mutation<
    DatasetTriggerTransformFlowMutation,
    DatasetTriggerTransformFlowMutationVariables
> {
    document = DatasetTriggerTransformFlowDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const GetMetadataBlockDocument = gql`
    query getMetadataBlock($accountName: AccountName!, $datasetName: DatasetName!, $blockHash: Multihash!) {
        datasets {
            byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
                ...DatasetBasics
                metadata {
                    chain {
                        blockByHashEncoded(hash: $blockHash, format: YAML)
                        blockByHash(hash: $blockHash) {
                            ...MetadataBlock
                        }
                    }
                    currentDownstreamDependencies {
                        ... on DependencyDatasetResultNotAccessible {
                            __typename
                        }
                        ... on DependencyDatasetResultAccessible {
                            __typename
                        }
                    }
                }
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${MetadataBlockFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class GetMetadataBlockGQL extends Apollo.Query<GetMetadataBlockQuery, GetMetadataBlockQueryVariables> {
    document = GetMetadataBlockDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const RenameDatasetDocument = gql`
    mutation renameDataset($datasetId: DatasetID!, $newName: DatasetName!) {
        datasets {
            byId(datasetId: $datasetId) {
                rename(newName: $newName) {
                    __typename
                    ... on RenameResultSuccess {
                        message
                        oldName
                        newName
                    }
                    ... on RenameResultNoChanges {
                        preservedName
                        message
                    }
                    ... on RenameResultNameCollision {
                        message
                        collidingAlias
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class RenameDatasetGQL extends Apollo.Mutation<RenameDatasetMutation, RenameDatasetMutationVariables> {
    document = RenameDatasetDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SearchCollaboratorDocument = gql`
    query searchCollaborator($query: String!, $filters: LookupFilters!, $page: Int, $perPage: Int) {
        search {
            nameLookup(query: $query, filters: $filters, page: $page, perPage: $perPage) {
                nodes {
                    ...Account
                }
            }
        }
    }
    ${AccountFragmentDoc}
`;

@Injectable({
    providedIn: "root",
})
export class SearchCollaboratorGQL extends Apollo.Query<SearchCollaboratorQuery, SearchCollaboratorQueryVariables> {
    document = SearchCollaboratorDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const SearchDatasetsAutocompleteDocument = gql`
    query searchDatasetsAutocomplete($query: String!, $perPage: Int, $page: Int) {
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
export const SemanticSearchDatasetsOverviewDocument = gql`
    query semanticSearchDatasetsOverview($prompt: String!, $perPage: Int) {
        search {
            queryNaturalLanguage(prompt: $prompt, perPage: $perPage) {
                nodes {
                    item {
                        ... on Dataset {
                            ...DatasetSearchOverview
                        }
                    }
                    score
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
export class SemanticSearchDatasetsOverviewGQL extends Apollo.Query<
    SemanticSearchDatasetsOverviewQuery,
    SemanticSearchDatasetsOverviewQueryVariables
> {
    document = SemanticSearchDatasetsOverviewDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetWebhookCreateSubscriptionDocument = gql`
    mutation datasetWebhookCreateSubscription($datasetId: DatasetID!, $input: WebhookSubscriptionInput!) {
        datasets {
            byId(datasetId: $datasetId) {
                webhooks {
                    createSubscription(input: $input) {
                        __typename
                        ... on CreateWebhookSubscriptionResultSuccess {
                            secret
                            subscriptionId
                            message
                        }
                        ... on WebhookSubscriptionDuplicateLabel {
                            message
                            label
                        }
                        ... on WebhookSubscriptionInvalidTargetUrl {
                            innerMessage
                            message
                        }
                        ... on WebhookSubscriptionNoEventTypesProvided {
                            numEventTypes
                            message
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
export class DatasetWebhookCreateSubscriptionGQL extends Apollo.Mutation<
    DatasetWebhookCreateSubscriptionMutation,
    DatasetWebhookCreateSubscriptionMutationVariables
> {
    document = DatasetWebhookCreateSubscriptionDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetWebhookPauseSubscriptionDocument = gql`
    mutation datasetWebhookPauseSubscription($datasetId: DatasetID!, $id: WebhookSubscriptionID!) {
        datasets {
            byId(datasetId: $datasetId) {
                webhooks {
                    subscription(id: $id) {
                        pause {
                            ... on PauseWebhookSubscriptionResultSuccess {
                                paused
                                message
                            }
                            ... on PauseWebhookSubscriptionResultUnexpected {
                                status
                                message
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
export class DatasetWebhookPauseSubscriptionGQL extends Apollo.Mutation<
    DatasetWebhookPauseSubscriptionMutation,
    DatasetWebhookPauseSubscriptionMutationVariables
> {
    document = DatasetWebhookPauseSubscriptionDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetWebhookRemoveSubscriptionDocument = gql`
    mutation datasetWebhookRemoveSubscription($datasetId: DatasetID!, $id: WebhookSubscriptionID!) {
        datasets {
            byId(datasetId: $datasetId) {
                webhooks {
                    subscription(id: $id) {
                        remove {
                            ... on RemoveWebhookSubscriptionResultSuccess {
                                removed
                                message
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
export class DatasetWebhookRemoveSubscriptionGQL extends Apollo.Mutation<
    DatasetWebhookRemoveSubscriptionMutation,
    DatasetWebhookRemoveSubscriptionMutationVariables
> {
    document = DatasetWebhookRemoveSubscriptionDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetWebhookResumeSubscriptionDocument = gql`
    mutation datasetWebhookResumeSubscription($datasetId: DatasetID!, $id: WebhookSubscriptionID!) {
        datasets {
            byId(datasetId: $datasetId) {
                webhooks {
                    subscription(id: $id) {
                        resume {
                            ... on ResumeWebhookSubscriptionResultSuccess {
                                resumed
                                message
                            }
                            ... on ResumeWebhookSubscriptionResultUnexpected {
                                status
                                message
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
export class DatasetWebhookResumeSubscriptionGQL extends Apollo.Mutation<
    DatasetWebhookResumeSubscriptionMutation,
    DatasetWebhookResumeSubscriptionMutationVariables
> {
    document = DatasetWebhookResumeSubscriptionDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetWebhookSubscriptionsDocument = gql`
    query datasetWebhookSubscriptions($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                webhooks {
                    subscriptions {
                        label
                        id
                        targetUrl
                        status
                        datasetId
                        eventTypes
                    }
                }
            }
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class DatasetWebhookSubscriptionsGQL extends Apollo.Query<
    DatasetWebhookSubscriptionsQuery,
    DatasetWebhookSubscriptionsQueryVariables
> {
    document = DatasetWebhookSubscriptionsDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const DatasetWebhookUpdateSubscriptionDocument = gql`
    mutation datasetWebhookUpdateSubscription(
        $datasetId: DatasetID!
        $id: WebhookSubscriptionID!
        $input: WebhookSubscriptionInput!
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                webhooks {
                    subscription(id: $id) {
                        update(input: $input) {
                            ... on UpdateWebhookSubscriptionResultSuccess {
                                updated
                                message
                            }
                            ... on UpdateWebhookSubscriptionResultUnexpected {
                                status
                                message
                            }
                            ... on WebhookSubscriptionDuplicateLabel {
                                label
                                message
                            }
                            ... on WebhookSubscriptionInvalidTargetUrl {
                                innerMessage
                                message
                            }
                            ... on WebhookSubscriptionNoEventTypesProvided {
                                numEventTypes
                                message
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
export class DatasetWebhookUpdateSubscriptionGQL extends Apollo.Mutation<
    DatasetWebhookUpdateSubscriptionMutation,
    DatasetWebhookUpdateSubscriptionMutationVariables
> {
    document = DatasetWebhookUpdateSubscriptionDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const WebhookEventTypesDocument = gql`
    query webhookEventTypes {
        webhooks {
            eventTypes
        }
    }
`;

@Injectable({
    providedIn: "root",
})
export class WebhookEventTypesGQL extends Apollo.Query<WebhookEventTypesQuery, WebhookEventTypesQueryVariables> {
    document = WebhookEventTypesDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
