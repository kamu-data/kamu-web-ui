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
    AccountDisplayName: string;
    AccountID: string;
    AccountName: string;
    DatasetAlias: string;
    DatasetID: string;
    DatasetName: string;
    DatasetRef: string;
    /**
     * Implement the DateTime<Utc> scalar
     *
     * The input/output is a string in RFC3339 format.
     */
    DateTime: string;
    EventID: string;
    FlowID: string;
    Multihash: string;
    TaskID: string;
};

export type Account = {
    __typename?: "Account";
    /** Symbolic account name */
    accountName: Scalars["AccountName"];
    /** Account type */
    accountType: AccountType;
    /** Avatar URL */
    avatarUrl?: Maybe<Scalars["String"]>;
    /** Account name to display */
    displayName: Scalars["AccountDisplayName"];
    /** Access to the flow configurations of this account */
    flows?: Maybe<AccountFlows>;
    /** Unique and stable identifier of this account */
    id: Scalars["AccountID"];
    /** Indicates the administrator status */
    isAdmin: Scalars["Boolean"];
};

export type AccountFlowConfigsMut = {
    __typename?: "AccountFlowConfigsMut";
    pauseAccountDatasetFlows: Scalars["Boolean"];
    resumeAccountDatasetFlows: Scalars["Boolean"];
};

export type AccountFlowFilters = {
    byDatasetIds: Array<Scalars["DatasetID"]>;
    byFlowType?: InputMaybe<DatasetFlowType>;
    byInitiator?: InputMaybe<InitiatorFilterInput>;
    byStatus?: InputMaybe<FlowStatus>;
};

export type AccountFlowRuns = {
    __typename?: "AccountFlowRuns";
    listFlows: FlowConnection;
};

export type AccountFlowRunsListFlowsArgs = {
    filters?: InputMaybe<AccountFlowFilters>;
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type AccountFlows = {
    __typename?: "AccountFlows";
    /** Returns interface for flow runs queries */
    runs: AccountFlowRuns;
};

export type AccountFlowsMut = {
    __typename?: "AccountFlowsMut";
    configs: AccountFlowConfigsMut;
};

export type AccountMut = {
    __typename?: "AccountMut";
    /** Access to the mutable flow configurations of this account */
    flows: AccountFlowsMut;
};

export enum AccountType {
    Organization = "ORGANIZATION",
    User = "USER",
}

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
};

export type AccountsMutByIdArgs = {
    accountId: Scalars["AccountID"];
};

export type AccountsMutByNameArgs = {
    accountName: Scalars["AccountName"];
};

export type AddData = {
    __typename?: "AddData";
    newCheckpoint?: Maybe<Checkpoint>;
    newData?: Maybe<DataSlice>;
    newSourceState?: Maybe<SourceState>;
    newWatermark?: Maybe<Scalars["DateTime"]>;
    prevCheckpoint?: Maybe<Scalars["Multihash"]>;
    prevOffset?: Maybe<Scalars["Int"]>;
};

export type AddPushSource = {
    __typename?: "AddPushSource";
    merge: MergeStrategy;
    preprocess?: Maybe<Transform>;
    read: ReadStep;
    sourceName: Scalars["String"];
};

export type Admin = {
    __typename?: "Admin";
    selfTest: Scalars["String"];
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
    enabledLoginMethods: Array<Scalars["String"]>;
};

export type AuthMut = {
    __typename?: "AuthMut";
    accountDetails: Account;
    login: LoginResponse;
};

export type AuthMutAccountDetailsArgs = {
    accessToken: Scalars["String"];
};

export type AuthMutLoginArgs = {
    loginCredentialsJson: Scalars["String"];
    loginMethod: Scalars["String"];
};

export type BatchingConditionInput = {
    maxBatchingInterval: TimeDeltaInput;
    minRecordsToAwait: Scalars["Int"];
};

export type BlockRef = {
    __typename?: "BlockRef";
    blockHash: Scalars["Multihash"];
    name: Scalars["String"];
};

export type CancelScheduledTasksResult = {
    message: Scalars["String"];
};

export type CancelScheduledTasksSuccess = CancelScheduledTasksResult & {
    __typename?: "CancelScheduledTasksSuccess";
    flow: Flow;
    message: Scalars["String"];
};

export type Checkpoint = {
    __typename?: "Checkpoint";
    physicalHash: Scalars["Multihash"];
    size: Scalars["Int"];
};

export type CliProtocolDesc = {
    __typename?: "CliProtocolDesc";
    pullCommand: Scalars["String"];
    pushCommand: Scalars["String"];
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

export type CompactingConditionFull = {
    maxSliceRecords: Scalars["Int"];
    maxSliceSize: Scalars["Int"];
};

export type CompactingConditionInput =
    | { full: CompactingConditionFull; metadataOnly?: never }
    | { full?: never; metadataOnly: CompactingConditionMetadataOnly };

export type CompactingConditionMetadataOnly = {
    recursive: Scalars["Boolean"];
};

export type CompactingFull = {
    __typename?: "CompactingFull";
    maxSliceRecords: Scalars["Int"];
    maxSliceSize: Scalars["Int"];
};

export type CompactingMetadataOnly = {
    __typename?: "CompactingMetadataOnly";
    recursive: Scalars["Boolean"];
};

export enum CompressionFormat {
    Gzip = "GZIP",
    Zip = "ZIP",
}

export type CreateDatasetFromSnapshotResult = {
    message: Scalars["String"];
};

export type CreateDatasetResult = {
    message: Scalars["String"];
};

export type CreateDatasetResultInvalidSnapshot = CreateDatasetFromSnapshotResult & {
    __typename?: "CreateDatasetResultInvalidSnapshot";
    message: Scalars["String"];
};

export type CreateDatasetResultMissingInputs = CreateDatasetFromSnapshotResult & {
    __typename?: "CreateDatasetResultMissingInputs";
    message: Scalars["String"];
    missingInputs: Array<Scalars["String"]>;
};

export type CreateDatasetResultNameCollision = CreateDatasetFromSnapshotResult &
    CreateDatasetResult & {
        __typename?: "CreateDatasetResultNameCollision";
        accountName?: Maybe<Scalars["AccountName"]>;
        datasetName: Scalars["DatasetName"];
        message: Scalars["String"];
    };

export type CreateDatasetResultSuccess = CreateDatasetFromSnapshotResult &
    CreateDatasetResult & {
        __typename?: "CreateDatasetResultSuccess";
        dataset: Dataset;
        message: Scalars["String"];
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
    Json = "JSON",
    JsonAoa = "JSON_AOA",
    /** Deprecated: Use ND_JSON instead */
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
    InternalError = "INTERNAL_ERROR",
    InvalidSql = "INVALID_SQL",
    Unauthorized = "UNAUTHORIZED",
}

export type DataQueryResultSuccess = {
    __typename?: "DataQueryResultSuccess";
    data: DataBatch;
    limit: Scalars["Int"];
    schema?: Maybe<DataSchema>;
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

export type DataSlice = {
    __typename?: "DataSlice";
    logicalHash: Scalars["Multihash"];
    offsetInterval: OffsetInterval;
    physicalHash: Scalars["Multihash"];
    size: Scalars["Int"];
};

export type Dataset = {
    __typename?: "Dataset";
    /** Returns dataset alias (user + name) */
    alias: Scalars["DatasetAlias"];
    /** Creation time of the first metadata block in the chain */
    createdAt: Scalars["DateTime"];
    /** Access to the data of the dataset */
    data: DatasetData;
    /** Various endpoints for interacting with data */
    endpoints: DatasetEndpoints;
    /** Access to the flow configurations of this dataset */
    flows: DatasetFlows;
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

export type DatasetFlowConfigs = {
    __typename?: "DatasetFlowConfigs";
    /** Checks if all configs of this dataset are disabled */
    allPaused: Scalars["Boolean"];
    /** Returns defined configuration for a flow of specified type */
    byType?: Maybe<FlowConfiguration>;
};

export type DatasetFlowConfigsByTypeArgs = {
    datasetFlowType: DatasetFlowType;
};

export type DatasetFlowConfigsMut = {
    __typename?: "DatasetFlowConfigsMut";
    pauseFlows: Scalars["Boolean"];
    resumeFlows: Scalars["Boolean"];
    setConfigBatching: SetFlowBatchingConfigResult;
    setConfigCompacting: SetFlowCompactingConfigResult;
    setConfigSchedule: SetFlowConfigResult;
};

export type DatasetFlowConfigsMutPauseFlowsArgs = {
    datasetFlowType?: InputMaybe<DatasetFlowType>;
};

export type DatasetFlowConfigsMutResumeFlowsArgs = {
    datasetFlowType?: InputMaybe<DatasetFlowType>;
};

export type DatasetFlowConfigsMutSetConfigBatchingArgs = {
    batching: BatchingConditionInput;
    datasetFlowType: DatasetFlowType;
    paused: Scalars["Boolean"];
};

export type DatasetFlowConfigsMutSetConfigCompactingArgs = {
    compactingArgs: CompactingConditionInput;
    datasetFlowType: DatasetFlowType;
};

export type DatasetFlowConfigsMutSetConfigScheduleArgs = {
    datasetFlowType: DatasetFlowType;
    paused: Scalars["Boolean"];
    schedule: ScheduleInput;
};

export type DatasetFlowFilters = {
    byFlowType?: InputMaybe<DatasetFlowType>;
    byInitiator?: InputMaybe<InitiatorFilterInput>;
    byStatus?: InputMaybe<FlowStatus>;
};

export type DatasetFlowRuns = {
    __typename?: "DatasetFlowRuns";
    getFlow: GetFlowResult;
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
    triggerFlow: TriggerFlowResult;
};

export type DatasetFlowRunsMutCancelScheduledTasksArgs = {
    flowId: Scalars["FlowID"];
};

export type DatasetFlowRunsMutTriggerFlowArgs = {
    datasetFlowType: DatasetFlowType;
    flowRunConfiguration?: InputMaybe<FlowRunConfiguration>;
};

export enum DatasetFlowType {
    ExecuteTransform = "EXECUTE_TRANSFORM",
    HardCompacting = "HARD_COMPACTING",
    Ingest = "INGEST",
}

export type DatasetFlows = {
    __typename?: "DatasetFlows";
    /** Returns interface for flow configurations queries */
    configs: DatasetFlowConfigs;
    /** Returns interface for flow runs queries */
    runs: DatasetFlowRuns;
};

export type DatasetFlowsMut = {
    __typename?: "DatasetFlowsMut";
    configs: DatasetFlowConfigsMut;
    runs: DatasetFlowRunsMut;
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
    currentUpstreamDependencies: Array<Dataset>;
    /** Current vocabulary associated with the dataset */
    currentVocab?: Maybe<SetVocab>;
    /** Last recorded watermark */
    currentWatermark?: Maybe<Scalars["DateTime"]>;
};

export type DatasetMetadataCurrentSchemaArgs = {
    format?: InputMaybe<DataSchemaFormat>;
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

export type DatasetMut = {
    __typename?: "DatasetMut";
    /** Delete the dataset */
    delete: DeleteResult;
    /** Access to the mutable flow configurations of this dataset */
    flows: DatasetFlowsMut;
    /** Access to the mutable metadata of the dataset */
    metadata: DatasetMetadataMut;
    /** Rename the dataset */
    rename: RenameResult;
    /** Manually advances the watermark of a root dataset */
    setWatermark: SetWatermarkResult;
};

export type DatasetMutRenameArgs = {
    newName: Scalars["DatasetName"];
};

export type DatasetMutSetWatermarkArgs = {
    watermark: Scalars["DateTime"];
};

export type DatasetPermissions = {
    __typename?: "DatasetPermissions";
    canCommit: Scalars["Boolean"];
    canDelete: Scalars["Boolean"];
    canRename: Scalars["Boolean"];
    canSchedule: Scalars["Boolean"];
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
    /** Creates a new empty dataset */
    createEmpty: CreateDatasetResult;
    /** Creates a new dataset from provided DatasetSnapshot manifest */
    createFromSnapshot: CreateDatasetFromSnapshotResult;
};

export type DatasetsMutByIdArgs = {
    datasetId: Scalars["DatasetID"];
};

export type DatasetsMutCreateEmptyArgs = {
    datasetAlias: Scalars["DatasetAlias"];
    datasetKind: DatasetKind;
};

export type DatasetsMutCreateFromSnapshotArgs = {
    snapshot: Scalars["String"];
    snapshotFormat: MetadataManifestFormat;
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

export type DisablePollingSource = {
    __typename?: "DisablePollingSource";
    dummy?: Maybe<Scalars["String"]>;
};

export type DisablePushSource = {
    __typename?: "DisablePushSource";
    sourceName: Scalars["String"];
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

export type EnvVar = {
    __typename?: "EnvVar";
    name: Scalars["String"];
    value?: Maybe<Scalars["String"]>;
};

export type EventTimeSource = EventTimeSourceFromMetadata | EventTimeSourceFromPath | EventTimeSourceFromSystemTime;

export type EventTimeSourceFromMetadata = {
    __typename?: "EventTimeSourceFromMetadata";
    dummy?: Maybe<Scalars["String"]>;
};

export type EventTimeSourceFromPath = {
    __typename?: "EventTimeSourceFromPath";
    pattern: Scalars["String"];
    timestampFormat?: Maybe<Scalars["String"]>;
};

export type EventTimeSourceFromSystemTime = {
    __typename?: "EventTimeSourceFromSystemTime";
    dummy?: Maybe<Scalars["String"]>;
};

export type ExecuteTransform = {
    __typename?: "ExecuteTransform";
    newCheckpoint?: Maybe<Checkpoint>;
    newData?: Maybe<DataSlice>;
    newWatermark?: Maybe<Scalars["DateTime"]>;
    prevCheckpoint?: Maybe<Scalars["Multihash"]>;
    prevOffset?: Maybe<Scalars["Int"]>;
    queryInputs: Array<ExecuteTransformInput>;
};

export type ExecuteTransformInput = {
    __typename?: "ExecuteTransformInput";
    datasetId: Scalars["DatasetID"];
    newBlockHash?: Maybe<Scalars["Multihash"]>;
    newOffset?: Maybe<Scalars["Int"]>;
    prevBlockHash?: Maybe<Scalars["Multihash"]>;
    prevOffset?: Maybe<Scalars["Int"]>;
};

export type FetchStep = FetchStepContainer | FetchStepFilesGlob | FetchStepMqtt | FetchStepUrl;

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

export type FetchStepMqtt = {
    __typename?: "FetchStepMqtt";
    host: Scalars["String"];
    password?: Maybe<Scalars["String"]>;
    port: Scalars["Int"];
    topics: Array<MqttTopicSubscription>;
    username?: Maybe<Scalars["String"]>;
};

export type FetchStepUrl = {
    __typename?: "FetchStepUrl";
    cache?: Maybe<SourceCaching>;
    eventTime?: Maybe<EventTimeSource>;
    headers?: Maybe<Array<RequestHeader>>;
    url: Scalars["String"];
};

export type FlightSqlDesc = {
    __typename?: "FlightSqlDesc";
    url: Scalars["String"];
};

export type Flow = {
    __typename?: "Flow";
    /** Flow config snapshot */
    configSnapshot?: Maybe<FlowConfigurationSnapshot>;
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
    /** Primary flow trigger */
    primaryTrigger: FlowTrigger;
    /** Start condition */
    startCondition?: Maybe<FlowStartCondition>;
    /** Status of the flow */
    status: FlowStatus;
    /** Associated tasks */
    tasks: Array<Task>;
    /** Timing records associated with the flow lifecycle */
    timing: FlowTimingRecords;
};

export type FlowAbortedResult = {
    __typename?: "FlowAbortedResult";
    message: Scalars["String"];
};

export type FlowConfiguration = {
    __typename?: "FlowConfiguration";
    batching?: Maybe<FlowConfigurationBatching>;
    compacting?: Maybe<FlowConfigurationCompacting>;
    paused: Scalars["Boolean"];
    schedule?: Maybe<FlowConfigurationSchedule>;
};

export type FlowConfigurationBatching = {
    __typename?: "FlowConfigurationBatching";
    maxBatchingInterval: TimeDelta;
    minRecordsToAwait: Scalars["Int"];
};

export type FlowConfigurationCompacting = CompactingFull | CompactingMetadataOnly;

export type FlowConfigurationCompactingRule = {
    __typename?: "FlowConfigurationCompactingRule";
    compactingRule: FlowConfigurationCompacting;
};

export type FlowConfigurationSchedule = Cron5ComponentExpression | TimeDelta;

export type FlowConfigurationScheduleRule = {
    __typename?: "FlowConfigurationScheduleRule";
    scheduleRule: FlowConfigurationSchedule;
};

export type FlowConfigurationSnapshot =
    | FlowConfigurationBatching
    | FlowConfigurationCompactingRule
    | FlowConfigurationScheduleRule;

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

export type FlowDatasetCompactedFailedError = {
    __typename?: "FlowDatasetCompactedFailedError";
    message: Scalars["String"];
    rootDataset: Dataset;
};

export type FlowDescription =
    | FlowDescriptionDatasetExecuteTransform
    | FlowDescriptionDatasetHardCompacting
    | FlowDescriptionDatasetPollingIngest
    | FlowDescriptionDatasetPushIngest
    | FlowDescriptionSystemGc;

export type FlowDescriptionDatasetExecuteTransform = {
    __typename?: "FlowDescriptionDatasetExecuteTransform";
    datasetId: Scalars["DatasetID"];
    transformResult?: Maybe<FlowDescriptionUpdateResult>;
};

export type FlowDescriptionDatasetHardCompacting = {
    __typename?: "FlowDescriptionDatasetHardCompacting";
    compactingResult?: Maybe<FlowDescriptionDatasetHardCompactingResult>;
    datasetId: Scalars["DatasetID"];
};

export type FlowDescriptionDatasetHardCompactingResult =
    | FlowDescriptionHardCompactingNothingToDo
    | FlowDescriptionHardCompactingSuccess;

export type FlowDescriptionDatasetPollingIngest = {
    __typename?: "FlowDescriptionDatasetPollingIngest";
    datasetId: Scalars["DatasetID"];
    ingestResult?: Maybe<FlowDescriptionUpdateResult>;
};

export type FlowDescriptionDatasetPushIngest = {
    __typename?: "FlowDescriptionDatasetPushIngest";
    datasetId: Scalars["DatasetID"];
    ingestResult?: Maybe<FlowDescriptionUpdateResult>;
    inputRecordsCount: Scalars["Int"];
    sourceName?: Maybe<Scalars["String"]>;
};

export type FlowDescriptionHardCompactingNothingToDo = {
    __typename?: "FlowDescriptionHardCompactingNothingToDo";
    dummy: Scalars["String"];
    message: Scalars["String"];
};

export type FlowDescriptionHardCompactingSuccess = {
    __typename?: "FlowDescriptionHardCompactingSuccess";
    newHead: Scalars["Multihash"];
    originalBlocksCount: Scalars["Int"];
    resultingBlocksCount: Scalars["Int"];
};

export type FlowDescriptionSystemGc = {
    __typename?: "FlowDescriptionSystemGC";
    dummy: Scalars["Boolean"];
};

export type FlowDescriptionUpdateResult = {
    __typename?: "FlowDescriptionUpdateResult";
    numBlocks: Scalars["Int"];
    numRecords: Scalars["Int"];
    updatedWatermark?: Maybe<Scalars["DateTime"]>;
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

export type FlowEventInitiated = FlowEvent & {
    __typename?: "FlowEventInitiated";
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
    trigger: FlowTrigger;
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
    task: Task;
    taskId: Scalars["TaskID"];
    taskStatus: TaskStatus;
};

export type FlowEventTriggerAdded = FlowEvent & {
    __typename?: "FlowEventTriggerAdded";
    eventId: Scalars["EventID"];
    eventTime: Scalars["DateTime"];
    trigger: FlowTrigger;
};

export type FlowFailedError = {
    __typename?: "FlowFailedError";
    reason: FlowFailedReason;
};

export type FlowFailedMessage = {
    __typename?: "FlowFailedMessage";
    message: Scalars["String"];
};

export type FlowFailedReason = FlowDatasetCompactedFailedError | FlowFailedMessage;

export type FlowIncompatibleDatasetKind = SetFlowBatchingConfigResult &
    SetFlowCompactingConfigResult &
    SetFlowConfigResult &
    TriggerFlowResult & {
        __typename?: "FlowIncompatibleDatasetKind";
        actualDatasetKind: DatasetKind;
        expectedDatasetKind: DatasetKind;
        message: Scalars["String"];
    };

export type FlowInvalidBatchingConfig = SetFlowBatchingConfigResult & {
    __typename?: "FlowInvalidBatchingConfig";
    message: Scalars["String"];
    reason: Scalars["String"];
};

export type FlowInvalidCompactingConfig = SetFlowCompactingConfigResult & {
    __typename?: "FlowInvalidCompactingConfig";
    message: Scalars["String"];
    reason: Scalars["String"];
};

export type FlowInvalidRunConfigurations = TriggerFlowResult & {
    __typename?: "FlowInvalidRunConfigurations";
    error: Scalars["String"];
    message: Scalars["String"];
};

export type FlowNotFound = CancelScheduledTasksResult &
    GetFlowResult & {
        __typename?: "FlowNotFound";
        flowId: Scalars["FlowID"];
        message: Scalars["String"];
    };

export type FlowOutcome = FlowAbortedResult | FlowFailedError | FlowSuccessResult;

export type FlowPreconditionsNotMet = SetFlowBatchingConfigResult &
    SetFlowConfigResult &
    TriggerFlowResult & {
        __typename?: "FlowPreconditionsNotMet";
        message: Scalars["String"];
        preconditions: Scalars["String"];
    };

export type FlowRunConfiguration =
    | { batching: BatchingConditionInput; compacting?: never; schedule?: never }
    | { batching?: never; compacting: CompactingConditionInput; schedule?: never }
    | { batching?: never; compacting?: never; schedule: ScheduleInput };

export type FlowStartCondition =
    | FlowStartConditionBatching
    | FlowStartConditionExecutor
    | FlowStartConditionSchedule
    | FlowStartConditionThrottling;

export type FlowStartConditionBatching = {
    __typename?: "FlowStartConditionBatching";
    accumulatedRecordsCount: Scalars["Int"];
    activeBatchingRule: FlowConfigurationBatching;
    batchingDeadline: Scalars["DateTime"];
    watermarkModified: Scalars["Boolean"];
};

export type FlowStartConditionExecutor = {
    __typename?: "FlowStartConditionExecutor";
    taskId: Scalars["TaskID"];
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
    /**
     * Recorded time of finish (successful or failed after retry) or abortion
     * (Finished state seen at least once)
     */
    finishedAt?: Maybe<Scalars["DateTime"]>;
    /** Recorded start of running (Running state seen at least once) */
    runningSince?: Maybe<Scalars["DateTime"]>;
};

export type FlowTrigger = FlowTriggerAutoPolling | FlowTriggerInputDatasetFlow | FlowTriggerManual | FlowTriggerPush;

export type FlowTriggerAutoPolling = {
    __typename?: "FlowTriggerAutoPolling";
    dummy: Scalars["Boolean"];
};

export type FlowTriggerInputDatasetFlow = {
    __typename?: "FlowTriggerInputDatasetFlow";
    dataset: Dataset;
    flowId: Scalars["FlowID"];
    flowType: DatasetFlowType;
};

export type FlowTriggerManual = {
    __typename?: "FlowTriggerManual";
    initiator: Account;
};

export type FlowTriggerPush = {
    __typename?: "FlowTriggerPush";
    dummy: Scalars["Boolean"];
};

export type FlowTypeIsNotSupported = SetFlowBatchingConfigResult &
    SetFlowCompactingConfigResult &
    SetFlowConfigResult & {
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
    | { account: Scalars["AccountName"]; system?: never }
    | { account?: never; system: Scalars["Boolean"] };

export type JdbcDesc = {
    __typename?: "JdbcDesc";
    url: Scalars["String"];
};

export type KafkaProtocolDesc = {
    __typename?: "KafkaProtocolDesc";
    url: Scalars["String"];
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

export type MergeStrategy = MergeStrategyAppend | MergeStrategyLedger | MergeStrategySnapshot;

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

export enum MetadataManifestFormat {
    Yaml = "YAML",
}

export type MetadataManifestMalformed = CommitResult &
    CreateDatasetFromSnapshotResult & {
        __typename?: "MetadataManifestMalformed";
        message: Scalars["String"];
    };

export type MetadataManifestUnsupportedVersion = CommitResult &
    CreateDatasetFromSnapshotResult & {
        __typename?: "MetadataManifestUnsupportedVersion";
        message: Scalars["String"];
    };

export enum MqttQos {
    AtLeastOnce = "AT_LEAST_ONCE",
    AtMostOnce = "AT_MOST_ONCE",
    ExactlyOnce = "EXACTLY_ONCE",
}

export type MqttTopicSubscription = {
    __typename?: "MqttTopicSubscription";
    path: Scalars["String"];
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
     * Dataset-related functionality group.
     *
     * Datasets are historical streams of events recorded under a certain
     * schema.
     */
    datasets: DatasetsMut;
    /**
     * Tasks-related functionality group.
     *
     * Tasks are units of work scheduled and executed by the system to query
     * and process data.
     */
    tasks: TasksMut;
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

export type OffsetInterval = {
    __typename?: "OffsetInterval";
    end: Scalars["Int"];
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

export type PostgreSqlDesl = {
    __typename?: "PostgreSqlDesl";
    url: Scalars["String"];
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
     * Task-related functionality group.
     *
     * Tasks are units of scheduling that can perform many functions like
     * ingesting new data, running dataset transformations, answering ad-hoc
     * queries etc.
     */
    tasks: Tasks;
};

export enum QueryDialect {
    SqlDataFusion = "SQL_DATA_FUSION",
    SqlFlink = "SQL_FLINK",
    SqlRisingWave = "SQL_RISING_WAVE",
    SqlSpark = "SQL_SPARK",
}

export type ReadStep =
    | ReadStepCsv
    | ReadStepEsriShapefile
    | ReadStepGeoJson
    | ReadStepJson
    | ReadStepNdGeoJson
    | ReadStepNdJson
    | ReadStepParquet;

export type ReadStepCsv = {
    __typename?: "ReadStepCsv";
    dateFormat?: Maybe<Scalars["String"]>;
    encoding?: Maybe<Scalars["String"]>;
    escape?: Maybe<Scalars["String"]>;
    header?: Maybe<Scalars["Boolean"]>;
    inferSchema?: Maybe<Scalars["Boolean"]>;
    nullValue?: Maybe<Scalars["String"]>;
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

export type ReadStepJson = {
    __typename?: "ReadStepJson";
    dateFormat?: Maybe<Scalars["String"]>;
    encoding?: Maybe<Scalars["String"]>;
    schema?: Maybe<Array<Scalars["String"]>>;
    subPath?: Maybe<Scalars["String"]>;
    timestampFormat?: Maybe<Scalars["String"]>;
};

export type ReadStepNdGeoJson = {
    __typename?: "ReadStepNdGeoJson";
    schema?: Maybe<Array<Scalars["String"]>>;
};

export type ReadStepNdJson = {
    __typename?: "ReadStepNdJson";
    dateFormat?: Maybe<Scalars["String"]>;
    encoding?: Maybe<Scalars["String"]>;
    schema?: Maybe<Array<Scalars["String"]>>;
    timestampFormat?: Maybe<Scalars["String"]>;
};

export type ReadStepParquet = {
    __typename?: "ReadStepParquet";
    schema?: Maybe<Array<Scalars["String"]>>;
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

export type RequestHeader = {
    __typename?: "RequestHeader";
    name: Scalars["String"];
    value: Scalars["String"];
};

export type RestProtocolDesc = {
    __typename?: "RestProtocolDesc";
    pushUrl: Scalars["String"];
    queryUrl: Scalars["String"];
    tailUrl: Scalars["String"];
};

export type ScheduleInput =
    | { cron5ComponentExpression: Scalars["String"]; timeDelta?: never }
    | { cron5ComponentExpression?: never; timeDelta: TimeDeltaInput };

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

export type SetDataSchema = {
    __typename?: "SetDataSchema";
    schema: DataSchema;
};

export type SetFlowBatchingConfigResult = {
    message: Scalars["String"];
};

export type SetFlowCompactingConfigResult = {
    message: Scalars["String"];
};

export type SetFlowConfigResult = {
    message: Scalars["String"];
};

export type SetFlowConfigSuccess = SetFlowBatchingConfigResult &
    SetFlowCompactingConfigResult &
    SetFlowConfigResult & {
        __typename?: "SetFlowConfigSuccess";
        config: FlowConfiguration;
        message: Scalars["String"];
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
    operationTypeColumn?: Maybe<Scalars["String"]>;
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
    dummy: Scalars["String"];
    message: Scalars["String"];
};

export type SetWatermarkUpdated = SetWatermarkResult & {
    __typename?: "SetWatermarkUpdated";
    message: Scalars["String"];
    newHead: Scalars["Multihash"];
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

export type SourceState = {
    __typename?: "SourceState";
    kind: Scalars["String"];
    sourceName: Scalars["String"];
    value: Scalars["String"];
};

export type SqlQueryStep = {
    __typename?: "SqlQueryStep";
    alias?: Maybe<Scalars["String"]>;
    query: Scalars["String"];
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

export type TaskConnection = {
    __typename?: "TaskConnection";
    edges: Array<TaskEdge>;
    /** A shorthand for `edges { node { ... } }` */
    nodes: Array<Task>;
    /** Page information */
    pageInfo: PageBasedInfo;
    /** Approximate number of total nodes */
    totalCount: Scalars["Int"];
};

export type TaskEdge = {
    __typename?: "TaskEdge";
    node: Task;
};

/** Describes a certain final outcome of the task */
export enum TaskOutcome {
    /** Task was cancelled by a user */
    Cancelled = "CANCELLED",
    /** Task failed to complete */
    Failed = "FAILED",
    /** Task succeeded */
    Success = "SUCCESS",
}

/** Life-cycle status of a task */
export enum TaskStatus {
    /** Task has reached a certain final outcome (see [TaskOutcome]) */
    Finished = "FINISHED",
    /** Task is waiting for capacity to be allocated to it */
    Queued = "QUEUED",
    /** Task is being executed */
    Running = "RUNNING",
}

export type Tasks = {
    __typename?: "Tasks";
    /** Returns current state of a given task */
    getTask?: Maybe<Task>;
    /**
     * Returns states of tasks associated with a given dataset ordered by
     * creation time from newest to oldest
     */
    listTasksByDataset: TaskConnection;
};

export type TasksGetTaskArgs = {
    taskId: Scalars["TaskID"];
};

export type TasksListTasksByDatasetArgs = {
    datasetId: Scalars["DatasetID"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
};

export type TasksMut = {
    __typename?: "TasksMut";
    /** Requests cancellation of the specified task */
    cancelTask: Task;
    /**
     * Schedules a task to update the specified dataset by performing polling
     * ingest or a derivative transformation
     */
    createProbeTask: Task;
    /**
     * Schedules a task to update the specified dataset by performing polling
     * ingest or a derivative transformation
     */
    createUpdateDatasetTask: Task;
};

export type TasksMutCancelTaskArgs = {
    taskId: Scalars["TaskID"];
};

export type TasksMutCreateProbeTaskArgs = {
    busyTimeMs?: InputMaybe<Scalars["Int"]>;
    datasetId?: InputMaybe<Scalars["DatasetID"]>;
    endWithOutcome?: InputMaybe<TaskOutcome>;
};

export type TasksMutCreateUpdateDatasetTaskArgs = {
    datasetId: Scalars["DatasetID"];
};

export type TemporalTable = {
    __typename?: "TemporalTable";
    name: Scalars["String"];
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

export type Transform = TransformSql;

export type TransformInput = {
    __typename?: "TransformInput";
    alias: Scalars["String"];
    dataset: Dataset;
    datasetRef: Scalars["DatasetRef"];
};

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

export type UpdateReadmeResult = {
    message: Scalars["String"];
};

export type WebSocketProtocolDesc = {
    __typename?: "WebSocketProtocolDesc";
    url: Scalars["String"];
};

export type AccountByNameQueryVariables = Exact<{
    accountName: Scalars["AccountName"];
}>;

export type AccountByNameQuery = {
    __typename?: "Query";
    accounts: { __typename?: "Accounts"; byName?: ({ __typename?: "Account" } & AccountFragment) | null };
};

export type DatasetFlowCompactingMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType: DatasetFlowType;
    compactingArgs: CompactingConditionInput;
}>;

export type DatasetFlowCompactingMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                configs: {
                    __typename?: "DatasetFlowConfigsMut";
                    setConfigCompacting:
                        | {
                              __typename?: "FlowIncompatibleDatasetKind";
                              message: string;
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                          }
                        | { __typename?: "FlowInvalidCompactingConfig"; reason: string; message: string }
                        | { __typename?: "FlowTypeIsNotSupported"; message: string }
                        | {
                              __typename?: "SetFlowConfigSuccess";
                              message: string;
                              config: {
                                  __typename?: "FlowConfiguration";
                                  compacting?:
                                      | { __typename?: "CompactingFull"; maxSliceSize: number; maxSliceRecords: number }
                                      | { __typename?: "CompactingMetadataOnly"; recursive: boolean }
                                      | null;
                              };
                          };
                };
            };
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
}>;

export type CreateEmptyDatasetMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        createEmpty:
            | { __typename?: "CreateDatasetResultNameCollision"; message: string }
            | { __typename?: "CreateDatasetResultSuccess"; message: string };
    };
};

export type CreateDatasetFromSnapshotMutationVariables = Exact<{
    snapshot: Scalars["String"];
}>;

export type CreateDatasetFromSnapshotMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        createFromSnapshot:
            | { __typename?: "CreateDatasetResultInvalidSnapshot"; message: string }
            | { __typename?: "CreateDatasetResultMissingInputs"; message: string }
            | { __typename?: "CreateDatasetResultNameCollision"; message: string }
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
                | { __typename?: "SetWatermarkUpToDate"; dummy: string; message: string }
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
    auth: { __typename?: "Auth"; enabledLoginMethods: Array<string> };
};

export type EnginesQueryVariables = Exact<{ [key: string]: never }>;

export type EnginesQuery = {
    __typename?: "Query";
    data: {
        __typename?: "DataQueries";
        knownEngines: Array<{ __typename?: "EngineDesc"; name: string; dialect: QueryDialect; latestImage: string }>;
    };
};

export type DatasetAllFlowsPausedQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
}>;

export type DatasetAllFlowsPausedQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            flows: { __typename?: "DatasetFlows"; configs: { __typename?: "DatasetFlowConfigs"; allPaused: boolean } };
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
                                            __typename?: "FlowEventAborted";
                                        } & FlowHistoryData_FlowEventAborted_Fragment)
                                      | ({
                                            __typename?: "FlowEventInitiated";
                                        } & FlowHistoryData_FlowEventInitiated_Fragment)
                                      | ({
                                            __typename?: "FlowEventStartConditionUpdated";
                                        } & FlowHistoryData_FlowEventStartConditionUpdated_Fragment)
                                      | ({
                                            __typename?: "FlowEventTaskChanged";
                                        } & FlowHistoryData_FlowEventTaskChanged_Fragment)
                                      | ({
                                            __typename?: "FlowEventTriggerAdded";
                                        } & FlowHistoryData_FlowEventTriggerAdded_Fragment)
                                  >;
                              } & FlowSummaryDataFragment;
                          };
                };
            };
        } | null;
    };
};

export type GetDatasetListFlowsQueryVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    page?: InputMaybe<Scalars["Int"]>;
    perPage?: InputMaybe<Scalars["Int"]>;
    filters?: InputMaybe<DatasetFlowFilters>;
}>;

export type GetDatasetListFlowsQuery = {
    __typename?: "Query";
    datasets: {
        __typename?: "Datasets";
        byId?: {
            __typename?: "Dataset";
            metadata: {
                __typename?: "DatasetMetadata";
                currentPollingSource?: {
                    __typename?: "SetPollingSource";
                    fetch:
                        | ({ __typename?: "FetchStepContainer" } & FetchStepContainerDataFragment)
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
            flows: {
                __typename?: "DatasetFlows";
                runs: {
                    __typename?: "DatasetFlowRuns";
                    listFlows: { __typename?: "FlowConnection" } & FlowConnectionDataFragment;
                };
            };
        } | null;
    };
};

export type DatasetPauseFlowsMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType?: InputMaybe<DatasetFlowType>;
}>;

export type DatasetPauseFlowsMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                configs: { __typename?: "DatasetFlowConfigsMut"; pauseFlows: boolean };
            };
        } | null;
    };
};

export type DatasetResumeFlowsMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType?: InputMaybe<DatasetFlowType>;
}>;

export type DatasetResumeFlowsMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                configs: { __typename?: "DatasetFlowConfigsMut"; resumeFlows: boolean };
            };
        } | null;
    };
};

export type DatasetTriggerFlowMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType: DatasetFlowType;
}>;

export type DatasetTriggerFlowMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                runs: {
                    __typename?: "DatasetFlowRunsMut";
                    triggerFlow:
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

export type FlowSummaryDataFragment = {
    __typename?: "Flow";
    flowId: string;
    status: FlowStatus;
    description:
        | {
              __typename?: "FlowDescriptionDatasetExecuteTransform";
              datasetId: string;
              transformResult?: {
                  __typename?: "FlowDescriptionUpdateResult";
                  numBlocks: number;
                  numRecords: number;
              } | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetHardCompacting";
              datasetId: string;
              compactingResult?:
                  | { __typename?: "FlowDescriptionHardCompactingNothingToDo"; message: string; dummy: string }
                  | {
                        __typename?: "FlowDescriptionHardCompactingSuccess";
                        originalBlocksCount: number;
                        resultingBlocksCount: number;
                        newHead: string;
                    }
                  | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetPollingIngest";
              datasetId: string;
              ingestResult?: {
                  __typename?: "FlowDescriptionUpdateResult";
                  numBlocks: number;
                  numRecords: number;
              } | null;
          }
        | {
              __typename?: "FlowDescriptionDatasetPushIngest";
              datasetId: string;
              sourceName?: string | null;
              inputRecordsCount: number;
              ingestResult?: {
                  __typename?: "FlowDescriptionUpdateResult";
                  numBlocks: number;
                  numRecords: number;
              } | null;
          }
        | { __typename?: "FlowDescriptionSystemGC"; dummy: boolean };
    initiator?: ({ __typename?: "Account" } & AccountFragment) | null;
    outcome?:
        | ({ __typename?: "FlowAbortedResult" } & FlowOutcomeData_FlowAbortedResult_Fragment)
        | ({ __typename?: "FlowFailedError" } & FlowOutcomeData_FlowFailedError_Fragment)
        | ({ __typename?: "FlowSuccessResult" } & FlowOutcomeData_FlowSuccessResult_Fragment)
        | null;
    timing: {
        __typename?: "FlowTimingRecords";
        awaitingExecutorSince?: string | null;
        runningSince?: string | null;
        finishedAt?: string | null;
    };
    startCondition?:
        | {
              __typename: "FlowStartConditionBatching";
              batchingDeadline: string;
              accumulatedRecordsCount: number;
              watermarkModified: boolean;
              activeBatchingRule: {
                  __typename?: "FlowConfigurationBatching";
                  minRecordsToAwait: number;
                  maxBatchingInterval: { __typename?: "TimeDelta" } & TimeDeltaDataFragment;
              };
          }
        | { __typename: "FlowStartConditionExecutor"; taskId: string }
        | { __typename: "FlowStartConditionSchedule"; wakeUpAt: string }
        | { __typename: "FlowStartConditionThrottling"; intervalSec: number; wakeUpAt: string; shiftedFrom: string }
        | null;
};

export type FlowConnectionDataFragment = {
    __typename?: "FlowConnection";
    totalCount: number;
    nodes: Array<{ __typename?: "Flow" } & FlowSummaryDataFragment>;
    pageInfo: { __typename?: "PageBasedInfo" } & DatasetPageInfoFragment;
    edges: Array<{ __typename?: "FlowEdge"; node: { __typename?: "Flow" } & FlowSummaryDataFragment }>;
};

type FlowHistoryData_FlowEventAborted_Fragment = { __typename: "FlowEventAborted"; eventId: string; eventTime: string };

type FlowHistoryData_FlowEventInitiated_Fragment = {
    __typename: "FlowEventInitiated";
    eventId: string;
    eventTime: string;
    trigger:
        | { __typename: "FlowTriggerAutoPolling" }
        | {
              __typename: "FlowTriggerInputDatasetFlow";
              flowId: string;
              flowType: DatasetFlowType;
              dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
          }
        | { __typename: "FlowTriggerManual"; initiator: { __typename?: "Account" } & AccountFragment }
        | { __typename: "FlowTriggerPush" };
};

type FlowHistoryData_FlowEventStartConditionUpdated_Fragment = {
    __typename: "FlowEventStartConditionUpdated";
    eventId: string;
    eventTime: string;
    startCondition:
        | {
              __typename: "FlowStartConditionBatching";
              batchingDeadline: string;
              accumulatedRecordsCount: number;
              watermarkModified: boolean;
              activeBatchingRule: {
                  __typename?: "FlowConfigurationBatching";
                  minRecordsToAwait: number;
                  maxBatchingInterval: { __typename?: "TimeDelta" } & TimeDeltaDataFragment;
              };
          }
        | { __typename: "FlowStartConditionExecutor"; taskId: string }
        | { __typename: "FlowStartConditionSchedule"; wakeUpAt: string }
        | { __typename: "FlowStartConditionThrottling"; intervalSec: number; wakeUpAt: string; shiftedFrom: string };
};

type FlowHistoryData_FlowEventTaskChanged_Fragment = {
    __typename: "FlowEventTaskChanged";
    taskId: string;
    taskStatus: TaskStatus;
    eventId: string;
    eventTime: string;
};

type FlowHistoryData_FlowEventTriggerAdded_Fragment = {
    __typename: "FlowEventTriggerAdded";
    eventId: string;
    eventTime: string;
    trigger:
        | { __typename: "FlowTriggerAutoPolling" }
        | {
              __typename: "FlowTriggerInputDatasetFlow";
              flowId: string;
              flowType: DatasetFlowType;
              dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
          }
        | { __typename: "FlowTriggerManual"; initiator: { __typename?: "Account" } & AccountFragment }
        | { __typename: "FlowTriggerPush" };
};

export type FlowHistoryDataFragment =
    | FlowHistoryData_FlowEventAborted_Fragment
    | FlowHistoryData_FlowEventInitiated_Fragment
    | FlowHistoryData_FlowEventStartConditionUpdated_Fragment
    | FlowHistoryData_FlowEventTaskChanged_Fragment
    | FlowHistoryData_FlowEventTriggerAdded_Fragment;

type FlowOutcomeData_FlowAbortedResult_Fragment = { __typename?: "FlowAbortedResult"; message: string };

type FlowOutcomeData_FlowFailedError_Fragment = {
    __typename?: "FlowFailedError";
    reason:
        | {
              __typename?: "FlowDatasetCompactedFailedError";
              message: string;
              rootDataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
          }
        | { __typename?: "FlowFailedMessage"; message: string };
};

type FlowOutcomeData_FlowSuccessResult_Fragment = { __typename?: "FlowSuccessResult"; message: string };

export type FlowOutcomeDataFragment =
    | FlowOutcomeData_FlowAbortedResult_Fragment
    | FlowOutcomeData_FlowFailedError_Fragment
    | FlowOutcomeData_FlowSuccessResult_Fragment;

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
        | ({ __typename?: "MergeStrategyLedger" } & MergeStrategyLedgerDataFragment)
        | ({ __typename?: "MergeStrategySnapshot" } & MergeStrategySnapshotDataFragment);
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
        | ({ __typename?: "MergeStrategyLedger" } & MergeStrategyLedgerDataFragment)
        | ({ __typename?: "MergeStrategySnapshot" } & MergeStrategySnapshotDataFragment);
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

export type MergeStrategyLedgerDataFragment = { __typename?: "MergeStrategyLedger"; primaryKey: Array<string> };

export type MergeStrategySnapshotDataFragment = {
    __typename?: "MergeStrategySnapshot";
    primaryKey: Array<string>;
    compareColumns?: Array<string> | null;
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

export type AccountBasicsFragment = { __typename?: "Account"; id: string; accountName: string };

export type AccountExtendedFragment = {
    __typename?: "Account";
    id: string;
    accountName: string;
    avatarUrl?: string | null;
};

export type AccountFragment = {
    __typename?: "Account";
    id: string;
    accountName: string;
    displayName: string;
    accountType: AccountType;
    avatarUrl?: string | null;
    isAdmin: boolean;
};

export type CurrentSourceFetchUrlFragment = {
    __typename?: "DatasetMetadata";
    currentPollingSource?: {
        __typename?: "SetPollingSource";
        fetch:
            | { __typename?: "FetchStepContainer" }
            | { __typename?: "FetchStepFilesGlob" }
            | { __typename?: "FetchStepMqtt"; host: string; port: number }
            | { __typename?: "FetchStepUrl"; url: string };
    } | null;
};

export type DataQueryResultSuccessViewFragment = {
    __typename?: "DataQueryResultSuccess";
    schema?: { __typename?: "DataSchema"; format: DataSchemaFormat; content: string } | null;
    data: { __typename?: "DataBatch"; format: DataBatchFormat; content: string };
};

export type DatasetBasicsFragment = {
    __typename?: "Dataset";
    id: string;
    kind: DatasetKind;
    name: string;
    alias: string;
    owner: { __typename?: "Account" } & AccountBasicsFragment;
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
                                                            { __typename?: "Dataset" } & DatasetLineageBasicsFragment
                                                        >;
                                                    } & CurrentSourceFetchUrlFragment;
                                                } & DatasetLineageBasicsFragment
                                            >;
                                        } & CurrentSourceFetchUrlFragment;
                                    } & DatasetLineageBasicsFragment
                                >;
                            } & CurrentSourceFetchUrlFragment;
                        } & DatasetLineageBasicsFragment
                    >;
                } & CurrentSourceFetchUrlFragment;
            } & DatasetLineageBasicsFragment
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
                                                            { __typename?: "Dataset" } & DatasetLineageBasicsFragment
                                                        >;
                                                    } & CurrentSourceFetchUrlFragment;
                                                } & DatasetLineageBasicsFragment
                                            >;
                                        } & CurrentSourceFetchUrlFragment;
                                    } & DatasetLineageBasicsFragment
                                >;
                            } & CurrentSourceFetchUrlFragment;
                        } & DatasetLineageBasicsFragment
                    >;
                } & CurrentSourceFetchUrlFragment;
            } & DatasetLineageBasicsFragment
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
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
    } & CurrentSourceFetchUrlFragment;
    owner: { __typename?: "Account"; avatarUrl?: string | null };
} & DatasetBasicsFragment;

export type DatasetMetadataSummaryFragment = {
    __typename?: "Dataset";
    metadata: {
        __typename?: "DatasetMetadata";
        currentWatermark?: string | null;
        currentInfo: { __typename?: "SetInfo" } & DatasetCurrentInfoFragment;
        currentLicense?: ({ __typename?: "SetLicense" } & LicenseFragment) | null;
        currentPollingSource?: ({ __typename?: "SetPollingSource" } & SetPollingSourceEventFragment) | null;
        currentTransform?: ({ __typename?: "SetTransform" } & DatasetTransformFragment) | null;
        currentSchema?: { __typename?: "DataSchema"; format: DataSchemaFormat; content: string } | null;
        currentVocab?: ({ __typename?: "SetVocab" } & SetVocabEventFragment) | null;
        currentPushSources: Array<{ __typename?: "AddPushSource" } & AddPushSourceEventFragment>;
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
        canView: boolean;
        canDelete: boolean;
        canRename: boolean;
        canCommit: boolean;
        canSchedule: boolean;
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
        currentDownstreamDependencies: Array<{ __typename?: "Dataset" } & DatasetBasicsFragment>;
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
        dataset: { __typename?: "Dataset" } & DatasetBasicsFragment;
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

export type LoginMutationVariables = Exact<{
    login_method: Scalars["String"];
    login_credentials_json: Scalars["String"];
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

export type DatasetFlowBatchingMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType: DatasetFlowType;
    paused: Scalars["Boolean"];
    batching: BatchingConditionInput;
}>;

export type DatasetFlowBatchingMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                configs: {
                    __typename?: "DatasetFlowConfigsMut";
                    setConfigBatching:
                        | {
                              __typename: "FlowIncompatibleDatasetKind";
                              message: string;
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                          }
                        | { __typename: "FlowInvalidBatchingConfig"; message: string; reason: string }
                        | { __typename: "FlowPreconditionsNotMet"; message: string; preconditions: string }
                        | { __typename: "FlowTypeIsNotSupported"; message: string }
                        | {
                              __typename: "SetFlowConfigSuccess";
                              message: string;
                              config: {
                                  __typename?: "FlowConfiguration";
                                  batching?: {
                                      __typename?: "FlowConfigurationBatching";
                                      minRecordsToAwait: number;
                                      maxBatchingInterval: { __typename?: "TimeDelta" } & TimeDeltaDataFragment;
                                  } | null;
                              };
                          };
                };
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
                              __typename?: "FlowConfiguration";
                              paused: boolean;
                              schedule?:
                                  | { __typename?: "Cron5ComponentExpression"; cron5ComponentExpression: string }
                                  | ({ __typename?: "TimeDelta" } & TimeDeltaDataFragment)
                                  | null;
                              batching?: {
                                  __typename?: "FlowConfigurationBatching";
                                  minRecordsToAwait: number;
                                  maxBatchingInterval: { __typename?: "TimeDelta" } & TimeDeltaDataFragment;
                              } | null;
                          } | null;
                      };
                  };
              } & DatasetBasicsFragment)
            | null;
    };
};

export type DatasetFlowScheduleMutationVariables = Exact<{
    datasetId: Scalars["DatasetID"];
    datasetFlowType: DatasetFlowType;
    paused: Scalars["Boolean"];
    schedule: ScheduleInput;
}>;

export type DatasetFlowScheduleMutation = {
    __typename?: "Mutation";
    datasets: {
        __typename?: "DatasetsMut";
        byId?: {
            __typename?: "DatasetMut";
            flows: {
                __typename?: "DatasetFlowsMut";
                configs: {
                    __typename?: "DatasetFlowConfigsMut";
                    setConfigSchedule:
                        | {
                              __typename: "FlowIncompatibleDatasetKind";
                              message: string;
                              expectedDatasetKind: DatasetKind;
                              actualDatasetKind: DatasetKind;
                          }
                        | { __typename: "FlowPreconditionsNotMet"; message: string }
                        | { __typename: "FlowTypeIsNotSupported"; message: string }
                        | {
                              __typename: "SetFlowConfigSuccess";
                              message: string;
                              config: {
                                  __typename?: "FlowConfiguration";
                                  schedule?:
                                      | { __typename?: "Cron5ComponentExpression"; cron5ComponentExpression: string }
                                      | ({ __typename?: "TimeDelta" } & TimeDeltaDataFragment)
                                      | null;
                              };
                          };
                };
            };
        } | null;
    };
};

export type TimeDeltaDataFragment = { __typename?: "TimeDelta"; every: number; unit: TimeUnit };

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

export const AccountFragmentDoc = gql`
    fragment Account on Account {
        id
        accountName
        displayName
        accountType
        avatarUrl
        isAdmin
    }
`;
export const AccountBasicsFragmentDoc = gql`
    fragment AccountBasics on Account {
        id
        accountName
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
    }
    ${AccountBasicsFragmentDoc}
`;
export const FlowOutcomeDataFragmentDoc = gql`
    fragment FlowOutcomeData on FlowOutcome {
        ... on FlowSuccessResult {
            message
        }
        ... on FlowFailedError {
            reason {
                ... on FlowFailedMessage {
                    message
                }
                ... on FlowDatasetCompactedFailedError {
                    message
                    rootDataset {
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
                datasetId
                ingestResult {
                    numBlocks
                    numRecords
                }
            }
            ... on FlowDescriptionDatasetPushIngest {
                datasetId
                sourceName
                inputRecordsCount
                ingestResult {
                    numBlocks
                    numRecords
                }
            }
            ... on FlowDescriptionDatasetExecuteTransform {
                datasetId
                transformResult {
                    numBlocks
                    numRecords
                }
            }
            ... on FlowDescriptionDatasetHardCompacting {
                datasetId
                compactingResult {
                    ... on FlowDescriptionHardCompactingSuccess {
                        originalBlocksCount
                        resultingBlocksCount
                        newHead
                    }
                    ... on FlowDescriptionHardCompactingNothingToDo {
                        message
                        dummy
                    }
                }
            }
            ... on FlowDescriptionSystemGC {
                dummy
            }
        }
        flowId
        status
        initiator {
            ...Account
        }
        outcome {
            ...FlowOutcomeData
        }
        timing {
            awaitingExecutorSince
            runningSince
            finishedAt
        }
        startCondition {
            __typename
            ... on FlowStartConditionThrottling {
                intervalSec
                wakeUpAt
                shiftedFrom
            }
            ... on FlowStartConditionBatching {
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
        edges {
            node {
                ...FlowSummaryData
            }
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
            trigger {
                __typename
                ... on FlowTriggerAutoPolling {
                    __typename
                }
                ... on FlowTriggerManual {
                    initiator {
                        ...Account
                    }
                }
                ... on FlowTriggerPush {
                    __typename
                }
                ... on FlowTriggerInputDatasetFlow {
                    dataset {
                        ...DatasetBasics
                    }
                    flowId
                    flowType
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
                ... on FlowStartConditionBatching {
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
        ... on FlowEventTaskChanged {
            __typename
            taskId
            taskStatus
        }
        ... on FlowEventTriggerAdded {
            trigger {
                __typename
                ... on FlowTriggerAutoPolling {
                    __typename
                }
                ... on FlowTriggerManual {
                    initiator {
                        ...Account
                    }
                }
                ... on FlowTriggerPush {
                    __typename
                }
                ... on FlowTriggerInputDatasetFlow {
                    dataset {
                        ...DatasetBasics
                    }
                    flowId
                    flowType
                }
            }
        }
    }
    ${AccountFragmentDoc}
    ${DatasetBasicsFragmentDoc}
    ${TimeDeltaDataFragmentDoc}
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
export const DatasetLineageFragmentDoc = gql`
    fragment DatasetLineage on Dataset {
        ...DatasetLineageBasics
        metadata {
            ...CurrentSourceFetchUrl
            currentUpstreamDependencies {
                ...DatasetLineageBasics
                metadata {
                    ...CurrentSourceFetchUrl
                    currentUpstreamDependencies {
                        ...DatasetLineageBasics
                        metadata {
                            ...CurrentSourceFetchUrl
                            currentUpstreamDependencies {
                                ...DatasetLineageBasics
                                metadata {
                                    ...CurrentSourceFetchUrl
                                    currentUpstreamDependencies {
                                        ...DatasetLineageBasics
                                        metadata {
                                            ...CurrentSourceFetchUrl
                                            currentUpstreamDependencies {
                                                ...DatasetLineageBasics
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
                ...DatasetLineageBasics
                metadata {
                    ...CurrentSourceFetchUrl
                    currentDownstreamDependencies {
                        ...DatasetLineageBasics
                        metadata {
                            ...CurrentSourceFetchUrl
                            currentDownstreamDependencies {
                                ...DatasetLineageBasics
                                metadata {
                                    ...CurrentSourceFetchUrl
                                    currentDownstreamDependencies {
                                        ...DatasetLineageBasics
                                        metadata {
                                            ...CurrentSourceFetchUrl
                                            currentDownstreamDependencies {
                                                ...DatasetLineageBasics
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
`;
export const DatasetCurrentInfoFragmentDoc = gql`
    fragment DatasetCurrentInfo on SetInfo {
        description
        keywords
    }
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
            canView
            canDelete
            canRename
            canCommit
            canSchedule
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
                ...DatasetBasics
            }
        }
    }
    ${DatasetBasicsFragmentDoc}
    ${DatasetCurrentInfoFragmentDoc}
    ${LicenseFragmentDoc}
`;
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
export const DatasetFlowCompactingDocument = gql`
    mutation datasetFlowCompacting(
        $datasetId: DatasetID!
        $datasetFlowType: DatasetFlowType!
        $compactingArgs: CompactingConditionInput!
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
                        setConfigCompacting(datasetFlowType: $datasetFlowType, compactingArgs: $compactingArgs) {
                            ... on SetFlowConfigSuccess {
                                message
                                config {
                                    compacting {
                                        ... on CompactingFull {
                                            maxSliceSize
                                            maxSliceRecords
                                        }
                                        ... on CompactingMetadataOnly {
                                            recursive
                                        }
                                    }
                                }
                            }
                            ... on FlowIncompatibleDatasetKind {
                                message
                                expectedDatasetKind
                                actualDatasetKind
                            }
                            ... on FlowTypeIsNotSupported {
                                message
                            }
                            ... on FlowInvalidCompactingConfig {
                                reason
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
export class DatasetFlowCompactingGQL extends Apollo.Mutation<
    DatasetFlowCompactingMutation,
    DatasetFlowCompactingMutationVariables
> {
    document = DatasetFlowCompactingDocument;

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
    mutation createEmptyDataset($datasetKind: DatasetKind!, $datasetAlias: DatasetAlias!) {
        datasets {
            createEmpty(datasetKind: $datasetKind, datasetAlias: $datasetAlias) {
                message
            }
        }
    }
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
    mutation createDatasetFromSnapshot($snapshot: String!) {
        datasets {
            createFromSnapshot(snapshot: $snapshot, snapshotFormat: YAML) {
                message
                ... on CreateDatasetResultSuccess {
                    dataset {
                        ...DatasetBasics
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
                        dummy
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
export const GetDatasetDataSqlRunDocument = gql`
    query getDatasetDataSQLRun($query: String!, $limit: Int!, $skip: Int) {
        data {
            query(
                query: $query
                queryDialect: SQL_DATA_FUSION
                schemaFormat: PARQUET_JSON
                dataFormat: JSON
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
            enabledLoginMethods
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
export const DatasetAllFlowsPausedDocument = gql`
    query datasetAllFlowsPaused($datasetId: DatasetID!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
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
export const GetDatasetListFlowsDocument = gql`
    query getDatasetListFlows($datasetId: DatasetID!, $page: Int, $perPage: Int, $filters: DatasetFlowFilters) {
        datasets {
            byId(datasetId: $datasetId) {
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
                flows {
                    runs {
                        listFlows(page: $page, perPage: $perPage, filters: $filters) {
                            ...FlowConnectionData
                        }
                    }
                }
            }
        }
    }
    ${FetchStepUrlDataFragmentDoc}
    ${FetchStepFilesGlobDataFragmentDoc}
    ${FetchStepContainerDataFragmentDoc}
    ${FlowConnectionDataFragmentDoc}
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
    mutation datasetPauseFlows($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
                        pauseFlows(datasetFlowType: $datasetFlowType)
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
    mutation datasetResumeFlows($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
                        resumeFlows(datasetFlowType: $datasetFlowType)
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
export const DatasetTriggerFlowDocument = gql`
    mutation datasetTriggerFlow($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType!) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    runs {
                        triggerFlow(datasetFlowType: $datasetFlowType) {
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
export class DatasetTriggerFlowGQL extends Apollo.Mutation<
    DatasetTriggerFlowMutation,
    DatasetTriggerFlowMutationVariables
> {
    document = DatasetTriggerFlowDocument;

    constructor(apollo: Apollo.Apollo) {
        super(apollo);
    }
}
export const LoginDocument = gql`
    mutation Login($login_method: String!, $login_credentials_json: String!) {
        auth {
            login(loginMethod: $login_method, loginCredentialsJson: $login_credentials_json) {
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
export const DatasetFlowBatchingDocument = gql`
    mutation datasetFlowBatching(
        $datasetId: DatasetID!
        $datasetFlowType: DatasetFlowType!
        $paused: Boolean!
        $batching: BatchingConditionInput!
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
                        setConfigBatching(datasetFlowType: $datasetFlowType, paused: $paused, batching: $batching) {
                            __typename
                            ... on SetFlowConfigSuccess {
                                message
                                config {
                                    batching {
                                        maxBatchingInterval {
                                            ...TimeDeltaData
                                        }
                                        minRecordsToAwait
                                    }
                                }
                            }
                            ... on FlowIncompatibleDatasetKind {
                                message
                                expectedDatasetKind
                                actualDatasetKind
                            }
                            ... on FlowInvalidBatchingConfig {
                                message
                                reason
                            }
                            ... on FlowPreconditionsNotMet {
                                message
                                preconditions
                            }
                            ... on FlowTypeIsNotSupported {
                                message
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
export class DatasetFlowBatchingGQL extends Apollo.Mutation<
    DatasetFlowBatchingMutation,
    DatasetFlowBatchingMutationVariables
> {
    document = DatasetFlowBatchingDocument;

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
                            paused
                            schedule {
                                ... on TimeDelta {
                                    ...TimeDeltaData
                                }
                                ... on Cron5ComponentExpression {
                                    cron5ComponentExpression
                                }
                            }
                            batching {
                                maxBatchingInterval {
                                    ...TimeDeltaData
                                }
                                minRecordsToAwait
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
export const DatasetFlowScheduleDocument = gql`
    mutation DatasetFlowSchedule(
        $datasetId: DatasetID!
        $datasetFlowType: DatasetFlowType!
        $paused: Boolean!
        $schedule: ScheduleInput!
    ) {
        datasets {
            byId(datasetId: $datasetId) {
                flows {
                    configs {
                        setConfigSchedule(datasetFlowType: $datasetFlowType, paused: $paused, schedule: $schedule) {
                            __typename
                            ... on SetFlowConfigSuccess {
                                message
                                config {
                                    schedule {
                                        ... on TimeDelta {
                                            ...TimeDeltaData
                                        }
                                        ... on Cron5ComponentExpression {
                                            cron5ComponentExpression
                                        }
                                    }
                                }
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
export class DatasetFlowScheduleGQL extends Apollo.Mutation<
    DatasetFlowScheduleMutation,
    DatasetFlowScheduleMutationVariables
> {
    document = DatasetFlowScheduleDocument;

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
