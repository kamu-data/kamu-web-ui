// THIS FILE IS GENERATED, DO NOT EDIT!
import { gql } from '@apollo/client/core';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Unique identifier of an access token */
  AccessTokenID: { input: string; output: string; }
  /** Account name to display */
  AccountDisplayName: { input: string; output: string; }
  /** Unique and stable identifier of an account (`did:...`) */
  AccountID: { input: string; output: string; }
  /** Unique symbolic name of an account */
  AccountName: { input: string; output: string; }
  /** Account password */
  AccountPassword: { input: string; output: string; }
  /** Base64-encoded binary data (url-safe, no padding) */
  Base64Usnp: { input: string; output: string; }
  /**
   * Path of a collection entry: rooted, slash-separated, with URL-encoded
   * elements (e.g. `/foo%20bar/baz`)
   */
  CollectionPath: { input: string; output: string; }
  /** ODF data schema in its JSON form */
  DataSchemaInput: { input: string; output: string; }
  /**
   * Dataset name, optionally prefixed with the owner account
   * (`account/dataset`)
   */
  DatasetAlias: { input: string; output: string; }
  /** Unique and stable identifier of a dataset (`did:odf:...`) */
  DatasetID: { input: string; output: string; }
  /** Name of a dataset, unique within its owner account */
  DatasetName: { input: string; output: string; }
  /** Reference to a local dataset by ID or alias */
  DatasetRef: { input: string; output: string; }
  /** Reference to a remote dataset by ID, alias or URL */
  DatasetRefRemote: { input: string; output: string; }
  /**
   * Implement the DateTime<Utc> scalar
   *
   * The input/output is a string in RFC3339 format.
   */
  DateTime: { input: string; output: string; }
  /** Code that identifies a device during the device authorization flow */
  DeviceCode: { input: string; output: string; }
  /** Decentralized identifier (DID) */
  Did: { input: string; output: string; }
  /**
   * Wallet address in did:pkh format.
   *
   * Example: did:pkh:eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a
   */
  DidPkh: { input: string; output: string; }
  /** Single-use nonce of a Sign-In with Ethereum message */
  Eip4361AuthNonce: { input: string; output: string; }
  /** Email address */
  Email: { input: string; output: string; }
  /** Identifier of a stored event */
  EventID: { input: string; output: string; }
  /** Hex-encoded EVM wallet address */
  EvmWalletAddress: { input: string; output: string; }
  ExtraAttributes: { input: string; output: string; }
  /** JSON object of user-defined fields with string, number or boolean values */
  ExtraData: { input: Record<string, any>; output: Record<string, any>; }
  /** Unique identifier of a flow */
  FlowID: { input: string; output: string; }
  /** A scalar that can represent any JSON value. */
  JSON: { input: string; output: string; }
  /** Self-describing hash in multibase encoding */
  Multihash: { input: string; output: string; }
  ResourceAnnotations: { input: string; output: string; }
  ResourceConditions: { input: string; output: string; }
  /** Unique and stable identifier of a resource */
  ResourceID: { input: string; output: string; }
  ResourceLabels: { input: string; output: string; }
  /** Name of a resource */
  ResourceName: { input: string; output: string; }
  /** Short name that selects a resource type (e.g. in `kind` filters) */
  ResourceSelectorName: { input: string; output: string; }
  /**
   * Resource type selector as authored: a selector name, an alias, a type
   * name or a schema URI
   */
  ResourceTypeSelectorRaw: { input: string; output: string; }
  /** Unique identifier of a task */
  TaskID: { input: string; output: string; }
  /** Name of a resource type */
  TypeName: { input: string; output: string; }
  /** URI of a resource type schema */
  TypeUri: { input: string; output: string; }
  /** Absolute URL */
  URL: { input: string; output: string; }
  /** Unsigned 64-bit integer, passed as a string to avoid precision loss */
  Uint64: { input: number; output: number; }
  /** URL is a String implementing the [URL Standard](http://url.spec.whatwg.org/) */
  Url: { input: string; output: string; }
  /** Type of event a webhook subscription delivers (e.g. `DATASET.REF.UPDATED`) */
  WebhookEventType: { input: string; output: string; }
  /** Unique identifier of a webhook subscription */
  WebhookSubscriptionID: { input: string; output: string; }
  /** Human-readable label of a webhook subscription */
  WebhookSubscriptionLabel: { input: string; output: string; }
};

/** A page of `ViewAccessToken` items */
export type AccessTokenConnection = {
  __typename?: 'AccessTokenConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<AccessTokenEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<ViewAccessToken>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `ViewAccessToken` item */
export type AccessTokenEdge = {
  __typename?: 'AccessTokenEdge';
  /** The item itself */
  node: ViewAccessToken;
};

/** User or organization account */
export type Account = {
  __typename?: 'Account';
  /**
   * Access to the access token management.
   * Available only to the account itself.
   */
  accessTokens: AccountAccessTokens;
  /**
   * Symbolic account name.
   * Visible to everyone.
   */
  accountName: Scalars['AccountName']['output'];
  /**
   * Account provider.
   * Visible to everyone.
   */
  accountProvider: AccountProvider;
  /**
   * Account type.
   * Visible to everyone.
   */
  accountType: AccountType;
  /**
   * Avatar URL.
   * Visible to everyone.
   */
  avatarUrl?: Maybe<Scalars['Url']['output']>;
  /**
   * Account name to display.
   * Visible to everyone.
   */
  displayName: Scalars['AccountDisplayName']['output'];
  /**
   * Email address.
   * Available only to the account itself.
   */
  email: Scalars['String']['output'];
  /**
   * Access to the flow configurations of this account.
   * Available only to the account itself and to administrators.
   */
  flows: AccountFlows;
  /**
   * Unique and stable identifier of this account.
   * Visible to everyone.
   */
  id: Scalars['AccountID']['output'];
  /**
   * Indicates the administrator status.
   * Visible only to the account itself and to administrators, `null` for
   * everyone else.
   */
  isAdmin?: Maybe<Scalars['Boolean']['output']>;
  /**
   * Returns datasets belonging to this account.
   * Lists only the datasets the caller is allowed to read.
   */
  ownedDatasets: DatasetConnection;
  /**
   * Returns account quotas.
   * Available only to the account itself and to administrators.
   */
  quotas: AccountQuotas;
  /**
   * Access to account usage statistic.
   * Available only to the account itself and to administrators.
   */
  usage: AccountUsage;
};


/** User or organization account */
export type AccountOwnedDatasetsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Access tokens of an account */
export type AccountAccessTokens = {
  __typename?: 'AccountAccessTokens';
  /** Lists access tokens of this account, including revoked ones */
  listAccessTokens: AccessTokenConnection;
};


/** Access tokens of an account */
export type AccountAccessTokensListAccessTokensArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Mutations managing access tokens of an account */
export type AccountAccessTokensMut = {
  __typename?: 'AccountAccessTokensMut';
  /** Creates a new access token with the given name for this account */
  createAccessToken: CreateTokenResult;
  /** Revokes the access token with the given ID */
  revokeAccessToken: RevokeResult;
};


/** Mutations managing access tokens of an account */
export type AccountAccessTokensMutCreateAccessTokenArgs = {
  tokenName: Scalars['String']['input'];
};


/** Mutations managing access tokens of an account */
export type AccountAccessTokensMutRevokeAccessTokenArgs = {
  tokenId: Scalars['AccessTokenID']['input'];
};

/** A page of `Account` items */
export type AccountConnection = {
  __typename?: 'AccountConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<AccountEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<Account>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** Change of an account's role in a dataset */
export type AccountDatasetRelationOperation = {
  /** Account whose role changes */
  accountId: Scalars['AccountID']['input'];
  /** Dataset the role applies to */
  datasetId: Scalars['DatasetID']['input'];
  /** Change to apply */
  operation: DatasetRoleOperation;
};

/** An edge wrapping a single `Account` item */
export type AccountEdge = {
  __typename?: 'AccountEdge';
  /** The item itself */
  node: Account;
};

/** Account was not created: a unique field value is already taken */
export type AccountFieldNonUnique = CreateAccountResult & {
  __typename?: 'AccountFieldNonUnique';
  /** Name of the field whose value is already taken */
  field: Scalars['String']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Filters for flows of an account's datasets */
export type AccountFlowFilters = {
  /** Only flows of these datasets, empty means all owned datasets */
  byDatasetIds: Array<Scalars['DatasetID']['input']>;
  /** Only flows started by the given initiator */
  byInitiator?: InputMaybe<InitiatorFilterInput>;
  /** Only flows of the given process kind */
  byProcessType?: InputMaybe<FlowProcessTypeFilterInput>;
  /** Only flows in one of these statuses */
  byStatus?: InputMaybe<Array<FlowStatus>>;
};

/** Flow process of an account: a dataset process or a webhook delivery */
export type AccountFlowProcessCard = DatasetFlowProcess | WebhookFlowSubProcess;

/** A page of `AccountFlowProcessCard` items */
export type AccountFlowProcessCardConnection = {
  __typename?: 'AccountFlowProcessCardConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<AccountFlowProcessCardEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<AccountFlowProcessCard>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `AccountFlowProcessCard` item */
export type AccountFlowProcessCardEdge = {
  __typename?: 'AccountFlowProcessCardEdge';
  /** The item itself */
  node: AccountFlowProcessCard;
};

/** Recurring flow processes of the datasets owned by an account */
export type AccountFlowProcesses = {
  __typename?: 'AccountFlowProcesses';
  /** Page of dataset and webhook delivery processes together */
  allCards: AccountFlowProcessCardConnection;
  /** State counts of dataset and webhook delivery processes together */
  fullRollup: FlowProcessGroupRollup;
  /** Page of dataset ingest and transform processes */
  primaryCards: DatasetFlowProcessConnection;
  /** State counts of dataset ingest and transform processes */
  primaryRollup: FlowProcessGroupRollup;
  /** Page of webhook delivery processes */
  webhookCards: WebhookFlowSubProcessConnection;
  /** State counts of webhook delivery processes */
  webhookRollup: FlowProcessGroupRollup;
};


/** Recurring flow processes of the datasets owned by an account */
export type AccountFlowProcessesAllCardsArgs = {
  filters?: InputMaybe<FlowProcessFilters>;
  ordering?: InputMaybe<FlowProcessOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** Recurring flow processes of the datasets owned by an account */
export type AccountFlowProcessesFullRollupArgs = {
  filters?: InputMaybe<FlowProcessFilters>;
};


/** Recurring flow processes of the datasets owned by an account */
export type AccountFlowProcessesPrimaryCardsArgs = {
  filters?: InputMaybe<FlowProcessFilters>;
  ordering?: InputMaybe<FlowProcessOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** Recurring flow processes of the datasets owned by an account */
export type AccountFlowProcessesPrimaryRollupArgs = {
  filters?: InputMaybe<FlowProcessFilters>;
};


/** Recurring flow processes of the datasets owned by an account */
export type AccountFlowProcessesWebhookCardsArgs = {
  filters?: InputMaybe<FlowProcessFilters>;
  ordering?: InputMaybe<FlowProcessOrdering>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** Recurring flow processes of the datasets owned by an account */
export type AccountFlowProcessesWebhookRollupArgs = {
  filters?: InputMaybe<FlowProcessFilters>;
};

/** Flow run queries across datasets owned by an account */
export type AccountFlowRuns = {
  __typename?: 'AccountFlowRuns';
  /** Lists the account's datasets that have at least one flow */
  listDatasetsWithFlow: DatasetConnection;
  /** Lists flows of the account's datasets, paginated and optionally filtered */
  listFlows: FlowConnection;
};


/** Flow run queries across datasets owned by an account */
export type AccountFlowRunsListFlowsArgs = {
  filters?: InputMaybe<AccountFlowFilters>;
  order?: InputMaybe<FlowRunOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Flow queries scoped to an account */
export type AccountFlows = {
  __typename?: 'AccountFlows';
  /** Returns interface for flow processes summary queries */
  processes: AccountFlowProcesses;
  /** Returns interface for flow runs queries */
  runs: AccountFlowRuns;
};

/** Filters narrowing an account name lookup */
export type AccountLookupFilter = {
  /** Accounts to leave out of the results */
  excludeAccountsByIds: Array<Scalars['AccountID']['input']>;
};

/** Mutations of a single account */
export type AccountMut = {
  __typename?: 'AccountMut';
  /**
   * Access to the access token management of this account.
   * Available only to the account itself.
   */
  accessTokens: AccountAccessTokensMut;
  /** Convert to read-only accessor to an account */
  account: Account;
  /**
   * Delete a selected account.
   * Allowed only to the account itself and to administrators.
   */
  delete: DeleteAccountResult;
  /**
   * Reset password for a selected account.
   * Allowed only to the account itself and to administrators.
   */
  modifyPassword: ModifyPasswordResult;
  /**
   * Change password with confirmation.
   * Allowed only to the account itself and to administrators.
   */
  modifyPasswordWithConfirmation: ModifyPasswordResult;
  /**
   * Access to the mutable quotas of this account.
   * Changes are allowed only to administrators.
   */
  quotas: AccountQuotasMut;
  /**
   * Update account name.
   * Allowed only to the account itself and to administrators.
   */
  rename: RenameAccountResult;
  /**
   * Update account email.
   * Allowed only to the account itself and to administrators.
   */
  updateEmail: UpdateEmailResult;
};


/** Mutations of a single account */
export type AccountMutModifyPasswordArgs = {
  password: Scalars['AccountPassword']['input'];
};


/** Mutations of a single account */
export type AccountMutModifyPasswordWithConfirmationArgs = {
  newPassword: Scalars['AccountPassword']['input'];
  oldPassword: Scalars['AccountPassword']['input'];
};


/** Mutations of a single account */
export type AccountMutRenameArgs = {
  newName: Scalars['AccountName']['input'];
};


/** Mutations of a single account */
export type AccountMutUpdateEmailArgs = {
  newEmail: Scalars['Email']['input'];
};

/** Method an account uses to log in */
export enum AccountProvider {
  /** Login via GitHub OAuth */
  OauthGithub = 'OAUTH_GITHUB',
  /** Login with account name and password */
  Password = 'PASSWORD',
  /** Login by signing a message with an Ethereum wallet */
  Web3Wallet = 'WEB3_WALLET'
}

/** Quotas of an account */
export type AccountQuotas = {
  __typename?: 'AccountQuotas';
  /** User-level quotas */
  user: AccountQuotasUsage;
};

/** Mutations of account quotas */
export type AccountQuotasMut = {
  __typename?: 'AccountQuotasMut';
  /** Setting quotas at the account level. */
  setAccountQuotas: SetAccountQuotasResult;
};


/** Mutations of account quotas */
export type AccountQuotasMutSetAccountQuotasArgs = {
  quotas: SetAccountQuotasInput;
};

/** User-level quotas of an account */
export type AccountQuotasUsage = {
  __typename?: 'AccountQuotasUsage';
  /** User-level quotas */
  storage: AccountQuotasUsageStorage;
};

/** Storage quotas of an account */
export type AccountQuotasUsageStorage = {
  __typename?: 'AccountQuotasUsageStorage';
  /**
   * Total bytes limit for this account, or `null` when the storage of this
   * account is unlimited.
   */
  limitTotalBytes?: Maybe<Scalars['Int']['output']>;
};

/** Kind of account */
export enum AccountType {
  /** Account of an organization */
  Organization = 'ORGANIZATION',
  /** Account of an individual user */
  User = 'USER'
}

/** Resource usage of an account */
export type AccountUsage = {
  __typename?: 'AccountUsage';
  /** Aggregated storage statistics of datasets owned by the account */
  storage: TotalDatasetsStatistic;
};

/** Collaborator of a dataset with their role */
export type AccountWithRole = {
  __typename?: 'AccountWithRole';
  /** Collaborator account */
  account: Account;
  /** Role of the account in the dataset */
  role: DatasetAccessRole;
};

/** A page of `AccountWithRole` items */
export type AccountWithRoleConnection = {
  __typename?: 'AccountWithRoleConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<AccountWithRoleEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<AccountWithRole>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `AccountWithRole` item */
export type AccountWithRoleEdge = {
  __typename?: 'AccountWithRoleEdge';
  /** The item itself */
  node: AccountWithRole;
};

/** Account lookup queries */
export type Accounts = {
  __typename?: 'Accounts';
  /** Returns an account by its ID, if found */
  byId?: Maybe<Account>;
  /**
   * Returns accounts by their IDs.
   *
   * Order of results is guaranteed to match the inputs. Duplicate inputs
   * will results in duplicate results.
   */
  byIds: Array<Account>;
  /** Returns an account by its name, if found */
  byName?: Maybe<Account>;
  /** Returns accounts by their names */
  byNames: Array<Account>;
  /** Returns the account that is making the call (authorized subject) */
  me: Account;
};


/** Account lookup queries */
export type AccountsByIdArgs = {
  accountId: Scalars['AccountID']['input'];
};


/** Account lookup queries */
export type AccountsByIdsArgs = {
  accountIds: Array<Scalars['AccountID']['input']>;
  skipMissing: Scalars['Boolean']['input'];
};


/** Account lookup queries */
export type AccountsByNameArgs = {
  name: Scalars['AccountName']['input'];
};


/** Account lookup queries */
export type AccountsByNamesArgs = {
  accountNames: Array<Scalars['AccountName']['input']>;
  skipMissing: Scalars['Boolean']['input'];
};

/** Mutations of accounts */
export type AccountsMut = {
  __typename?: 'AccountsMut';
  /** Returns a mutable account by its id */
  byId?: Maybe<AccountMut>;
  /**
   * Returns mutable accounts by their IDs.
   *
   * Order of results is guaranteed to match the inputs. Duplicate inputs
   * will results in duplicate results.
   */
  byIds: Array<AccountMut>;
  /** Returns a mutable account by its name */
  byName?: Maybe<AccountMut>;
  /** Returns accounts by their names */
  byNames: Array<AccountMut>;
  /** Create a new account */
  createAccount: CreateAccountResult;
  /** Create wallet accounts */
  createWalletAccounts: CreateWalletAccountsResult;
  /** Returns the mutable account that is making the call (authorized subject) */
  me: AccountMut;
};


/** Mutations of accounts */
export type AccountsMutByIdArgs = {
  accountId: Scalars['AccountID']['input'];
};


/** Mutations of accounts */
export type AccountsMutByIdsArgs = {
  accountIds: Array<Scalars['AccountID']['input']>;
  skipMissing: Scalars['Boolean']['input'];
};


/** Mutations of accounts */
export type AccountsMutByNameArgs = {
  accountName: Scalars['AccountName']['input'];
};


/** Mutations of accounts */
export type AccountsMutByNamesArgs = {
  accountNames: Array<Scalars['AccountName']['input']>;
  skipMissing: Scalars['Boolean']['input'];
};


/** Mutations of accounts */
export type AccountsMutCreateAccountArgs = {
  accountName: Scalars['AccountName']['input'];
  email?: InputMaybe<Scalars['Email']['input']>;
};


/** Mutations of accounts */
export type AccountsMutCreateWalletAccountsArgs = {
  walletAddresses: Array<Scalars['DidPkh']['input']>;
};

/**
 * Indicates that data has been ingested into a root dataset.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/AddData
 */
export type AddData = {
  __typename?: 'AddData';
  /** ODF extensions. */
  extra?: Maybe<Scalars['ExtraAttributes']['output']>;
  /**
   * Describes checkpoint written during this transaction, if any. If an engine operation
   * resulted in no updates to the checkpoint, but checkpoint is still relevant for subsequent
   * runs - a hash of the previous checkpoint should be specified.
   */
  newCheckpoint?: Maybe<Checkpoint>;
  /** Describes output data written during this transaction, if any. */
  newData?: Maybe<DataSlice>;
  /**
   * The state of the source the data was added from to allow fast resuming. If the state did
   * not change but is still relevant for subsequent runs it should be carried, i.e. only the
   * last state per source is considered when resuming.
   */
  newSourceState?: Maybe<SourceState>;
  /**
   * Last watermark of the output data stream, if any. Initial blocks may not have watermarks,
   * but once watermark is set - all subsequent blocks should either carry the same watermark or
   * specify a new (greater) one. Thus, watermarks are monotonically non-decreasing.
   */
  newWatermark?: Maybe<Scalars['DateTime']['output']>;
  /** Hash of the checkpoint file used to restore ingestion state, if any. */
  prevCheckpoint?: Maybe<Scalars['Multihash']['output']>;
  /**
   * Last offset of the previous data slice, if any. Must be equal to the last non-empty
   * `newData.offsetInterval.end`.
   */
  prevOffset?: Maybe<Scalars['Uint64']['output']>;
};

/**
 * Describes how to ingest data into a root dataset from a certain logical source.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/AddPushSource
 */
export type AddPushSource = {
  __typename?: 'AddPushSource';
  /** Determines how newly-ingested data should be merged with existing history. */
  merge: MergeStrategy;
  /** Pre-processing query that shapes the data. */
  preprocess?: Maybe<Transform>;
  /** Defines how data is read into structured format. */
  read: ReadStep;
  /** Identifies the source within this dataset. */
  sourceName: Scalars['String']['output'];
};

/** Administrative queries, available only to administrators */
export type Admin = {
  __typename?: 'Admin';
  /** Checks that the caller has administrator access, returns "OK" */
  selfTest: Scalars['String']['output'];
};

/** Administrative mutations, available only to administrators */
export type AdminMut = {
  __typename?: 'AdminMut';
  /** Search index administration */
  search: AdminSearchMut;
};

/** Search index administration */
export type AdminSearchMut = {
  __typename?: 'AdminSearchMut';
  /** Drops and fully rebuilds the given search indices, all of them if none are given */
  resetSearchIndices: Scalars['String']['output'];
};


/** Search index administration */
export type AdminSearchMutResetSearchIndicesArgs = {
  entityNames?: InputMaybe<Array<SearchEntityName>>;
};

/** One manifest to apply as part of a batch */
export type ApplyManifestInput = {
  /** Format the manifest text is in */
  format: ResourceManifestFormat;
  /** Manifest text describing the desired resource state */
  manifest: Scalars['String']['input'];
};

/** Account-dataset relations were applied */
export type ApplyRolesMatrixResult = {
  __typename?: 'ApplyRolesMatrixResult';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/**
 * Embedded attachment item.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/AttachmentEmbedded
 */
export type AttachmentEmbedded = {
  __typename?: 'AttachmentEmbedded';
  /** Content of the attachment. */
  content: Scalars['String']['output'];
  /** Path to an attachment if it was materialized into a file. */
  path: Scalars['String']['output'];
};

/**
 * Defines the source of attachment files.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/Attachments
 */
export type Attachments = AttachmentsEmbedded;

/**
 * For attachments that are specified inline and are embedded in the metadata.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/Attachments#/$defs/Embedded
 */
export type AttachmentsEmbedded = {
  __typename?: 'AttachmentsEmbedded';
  /** List of embedded items. */
  items: Array<AttachmentEmbedded>;
};

/** Authentication and authorization queries */
export type Auth = {
  __typename?: 'Auth';
  /** Login methods enabled on this node */
  enabledProviders: Array<AccountProvider>;
  /** Dataset roles granted to the given accounts */
  relations: AuthRelationConnection;
};


/** Authentication and authorization queries */
export type AuthRelationsArgs = {
  accountIds: Array<Scalars['AccountID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Authentication mutations */
export type AuthMut = {
  __typename?: 'AuthMut';
  /** Returns the account that the given access token belongs to */
  accountDetails: Account;
  /** Logs in with the given provider credentials and issues an access token */
  login: LoginResponse;
  /** Web3-related functionality group */
  web3: AuthWeb3Mut;
};


/** Authentication mutations */
export type AuthMutAccountDetailsArgs = {
  accessToken: Scalars['String']['input'];
};


/** Authentication mutations */
export type AuthMutLoginArgs = {
  deviceCode?: InputMaybe<Scalars['DeviceCode']['input']>;
  loginCredentialsJson: Scalars['String']['input'];
  loginMethod: AccountProvider;
};

/** Role an account has in a dataset */
export type AuthRelation = {
  __typename?: 'AuthRelation';
  /** Account the role is granted to */
  account: Account;
  /** Dataset the role applies to */
  dataset: Dataset;
  /** Role of the account in the dataset */
  role: DatasetAccessRole;
};

/** A page of `AuthRelation` items */
export type AuthRelationConnection = {
  __typename?: 'AuthRelationConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<AuthRelationEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<AuthRelation>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `AuthRelation` item */
export type AuthRelationEdge = {
  __typename?: 'AuthRelationEdge';
  /** The item itself */
  node: AuthRelation;
};

/** Web3 wallet authentication mutations */
export type AuthWeb3Mut = {
  __typename?: 'AuthWeb3Mut';
  /** Issues a nonce for the wallet to sign in a Sign-In with Ethereum message */
  eip4361AuthNonce: Eip4361AuthNonceResponse;
};


/** Web3 wallet authentication mutations */
export type AuthWeb3MutEip4361AuthNonceArgs = {
  account: Scalars['EvmWalletAddress']['input'];
};

/** Resource handle found for one reference of a batch */
export type BatchResourceHandleSuccess = {
  __typename?: 'BatchResourceHandleSuccess';
  /** Handle of the resource the reference resolved to */
  handle: ResourceHandle;
  /** Zero-based position of the reference in the request */
  requestIndex: Scalars['Int']['output'];
};

/** Result of looking up resource handles by reference */
export type BatchResourceHandlesOutcome = BatchResourceHandlesResult | ResourceAccountResolutionProblem | ResourceUnsupportedSelectorProblem;

/** Resource handles found and references that could not be resolved */
export type BatchResourceHandlesResult = {
  __typename?: 'BatchResourceHandlesResult';
  /**
   * Handles found, one per resolved reference; with `includeDeleting` a
   * name may match several, which share its `requestIndex`
   */
  handles: Array<BatchResourceHandleSuccess>;
  /** References that could not be resolved */
  problems: Array<BatchResourceProblem>;
};

/** Manifest rendered for one reference of a batch */
export type BatchResourceManifestSuccess = {
  __typename?: 'BatchResourceManifestSuccess';
  /** Manifest of the resource the reference resolved to */
  manifest: ResourceRenderManifestResult;
  /** Zero-based position of the reference in the request */
  requestIndex: Scalars['Int']['output'];
};

/** Result of rendering manifests for resources looked up by reference */
export type BatchResourceManifestsOutcome = BatchResourceManifestsResult | ResourceAccountResolutionProblem | ResourceUnsupportedSelectorProblem;

/** Rendered manifests and references that could not be resolved */
export type BatchResourceManifestsResult = {
  __typename?: 'BatchResourceManifestsResult';
  /**
   * Manifests rendered, one per resolved reference; with `includeDeleting`
   * a name may match several, which share its `requestIndex`
   */
  manifests: Array<BatchResourceManifestSuccess>;
  /** References that could not be resolved */
  problems: Array<BatchResourceProblem>;
};

/** Reference of a batch that could not be resolved */
export type BatchResourceProblem = {
  __typename?: 'BatchResourceProblem';
  /** Why the reference could not be resolved */
  problem: ResourceLookupProblem;
  /** Zero-based position of the reference in the request */
  requestIndex: Scalars['Int']['output'];
};

/** Resource found for one reference of a batch */
export type BatchResourceSuccess = {
  __typename?: 'BatchResourceSuccess';
  /** Zero-based position of the reference in the request */
  requestIndex: Scalars['Int']['output'];
  /** Resource the reference resolved to */
  resource: Resource;
};

/** Result of looking up resources by reference */
export type BatchResourcesOutcome = BatchResourcesResult | ResourceAccountResolutionProblem | ResourceUnsupportedSelectorProblem;

/** Resources found and references that could not be resolved */
export type BatchResourcesResult = {
  __typename?: 'BatchResourcesResult';
  /** References that could not be resolved */
  problems: Array<BatchResourceProblem>;
  /**
   * Resources found, one per resolved reference; with `includeDeleting` a
   * name may match several, which share its `requestIndex`
   */
  resources: Array<BatchResourceSuccess>;
};

/** Named reference to a metadata block */
export type BlockRef = {
  __typename?: 'BlockRef';
  /** Hash of the block the reference points to */
  blockHash: Scalars['Multihash']['output'];
  /** Name of the reference, e.g. `head` */
  name: Scalars['String']['output'];
};

/** Build details of the running server; fields are null when unknown */
export type BuildInfo = {
  __typename?: 'BuildInfo';
  /** Version of the application */
  appVersion: Scalars['String']['output'];
  /** Time the binary was built */
  buildTimestamp?: Maybe<Scalars['String']['output']>;
  /** Cargo features enabled in the build */
  cargoFeatures?: Maybe<Scalars['String']['output']>;
  /** Compiler optimization level of the build */
  cargoOptLevel?: Maybe<Scalars['String']['output']>;
  /** Target triple the binary was built for */
  cargoTargetTriple?: Maybe<Scalars['String']['output']>;
  /** Git branch the binary was built from */
  gitBranch?: Maybe<Scalars['String']['output']>;
  /** Date of the git commit the binary was built from */
  gitCommitDate?: Maybe<Scalars['String']['output']>;
  /** Output of `git describe` for the built revision */
  gitDescribe?: Maybe<Scalars['String']['output']>;
  /** Git commit hash the binary was built from */
  gitSha?: Maybe<Scalars['String']['output']>;
  /** Release channel of the Rust compiler */
  rustcChannel?: Maybe<Scalars['String']['output']>;
  /** Commit hash of the Rust compiler */
  rustcCommitSha?: Maybe<Scalars['String']['output']>;
  /** Host target triple of the Rust compiler */
  rustcHostTriple?: Maybe<Scalars['String']['output']>;
  /** Version of the Rust compiler */
  rustcSemver?: Maybe<Scalars['String']['output']>;
};

/** Outcome of cancelling a flow run */
export type CancelFlowRunResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Flow run was cancelled */
export type CancelFlowRunSuccess = CancelFlowRunResult & {
  __typename?: 'CancelFlowRunSuccess';
  /** Flow after cancellation */
  flow: Flow;
  /** Human-readable success message */
  message: Scalars['String']['output'];
};

/**
 * Describes a checkpoint produced by an engine
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/Checkpoint
 */
export type Checkpoint = {
  __typename?: 'Checkpoint';
  /** Hash sum of the checkpoint file. */
  physicalHash: Scalars['Multihash']['output'];
  /** Size of checkpoint file in bytes. */
  size: Scalars['Uint64']['output'];
};

/** Kamu CLI commands to sync a dataset with this node */
export type CliProtocolDesc = {
  __typename?: 'CliProtocolDesc';
  /** Command that pulls the dataset from this node */
  pullCommand: Scalars['String']['output'];
  /** Command that pushes a local dataset to this node */
  pushCommand: Scalars['String']['output'];
};

/** Mutations that manage account access to datasets in bulk */
export type CollaborationMut = {
  __typename?: 'CollaborationMut';
  /** Batch application of relations between accounts and datasets */
  applyAccountDatasetRelations: ApplyRolesMatrixResult;
};


/** Mutations that manage account access to datasets in bulk */
export type CollaborationMutApplyAccountDatasetRelationsArgs = {
  operations: Array<AccountDatasetRelationOperation>;
};

/** Collection archetype view of a dataset: a set of entries linking to other datasets by path */
export type Collection = {
  __typename?: 'Collection';
  /**
   * State projection of the state of a collection at the specified point in
   * time
   */
  asOf: CollectionProjection;
  /** Latest state projection of the state of a collection */
  latest: CollectionProjection;
};


/** Collection archetype view of a dataset: a set of entries linking to other datasets by path */
export type CollectionAsOfArgs = {
  blockHash: Scalars['Multihash']['input'];
};

/** Entry of a collection that links a path to a dataset */
export type CollectionEntry = {
  __typename?: 'CollectionEntry';
  /** Resolves the reference to linked dataset */
  asDataset?: Maybe<Dataset>;
  /** Event time when this entry was created */
  eventTime: Scalars['DateTime']['output'];
  /** Extra data associated with this entry */
  extraData: Scalars['ExtraData']['output'];
  /**
   * File system-like path
   * Rooted, separated by forward slashes, with elements URL-encoded
   * (e.g. `/foo%20bar/baz`)
   */
  path: Scalars['CollectionPath']['output'];
  /** DID of the linked dataset */
  ref: Scalars['DatasetID']['output'];
  /** System time when this entry was created */
  systemTime: Scalars['DateTime']['output'];
};

/** A page of `CollectionEntry` items */
export type CollectionEntryConnection = {
  __typename?: 'CollectionEntryConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<CollectionEntryEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<CollectionEntry>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `CollectionEntry` item */
export type CollectionEntryEdge = {
  __typename?: 'CollectionEntryEdge';
  /** The item itself */
  node: CollectionEntry;
};

/** Collection entry to add */
export type CollectionEntryInput = {
  /** Json object containing extra column values */
  extraData?: InputMaybe<Scalars['ExtraData']['input']>;
  /** Entry path */
  path: Scalars['CollectionPath']['input'];
  /** DID of the linked dataset */
  ref: Scalars['DatasetID']['input'];
};

/** Mutations of a collection dataset */
export type CollectionMut = {
  __typename?: 'CollectionMut';
  /** Links new entry to this collection */
  addEntry: CollectionUpdateResult;
  /** Moves or renames an entry */
  moveEntry: CollectionUpdateResult;
  /** Remove an entry from this collection */
  removeEntry: CollectionUpdateResult;
  /** Execute multiple add / move / unlink operations as a single transaction */
  updateEntries: CollectionUpdateResult;
};


/** Mutations of a collection dataset */
export type CollectionMutAddEntryArgs = {
  entry: CollectionEntryInput;
  expectedHead?: InputMaybe<Scalars['Multihash']['input']>;
};


/** Mutations of a collection dataset */
export type CollectionMutMoveEntryArgs = {
  expectedHead?: InputMaybe<Scalars['Multihash']['input']>;
  extraData?: InputMaybe<Scalars['ExtraData']['input']>;
  pathFrom: Scalars['CollectionPath']['input'];
  pathTo: Scalars['CollectionPath']['input'];
};


/** Mutations of a collection dataset */
export type CollectionMutRemoveEntryArgs = {
  expectedHead?: InputMaybe<Scalars['Multihash']['input']>;
  path: Scalars['CollectionPath']['input'];
};


/** Mutations of a collection dataset */
export type CollectionMutUpdateEntriesArgs = {
  expectedHead?: InputMaybe<Scalars['Multihash']['input']>;
  operations: Array<CollectionUpdateInput>;
};

/** State of a collection at a specific point in its history */
export type CollectionProjection = {
  __typename?: 'CollectionProjection';
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


/** State of a collection at a specific point in its history */
export type CollectionProjectionEntriesArgs = {
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pathPrefix?: InputMaybe<Scalars['CollectionPath']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** State of a collection at a specific point in its history */
export type CollectionProjectionEntriesByRefArgs = {
  refs: Array<Scalars['DatasetID']['input']>;
};


/** State of a collection at a specific point in its history */
export type CollectionProjectionEntryArgs = {
  path: Scalars['CollectionPath']['input'];
};

/** Dataset head did not match the expected one, likely due to a concurrent update */
export type CollectionUpdateErrorCasFailed = CollectionUpdateResult & {
  __typename?: 'CollectionUpdateErrorCasFailed';
  /** Current head block hash of the dataset, null if it has none */
  actualHead?: Maybe<Scalars['Multihash']['output']>;
  /** Head block hash the caller expected */
  expectedHead: Scalars['Multihash']['output'];
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Entry referenced by an operation does not exist */
export type CollectionUpdateErrorNotFound = CollectionUpdateResult & {
  __typename?: 'CollectionUpdateErrorNotFound';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Path that was not found */
  path: Scalars['CollectionPath']['output'];
};

/** Update would exceed the storage quota of the account */
export type CollectionUpdateErrorQuotaExceeded = CollectionUpdateResult & {
  __typename?: 'CollectionUpdateErrorQuotaExceeded';
  /** Size of the rejected data, in bytes; null if no quota is configured */
  incoming?: Maybe<Scalars['Int']['output']>;
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Storage limit, in bytes; null if no quota is configured */
  limit?: Maybe<Scalars['Int']['output']>;
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Storage already used, in bytes; null if no quota is configured */
  used?: Maybe<Scalars['Int']['output']>;
};

/** Single collection update operation; exactly one field must be set */
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

/** Adds an entry to the collection */
export type CollectionUpdateInputAdd = {
  /** Entry to add */
  entry: CollectionEntryInput;
};

/** Moves an entry to a new path */
export type CollectionUpdateInputMove = {
  /** Optionally update the extra data */
  extraData?: InputMaybe<Scalars['ExtraData']['input']>;
  /** Current path of the entry */
  pathFrom: Scalars['CollectionPath']['input'];
  /** New path of the entry */
  pathTo: Scalars['CollectionPath']['input'];
};

/** Removes an entry from the collection */
export type CollectionUpdateInputRemove = {
  /** Path of the entry to remove */
  path: Scalars['CollectionPath']['input'];
};

/** Outcome of updating collection entries */
export type CollectionUpdateResult = {
  /** Whether the operation succeeded */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Collection entries were updated */
export type CollectionUpdateSuccess = CollectionUpdateResult & {
  __typename?: 'CollectionUpdateSuccess';
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Always empty */
  message: Scalars['String']['output'];
  /** Hash of the metadata chain head after the update */
  newHead: Scalars['Multihash']['output'];
  /** Hash of the metadata chain head before the update */
  oldHead: Scalars['Multihash']['output'];
};

/** Operations did not change the collection */
export type CollectionUpdateUpToDate = CollectionUpdateResult & {
  __typename?: 'CollectionUpdateUpToDate';
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Always empty */
  message: Scalars['String']['output'];
};

/** Defines a dataset column */
export type ColumnInput = {
  /** Column name */
  name: Scalars['String']['input'];
  /** Column data type */
  type: DataTypeInput;
};

/** Outcome of committing an event to the metadata chain */
export type CommitResult = {
  /** Whether the operation succeeded */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Event could not be appended to the metadata chain */
export type CommitResultAppendError = CommitResult & UpdateReadmeResult & {
  __typename?: 'CommitResultAppendError';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Reason the append failed */
  message: Scalars['String']['output'];
};

/** Event was committed to the metadata chain */
export type CommitResultSuccess = CommitResult & UpdateReadmeResult & {
  __typename?: 'CommitResultSuccess';
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** Hash of the new chain head */
  newHead: Scalars['Multihash']['output'];
  /** Hash of the chain head before the commit, null if the chain was empty */
  oldHead?: Maybe<Scalars['Multihash']['output']>;
};

/** Outcome of comparing a remote metadata chain with the local one */
export type CompareChainsResult = CompareChainsResultError | CompareChainsResultStatus;

/** Metadata chains could not be compared */
export type CompareChainsResultError = {
  __typename?: 'CompareChainsResultError';
  /** Reason of the failure */
  reason: CompareChainsResultReason;
};

/** Reason the metadata chains could not be compared */
export type CompareChainsResultReason = {
  __typename?: 'CompareChainsResultReason';
  /** Description of the problem */
  message: Scalars['String']['output'];
};

/** Metadata chains were compared successfully */
export type CompareChainsResultStatus = {
  __typename?: 'CompareChainsResultStatus';
  /** State of the remote chain relative to the local one */
  message: CompareChainsStatus;
};

/** State of a remote metadata chain relative to the local one */
export enum CompareChainsStatus {
  /** Remote has blocks the local chain is missing */
  Ahead = 'AHEAD',
  /** Remote is missing blocks the local chain has */
  Behind = 'BEHIND',
  /** Chains have diverged or belong to different datasets */
  Diverged = 'DIVERGED',
  /** Both chains have the same head */
  Equal = 'EQUAL'
}

/**
 * Defines a compression algorithm.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/CompressionFormat
 */
export enum CompressionFormat {
  Gzip = 'GZIP',
  Zip = 'ZIP'
}

/** Access token was not created: the account already has a token with this name */
export type CreateAccessTokenResultDuplicate = CreateTokenResult & {
  __typename?: 'CreateAccessTokenResultDuplicate';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** Name that is already taken */
  tokenName: Scalars['String']['output'];
};

/** Access token was created */
export type CreateAccessTokenResultSuccess = CreateTokenResult & {
  __typename?: 'CreateAccessTokenResultSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** The created token */
  token: CreatedAccessToken;
};

/** Outcome of creating an account */
export type CreateAccountResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Account was created */
export type CreateAccountSuccess = CreateAccountResult & {
  __typename?: 'CreateAccountSuccess';
  /** The created account */
  account: Account;
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of creating a dataset from a snapshot */
export type CreateDatasetFromSnapshotResult = {
  /** Whether the operation succeeded */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of creating an empty dataset */
export type CreateDatasetResult = {
  /** Whether the operation succeeded */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Snapshot or the events in it are invalid */
export type CreateDatasetResultInvalidSnapshot = CreateDatasetFromSnapshotResult & {
  __typename?: 'CreateDatasetResultInvalidSnapshot';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Reason the snapshot was rejected */
  message: Scalars['String']['output'];
};

/** Derivative dataset references inputs that do not exist */
export type CreateDatasetResultMissingInputs = CreateDatasetFromSnapshotResult & {
  __typename?: 'CreateDatasetResultMissingInputs';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** References to the inputs that could not be resolved */
  missingInputs: Array<Scalars['String']['output']>;
};

/** Dataset with the requested name already exists */
export type CreateDatasetResultNameCollision = CreateDatasetFromSnapshotResult & CreateDatasetResult & {
  __typename?: 'CreateDatasetResultNameCollision';
  /** Owner account of the existing dataset, null in single-tenant mode */
  accountName?: Maybe<Scalars['AccountName']['output']>;
  /** Name that is already taken */
  datasetName: Scalars['DatasetName']['output'];
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Dataset was created */
export type CreateDatasetResultSuccess = CreateDatasetFromSnapshotResult & CreateDatasetResult & {
  __typename?: 'CreateDatasetResultSuccess';
  /** Created dataset */
  dataset: Dataset;
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of creating an access token */
export type CreateTokenResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of creating wallet accounts */
export type CreateWalletAccountsResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Wallet accounts exist for all given addresses */
export type CreateWalletAccountsSuccess = CreateWalletAccountsResult & {
  __typename?: 'CreateWalletAccountsSuccess';
  /** Accounts of the given wallets, including already existing ones */
  accounts: Array<Account>;
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of creating a webhook subscription */
export type CreateWebhookSubscriptionResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Webhook subscription was created */
export type CreateWebhookSubscriptionResultSuccess = CreateWebhookSubscriptionResult & {
  __typename?: 'CreateWebhookSubscriptionResultSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** Secret for verifying delivery signatures, returned only once */
  secret: Scalars['String']['output'];
  /** Unique identifier of the new subscription */
  subscriptionId: Scalars['String']['output'];
};

/** Newly created access token, including its secret value */
export type CreatedAccessToken = {
  __typename?: 'CreatedAccessToken';
  /** Access token account owner */
  account: Account;
  /** Composed original token */
  composed: Scalars['String']['output'];
  /** Unique identifier of the access token */
  id: Scalars['AccessTokenID']['output'];
  /** Name of the access token */
  name: Scalars['String']['output'];
};

/** Cron schedule of a trigger */
export type Cron5ComponentExpression = {
  __typename?: 'Cron5ComponentExpression';
  /** Cron expression: min hour dayOfMonth month dayOfWeek */
  cron5ComponentExpression: Scalars['String']['output'];
};

/** Batch of records encoded in the requested format */
export type DataBatch = {
  __typename?: 'DataBatch';
  /** Encoded records */
  content: Scalars['String']['output'];
  /** Format the content is encoded in */
  format: DataBatchFormat;
  /** Number of records in the batch */
  numRecords: Scalars['Int']['output'];
};

/** Encoding of the records in a data batch */
export enum DataBatchFormat {
  /** CSV with a header row */
  Csv = 'CSV',
  /**
   * Deprecated: Use `JSON_AOS` instead and expect it to become default in
   * future versions
   */
  Json = 'JSON',
  /** JSON array of arrays, one array of values per record */
  JsonAoa = 'JSON_AOA',
  /** JSON array of objects, one object per record */
  JsonAos = 'JSON_AOS',
  /** Deprecated: Use `ND_JSON` instead */
  JsonLd = 'JSON_LD',
  /** JSON object with an array of values per column */
  JsonSoa = 'JSON_SOA',
  /** Newline-delimited JSON, one object per line */
  NdJson = 'ND_JSON'
}

/** Queries that operate on data across datasets */
export type DataQueries = {
  __typename?: 'DataQueries';
  /** Lists engines known to the system and recommended for use */
  knownEngines: Array<EngineDesc>;
  /** Executes a specified query and returns its result */
  query: DataQueryResult;
};


/** Queries that operate on data across datasets */
export type DataQueriesQueryArgs = {
  dataFormat?: InputMaybe<DataBatchFormat>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
  queryDialect: QueryDialect;
  schemaFormat?: InputMaybe<DataSchemaFormat>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

/** Outcome of a data query */
export type DataQueryResult = DataQueryResultError | DataQueryResultSuccess;

/** Query could not be executed */
export type DataQueryResultError = {
  __typename?: 'DataQueryResultError';
  /** Category of the problem */
  errorKind: DataQueryResultErrorKind;
  /** Description of the problem */
  errorMessage: Scalars['String']['output'];
};

/** Category of a query error */
export enum DataQueryResultErrorKind {
  /** Query is malformed or refers to a dataset or block that does not exist */
  InvalidSql = 'INVALID_SQL'
}

/** Query executed successfully */
export type DataQueryResultSuccess = {
  __typename?: 'DataQueryResultSuccess';
  /** Records of the result */
  data: DataBatch;
  /**
   * Input datasets of the query and the blocks they were read at, allowing
   * the query to be reproduced
   */
  datasets: Array<DatasetState>;
  /** Maximum number of records the result was limited to */
  limit: Scalars['Int']['output'];
  /** Schema of the result */
  schema: DataSchema;
};

/** Schema of data rendered in the requested format */
export type DataSchema = {
  __typename?: 'DataSchema';
  /** Schema rendered in the format */
  content: Scalars['String']['output'];
  /** Format the content is rendered in */
  format: DataSchemaFormat;
};

/** Format a data schema is rendered in */
export enum DataSchemaFormat {
  /** Arrow schema as JSON */
  ArrowJson = 'ARROW_JSON',
  /** Open Data Fabric schema as JSON */
  OdfJson = 'ODF_JSON',
  /** Open Data Fabric schema as YAML */
  OdfYaml = 'ODF_YAML',
  /** Parquet schema in its message type text notation */
  Parquet = 'PARQUET',
  /** Parquet schema as JSON */
  ParquetJson = 'PARQUET_JSON'
}

/**
 * Describes a slice of data added to a dataset or produced via transformation
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/DataSlice
 */
export type DataSlice = {
  __typename?: 'DataSlice';
  /** Logical hash sum of the data in this slice. */
  logicalHash: Scalars['Multihash']['output'];
  /** Data slice produced by the transaction. */
  offsetInterval: OffsetInterval;
  /** Hash sum of the data part file. */
  physicalHash: Scalars['Multihash']['output'];
  /** Size of data file in bytes. */
  size: Scalars['Uint64']['output'];
};

/** Data type of a column */
export type DataTypeInput = {
  /** Defines type using DDL syntax */
  ddl: Scalars['String']['input'];
};

/** Dataset with its metadata, data and related information */
export type Dataset = {
  __typename?: 'Dataset';
  /** Returns dataset alias (user + name) */
  alias: Scalars['DatasetAlias']['output'];
  /** Downcast a dataset to a collection interface */
  asCollection?: Maybe<Collection>;
  /** Downcast a dataset to a versioned file interface */
  asVersionedFile?: Maybe<VersionedFile>;
  /** Access to the dataset collaboration data */
  collaboration: DatasetCollaboration;
  /** Creation time of the first metadata block in the chain */
  createdAt: Scalars['DateTime']['output'];
  /** Access to the data of the dataset */
  data: DatasetData;
  /** Various endpoints for interacting with data */
  endpoints: DatasetEndpoints;
  /** Access to the environment variable of this dataset */
  envVars: DatasetEnvVars;
  /** Access to the flow configurations of this dataset */
  flows: DatasetFlows;
  /** Quick access to `head` block hash */
  head: Scalars['Multihash']['output'];
  /** Unique identifier of the dataset */
  id: Scalars['DatasetID']['output'];
  /** Returns the kind of dataset (Root or Derivative) */
  kind: DatasetKind;
  /** Creation time of the most recent metadata block in the chain */
  lastUpdatedAt: Scalars['DateTime']['output'];
  /** Access to the metadata of the dataset */
  metadata: DatasetMetadata;
  /**
   * Symbolic name of the dataset.
   * Name can change over the dataset's lifetime. For unique identifier use
   * `id()`.
   */
  name: Scalars['DatasetName']['output'];
  /** Returns the user or organization that owns this dataset */
  owner: Account;
  /** Permissions of the current user */
  permissions: DatasetPermissions;
  /** Current user's role in relation to the dataset */
  role?: Maybe<DatasetAccessRole>;
  /** Returns the visibility of dataset */
  visibility: DatasetVisibilityOutput;
  /** Access to the dataset's webhook management functionality */
  webhooks: DatasetWebhooks;
};

/**
 * A dataset the caller may read, or only its ID when the dataset is missing
 * or not readable by the caller
 */
export type DatasetAccessResult = {
  /** Human-readable access status */
  message: Scalars['String']['output'];
};

/** Dataset was found and is readable by the caller */
export type DatasetAccessResultAccessible = DatasetAccessResult & {
  __typename?: 'DatasetAccessResultAccessible';
  /** Accessible dataset */
  dataset: Dataset;
  /** Human-readable access status */
  message: Scalars['String']['output'];
};

/** Dataset does not exist or is not readable by the caller */
export type DatasetAccessResultNotAccessible = DatasetAccessResult & {
  __typename?: 'DatasetAccessResultNotAccessible';
  /** Identifier of the requested dataset */
  id: Scalars['DatasetID']['output'];
  /** Human-readable access status */
  message: Scalars['String']['output'];
};

/** Role granting an account access to a dataset */
export enum DatasetAccessRole {
  /** Role allows modifying dataset data */
  Editor = 'EDITOR',
  /** Role to maintain the dataset */
  Maintainer = 'MAINTAINER',
  /** Role opening the possibility for read-only access */
  Reader = 'READER'
}

/** Well-known kind of a dataset that defines how its data is interpreted */
export enum DatasetArchetype {
  /** Set of entries linking paths to other datasets */
  Collection = 'COLLECTION',
  /** File whose every version is stored as a record */
  VersionedFile = 'VERSIONED_FILE'
}

/** Access sharing of a dataset with other accounts */
export type DatasetCollaboration = {
  __typename?: 'DatasetCollaboration';
  /** Accounts (and their roles) that have access to the dataset */
  accountRoles: AccountWithRoleConnection;
};


/** Access sharing of a dataset with other accounts */
export type DatasetCollaborationAccountRolesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Mutations that manage account access to a dataset */
export type DatasetCollaborationMut = {
  __typename?: 'DatasetCollaborationMut';
  /** Grant account access as the specified role for the dataset */
  setRole: SetRoleResult;
  /** Revoking account accesses for the dataset */
  unsetRoles: UnsetRoleResult;
};


/** Mutations that manage account access to a dataset */
export type DatasetCollaborationMutSetRoleArgs = {
  accountId: Scalars['AccountID']['input'];
  role: DatasetAccessRole;
};


/** Mutations that manage account access to a dataset */
export type DatasetCollaborationMutUnsetRolesArgs = {
  accountIds: Array<Scalars['AccountID']['input']>;
};

/** Permissions for managing access of other accounts to a dataset */
export type DatasetCollaborationPermissions = {
  __typename?: 'DatasetCollaborationPermissions';
  /** Whether the account can grant and revoke access to the dataset */
  canUpdate: Scalars['Boolean']['output'];
  /** Whether the account can see who has access to the dataset */
  canView: Scalars['Boolean']['output'];
};

/** A page of `Dataset` items */
export type DatasetConnection = {
  __typename?: 'DatasetConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<DatasetEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<Dataset>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** Data stored in a dataset and its statistics */
export type DatasetData = {
  __typename?: 'DatasetData';
  /** An estimated size of linked objects */
  estimatedLinkedObjectsSizeBytes: Scalars['Int']['output'];
  /**
   * An estimated size of data on disk not accounting for replication or
   * caching
   */
  estimatedSizeBytes: Scalars['Int']['output'];
  /** Total number of linked objects in this dataset */
  numLinkedObjects: Scalars['Int']['output'];
  /** Total number of records in this dataset */
  numRecordsTotal: Scalars['Int']['output'];
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
  /** An estimated size of all objects in dataset */
  totalSizeBytes: Scalars['Int']['output'];
};


/** Data stored in a dataset and its statistics */
export type DatasetDataTailArgs = {
  dataFormat?: InputMaybe<DataBatchFormat>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  schemaFormat?: InputMaybe<DataSchemaFormat>;
  skip?: InputMaybe<Scalars['Int']['input']>;
};

/** An edge wrapping a single `Dataset` item */
export type DatasetEdge = {
  __typename?: 'DatasetEdge';
  /** The item itself */
  node: Dataset;
};

/** Ways to access a dataset over the supported protocols */
export type DatasetEndpoints = {
  __typename?: 'DatasetEndpoints';
  /** Commands to pull and push the dataset with the kamu CLI */
  cli: CliProtocolDesc;
  /** Arrow Flight SQL endpoint */
  flightsql: FlightSqlDesc;
  /** JDBC connection URL */
  jdbc: JdbcDesc;
  /** Kafka protocol endpoint, currently a placeholder */
  kafka: KafkaProtocolDesc;
  /** `OData` API endpoints */
  odata: OdataProtocolDesc;
  /** PostgreSQL protocol endpoint, currently a placeholder */
  postgresql: PostgreSqlDesl;
  /** REST API endpoints for the dataset */
  rest: RestProtocolDesc;
  /** Link to the dataset page in the web UI */
  webLink: LinkProtocolDesc;
  /** WebSocket endpoint, currently a placeholder */
  websocket: WebSocketProtocolDesc;
};

/** Environment variables of a dataset */
export type DatasetEnvVars = {
  __typename?: 'DatasetEnvVars';
  /** Returns the value of a variable, decrypting it if it is secret */
  exposedValue: Scalars['String']['output'];
  /** Lists environment variables of the dataset */
  listEnvVariables: ViewDatasetEnvVarConnection;
};


/** Environment variables of a dataset */
export type DatasetEnvVarsExposedValueArgs = {
  datasetEnvVarKey: Scalars['String']['input'];
};


/** Environment variables of a dataset */
export type DatasetEnvVarsListEnvVariablesArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Mutations that manage environment variables of a dataset */
export type DatasetEnvVarsMut = {
  __typename?: 'DatasetEnvVarsMut';
  /** Deletes an environment variable by its key */
  deleteEnvVariable: DeleteDatasetEnvVarResult;
  /** Creates or updates an environment variable, optionally as a secret */
  upsertEnvVariable: UpsertDatasetEnvVarResult;
};


/** Mutations that manage environment variables of a dataset */
export type DatasetEnvVarsMutDeleteEnvVariableArgs = {
  key: Scalars['String']['input'];
};


/** Mutations that manage environment variables of a dataset */
export type DatasetEnvVarsMutUpsertEnvVariableArgs = {
  isSecret: Scalars['Boolean']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
};

/** Permissions for environment variables of a dataset */
export type DatasetEnvVarsPermissions = {
  __typename?: 'DatasetEnvVarsPermissions';
  /** Whether the account can change the environment variables */
  canUpdate: Scalars['Boolean']['output'];
  /** Whether the account can see the environment variables */
  canView: Scalars['Boolean']['output'];
};

/** Flow configuration queries of a dataset */
export type DatasetFlowConfigs = {
  __typename?: 'DatasetFlowConfigs';
  /** Returns defined configuration for a flow of specified type */
  byType?: Maybe<FlowConfiguration>;
};


/** Flow configuration queries of a dataset */
export type DatasetFlowConfigsByTypeArgs = {
  datasetFlowType: DatasetFlowType;
};

/** Mutations that change flow configurations of a dataset */
export type DatasetFlowConfigsMut = {
  __typename?: 'DatasetFlowConfigsMut';
  /** Sets the compaction flow configuration of a root dataset */
  setCompactionConfig: SetFlowConfigResult;
  /** Sets the ingest flow configuration of a root dataset */
  setIngestConfig: SetFlowConfigResult;
};


/** Mutations that change flow configurations of a dataset */
export type DatasetFlowConfigsMutSetCompactionConfigArgs = {
  compactionConfigInput: FlowConfigCompactionInput;
  retryPolicyInput?: InputMaybe<FlowRetryPolicyInput>;
};


/** Mutations that change flow configurations of a dataset */
export type DatasetFlowConfigsMutSetIngestConfigArgs = {
  ingestConfigInput: FlowConfigIngestInput;
  retryPolicyInput?: InputMaybe<FlowRetryPolicyInput>;
};

/** Filters for flows of a dataset */
export type DatasetFlowFilters = {
  /** Only flows started by the given initiator */
  byInitiator?: InputMaybe<InitiatorFilterInput>;
  /** Only flows of the given process kind */
  byProcessType?: InputMaybe<FlowProcessTypeFilterInput>;
  /** Only flows in one of these statuses */
  byStatus?: InputMaybe<Array<FlowStatus>>;
};

/** Recurring flow process of a dataset */
export type DatasetFlowProcess = {
  __typename?: 'DatasetFlowProcess';
  /** Dataset the process belongs to */
  dataset: Dataset;
  /** Kind of flow this process runs */
  flowType: DatasetFlowType;
  /** Health and timing of the process */
  summary: FlowProcessSummary;
};

/** A page of `DatasetFlowProcess` items */
export type DatasetFlowProcessConnection = {
  __typename?: 'DatasetFlowProcessConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<DatasetFlowProcessEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<DatasetFlowProcess>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `DatasetFlowProcess` item */
export type DatasetFlowProcessEdge = {
  __typename?: 'DatasetFlowProcessEdge';
  /** The item itself */
  node: DatasetFlowProcess;
};

/** Recurring flow processes of a dataset */
export type DatasetFlowProcesses = {
  __typename?: 'DatasetFlowProcesses';
  /**
   * Main update process: ingest for a root dataset, transform for a
   * derivative
   */
  primary: DatasetFlowProcess;
  /** Webhook delivery processes of subscriptions to this dataset */
  webhooks: WebhookFlowSubProcessGroup;
};

/** Flow run queries of a dataset */
export type DatasetFlowRuns = {
  __typename?: 'DatasetFlowRuns';
  /** Returns a flow of this dataset by its ID */
  getFlow: GetFlowResult;
  /** Lists accounts that have started flows of this dataset */
  listFlowInitiators: AccountConnection;
  /** Lists flows of this dataset, paginated and optionally filtered */
  listFlows: FlowConnection;
};


/** Flow run queries of a dataset */
export type DatasetFlowRunsGetFlowArgs = {
  flowId: Scalars['FlowID']['input'];
};


/** Flow run queries of a dataset */
export type DatasetFlowRunsListFlowsArgs = {
  filters?: InputMaybe<DatasetFlowFilters>;
  order?: InputMaybe<FlowRunOrder>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Mutations that trigger or cancel flow runs of a dataset */
export type DatasetFlowRunsMut = {
  __typename?: 'DatasetFlowRunsMut';
  /** Cancels a scheduled or running flow of this dataset */
  cancelFlowRun: CancelFlowRunResult;
  /** Manually triggers a compaction flow of a root dataset */
  triggerCompactionFlow: TriggerFlowResult;
  /** Manually triggers an ingest flow of a root dataset */
  triggerIngestFlow: TriggerFlowResult;
  /** Manually triggers a flow that resets the dataset head to an earlier block */
  triggerResetFlow: TriggerFlowResult;
  /** Manually triggers a flow that removes data and keeps only metadata */
  triggerResetToMetadataFlow: TriggerFlowResult;
  /** Manually triggers a transform flow of a derivative dataset */
  triggerTransformFlow: TriggerFlowResult;
};


/** Mutations that trigger or cancel flow runs of a dataset */
export type DatasetFlowRunsMutCancelFlowRunArgs = {
  flowId: Scalars['FlowID']['input'];
};


/** Mutations that trigger or cancel flow runs of a dataset */
export type DatasetFlowRunsMutTriggerCompactionFlowArgs = {
  compactionConfigInput?: InputMaybe<FlowConfigCompactionInput>;
};


/** Mutations that trigger or cancel flow runs of a dataset */
export type DatasetFlowRunsMutTriggerIngestFlowArgs = {
  ingestConfigInput?: InputMaybe<FlowConfigIngestInput>;
};


/** Mutations that trigger or cancel flow runs of a dataset */
export type DatasetFlowRunsMutTriggerResetFlowArgs = {
  resetConfigInput?: InputMaybe<FlowConfigResetInput>;
};

/** Flow trigger queries of a dataset */
export type DatasetFlowTriggers = {
  __typename?: 'DatasetFlowTriggers';
  /** Returns defined trigger for a flow of specified type */
  byType?: Maybe<FlowTrigger>;
};


/** Flow trigger queries of a dataset */
export type DatasetFlowTriggersByTypeArgs = {
  datasetFlowType: DatasetFlowType;
};

/** Mutations that manage flow triggers of a dataset */
export type DatasetFlowTriggersMut = {
  __typename?: 'DatasetFlowTriggersMut';
  /** Pauses the trigger of a flow type */
  pauseFlow: Scalars['Boolean']['output'];
  /** Pauses triggers of all flow types of the dataset */
  pauseFlows: Scalars['Boolean']['output'];
  /** Resumes the trigger of a flow type */
  resumeFlow: Scalars['Boolean']['output'];
  /** Resumes triggers of all flow types of the dataset */
  resumeFlows: Scalars['Boolean']['output'];
  /** Creates or replaces the trigger of a flow type */
  setTrigger: SetFlowTriggerResult;
};


/** Mutations that manage flow triggers of a dataset */
export type DatasetFlowTriggersMutPauseFlowArgs = {
  datasetFlowType: DatasetFlowType;
};


/** Mutations that manage flow triggers of a dataset */
export type DatasetFlowTriggersMutResumeFlowArgs = {
  datasetFlowType: DatasetFlowType;
};


/** Mutations that manage flow triggers of a dataset */
export type DatasetFlowTriggersMutSetTriggerArgs = {
  datasetFlowType: DatasetFlowType;
  triggerRuleInput: FlowTriggerRuleInput;
  triggerStopPolicyInput: FlowTriggerStopPolicyInput;
};

/** Kind of a flow that operates on a dataset */
export enum DatasetFlowType {
  /** Runs the transformation of a derivative dataset */
  ExecuteTransform = 'EXECUTE_TRANSFORM',
  /** Compacts data slices of a dataset */
  HardCompaction = 'HARD_COMPACTION',
  /** Ingests new data into a root dataset */
  Ingest = 'INGEST',
  /** Moves the dataset head to an earlier block, by default its seed */
  Reset = 'RESET',
  /** Drops the dataset's data while keeping its metadata */
  ResetToMetadata = 'RESET_TO_METADATA'
}

/** Flow queries scoped to a dataset */
export type DatasetFlows = {
  __typename?: 'DatasetFlows';
  /** Returns interface for flow configurations queries */
  configs: DatasetFlowConfigs;
  /** Returns interface for flow processes queries */
  processes: DatasetFlowProcesses;
  /** Returns interface for flow runs queries */
  runs: DatasetFlowRuns;
  /** Returns interface for flow triggers queries */
  triggers: DatasetFlowTriggers;
};

/** Flow mutations scoped to a dataset */
export type DatasetFlowsMut = {
  __typename?: 'DatasetFlowsMut';
  /** Flow configuration mutations */
  configs: DatasetFlowConfigsMut;
  /** Mutations that trigger or cancel flow runs */
  runs: DatasetFlowRunsMut;
  /** Flow trigger mutations */
  triggers: DatasetFlowTriggersMut;
};

/** Permissions for flows of a dataset */
export type DatasetFlowsPermissions = {
  __typename?: 'DatasetFlowsPermissions';
  /** Whether the account can trigger and configure the flows */
  canRun: Scalars['Boolean']['output'];
  /** Whether the account can see the flows and their history */
  canView: Scalars['Boolean']['output'];
};

/** Permissions for general management of a dataset */
export type DatasetGeneralPermissions = {
  __typename?: 'DatasetGeneralPermissions';
  /** Whether the account can delete the dataset */
  canDelete: Scalars['Boolean']['output'];
  /** Whether the account can rename the dataset */
  canRename: Scalars['Boolean']['output'];
  /** Whether the account can change the dataset visibility */
  canSetVisibility: Scalars['Boolean']['output'];
};

/**
 * Represents type of the dataset.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/DatasetKind
 */
export enum DatasetKind {
  Derivative = 'DERIVATIVE',
  Root = 'ROOT'
}

/** Metadata of a dataset and its current state derived from the metadata chain */
export type DatasetMetadata = {
  __typename?: 'DatasetMetadata';
  /** Access to the temporal metadata chain of the dataset */
  chain: MetadataChain;
  /**
   * Experimental: Current archetype as per `kamu.dev/archetype` annotation,
   * if any
   */
  currentArchetype?: Maybe<DatasetArchetype>;
  /** Current downstream dependencies of a dataset */
  currentDownstreamDependencies: Array<DatasetAccessResult>;
  /**
   * Number of direct downstream dependencies. Includes inaccessible ones only
   * for accounts that can maintain the dataset
   */
  currentDownstreamDependenciesCount: Scalars['Int']['output'];
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
  currentReadme?: Maybe<Scalars['String']['output']>;
  /** Latest data schema */
  currentSchema?: Maybe<DataSchema>;
  /** Current transformation used by the derivative dataset */
  currentTransform?: Maybe<SetTransform>;
  /** Current upstream dependencies of a dataset */
  currentUpstreamDependencies: Array<DatasetAccessResult>;
  /** Current vocabulary associated with the dataset */
  currentVocab?: Maybe<SetVocab>;
  /** Last recorded watermark */
  currentWatermark?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Blocks holding the currently effective events of the requested types,
   * as of the given head or the latest block
   */
  metadataProjection: Array<MetadataBlockExtended>;
  /** Sync statuses of push remotes */
  pushSyncStatuses: DatasetPushStatuses;
};


/** Metadata of a dataset and its current state derived from the metadata chain */
export type DatasetMetadataCurrentSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};


/** Metadata of a dataset and its current state derived from the metadata chain */
export type DatasetMetadataMetadataProjectionArgs = {
  eventTypes: Array<MetadataEventType>;
  head?: InputMaybe<Scalars['Multihash']['input']>;
};

/** Mutations of the dataset metadata */
export type DatasetMetadataMut = {
  __typename?: 'DatasetMetadataMut';
  /** Access to the mutable metadata chain of the dataset */
  chain: MetadataChainMut;
  /** Updates or clears the dataset readme */
  updateReadme: UpdateReadmeResult;
};


/** Mutations of the dataset metadata */
export type DatasetMetadataMutUpdateReadmeArgs = {
  content?: InputMaybe<Scalars['String']['input']>;
};

/** Permissions for metadata of a dataset */
export type DatasetMetadataPermissions = {
  __typename?: 'DatasetMetadataPermissions';
  /** Whether the account can commit new metadata events */
  canCommit: Scalars['Boolean']['output'];
};

/** Mutations of a single dataset */
export type DatasetMut = {
  __typename?: 'DatasetMut';
  /** Downcast a dataset to a collection interface */
  asCollection?: Maybe<CollectionMut>;
  /** Downcast a dataset to a versioned file interface */
  asVersionedFile?: Maybe<VersionedFileMut>;
  /** Access to collaboration management methods */
  collaboration: DatasetCollaborationMut;
  /** Convert to read-only accessor to a dataset */
  dataset: Dataset;
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


/** Mutations of a single dataset */
export type DatasetMutRenameArgs = {
  newName: Scalars['DatasetName']['input'];
};


/** Mutations of a single dataset */
export type DatasetMutSetVisibilityArgs = {
  visibility: DatasetVisibilityInput;
};


/** Mutations of a single dataset */
export type DatasetMutSetWatermarkArgs = {
  watermark: Scalars['DateTime']['input'];
};

/** Actions the current account is allowed to perform on a dataset */
export type DatasetPermissions = {
  __typename?: 'DatasetPermissions';
  /** Permissions for managing access of other accounts */
  collaboration: DatasetCollaborationPermissions;
  /** Permissions for dataset environment variables */
  envVars: DatasetEnvVarsPermissions;
  /** Permissions for dataset flows */
  flows: DatasetFlowsPermissions;
  /** Permissions for general dataset management */
  general: DatasetGeneralPermissions;
  /** Permissions for dataset metadata */
  metadata: DatasetMetadataPermissions;
  /** Permissions for dataset webhooks */
  webhooks: DatasetWebhooksPermissions;
};

/** Sync state of a dataset relative to one of its push remotes */
export type DatasetPushStatus = {
  __typename?: 'DatasetPushStatus';
  /** Remote dataset the local one is pushed to */
  remote: Scalars['DatasetRefRemote']['output'];
  /** Result of comparing the remote metadata chain with the local one */
  result: CompareChainsResult;
};

/** Sync states of a dataset relative to all its push remotes */
export type DatasetPushStatuses = {
  __typename?: 'DatasetPushStatuses';
  /** Sync state per push remote */
  statuses: Array<DatasetPushStatus>;
};

/** Change to an account's role in a dataset */
export type DatasetRoleOperation =
  /** Grant the role, replacing any existing one */
  { set: DatasetRoleSetOperation; unset?: never; }
  |  /** Revoke the existing role */
  { set?: never; unset: DatasetRoleUnsetOperation; };

/** Grants a role to an account */
export type DatasetRoleSetOperation = {
  /** Role to grant */
  role: DatasetAccessRole;
};

/** Revokes the role of an account */
export type DatasetRoleUnsetOperation = {
  /** Placeholder field without meaning, its value is ignored */
  dummy: Scalars['Boolean']['input'];
};

/** Input dataset of a query and the state it was queried at */
export type DatasetState = {
  __typename?: 'DatasetState';
  /** Alias to be used in the query */
  alias: Scalars['String']['output'];
  /**
   * Last block hash of the input datasets that was or should be considered
   * during the query planning
   */
  blockHash?: Maybe<Scalars['Multihash']['output']>;
  /** Globally unique identity of the dataset */
  id: Scalars['DatasetID']['output'];
};

/** Who can see a dataset */
export enum DatasetVisibility {
  /** Only the owner and accounts granted access */
  Private = 'PRIVATE',
  /** Everyone */
  Public = 'PUBLIC'
}

/** New visibility of a dataset */
export type DatasetVisibilityInput =
  /** Dataset is visible only to accounts with explicit access */
  { private: PrivateDatasetVisibilityInput; public?: never; }
  |  /** Dataset is readable by all authenticated users, optionally anonymous too */
  { private?: never; public: PublicDatasetVisibilityInput; };

/** Visibility of a dataset */
export type DatasetVisibilityOutput = PrivateDatasetVisibility | PublicDatasetVisibility;

/** Webhook subscription queries of a dataset */
export type DatasetWebhooks = {
  __typename?: 'DatasetWebhooks';
  /** Returns a webhook subscription by ID */
  subscription?: Maybe<WebhookSubscription>;
  /** Lists all webhook subscriptions for the dataset */
  subscriptions: Array<WebhookSubscription>;
};


/** Webhook subscription queries of a dataset */
export type DatasetWebhooksSubscriptionArgs = {
  id: Scalars['WebhookSubscriptionID']['input'];
};

/** Webhook subscription mutations of a dataset */
export type DatasetWebhooksMut = {
  __typename?: 'DatasetWebhooksMut';
  /** Creates a webhook subscription for this dataset */
  createSubscription: CreateWebhookSubscriptionResult;
  /** Returns a webhook subscription management API by ID */
  subscription?: Maybe<WebhookSubscriptionMut>;
};


/** Webhook subscription mutations of a dataset */
export type DatasetWebhooksMutCreateSubscriptionArgs = {
  input: WebhookSubscriptionInput;
};


/** Webhook subscription mutations of a dataset */
export type DatasetWebhooksMutSubscriptionArgs = {
  id: Scalars['WebhookSubscriptionID']['input'];
};

/** Permissions for webhooks of a dataset */
export type DatasetWebhooksPermissions = {
  __typename?: 'DatasetWebhooksPermissions';
  /** Whether the account can change the webhook subscriptions */
  canUpdate: Scalars['Boolean']['output'];
  /** Whether the account can see the webhook subscriptions */
  canView: Scalars['Boolean']['output'];
};

/** Queries for looking up and listing datasets */
export type Datasets = {
  __typename?: 'Datasets';
  /** Returns datasets belonging to the specified account */
  byAccountId: DatasetConnection;
  /** Returns datasets belonging to the specified account */
  byAccountName: DatasetConnection;
  /** Returns a dataset by its ID, if found */
  byId?: Maybe<Dataset>;
  /**
   * Returns multiple datasets by their IDs.
   *
   * Order of results is guaranteed to match the inputs. Duplicate inputs
   * will results in duplicate results.
   */
  byIds: Array<Dataset>;
  /** Returns dataset by its owner and name */
  byOwnerAndName?: Maybe<Dataset>;
  /** Returns a dataset by an ID or alias, if found */
  byRef?: Maybe<Dataset>;
  /**
   * Returns multiple datasets by their IDs or aliases. Order of results is
   * guaranteed to match the inputs.
   */
  byRefs: Array<Dataset>;
};


/** Queries for looking up and listing datasets */
export type DatasetsByAccountIdArgs = {
  accountId: Scalars['AccountID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** Queries for looking up and listing datasets */
export type DatasetsByAccountNameArgs = {
  accountName: Scalars['AccountName']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};


/** Queries for looking up and listing datasets */
export type DatasetsByIdArgs = {
  datasetId: Scalars['DatasetID']['input'];
};


/** Queries for looking up and listing datasets */
export type DatasetsByIdsArgs = {
  datasetIds: Array<Scalars['DatasetID']['input']>;
  skipMissing: Scalars['Boolean']['input'];
};


/** Queries for looking up and listing datasets */
export type DatasetsByOwnerAndNameArgs = {
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
};


/** Queries for looking up and listing datasets */
export type DatasetsByRefArgs = {
  datasetRef: Scalars['DatasetRef']['input'];
};


/** Queries for looking up and listing datasets */
export type DatasetsByRefsArgs = {
  datasetRefs: Array<Scalars['DatasetRef']['input']>;
  skipMissing: Scalars['Boolean']['input'];
};

/** Mutations that look up and create datasets */
export type DatasetsMut = {
  __typename?: 'DatasetsMut';
  /** Returns a mutable dataset by its ID, if found */
  byId?: Maybe<DatasetMut>;
  /**
   * Returns mutable datasets by their IDs.
   *
   * Order of results is guaranteed to match the inputs. Duplicate inputs
   * will results in duplicate results.
   */
  byIds: Array<DatasetMut>;
  /**
   * Creates a new collection dataset.
   * Can include schema for extra columns, dataset metadata, and initial
   * collection entries.
   */
  createCollection: CreateDatasetFromSnapshotResult;
  /** Creates a new empty dataset */
  createEmpty: CreateDatasetResult;
  /** Creates a new dataset from provided snapshot manifest */
  createFromSnapshot: CreateDatasetFromSnapshotResult;
  /**
   * Creates new versioned file dataset.
   * Can include schema for extra columns and dataset metadata events (e.g.
   * adding description and readme).
   */
  createVersionedFile: CreateDatasetFromSnapshotResult;
};


/** Mutations that look up and create datasets */
export type DatasetsMutByIdArgs = {
  datasetId: Scalars['DatasetID']['input'];
};


/** Mutations that look up and create datasets */
export type DatasetsMutByIdsArgs = {
  datasetIds: Array<Scalars['DatasetID']['input']>;
  skipMissing: Scalars['Boolean']['input'];
};


/** Mutations that look up and create datasets */
export type DatasetsMutCreateCollectionArgs = {
  datasetAlias: Scalars['DatasetAlias']['input'];
  datasetVisibility: DatasetVisibility;
  extraColumns?: InputMaybe<Array<ColumnInput>>;
  extraEvents?: InputMaybe<Array<Scalars['String']['input']>>;
  extraEventsFormat?: InputMaybe<MetadataManifestFormat>;
  extraSchema?: InputMaybe<Scalars['DataSchemaInput']['input']>;
};


/** Mutations that look up and create datasets */
export type DatasetsMutCreateEmptyArgs = {
  datasetAlias: Scalars['DatasetAlias']['input'];
  datasetKind: DatasetKind;
  datasetVisibility: DatasetVisibility;
};


/** Mutations that look up and create datasets */
export type DatasetsMutCreateFromSnapshotArgs = {
  datasetVisibility: DatasetVisibility;
  snapshot: Scalars['String']['input'];
  snapshotFormat: MetadataManifestFormat;
};


/** Mutations that look up and create datasets */
export type DatasetsMutCreateVersionedFileArgs = {
  datasetAlias: Scalars['DatasetAlias']['input'];
  datasetVisibility: DatasetVisibility;
  extraColumns?: InputMaybe<Array<ColumnInput>>;
  extraEvents?: InputMaybe<Array<Scalars['String']['input']>>;
  extraEventsFormat?: InputMaybe<MetadataManifestFormat>;
  extraSchema?: InputMaybe<Scalars['DataSchemaInput']['input']>;
};

/** Outcome of deleting an account */
export type DeleteAccountResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Account was deleted */
export type DeleteAccountSuccess = DeleteAccountResult & {
  __typename?: 'DeleteAccountSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of deleting an environment variable */
export type DeleteDatasetEnvVarResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Environment variable with the given key does not exist */
export type DeleteDatasetEnvVarResultNotFound = DeleteDatasetEnvVarResult & {
  __typename?: 'DeleteDatasetEnvVarResultNotFound';
  /** Key that was not found */
  envVarKey: Scalars['String']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Environment variable was deleted */
export type DeleteDatasetEnvVarResultSuccess = DeleteDatasetEnvVarResult & {
  __typename?: 'DeleteDatasetEnvVarResultSuccess';
  /** Key of the deleted environment variable */
  envVarKey: Scalars['String']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of deleting a dataset */
export type DeleteResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Dataset was not deleted because downstream datasets still use it as input */
export type DeleteResultDanglingReference = DeleteResult & {
  __typename?: 'DeleteResultDanglingReference';
  /** Downstream datasets that reference this dataset as input */
  danglingChildRefs: Array<Scalars['DatasetRef']['output']>;
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Alias of the dataset that was not deleted */
  notDeletedDataset: Scalars['DatasetAlias']['output'];
};

/** Dataset was deleted */
export type DeleteResultSuccess = DeleteResult & {
  __typename?: 'DeleteResultSuccess';
  /** Alias of the deleted dataset */
  deletedDataset: Scalars['DatasetAlias']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/**
 * Disables the previously defined polling source.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/DisablePollingSource
 */
export type DisablePollingSource = {
  __typename?: 'DisablePollingSource';
  dummy?: Maybe<Scalars['String']['output']>;
};

/**
 * Disables the previously defined source.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/DisablePushSource
 */
export type DisablePushSource = {
  __typename?: 'DisablePushSource';
  /** Identifies the source to be disabled. */
  sourceName: Scalars['String']['output'];
};

/** Nonce issued for a Sign-In with Ethereum login */
export type Eip4361AuthNonceResponse = {
  __typename?: 'Eip4361AuthNonceResponse';
  /** Nonce to include in the signed message */
  value: Scalars['Eip4361AuthNonce']['output'];
};

/** Metadata block serialized in a manifest format */
export type EncodedBlock = {
  __typename?: 'EncodedBlock';
  /** Serialized block */
  content: Scalars['String']['output'];
  /** Format the block is serialized in */
  encoding: MetadataManifestFormat;
};

/** Data processing engine available on the node */
export type EngineDesc = {
  __typename?: 'EngineDesc';
  /**
   * Language and dialect this engine is using for queries
   * Indented for configuring code highlighting and completions.
   */
  dialect: QueryDialect;
  /**
   * OCI image repository and a tag of the latest engine image, e.g.
   * "ghcr.io/kamu-data/engine-datafusion:0.1.2"
   */
  latestImage: Scalars['String']['output'];
  /**
   * A short name of the engine, e.g. "Spark", "Flink".
   * Intended for use in UI for quick engine identification and selection.
   */
  name: Scalars['String']['output'];
};

/**
 * Defines an environment variable passed into some job.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/EnvVar
 */
export type EnvVar = {
  __typename?: 'EnvVar';
  /** Name of the variable. */
  name: Scalars['String']['output'];
  /** Value of the variable. */
  value?: Maybe<Scalars['String']['output']>;
};

/**
 * Defines the external source of data.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/EventTimeSource
 */
export type EventTimeSource = EventTimeSourceFromMetadata | EventTimeSourceFromPath | EventTimeSourceFromSystemTime;

/**
 * Extracts event time from the source's metadata.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/EventTimeSource#/$defs/FromMetadata
 */
export type EventTimeSourceFromMetadata = {
  __typename?: 'EventTimeSourceFromMetadata';
  dummy?: Maybe<Scalars['String']['output']>;
};

/**
 * Extracts event time from the path component of the source.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/EventTimeSource#/$defs/FromPath
 */
export type EventTimeSourceFromPath = {
  __typename?: 'EventTimeSourceFromPath';
  /** Regular expression where first group contains the timestamp string. */
  pattern: Scalars['String']['output'];
  /** Format of the expected timestamp in java.text.SimpleDateFormat form. */
  timestampFormat?: Maybe<Scalars['String']['output']>;
};

/**
 * Assigns event time from the system time source.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/EventTimeSource#/$defs/FromSystemTime
 */
export type EventTimeSourceFromSystemTime = {
  __typename?: 'EventTimeSourceFromSystemTime';
  dummy?: Maybe<Scalars['String']['output']>;
};

/**
 * Indicates that derivative transformation has been performed.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/ExecuteTransform
 */
export type ExecuteTransform = {
  __typename?: 'ExecuteTransform';
  /**
   * Describes checkpoint written during this transaction, if any. If an engine operation
   * resulted in no updates to the checkpoint, but checkpoint is still relevant for subsequent
   * runs - a hash of the previous checkpoint should be specified.
   */
  newCheckpoint?: Maybe<Checkpoint>;
  /** Describes output data written during this transaction, if any. */
  newData?: Maybe<DataSlice>;
  /**
   * Last watermark of the output data stream, if any. Initial blocks may not have watermarks,
   * but once watermark is set - all subsequent blocks should either carry the same watermark or
   * specify a new (greater) one. Thus, watermarks are monotonically non-decreasing.
   */
  newWatermark?: Maybe<Scalars['DateTime']['output']>;
  /** Hash of the checkpoint file used to restore transformation state, if any. */
  prevCheckpoint?: Maybe<Scalars['Multihash']['output']>;
  /**
   * Last offset of the previous data slice, if any. Must be equal to the last non-empty
   * `newData.offsetInterval.end`.
   */
  prevOffset?: Maybe<Scalars['Uint64']['output']>;
  /**
   * Defines inputs used in this transaction. Slices corresponding to every input dataset must
   * be present.
   */
  queryInputs: Array<ExecuteTransformInput>;
};

/**
 * Describes a slice of the input dataset used during a transformation
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/ExecuteTransformInput
 */
export type ExecuteTransformInput = {
  __typename?: 'ExecuteTransformInput';
  /** Input dataset identifier. */
  datasetId: Scalars['DatasetID']['output'];
  /**
   * Hash of the last block that will be incorporated into the derivative transformation. When
   * present, defines a half-open `(prevBlockHash, newBlockHash]` interval of blocks that will
   * be considered in this transaction.
   */
  newBlockHash?: Maybe<Scalars['Multihash']['output']>;
  /**
   * Offset of the last data record that will be incorporated into the derivative
   * transformation, if any. When present, defines a half-open `(prevOffset, newOffset]`
   * interval of data records that will be considered in this transaction.
   */
  newOffset?: Maybe<Scalars['Uint64']['output']>;
  /**
   * Last block of the input dataset that was previously incorporated into the derivative
   * transformation, if any. Must be equal to the last non-empty `newBlockHash`. Together with
   * `newBlockHash` defines a half-open `(prevBlockHash, newBlockHash]` interval of blocks that
   * will be considered in this transaction.
   */
  prevBlockHash?: Maybe<Scalars['Multihash']['output']>;
  /**
   * Last data record offset in the input dataset that was previously incorporated into the
   * derivative transformation, if any. Must be equal to the last non-empty `newOffset`.
   * Together with `newOffset` defines a half-open `(prevOffset, newOffset]` interval of data
   * records that will be considered in this transaction.
   */
  prevOffset?: Maybe<Scalars['Uint64']['output']>;
};

/**
 * Defines the external source of data.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/FetchStep
 */
export type FetchStep = FetchStepContainer | FetchStepEthereumLogs | FetchStepFilesGlob | FetchStepMqtt | FetchStepUrl;

/**
 * Runs the specified OCI container to fetch data from an arbitrary source.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/FetchStep#/$defs/Container
 */
export type FetchStepContainer = {
  __typename?: 'FetchStepContainer';
  /** Arguments to the entrypoint. The OCI image's CMD is used if this is not provided. */
  args?: Maybe<Array<Scalars['String']['output']>>;
  /**
   * Specifies the entrypoint. Not executed within a shell. The default OCI image's ENTRYPOINT
   * is used if this is not provided.
   */
  command?: Maybe<Array<Scalars['String']['output']>>;
  /** Environment variables to propagate into or set in the container. */
  env?: Maybe<Array<EnvVar>>;
  /** Image name and and an optional tag. */
  image: Scalars['String']['output'];
};

/**
 * Connects to an Ethereum node to stream transaction logs.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/FetchStep#/$defs/EthereumLogs
 */
export type FetchStepEthereumLogs = {
  __typename?: 'FetchStepEthereumLogs';
  /**
   * Identifier of the chain to scan logs from. This parameter may be used for RPC endpoint
   * lookup as well as asserting that provided `nodeUrl` corresponds to the expected chain.
   */
  chainId?: Maybe<Scalars['Uint64']['output']>;
  /**
   * An SQL WHERE clause that can be used to pre-filter the logs before fetching them from the
   * ETH node.
   *
   * Examples:
   * - "block_number > 123 and address = X'5fbdb2315678afecb367f032d93f642f64180aa3' and topic1
   * = X'000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266'"
   */
  filter?: Maybe<Scalars['String']['output']>;
  /** Url of the node. */
  nodeUrl?: Maybe<Scalars['String']['output']>;
  /**
   * Solidity log event signature to use for decoding. Using this field adds `event` to the
   * output containing decoded log as JSON.
   */
  signature?: Maybe<Scalars['String']['output']>;
};

/**
 * Uses glob operator to match files on the local file system.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/FetchStep#/$defs/FilesGlob
 */
export type FetchStepFilesGlob = {
  __typename?: 'FetchStepFilesGlob';
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
  path: Scalars['String']['output'];
};

/**
 * Connects to an MQTT broker to fetch events from the specified topic.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/FetchStep#/$defs/Mqtt
 */
export type FetchStepMqtt = {
  __typename?: 'FetchStepMqtt';
  /** Hostname of the MQTT broker. */
  host: Scalars['String']['output'];
  /** Password to use for auth with the broker (can be templated). */
  password?: Maybe<Scalars['String']['output']>;
  /** Port of the MQTT broker. */
  port: Scalars['Int']['output'];
  /** List of topic subscription parameters. */
  topics: Array<MqttTopicSubscription>;
  /** Username to use for auth with the broker. */
  username?: Maybe<Scalars['String']['output']>;
};

/**
 * Pulls data from one of the supported sources by its URL.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/FetchStep#/$defs/Url
 */
export type FetchStepUrl = {
  __typename?: 'FetchStepUrl';
  /** Describes the caching settings used for this source. */
  cache?: Maybe<SourceCaching>;
  /** Describes how event time is extracted from the source metadata. */
  eventTime?: Maybe<EventTimeSource>;
  /** Headers to pass during the request (e.g. HTTP Authorization) */
  headers?: Maybe<Array<RequestHeader>>;
  /** URL of the data source */
  url: Scalars['String']['output'];
};

/** Arrow Flight SQL endpoint */
export type FlightSqlDesc = {
  __typename?: 'FlightSqlDesc';
  /** Arrow Flight SQL server URL */
  url: Scalars['String']['output'];
};

/** One run of a flow, possibly over several task attempts */
export type Flow = {
  __typename?: 'Flow';
  /** Flow config snapshot */
  configSnapshot?: Maybe<FlowConfigRule>;
  /** Associated dataset ID, if any */
  datasetId?: Maybe<Scalars['DatasetID']['output']>;
  /** Description of key flow parameters */
  description: FlowDescription;
  /**
   * Flows activated by this flow's completion. Filled asynchronously, so
   * the list may lag briefly behind the completion
   */
  downstreamFlows: Array<FlowDownstreamLink>;
  /** Unique identifier of the flow */
  flowId: Scalars['FlowID']['output'];
  /** History of flow events */
  history: Array<FlowEvent>;
  /** A user, who initiated the flow run. None for system-initiated flows */
  initiator?: Maybe<Account>;
  /** Outcome of the flow (Finished state only) */
  outcome?: Maybe<FlowOutcome>;
  /** Primary flow activation cause */
  primaryActivationCause: FlowActivationCause;
  /** Associated flow trigger */
  relatedTrigger?: Maybe<FlowTrigger>;
  /** Flow retry policy */
  retryPolicy?: Maybe<FlowRetryPolicy>;
  /** Start condition */
  startCondition?: Maybe<FlowStartCondition>;
  /** Status of the flow */
  status: FlowStatus;
  /** IDs of associated tasks */
  taskIds: Array<Scalars['TaskID']['output']>;
  /** Timing records associated with the flow lifecycle */
  timing: FlowTimingRecords;
};

/** Flow was aborted before completion */
export type FlowAbortedResult = {
  __typename?: 'FlowAbortedResult';
  /** Fixed status text */
  message: Scalars['String']['output'];
};

/** Reason a flow was started */
export type FlowActivationCause = FlowActivationCauseAutoPolling | FlowActivationCauseDatasetUpdate | FlowActivationCauseIterationFinished | FlowActivationCauseManual;

/** Flow was started by a schedule or after a restart */
export type FlowActivationCauseAutoPolling = {
  __typename?: 'FlowActivationCauseAutoPolling';
  /** Placeholder without meaning, always true */
  dummy: Scalars['Boolean']['output'];
};

/** Flow was started by an update of a dataset */
export type FlowActivationCauseDatasetUpdate = {
  __typename?: 'FlowActivationCauseDatasetUpdate';
  /** Null when the dataset was deleted or is not readable by the caller */
  dataset?: Maybe<Dataset>;
  /** Identifier of the updated dataset */
  datasetId: Scalars['DatasetID']['output'];
  /** What updated the dataset */
  source: FlowActivationCauseDatasetUpdateSource;
};

/** What updated the dataset */
export type FlowActivationCauseDatasetUpdateSource = FlowActivationCauseDatasetUpdateSourceExternallyDetectedChange | FlowActivationCauseDatasetUpdateSourceHttpIngest | FlowActivationCauseDatasetUpdateSourceSmartProtocolPush | FlowActivationCauseDatasetUpdateSourceUpstreamFlow;

/** Dataset was changed outside of the flow system */
export type FlowActivationCauseDatasetUpdateSourceExternallyDetectedChange = {
  __typename?: 'FlowActivationCauseDatasetUpdateSourceExternallyDetectedChange';
  /** Placeholder without meaning, always true */
  dummy: Scalars['Boolean']['output'];
};

/** Dataset was updated by data pushed over HTTP */
export type FlowActivationCauseDatasetUpdateSourceHttpIngest = {
  __typename?: 'FlowActivationCauseDatasetUpdateSourceHttpIngest';
  /** Name of the push source, null for the default source */
  sourceName?: Maybe<Scalars['String']['output']>;
};

/** Dataset was updated by a push over the smart transfer protocol */
export type FlowActivationCauseDatasetUpdateSourceSmartProtocolPush = {
  __typename?: 'FlowActivationCauseDatasetUpdateSourceSmartProtocolPush';
  /** Account that pushed the data, null if unknown */
  accountName?: Maybe<Scalars['AccountName']['output']>;
  /** Whether the push was forced, possibly rewriting history */
  isForce: Scalars['Boolean']['output'];
};

/** Dataset was updated by another flow */
export type FlowActivationCauseDatasetUpdateSourceUpstreamFlow = {
  __typename?: 'FlowActivationCauseDatasetUpdateSourceUpstreamFlow';
  /** Identifier of the flow that updated the dataset */
  flowId: Scalars['FlowID']['output'];
};

/** Flow was started because the previous ingest left more data to fetch */
export type FlowActivationCauseIterationFinished = {
  __typename?: 'FlowActivationCauseIterationFinished';
  /** Placeholder without meaning, always true */
  dummy: Scalars['Boolean']['output'];
};

/** Flow was started manually by a user */
export type FlowActivationCauseManual = {
  __typename?: 'FlowActivationCauseManual';
  /** Account that started the flow */
  initiator: Account;
};

/** Settings of a compaction flow */
export type FlowConfigCompactionInput = {
  /** Maximum number of records in a compacted data slice */
  maxSliceRecords: Scalars['Int']['input'];
  /** Maximum size of a compacted data slice, in bytes */
  maxSliceSize: Scalars['Int']['input'];
};

/** Settings of an ingest flow */
export type FlowConfigIngestInput = {
  /**
   * Flag indicates to trigger next flow iteration right if `has_more` is
   * true
   */
  fetchNextIteration: Scalars['Boolean']['input'];
  /** Flag indicates to ignore cache during ingest step for API calls */
  fetchUncacheable: Scalars['Boolean']['input'];
};

/** Block a reset moves the dataset head to */
export type FlowConfigInputResetPropagationMode =
  /** Reset to a given block */
  { custom: FlowConfigInputResetPropagationModeCustom; toSeed?: never; }
  |  /** Reset to the seed block */
  { custom?: never; toSeed: FlowConfigInputResetPropagationModeToSeed; };

/** Reset the dataset head to a given block */
export type FlowConfigInputResetPropagationModeCustom = {
  /** Hash of the block that becomes the new head */
  newHeadHash: Scalars['Multihash']['input'];
};

/** Reset the dataset head to its seed block */
export type FlowConfigInputResetPropagationModeToSeed = {
  /** Placeholder without meaning, the value is ignored */
  dummy?: InputMaybe<Scalars['String']['input']>;
};

/** Settings of a reset flow */
export type FlowConfigResetInput = {
  /** Block the dataset head is moved to */
  mode: FlowConfigInputResetPropagationMode;
  /**
   * Expected current head; the reset fails if the head differs, null to
   * skip the check
   */
  oldHeadHash?: InputMaybe<Scalars['Multihash']['input']>;
};

/** Block a reset moves the dataset head to */
export type FlowConfigResetPropagationMode = FlowConfigResetPropagationModeCustom | FlowConfigResetPropagationModeToSeed;

/** Reset the dataset head to a given block */
export type FlowConfigResetPropagationModeCustom = {
  __typename?: 'FlowConfigResetPropagationModeCustom';
  /** Hash of the block that becomes the new head */
  newHeadHash: Scalars['Multihash']['output'];
};

/** Reset the dataset head to its seed block */
export type FlowConfigResetPropagationModeToSeed = {
  __typename?: 'FlowConfigResetPropagationModeToSeed';
  /** Placeholder without meaning, always null */
  dummy?: Maybe<Scalars['String']['output']>;
};

/** Settings specific to the flow type */
export type FlowConfigRule = FlowConfigRuleCompaction | FlowConfigRuleIngest | FlowConfigRuleReset;

/** Settings of a compaction flow */
export type FlowConfigRuleCompaction = {
  __typename?: 'FlowConfigRuleCompaction';
  /** Maximum number of records in a compacted data slice */
  maxSliceRecords: Scalars['Int']['output'];
  /** Maximum size of a compacted data slice, in bytes */
  maxSliceSize: Scalars['Int']['output'];
};

/** Settings of an ingest flow */
export type FlowConfigRuleIngest = {
  __typename?: 'FlowConfigRuleIngest';
  /**
   * Whether to run the next ingest right away when the source has more
   * data
   */
  fetchNextIteration: Scalars['Boolean']['output'];
  /** Whether to ignore the cache for API calls during ingest */
  fetchUncacheable: Scalars['Boolean']['output'];
};

/** Settings of a reset flow */
export type FlowConfigRuleReset = {
  __typename?: 'FlowConfigRuleReset';
  /** Block the dataset head is moved to */
  mode: FlowConfigResetPropagationMode;
  /**
   * Expected current head; the reset fails if the head differs, null to
   * skip the check
   */
  oldHeadHash?: Maybe<Scalars['Multihash']['output']>;
};

/** Configuration used by the flow was changed */
export type FlowConfigSnapshotModified = FlowEvent & {
  __typename?: 'FlowConfigSnapshotModified';
  /** New configuration of the flow */
  configSnapshot: FlowConfigRule;
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
};

/** Settings that define how a flow runs */
export type FlowConfiguration = {
  __typename?: 'FlowConfiguration';
  /** Retry policy for failed runs, null to use the flow type's default */
  retryPolicy?: Maybe<FlowRetryPolicy>;
  /** Settings specific to the flow type */
  rule: FlowConfigRule;
};

/** A page of `Flow` items */
export type FlowConnection = {
  __typename?: 'FlowConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<FlowEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<Flow>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** What a flow does, with its result once it succeeded */
export type FlowDescription = FlowDescriptionDatasetExecuteTransform | FlowDescriptionDatasetHardCompaction | FlowDescriptionDatasetPollingIngest | FlowDescriptionDatasetPushIngest | FlowDescriptionDatasetReset | FlowDescriptionDatasetResetToMetadata | FlowDescriptionSystemGc | FlowDescriptionUnknown | FlowDescriptionWebhookDeliver;

/** Flow that runs the transformation of a derivative dataset */
export type FlowDescriptionDatasetExecuteTransform = {
  __typename?: 'FlowDescriptionDatasetExecuteTransform';
  /** Transformation the flow runs */
  transform: SetTransform;
  /** Result of the transformation, null until the flow succeeds */
  transformResult?: Maybe<FlowDescriptionUpdateResult>;
};

/** Flow that compacts data slices of a dataset */
export type FlowDescriptionDatasetHardCompaction = {
  __typename?: 'FlowDescriptionDatasetHardCompaction';
  /** Result of the compaction, null until the flow succeeds */
  compactionResult?: Maybe<FlowDescriptionDatasetReorganizationResult>;
};

/** Flow that ingests data from the dataset's polling source */
export type FlowDescriptionDatasetPollingIngest = {
  __typename?: 'FlowDescriptionDatasetPollingIngest';
  /** Result of the ingest, null until the flow succeeds */
  ingestResult?: Maybe<FlowDescriptionUpdateResult>;
  /** Polling source the data is fetched from */
  pollingSource: SetPollingSource;
};

/** Flow that ingests data pushed into the dataset */
export type FlowDescriptionDatasetPushIngest = {
  __typename?: 'FlowDescriptionDatasetPushIngest';
  /** Result of the ingest, null until the flow succeeds */
  ingestResult?: Maybe<FlowDescriptionUpdateResult>;
  /** Human-readable description of what started the flow */
  message: Scalars['String']['output'];
  /** Name of the push source, null for the default source or when unknown */
  sourceName?: Maybe<Scalars['String']['output']>;
};

/** Result of a flow that rewrites the dataset's history */
export type FlowDescriptionDatasetReorganizationResult = FlowDescriptionReorganizationNothingToDo | FlowDescriptionReorganizationSuccess;

/** Flow that moves the dataset head to an earlier block */
export type FlowDescriptionDatasetReset = {
  __typename?: 'FlowDescriptionDatasetReset';
  /** Result of the reset, null until the flow succeeds */
  resetResult?: Maybe<FlowDescriptionResetResult>;
};

/** Flow that drops the dataset's data while keeping its metadata */
export type FlowDescriptionDatasetResetToMetadata = {
  __typename?: 'FlowDescriptionDatasetResetToMetadata';
  /** Result of the reset, null until the flow succeeds */
  resetToMetadataResult?: Maybe<FlowDescriptionDatasetReorganizationResult>;
};

/** Dataset needed no changes */
export type FlowDescriptionReorganizationNothingToDo = {
  __typename?: 'FlowDescriptionReorganizationNothingToDo';
  /** Placeholder without meaning, always null */
  dummy?: Maybe<Scalars['String']['output']>;
  /** Fixed status text */
  message: Scalars['String']['output'];
};

/** Dataset history was rewritten */
export type FlowDescriptionReorganizationSuccess = {
  __typename?: 'FlowDescriptionReorganizationSuccess';
  /** Hash of the new head block */
  newHead: Scalars['Multihash']['output'];
  /** Number of metadata blocks before the rewrite */
  originalBlocksCount: Scalars['Int']['output'];
  /** Number of metadata blocks after the rewrite */
  resultingBlocksCount: Scalars['Int']['output'];
};

/** Dataset head was moved */
export type FlowDescriptionResetResult = {
  __typename?: 'FlowDescriptionResetResult';
  /** Hash of the new head block */
  newHead: Scalars['Multihash']['output'];
};

/** System garbage collection flow */
export type FlowDescriptionSystemGc = {
  __typename?: 'FlowDescriptionSystemGC';
  /** Placeholder without meaning, always true */
  dummy: Scalars['Boolean']['output'];
};

/** Dataset flow whose details could not be determined */
export type FlowDescriptionUnknown = {
  __typename?: 'FlowDescriptionUnknown';
  /** Why the details are unavailable */
  message: Scalars['String']['output'];
};

/** Result of a flow that updates a dataset */
export type FlowDescriptionUpdateResult = FlowDescriptionUpdateResultSuccess | FlowDescriptionUpdateResultUnknown | FlowDescriptionUpdateResultUpToDate;

/** Dataset was updated with new data */
export type FlowDescriptionUpdateResultSuccess = {
  __typename?: 'FlowDescriptionUpdateResultSuccess';
  /** Whether the source has more data to fetch */
  hasMore: Scalars['Boolean']['output'];
  /** Number of metadata blocks added */
  numBlocks: Scalars['Int']['output'];
  /** Number of data records added */
  numRecords: Scalars['Int']['output'];
  /** New watermark of the dataset, null if it did not change */
  updatedWatermark?: Maybe<Scalars['DateTime']['output']>;
};

/** Dataset was updated, but the added data could not be determined */
export type FlowDescriptionUpdateResultUnknown = {
  __typename?: 'FlowDescriptionUpdateResultUnknown';
  /** Why the added data could not be determined */
  message: Scalars['String']['output'];
};

/** Dataset was already up to date, nothing was added */
export type FlowDescriptionUpdateResultUpToDate = {
  __typename?: 'FlowDescriptionUpdateResultUpToDate';
  /** The value indicates whether the api cache was used */
  uncacheable: Scalars['Boolean']['output'];
};

/** Flow that delivers an event to a webhook subscription */
export type FlowDescriptionWebhookDeliver = {
  __typename?: 'FlowDescriptionWebhookDeliver';
  /** Type of the delivered event */
  eventType: Scalars['String']['output'];
  /** Label of the webhook subscription */
  label: Scalars['String']['output'];
  /** URL the event is delivered to */
  targetUrl: Scalars['Url']['output'];
};

/** A flow that was activated by the completion of another flow */
export type FlowDownstreamLink = {
  __typename?: 'FlowDownstreamLink';
  /** When the downstream flow received the activation */
  activatedAt: Scalars['DateTime']['output'];
  /** Null only when `datasetId` is null */
  dataset?: Maybe<DatasetAccessResult>;
  /** Dataset the downstream flow belongs to, if any */
  datasetId?: Maybe<Scalars['DatasetID']['output']>;
  /**
   * Null unless the caller may see the downstream flow: Read on its
   * dataset, and Maintain for webhook deliveries
   */
  flow?: Maybe<Flow>;
  /** Downstream flow ID */
  flowId: Scalars['FlowID']['output'];
};

/** An edge wrapping a single `Flow` item */
export type FlowEdge = {
  __typename?: 'FlowEdge';
  /** The item itself */
  node: Flow;
};

/** Event in the history of a flow */
export type FlowEvent = {
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
};

/** Flow was aborted */
export type FlowEventAborted = FlowEvent & {
  __typename?: 'FlowEventAborted';
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
};

/** Another reason to run was added to a waiting flow */
export type FlowEventActivationCauseAdded = FlowEvent & {
  __typename?: 'FlowEventActivationCauseAdded';
  /** Added reason to run the flow */
  activationCause: FlowActivationCause;
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
};

/** Flow completed with an outcome */
export type FlowEventCompleted = FlowEvent & {
  __typename?: 'FlowEventCompleted';
  /**
   * Flows activated by this flow's completion. Filled asynchronously, so
   * the list may lag briefly behind the completion
   */
  downstreamFlows: Array<FlowDownstreamLink>;
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
};

/** Flow was created */
export type FlowEventInitiated = FlowEvent & {
  __typename?: 'FlowEventInitiated';
  /** Reason the flow was started */
  activationCause: FlowActivationCause;
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
};

/** Retry policy used by the flow was changed */
export type FlowEventRetryPolicyModified = FlowEvent & {
  __typename?: 'FlowEventRetryPolicyModified';
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
  /** New retry policy, null if failed runs are not retried */
  retryPolicy?: Maybe<FlowRetryPolicy>;
};

/** Flow's planned activation time was set */
export type FlowEventScheduledForActivation = FlowEvent & {
  __typename?: 'FlowEventScheduledForActivation';
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
  /** Time the flow is planned to activate */
  scheduledForActivationAt: Scalars['DateTime']['output'];
};

/** Flow's start condition was set */
export type FlowEventStartConditionUpdated = FlowEvent & {
  __typename?: 'FlowEventStartConditionUpdated';
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
  /** What the flow waits for before it runs */
  startCondition: FlowStartCondition;
};

/** Task of the flow was scheduled, started or finished */
export type FlowEventTaskChanged = FlowEvent & {
  __typename?: 'FlowEventTaskChanged';
  /** Unique identifier of the event */
  eventId: Scalars['EventID']['output'];
  /** Time the event occurred */
  eventTime: Scalars['DateTime']['output'];
  /** Time of the next attempt after a retryable failure, null otherwise */
  nextAttemptAt?: Maybe<Scalars['DateTime']['output']>;
  /** Task of the flow */
  task: Task;
  /** Identifier of the task */
  taskId: Scalars['TaskID']['output'];
  /** New status of the task */
  taskStatus: TaskStatus;
};

/** Flow failed */
export type FlowFailedError = {
  __typename?: 'FlowFailedError';
  /** Why the flow failed */
  reason: TaskFailureReason;
};

/** Flow type is not applicable to this kind of dataset */
export type FlowIncompatibleDatasetKind = SetFlowConfigResult & SetFlowTriggerResult & TriggerFlowResult & {
  __typename?: 'FlowIncompatibleDatasetKind';
  /** Kind of the target dataset */
  actualDatasetKind: DatasetKind;
  /** Dataset kind the flow type requires */
  expectedDatasetKind: DatasetKind;
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Provided flow configuration input is invalid */
export type FlowInvalidConfigInputError = SetFlowConfigResult & {
  __typename?: 'FlowInvalidConfigInputError';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Explanation of what is invalid in the input */
  reason: Scalars['String']['output'];
};

/** Provided flow run configuration is invalid */
export type FlowInvalidRunConfigurations = TriggerFlowResult & {
  __typename?: 'FlowInvalidRunConfigurations';
  /** Explanation of what is invalid in the configuration */
  error: Scalars['String']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Provided trigger rule is invalid */
export type FlowInvalidTriggerInputError = SetFlowTriggerResult & {
  __typename?: 'FlowInvalidTriggerInputError';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Explanation of what is invalid in the rule */
  reason: Scalars['String']['output'];
};

/** Provided trigger stop policy is invalid */
export type FlowInvalidTriggerStopPolicyInputError = SetFlowTriggerResult & {
  __typename?: 'FlowInvalidTriggerStopPolicyInputError';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Explanation of what is invalid in the stop policy */
  reason: Scalars['String']['output'];
};

/** Flow does not exist or does not belong to this dataset */
export type FlowNotFound = CancelFlowRunResult & GetFlowResult & {
  __typename?: 'FlowNotFound';
  /** Identifier of the flow that was requested */
  flowId: Scalars['FlowID']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Final result of a finished flow */
export type FlowOutcome = FlowAbortedResult | FlowFailedError | FlowSuccessResult;

/** Dataset does not satisfy the preconditions of the flow */
export type FlowPreconditionsNotMet = SetFlowConfigResult & SetFlowTriggerResult & TriggerFlowResult & {
  __typename?: 'FlowPreconditionsNotMet';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Description of the unmet precondition */
  preconditions: Scalars['String']['output'];
};

/** Why a flow process was stopped automatically */
export enum FlowProcessAutoStopReason {
  /** Failures in a row reached the stop policy threshold */
  StopPolicy = 'STOP_POLICY',
  /** A run failed in a way that retrying cannot fix */
  UnrecoverableFailure = 'UNRECOVERABLE_FAILURE'
}

/** Overall state of a flow process */
export enum FlowProcessEffectiveState {
  /** Trigger is enabled and the last run did not fail */
  Active = 'ACTIVE',
  /** Trigger is enabled but recent runs failed */
  Failing = 'FAILING',
  /** Trigger was paused by a user */
  PausedManual = 'PAUSED_MANUAL',
  /** Trigger was stopped automatically after failures */
  StoppedAuto = 'STOPPED_AUTO',
  /** No trigger is set, the flow runs only manually */
  Unconfigured = 'UNCONFIGURED'
}

/**
 * Conditions a flow process must match; processes without a trigger are
 * excluded unless states are given explicitly
 */
export type FlowProcessFilters = {
  /** State filter */
  effectiveStateIn?: InputMaybe<Array<FlowProcessEffectiveState>>;
  /** All processes with last attempt between these times, inclusive */
  lastAttemptBetween?: InputMaybe<FlowProcessFiltersTimeRange>;
  /** All processes with last failure since this time, inclusive */
  lastFailureSince?: InputMaybe<Scalars['DateTime']['input']>;
  /** Minimum number of consecutive failures */
  minConsecutiveFailures?: InputMaybe<Scalars['Int']['input']>;
  /** All processes with next planned after this time, inclusive */
  nextPlannedAfter?: InputMaybe<Scalars['DateTime']['input']>;
  /** All processes with next planned before this time, inclusive */
  nextPlannedBefore?: InputMaybe<Scalars['DateTime']['input']>;
};

/** Time range with inclusive bounds */
export type FlowProcessFiltersTimeRange = {
  /** End of the range, inclusive */
  end: Scalars['DateTime']['input'];
  /** Start of the range, inclusive */
  start: Scalars['DateTime']['input'];
};

/** Counts of flow processes in a group by effective state */
export type FlowProcessGroupRollup = {
  __typename?: 'FlowProcessGroupRollup';
  /** Number of processes running without failures */
  active: Scalars['Int']['output'];
  /** Number of processes with failures below the stop threshold */
  failing: Scalars['Int']['output'];
  /** Number of processes paused by a user */
  paused: Scalars['Int']['output'];
  /** Number of processes stopped automatically */
  stopped: Scalars['Int']['output'];
  /** Number of processes in the group */
  total: Scalars['Int']['output'];
  /** Number of processes without a trigger */
  unconfigured: Scalars['Int']['output'];
  /** Longest streak of failed runs in a row among the processes */
  worstConsecutiveFailures: Scalars['Int']['output'];
};

/** Property of a flow process to sort by */
export enum FlowProcessOrderField {
  /** Chronic issues first. */
  ConsecutiveFailures = 'CONSECUTIVE_FAILURES',
  /** Severity bucketing */
  EffectiveState = 'EFFECTIVE_STATE',
  /** By flow type */
  FlowType = 'FLOW_TYPE',
  /** Default for “recent activity”. */
  LastAttemptAt = 'LAST_ATTEMPT_AT',
  /** Triage hot spots. */
  LastFailureAt = 'LAST_FAILURE_AT',
  /** “What’s next” */
  NextPlannedAt = 'NEXT_PLANNED_AT'
}

/** Sort order of flow processes */
export type FlowProcessOrdering = {
  /** Sort direction */
  direction: OrderingDirection;
  /** Property to sort by */
  field: FlowProcessOrderField;
};

/** Health and timing of a recurring flow process */
export type FlowProcessSummary = {
  __typename?: 'FlowProcessSummary';
  /** Time the process was stopped automatically, null if it was not */
  autoStoppedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Why the process was stopped automatically, null if it was not */
  autoStoppedReason?: Maybe<FlowProcessAutoStopReason>;
  /** Number of failed runs in a row, reset by a success */
  consecutiveFailures: Scalars['Int']['output'];
  /** Current state of the process */
  effectiveState: FlowProcessEffectiveState;
  /** Completion time of the last run, successful or failed */
  lastAttemptAt?: Maybe<Scalars['DateTime']['output']>;
  /** Completion time of the last failed run, null if none failed */
  lastFailureAt?: Maybe<Scalars['DateTime']['output']>;
  /** Completion time of the last successful run, null if none succeeded */
  lastSuccessAt?: Maybe<Scalars['DateTime']['output']>;
  /** Planned time of the next run, null if none is planned */
  nextPlannedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Time the user paused the process, null if not paused */
  pausedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Start time of the run in progress, null if none is running */
  runningSince?: Maybe<Scalars['DateTime']['output']>;
  /** When the trigger stops itself after failures */
  stopPolicy: FlowTriggerStopPolicy;
};

/** Selects flows by process kind */
export type FlowProcessTypeFilterInput =
  /** Flows of the dataset itself */
  { primary: FlowProcessTypePrimaryFilterInput; webhooks?: never; }
  |  /** Webhook delivery flows of the dataset's subscriptions */
  { primary?: never; webhooks: FlowProcessTypeWebhooksFilterInput; };

/** Filter for flows of the dataset itself */
export type FlowProcessTypePrimaryFilterInput = {
  /** Only flows of these types, null or empty means all types */
  byFlowTypes?: InputMaybe<Array<DatasetFlowType>>;
};

/** Filter for webhook delivery flows */
export type FlowProcessTypeWebhooksFilterInput = {
  /** Only deliveries of these subscriptions, null or empty means all */
  subscriptionIds?: InputMaybe<Array<Scalars['WebhookSubscriptionID']['input']>>;
};

/** How the retry delay grows with each retry */
export enum FlowRetryBackoffType {
  /** The delay doubles with each retry */
  Exponential = 'EXPONENTIAL',
  /**
   * The delay doubles with each retry, plus a random part below the base
   * delay
   */
  ExponentialWithJitter = 'EXPONENTIAL_WITH_JITTER',
  /** Every retry waits the base delay */
  Fixed = 'FIXED',
  /** Retry N waits N times the base delay */
  Linear = 'LINEAR'
}

/** How a flow retries after a recoverable failure */
export type FlowRetryPolicy = {
  __typename?: 'FlowRetryPolicy';
  /** How the delay grows with each retry */
  backoffType: FlowRetryBackoffType;
  /** Maximum number of retries after the first attempt */
  maxAttempts: Scalars['Int']['output'];
  /** Base delay before a retry */
  minDelay: TimeDelta;
};

/** How a flow retries after a recoverable failure */
export type FlowRetryPolicyInput = {
  /** How the delay grows with each retry */
  backoffType: FlowRetryBackoffType;
  /** Maximum number of retries after the first attempt */
  maxAttempts: Scalars['Int']['input'];
  /** Base delay before a retry */
  minDelay: TimeDeltaInput;
};

/** Sort order of flow runs */
export enum FlowRunOrder {
  /**
   * Queue-oriented ordering:
   * - by status: waiting, running, retrying, finished
   * - by most recent activity
   */
  Queue = 'QUEUE',
  /** Earliest scheduled activation first. */
  ScheduledForActivation = 'SCHEDULED_FOR_ACTIVATION'
}

/** What a waiting flow waits for before it runs */
export type FlowStartCondition = FlowStartConditionExecutor | FlowStartConditionReactive | FlowStartConditionSchedule | FlowStartConditionThrottling;

/** Flow waits for its task to be picked up by an executor */
export type FlowStartConditionExecutor = {
  __typename?: 'FlowStartConditionExecutor';
  /** Identifier of the scheduled task */
  taskId: Scalars['TaskID']['output'];
};

/** Flow waits for enough new input data */
export type FlowStartConditionReactive = {
  __typename?: 'FlowStartConditionReactive';
  /** Number of new input records accumulated so far */
  accumulatedRecordsCount: Scalars['Int']['output'];
  /** Batching rule in effect for this flow */
  activeBatchingRule: FlowTriggerBatchingRule;
  /** Time the flow runs even if too few records arrived */
  batchingDeadline: Scalars['DateTime']['output'];
  /** How to react when an input's history is rewritten */
  forBreakingChange: FlowTriggerBreakingChangeRule;
  /** Whether any input advanced its watermark */
  watermarkModified: Scalars['Boolean']['output'];
};

/** Flow waits for its scheduled time */
export type FlowStartConditionSchedule = {
  __typename?: 'FlowStartConditionSchedule';
  /** Time the flow is scheduled to run */
  wakeUpAt: Scalars['DateTime']['output'];
};

/** Flow was delayed because its previous run was too recent */
export type FlowStartConditionThrottling = {
  __typename?: 'FlowStartConditionThrottling';
  /** Minimum interval between runs, in seconds */
  intervalSec: Scalars['Int']['output'];
  /** Time the flow would have run without throttling */
  shiftedFrom: Scalars['DateTime']['output'];
  /** Time the flow will run */
  wakeUpAt: Scalars['DateTime']['output'];
};

/** Lifecycle status of a flow */
export enum FlowStatus {
  /** Flow has completed with an outcome */
  Finished = 'FINISHED',
  /** Previous attempt failed and the flow waits for the next one */
  Retrying = 'RETRYING',
  /** Flow task is running */
  Running = 'RUNNING',
  /** Flow waits for its start condition or for its task to start */
  Waiting = 'WAITING'
}

/** Flow completed successfully */
export type FlowSuccessResult = {
  __typename?: 'FlowSuccessResult';
  /** Fixed status text */
  message: Scalars['String']['output'];
};

/** Key moments in the lifecycle of a flow */
export type FlowTimingRecords = {
  __typename?: 'FlowTimingRecords';
  /** Recorded time of last task scheduling */
  awaitingExecutorSince?: Maybe<Scalars['DateTime']['output']>;
  /** Recorded time of flow completion (success or failure) */
  completedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Time when the first attempt's task was scheduled; unset while the flow
   * waits for activation
   */
  firstAttemptScheduledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Initiation time */
  initiatedAt: Scalars['DateTime']['output'];
  /** Recorded time of finish of the latest task */
  lastAttemptFinishedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Recorded start of running (Running state seen at least once) */
  runningSince?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Planned activation time of the next attempt; moved by manual runs,
   * batching and retries
   */
  scheduledAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Rule that defines when a flow runs automatically */
export type FlowTrigger = {
  __typename?: 'FlowTrigger';
  /** Whether the trigger is inactive: paused by a user or auto-stopped */
  paused: Scalars['Boolean']['output'];
  /** Reactive rule, null if the trigger runs on a schedule */
  reactive?: Maybe<FlowTriggerReactiveRule>;
  /** Schedule rule, null if the trigger is reactive */
  schedule?: Maybe<FlowTriggerScheduleRule>;
  /** When the trigger stops itself after failures */
  stopPolicy: FlowTriggerStopPolicy;
};

/** How new input data is accumulated before a reactive flow runs */
export type FlowTriggerBatchingRule = FlowTriggerBatchingRuleBuffering | FlowTriggerBatchingRuleImmediate;

/**
 * Accumulate new input data until enough records arrive or the interval
 * passes
 */
export type FlowTriggerBatchingRuleBuffering = {
  __typename?: 'FlowTriggerBatchingRuleBuffering';
  /** Longest wait after the first new data before the flow runs anyway */
  maxBatchingInterval: TimeDelta;
  /** Number of new input records that runs the flow */
  minRecordsToAwait: Scalars['Int']['output'];
};

/**
 * Accumulate new input data until enough records arrive or the interval
 * passes
 */
export type FlowTriggerBatchingRuleBufferingInput = {
  /** Longest wait after the first new data before the flow runs anyway */
  maxBatchingInterval: TimeDeltaInput;
  /** Number of new input records that runs the flow */
  minRecordsToAwait: Scalars['Int']['input'];
};

/** Run the flow as soon as new input data appears */
export type FlowTriggerBatchingRuleImmediate = {
  __typename?: 'FlowTriggerBatchingRuleImmediate';
  /** Placeholder without meaning, always true */
  dummy: Scalars['Boolean']['output'];
};

/** Run the flow as soon as new input data appears */
export type FlowTriggerBatchingRuleImmediateInput = {
  /** Placeholder without meaning, the value is ignored */
  dummy: Scalars['Boolean']['input'];
};

/** How new input data is accumulated before a reactive flow runs */
export type FlowTriggerBatchingRuleInput =
  /** Accumulate new input data first */
  { buffering: FlowTriggerBatchingRuleBufferingInput; immediate?: never; }
  |  /** Run as soon as new input data appears */
  { buffering?: never; immediate: FlowTriggerBatchingRuleImmediateInput; };

/** How to react to a breaking change (history rewrite) of a dataset */
export enum FlowTriggerBreakingChangeRule {
  /** Ignore breaking changes */
  NoAction = 'NO_ACTION',
  /** React to breaking changes, e.g. reset a derivative dataset to metadata */
  Recover = 'RECOVER'
}

/** Rule that runs a flow in reaction to changes of its inputs */
export type FlowTriggerReactiveRule = {
  __typename?: 'FlowTriggerReactiveRule';
  /** How to react when an input's history is rewritten */
  forBreakingChange: FlowTriggerBreakingChangeRule;
  /** How new input data is batched before the flow runs */
  forNewData: FlowTriggerBatchingRule;
};

/** Rule that defines when a flow runs automatically */
export type FlowTriggerRuleInput =
  /** Run in reaction to changes of inputs */
  { reactive: FlowTriggerRuleReactiveInput; schedule?: never; }
  |  /** Run on a schedule */
  { reactive?: never; schedule: FlowTriggerRuleScheduleInput; };

/** Rule that runs a flow in reaction to changes of its inputs */
export type FlowTriggerRuleReactiveInput = {
  /** How to react when an input's history is rewritten */
  forBreakingChange: FlowTriggerBreakingChangeRule;
  /** How new input data is batched before the flow runs */
  forNewData: FlowTriggerBatchingRuleInput;
};

/** Schedule of a trigger: a fixed interval or a cron expression */
export type FlowTriggerRuleScheduleInput =
  /** Supported CRON syntax: min hour dayOfMonth month dayOfWeek */
  { cron5ComponentExpression: Scalars['String']['input']; timeDelta?: never; }
  |  /** Run at a fixed interval */
  { cron5ComponentExpression?: never; timeDelta: TimeDeltaInput; };

/** Schedule of a trigger: a fixed interval or a cron expression */
export type FlowTriggerScheduleRule = Cron5ComponentExpression | TimeDelta;

/** When a trigger stops itself after failed runs */
export type FlowTriggerStopPolicy = FlowTriggerStopPolicyAfterConsecutiveFailures | FlowTriggerStopPolicyNever;

/** Trigger stops after a number of failed runs in a row */
export type FlowTriggerStopPolicyAfterConsecutiveFailures = {
  __typename?: 'FlowTriggerStopPolicyAfterConsecutiveFailures';
  /** Number of failed runs in a row that stops the trigger */
  maxFailures: Scalars['Int']['output'];
};

/** Trigger stops after a number of failed runs in a row */
export type FlowTriggerStopPolicyAfterConsecutiveFailuresInput = {
  /** Number of failed runs in a row that stops the trigger, from 1 to 10 */
  maxFailures: Scalars['Int']['input'];
};

/** When a trigger stops itself after failed runs */
export type FlowTriggerStopPolicyInput =
  /** Stop the trigger after a number of failed runs in a row */
  { afterConsecutiveFailures: FlowTriggerStopPolicyAfterConsecutiveFailuresInput; never?: never; }
  |  /** Never stop the trigger because of failures */
  { afterConsecutiveFailures?: never; never: FlowTriggerStopPolicyNeverInput; };

/** Trigger never stops because of failures */
export type FlowTriggerStopPolicyNever = {
  __typename?: 'FlowTriggerStopPolicyNever';
  /** Placeholder without meaning, always true */
  dummy: Scalars['Boolean']['output'];
};

/** Trigger never stops because of failures */
export type FlowTriggerStopPolicyNeverInput = {
  /** Placeholder without meaning, the value is ignored */
  dummy: Scalars['Boolean']['input'];
};

/** Flow type is not supported for this operation */
export type FlowTypeIsNotSupported = SetFlowTriggerResult & {
  __typename?: 'FlowTypeIsNotSupported';
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Fragment of a field that matched a full-text search */
export type FullTextSearchHighlight = {
  __typename?: 'FullTextSearchHighlight';
  /** Most relevant fragment of the field with the matches highlighted */
  bestFragment: Scalars['String']['output'];
  /** Name of the matching field */
  field: Scalars['String']['output'];
};

/** Object matching a full-text search */
export type FullTextSearchHit = {
  __typename?: 'FullTextSearchHit';
  /** Fragments of the fields that matched the prompt, if any */
  highlights?: Maybe<Array<FullTextSearchHighlight>>;
  /** Identifier of the matching object */
  id: Scalars['String']['output'];
  /**
   * Name of the search schema the object belongs to, e.g. datasets or
   * accounts
   */
  schemaName: Scalars['String']['output'];
  /** Relevance score, null when results are not ranked */
  score?: Maybe<Scalars['Float']['output']>;
  /** Indexed document of the object as JSON */
  source: Scalars['JSON']['output'];
};

/** Results of a full-text search */
export type FullTextSearchResponse = {
  __typename?: 'FullTextSearchResponse';
  /** Matching objects on the requested page */
  hits: Array<FullTextSearchHit>;
  /** Whether the search timed out and returned partial results */
  timeout: Scalars['Boolean']['output'];
  /** Time the search engine spent on the request, in milliseconds */
  tookMs: Scalars['Int']['output'];
  /** Total number of matching objects across all pages */
  totalHits: Scalars['Int']['output'];
};

/** Outcome of looking up a flow */
export type GetFlowResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Flow was found */
export type GetFlowSuccess = GetFlowResult & {
  __typename?: 'GetFlowSuccess';
  /** Flow that was requested */
  flow: Flow;
  /** Human-readable success message */
  message: Scalars['String']['output'];
};

/** Selects flows by who started them */
export type InitiatorFilterInput =
  /** Flows started by any of these accounts */
  { accounts: Array<Scalars['AccountID']['input']>; system?: never; }
  |  /** Flows started by the system, the value is ignored */
  { accounts?: never; system: Scalars['Boolean']['input']; };

/** JDBC connection details */
export type JdbcDesc = {
  __typename?: 'JdbcDesc';
  /** JDBC connection URL for the Arrow Flight SQL driver */
  url: Scalars['String']['output'];
};

/** Kafka protocol endpoint */
export type KafkaProtocolDesc = {
  __typename?: 'KafkaProtocolDesc';
  /** Kafka connection URL */
  url: Scalars['String']['output'];
};

/** Key-value pair of strings */
export type KeyValue = {
  __typename?: 'KeyValue';
  /** Key of the pair */
  key: Scalars['String']['output'];
  /** Value of the pair */
  value: Scalars['String']['output'];
};

/** Link to a dataset page in the web UI */
export type LinkProtocolDesc = {
  __typename?: 'LinkProtocolDesc';
  /** URL of the dataset page */
  url: Scalars['String']['output'];
};

/** Result of a successful login */
export type LoginResponse = {
  __typename?: 'LoginResponse';
  /** Access token to authenticate subsequent requests */
  accessToken: Scalars['String']['output'];
  /** Account that logged in */
  account: Account;
};

/** Filters narrowing a name lookup */
export type LookupFilters = {
  /** Filters applied to accounts */
  byAccount?: InputMaybe<AccountLookupFilter>;
};

/**
 * Merge strategy determines how newly ingested data should be combined with the data that already
 * exists in the dataset.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MergeStrategy
 */
export type MergeStrategy = MergeStrategyAppend | MergeStrategyChangelogStream | MergeStrategyLedger | MergeStrategySnapshot | MergeStrategyUpsertStream;

/**
 * Append merge strategy.
 *
 * Under this strategy new data will be appended to the dataset in its entirety, without any
 * deduplication.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MergeStrategy#/$defs/Append
 */
export type MergeStrategyAppend = {
  __typename?: 'MergeStrategyAppend';
  dummy?: Maybe<Scalars['String']['output']>;
};

/**
 * Changelog stream merge strategy.
 *
 * This is the native stream format for ODF that accurately describes the evolution of all event
 * records including appends, retractions, and corrections as per RFC-015. No pre-processing except
 * for format validation is done.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MergeStrategy#/$defs/ChangelogStream
 */
export type MergeStrategyChangelogStream = {
  __typename?: 'MergeStrategyChangelogStream';
  /** Names of the columns that uniquely identify the record throughout its lifetime */
  primaryKey: Array<Scalars['String']['output']>;
};

/**
 * Ledger merge strategy.
 *
 * This strategy should be used for data sources containing ledgers of events. Currently this
 * strategy will only perform deduplication of events using user-specified primary key columns.
 * This means that the source data can contain partially overlapping set of records and only those
 * records that were not previously seen will be appended.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MergeStrategy#/$defs/Ledger
 */
export type MergeStrategyLedger = {
  __typename?: 'MergeStrategyLedger';
  /** Names of the columns that uniquely identify the record throughout its lifetime */
  primaryKey: Array<Scalars['String']['output']>;
};

/**
 * Snapshot merge strategy.
 *
 * This strategy can be used for data state snapshots that are taken periodically and contain only
 * the latest state of the observed entity or system. Over time such snapshots can have new rows
 * added, and old rows either removed or modified.
 *
 * This strategy transforms snapshot data into an append-only event stream where data already added
 * is immutable. It does so by performing Change Data Capture - essentially diffing the current
 * state of data against the reconstructed previous state and recording differences as retractions
 * or corrections. The Operation Type "op" column will contain:
 * - append (`+A`) when a row appears for the first time
 * - retraction (`-R`) when row disappears
 * - correction (`-C`, `+C`) when row data has changed, with `-C` event carrying the old value of
 * the row and `+C` carrying the new value.
 *
 * To correctly associate rows between old and new snapshots this strategy relies on user-specified
 * primary key columns.
 *
 * To identify whether a row has changed this strategy will compare all other columns one by one.
 * If the data contains a column that is guaranteed to change whenever any of the data columns
 * changes (for example a last modification timestamp, an incremental version, or a data hash),
 * then it can be specified in `compareColumns` property to speed up the detection of modified
 * rows.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MergeStrategy#/$defs/Snapshot
 */
export type MergeStrategySnapshot = {
  __typename?: 'MergeStrategySnapshot';
  /** Names of the columns to compared to determine if a row has changed between two snapshots. */
  compareColumns?: Maybe<Array<Scalars['String']['output']>>;
  /** Names of the columns that uniquely identify the record throughout its lifetime. */
  primaryKey: Array<Scalars['String']['output']>;
};

/**
 * Upsert stream merge strategy.
 *
 * This strategy should be used for data sources containing ledgers of insert-or-update and delete
 * events. Unlike ChangelogStream the insert-or-update events only carry the new values, so this
 * strategy will use primary key to re-classify the events into an append or a correction from/to
 * pair, looking up the previous values.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MergeStrategy#/$defs/UpsertStream
 */
export type MergeStrategyUpsertStream = {
  __typename?: 'MergeStrategyUpsertStream';
  /** Names of the columns that uniquely identify the record throughout its lifetime */
  primaryKey: Array<Scalars['String']['output']>;
};

/** A page of `MetadataBlockExtended` items */
export type MetadataBlockConnection = {
  __typename?: 'MetadataBlockConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<MetadataBlockEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<MetadataBlockExtended>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `MetadataBlockExtended` item */
export type MetadataBlockEdge = {
  __typename?: 'MetadataBlockEdge';
  /** The item itself */
  node: MetadataBlockExtended;
};

/** Metadata block with its hash and author */
export type MetadataBlockExtended = {
  __typename?: 'MetadataBlockExtended';
  /** Author of the block, reported as the dataset owner */
  author: Account;
  /** Hash of this block */
  blockHash: Scalars['Multihash']['output'];
  /** Block serialized in the requested format */
  encoded?: Maybe<EncodedBlock>;
  /** Metadata event recorded in this block */
  event: MetadataEvent;
  /** Hash of the preceding block, null for the first block */
  prevBlockHash?: Maybe<Scalars['Multihash']['output']>;
  /** Position of this block in the chain, starting from zero */
  sequenceNumber: Scalars['Int']['output'];
  /** System time when this block was created */
  systemTime: Scalars['DateTime']['output'];
};


/** Metadata block with its hash and author */
export type MetadataBlockExtendedEncodedArgs = {
  encoding: MetadataManifestFormat;
};

/** Chain of metadata blocks of a dataset */
export type MetadataChain = {
  __typename?: 'MetadataChain';
  /** Returns a metadata block corresponding to the specified hash */
  blockByHash?: Maybe<MetadataBlockExtended>;
  /**
   * Returns a metadata block corresponding to the specified hash and encoded
   * in desired format
   */
  blockByHashEncoded?: Maybe<Scalars['String']['output']>;
  /** Iterates all metadata blocks in the reverse chronological order */
  blocks: MetadataBlockConnection;
  /** Returns all named metadata block references */
  refs: Array<BlockRef>;
};


/** Chain of metadata blocks of a dataset */
export type MetadataChainBlockByHashArgs = {
  hash: Scalars['Multihash']['input'];
};


/** Chain of metadata blocks of a dataset */
export type MetadataChainBlockByHashEncodedArgs = {
  format: MetadataManifestFormat;
  hash: Scalars['Multihash']['input'];
};


/** Chain of metadata blocks of a dataset */
export type MetadataChainBlocksArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Mutations of the dataset metadata chain */
export type MetadataChainMut = {
  __typename?: 'MetadataChainMut';
  /** Commits new event to the metadata chain */
  commitEvent: CommitResult;
};


/** Mutations of the dataset metadata chain */
export type MetadataChainMutCommitEventArgs = {
  event: Scalars['String']['input'];
  eventFormat: MetadataManifestFormat;
};

/**
 * Represents a transaction that occurred on a dataset.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/MetadataEvent
 */
export type MetadataEvent = AddData | AddPushSource | DisablePollingSource | DisablePushSource | ExecuteTransform | Seed | SetAttachments | SetDataSchema | SetInfo | SetLicense | SetPollingSource | SetTransform | SetVocab;

/** Type of a metadata event */
export enum MetadataEventType {
  /** Event that adds a source data can be pushed into */
  AddPushSource = 'ADD_PUSH_SOURCE',
  /** Event that establishes the identity of a dataset */
  Seed = 'SEED',
  /** Event that sets attached files */
  SetAttachments = 'SET_ATTACHMENTS',
  /** Event that sets the schema of the data */
  SetDataSchema = 'SET_DATA_SCHEMA',
  /** Event that sets the description, keywords and similar info */
  SetInfo = 'SET_INFO',
  /** Event that sets the license */
  SetLicense = 'SET_LICENSE',
  /** Event that defines a source polled for new data */
  SetPollingSource = 'SET_POLLING_SOURCE',
  /** Event that defines how a derivative dataset is computed */
  SetTransform = 'SET_TRANSFORM',
  /** Event that defines column names with special meaning */
  SetVocab = 'SET_VOCAB'
}

/** Serialization format of metadata manifests */
export enum MetadataManifestFormat {
  /** YAML manifest */
  Yaml = 'YAML'
}

/** Manifest could not be parsed */
export type MetadataManifestMalformed = CommitResult & CreateDatasetFromSnapshotResult & {
  __typename?: 'MetadataManifestMalformed';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Description of the problem */
  message: Scalars['String']['output'];
};

/** Manifest version is not supported by this node */
export type MetadataManifestUnsupportedVersion = CommitResult & CreateDatasetFromSnapshotResult & {
  __typename?: 'MetadataManifestUnsupportedVersion';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Description of the problem with the supported version range */
  message: Scalars['String']['output'];
};

/** Outcome of changing an account password */
export type ModifyPasswordResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Password was changed */
export type ModifyPasswordSuccess = ModifyPasswordResult & {
  __typename?: 'ModifyPasswordSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Password was not changed: the old password is wrong */
export type ModifyPasswordWrongOldPassword = ModifyPasswordResult & {
  __typename?: 'ModifyPasswordWrongOldPassword';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/**
 * MQTT quality of service class.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MqttQos
 */
export enum MqttQos {
  AtLeastOnce = 'AT_LEAST_ONCE',
  AtMostOnce = 'AT_MOST_ONCE',
  ExactlyOnce = 'EXACTLY_ONCE'
}

/**
 * MQTT topic subscription parameters.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/MqttTopicSubscription
 */
export type MqttTopicSubscription = {
  __typename?: 'MqttTopicSubscription';
  /** Name of the topic (may include patterns). */
  path: Scalars['String']['output'];
  /**
   * Quality of service class.
   *
   * Defaults to: "AtMostOnce"
   */
  qos?: Maybe<MqttQos>;
};

/** Root of all mutations */
export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Account-related functionality group.
   *
   * Accounts can be individual users or organizations registered in the
   * system. This groups deals with their identities and permissions.
   */
  accounts: AccountsMut;
  /** Admin-related functionality group */
  admin: AdminMut;
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
  /** Resource-related functionality group */
  resources: ResourcesMut;
};

/** Object found by a name lookup */
export type NameLookupResult = Account;

/** A page of `NameLookupResult` items */
export type NameLookupResultConnection = {
  __typename?: 'NameLookupResultConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<NameLookupResultEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<NameLookupResult>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `NameLookupResult` item */
export type NameLookupResultEdge = {
  __typename?: 'NameLookupResultEdge';
  /** The item itself */
  node: NameLookupResult;
};

/** Request did not change the dataset */
export type NoChanges = CommitResult & UpdateReadmeResult & {
  __typename?: 'NoChanges';
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Explanation of why nothing changed */
  message: Scalars['String']['output'];
};

/** `OData` API endpoints for a dataset */
export type OdataProtocolDesc = {
  __typename?: 'OdataProtocolDesc';
  /** URL of the `OData` collection of the dataset */
  collectionUrl: Scalars['String']['output'];
  /** URL of the `OData` service of the dataset owner */
  serviceUrl: Scalars['String']['output'];
};

/**
 * Describes a range of data as a closed arithmetic interval of offsets
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/OffsetInterval
 */
export type OffsetInterval = {
  __typename?: 'OffsetInterval';
  /** End of the closed interval [start; end]. */
  end: Scalars['Uint64']['output'];
  /** Start of the closed interval [start; end]. */
  start: Scalars['Uint64']['output'];
};

/** Sort direction */
export enum OrderingDirection {
  /** Ascending, smallest first */
  Asc = 'ASC',
  /** Descending, largest first */
  Desc = 'DESC'
}

/** Position of a page within a page-based listing */
export type PageBasedInfo = {
  __typename?: 'PageBasedInfo';
  /** Index of the current page */
  currentPage: Scalars['Int']['output'];
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /**
   * Approximate number of total pages assuming number of nodes per page
   * stays the same
   */
  totalPages?: Maybe<Scalars['Int']['output']>;
};

/** Outcome of pausing a webhook subscription */
export type PauseWebhookSubscriptionResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Webhook subscription was paused */
export type PauseWebhookSubscriptionResultSuccess = PauseWebhookSubscriptionResult & {
  __typename?: 'PauseWebhookSubscriptionResultSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** Always true */
  paused: Scalars['Boolean']['output'];
};

/** Operation is not allowed in the current subscription status */
export type PauseWebhookSubscriptionResultUnexpected = PauseWebhookSubscriptionResult & {
  __typename?: 'PauseWebhookSubscriptionResultUnexpected';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Current status of the subscription */
  status: WebhookSubscriptionStatus;
};

/** PostgreSQL protocol endpoint */
export type PostgreSqlDesl = {
  __typename?: 'PostgreSqlDesl';
  /** PostgreSQL connection URL */
  url: Scalars['String']['output'];
};

/**
 * Defines the steps to prepare raw data for ingestion.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/PrepStep
 */
export type PrepStep = PrepStepDecompress | PrepStepPipe;

/**
 * Pulls data from one of the supported sources by its URL.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/PrepStep#/$defs/Decompress
 */
export type PrepStepDecompress = {
  __typename?: 'PrepStepDecompress';
  /** Name of a compression algorithm used on data. */
  format: CompressionFormat;
  /** Path to a data file within a multi-file archive. Can contain glob patterns. */
  subPath?: Maybe<Scalars['String']['output']>;
};

/**
 * Executes external command to process the data using piped input/output.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/PrepStep#/$defs/Pipe
 */
export type PrepStepPipe = {
  __typename?: 'PrepStepPipe';
  /** Command to execute and its arguments. */
  command: Array<Scalars['String']['output']>;
};

/** Dataset is visible only to its owner and collaborators */
export type PrivateDatasetVisibility = {
  __typename?: 'PrivateDatasetVisibility';
  /** Placeholder field without meaning, always null */
  dummy?: Maybe<Scalars['String']['output']>;
};

/** Dataset is visible only to its owner and collaborators */
export type PrivateDatasetVisibilityInput = {
  /** Placeholder field without meaning, always null */
  dummy?: InputMaybe<Scalars['String']['input']>;
};

/** Dataset is readable by all authenticated users */
export type PublicDatasetVisibility = {
  __typename?: 'PublicDatasetVisibility';
  /** Whether anonymous (unauthenticated) users can read the dataset too */
  anonymousAvailable: Scalars['Boolean']['output'];
};

/** Dataset is readable by all authenticated users */
export type PublicDatasetVisibilityInput = {
  /** Whether anonymous (unauthenticated) users can read the dataset too */
  anonymousAvailable: Scalars['Boolean']['input'];
};

/** Root of all read-only queries */
export type Query = {
  __typename?: 'Query';
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
  apiVersion: Scalars['String']['output'];
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
  /** Resource-related functionality group */
  resources: Resources;
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

/** Query language and dialect */
export enum QueryDialect {
  /** Apache `DataFusion` SQL */
  SqlDataFusion = 'SQL_DATA_FUSION',
  /** Apache Flink SQL */
  SqlFlink = 'SQL_FLINK',
  /** `RisingWave` SQL */
  SqlRisingWave = 'SQL_RISING_WAVE',
  /** Apache Spark SQL */
  SqlSpark = 'SQL_SPARK'
}

/** Outcome of reactivating a webhook subscription */
export type ReactivateWebhookSubscriptionResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Webhook subscription was reactivated */
export type ReactivateWebhookSubscriptionResultSuccess = ReactivateWebhookSubscriptionResult & {
  __typename?: 'ReactivateWebhookSubscriptionResultSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** Always true */
  reactivated: Scalars['Boolean']['output'];
};

/** Operation is not allowed in the current subscription status */
export type ReactivateWebhookSubscriptionResultUnexpected = ReactivateWebhookSubscriptionResult & {
  __typename?: 'ReactivateWebhookSubscriptionResultUnexpected';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Current status of the subscription */
  status: WebhookSubscriptionStatus;
};

/**
 * Defines how raw data should be read into the structured form.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep
 */
export type ReadStep = {
  schema?: Maybe<DataSchema>;
};


/**
 * Defines how raw data should be read into the structured form.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep
 */
export type ReadStepSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/**
 * Reader for comma-separated files.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/Csv
 */
export type ReadStepCsv = ReadStep & {
  __typename?: 'ReadStepCsv';
  /**
   * Sets the string that indicates a date format. The `rfc3339` is the only
   * required format, the other format strings are implementation-specific.
   *
   * Defaults to: "rfc3339"
   */
  dateFormat?: Maybe<Scalars['String']['output']>;
  /**
   * DEPRECATED: A DDL-formatted schema. Schema can be used to coerce values
   * into more appropriate data types.
   *
   * Examples:
   * - ["date TIMESTAMP","city STRING","population INT"]
   */
  ddlSchema?: Maybe<Array<Scalars['String']['output']>>;
  /**
   * Decodes the CSV files by the given encoding type.
   *
   * Defaults to: "utf8"
   */
  encoding?: Maybe<Scalars['String']['output']>;
  /**
   * Sets a single character used for escaping quotes inside an already
   * quoted value.
   *
   * Defaults to: "\\"
   */
  escape?: Maybe<Scalars['String']['output']>;
  /**
   * Use the first line as names of columns.
   *
   * Defaults to: false
   */
  header?: Maybe<Scalars['Boolean']['output']>;
  /**
   * Infers the input schema automatically from data. It requires one extra
   * pass over the data.
   *
   * Defaults to: false
   */
  inferSchema?: Maybe<Scalars['Boolean']['output']>;
  /**
   * Sets the string representation of a null value.
   *
   * Defaults to: ""
   */
  nullValue?: Maybe<Scalars['String']['output']>;
  /**
   * Sets a single character used for escaping quoted values where the
   * separator can be part of the value. Set an empty string to turn off
   * quotations.
   *
   * Defaults to: "\""
   */
  quote?: Maybe<Scalars['String']['output']>;
  /** Schema used to coerce values into more appropriate data types. */
  schema?: Maybe<DataSchema>;
  /**
   * Sets a single character as a separator for each field and value.
   *
   * Defaults to: ","
   */
  separator?: Maybe<Scalars['String']['output']>;
  /**
   * Sets the string that indicates a timestamp format. The `rfc3339` is the
   * only required format, the other format strings are
   * implementation-specific.
   *
   * Defaults to: "rfc3339"
   */
  timestampFormat?: Maybe<Scalars['String']['output']>;
};


/**
 * Reader for comma-separated files.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/Csv
 */
export type ReadStepCsvSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/**
 * Reader for ESRI Shapefile format.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/EsriShapefile
 */
export type ReadStepEsriShapefile = ReadStep & {
  __typename?: 'ReadStepEsriShapefile';
  /**
   * DEPRECATED: A DDL-formatted schema. Schema can be used to coerce values
   * into more appropriate data types.
   */
  ddlSchema?: Maybe<Array<Scalars['String']['output']>>;
  /** Schema used to coerce values into more appropriate data types. */
  schema?: Maybe<DataSchema>;
  /**
   * If the ZIP archive contains multiple shapefiles use this field to
   * specify a sub-path to the desired `.shp` file. Can contain glob patterns
   * to act as a filter.
   */
  subPath?: Maybe<Scalars['String']['output']>;
};


/**
 * Reader for ESRI Shapefile format.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/EsriShapefile
 */
export type ReadStepEsriShapefileSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/**
 * Reader for GeoJSON files. It expects one `FeatureCollection` object in the root and will create
 * a record per each `Feature` inside it extracting the properties into individual columns and
 * leaving the feature geometry in its own column.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/GeoJson
 */
export type ReadStepGeoJson = ReadStep & {
  __typename?: 'ReadStepGeoJson';
  /**
   * DEPRECATED: A DDL-formatted schema. Schema can be used to coerce values
   * into more appropriate data types.
   */
  ddlSchema?: Maybe<Array<Scalars['String']['output']>>;
  /** Schema used to coerce values into more appropriate data types. */
  schema?: Maybe<DataSchema>;
};


/**
 * Reader for GeoJSON files. It expects one `FeatureCollection` object in the root and will create
 * a record per each `Feature` inside it extracting the properties into individual columns and
 * leaving the feature geometry in its own column.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/GeoJson
 */
export type ReadStepGeoJsonSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/**
 * Reader for JSON files that contain an array of objects within them.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/Json
 */
export type ReadStepJson = ReadStep & {
  __typename?: 'ReadStepJson';
  /**
   * Sets the string that indicates a date format. The `rfc3339` is the only
   * required format, the other format strings are implementation-specific.
   *
   * Defaults to: "rfc3339"
   */
  dateFormat?: Maybe<Scalars['String']['output']>;
  /**
   * DEPRECATED: A DDL-formatted schema. Schema can be used to coerce values
   * into more appropriate data types.
   */
  ddlSchema?: Maybe<Array<Scalars['String']['output']>>;
  /**
   * Allows to forcibly set one of standard basic or extended encodings.
   *
   * Defaults to: "utf8"
   */
  encoding?: Maybe<Scalars['String']['output']>;
  /** Schema used to coerce values into more appropriate data types. */
  schema?: Maybe<DataSchema>;
  /**
   * Path in the form of `a.b.c` to a sub-element of the root JSON object
   * that is an array or objects. If not specified it is assumed that the
   * root element is an array.
   */
  subPath?: Maybe<Scalars['String']['output']>;
  /**
   * Sets the string that indicates a timestamp format. The `rfc3339` is the
   * only required format, the other format strings are
   * implementation-specific.
   *
   * Defaults to: "rfc3339"
   */
  timestampFormat?: Maybe<Scalars['String']['output']>;
};


/**
 * Reader for JSON files that contain an array of objects within them.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/Json
 */
export type ReadStepJsonSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/**
 * Reader for Newline-delimited GeoJSON files. It is similar to `GeoJson` format but instead of
 * `FeatureCollection` object in the root it expects every individual feature object to appear on
 * its own line.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/NdGeoJson
 */
export type ReadStepNdGeoJson = ReadStep & {
  __typename?: 'ReadStepNdGeoJson';
  /**
   * DEPRECATED: A DDL-formatted schema. Schema can be used to coerce values
   * into more appropriate data types.
   */
  ddlSchema?: Maybe<Array<Scalars['String']['output']>>;
  /** Schema used to coerce values into more appropriate data types. */
  schema?: Maybe<DataSchema>;
};


/**
 * Reader for Newline-delimited GeoJSON files. It is similar to `GeoJson` format but instead of
 * `FeatureCollection` object in the root it expects every individual feature object to appear on
 * its own line.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/NdGeoJson
 */
export type ReadStepNdGeoJsonSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/**
 * Reader for files containing multiple newline-delimited JSON objects with the same schema.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/NdJson
 */
export type ReadStepNdJson = ReadStep & {
  __typename?: 'ReadStepNdJson';
  /**
   * Sets the string that indicates a date format. The `rfc3339` is the only
   * required format, the other format strings are implementation-specific.
   *
   * Defaults to: "rfc3339"
   */
  dateFormat?: Maybe<Scalars['String']['output']>;
  /**
   * DEPRECATED: A DDL-formatted schema. Schema can be used to coerce values
   * into more appropriate data types.
   */
  ddlSchema?: Maybe<Array<Scalars['String']['output']>>;
  /**
   * Allows to forcibly set one of standard basic or extended encodings.
   *
   * Defaults to: "utf8"
   */
  encoding?: Maybe<Scalars['String']['output']>;
  /** Schema used to coerce values into more appropriate data types. */
  schema?: Maybe<DataSchema>;
  /**
   * Sets the string that indicates a timestamp format. The `rfc3339` is the
   * only required format, the other format strings are
   * implementation-specific.
   *
   * Defaults to: "rfc3339"
   */
  timestampFormat?: Maybe<Scalars['String']['output']>;
};


/**
 * Reader for files containing multiple newline-delimited JSON objects with the same schema.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/NdJson
 */
export type ReadStepNdJsonSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/**
 * Reader for Apache Parquet format.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/Parquet
 */
export type ReadStepParquet = ReadStep & {
  __typename?: 'ReadStepParquet';
  /**
   * DEPRECATED: A DDL-formatted schema. Schema can be used to coerce values
   * into more appropriate data types.
   */
  ddlSchema?: Maybe<Array<Scalars['String']['output']>>;
  /** Schema used to coerce values into more appropriate data types. */
  schema?: Maybe<DataSchema>;
};


/**
 * Reader for Apache Parquet format.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/ReadStep#/$defs/Parquet
 */
export type ReadStepParquetSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/** Outcome of removing a webhook subscription */
export type RemoveWebhookSubscriptionResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Webhook subscription was removed */
export type RemoveWebhookSubscriptionResultSuccess = RemoveWebhookSubscriptionResult & {
  __typename?: 'RemoveWebhookSubscriptionResultSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** Always true */
  removed: Scalars['Boolean']['output'];
};

/** Account was not renamed: the new name is already taken */
export type RenameAccountNameNotUnique = RenameAccountResult & {
  __typename?: 'RenameAccountNameNotUnique';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of renaming an account */
export type RenameAccountResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Account was renamed */
export type RenameAccountSuccess = RenameAccountResult & {
  __typename?: 'RenameAccountSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** New name of the account */
  newName: Scalars['String']['output'];
};

/** Outcome of renaming a dataset */
export type RenameResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Another dataset with the requested name already exists */
export type RenameResultNameCollision = RenameResult & {
  __typename?: 'RenameResultNameCollision';
  /** Alias of the existing dataset that holds the name */
  collidingAlias: Scalars['DatasetAlias']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** New name equals the current one, nothing was changed */
export type RenameResultNoChanges = RenameResult & {
  __typename?: 'RenameResultNoChanges';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** Current name of the dataset */
  preservedName: Scalars['DatasetName']['output'];
};

/** Dataset was renamed */
export type RenameResultSuccess = RenameResult & {
  __typename?: 'RenameResultSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** Name of the dataset after the rename */
  newName: Scalars['DatasetName']['output'];
  /** Name of the dataset before the rename */
  oldName: Scalars['DatasetName']['output'];
};

/**
 * Defines a header (e.g. HTTP) to be passed into some request.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/RequestHeader
 */
export type RequestHeader = {
  __typename?: 'RequestHeader';
  /** Name of the header. */
  name: Scalars['String']['output'];
  /** Value of the header. */
  value: Scalars['String']['output'];
};

/**
 * Top-level container for canonical representation of a resource that specifies the type and
 * version of the resource, carries identity, ownership, and status information.
 *
 * Schema: https://opendatafabric.org/schemas/resources/v1alpha1/Resource
 */
export type Resource = {
  __typename?: 'Resource';
  /** Container for identity and ownership information of a resource. */
  headers: ResourceHeaders;
  /** Identifies the controlling entity, a bounded context that this resource belongs to, and the version. Url should follow the pattern `{base-url}/{context}/{version}/{name}` e.g. `https://opendatafabric.org/schemas/datasets/v1/Dataset`. */
  schema: Scalars['TypeUri']['output'];
  /** Specifies the desired state of a resource. */
  spec: Scalars['JSON']['output'];
  /** Resource lifecycle and reconciliation information. */
  status: ResourceStatus;
};

/**
 * The account selector supplied for this operation could not be resolved to a
 * concrete account (empty selector, unknown id/name, or a selector whose
 * fields disagree with each other). This is an input-validation problem, not
 * an authorization outcome — a caller denied access to another account's
 * resources gets a top-level GraphQL error, never this type.
 */
export type ResourceAccountResolutionProblem = {
  __typename?: 'ResourceAccountResolutionProblem';
  /** Reason the account could not be resolved */
  code: ResourceAccountResolutionProblemCode;
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
};

/** Reason an account reference could not be resolved */
export enum ResourceAccountResolutionProblemCode {
  /** No account exists with the given DID */
  AccountNotFoundById = 'ACCOUNT_NOT_FOUND_BY_ID',
  /** No account exists with the given name */
  AccountNotFoundByName = 'ACCOUNT_NOT_FOUND_BY_NAME',
  /** The reference has neither a DID nor a name to look up by */
  EmptySelector = 'EMPTY_SELECTOR',
  /** The resolved account does not match the other given fields */
  SelectorMismatch = 'SELECTOR_MISMATCH'
}

/** Outcome of applying one manifest of a batch */
export type ResourceApplyManifestItemResult = {
  __typename?: 'ResourceApplyManifestItemResult';
  /** Result of applying this manifest */
  outcome: ResourceApplyOutcome;
  /** Zero-based position of the manifest in the request */
  requestIndex: Scalars['Int']['output'];
};

/** All manifests of the batch were accepted */
export type ResourceApplyManifestsResult = {
  __typename?: 'ResourceApplyManifestsResult';
  /** Outcome for each manifest of the batch */
  items: Array<ResourceApplyManifestItemResult>;
};

/** Effect of an accepted apply on the resource */
export enum ResourceApplyOperation {
  /** A new resource was created */
  Created = 'CREATED',
  /** The manifest matched the existing resource, nothing changed */
  Untouched = 'UNTOUCHED',
  /** An existing resource's spec or headers changed */
  Updated = 'UPDATED'
}

/** Result of applying one manifest: success, rejection or a validation problem */
export type ResourceApplyOutcome = ResourceAccountResolutionProblem | ResourceApplyParseManifestProblem | ResourceApplyRejection | ResourceApplySuccess | ResourceInvalidHeaderProblem | ResourceInvalidSpecProblem | ResourceUnsupportedDescriptorProblem;

/** The manifest text could not be parsed (malformed JSON/YAML). */
export type ResourceApplyParseManifestProblem = {
  __typename?: 'ResourceApplyParseManifestProblem';
  /** Human-readable description of the parse error */
  message: Scalars['String']['output'];
};

/** The resource type refused the requested change */
export type ResourceApplyRejection = {
  __typename?: 'ResourceApplyRejection';
  /** Kind of rule the change violated */
  category: ResourceApplyRejectionCategory;
  /** Human-readable reason for the rejection */
  message: Scalars['String']['output'];
};

/** Reason a resource manifest was rejected */
export enum ResourceApplyRejectionCategory {
  /** The spec violates a rule of the resource type */
  BusinessValidationFailed = 'BUSINESS_VALIDATION_FAILED',
  /** The manifest changes a field that cannot be modified after creation */
  ImmutableFieldChanged = 'IMMUTABLE_FIELD_CHANGED',
  /** The change conflicts with the resource's current lifecycle state */
  LifecycleRuleConflict = 'LIFECYCLE_RULE_CONFLICT',
  /** The spec refers to an object that does not exist */
  ReferencedObjectMissing = 'REFERENCED_OBJECT_MISSING'
}

/**
 * An accepted apply, reported as the canonical manifest on each side rather
 * than a pre-computed change list: clients decide how to diff and display it.
 */
export type ResourceApplySuccess = {
  __typename?: 'ResourceApplySuccess';
  /**
   * Canonical manifest the apply produced (or would produce). Always present
   * on an accepted apply.
   */
  after: Scalars['JSON']['output'];
  /**
   * Canonical manifest before the apply. Null **iff** the resource is being
   * created.
   */
  before?: Maybe<Scalars['JSON']['output']>;
  /** Whether the resource was created, updated or left unchanged */
  operation: ResourceApplyOperation;
  /** Resource as it is (or would be, on a dry run) after the apply */
  resource: Resource;
  /** Non-fatal issues found in the manifest */
  warnings: Array<ResourceApplyWarning>;
};

/** Non-fatal issue found while applying a manifest */
export type ResourceApplyWarning = {
  __typename?: 'ResourceApplyWarning';
  /** Machine-readable warning code, e.g. `missing_description` */
  code: Scalars['String']['output'];
  /** Human-readable description of the warning */
  message: Scalars['String']['output'];
  /** Dotted path to the manifest field concerned, null if not field-specific */
  path?: Maybe<Scalars['String']['output']>;
};

/** A page of `ResourceSummary` items */
export type ResourceConnection = {
  __typename?: 'ResourceConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<ResourceEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<ResourceSummary>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** Result of deleting resources by reference */
export type ResourceDeleteOutcome = ResourceAccountResolutionProblem | ResourceDeleteResult | ResourceUnsupportedSelectorProblem;

/**
 * Resources whose deletion was requested and references that could not be
 * resolved
 */
export type ResourceDeleteResult = {
  __typename?: 'ResourceDeleteResult';
  /** References that could not be resolved */
  problems: Array<BatchResourceProblem>;
  /** Resources whose deletion was requested */
  resources: Array<ResourceDeleteSuccess>;
};

/** Resource whose deletion was requested for one reference of a batch */
export type ResourceDeleteSuccess = {
  __typename?: 'ResourceDeleteSuccess';
  /** `DELETING` while controllers clean up, `DELETED` once they finished */
  phase: ResourcePhase;
  /** Zero-based position of the reference in the request */
  requestIndex: Scalars['Int']['output'];
  /** Unique identifier of the resource */
  resourceId: Scalars['ResourceID']['output'];
};

/** An edge wrapping a single `ResourceSummary` item */
export type ResourceEdge = {
  __typename?: 'ResourceEdge';
  /** The item itself */
  node: ResourceSummary;
};

/** A reference that named neither an id nor a name. */
export type ResourceEmptyRefProblem = {
  __typename?: 'ResourceEmptyRefProblem';
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
};

/**
 * Link to another resolved resource.
 *
 * Schema: https://opendatafabric.org/schemas/resources/v1alpha1/ResourceHandle
 */
export type ResourceHandle = {
  __typename?: 'ResourceHandle';
  /** Account that owns the target resource. */
  account: ResourceOwnerHandle;
  /** DID of the resource, if applicable. */
  did?: Maybe<Scalars['Did']['output']>;
  /** ID of the resource within a node. */
  id: Scalars['ResourceID']['output'];
  /** Name of a resource. */
  name: Scalars['ResourceName']['output'];
  /** Type URI of the target resource. */
  type: Scalars['TypeUri']['output'];
};

/** A page of `ResourceHandle` items */
export type ResourceHandleConnection = {
  __typename?: 'ResourceHandleConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<ResourceHandleEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<ResourceHandle>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `ResourceHandle` item */
export type ResourceHandleEdge = {
  __typename?: 'ResourceHandleEdge';
  /** The item itself */
  node: ResourceHandle;
};

/** Result of listing resource handles by selectors */
export type ResourceHandleListOutcome = ResourceAccountResolutionProblem | ResourceHandleConnection | ResourceInvalidLabelFilterProblem | ResourceUnsupportedSelectorProblem;

/** Kind of resource header validation failure */
export enum ResourceHeaderValidationProblemCode {
  /** The same annotation key appears more than once */
  DuplicateAnnotationKey = 'DUPLICATE_ANNOTATION_KEY',
  /** The same label key appears more than once */
  DuplicateLabelKey = 'DUPLICATE_LABEL_KEY',
  /** Resource name is empty */
  EmptyName = 'EMPTY_NAME',
  /** Resource name has an invalid format */
  InvalidName = 'INVALID_NAME',
  /** Resource name exceeds the maximum length */
  NameTooLong = 'NAME_TOO_LONG',
  /**
   * A label or annotation key could not be resolved to a registered
   * extension schema, or its value is invalid for it
   */
  ResourceExtensionSchema = 'RESOURCE_EXTENSION_SCHEMA',
  /** Number of annotations exceeds the maximum */
  TooManyAnnotations = 'TOO_MANY_ANNOTATIONS',
  /** Number of labels exceeds the maximum */
  TooManyLabels = 'TOO_MANY_LABELS'
}

/**
 * Container for identity and ownership information of a resource.
 *
 * Schema: https://opendatafabric.org/schemas/resources/v1alpha1/ResourceHeaders
 */
export type ResourceHeaders = {
  __typename?: 'ResourceHeaders';
  /** Link to the account that owns the resource. */
  account: ResourceOwnerHandle;
  /**
   * Annotations is a key value map stored with a resource that may be set by external tools to
   * store and retrieve arbitrary metadata. Unlike labels, annotations are not indexed and
   * cannot be queried by.
   */
  annotations: Scalars['ResourceAnnotations']['output'];
  /** Time when the resource was first applied and assigned an identity. */
  createdAt: Scalars['DateTime']['output'];
  /** Time when the resource was deleted. */
  deletedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Time when deletion of the resource was requested. The resource remains visible until its
   * controllers finish cleaning up and the deletion completes.
   */
  deletionRequestedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * A sequential number that changes every time the resource header and spec are updated. Does
   * not increment on status changes, thus signifying changes to the desired state. Populated by
   * the system. Starts with `1`.
   */
  generation: Scalars['Uint64']['output'];
  /**
   * Unique identifier of a resource within entire ODF node. Automatically assigned upon
   * resource creation.
   */
  id: Scalars['ResourceID']['output'];
  /**
   * Map of string keys and values that can be used to organize, categorize, and query
   * resources.
   */
  labels: Scalars['ResourceLabels']['output'];
  /** Symbolic name of a resource that identifies it within a scope of an onwing account. */
  name: Scalars['ResourceName']['output'];
  /**
   * References to resources that created this resource. Used for lineage tracking and cascading
   * cleanup.
   */
  ownerReferences?: Maybe<Array<ResourceHandle>>;
  /**
   * A sequential number that changes every time the resource status is updated. Can be passed
   * back as a precondition of a status update to make sure the status was not modified since it
   * was read. Populated by the system. Starts with `1`.
   */
  statusGeneration: Scalars['Uint64']['output'];
  /** Time when the resource was last updated, including header, spec, and status updates. */
  updatedAt: Scalars['DateTime']['output'];
};

/** No resource exists with the referenced ID */
export type ResourceIdNotFoundProblem = {
  __typename?: 'ResourceIDNotFoundProblem';
  /** ID that was not found */
  id: Scalars['ResourceID']['output'];
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
};

/** A header field value (e.g. name, label key) failed validation. */
export type ResourceInvalidHeaderProblem = {
  __typename?: 'ResourceInvalidHeaderProblem';
  /** Which header rule was violated */
  code: ResourceHeaderValidationProblemCode;
  /** Human-readable description of the violation */
  message: Scalars['String']['output'];
};

/** A selector's `labels` could not be resolved into a matchable filter. */
export type ResourceInvalidLabelFilterProblem = {
  __typename?: 'ResourceInvalidLabelFilterProblem';
  /** Reason the label filter was rejected */
  code: ResourceLabelFilterProblemCode;
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
};

/** The `spec` field failed domain validation. */
export type ResourceInvalidSpecProblem = {
  __typename?: 'ResourceInvalidSpecProblem';
  /** Human-readable description of the validation failure */
  message: Scalars['String']['output'];
  /** Schema URI of the resource type whose spec was rejected */
  schema: Scalars['TypeUri']['output'];
};

/** One authored `key = value` label predicate. */
export type ResourceLabelFilterEntryInput = {
  /** Label key to match */
  key: Scalars['String']['input'];
  /** Required label value, must be a string */
  value: Scalars['JSON']['input'];
};

/**
 * Selects resources by label predicates.
 * A list preserves duplicate keys for validation.
 */
export type ResourceLabelFilterInput = {
  /** Predicates that must all hold, each key at most once */
  entries: Array<ResourceLabelFilterEntryInput>;
};

/** Reason a label filter was rejected */
export enum ResourceLabelFilterProblemCode {
  /** Two different keys resolve to the same canonical label */
  DuplicateAfterCanonicalization = 'DUPLICATE_AFTER_CANONICALIZATION',
  /** A label key could not be parsed */
  InvalidKey = 'INVALID_KEY',
  /** A label value is not a string */
  NonStringValue = 'NON_STRING_VALUE',
  /**
   * A label key could not be resolved to a registered extension schema
   * applicable to the resource type, or its value is invalid for it
   */
  ResourceExtensionSchema = 'RESOURCE_EXTENSION_SCHEMA',
  /** The filter uses an expression that is not supported */
  UnsupportedExpression = 'UNSUPPORTED_EXPRESSION'
}

/** Data type of a list column's values */
export enum ResourceListColumnDataType {
  /** Boolean value, read from `boolValue` */
  Bool = 'BOOL',
  /** Text value, read from `stringValue` */
  String = 'STRING',
  /** Unsigned 64-bit integer, read from `uint64Value` */
  UInt_64 = 'U_INT_64'
}

/** Type-specific column to show when listing resources */
export type ResourceListColumnDescriptor = {
  __typename?: 'ResourceListColumnDescriptor';
  /** Data type of the column's values */
  dataType: ResourceListColumnDataType;
  /** Column title to display */
  header: Scalars['String']['output'];
  /** Column key, matching `ResourceListColumnValueView.key` */
  key: Scalars['String']['output'];
  /** When the column is shown */
  visibility: ResourceListColumnVisibility;
};

/** Value of one list column for a resource; exactly one value field is set */
export type ResourceListColumnValueView = {
  __typename?: 'ResourceListColumnValueView';
  /** Value of a `BOOL` column, null otherwise */
  boolValue?: Maybe<Scalars['Boolean']['output']>;
  /** Key of the column this value belongs to */
  key: Scalars['String']['output'];
  /** Value of a `STRING` column, null otherwise */
  stringValue?: Maybe<Scalars['String']['output']>;
  /** Value of a `U_INT_64` column, null otherwise */
  uint64Value?: Maybe<Scalars['Uint64']['output']>;
};

/** When a list column is shown */
export enum ResourceListColumnVisibility {
  /** Shown in every listing */
  Default = 'DEFAULT',
  /** Shown only in the wide listing */
  WideOnly = 'WIDE_ONLY'
}

/** Result of listing resources by selectors */
export type ResourceListOutcome = ResourceAccountResolutionProblem | ResourceConnection | ResourceInvalidLabelFilterProblem | ResourceUnsupportedSelectorProblem;

/** Reason a resource reference could not be resolved */
export type ResourceLookupProblem = ResourceEmptyRefProblem | ResourceIdNotFoundProblem | ResourceNameMismatchProblem | ResourceNameNotFoundProblem | ResourceSchemaMismatchProblem | ResourceUntypedNameProblem;

/** Text format of a resource manifest */
export enum ResourceManifestFormat {
  /** JSON document */
  Json = 'JSON',
  /** YAML document */
  Yaml = 'YAML'
}

/**
 * A reference supplied both an `id` and a `name` that name different
 * resources. The pair is a consistency assertion, so the mismatch fails the
 * entry rather than letting the `id` silently win.
 */
export type ResourceNameMismatchProblem = {
  __typename?: 'ResourceNameMismatchProblem';
  /** Actual name of the resource with that ID */
  actualName: Scalars['ResourceName']['output'];
  /** Name given in the reference */
  expectedName: Scalars['ResourceName']['output'];
  /** ID given in the reference */
  id: Scalars['ResourceID']['output'];
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
};

/** No resource of the referenced type has the referenced name */
export type ResourceNameNotFoundProblem = {
  __typename?: 'ResourceNameNotFoundProblem';
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
  /** Name that was not found */
  name: Scalars['ResourceName']['output'];
  /** Resource type that was searched */
  typeName: Scalars['TypeName']['output'];
};

/**
 * Link to a resolved account that can own resources: `User`, `Organization`, or `Node`.
 *
 * Schema: https://opendatafabric.org/schemas/auth/v1alpha1/ResourceOwnerHandle
 */
export type ResourceOwnerHandle = {
  __typename?: 'ResourceOwnerHandle';
  /** DID of the account. */
  did: Scalars['AccountID']['output'];
  /** ID of the account resource. */
  id: Scalars['ResourceID']['output'];
  /** Name of the account. */
  name: Scalars['AccountName']['output'];
};

/**
 * Reference to an account, mirroring the ODF `auth/v1alpha1/ResourceOwnerRef`.
 *
 * Resolves by `did` if given, else by `name`; any other field present is then
 * checked for agreement, so a mismatch is reported rather than ignored.
 */
export type ResourceOwnerRefInput = {
  /** Account DID, used for lookup when given */
  did?: InputMaybe<Scalars['AccountID']['input']>;
  /** Resource ID of the account, only checked for agreement */
  id?: InputMaybe<Scalars['ResourceID']['input']>;
  /** Account name, used for lookup when `did` is absent */
  name?: InputMaybe<Scalars['AccountName']['input']>;
};

/**
 * Represents the reconciliation or deletion phase of a resource.
 *
 * Schema: https://opendatafabric.org/schemas/resources/v1alpha1/ResourcePhase
 */
export enum ResourcePhase {
  Degraded = 'DEGRADED',
  Deleted = 'DELETED',
  Deleting = 'DELETING',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Ready = 'READY',
  Reconciling = 'RECONCILING'
}

/** Number of resources in each phase */
export type ResourcePhaseCounts = {
  __typename?: 'ResourcePhaseCounts';
  /** Resources whose last reconcile failed after an earlier success */
  degraded: Scalars['Uint64']['output'];
  /** Resources whose deletion waits for their controllers to clean up */
  deleting: Scalars['Uint64']['output'];
  /** Resources that failed and were never reconciled */
  failed: Scalars['Uint64']['output'];
  /** Resources waiting to be reconciled */
  pending: Scalars['Uint64']['output'];
  /** Resources whose latest generation is reconciled */
  ready: Scalars['Uint64']['output'];
  /** Resources being reconciled */
  reconciling: Scalars['Uint64']['output'];
};

/**
 * Reference to one resource, mirroring the ODF `ResourceRef`. A name matches
 * the live resource holding it; with `includeDeleting` it also matches
 * resources being deleted, so it may resolve to several.
 *
 * A resource is addressed either by `id`, or by `type` **and** `name` — ODF's
 * uniqueness key is `(account, type, name)`, and resources of different types
 * may share a name under one account, so a name alone does not identify
 * anything (RFC-018 § References).
 *
 * Not a `oneOf`: ODF allows `id` and `name` together as a consistency
 * assertion, so both are accepted. Validation happens at conversion rather
 * than in the schema, which cannot express "at least one of".
 *
 * To match resources *without* knowing their type, use a selector
 * (`bySelectors`): selectors ask which resources match and may span every
 * type, while a ref names one resource.
 */
export type ResourceRefInput = {
  /** Account owning the resource, defaults to the calling account */
  account?: InputMaybe<ResourceOwnerRefInput>;
  /** Unique identifier of the resource */
  id?: InputMaybe<Scalars['ResourceID']['input']>;
  /** Exact name. Never a pattern; use a selector for pattern matching. */
  name?: InputMaybe<Scalars['ResourceName']['input']>;
  /**
   * Canonical selector (`variablesets`), alias (`vs`), ODF type name
   * (`VariableSet`), or full schema URI — all resolve to the same type.
   *
   * Required when addressing by `name`, since a name is unique only within
   * one type. May be omitted only when `id` is given, which identifies a
   * resource on its own.
   */
  type?: InputMaybe<ResourceTypeSelectorInput>;
};

/** Resource rendered as a manifest document */
export type ResourceRenderManifestResult = {
  __typename?: 'ResourceRenderManifestResult';
  /** Format the manifest text is in */
  format: ResourceManifestFormat;
  /** Manifest text */
  manifest: Scalars['String']['output'];
};

/** The resource with the referenced ID is of a different type than requested */
export type ResourceSchemaMismatchProblem = {
  __typename?: 'ResourceSchemaMismatchProblem';
  /** Schema URI of the resource's actual type */
  actualSchema: Scalars['TypeUri']['output'];
  /** Schema URI of the requested type */
  expectedSchema: Scalars['TypeUri']['output'];
  /** ID of the resource found */
  id: Scalars['ResourceID']['output'];
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
};

/**
 * Matches zero or many resources, mirroring the ODF `ResourceSelector`.
 *
 * Several selectors in one call act as a logical OR, which is what lets a
 * single call span resource types. Every field is optional: a selector with no
 * `type` spans every type, and one narrowing by nothing matches all of them.
 */
export type ResourceSelectorInput = {
  /**
   * The account this selector spans. Defaults to the calling subject's own
   * when unset, so one call can span several accounts — subject to the
   * caller being authorized for each; any denial fails the whole call.
   *
   * ODF specifies this field for selectors embedded in a manifest (RFC-018
   * § Selectors), which have no call to inherit an account from; using it as
   * a per-selector override within a query extends beyond that.
   */
  account?: InputMaybe<ResourceOwnerRefInput>;
  /** Matches only the resource with this ID */
  id?: InputMaybe<Scalars['ResourceID']['input']>;
  /**
   * Labels this selector requires, all of which must be present. Applies to
   * this selector alone, so one call may filter differently per type.
   * Values must be strings — only string-valued labels are indexed.
   */
  labels?: InputMaybe<ResourceLabelFilterInput>;
  /**
   * Name pattern in SQL `LIKE` format, per the ODF schema. Only `%` acts as
   * a wildcard — `_` is escaped to a literal underscore. A pattern with no
   * `%` matches that name exactly.
   */
  name?: InputMaybe<Scalars['String']['input']>;
  /**
   * Canonical selector (`variablesets`), alias (`vs`), ODF type name
   * (`VariableSet`), or full schema URI. `null` spans every type.
   */
  type?: InputMaybe<ResourceTypeSelectorInput>;
};

/**
 * Resource lifecycle and reconciliation information.
 *
 * Schema: https://opendatafabric.org/schemas/resources/v1alpha1/ResourceStatus
 */
export type ResourceStatus = {
  __typename?: 'ResourceStatus';
  /** Detailed conditions describing the state of the resource that are added by controllers. */
  conditions: Scalars['ResourceConditions']['output'];
  /** Time when the controller seen the resource state as defined in `observedGeneration`. */
  observedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Resource generation that was last seen by the main resource controller. */
  observedGeneration?: Maybe<Scalars['Uint64']['output']>;
  /** Represents the reconciliation phase of a resource as seen by the main resource controller. */
  phase: ResourcePhase;
  /**
   * Time when the controller last reconciled the desired resource state as defined in
   * `reconciledGeneration`.
   */
  reconciledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Resource generation that was last successfully reconciled by the main resource controller. */
  reconciledGeneration?: Maybe<Scalars['Uint64']['output']>;
};

/** Condensed reconciliation status of a resource */
export type ResourceStatusSummary = {
  __typename?: 'ResourceStatusSummary';
  /** Time the controller observed `observedGeneration` */
  observedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Generation last seen by the controller, null if never observed */
  observedGeneration?: Maybe<Scalars['Uint64']['output']>;
  /** Current reconciliation phase */
  phase?: Maybe<ResourcePhase>;
  /** Time `reconciledGeneration` was reconciled */
  reconciledAt?: Maybe<Scalars['DateTime']['output']>;
  /** Generation last successfully reconciled, null if never reconciled */
  reconciledGeneration?: Maybe<Scalars['Uint64']['output']>;
};

/** Condensed view of a resource for listings */
export type ResourceSummary = {
  __typename?: 'ResourceSummary';
  /** Time the resource was created */
  createdAt: Scalars['DateTime']['output'];
  /** Description from the resource annotations, null if not set */
  description?: Maybe<Scalars['String']['output']>;
  /** Revision of the desired state, bumped on each spec or headers change */
  generation: Scalars['Uint64']['output'];
  /** Unique and stable identifier of the resource */
  id: Scalars['ResourceID']['output'];
  /** Values of the type-specific list columns */
  listValues: Array<ResourceListColumnValueView>;
  /** Name of the resource, unique within its type and account */
  name: Scalars['ResourceName']['output'];
  /** Schema URI of the resource type */
  schema: Scalars['TypeUri']['output'];
  /** Reconciliation status, null if not yet recorded */
  status?: Maybe<ResourceStatusSummary>;
  /** Time the resource was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

/** Resource counts for one resource type */
export type ResourceTypeCountSummary = {
  __typename?: 'ResourceTypeCountSummary';
  /** Number of resources of this type in each phase */
  phaseCounts: ResourcePhaseCounts;
  /** Schema URI of the resource type */
  schema: Scalars['TypeUri']['output'];
  /** Number of resources of this type */
  totalCount: Scalars['Uint64']['output'];
  /** ODF type name of the resource type, e.g. `VariableSet` */
  typeName: Scalars['TypeName']['output'];
};

/** Registered resource type with its selectors and list columns */
export type ResourceTypeDescriptor = {
  __typename?: 'ResourceTypeDescriptor';
  /** Main selector name of the type, e.g. `variablesets` */
  canonicalSelector: Scalars['ResourceSelectorName']['output'];
  /** Type-specific columns to show when listing resources */
  listColumns: Array<ResourceListColumnDescriptor>;
  /** Schema URI identifying the type */
  schema: Scalars['TypeUri']['output'];
  /** Short alternative selector names, e.g. `vs` */
  selectorAliases: Array<Scalars['ResourceSelectorName']['output']>;
};

/** Identifies a resource type by selector, alias, ODF type name or schema URI */
export type ResourceTypeSelectorInput = {
  /**
   * Canonical selector (`variablesets`), alias (`vs`), ODF type name
   * (`VariableSet`), or full schema URI
   */
  selector: Scalars['ResourceTypeSelectorRaw']['input'];
};

/**
 * A resource type was addressed by its canonical schema URI, but no descriptor
 * is registered for it. This is reachable *only* on the apply-manifest path,
 * where the `$schema` URI comes straight from the user's manifest; selector
 * lookups surface [`ResourceUnsupportedSelectorProblem`] instead, so this
 * field never carries a short selector masquerading as a URI.
 */
export type ResourceUnsupportedDescriptorProblem = {
  __typename?: 'ResourceUnsupportedDescriptorProblem';
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
  /** Schema URI that matched no registered type */
  schema: Scalars['TypeUri']['output'];
};

/**
 * A resource type was addressed by a short selector (main name or alias, e.g.
 * `vs`), but no descriptor matches it. The `selector` is the raw user-supplied
 * string — never a schema URI (the public API selects resource types by
 * selector).
 */
export type ResourceUnsupportedSelectorProblem = {
  __typename?: 'ResourceUnsupportedSelectorProblem';
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
  /** Selector as supplied by the caller */
  selector: Scalars['ResourceTypeSelectorRaw']['output'];
};

/**
 * A reference addressing by `name` without a `type`. A name is unique only
 * within one type, so the reference identifies nothing as posed.
 */
export type ResourceUntypedNameProblem = {
  __typename?: 'ResourceUntypedNameProblem';
  /** Human-readable description of the problem */
  message: Scalars['String']['output'];
};

/** Queries over declarative resources and their types */
export type Resources = {
  __typename?: 'Resources';
  /** Returns resources by refs */
  byRefs: BatchResourcesOutcome;
  /**
   * Returns resources matching the given selectors, which act as a logical
   * OR and may span several resource types and accounts
   */
  bySelectors: ResourceListOutcome;
  /** Returns resource handles by refs */
  handlesByRefs: BatchResourceHandlesOutcome;
  /** Returns resource handles matching the given selectors */
  handlesBySelectors: ResourceHandleListOutcome;
  /** Renders canonical manifest representations from stored resources */
  renderManifests: BatchResourceManifestsOutcome;
  /**
   * Returns a summary-oriented dashboard for the current or specified
   * subject
   */
  summary: ResourcesSummaryOutcome;
  /** Returns resource types supported by the current server */
  supportedResourceTypes: Array<ResourceTypeDescriptor>;
};


/** Queries over declarative resources and their types */
export type ResourcesByRefsArgs = {
  includeDeleting?: Scalars['Boolean']['input'];
  opts?: SpecViewOptsInput;
  resourceRefs: Array<ResourceRefInput>;
};


/** Queries over declarative resources and their types */
export type ResourcesBySelectorsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  query: SearchResourcesInput;
};


/** Queries over declarative resources and their types */
export type ResourcesHandlesByRefsArgs = {
  includeDeleting?: Scalars['Boolean']['input'];
  resourceRefs: Array<ResourceRefInput>;
};


/** Queries over declarative resources and their types */
export type ResourcesHandlesBySelectorsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  query: SearchResourcesInput;
};


/** Queries over declarative resources and their types */
export type ResourcesRenderManifestsArgs = {
  format: ResourceManifestFormat;
  includeDeleting?: Scalars['Boolean']['input'];
  opts?: SpecViewOptsInput;
  resourceRefs: Array<ResourceRefInput>;
};


/** Queries over declarative resources and their types */
export type ResourcesSummaryArgs = {
  account?: InputMaybe<ResourceOwnerRefInput>;
};

/** Mutations that create, update and delete declarative resources */
export type ResourcesMut = {
  __typename?: 'ResourcesMut';
  /**
   * Creates or updates a resource from a manifest, or only plans the
   * change when `dryRun` is set
   */
  applyManifest: ResourceApplyOutcome;
  /**
   * Applies several manifests atomically: if any item fails, the whole
   * request is rolled back and returned as an error
   */
  applyManifests: ResourceApplyManifestsResult;
  /**
   * Requests deletion of the resources identified by the given references.
   * Names match live resources only; an id also matches a resource being
   * deleted, which retries its cleanup
   */
  delete: ResourceDeleteOutcome;
};


/** Mutations that create, update and delete declarative resources */
export type ResourcesMutApplyManifestArgs = {
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  format: ResourceManifestFormat;
  manifest: Scalars['String']['input'];
};


/** Mutations that create, update and delete declarative resources */
export type ResourcesMutApplyManifestsArgs = {
  dryRun?: InputMaybe<Scalars['Boolean']['input']>;
  manifests: Array<ApplyManifestInput>;
};


/** Mutations that create, update and delete declarative resources */
export type ResourcesMutDeleteArgs = {
  resourceRefs: Array<ResourceRefInput>;
};

/** Resource counts of an account, per type */
export type ResourcesSummary = {
  __typename?: 'ResourcesSummary';
  /** Counts for each resource type */
  resourceCounts: Array<ResourceTypeCountSummary>;
};

/** Result of computing the resources summary of an account */
export type ResourcesSummaryOutcome = ResourceAccountResolutionProblem | ResourcesSummary;

/** REST API endpoints for a dataset */
export type RestProtocolDesc = {
  __typename?: 'RestProtocolDesc';
  /** URL of the endpoint that ingests data into the dataset */
  pushUrl: Scalars['String']['output'];
  /** Example URL of the SQL query endpoint */
  queryUrl: Scalars['String']['output'];
  /** Example URL fetching the latest records of the dataset */
  tailUrl: Scalars['String']['output'];
};

/** Outcome of resuming a webhook subscription */
export type ResumeWebhookSubscriptionResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Webhook subscription was resumed */
export type ResumeWebhookSubscriptionResultSuccess = ResumeWebhookSubscriptionResult & {
  __typename?: 'ResumeWebhookSubscriptionResultSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** Always true */
  resumed: Scalars['Boolean']['output'];
};

/** Operation is not allowed in the current subscription status */
export type ResumeWebhookSubscriptionResultUnexpected = ResumeWebhookSubscriptionResult & {
  __typename?: 'ResumeWebhookSubscriptionResultUnexpected';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Current status of the subscription */
  status: WebhookSubscriptionStatus;
};

/** Outcome of revoking an access token */
export type RevokeResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Access token was already revoked earlier */
export type RevokeResultAlreadyRevoked = RevokeResult & {
  __typename?: 'RevokeResultAlreadyRevoked';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** Identifier of the token */
  tokenId: Scalars['AccessTokenID']['output'];
};

/** Access token was revoked */
export type RevokeResultSuccess = RevokeResult & {
  __typename?: 'RevokeResultSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** Identifier of the revoked token */
  tokenId: Scalars['AccessTokenID']['output'];
};

/** Outcome of rotating a webhook subscription secret */
export type RotateWebhookSubscriptionSecretResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Subscription secret was rotated */
export type RotateWebhookSubscriptionSecretSuccess = RotateWebhookSubscriptionSecretResult & {
  __typename?: 'RotateWebhookSubscriptionSecretSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** New secret for verifying delivery signatures, returned only once */
  newSecret: Scalars['String']['output'];
};

/** Search over datasets and other objects managed by the node */
export type Search = {
  __typename?: 'Search';
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
   * Full-text search over datasets and accounts, listing all of them
   * sorted by title when the prompt is empty
   */
  queryFullText: FullTextSearchResponse;
  /**
   * Searches for datasets and other objects managed by the
   * current node using a prompt, mixing full-text and natural language
   * methods
   */
  queryHybrid: SearchResultExConnection;
  /**
   * Searches for datasets and other objects managed by the
   * current node using a prompt in natural language
   */
  queryNaturalLanguage: SearchResultExConnection;
};


/** Search over datasets and other objects managed by the node */
export type SearchNameLookupArgs = {
  filters: LookupFilters;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


/** Search over datasets and other objects managed by the node */
export type SearchQueryArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


/** Search over datasets and other objects managed by the node */
export type SearchQueryFullTextArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
};


/** Search over datasets and other objects managed by the node */
export type SearchQueryHybridArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
};


/** Search over datasets and other objects managed by the node */
export type SearchQueryNaturalLanguageArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  prompt: Scalars['String']['input'];
};

/** Kind of entity indexed for search */
export enum SearchEntityName {
  /** Account search index */
  Accounts = 'ACCOUNTS',
  /** Dataset search index */
  Datasets = 'DATASETS'
}

/**
 * Selects resources to search, for both `search` and `searchHandles` — only
 * the response shape differs.
 *
 * Every narrowing lives on the selectors, accounts included: there is no
 * call-level `account` or `labelFilter`. A uniform filter is the special case
 * where every selector carries the same one, and selectors being OR'd makes
 * that exactly equivalent.
 */
export type SearchResourcesInput = {
  /** Also match resources whose deletion is in progress */
  includeDeleting?: Scalars['Boolean']['input'];
  /**
   * Several selectors act as a logical OR, while the fields within one are a
   * conjunction. Omitted spans every type; an empty list matches nothing — a
   * narrowing to zero, not a widening to everything.
   */
  selectors?: InputMaybe<Array<ResourceSelectorInput>>;
};

/** Object found by a search */
export type SearchResult = Dataset;

/** A page of `SearchResult` items */
export type SearchResultConnection = {
  __typename?: 'SearchResultConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<SearchResultEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<SearchResult>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `SearchResult` item */
export type SearchResultEdge = {
  __typename?: 'SearchResultEdge';
  /** The item itself */
  node: SearchResult;
};

/** Object found by a search, with its relevance score */
export type SearchResultEx = {
  __typename?: 'SearchResultEx';
  /** Found object */
  item: SearchResult;
  /** Relevance score, higher is more relevant */
  score: Scalars['Float']['output'];
};

/** A page of `SearchResultEx` items */
export type SearchResultExConnection = {
  __typename?: 'SearchResultExConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<SearchResultExEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<SearchResultEx>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `SearchResultEx` item */
export type SearchResultExEdge = {
  __typename?: 'SearchResultExEdge';
  /** The item itself */
  node: SearchResultEx;
};

/**
 * Establishes the identity of the dataset. Always the first metadata event in the chain.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/Seed
 */
export type Seed = {
  __typename?: 'Seed';
  /** Unique identity of the dataset. */
  datasetId: Scalars['DatasetID']['output'];
  /** Type of the dataset. */
  datasetKind: DatasetKind;
};

/** New quota values of an account */
export type SetAccountQuotasInput = {
  /** Storage quotas to set */
  storage?: InputMaybe<SetAccountQuotasStorageInput>;
};

/** Outcome of setting account quotas */
export type SetAccountQuotasResult = {
  /** Whether the quotas were set */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message, empty on success */
  message: Scalars['String']['output'];
};

/** Account quotas were not set: the input is invalid */
export type SetAccountQuotasResultInvalidInput = SetAccountQuotasResult & {
  __typename?: 'SetAccountQuotasResultInvalidInput';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Description of what is wrong with the input */
  message: Scalars['String']['output'];
};

/** Account quotas were set */
export type SetAccountQuotasResultSuccess = SetAccountQuotasResult & {
  __typename?: 'SetAccountQuotasResultSuccess';
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message, empty on success */
  message: Scalars['String']['output'];
};

/** Storage quota values of an account */
export type SetAccountQuotasStorageInput = {
  /** Maximum total size of stored data in bytes; required */
  limitTotalBytes?: InputMaybe<Scalars['Int']['input']>;
};

/**
 * Associates a set of files with this dataset.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/SetAttachments
 */
export type SetAttachments = {
  __typename?: 'SetAttachments';
  /** One of the supported attachment sources. */
  attachments: Attachments;
};

export type SetDataSchema = {
  __typename?: 'SetDataSchema';
  schema: DataSchema;
};


export type SetDataSchemaSchemaArgs = {
  format?: InputMaybe<DataSchemaFormat>;
};

/** Outcome of changing dataset visibility */
export type SetDatasetVisibilityResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Dataset visibility was changed */
export type SetDatasetVisibilityResultSuccess = SetDatasetVisibilityResult & {
  __typename?: 'SetDatasetVisibilityResultSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of setting a flow configuration */
export type SetFlowConfigResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Flow configuration was set */
export type SetFlowConfigSuccess = SetFlowConfigResult & {
  __typename?: 'SetFlowConfigSuccess';
  /** Configuration that is now in effect */
  config: FlowConfiguration;
  /** Human-readable success message */
  message: Scalars['String']['output'];
};

/** Outcome of setting a flow trigger */
export type SetFlowTriggerResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Flow trigger was set */
export type SetFlowTriggerSuccess = SetFlowTriggerResult & {
  __typename?: 'SetFlowTriggerSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** Trigger that is now in effect */
  trigger: FlowTrigger;
};

/**
 * Provides basic human-readable information about a dataset.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/SetInfo
 */
export type SetInfo = {
  __typename?: 'SetInfo';
  /** Brief single-sentence summary of a dataset. */
  description?: Maybe<Scalars['String']['output']>;
  /** Keywords, search terms, or tags used to describe the dataset. */
  keywords?: Maybe<Array<Scalars['String']['output']>>;
};

/**
 * Defines a license that applies to this dataset.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/SetLicense
 */
export type SetLicense = {
  __typename?: 'SetLicense';
  /** Full name of the license. */
  name: Scalars['String']['output'];
  /** Abbreviated name of the license. */
  shortName: Scalars['String']['output'];
  /** License identifier from the SPDX License List. */
  spdxId?: Maybe<Scalars['String']['output']>;
  /** URL where licensing terms can be found. */
  websiteUrl: Scalars['String']['output'];
};

/**
 * Contains information on how externally-hosted data can be ingested into the root dataset.
 *
 * Schema: https://opendatafabric.org/schemas/legacy/v0/SetPollingSource
 */
export type SetPollingSource = {
  __typename?: 'SetPollingSource';
  /** Determines where data is sourced from. */
  fetch: FetchStep;
  /** Determines how newly-ingested data should be merged with existing history. */
  merge: MergeStrategy;
  /** Defines how raw data is prepared before reading. */
  prepare?: Maybe<Array<PrepStep>>;
  /** Pre-processing query that shapes the data. */
  preprocess?: Maybe<Transform>;
  /** Defines how data is read into structured format. */
  read: ReadStep;
};

/** Outcome of granting a dataset role to an account */
export type SetRoleResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Role was granted */
export type SetRoleResultSuccess = SetRoleResult & {
  __typename?: 'SetRoleResultSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/**
 * Defines a transformation that produces data in a derivative dataset.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/SetTransform
 */
export type SetTransform = {
  __typename?: 'SetTransform';
  /** Datasets that will be used as sources. */
  inputs: Array<TransformInput>;
  /** Transformation that will be applied to produce new data. */
  transform: Transform;
};

/**
 * Lets you manipulate names of the system columns to avoid conflicts.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/SetVocab
 */
export type SetVocab = {
  __typename?: 'SetVocab';
  /** Name of the event time column. */
  eventTimeColumn?: Maybe<Scalars['String']['output']>;
  /** Name of the offset column. */
  offsetColumn?: Maybe<Scalars['String']['output']>;
  /** Name of the operation type column. */
  operationTypeColumn?: Maybe<Scalars['String']['output']>;
  /** Name of the system time column. */
  systemTimeColumn?: Maybe<Scalars['String']['output']>;
};

/** Watermark cannot be set manually on a derivative dataset */
export type SetWatermarkIsDerivative = SetWatermarkResult & {
  __typename?: 'SetWatermarkIsDerivative';
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Outcome of advancing the dataset watermark */
export type SetWatermarkResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Watermark already had the requested value */
export type SetWatermarkUpToDate = SetWatermarkResult & {
  __typename?: 'SetWatermarkUpToDate';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Watermark was advanced */
export type SetWatermarkUpdated = SetWatermarkResult & {
  __typename?: 'SetWatermarkUpdated';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** Hash of the new metadata chain head */
  newHead: Scalars['Multihash']['output'];
};

/**
 * Defines how external data should be cached.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/SourceCaching
 */
export type SourceCaching = SourceCachingForever;

/**
 * After source was processed once it will never be ingested again.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/SourceCaching#/$defs/Forever
 */
export type SourceCachingForever = {
  __typename?: 'SourceCachingForever';
  dummy?: Maybe<Scalars['String']['output']>;
};

/**
 * Specifies how input files should be ordered before ingestion.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/SourceOrdering
 */
export enum SourceOrdering {
  ByEventTime = 'BY_EVENT_TIME',
  ByName = 'BY_NAME'
}

/**
 * The state of the source the data was added from to allow fast resuming.
 *
 * Schema: https://opendatafabric.org/schemas/sources/v1alpha1/SourceState
 */
export type SourceState = {
  __typename?: 'SourceState';
  /** Identifies the type of the state. Standard types include: `odf/etag`, `odf/last-modified`. */
  kind: Scalars['String']['output'];
  /** Identifies the source that the state corresponds to. */
  sourceName: Scalars['String']['output'];
  /** Opaque value representing the state. */
  value: Scalars['String']['output'];
};

/**
 * Options controlling how a resource's spec is rendered. A struct rather than
 * a bare `revealed: bool` argument, so future spec-view options can be added
 * here without growing the resolver's argument list.
 */
export type SpecViewOptsInput = {
  /**
   * Show actual (decrypted) secret values instead of ciphertext
   * placeholders.
   */
  revealed?: Scalars['Boolean']['input'];
};

/**
 * Defines a query in a multi-step SQL transformation.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/SqlQueryStep
 */
export type SqlQueryStep = {
  __typename?: 'SqlQueryStep';
  /**
   * Name of the temporary view that will be created from result of the query. Step without this
   * alias will be treated as an output of the transformation.
   */
  alias?: Maybe<Scalars['String']['output']>;
  /** SQL query the result of which will be exposed under the alias. */
  query: Scalars['String']['output'];
};

/** File is larger than the upload size limit */
export type StartUploadVersionErrorTooLarge = StartUploadVersionResult & {
  __typename?: 'StartUploadVersionErrorTooLarge';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Maximum allowed upload size, in bytes */
  uploadLimit: Scalars['Int']['output'];
  /** Size of the file, in bytes */
  uploadSize: Scalars['Int']['output'];
};

/** Outcome of starting a direct file upload */
export type StartUploadVersionResult = {
  /** Whether the operation succeeded */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Upload was started; describes how to send the content */
export type StartUploadVersionSuccess = StartUploadVersionResult & {
  __typename?: 'StartUploadVersionSuccess';
  /** HTTP headers to include in the upload request */
  headers: Array<KeyValue>;
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Always empty */
  message: Scalars['String']['output'];
  /** HTTP method to use for the upload */
  method: Scalars['String']['output'];
  /** Token to pass to `finishUploadNewVersion` once the upload completes */
  uploadToken: Scalars['String']['output'];
  /** URL to send the file content to */
  url: Scalars['String']['output'];
  /** Whether the content must be sent as a multipart form */
  useMultipart: Scalars['Boolean']['output'];
};

/** Unit of work executed on behalf of a flow */
export type Task = {
  __typename?: 'Task';
  /** Whether the task was ordered to be cancelled */
  cancellationRequested: Scalars['Boolean']['output'];
  /** Time when cancellation of task was requested */
  cancellationRequestedAt?: Maybe<Scalars['DateTime']['output']>;
  /** Time when task was originally created and placed in a queue */
  createdAt: Scalars['DateTime']['output'];
  /** Time when task has reached a final outcome */
  finishedAt?: Maybe<Scalars['DateTime']['output']>;
  /**
   * Describes a certain final outcome of the task once it reaches the
   * "finished" status
   */
  outcome?: Maybe<TaskOutcome>;
  /** Time when task transitioned into a running state */
  ranAt?: Maybe<Scalars['DateTime']['output']>;
  /** Life-cycle status of a task */
  status: TaskStatus;
  /** Unique and stable identifier of this task */
  taskId: Scalars['TaskID']['output'];
};

/** Cause of a task failure */
export type TaskFailureReason = TaskFailureReasonGeneral | TaskFailureReasonInputDatasetCompacted | TaskFailureReasonWebhookDeliveryProblem;

/** Task failed for a reason without a dedicated type */
export type TaskFailureReasonGeneral = {
  __typename?: 'TaskFailureReasonGeneral';
  /** Human-readable description of the failure */
  message: Scalars['String']['output'];
  /** Whether the failure is transient and the task may be retried */
  recoverable: Scalars['Boolean']['output'];
};

/** Transform failed because an input dataset was compacted */
export type TaskFailureReasonInputDatasetCompacted = {
  __typename?: 'TaskFailureReasonInputDatasetCompacted';
  /** Input dataset that was compacted */
  inputDataset: Dataset;
  /** Human-readable description of the failure */
  message: Scalars['String']['output'];
};

/** Webhook could not be delivered to its target */
export type TaskFailureReasonWebhookDeliveryProblem = {
  __typename?: 'TaskFailureReasonWebhookDeliveryProblem';
  /** Description of the delivery problem */
  message: Scalars['String']['output'];
  /** URL the delivery was sent to */
  targetUrl: Scalars['Url']['output'];
};

/** Describes a certain final outcome of the task */
export type TaskOutcome = TaskOutcomeCancelled | TaskOutcomeFailed | TaskOutcomeSuccess;

/** Task was cancelled before completing */
export type TaskOutcomeCancelled = {
  __typename?: 'TaskOutcomeCancelled';
  /** Human-readable cancellation message */
  message: Scalars['String']['output'];
};

/** Task failed */
export type TaskOutcomeFailed = {
  __typename?: 'TaskOutcomeFailed';
  /** Why the task failed */
  reason: TaskFailureReason;
};

/** Task completed successfully */
export type TaskOutcomeSuccess = {
  __typename?: 'TaskOutcomeSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
};

/** Life-cycle status of a task */
export enum TaskStatus {
  /** Task has reached a certain final outcome (see [`TaskOutcome`]) */
  Finished = 'FINISHED',
  /** Task is waiting for capacity to be allocated to it */
  Queued = 'QUEUED',
  /** Task is being executed */
  Running = 'RUNNING'
}

/**
 * Temporary Flink-specific extension for creating temporal tables from streams.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/TemporalTable
 */
export type TemporalTable = {
  __typename?: 'TemporalTable';
  /** Name of the dataset to be converted into a temporal table. */
  name: Scalars['String']['output'];
  /** Column names used as the primary key for creating a table. */
  primaryKey: Array<Scalars['String']['output']>;
};

/** Time interval expressed as a number of units */
export type TimeDelta = {
  __typename?: 'TimeDelta';
  /** Number of units in the interval */
  every: Scalars['Int']['output'];
  /** Unit of the interval */
  unit: TimeUnit;
};

/** Time interval expressed as a number of units */
export type TimeDeltaInput = {
  /** Number of units in the interval */
  every: Scalars['Int']['input'];
  /** Unit of the interval */
  unit: TimeUnit;
};

/** Unit of a time interval */
export enum TimeUnit {
  /** Days */
  Days = 'DAYS',
  /** Hours */
  Hours = 'HOURS',
  /** Minutes */
  Minutes = 'MINUTES',
  /** Weeks */
  Weeks = 'WEEKS'
}

/** Storage usage summed over a set of datasets */
export type TotalDatasetsStatistic = {
  __typename?: 'TotalDatasetsStatistic';
  /** Size of checkpoint files in bytes */
  totalCheckpointsSizeBytes: Scalars['Int']['output'];
  /** Size of data files in bytes */
  totalDataSizeBytes: Scalars['Int']['output'];
  /** Size of linked objects in bytes */
  totalLinkedObjectsSizeBytes: Scalars['Int']['output'];
  /** Number of linked objects */
  totalNumLinkedObjects: Scalars['Int']['output'];
  /** Number of data records */
  totalRecords: Scalars['Int']['output'];
  /** Size of data, checkpoints and linked objects together in bytes */
  totalSizeBytes: Scalars['Int']['output'];
};

/**
 * Engine-specific processing queries that shape the resulting data.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/Transform
 */
export type Transform = TransformSql;

export type TransformInput = {
  __typename?: 'TransformInput';
  alias: Scalars['String']['output'];
  datasetRef: Scalars['DatasetRef']['output'];
  inputDataset: TransformInputDataset;
};

/**
 * Describes a derivative transformation input
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/TransformInput
 */
export type TransformInputDataset = {
  message: Scalars['String']['output'];
};

export type TransformInputDatasetAccessible = TransformInputDataset & {
  __typename?: 'TransformInputDatasetAccessible';
  dataset: Dataset;
  message: Scalars['String']['output'];
};

export type TransformInputDatasetNotAccessible = TransformInputDataset & {
  __typename?: 'TransformInputDatasetNotAccessible';
  datasetRef: Scalars['DatasetRef']['output'];
  message: Scalars['String']['output'];
};

/**
 * Transform using one of the SQL dialects.
 *
 * Schema: https://opendatafabric.org/schemas/datasets/v1alpha1/Transform#/$defs/Sql
 */
export type TransformSql = {
  __typename?: 'TransformSql';
  engine: Scalars['String']['output'];
  queries: Array<SqlQueryStep>;
  temporalTables?: Maybe<Array<TemporalTable>>;
  version?: Maybe<Scalars['String']['output']>;
};

/** Outcome of manually triggering a flow */
export type TriggerFlowResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Flow was triggered */
export type TriggerFlowSuccess = TriggerFlowResult & {
  __typename?: 'TriggerFlowSuccess';
  /** Flow that was scheduled to run */
  flow: Flow;
  /** Human-readable success message */
  message: Scalars['String']['output'];
};

/** Outcome of revoking dataset roles from accounts */
export type UnsetRoleResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Roles were revoked */
export type UnsetRoleResultSuccess = UnsetRoleResult & {
  __typename?: 'UnsetRoleResultSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Email was not updated: it is already used by another account */
export type UpdateEmailNonUnique = UpdateEmailResult & {
  __typename?: 'UpdateEmailNonUnique';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Outcome of updating an account email */
export type UpdateEmailResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Account email was updated */
export type UpdateEmailSuccess = UpdateEmailResult & {
  __typename?: 'UpdateEmailSuccess';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
  /** New email of the account */
  newEmail: Scalars['String']['output'];
};

/** Outcome of updating the dataset readme */
export type UpdateReadmeResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Dataset head did not match the expected one, likely due to a concurrent update */
export type UpdateVersionErrorCasFailed = UpdateVersionResult & {
  __typename?: 'UpdateVersionErrorCasFailed';
  /** Current head block hash of the dataset */
  actualHead: Scalars['Multihash']['output'];
  /** Head block hash the caller expected */
  expectedHead: Scalars['Multihash']['output'];
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Extra data does not match the dataset schema */
export type UpdateVersionErrorInvalidExtraData = UpdateVersionResult & {
  __typename?: 'UpdateVersionErrorInvalidExtraData';
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Reason the extra data was rejected */
  message: Scalars['String']['output'];
};

/** Update would exceed the storage quota of the account */
export type UpdateVersionErrorQuotaExceeded = UpdateVersionResult & {
  __typename?: 'UpdateVersionErrorQuotaExceeded';
  /** Size of the rejected content, in bytes; null if no quota is configured */
  incoming?: Maybe<Scalars['Int']['output']>;
  /** Always false */
  isSuccess: Scalars['Boolean']['output'];
  /** Storage limit, in bytes; null if no quota is configured */
  limit?: Maybe<Scalars['Int']['output']>;
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Storage already used, in bytes; null if no quota is configured */
  used?: Maybe<Scalars['Int']['output']>;
};

/** Outcome of creating a new file version */
export type UpdateVersionResult = {
  /** Whether the operation succeeded */
  isSuccess: Scalars['Boolean']['output'];
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** New file version was created */
export type UpdateVersionSuccess = UpdateVersionResult & {
  __typename?: 'UpdateVersionSuccess';
  /** Hash of the file content of the new version */
  contentHash: Scalars['Multihash']['output'];
  /** Always true */
  isSuccess: Scalars['Boolean']['output'];
  /** Always empty */
  message: Scalars['String']['output'];
  /** Hash of the metadata chain head after the update */
  newHead: Scalars['Multihash']['output'];
  /** Number of the created version */
  newVersion: Scalars['Int']['output'];
  /** Hash of the metadata chain head before the update */
  oldHead: Scalars['Multihash']['output'];
};

/** Outcome of updating a webhook subscription */
export type UpdateWebhookSubscriptionResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Webhook subscription was updated */
export type UpdateWebhookSubscriptionResultSuccess = UpdateWebhookSubscriptionResult & {
  __typename?: 'UpdateWebhookSubscriptionResultSuccess';
  /** Human-readable success message */
  message: Scalars['String']['output'];
  /** Always true */
  updated: Scalars['Boolean']['output'];
};

/** Operation is not allowed in the current subscription status */
export type UpdateWebhookSubscriptionResultUnexpected = UpdateWebhookSubscriptionResult & {
  __typename?: 'UpdateWebhookSubscriptionResultUnexpected';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Current status of the subscription */
  status: WebhookSubscriptionStatus;
};

/** Outcome of creating or updating an environment variable */
export type UpsertDatasetEnvVarResult = {
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Environment variable was created */
export type UpsertDatasetEnvVarResultCreated = UpsertDatasetEnvVarResult & {
  __typename?: 'UpsertDatasetEnvVarResultCreated';
  /** Created environment variable */
  envVar: ViewDatasetEnvVar;
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Environment variable was updated */
export type UpsertDatasetEnvVarResultUpdated = UpsertDatasetEnvVarResult & {
  __typename?: 'UpsertDatasetEnvVarResultUpdated';
  /** Updated environment variable */
  envVar: ViewDatasetEnvVar;
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Environment variable already had the requested value */
export type UpsertDatasetEnvVarUpToDate = UpsertDatasetEnvVarResult & {
  __typename?: 'UpsertDatasetEnvVarUpToDate';
  /** Human-readable outcome message */
  message: Scalars['String']['output'];
};

/** Versioned file archetype view of a dataset, where each version is a file */
export type VersionedFile = {
  __typename?: 'VersionedFile';
  /** Returns the specified entry by block or version number */
  asOf?: Maybe<VersionedFileEntry>;
  /** Returns the latest version entry, if any */
  latest?: Maybe<VersionedFileEntry>;
  /** Returns list of versions in reverse chronological order */
  versions: VersionedFileEntryConnection;
};


/** Versioned file archetype view of a dataset, where each version is a file */
export type VersionedFileAsOfArgs = {
  blockHash?: InputMaybe<Scalars['Multihash']['input']>;
  version?: InputMaybe<Scalars['Int']['input']>;
};


/** Versioned file archetype view of a dataset, where each version is a file */
export type VersionedFileVersionsArgs = {
  maxVersion?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
};

/** Information needed to download file content directly from storage */
export type VersionedFileContentDownload = {
  __typename?: 'VersionedFileContentDownload';
  /** Download URL expiration timestamp */
  expiresAt?: Maybe<Scalars['DateTime']['output']>;
  /** Headers to include in the request */
  headers: Array<KeyValue>;
  /** Direct download URL */
  url: Scalars['String']['output'];
};

/** Single version of a versioned file */
export type VersionedFileEntry = {
  __typename?: 'VersionedFileEntry';
  /**
   * Returns encoded content in-band. Should be used for small files only and
   * will return an error if called on large data.
   */
  content: Scalars['Base64Usnp']['output'];
  /** Multihash of the file content */
  contentHash: Scalars['Multihash']['output'];
  /** Size of the content in bytes */
  contentLength: Scalars['Int']['output'];
  /** Media type of the file content */
  contentType: Scalars['String']['output'];
  /** Returns a direct download URL */
  contentUrl: VersionedFileContentDownload;
  /** Event time when this version was created */
  eventTime: Scalars['DateTime']['output'];
  /** Extra data associated with this file version */
  extraData: Scalars['ExtraData']['output'];
  /** System time when this version was created */
  systemTime: Scalars['DateTime']['output'];
  /** File version */
  version: Scalars['Int']['output'];
};

/** A page of `VersionedFileEntry` items */
export type VersionedFileEntryConnection = {
  __typename?: 'VersionedFileEntryConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<VersionedFileEntryEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<VersionedFileEntry>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `VersionedFileEntry` item */
export type VersionedFileEntryEdge = {
  __typename?: 'VersionedFileEntryEdge';
  /** The item itself */
  node: VersionedFileEntry;
};

/** Mutations of a versioned file dataset */
export type VersionedFileMut = {
  __typename?: 'VersionedFileMut';
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


/** Mutations of a versioned file dataset */
export type VersionedFileMutFinishUploadNewVersionArgs = {
  expectedHead?: InputMaybe<Scalars['Multihash']['input']>;
  extraData?: InputMaybe<Scalars['ExtraData']['input']>;
  uploadToken: Scalars['String']['input'];
};


/** Mutations of a versioned file dataset */
export type VersionedFileMutStartUploadNewVersionArgs = {
  contentLength: Scalars['Int']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
};


/** Mutations of a versioned file dataset */
export type VersionedFileMutUpdateExtraDataArgs = {
  expectedHead?: InputMaybe<Scalars['Multihash']['input']>;
  extraData: Scalars['ExtraData']['input'];
};


/** Mutations of a versioned file dataset */
export type VersionedFileMutUploadNewVersionArgs = {
  content: Scalars['Base64Usnp']['input'];
  contentType?: InputMaybe<Scalars['String']['input']>;
  expectedHead?: InputMaybe<Scalars['Multihash']['input']>;
  extraData?: InputMaybe<Scalars['ExtraData']['input']>;
};

/** Access token as seen when listing tokens, without its secret value */
export type ViewAccessToken = {
  __typename?: 'ViewAccessToken';
  /** Access token account owner */
  account: Account;
  /** Date of token creation */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier of the access token */
  id: Scalars['AccessTokenID']['output'];
  /** Name of the access token */
  name: Scalars['String']['output'];
  /** Date of token revocation */
  revokedAt?: Maybe<Scalars['DateTime']['output']>;
};

/** Environment variable of a dataset */
export type ViewDatasetEnvVar = {
  __typename?: 'ViewDatasetEnvVar';
  /** Date of the dataset environment variable creation */
  createdAt: Scalars['DateTime']['output'];
  /** Whether the value is stored encrypted and hidden from listings */
  isSecret: Scalars['Boolean']['output'];
  /** Key of the dataset environment variable */
  key: Scalars['String']['output'];
  /** Non secret value of dataset environment variable */
  value?: Maybe<Scalars['String']['output']>;
};

/** A page of `ViewDatasetEnvVar` items */
export type ViewDatasetEnvVarConnection = {
  __typename?: 'ViewDatasetEnvVarConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<ViewDatasetEnvVarEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<ViewDatasetEnvVar>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `ViewDatasetEnvVar` item */
export type ViewDatasetEnvVarEdge = {
  __typename?: 'ViewDatasetEnvVarEdge';
  /** The item itself */
  node: ViewDatasetEnvVar;
};

/** WebSocket endpoint */
export type WebSocketProtocolDesc = {
  __typename?: 'WebSocketProtocolDesc';
  /** WebSocket connection URL */
  url: Scalars['String']['output'];
};

/** Webhook delivery process of a single subscription */
export type WebhookFlowSubProcess = {
  __typename?: 'WebhookFlowSubProcess';
  /** Identifier of the webhook subscription */
  id: Scalars['WebhookSubscriptionID']['output'];
  /** Subscription label, or its target URL when the label is empty */
  name: Scalars['String']['output'];
  /** Dataset the subscription belongs to, null for non-dataset subscriptions */
  parentDataset?: Maybe<Dataset>;
  /** Current state summary of the delivery process */
  summary: FlowProcessSummary;
};

/** A page of `WebhookFlowSubProcess` items */
export type WebhookFlowSubProcessConnection = {
  __typename?: 'WebhookFlowSubProcessConnection';
  /** Items of this page, each wrapped in an edge */
  edges: Array<WebhookFlowSubProcessEdge>;
  /** A shorthand for `edges { node { ... } }` */
  nodes: Array<WebhookFlowSubProcess>;
  /** Page information */
  pageInfo: PageBasedInfo;
  /** Approximate number of total nodes */
  totalCount: Scalars['Int']['output'];
};

/** An edge wrapping a single `WebhookFlowSubProcess` item */
export type WebhookFlowSubProcessEdge = {
  __typename?: 'WebhookFlowSubProcessEdge';
  /** The item itself */
  node: WebhookFlowSubProcess;
};

/** Webhook delivery processes of a dataset */
export type WebhookFlowSubProcessGroup = {
  __typename?: 'WebhookFlowSubProcessGroup';
  /** Aggregated state counts across the dataset's webhook processes */
  rollup: FlowProcessGroupRollup;
  /** Webhook delivery processes of the dataset, ordered by name */
  subprocesses: Array<WebhookFlowSubProcess>;
};

/** Subscription that delivers dataset events to a target URL */
export type WebhookSubscription = {
  __typename?: 'WebhookSubscription';
  /**
   * Associated dataset ID
   * Not present for system subscriptions
   */
  datasetId?: Maybe<Scalars['DatasetID']['output']>;
  /** List of events that trigger the webhook */
  eventTypes: Array<Scalars['String']['output']>;
  /** Unique identifier of the webhook subscription */
  id: Scalars['WebhookSubscriptionID']['output'];
  /** Optional label for the subscription. Maybe an empty string. */
  label: Scalars['String']['output'];
  /** Status of the subscription */
  status: WebhookSubscriptionStatus;
  /** Target URL for the webhook */
  targetUrl: Scalars['String']['output'];
};

/** Another subscription of the dataset already uses this label */
export type WebhookSubscriptionDuplicateLabel = CreateWebhookSubscriptionResult & UpdateWebhookSubscriptionResult & {
  __typename?: 'WebhookSubscriptionDuplicateLabel';
  /** Label that is already taken */
  label: Scalars['String']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Settings of a webhook subscription */
export type WebhookSubscriptionInput = {
  /** Event types to deliver, at least one is required */
  eventTypes: Array<Scalars['WebhookEventType']['input']>;
  /** Label to identify the subscription, unique within the dataset */
  label: Scalars['WebhookSubscriptionLabel']['input'];
  /** URL that receives webhook deliveries */
  targetUrl: Scalars['URL']['input'];
};

/** Target URL is not acceptable for webhook delivery */
export type WebhookSubscriptionInvalidTargetUrl = CreateWebhookSubscriptionResult & UpdateWebhookSubscriptionResult & {
  __typename?: 'WebhookSubscriptionInvalidTargetUrl';
  /** Explanation of why the URL was rejected */
  innerMessage: Scalars['String']['output'];
  /** Human-readable error message */
  message: Scalars['String']['output'];
};

/** Mutations of a single webhook subscription */
export type WebhookSubscriptionMut = {
  __typename?: 'WebhookSubscriptionMut';
  /** Pauses deliveries of an enabled subscription */
  pause: PauseWebhookSubscriptionResult;
  /** Re-enables a subscription that was marked unreachable */
  reactivate: ReactivateWebhookSubscriptionResult;
  /** Removes the subscription */
  remove: RemoveWebhookSubscriptionResult;
  /** Resumes deliveries of a paused subscription */
  resume: ResumeWebhookSubscriptionResult;
  /** Generates a new signing secret, replacing the current one */
  rotateSecret: RotateWebhookSubscriptionSecretResult;
  /** Replaces the target URL, event types and label of the subscription */
  update: UpdateWebhookSubscriptionResult;
};


/** Mutations of a single webhook subscription */
export type WebhookSubscriptionMutUpdateArgs = {
  input: WebhookSubscriptionInput;
};

/** No event types were provided for the subscription */
export type WebhookSubscriptionNoEventTypesProvided = CreateWebhookSubscriptionResult & UpdateWebhookSubscriptionResult & {
  __typename?: 'WebhookSubscriptionNoEventTypesProvided';
  /** Human-readable error message */
  message: Scalars['String']['output'];
  /** Number of event types provided, always zero */
  numEventTypes: Scalars['Int']['output'];
};

/** Lifecycle status of a webhook subscription */
export enum WebhookSubscriptionStatus {
  /** Events are being delivered */
  Enabled = 'ENABLED',
  /** Deliveries were paused by a user */
  Paused = 'PAUSED',
  /** Subscription was removed */
  Removed = 'REMOVED',
  /** Deliveries kept failing, reactivation is required to resume them */
  Unreachable = 'UNREACHABLE',
  /** Created but not yet enabled */
  Unverified = 'UNVERIFIED'
}

/** Global webhook information */
export type Webhooks = {
  __typename?: 'Webhooks';
  /** List of supported event types */
  eventTypes: Array<Scalars['String']['output']>;
};

export type CreateAccessTokenMutationVariables = Exact<{
  accountId: Scalars['AccountID']['input'];
  tokenName: Scalars['String']['input'];
}>;


export type CreateAccessTokenMutation = { __typename?: 'Mutation', accounts: { __typename?: 'AccountsMut', byId?: { __typename?: 'AccountMut', accessTokens: { __typename?: 'AccountAccessTokensMut', createAccessToken:
          | { __typename?: 'CreateAccessTokenResultDuplicate', message: string, tokenName: string }
          | { __typename?: 'CreateAccessTokenResultSuccess', message: string, token: { __typename?: 'CreatedAccessToken', id: string, name: string, composed: string, account: (
                { __typename?: 'Account' }
                & AccountFragment
              ) } }
         } } | null } };

export type ListAccessTokensQueryVariables = Exact<{
  accountId: Scalars['AccountID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListAccessTokensQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byId?: { __typename?: 'Account', accessTokens: { __typename?: 'AccountAccessTokens', listAccessTokens: { __typename?: 'AccessTokenConnection', totalCount: number, nodes: Array<(
            { __typename?: 'ViewAccessToken' }
            & AccessTokenDataFragment
          )>, pageInfo: (
            { __typename?: 'PageBasedInfo' }
            & DatasetPageInfoFragment
          ) } } } | null } };

export type RevokeAccessTokenMutationVariables = Exact<{
  accountId: Scalars['AccountID']['input'];
  tokenId: Scalars['AccessTokenID']['input'];
}>;


export type RevokeAccessTokenMutation = { __typename?: 'Mutation', accounts: { __typename?: 'AccountsMut', byId?: { __typename?: 'AccountMut', accessTokens: { __typename?: 'AccountAccessTokensMut', revokeAccessToken:
          | { __typename?: 'RevokeResultAlreadyRevoked', tokenId: string, message: string }
          | { __typename?: 'RevokeResultSuccess', tokenId: string, message: string }
         } } | null } };

export type AccountByNameQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
}>;


export type AccountByNameQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: (
      { __typename?: 'Account' }
      & AccountFragment
    ) | null } };

export type AccountChangeEmailMutationVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  newEmail: Scalars['Email']['input'];
}>;


export type AccountChangeEmailMutation = { __typename?: 'Mutation', accounts: { __typename?: 'AccountsMut', byName?: { __typename?: 'AccountMut', updateEmail:
        | { __typename?: 'UpdateEmailNonUnique', message: string }
        | { __typename?: 'UpdateEmailSuccess', newEmail: string, message: string }
       } | null } };

export type AccountFlowsAsCardsQueryVariables = Exact<{
  name: Scalars['AccountName']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<FlowProcessFilters>;
  ordering?: InputMaybe<FlowProcessOrdering>;
}>;


export type AccountFlowsAsCardsQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: { __typename?: 'Account', flows: { __typename?: 'AccountFlows', processes: { __typename?: 'AccountFlowProcesses', allCards: (
            { __typename?: 'AccountFlowProcessCardConnection' }
            & AccountFlowProcessCardConnectionDataFragment
          ), fullRollup: (
            { __typename?: 'FlowProcessGroupRollup' }
            & FlowProcessGroupRollupDataFragment
          ) } } } | null } };

export type AccountListDatasetsWithFlowsQueryVariables = Exact<{
  name: Scalars['AccountName']['input'];
}>;


export type AccountListDatasetsWithFlowsQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: { __typename?: 'Account', flows: { __typename?: 'AccountFlows', runs: { __typename?: 'AccountFlowRuns', listDatasetsWithFlow: (
            { __typename?: 'DatasetConnection' }
            & DatasetConnectionDataFragment
          ) } } } | null } };

export type AccountListFlowsQueryVariables = Exact<{
  name: Scalars['AccountName']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPageTable?: InputMaybe<Scalars['Int']['input']>;
  perPageTiles?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<AccountFlowFilters>;
  order?: InputMaybe<FlowRunOrder>;
}>;


export type AccountListFlowsQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: { __typename?: 'Account', flows: { __typename?: 'AccountFlows', runs: { __typename?: 'AccountFlowRuns', table: (
            { __typename?: 'FlowConnection' }
            & FlowConnectionDataFragment
          ), tiles: (
            { __typename?: 'FlowConnection' }
            & FlowConnectionWidgetDataFragment
          ) } } } | null } };

export type AccountPrimaryCardsQueryVariables = Exact<{
  name: Scalars['AccountName']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<FlowProcessFilters>;
  ordering?: InputMaybe<FlowProcessOrdering>;
}>;


export type AccountPrimaryCardsQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: { __typename?: 'Account', flows: { __typename?: 'AccountFlows', processes: { __typename?: 'AccountFlowProcesses', primaryCards: (
            { __typename?: 'DatasetFlowProcessConnection' }
            & DatasetFlowProcessConnectionDataFragment
          ), primaryRollup: (
            { __typename?: 'FlowProcessGroupRollup' }
            & FlowProcessGroupRollupDataFragment
          ) } } } | null } };

export type AccountStorageQuotaQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
}>;


export type AccountStorageQuotaQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: { __typename?: 'Account', quotas: { __typename?: 'AccountQuotas', user: { __typename?: 'AccountQuotasUsage', storage: { __typename?: 'AccountQuotasUsageStorage', limitTotalBytes?: number | null } } }, usage: { __typename?: 'AccountUsage', storage: { __typename?: 'TotalDatasetsStatistic', totalSizeBytes: number, totalDataSizeBytes: number, totalCheckpointsSizeBytes: number, totalLinkedObjectsSizeBytes: number } } } | null } };

export type AccountWebhookCardsQueryVariables = Exact<{
  name: Scalars['AccountName']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<FlowProcessFilters>;
  ordering?: InputMaybe<FlowProcessOrdering>;
}>;


export type AccountWebhookCardsQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: { __typename?: 'Account', flows: { __typename?: 'AccountFlows', processes: { __typename?: 'AccountFlowProcesses', webhookCards: (
            { __typename?: 'WebhookFlowSubProcessConnection' }
            & WebhookFlowSubProcessConnectionDataFragment
          ), webhookRollup: (
            { __typename?: 'FlowProcessGroupRollup' }
            & FlowProcessGroupRollupDataFragment
          ) } } } | null } };

export type AccountWithEmailQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
}>;


export type AccountWithEmailQuery = { __typename?: 'Query', accounts: { __typename?: 'Accounts', byName?: (
      { __typename?: 'Account' }
      & AccountWithEmailFragment
    ) | null } };

export type ChangeAccountUsernameMutationVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  newName: Scalars['AccountName']['input'];
}>;


export type ChangeAccountUsernameMutation = { __typename?: 'Mutation', accounts: { __typename?: 'AccountsMut', byName?: { __typename?: 'AccountMut', rename:
        | { __typename?: 'RenameAccountNameNotUnique', message: string }
        | { __typename?: 'RenameAccountSuccess', newName: string, message: string }
       } | null } };

export type ChangeAdminPasswordMutationVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  password: Scalars['AccountPassword']['input'];
}>;


export type ChangeAdminPasswordMutation = { __typename?: 'Mutation', accounts: { __typename?: 'AccountsMut', byName?: { __typename?: 'AccountMut', modifyPassword:
        | { __typename?: 'ModifyPasswordSuccess', message: string }
        | { __typename?: 'ModifyPasswordWrongOldPassword' }
       } | null } };

export type ChangeUserPasswordMutationVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  oldPassword: Scalars['AccountPassword']['input'];
  newPassword: Scalars['AccountPassword']['input'];
}>;


export type ChangeUserPasswordMutation = { __typename?: 'Mutation', accounts: { __typename?: 'AccountsMut', byName?: { __typename?: 'AccountMut', modifyPasswordWithConfirmation:
        | { __typename?: 'ModifyPasswordSuccess', message: string }
        | { __typename?: 'ModifyPasswordWrongOldPassword', message: string }
       } | null } };

export type DeleteAccountByNameMutationVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
}>;


export type DeleteAccountByNameMutation = { __typename?: 'Mutation', accounts: { __typename?: 'AccountsMut', byName?: { __typename?: 'AccountMut', delete: { __typename?: 'DeleteAccountSuccess', message: string } } | null } };

export type AccountBasicsFragment = { __typename?: 'Account', id: string, accountName: string, accountProvider: AccountProvider, avatarUrl?: string | null };

export type DatasetConnectionDataFragment = { __typename?: 'DatasetConnection', nodes: Array<(
    { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentPollingSource?: { __typename?: 'SetPollingSource', fetch:
          | (
            { __typename?: 'FetchStepContainer' }
            & FetchStepContainerDataFragment
          )
          | { __typename?: 'FetchStepEthereumLogs' }
          | (
            { __typename?: 'FetchStepFilesGlob' }
            & FetchStepFilesGlobDataFragment
          )
          | { __typename?: 'FetchStepMqtt' }
          | (
            { __typename?: 'FetchStepUrl' }
            & FetchStepUrlDataFragment
          )
         } | null, currentTransform?: { __typename?: 'SetTransform', inputs: Array<{ __typename: 'TransformInput' }>, transform: { __typename?: 'TransformSql', engine: string } } | null } }
    & DatasetBasicsFragment
  )> };

export type DatasetFlowProcessConnectionDataFragment = { __typename?: 'DatasetFlowProcessConnection', totalCount: number, nodes: Array<{ __typename?: 'DatasetFlowProcess', flowType: DatasetFlowType, dataset: (
      { __typename?: 'Dataset' }
      & DatasetBasicsFragment
    ), summary: (
      { __typename?: 'FlowProcessSummary' }
      & FlowProcessSummaryDataFragment
    ) }>, pageInfo: (
    { __typename?: 'PageBasedInfo' }
    & DatasetPageInfoFragment
  ) };

export type AccountFlowProcessCardConnectionDataFragment = { __typename?: 'AccountFlowProcessCardConnection', totalCount: number, nodes: Array<
    | { __typename?: 'DatasetFlowProcess', flowType: DatasetFlowType, dataset: (
        { __typename?: 'Dataset' }
        & DatasetBasicsFragment
      ), summary: (
        { __typename?: 'FlowProcessSummary' }
        & FlowProcessSummaryDataFragment
      ) }
    | { __typename?: 'WebhookFlowSubProcess', id: string, name: string, parentDataset?: (
        { __typename?: 'Dataset' }
        & DatasetBasicsFragment
      ) | null, summary: (
        { __typename?: 'FlowProcessSummary' }
        & FlowProcessSummaryDataFragment
      ) }
  >, pageInfo: (
    { __typename?: 'PageBasedInfo' }
    & DatasetPageInfoFragment
  ) };

export type AccountSummaryFragment = { __typename?: 'Account', accountName: string, avatarUrl?: string | null };

export type WebhookFlowSubProcessConnectionDataFragment = { __typename?: 'WebhookFlowSubProcessConnection', totalCount: number, nodes: Array<{ __typename?: 'WebhookFlowSubProcess', id: string, name: string, parentDataset?: (
      { __typename?: 'Dataset' }
      & DatasetBasicsFragment
    ) | null, summary: (
      { __typename?: 'FlowProcessSummary' }
      & FlowProcessSummaryDataFragment
    ) }>, pageInfo: (
    { __typename?: 'PageBasedInfo' }
    & DatasetPageInfoFragment
  ) };

export type AccountWithEmailFragment = { __typename?: 'Account', id: string, accountName: string, displayName: string, avatarUrl?: string | null, email: string };

export type AccountFragment = { __typename?: 'Account', id: string, accountName: string, displayName: string, accountType: AccountType, avatarUrl?: string | null, isAdmin?: boolean | null, accountProvider: AccountProvider };

export type LoginWeb3WalletMutationVariables = Exact<{
  account: Scalars['EvmWalletAddress']['input'];
}>;


export type LoginWeb3WalletMutation = { __typename?: 'Mutation', auth: { __typename?: 'AuthMut', web3: { __typename?: 'AuthWeb3Mut', eip4361AuthNonce: { __typename?: 'Eip4361AuthNonceResponse', value: string } } } };

export type LoginMutationVariables = Exact<{
  login_method: AccountProvider;
  login_credentials_json: Scalars['String']['input'];
  deviceCode?: InputMaybe<Scalars['DeviceCode']['input']>;
}>;


export type LoginMutation = { __typename?: 'Mutation', auth: { __typename?: 'AuthMut', login: { __typename?: 'LoginResponse', accessToken: string, account: (
        { __typename?: 'Account' }
        & AccountFragment
      ) } } };

export type FetchAccountDetailsMutationVariables = Exact<{
  accessToken: Scalars['String']['input'];
}>;


export type FetchAccountDetailsMutation = { __typename?: 'Mutation', auth: { __typename?: 'AuthMut', accountDetails: (
      { __typename?: 'Account' }
      & AccountFragment
    ) } };

export type SetVisibilityDatasetMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  visibility: DatasetVisibilityInput;
}>;


export type SetVisibilityDatasetMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', setVisibility: { __typename?: 'SetDatasetVisibilityResultSuccess', message: string } } | null } };

export type CommitEventToDatasetMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  event: Scalars['String']['input'];
}>;


export type CommitEventToDatasetMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', metadata: { __typename?: 'DatasetMetadataMut', chain: { __typename?: 'MetadataChainMut', commitEvent:
            | { __typename: 'CommitResultAppendError', message: string }
            | { __typename: 'CommitResultSuccess', message: string, oldHead?: string | null, newHead: string }
            | { __typename: 'MetadataManifestMalformed', message: string }
            | { __typename: 'MetadataManifestUnsupportedVersion', message: string }
            | { __typename: 'NoChanges', message: string }
           } } } | null } };

export type CreateEmptyDatasetMutationVariables = Exact<{
  datasetKind: DatasetKind;
  datasetAlias: Scalars['DatasetAlias']['input'];
  datasetVisibility: DatasetVisibility;
}>;


export type CreateEmptyDatasetMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', createEmpty:
      | { __typename?: 'CreateDatasetResultNameCollision', message: string, accountName?: string | null, datasetName: string }
      | { __typename?: 'CreateDatasetResultSuccess', message: string, dataset: (
          { __typename?: 'Dataset' }
          & DatasetBasicsFragment
        ) }
     } };

export type CreateDatasetFromSnapshotMutationVariables = Exact<{
  snapshot: Scalars['String']['input'];
  datasetVisibility: DatasetVisibility;
}>;


export type CreateDatasetFromSnapshotMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', createFromSnapshot:
      | { __typename?: 'CreateDatasetResultInvalidSnapshot', message: string }
      | { __typename?: 'CreateDatasetResultMissingInputs', missingInputs: Array<string>, message: string }
      | { __typename?: 'CreateDatasetResultNameCollision', message: string, accountName?: string | null, datasetName: string }
      | { __typename?: 'CreateDatasetResultSuccess', message: string, dataset: (
          { __typename?: 'Dataset' }
          & DatasetBasicsFragment
        ) }
      | { __typename?: 'MetadataManifestMalformed', message: string }
      | { __typename?: 'MetadataManifestUnsupportedVersion', message: string }
     } };

export type UpdateReadmeMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  content: Scalars['String']['input'];
}>;


export type UpdateReadmeMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', metadata: { __typename?: 'DatasetMetadataMut', updateReadme:
          | { __typename: 'CommitResultAppendError', message: string }
          | { __typename: 'CommitResultSuccess', oldHead?: string | null, message: string }
          | { __typename: 'NoChanges', message: string }
         } } | null } };

export type UpdateWatermarkMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  watermark: Scalars['DateTime']['input'];
}>;


export type UpdateWatermarkMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', setWatermark:
        | { __typename?: 'SetWatermarkIsDerivative', message: string }
        | { __typename?: 'SetWatermarkUpToDate', message: string }
        | { __typename?: 'SetWatermarkUpdated', newHead: string, message: string }
       } | null } };

export type CreateDatasetAsCollectionMutationVariables = Exact<{
  datasetAlias: Scalars['DatasetAlias']['input'];
  datasetVisibility: DatasetVisibility;
}>;


export type CreateDatasetAsCollectionMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', createCollection:
      | { __typename?: 'CreateDatasetResultInvalidSnapshot', message: string }
      | { __typename?: 'CreateDatasetResultMissingInputs', message: string }
      | { __typename?: 'CreateDatasetResultNameCollision', message: string }
      | { __typename?: 'CreateDatasetResultSuccess', message: string, dataset: (
          { __typename?: 'Dataset' }
          & DatasetBasicsFragment
        ) }
      | { __typename?: 'MetadataManifestMalformed', message: string }
      | { __typename?: 'MetadataManifestUnsupportedVersion', message: string }
     } };

export type DatasetAsCollectionQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  pathPrefix?: InputMaybe<Scalars['CollectionPath']['input']>;
  maxDepth?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DatasetAsCollectionQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', name: string, asCollection?: { __typename?: 'Collection', latest: { __typename?: 'CollectionProjection', entries: (
            { __typename?: 'CollectionEntryConnection' }
            & CollectionEntryConnectionDataFragment
          ) } } | null } | null } };

export type CollectionEntryConnectionDataFragment = { __typename?: 'CollectionEntryConnection', totalCount: number, nodes: Array<(
    { __typename?: 'CollectionEntry' }
    & CollectionEntryDataFragment
  )>, pageInfo: (
    { __typename?: 'PageBasedInfo' }
    & DatasetPageInfoFragment
  ) };

export type CollectionEntryDataFragment = { __typename?: 'CollectionEntry', systemTime: string, path: string, ref: string, extraData: Record<string, any>, asDataset?: { __typename?: 'Dataset', alias: string, head: string, owner: (
      { __typename?: 'Account' }
      & AccountSummaryFragment
    ), data: { __typename?: 'DatasetData', estimatedSizeBytes: number }, asVersionedFile?: { __typename?: 'VersionedFile', latest?: { __typename?: 'VersionedFileEntry', systemTime: string, contentType: string, contentLength: number, contentHash: string } | null } | null } | null };

export type CreateDatasetAsVersionedFileMutationVariables = Exact<{
  datasetAlias: Scalars['DatasetAlias']['input'];
  datasetVisibility: DatasetVisibility;
}>;


export type CreateDatasetAsVersionedFileMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', createVersionedFile:
      | { __typename?: 'CreateDatasetResultInvalidSnapshot', message: string }
      | { __typename?: 'CreateDatasetResultMissingInputs', message: string }
      | { __typename?: 'CreateDatasetResultNameCollision', message: string }
      | { __typename?: 'CreateDatasetResultSuccess', message: string, dataset: (
          { __typename?: 'Dataset' }
          & DatasetBasicsFragment
        ) }
      | { __typename?: 'MetadataManifestMalformed', message: string }
      | { __typename?: 'MetadataManifestUnsupportedVersion', message: string }
     } };

export type DatasetAsVersionedFileByBlockHashQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  blockHash?: InputMaybe<Scalars['Multihash']['input']>;
}>;


export type DatasetAsVersionedFileByBlockHashQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', name: string, asVersionedFile?: { __typename?: 'VersionedFile', asOf?: (
          { __typename?: 'VersionedFileEntry' }
          & VersionedFileEntryDataFragment
        ) | null } | null } | null } };

export type DatasetAsVersionedFileByVersionQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  version?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DatasetAsVersionedFileByVersionQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', name: string, asVersionedFile?: { __typename?: 'VersionedFile', versions: { __typename?: 'VersionedFileEntryConnection', totalCount: number }, asOf?: (
          { __typename?: 'VersionedFileEntry' }
          & VersionedFileEntryDataFragment
        ) | null } | null } | null } };

export type DatasetAsVersionedFileQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetAsVersionedFileQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', name: string, asVersionedFile?: { __typename?: 'VersionedFile', versions: { __typename?: 'VersionedFileEntryConnection', totalCount: number }, latest?: (
          { __typename?: 'VersionedFileEntry' }
          & VersionedFileEntryDataFragment
        ) | null } | null } | null } };

export type VersionedFileEntryDataFragment = { __typename?: 'VersionedFileEntry', systemTime: string, eventTime: string, version: number, contentType: string, contentLength: number, contentHash: string, contentUrl: { __typename?: 'VersionedFileContentDownload', url: string, expiresAt?: string | null } };

export type VersionedFileContentUrlQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  version?: InputMaybe<Scalars['Int']['input']>;
}>;


export type VersionedFileContentUrlQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', asVersionedFile?: { __typename?: 'VersionedFile', asOf?: { __typename?: 'VersionedFileEntry', contentUrl: { __typename?: 'VersionedFileContentDownload', url: string } } | null } | null } | null } };

export type GetDatasetBasicsWithPermissionsQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
}>;


export type GetDatasetBasicsWithPermissionsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset' }
      & DatasetBasicsFragment
      & DatasetPermissionsFragment
    ) | null } };

export type DatasetBlocksEncodedByEventTypeQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
  eventTypes: Array<MetadataEventType> | MetadataEventType;
  encoding: MetadataManifestFormat;
}>;


export type DatasetBlocksEncodedByEventTypeQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', metadataProjection: Array<{ __typename?: 'MetadataBlockExtended', encoded?: { __typename?: 'EncodedBlock', content: string } | null, event:
            | { __typename?: 'AddData' }
            | { __typename?: 'AddPushSource', sourceName: string }
            | { __typename?: 'DisablePollingSource' }
            | { __typename?: 'DisablePushSource' }
            | { __typename?: 'ExecuteTransform' }
            | { __typename?: 'Seed' }
            | { __typename?: 'SetAttachments' }
            | { __typename?: 'SetDataSchema' }
            | { __typename?: 'SetInfo' }
            | { __typename?: 'SetLicense' }
            | { __typename?: 'SetPollingSource' }
            | { __typename?: 'SetTransform' }
            | { __typename?: 'SetVocab' }
           }> } } | null } };

export type DatasetBlocksSchemaByEventTypeQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
  eventTypes: Array<MetadataEventType> | MetadataEventType;
}>;


export type DatasetBlocksSchemaByEventTypeQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', metadataProjection: Array<{ __typename?: 'MetadataBlockExtended', event:
            | { __typename?: 'AddData' }
            | (
              { __typename?: 'AddPushSource' }
              & AddPushSourceEventFragment
            )
            | { __typename?: 'DisablePollingSource' }
            | { __typename?: 'DisablePushSource' }
            | { __typename?: 'ExecuteTransform' }
            | { __typename?: 'Seed' }
            | { __typename?: 'SetAttachments' }
            | { __typename?: 'SetDataSchema' }
            | { __typename?: 'SetInfo' }
            | { __typename?: 'SetLicense' }
            | (
              { __typename?: 'SetPollingSource' }
              & SetPollingSourceEventFragment
            )
            | { __typename?: 'SetTransform' }
            | { __typename?: 'SetVocab' }
           }> } } | null } };

export type DatasetByAccountAndDatasetNameQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
}>;


export type DatasetByAccountAndDatasetNameQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset' }
      & DatasetBasicsFragment
    ) | null } };

export type DatasetByIdQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetByIdQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: (
      { __typename?: 'Dataset' }
      & DatasetBasicsFragment
    ) | null } };

export type DatasetListCollaboratorsQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DatasetListCollaboratorsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: (
      { __typename?: 'Dataset', collaboration: { __typename?: 'DatasetCollaboration', accountRoles: { __typename?: 'AccountWithRoleConnection', totalCount: number, nodes: Array<{ __typename?: 'AccountWithRole', role: DatasetAccessRole, account: (
              { __typename?: 'Account' }
              & AccountFragment
            ) }>, pageInfo: (
            { __typename?: 'PageBasedInfo' }
            & DatasetPageInfoFragment
          ) } } }
      & DatasetBasicsFragment
    ) | null } };

export type SetRoleCollaboratorMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  accountId: Scalars['AccountID']['input'];
  role: DatasetAccessRole;
}>;


export type SetRoleCollaboratorMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', collaboration: { __typename?: 'DatasetCollaborationMut', setRole: { __typename?: 'SetRoleResultSuccess', message: string } } } | null } };

export type UnsetRoleCollaboratorMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  accountIds: Array<Scalars['AccountID']['input']> | Scalars['AccountID']['input'];
}>;


export type UnsetRoleCollaboratorMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', collaboration: { __typename?: 'DatasetCollaborationMut', unsetRoles: { __typename?: 'UnsetRoleResultSuccess', message: string } } } | null } };

export type GetDatasetDataSqlRunQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit: Scalars['Int']['input'];
  skip?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDatasetDataSqlRunQuery = { __typename?: 'Query', data: { __typename?: 'DataQueries', query:
      | { __typename: 'DataQueryResultError', errorMessage: string, errorKind: DataQueryResultErrorKind }
      | (
        { __typename: 'DataQueryResultSuccess', limit: number }
        & DataQueryResultSuccessViewFragment
      )
     } };

export type DatasetHeadBlockHashQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
}>;


export type DatasetHeadBlockHashQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', chain: { __typename?: 'MetadataChain', refs: Array<{ __typename?: 'BlockRef', name: string, blockHash: string }> } } } | null } };

export type GetDatasetHistoryQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
  perPage?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDatasetHistoryQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', chain: { __typename?: 'MetadataChain', blocks: { __typename?: 'MetadataBlockConnection', totalCount: number, nodes: Array<(
              { __typename?: 'MetadataBlockExtended' }
              & MetadataBlockFragment
            )>, pageInfo: (
              { __typename?: 'PageBasedInfo' }
              & DatasetPageInfoFragment
            ) } } } }
      & DatasetBasicsFragment
    ) | null } };

export type GetDatasetLineageQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
}>;


export type GetDatasetLineageQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset' }
      & DatasetBasicsFragment
      & DatasetLineageFragment
    ) | null } };

export type DatasetListDownstreamsQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetListDownstreamsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentDownstreamDependencies: Array<
          | { __typename?: 'DatasetAccessResultAccessible', dataset: { __typename?: 'Dataset', name: string, owner: { __typename?: 'Account', accountName: string, avatarUrl?: string | null } } }
          | { __typename?: 'DatasetAccessResultNotAccessible' }
        > } } | null } };

export type GetDatasetMainDataQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GetDatasetMainDataQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset' }
      & DatasetBasicsFragment
      & DatasetOverviewFragment
      & DatasetDataFragment
      & DatasetMetadataSummaryFragment
      & DatasetPermissionsFragment
    ) | null } };

export type DatasetProtocolsQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
}>;


export type DatasetProtocolsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset', endpoints: { __typename?: 'DatasetEndpoints', cli: { __typename?: 'CliProtocolDesc', pullCommand: string, pushCommand: string }, webLink: { __typename?: 'LinkProtocolDesc', url: string }, rest: { __typename?: 'RestProtocolDesc', tailUrl: string, queryUrl: string, pushUrl: string }, flightsql: { __typename?: 'FlightSqlDesc', url: string }, jdbc: { __typename?: 'JdbcDesc', url: string }, postgresql: { __typename?: 'PostgreSqlDesl', url: string }, kafka: { __typename?: 'KafkaProtocolDesc', url: string }, websocket: { __typename?: 'WebSocketProtocolDesc', url: string }, odata: { __typename?: 'OdataProtocolDesc', serviceUrl: string, collectionUrl: string } } }
      & DatasetBasicsFragment
    ) | null } };

export type DatasetPushSyncStatusesQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetPushSyncStatusesQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', pushSyncStatuses: { __typename?: 'DatasetPushStatuses', statuses: Array<{ __typename?: 'DatasetPushStatus', remote: string, result:
              | { __typename?: 'CompareChainsResultError', reason: { __typename?: 'CompareChainsResultReason', message: string } }
              | { __typename?: 'CompareChainsResultStatus', message: CompareChainsStatus }
             }> } } } | null } };

export type GetDatasetSchemaQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type GetDatasetSchemaQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: (
      { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentSchema?: (
          { __typename?: 'DataSchema' }
          & DataSchemaInfoFragment
        ) | null } }
      & DatasetBasicsFragment
    ) | null } };

export type DatasetSystemTimeBlockByHashQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  blockHash: Scalars['Multihash']['input'];
}>;


export type DatasetSystemTimeBlockByHashQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: (
      { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', chain: { __typename?: 'MetadataChain', blockByHash?: { __typename?: 'MetadataBlockExtended', systemTime: string } | null } } }
      & DatasetBasicsFragment
    ) | null } };

export type DatasetUserRoleQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetUserRoleQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', role?: DatasetAccessRole | null } | null } };

export type DatasetsByAccountNameQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  perPage?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type DatasetsByAccountNameQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byAccountName: { __typename?: 'DatasetConnection', totalCount: number, nodes: Array<(
        { __typename: 'Dataset' }
        & DatasetSearchOverviewFragment
      )>, pageInfo: (
        { __typename?: 'PageBasedInfo' }
        & DatasetPageInfoFragment
      ) } } };

export type DatasetsTotalCountByAccountNameQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
}>;


export type DatasetsTotalCountByAccountNameQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byAccountName: { __typename?: 'DatasetConnection', totalCount: number } } };

export type DeleteDatasetMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DeleteDatasetMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', delete:
        | { __typename?: 'DeleteResultDanglingReference', message: string, danglingChildRefs: Array<string>, notDeletedDataset: string }
        | { __typename?: 'DeleteResultSuccess', message: string, deletedDataset: string }
       } | null } };

export type GetEnabledLoginMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetEnabledLoginMethodsQuery = { __typename?: 'Query', auth: { __typename?: 'Auth', enabledProviders: Array<AccountProvider> } };

export type EnginesQueryVariables = Exact<{ [key: string]: never; }>;


export type EnginesQuery = { __typename?: 'Query', data: { __typename?: 'DataQueries', knownEngines: Array<{ __typename?: 'EngineDesc', name: string, dialect: QueryDialect, latestImage: string }> } };

export type DeleteEnvVariableMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  datasetEnvVarKey: Scalars['String']['input'];
}>;


export type DeleteEnvVariableMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', envVars: { __typename?: 'DatasetEnvVarsMut', deleteEnvVariable:
          | { __typename?: 'DeleteDatasetEnvVarResultNotFound', message: string, envVarKey: string }
          | { __typename?: 'DeleteDatasetEnvVarResultSuccess', message: string, envVarKey: string }
         } } | null } };

export type ExposedEnvVariableValueQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
  datasetEnvVarKey: Scalars['String']['input'];
}>;


export type ExposedEnvVariableValueQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: { __typename?: 'Dataset', envVars: { __typename?: 'DatasetEnvVars', exposedValue: string } } | null } };

export type ViewDatasetEnvVarConnectionDataFragment = { __typename?: 'ViewDatasetEnvVarConnection', totalCount: number, nodes: Array<(
    { __typename?: 'ViewDatasetEnvVar' }
    & ViewDatasetEnvVarDataFragment
  )>, pageInfo: (
    { __typename?: 'PageBasedInfo' }
    & DatasetPageInfoFragment
  ) };

export type ViewDatasetEnvVarDataFragment = { __typename?: 'ViewDatasetEnvVar', key: string, value?: string | null, isSecret: boolean };

export type ListEnvVariablesQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListEnvVariablesQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset', envVars: { __typename?: 'DatasetEnvVars', listEnvVariables: (
          { __typename?: 'ViewDatasetEnvVarConnection' }
          & ViewDatasetEnvVarConnectionDataFragment
        ) } }
      & DatasetBasicsFragment
    ) | null } };

export type UpsertEnvVariableMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  key: Scalars['String']['input'];
  value: Scalars['String']['input'];
  isSecret: Scalars['Boolean']['input'];
}>;


export type UpsertEnvVariableMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', envVars: { __typename?: 'DatasetEnvVarsMut', upsertEnvVariable:
          | { __typename?: 'UpsertDatasetEnvVarResultCreated', message: string, envVar: (
              { __typename?: 'ViewDatasetEnvVar' }
              & ViewDatasetEnvVarDataFragment
            ) }
          | { __typename?: 'UpsertDatasetEnvVarResultUpdated', message: string, envVar: (
              { __typename?: 'ViewDatasetEnvVar' }
              & ViewDatasetEnvVarDataFragment
            ) }
          | { __typename?: 'UpsertDatasetEnvVarUpToDate', message: string }
         } } | null } };

export type GetDatasetFlowConfigsQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  datasetFlowType: DatasetFlowType;
}>;


export type GetDatasetFlowConfigsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: (
      { __typename?: 'Dataset', flows: { __typename?: 'DatasetFlows', configs: { __typename: 'DatasetFlowConfigs', byType?: { __typename: 'FlowConfiguration', rule:
              | { __typename?: 'FlowConfigRuleCompaction', maxSliceSize: number, maxSliceRecords: number }
              | { __typename?: 'FlowConfigRuleIngest', fetchUncacheable: boolean, fetchNextIteration: boolean }
              | { __typename?: 'FlowConfigRuleReset', oldHeadHash?: string | null, mode:
                  | { __typename?: 'FlowConfigResetPropagationModeCustom' }
                  | { __typename?: 'FlowConfigResetPropagationModeToSeed', dummy?: string | null }
                 }
            , retryPolicy?: { __typename?: 'FlowRetryPolicy', maxAttempts: number, backoffType: FlowRetryBackoffType, minDelay: (
                { __typename?: 'TimeDelta' }
                & TimeDeltaDataFragment
              ) } | null } | null } } }
      & DatasetBasicsFragment
    ) | null } };

export type SetCompactionFlowConfigMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  compactionConfigInput: FlowConfigCompactionInput;
}>;


export type SetCompactionFlowConfigMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', configs: { __typename?: 'DatasetFlowConfigsMut', setCompactionConfig:
            | { __typename?: 'FlowIncompatibleDatasetKind', message: string, actualDatasetKind: DatasetKind, expectedDatasetKind: DatasetKind }
            | { __typename?: 'FlowInvalidConfigInputError', message: string, reason: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string, preconditions: string }
            | { __typename?: 'SetFlowConfigSuccess', message: string }
           } } } | null } };

export type SetIngestFlowConfigMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  ingestConfigInput: FlowConfigIngestInput;
  retryPolicyInput?: InputMaybe<FlowRetryPolicyInput>;
}>;


export type SetIngestFlowConfigMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', configs: { __typename?: 'DatasetFlowConfigsMut', setIngestConfig:
            | { __typename?: 'FlowIncompatibleDatasetKind', message: string, actualDatasetKind: DatasetKind, expectedDatasetKind: DatasetKind }
            | { __typename?: 'FlowInvalidConfigInputError', message: string, reason: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string, preconditions: string }
            | { __typename?: 'SetFlowConfigSuccess', message: string }
           } } } | null } };

export type PauseDatasetFlowTriggerMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  datasetFlowType: DatasetFlowType;
}>;


export type PauseDatasetFlowTriggerMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', triggers: { __typename?: 'DatasetFlowTriggersMut', pauseFlow: boolean } } } | null } };

export type SetDatasetFlowTriggerMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  datasetFlowType: DatasetFlowType;
  triggerRuleInput: FlowTriggerRuleInput;
  triggerStopPolicyInput: FlowTriggerStopPolicyInput;
}>;


export type SetDatasetFlowTriggerMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', triggers: { __typename?: 'DatasetFlowTriggersMut', setTrigger:
            | { __typename?: 'FlowIncompatibleDatasetKind', expectedDatasetKind: DatasetKind, actualDatasetKind: DatasetKind, message: string }
            | { __typename?: 'FlowInvalidTriggerInputError', reason: string, message: string }
            | { __typename?: 'FlowInvalidTriggerStopPolicyInputError', message: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string }
            | { __typename?: 'FlowTypeIsNotSupported', message: string }
            | { __typename?: 'SetFlowTriggerSuccess', message: string }
           } } } | null } };

export type GetDatasetFlowTriggerQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  datasetFlowType: DatasetFlowType;
}>;


export type GetDatasetFlowTriggerQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', flows: { __typename?: 'DatasetFlows', triggers: { __typename?: 'DatasetFlowTriggers', byType?: { __typename?: 'FlowTrigger', paused: boolean, schedule?:
              | { __typename?: 'Cron5ComponentExpression', cron5ComponentExpression: string }
              | (
                { __typename?: 'TimeDelta' }
                & TimeDeltaDataFragment
              )
             | null, reactive?: { __typename?: 'FlowTriggerReactiveRule', forBreakingChange: FlowTriggerBreakingChangeRule, forNewData:
                | { __typename: 'FlowTriggerBatchingRuleBuffering', minRecordsToAwait: number, maxBatchingInterval: (
                    { __typename?: 'TimeDelta' }
                    & TimeDeltaDataFragment
                  ) }
                | { __typename: 'FlowTriggerBatchingRuleImmediate' }
               } | null, stopPolicy:
              | { __typename: 'FlowTriggerStopPolicyAfterConsecutiveFailures', maxFailures: number }
              | { __typename: 'FlowTriggerStopPolicyNever' }
             } | null } } } | null } };

export type TimeDeltaDataFragment = { __typename?: 'TimeDelta', every: number, unit: TimeUnit };

export type CancelFlowRunMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  flowId: Scalars['FlowID']['input'];
}>;


export type CancelFlowRunMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', runs: { __typename?: 'DatasetFlowRunsMut', cancelFlowRun:
            | { __typename?: 'CancelFlowRunSuccess', message: string, flow: (
                { __typename?: 'Flow' }
                & FlowSummaryDataFragment
              ) }
            | { __typename?: 'FlowNotFound', flowId: string, message: string }
           } } } | null } };

export type GetFlowByIdQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  flowId: Scalars['FlowID']['input'];
}>;


export type GetFlowByIdQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', flows: { __typename?: 'DatasetFlows', runs: { __typename?: 'DatasetFlowRuns', getFlow:
            | { __typename?: 'FlowNotFound', message: string, flowId: string }
            | { __typename?: 'GetFlowSuccess', flow: (
                { __typename?: 'Flow', history: Array<
                  | (
                    { __typename?: 'FlowConfigSnapshotModified' }
                    & FlowHistoryData_FlowConfigSnapshotModified_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventAborted' }
                    & FlowHistoryData_FlowEventAborted_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventActivationCauseAdded' }
                    & FlowHistoryData_FlowEventActivationCauseAdded_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventCompleted' }
                    & FlowHistoryData_FlowEventCompleted_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventInitiated' }
                    & FlowHistoryData_FlowEventInitiated_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventRetryPolicyModified' }
                    & FlowHistoryData_FlowEventRetryPolicyModified_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventScheduledForActivation' }
                    & FlowHistoryData_FlowEventScheduledForActivation_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventStartConditionUpdated' }
                    & FlowHistoryData_FlowEventStartConditionUpdated_Fragment
                  )
                  | (
                    { __typename?: 'FlowEventTaskChanged' }
                    & FlowHistoryData_FlowEventTaskChanged_Fragment
                  )
                > }
                & FlowSummaryDataFragment
              ) }
           } } } | null } };

export type DatasetFlowsInitiatorsQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetFlowsInitiatorsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', flows: { __typename?: 'DatasetFlows', runs: { __typename?: 'DatasetFlowRuns', listFlowInitiators: { __typename?: 'AccountConnection', totalCount: number, nodes: Array<(
              { __typename?: 'Account' }
              & AccountFragment
            )> } } } } | null } };

export type GetDatasetListFlowsQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  page?: InputMaybe<Scalars['Int']['input']>;
  perPageTable?: InputMaybe<Scalars['Int']['input']>;
  perPageTiles?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<DatasetFlowFilters>;
}>;


export type GetDatasetListFlowsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: (
      { __typename?: 'Dataset', flows: { __typename?: 'DatasetFlows', runs: { __typename?: 'DatasetFlowRuns', table: (
            { __typename?: 'FlowConnection' }
            & FlowConnectionDataFragment
          ), tiles: (
            { __typename?: 'FlowConnection' }
            & FlowConnectionWidgetDataFragment
          ) } } }
      & DatasetBasicsFragment
    ) | null } };

export type DatasetPauseFlowsMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetPauseFlowsMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', triggers: { __typename?: 'DatasetFlowTriggersMut', pauseFlows: boolean } } } | null } };

export type DatasetResumeFlowsMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetResumeFlowsMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', triggers: { __typename?: 'DatasetFlowTriggersMut', resumeFlows: boolean } } } | null } };

export type FlowConnectionDataFragment = { __typename?: 'FlowConnection', totalCount: number, nodes: Array<(
    { __typename?: 'Flow' }
    & FlowSummaryDataWithTriggerFragment
  )>, pageInfo: (
    { __typename?: 'PageBasedInfo' }
    & DatasetPageInfoFragment
  ) };

export type FlowDownstreamLinkDataFragment = { __typename?: 'FlowDownstreamLink', flowId: string, activatedAt: string, datasetId?: string | null, dataset?:
    | { __typename: 'DatasetAccessResultAccessible', dataset: (
        { __typename?: 'Dataset' }
        & DatasetBasicsFragment
      ) }
    | { __typename: 'DatasetAccessResultNotAccessible', id: string }
   | null, flow?: { __typename?: 'Flow', flowId: string, status: FlowStatus, outcome?:
      | { __typename: 'FlowAbortedResult' }
      | { __typename: 'FlowFailedError' }
      | { __typename: 'FlowSuccessResult' }
     | null, description:
      | { __typename: 'FlowDescriptionDatasetExecuteTransform' }
      | { __typename: 'FlowDescriptionDatasetHardCompaction' }
      | { __typename: 'FlowDescriptionDatasetPollingIngest' }
      | { __typename: 'FlowDescriptionDatasetPushIngest' }
      | { __typename: 'FlowDescriptionDatasetReset' }
      | { __typename: 'FlowDescriptionDatasetResetToMetadata' }
      | { __typename: 'FlowDescriptionSystemGC' }
      | { __typename: 'FlowDescriptionUnknown' }
      | { __typename: 'FlowDescriptionWebhookDeliver' }
     } | null };

type FlowHistoryData_FlowConfigSnapshotModified_Fragment = { __typename: 'FlowConfigSnapshotModified', eventId: string, eventTime: string, configSnapshot:
    | { __typename: 'FlowConfigRuleCompaction' }
    | { __typename: 'FlowConfigRuleIngest' }
    | { __typename: 'FlowConfigRuleReset' }
   };

type FlowHistoryData_FlowEventAborted_Fragment = { __typename: 'FlowEventAborted', eventId: string, eventTime: string };

type FlowHistoryData_FlowEventActivationCauseAdded_Fragment = { __typename: 'FlowEventActivationCauseAdded', eventId: string, eventTime: string, activationCause:
    | { __typename: 'FlowActivationCauseAutoPolling' }
    | { __typename: 'FlowActivationCauseDatasetUpdate', datasetId: string, dataset?: (
        { __typename?: 'Dataset' }
        & DatasetBasicsFragment
      ) | null, source:
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceExternallyDetectedChange' }
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceHttpIngest', sourceName?: string | null }
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceSmartProtocolPush', accountName?: string | null, isForce: boolean }
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceUpstreamFlow', flowId: string }
       }
    | { __typename: 'FlowActivationCauseIterationFinished' }
    | { __typename: 'FlowActivationCauseManual', initiator: (
        { __typename?: 'Account' }
        & AccountFragment
      ) }
   };

type FlowHistoryData_FlowEventCompleted_Fragment = { __typename: 'FlowEventCompleted', eventId: string, eventTime: string, downstreamFlows: Array<(
    { __typename?: 'FlowDownstreamLink' }
    & FlowDownstreamLinkDataFragment
  )> };

type FlowHistoryData_FlowEventInitiated_Fragment = { __typename: 'FlowEventInitiated', eventId: string, eventTime: string, activationCause:
    | { __typename: 'FlowActivationCauseAutoPolling' }
    | { __typename: 'FlowActivationCauseDatasetUpdate', datasetId: string, dataset?: (
        { __typename?: 'Dataset' }
        & DatasetBasicsFragment
      ) | null, source:
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceExternallyDetectedChange' }
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceHttpIngest', sourceName?: string | null }
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceSmartProtocolPush', accountName?: string | null, isForce: boolean }
        | { __typename: 'FlowActivationCauseDatasetUpdateSourceUpstreamFlow', flowId: string }
       }
    | { __typename: 'FlowActivationCauseIterationFinished' }
    | { __typename: 'FlowActivationCauseManual', initiator: (
        { __typename?: 'Account' }
        & AccountFragment
      ) }
   };

type FlowHistoryData_FlowEventRetryPolicyModified_Fragment = { __typename: 'FlowEventRetryPolicyModified', eventId: string, eventTime: string, retryPolicy?: { __typename?: 'FlowRetryPolicy', maxAttempts: number, backoffType: FlowRetryBackoffType, minDelay: (
      { __typename?: 'TimeDelta' }
      & TimeDeltaDataFragment
    ) } | null };

type FlowHistoryData_FlowEventScheduledForActivation_Fragment = { __typename: 'FlowEventScheduledForActivation', scheduledForActivationAt: string, eventId: string, eventTime: string };

type FlowHistoryData_FlowEventStartConditionUpdated_Fragment = { __typename: 'FlowEventStartConditionUpdated', eventId: string, eventTime: string, startCondition:
    | { __typename: 'FlowStartConditionExecutor', taskId: string }
    | { __typename: 'FlowStartConditionReactive', batchingDeadline: string, accumulatedRecordsCount: number, watermarkModified: boolean, activeBatchingRule:
        | { __typename: 'FlowTriggerBatchingRuleBuffering', minRecordsToAwait: number, maxBatchingInterval: (
            { __typename?: 'TimeDelta' }
            & TimeDeltaDataFragment
          ) }
        | { __typename: 'FlowTriggerBatchingRuleImmediate' }
       }
    | { __typename: 'FlowStartConditionSchedule', wakeUpAt: string }
    | { __typename: 'FlowStartConditionThrottling', intervalSec: number, wakeUpAt: string, shiftedFrom: string }
   };

type FlowHistoryData_FlowEventTaskChanged_Fragment = { __typename: 'FlowEventTaskChanged', taskId: string, taskStatus: TaskStatus, nextAttemptAt?: string | null, eventId: string, eventTime: string, task: { __typename?: 'Task', outcome?:
      | { __typename: 'TaskOutcomeCancelled' }
      | { __typename: 'TaskOutcomeFailed', reason:
          | { __typename: 'TaskFailureReasonGeneral', message: string, recoverable: boolean }
          | { __typename: 'TaskFailureReasonInputDatasetCompacted', message: string, inputDataset: (
              { __typename?: 'Dataset' }
              & DatasetBasicsFragment
            ) }
          | { __typename: 'TaskFailureReasonWebhookDeliveryProblem', message: string, targetUrl: string }
         }
      | { __typename: 'TaskOutcomeSuccess' }
     | null } };

export type FlowHistoryDataFragment =
  | FlowHistoryData_FlowConfigSnapshotModified_Fragment
  | FlowHistoryData_FlowEventAborted_Fragment
  | FlowHistoryData_FlowEventActivationCauseAdded_Fragment
  | FlowHistoryData_FlowEventCompleted_Fragment
  | FlowHistoryData_FlowEventInitiated_Fragment
  | FlowHistoryData_FlowEventRetryPolicyModified_Fragment
  | FlowHistoryData_FlowEventScheduledForActivation_Fragment
  | FlowHistoryData_FlowEventStartConditionUpdated_Fragment
  | FlowHistoryData_FlowEventTaskChanged_Fragment
;

export type FlowItemWidgetDataFragment = { __typename?: 'Flow', flowId: string, datasetId?: string | null, status: FlowStatus, initiator?: { __typename?: 'Account', accountName: string } | null, outcome?:
    | (
      { __typename?: 'FlowAbortedResult' }
      & FlowOutcomeData_FlowAbortedResult_Fragment
    )
    | (
      { __typename?: 'FlowFailedError' }
      & FlowOutcomeData_FlowFailedError_Fragment
    )
    | (
      { __typename?: 'FlowSuccessResult' }
      & FlowOutcomeData_FlowSuccessResult_Fragment
    )
   | null, timing: { __typename?: 'FlowTimingRecords', initiatedAt: string, firstAttemptScheduledAt?: string | null, scheduledAt?: string | null, awaitingExecutorSince?: string | null, runningSince?: string | null, lastAttemptFinishedAt?: string | null } };

type FlowOutcomeData_FlowAbortedResult_Fragment = { __typename?: 'FlowAbortedResult', message: string };

type FlowOutcomeData_FlowFailedError_Fragment = { __typename?: 'FlowFailedError', reason:
    | { __typename?: 'TaskFailureReasonGeneral', message: string, recoverable: boolean }
    | { __typename?: 'TaskFailureReasonInputDatasetCompacted', message: string, inputDataset: (
        { __typename?: 'Dataset' }
        & DatasetBasicsFragment
      ) }
    | { __typename?: 'TaskFailureReasonWebhookDeliveryProblem', message: string, targetUrl: string }
   };

type FlowOutcomeData_FlowSuccessResult_Fragment = { __typename?: 'FlowSuccessResult', message: string };

export type FlowOutcomeDataFragment =
  | FlowOutcomeData_FlowAbortedResult_Fragment
  | FlowOutcomeData_FlowFailedError_Fragment
  | FlowOutcomeData_FlowSuccessResult_Fragment
;

export type FlowSummaryDataWithTriggerFragment = (
  { __typename?: 'Flow', relatedTrigger?: { __typename?: 'FlowTrigger', paused: boolean, schedule?:
      | { __typename: 'Cron5ComponentExpression' }
      | { __typename: 'TimeDelta' }
     | null } | null }
  & FlowSummaryDataFragment
);

export type FlowSummaryDataFragment = { __typename?: 'Flow', flowId: string, datasetId?: string | null, status: FlowStatus, taskIds: Array<string>, description:
    | { __typename?: 'FlowDescriptionDatasetExecuteTransform', transform: { __typename?: 'SetTransform', inputs: Array<{ __typename: 'TransformInput' }>, transform: { __typename?: 'TransformSql', engine: string } }, transformResult?:
        | { __typename?: 'FlowDescriptionUpdateResultSuccess', numBlocks: number, numRecords: number, updatedWatermark?: string | null }
        | { __typename?: 'FlowDescriptionUpdateResultUnknown', message: string }
        | { __typename?: 'FlowDescriptionUpdateResultUpToDate', uncacheable: boolean }
       | null }
    | { __typename?: 'FlowDescriptionDatasetHardCompaction', compactionResult?:
        | { __typename?: 'FlowDescriptionReorganizationNothingToDo', message: string, dummy?: string | null }
        | { __typename?: 'FlowDescriptionReorganizationSuccess', originalBlocksCount: number, resultingBlocksCount: number, newHead: string }
       | null }
    | { __typename?: 'FlowDescriptionDatasetPollingIngest', pollingSource: { __typename?: 'SetPollingSource', fetch:
          | (
            { __typename?: 'FetchStepContainer' }
            & FetchStepContainerDataFragment
          )
          | { __typename?: 'FetchStepEthereumLogs' }
          | (
            { __typename?: 'FetchStepFilesGlob' }
            & FetchStepFilesGlobDataFragment
          )
          | { __typename?: 'FetchStepMqtt' }
          | (
            { __typename?: 'FetchStepUrl' }
            & FetchStepUrlDataFragment
          )
         }, ingestResult?:
        | { __typename?: 'FlowDescriptionUpdateResultSuccess', numBlocks: number, numRecords: number, updatedWatermark?: string | null }
        | { __typename?: 'FlowDescriptionUpdateResultUnknown', message: string }
        | { __typename?: 'FlowDescriptionUpdateResultUpToDate', uncacheable: boolean }
       | null }
    | { __typename?: 'FlowDescriptionDatasetPushIngest', sourceName?: string | null, ingestResult?:
        | { __typename?: 'FlowDescriptionUpdateResultSuccess', numBlocks: number, numRecords: number, updatedWatermark?: string | null }
        | { __typename?: 'FlowDescriptionUpdateResultUnknown', message: string }
        | { __typename?: 'FlowDescriptionUpdateResultUpToDate', uncacheable: boolean }
       | null }
    | { __typename?: 'FlowDescriptionDatasetReset', resetResult?: { __typename?: 'FlowDescriptionResetResult', newHead: string } | null }
    | { __typename?: 'FlowDescriptionDatasetResetToMetadata', resetToMetadataResult?:
        | { __typename?: 'FlowDescriptionReorganizationNothingToDo', message: string, dummy?: string | null }
        | { __typename?: 'FlowDescriptionReorganizationSuccess', originalBlocksCount: number, resultingBlocksCount: number, newHead: string }
       | null }
    | { __typename?: 'FlowDescriptionSystemGC', dummy: boolean }
    | { __typename?: 'FlowDescriptionUnknown' }
    | { __typename?: 'FlowDescriptionWebhookDeliver', targetUrl: string, label: string, eventType: string }
  , initiator?: (
    { __typename?: 'Account' }
    & AccountFragment
  ) | null, outcome?:
    | (
      { __typename?: 'FlowAbortedResult' }
      & FlowOutcomeData_FlowAbortedResult_Fragment
    )
    | (
      { __typename?: 'FlowFailedError' }
      & FlowOutcomeData_FlowFailedError_Fragment
    )
    | (
      { __typename?: 'FlowSuccessResult' }
      & FlowOutcomeData_FlowSuccessResult_Fragment
    )
   | null, timing: { __typename?: 'FlowTimingRecords', initiatedAt: string, firstAttemptScheduledAt?: string | null, scheduledAt?: string | null, awaitingExecutorSince?: string | null, runningSince?: string | null, lastAttemptFinishedAt?: string | null }, startCondition?:
    | { __typename: 'FlowStartConditionExecutor', taskId: string }
    | { __typename: 'FlowStartConditionReactive', batchingDeadline: string, accumulatedRecordsCount: number, watermarkModified: boolean, activeBatchingRule:
        | { __typename: 'FlowTriggerBatchingRuleBuffering', minRecordsToAwait: number, maxBatchingInterval: (
            { __typename?: 'TimeDelta' }
            & TimeDeltaDataFragment
          ) }
        | { __typename: 'FlowTriggerBatchingRuleImmediate' }
       }
    | { __typename: 'FlowStartConditionSchedule', wakeUpAt: string }
    | { __typename: 'FlowStartConditionThrottling', intervalSec: number, wakeUpAt: string, shiftedFrom: string }
   | null, configSnapshot?:
    | { __typename?: 'FlowConfigRuleCompaction' }
    | { __typename?: 'FlowConfigRuleIngest', fetchUncacheable: boolean, fetchNextIteration: boolean }
    | { __typename?: 'FlowConfigRuleReset' }
   | null, retryPolicy?: { __typename?: 'FlowRetryPolicy', maxAttempts: number } | null };

export type FlowConnectionWidgetDataFragment = { __typename?: 'FlowConnection', totalCount: number, nodes: Array<(
    { __typename?: 'Flow' }
    & FlowItemWidgetDataFragment
  )> };

export type DatasetTriggerCompactionFlowMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  compactionConfigInput?: InputMaybe<FlowConfigCompactionInput>;
}>;


export type DatasetTriggerCompactionFlowMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', runs: { __typename?: 'DatasetFlowRunsMut', triggerCompactionFlow:
            | { __typename?: 'FlowIncompatibleDatasetKind', expectedDatasetKind: DatasetKind, actualDatasetKind: DatasetKind, message: string }
            | { __typename?: 'FlowInvalidRunConfigurations', error: string, message: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string }
            | { __typename?: 'TriggerFlowSuccess', message: string, flow: (
                { __typename?: 'Flow' }
                & FlowSummaryDataFragment
              ) }
           } } } | null } };

export type DatasetTriggerIngestFlowMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  ingestConfigInput?: InputMaybe<FlowConfigIngestInput>;
}>;


export type DatasetTriggerIngestFlowMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', runs: { __typename?: 'DatasetFlowRunsMut', triggerIngestFlow:
            | { __typename?: 'FlowIncompatibleDatasetKind', expectedDatasetKind: DatasetKind, actualDatasetKind: DatasetKind, message: string }
            | { __typename?: 'FlowInvalidRunConfigurations', error: string, message: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string }
            | { __typename?: 'TriggerFlowSuccess', message: string, flow: (
                { __typename?: 'Flow' }
                & FlowSummaryDataFragment
              ) }
           } } } | null } };

export type DatasetTriggerResetFlowMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  resetConfigInput: FlowConfigResetInput;
}>;


export type DatasetTriggerResetFlowMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', runs: { __typename?: 'DatasetFlowRunsMut', triggerResetFlow:
            | { __typename?: 'FlowIncompatibleDatasetKind', expectedDatasetKind: DatasetKind, actualDatasetKind: DatasetKind, message: string }
            | { __typename?: 'FlowInvalidRunConfigurations', error: string, message: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string }
            | { __typename?: 'TriggerFlowSuccess', message: string, flow: (
                { __typename?: 'Flow' }
                & FlowSummaryDataFragment
              ) }
           } } } | null } };

export type DatasetTriggerResetToMetadataFlowMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetTriggerResetToMetadataFlowMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', runs: { __typename?: 'DatasetFlowRunsMut', triggerResetToMetadataFlow:
            | { __typename?: 'FlowIncompatibleDatasetKind', expectedDatasetKind: DatasetKind, actualDatasetKind: DatasetKind, message: string }
            | { __typename?: 'FlowInvalidRunConfigurations', error: string, message: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string }
            | { __typename?: 'TriggerFlowSuccess', message: string, flow: (
                { __typename?: 'Flow' }
                & FlowSummaryDataFragment
              ) }
           } } } | null } };

export type DatasetTriggerTransformFlowMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetTriggerTransformFlowMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', flows: { __typename?: 'DatasetFlowsMut', runs: { __typename?: 'DatasetFlowRunsMut', triggerTransformFlow:
            | { __typename?: 'FlowIncompatibleDatasetKind', expectedDatasetKind: DatasetKind, actualDatasetKind: DatasetKind, message: string }
            | { __typename?: 'FlowInvalidRunConfigurations', error: string, message: string }
            | { __typename?: 'FlowPreconditionsNotMet', message: string }
            | { __typename?: 'TriggerFlowSuccess', message: string, flow: (
                { __typename?: 'Flow' }
                & FlowSummaryDataFragment
              ) }
           } } } | null } };

export type DatasetFlowsProcessesQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetFlowsProcessesQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', flows: { __typename?: 'DatasetFlows', processes: (
          { __typename?: 'DatasetFlowProcesses' }
          & DatasetFlowProcessesDataFragment
        ) } } | null } };

export type DatasetFlowProcessDataFragment = { __typename?: 'DatasetFlowProcess', flowType: DatasetFlowType, summary: (
    { __typename?: 'FlowProcessSummary' }
    & FlowProcessSummaryDataFragment
  ) };

export type DatasetFlowProcessesDataFragment = { __typename?: 'DatasetFlowProcesses', primary: (
    { __typename?: 'DatasetFlowProcess' }
    & DatasetFlowProcessDataFragment
  ), webhooks: (
    { __typename?: 'WebhookFlowSubProcessGroup' }
    & WebhookFlowSubProcessGroupDataFragment
  ) };

export type FlowProcessSummaryDataFragment = { __typename?: 'FlowProcessSummary', effectiveState: FlowProcessEffectiveState, consecutiveFailures: number, lastSuccessAt?: string | null, lastAttemptAt?: string | null, lastFailureAt?: string | null, nextPlannedAt?: string | null, autoStoppedReason?: FlowProcessAutoStopReason | null, autoStoppedAt?: string | null, runningSince?: string | null, pausedAt?: string | null, stopPolicy:
    | { __typename?: 'FlowTriggerStopPolicyAfterConsecutiveFailures', maxFailures: number }
    | { __typename?: 'FlowTriggerStopPolicyNever', dummy: boolean }
   };

export type WebhookFlowSubProcessDataFragment = { __typename?: 'WebhookFlowSubProcess', id: string, name: string, summary: (
    { __typename?: 'FlowProcessSummary' }
    & FlowProcessSummaryDataFragment
  ) };

export type WebhookFlowSubProcessGroupDataFragment = { __typename?: 'WebhookFlowSubProcessGroup', rollup: (
    { __typename?: 'FlowProcessGroupRollup' }
    & FlowProcessGroupRollupDataFragment
  ), subprocesses: Array<(
    { __typename?: 'WebhookFlowSubProcess' }
    & WebhookFlowSubProcessDataFragment
  )> };

export type AddDataEventFragment = { __typename?: 'AddData', prevCheckpoint?: string | null, prevOffset?: number | null, newWatermark?: string | null, newData?: { __typename?: 'DataSlice', logicalHash: string, physicalHash: string, size: number, offsetInterval: { __typename?: 'OffsetInterval', start: number, end: number } } | null, newCheckpoint?: { __typename?: 'Checkpoint', physicalHash: string, size: number } | null, newSourceState?: { __typename?: 'SourceState', sourceName: string, kind: string, value: string } | null };

export type AddPushSourceEventFragment = { __typename?: 'AddPushSource', sourceName: string, read:
    | (
      { __typename?: 'ReadStepCsv' }
      & ReadStepCsvDataFragment
    )
    | (
      { __typename?: 'ReadStepEsriShapefile' }
      & ReadStepEsriShapefileDataFragment
    )
    | (
      { __typename?: 'ReadStepGeoJson' }
      & ReadStepGeoJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepJson' }
      & ReadStepJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepNdGeoJson' }
      & ReadStepNdGeoJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepNdJson' }
      & ReadStepNdJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepParquet' }
      & ReadStepParquetDataFragment
    )
  , merge:
    | (
      { __typename?: 'MergeStrategyAppend' }
      & MergeStrategyAppendDataFragment
    )
    | (
      { __typename?: 'MergeStrategyChangelogStream' }
      & MergeStrategyChangelogStreamDataFragment
    )
    | (
      { __typename?: 'MergeStrategyLedger' }
      & MergeStrategyLedgerDataFragment
    )
    | (
      { __typename?: 'MergeStrategySnapshot' }
      & MergeStrategySnapshotDataFragment
    )
    | (
      { __typename?: 'MergeStrategyUpsertStream' }
      & MergeStrategyUpsertStreamDataFragment
    )
  , preprocess?: (
    { __typename?: 'TransformSql' }
    & PreprocessStepDataFragment
  ) | null };

export type DataSchemaInfoFragment = { __typename?: 'DataSchema', format: DataSchemaFormat, content: string };

export type DisablePollingSourceEventFragment = { __typename?: 'DisablePollingSource', dummy?: string | null };

export type ExecuteTransformEventFragment = { __typename?: 'ExecuteTransform', prevCheckpoint?: string | null, prevOffset?: number | null, newWatermark?: string | null, queryInputs: Array<{ __typename?: 'ExecuteTransformInput', datasetId: string, prevBlockHash?: string | null, newBlockHash?: string | null, prevOffset?: number | null, newOffset?: number | null }>, newData?: { __typename?: 'DataSlice', logicalHash: string, physicalHash: string, size: number, offsetInterval: { __typename?: 'OffsetInterval', start: number, end: number } } | null, newCheckpoint?: { __typename?: 'Checkpoint', physicalHash: string, size: number } | null };

export type SeedEventFragment = { __typename?: 'Seed', datasetId: string, datasetKind: DatasetKind };

export type SetAttachmentsEventFragment = { __typename?: 'SetAttachments', attachments: { __typename?: 'AttachmentsEmbedded', items: Array<{ __typename?: 'AttachmentEmbedded', path: string, content: string }> } };

export type SetDataSchemaEventFragment = { __typename?: 'SetDataSchema', schema: { __typename?: 'DataSchema', format: DataSchemaFormat, content: string } };

export type SetLicenseEventFragment = { __typename?: 'SetLicense', shortName: string, name: string, spdxId?: string | null, websiteUrl: string };

export type SetPollingSourceEventFragment = { __typename?: 'SetPollingSource', fetch:
    | (
      { __typename?: 'FetchStepContainer' }
      & FetchStepContainerDataFragment
    )
    | (
      { __typename?: 'FetchStepEthereumLogs' }
      & FetchStepEthereumLogsDataFragment
    )
    | (
      { __typename?: 'FetchStepFilesGlob' }
      & FetchStepFilesGlobDataFragment
    )
    | (
      { __typename?: 'FetchStepMqtt' }
      & FetchStepMqttDataFragment
    )
    | (
      { __typename?: 'FetchStepUrl' }
      & FetchStepUrlDataFragment
    )
  , read:
    | (
      { __typename?: 'ReadStepCsv' }
      & ReadStepCsvDataFragment
    )
    | (
      { __typename?: 'ReadStepEsriShapefile' }
      & ReadStepEsriShapefileDataFragment
    )
    | (
      { __typename?: 'ReadStepGeoJson' }
      & ReadStepGeoJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepJson' }
      & ReadStepJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepNdGeoJson' }
      & ReadStepNdGeoJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepNdJson' }
      & ReadStepNdJsonDataFragment
    )
    | (
      { __typename?: 'ReadStepParquet' }
      & ReadStepParquetDataFragment
    )
  , merge:
    | (
      { __typename?: 'MergeStrategyAppend' }
      & MergeStrategyAppendDataFragment
    )
    | (
      { __typename?: 'MergeStrategyChangelogStream' }
      & MergeStrategyChangelogStreamDataFragment
    )
    | (
      { __typename?: 'MergeStrategyLedger' }
      & MergeStrategyLedgerDataFragment
    )
    | (
      { __typename?: 'MergeStrategySnapshot' }
      & MergeStrategySnapshotDataFragment
    )
    | (
      { __typename?: 'MergeStrategyUpsertStream' }
      & MergeStrategyUpsertStreamDataFragment
    )
  , prepare?: Array<
    | (
      { __typename?: 'PrepStepDecompress' }
      & PrepStepDecompressDataFragment
    )
    | (
      { __typename?: 'PrepStepPipe' }
      & PrepStepPipeDataFragment
    )
  > | null, preprocess?: (
    { __typename?: 'TransformSql' }
    & PreprocessStepDataFragment
  ) | null };

export type SetVocabEventFragment = { __typename?: 'SetVocab', offsetColumn?: string | null, operationTypeColumn?: string | null, systemTimeColumn?: string | null, eventTimeColumn?: string | null };

export type FetchStepContainerDataFragment = { __typename?: 'FetchStepContainer', image: string, command?: Array<string> | null, args?: Array<string> | null, env?: Array<{ __typename?: 'EnvVar', name: string, value?: string | null }> | null };

export type FetchStepEthereumLogsDataFragment = { __typename?: 'FetchStepEthereumLogs', chainId?: number | null, nodeUrl?: string | null, filter?: string | null, signature?: string | null };

export type FetchStepFilesGlobDataFragment = { __typename?: 'FetchStepFilesGlob', path: string, order?: SourceOrdering | null, eventTime?:
    | { __typename: 'EventTimeSourceFromMetadata' }
    | { __typename?: 'EventTimeSourceFromPath', pattern: string, timestampFormat?: string | null }
    | { __typename: 'EventTimeSourceFromSystemTime' }
   | null, cache?: { __typename: 'SourceCachingForever' } | null };

export type FetchStepMqttDataFragment = { __typename?: 'FetchStepMqtt', host: string, port: number, username?: string | null, password?: string | null, topics: Array<{ __typename?: 'MqttTopicSubscription', path: string, qos?: MqttQos | null }> };

export type FetchStepUrlDataFragment = { __typename?: 'FetchStepUrl', url: string, eventTime?:
    | { __typename: 'EventTimeSourceFromMetadata' }
    | { __typename?: 'EventTimeSourceFromPath', pattern: string, timestampFormat?: string | null }
    | { __typename: 'EventTimeSourceFromSystemTime' }
   | null, headers?: Array<{ __typename?: 'RequestHeader', name: string, value: string }> | null, cache?: { __typename: 'SourceCachingForever' } | null };

export type MergeStrategyAppendDataFragment = { __typename: 'MergeStrategyAppend' };

export type MergeStrategyChangelogStreamDataFragment = { __typename?: 'MergeStrategyChangelogStream', primaryKey: Array<string> };

export type MergeStrategyLedgerDataFragment = { __typename?: 'MergeStrategyLedger', primaryKey: Array<string> };

export type MergeStrategySnapshotDataFragment = { __typename?: 'MergeStrategySnapshot', primaryKey: Array<string>, compareColumns?: Array<string> | null };

export type MergeStrategyUpsertStreamDataFragment = { __typename?: 'MergeStrategyUpsertStream', primaryKey: Array<string> };

export type PrepStepDecompressDataFragment = { __typename?: 'PrepStepDecompress', format: CompressionFormat, subPath?: string | null };

export type PrepStepPipeDataFragment = { __typename?: 'PrepStepPipe', command: Array<string> };

export type PreprocessStepDataFragment = { __typename?: 'TransformSql', engine: string, version?: string | null, queries: Array<{ __typename?: 'SqlQueryStep', query: string, alias?: string | null }>, temporalTables?: Array<{ __typename?: 'TemporalTable', name: string, primaryKey: Array<string> }> | null };

export type ReadStepCsvDataFragment = { __typename?: 'ReadStepCsv', separator?: string | null, encoding?: string | null, quote?: string | null, escape?: string | null, header?: boolean | null, inferSchema?: boolean | null, nullValue?: string | null, dateFormat?: string | null, timestampFormat?: string | null, schema?: (
    { __typename?: 'DataSchema' }
    & DataSchemaInfoFragment
  ) | null };

export type ReadStepEsriShapefileDataFragment = { __typename?: 'ReadStepEsriShapefile', subPath?: string | null, schema?: (
    { __typename?: 'DataSchema' }
    & DataSchemaInfoFragment
  ) | null };

export type ReadStepGeoJsonDataFragment = { __typename?: 'ReadStepGeoJson', schema?: (
    { __typename?: 'DataSchema' }
    & DataSchemaInfoFragment
  ) | null };

export type ReadStepJsonDataFragment = { __typename?: 'ReadStepJson', subPath?: string | null, dateFormat?: string | null, encoding?: string | null, timestampFormat?: string | null, schema?: (
    { __typename?: 'DataSchema' }
    & DataSchemaInfoFragment
  ) | null };

export type ReadStepNdGeoJsonDataFragment = { __typename?: 'ReadStepNdGeoJson', schema?: (
    { __typename?: 'DataSchema' }
    & DataSchemaInfoFragment
  ) | null };

export type ReadStepNdJsonDataFragment = { __typename?: 'ReadStepNdJson', dateFormat?: string | null, encoding?: string | null, timestampFormat?: string | null, schema?: (
    { __typename?: 'DataSchema' }
    & DataSchemaInfoFragment
  ) | null };

export type ReadStepParquetDataFragment = { __typename?: 'ReadStepParquet', schema?: (
    { __typename?: 'DataSchema' }
    & DataSchemaInfoFragment
  ) | null };

export type AccessTokenDataFragment = { __typename?: 'ViewAccessToken', id: string, name: string, createdAt: string, revokedAt?: string | null, account: (
    { __typename?: 'Account' }
    & AccountFragment
  ) };

export type CurrentSourceFetchUrlFragment = { __typename?: 'DatasetMetadata', currentPollingSource?: { __typename?: 'SetPollingSource', fetch:
      | { __typename?: 'FetchStepContainer' }
      | { __typename?: 'FetchStepEthereumLogs', nodeUrl?: string | null, chainId?: number | null }
      | { __typename?: 'FetchStepFilesGlob' }
      | { __typename?: 'FetchStepMqtt', host: string, port: number }
      | { __typename?: 'FetchStepUrl', url: string }
     } | null };

export type DataQueryResultSuccessViewFragment = { __typename?: 'DataQueryResultSuccess', schema: { __typename?: 'DataSchema', format: DataSchemaFormat, content: string }, data: { __typename?: 'DataBatch', format: DataBatchFormat, content: string }, datasets: Array<{ __typename?: 'DatasetState', id: string, alias: string, blockHash?: string | null }> };

export type DatasetBasicsFragment = { __typename?: 'Dataset', id: string, kind: DatasetKind, name: string, alias: string, owner: (
    { __typename?: 'Account' }
    & AccountBasicsFragment
  ), visibility:
    | { __typename: 'PrivateDatasetVisibility' }
    | { __typename?: 'PublicDatasetVisibility', anonymousAvailable: boolean }
   };

export type DatasetCurrentInfoFragment = { __typename?: 'SetInfo', description?: string | null, keywords?: Array<string> | null };

export type DatasetDataSizeFragment = { __typename?: 'DatasetData', numRecordsTotal: number, estimatedSizeBytes: number };

export type DatasetDataFragment = { __typename?: 'Dataset', data: (
    { __typename: 'DatasetData', tail:
      | { __typename: 'DataQueryResultError', errorMessage: string, errorKind: DataQueryResultErrorKind }
      | (
        { __typename: 'DataQueryResultSuccess' }
        & DataQueryResultSuccessViewFragment
      )
     }
    & DatasetDataSizeFragment
  ) };

export type DatasetDescriptionFragment = { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentInfo: (
      { __typename?: 'SetInfo' }
      & DatasetCurrentInfoFragment
    ), currentLicense?: (
      { __typename?: 'SetLicense' }
      & LicenseFragment
    ) | null } };

export type DatasetDetailsFragment = { __typename?: 'Dataset', createdAt: string, lastUpdatedAt: string, data: { __typename?: 'DatasetData', estimatedSizeBytes: number, numRecordsTotal: number }, metadata: { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentLicense?: (
      { __typename?: 'SetLicense' }
      & LicenseFragment
    ) | null } };

export type DatasetLastUpdateFragment = { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', chain: { __typename?: 'MetadataChain', blocks: { __typename?: 'MetadataBlockConnection', totalCount: number, nodes: Array<(
          { __typename?: 'MetadataBlockExtended' }
          & MetadataBlockFragment
        )>, pageInfo: (
          { __typename?: 'PageBasedInfo' }
          & DatasetPageInfoFragment
        ) } } } };

export type DatasetLineageFragment = (
  { __typename: 'Dataset', metadata: (
    { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
      { __typename?: 'SetLicense' }
      & LicenseFragment
    ) | null, currentUpstreamDependencies: Array<
      | { __typename?: 'DatasetAccessResultAccessible', dataset: (
          { __typename?: 'Dataset', metadata: (
            { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
              { __typename?: 'SetLicense' }
              & LicenseFragment
            ) | null, currentUpstreamDependencies: Array<
              | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                  { __typename?: 'Dataset', metadata: (
                    { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
                      { __typename?: 'SetLicense' }
                      & LicenseFragment
                    ) | null, currentUpstreamDependencies: Array<
                      | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                          { __typename?: 'Dataset', metadata: (
                            { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
                              { __typename?: 'SetLicense' }
                              & LicenseFragment
                            ) | null, currentUpstreamDependencies: Array<
                              | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                                  { __typename?: 'Dataset', metadata: (
                                    { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
                                      { __typename?: 'SetLicense' }
                                      & LicenseFragment
                                    ) | null, currentUpstreamDependencies: Array<
                                      | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                                          { __typename?: 'Dataset', metadata: (
                                            { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
                                              { __typename?: 'SetLicense' }
                                              & LicenseFragment
                                            ) | null, currentUpstreamDependencies: Array<
                                              | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                                                  { __typename?: 'Dataset', metadata: (
                                                    { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
                                                      { __typename?: 'SetLicense' }
                                                      & LicenseFragment
                                                    ) | null }
                                                    & CurrentSourceFetchUrlFragment
                                                  ) }
                                                  & DatasetStreamLineageBasicsFragment
                                                ) }
                                              | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
                                            > }
                                            & CurrentSourceFetchUrlFragment
                                          ) }
                                          & DatasetStreamLineageBasicsFragment
                                        ) }
                                      | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
                                    > }
                                    & CurrentSourceFetchUrlFragment
                                  ) }
                                  & DatasetStreamLineageBasicsFragment
                                ) }
                              | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
                            > }
                            & CurrentSourceFetchUrlFragment
                          ) }
                          & DatasetStreamLineageBasicsFragment
                        ) }
                      | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
                    > }
                    & CurrentSourceFetchUrlFragment
                  ) }
                  & DatasetStreamLineageBasicsFragment
                ) }
              | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
            > }
            & CurrentSourceFetchUrlFragment
          ) }
          & DatasetStreamLineageBasicsFragment
        ) }
      | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
    >, currentDownstreamDependencies: Array<
      | { __typename?: 'DatasetAccessResultAccessible', dataset: (
          { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentDownstreamDependencies: Array<
              | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                  { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentDownstreamDependencies: Array<
                      | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                          { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentDownstreamDependencies: Array<
                              | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                                  { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentDownstreamDependencies: Array<
                                      | { __typename?: 'DatasetAccessResultAccessible', dataset: (
                                          { __typename?: 'Dataset' }
                                          & DatasetStreamLineageBasicsFragment
                                        ) }
                                      | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
                                    > } }
                                  & DatasetStreamLineageBasicsFragment
                                ) }
                              | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
                            > } }
                          & DatasetStreamLineageBasicsFragment
                        ) }
                      | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
                    > } }
                  & DatasetStreamLineageBasicsFragment
                ) }
              | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
            > } }
          & DatasetStreamLineageBasicsFragment
        ) }
      | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
    > }
    & CurrentSourceFetchUrlFragment
  ) }
  & DatasetLineageBasicsFragment
);

export type DatasetLineageBasicsFragment = (
  { __typename?: 'Dataset', createdAt: string, lastUpdatedAt: string, data: (
    { __typename?: 'DatasetData' }
    & DatasetDataSizeFragment
  ), metadata: (
    { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentPushSources: Array<{ __typename?: 'AddPushSource', sourceName: string }>, currentLicense?: (
      { __typename?: 'SetLicense' }
      & LicenseFragment
    ) | null }
    & CurrentSourceFetchUrlFragment
  ), owner: { __typename?: 'Account', avatarUrl?: string | null } }
  & DatasetBasicsFragment
);

export type DatasetStreamLineageBasicsFragment = (
  { __typename?: 'Dataset', createdAt: string, lastUpdatedAt: string, data: (
    { __typename?: 'DatasetData' }
    & DatasetDataSizeFragment
  ), owner: { __typename?: 'Account', avatarUrl?: string | null } }
  & DatasetBasicsFragment
);

export type DatasetMetadataSummaryFragment = (
  { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentWatermark?: string | null, currentDownstreamDependenciesCount: number, chain: { __typename?: 'MetadataChain', refs: Array<{ __typename?: 'BlockRef', name: string, blockHash: string }> }, currentInfo: (
      { __typename?: 'SetInfo' }
      & DatasetCurrentInfoFragment
    ), currentLicense?: (
      { __typename?: 'SetLicense' }
      & LicenseFragment
    ) | null, currentPollingSource?: (
      { __typename?: 'SetPollingSource' }
      & SetPollingSourceEventFragment
    ) | null, currentTransform?: (
      { __typename?: 'SetTransform' }
      & DatasetTransformFragment
    ) | null, currentSchema?: (
      { __typename?: 'DataSchema' }
      & DataSchemaInfoFragment
    ) | null, currentVocab?: (
      { __typename?: 'SetVocab' }
      & SetVocabEventFragment
    ) | null, currentPushSources: Array<(
      { __typename?: 'AddPushSource' }
      & AddPushSourceEventFragment
    )> } }
  & DatasetReadmeFragment
  & DatasetLastUpdateFragment
);

export type DatasetOverviewFragment = (
  { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentArchetype?: DatasetArchetype | null, currentPollingSource?: { __typename: 'SetPollingSource' } | null, currentTransform?: { __typename: 'SetTransform' } | null, currentPushSources: Array<{ __typename: 'AddPushSource' }> } }
  & DatasetDescriptionFragment
  & DatasetDetailsFragment
  & DatasetReadmeFragment
  & DatasetLastUpdateFragment
);

export type DatasetPageInfoFragment = { __typename?: 'PageBasedInfo', hasNextPage: boolean, hasPreviousPage: boolean, currentPage: number, totalPages?: number | null };

export type DatasetPermissionsFragment = { __typename?: 'Dataset', permissions: { __typename?: 'DatasetPermissions', collaboration: { __typename?: 'DatasetCollaborationPermissions', canView: boolean, canUpdate: boolean }, envVars: { __typename?: 'DatasetEnvVarsPermissions', canView: boolean, canUpdate: boolean }, flows: { __typename?: 'DatasetFlowsPermissions', canView: boolean, canRun: boolean }, general: { __typename?: 'DatasetGeneralPermissions', canRename: boolean, canSetVisibility: boolean, canDelete: boolean }, metadata: { __typename?: 'DatasetMetadataPermissions', canCommit: boolean }, webhooks: { __typename?: 'DatasetWebhooksPermissions', canView: boolean, canUpdate: boolean } } };

export type DatasetReadmeFragment = { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentReadme?: string | null } };

export type DatasetSearchOverviewFragment = (
  { __typename?: 'Dataset', createdAt: string, lastUpdatedAt: string, metadata: { __typename?: 'DatasetMetadata', currentInfo: (
      { __typename?: 'SetInfo' }
      & DatasetCurrentInfoFragment
    ), currentLicense?: (
      { __typename?: 'SetLicense' }
      & LicenseFragment
    ) | null, currentDownstreamDependencies: Array<
      | { __typename?: 'DatasetAccessResultAccessible', dataset: (
          { __typename?: 'Dataset' }
          & DatasetBasicsFragment
        ) }
      | { __typename?: 'DatasetAccessResultNotAccessible', id: string }
    > } }
  & DatasetBasicsFragment
);

export type DatasetTransformContentFragment = { __typename?: 'TransformSql', engine: string, version?: string | null, queries: Array<{ __typename?: 'SqlQueryStep', alias?: string | null, query: string }>, temporalTables?: Array<{ __typename?: 'TemporalTable', name: string, primaryKey: Array<string> }> | null };

export type DatasetTransformFragment = { __typename?: 'SetTransform', inputs: Array<{ __typename?: 'TransformInput', datasetRef: string, alias: string, inputDataset:
      | { __typename?: 'TransformInputDatasetAccessible', message: string, dataset: (
          { __typename?: 'Dataset' }
          & DatasetBasicsFragment
        ) }
      | { __typename?: 'TransformInputDatasetNotAccessible', message: string, datasetRef: string }
     }>, transform: (
    { __typename?: 'TransformSql' }
    & DatasetTransformContentFragment
  ) };

export type FlowProcessGroupRollupDataFragment = { __typename?: 'FlowProcessGroupRollup', total: number, active: number, failing: number, paused: number, stopped: number, unconfigured: number, worstConsecutiveFailures: number };

export type LicenseFragment = { __typename?: 'SetLicense', shortName: string, name: string, spdxId?: string | null, websiteUrl: string };

export type MetadataBlockFragment = { __typename?: 'MetadataBlockExtended', blockHash: string, prevBlockHash?: string | null, systemTime: string, sequenceNumber: number, author: (
    { __typename?: 'Account' }
    & AccountBasicsFragment
  ), event:
    | (
      { __typename: 'AddData' }
      & AddDataEventFragment
    )
    | (
      { __typename: 'AddPushSource' }
      & AddPushSourceEventFragment
    )
    | (
      { __typename: 'DisablePollingSource' }
      & DisablePollingSourceEventFragment
    )
    | { __typename: 'DisablePushSource' }
    | (
      { __typename: 'ExecuteTransform' }
      & ExecuteTransformEventFragment
    )
    | (
      { __typename: 'Seed' }
      & SeedEventFragment
    )
    | (
      { __typename: 'SetAttachments' }
      & SetAttachmentsEventFragment
    )
    | (
      { __typename: 'SetDataSchema' }
      & SetDataSchemaEventFragment
    )
    | (
      { __typename: 'SetInfo' }
      & DatasetCurrentInfoFragment
    )
    | (
      { __typename: 'SetLicense' }
      & SetLicenseEventFragment
    )
    | (
      { __typename: 'SetPollingSource' }
      & SetPollingSourceEventFragment
    )
    | (
      { __typename: 'SetTransform' }
      & DatasetTransformFragment
    )
    | (
      { __typename: 'SetVocab' }
      & SetVocabEventFragment
    )
   };

export type GetMetadataBlockQueryVariables = Exact<{
  accountName: Scalars['AccountName']['input'];
  datasetName: Scalars['DatasetName']['input'];
  blockHash: Scalars['Multihash']['input'];
}>;


export type GetMetadataBlockQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byOwnerAndName?: (
      { __typename?: 'Dataset', metadata: { __typename?: 'DatasetMetadata', currentDownstreamDependenciesCount: number, chain: { __typename?: 'MetadataChain', blockByHashEncoded?: string | null, blockByHash?: (
            { __typename?: 'MetadataBlockExtended' }
            & MetadataBlockFragment
          ) | null } } }
      & DatasetBasicsFragment
    ) | null } };

export type RenameDatasetMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  newName: Scalars['DatasetName']['input'];
}>;


export type RenameDatasetMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', rename:
        | { __typename: 'RenameResultNameCollision', message: string, collidingAlias: string }
        | { __typename: 'RenameResultNoChanges', preservedName: string, message: string }
        | { __typename: 'RenameResultSuccess', message: string, oldName: string, newName: string }
       } | null } };

export type SearchCollaboratorQueryVariables = Exact<{
  query: Scalars['String']['input'];
  filters: LookupFilters;
  page?: InputMaybe<Scalars['Int']['input']>;
  perPage?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchCollaboratorQuery = { __typename?: 'Query', search: { __typename?: 'Search', nameLookup: { __typename?: 'NameLookupResultConnection', nodes: Array<(
        { __typename?: 'Account' }
        & AccountFragment
      )> } } };

export type SearchDatasetsAutocompleteQueryVariables = Exact<{
  query: Scalars['String']['input'];
  perPage?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchDatasetsAutocompleteQuery = { __typename?: 'Query', search: { __typename?: 'Search', query: { __typename?: 'SearchResultConnection', nodes: Array<(
        { __typename: 'Dataset' }
        & DatasetBasicsFragment
      )> } } };

export type SearchDatasetsOverviewQueryVariables = Exact<{
  query: Scalars['String']['input'];
  perPage?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchDatasetsOverviewQuery = { __typename?: 'Query', search: { __typename?: 'Search', query: { __typename?: 'SearchResultConnection', totalCount: number, nodes: Array<(
        { __typename: 'Dataset' }
        & DatasetSearchOverviewFragment
      )>, pageInfo: (
        { __typename?: 'PageBasedInfo' }
        & DatasetPageInfoFragment
      ) } } };

export type SemanticSearchDatasetsOverviewQueryVariables = Exact<{
  prompt: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SemanticSearchDatasetsOverviewQuery = { __typename?: 'Query', search: { __typename?: 'Search', queryNaturalLanguage: { __typename?: 'SearchResultExConnection', totalCount: number, nodes: Array<{ __typename?: 'SearchResultEx', score: number, item: (
          { __typename?: 'Dataset' }
          & DatasetSearchOverviewFragment
        ) }>, pageInfo: (
        { __typename?: 'PageBasedInfo' }
        & DatasetPageInfoFragment
      ) } } };

export type DatasetWebhookByIdQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  id: Scalars['WebhookSubscriptionID']['input'];
}>;


export type DatasetWebhookByIdQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', webhooks: { __typename?: 'DatasetWebhooks', subscription?: { __typename?: 'WebhookSubscription', id: string, label: string, datasetId?: string | null, targetUrl: string, eventTypes: Array<string>, status: WebhookSubscriptionStatus } | null } } | null } };

export type DatasetWebhookCreateSubscriptionMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  input: WebhookSubscriptionInput;
}>;


export type DatasetWebhookCreateSubscriptionMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', webhooks: { __typename?: 'DatasetWebhooksMut', createSubscription:
          | { __typename: 'CreateWebhookSubscriptionResultSuccess', secret: string, subscriptionId: string, message: string }
          | { __typename: 'WebhookSubscriptionDuplicateLabel', message: string, label: string }
          | { __typename: 'WebhookSubscriptionInvalidTargetUrl', innerMessage: string, message: string }
          | { __typename: 'WebhookSubscriptionNoEventTypesProvided', numEventTypes: number, message: string }
         } } | null } };

export type DatasetWebhookPauseSubscriptionMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  id: Scalars['WebhookSubscriptionID']['input'];
}>;


export type DatasetWebhookPauseSubscriptionMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', webhooks: { __typename?: 'DatasetWebhooksMut', subscription?: { __typename?: 'WebhookSubscriptionMut', pause:
            | { __typename?: 'PauseWebhookSubscriptionResultSuccess', paused: boolean, message: string }
            | { __typename?: 'PauseWebhookSubscriptionResultUnexpected', status: WebhookSubscriptionStatus, message: string }
           } | null } } | null } };

export type DatasetWebhookReactivateSubscriptionMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  id: Scalars['WebhookSubscriptionID']['input'];
}>;


export type DatasetWebhookReactivateSubscriptionMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', webhooks: { __typename?: 'DatasetWebhooksMut', subscription?: { __typename?: 'WebhookSubscriptionMut', reactivate:
            | { __typename?: 'ReactivateWebhookSubscriptionResultSuccess', message: string }
            | { __typename?: 'ReactivateWebhookSubscriptionResultUnexpected', status: WebhookSubscriptionStatus, message: string }
           } | null } } | null } };

export type DatasetWebhookRemoveSubscriptionMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  id: Scalars['WebhookSubscriptionID']['input'];
}>;


export type DatasetWebhookRemoveSubscriptionMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', webhooks: { __typename?: 'DatasetWebhooksMut', subscription?: { __typename?: 'WebhookSubscriptionMut', remove: { __typename?: 'RemoveWebhookSubscriptionResultSuccess', removed: boolean, message: string } } | null } } | null } };

export type DatasetWebhookResumeSubscriptionMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  id: Scalars['WebhookSubscriptionID']['input'];
}>;


export type DatasetWebhookResumeSubscriptionMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', webhooks: { __typename?: 'DatasetWebhooksMut', subscription?: { __typename?: 'WebhookSubscriptionMut', resume:
            | { __typename?: 'ResumeWebhookSubscriptionResultSuccess', resumed: boolean, message: string }
            | { __typename?: 'ResumeWebhookSubscriptionResultUnexpected', status: WebhookSubscriptionStatus, message: string }
           } | null } } | null } };

export type DatasetWebhookRotateSecretMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  id: Scalars['WebhookSubscriptionID']['input'];
}>;


export type DatasetWebhookRotateSecretMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', webhooks: { __typename?: 'DatasetWebhooksMut', subscription?: { __typename?: 'WebhookSubscriptionMut', rotateSecret: { __typename?: 'RotateWebhookSubscriptionSecretSuccess', newSecret: string, message: string } } | null } } | null } };

export type DatasetWebhookSubscriptionsQueryVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
}>;


export type DatasetWebhookSubscriptionsQuery = { __typename?: 'Query', datasets: { __typename?: 'Datasets', byId?: { __typename?: 'Dataset', webhooks: { __typename?: 'DatasetWebhooks', subscriptions: Array<{ __typename?: 'WebhookSubscription', label: string, id: string, targetUrl: string, status: WebhookSubscriptionStatus, datasetId?: string | null, eventTypes: Array<string> }> } } | null } };

export type DatasetWebhookUpdateSubscriptionMutationVariables = Exact<{
  datasetId: Scalars['DatasetID']['input'];
  id: Scalars['WebhookSubscriptionID']['input'];
  input: WebhookSubscriptionInput;
}>;


export type DatasetWebhookUpdateSubscriptionMutation = { __typename?: 'Mutation', datasets: { __typename?: 'DatasetsMut', byId?: { __typename?: 'DatasetMut', webhooks: { __typename?: 'DatasetWebhooksMut', subscription?: { __typename?: 'WebhookSubscriptionMut', update:
            | { __typename?: 'UpdateWebhookSubscriptionResultSuccess', updated: boolean, message: string }
            | { __typename?: 'UpdateWebhookSubscriptionResultUnexpected', status: WebhookSubscriptionStatus, message: string }
            | { __typename?: 'WebhookSubscriptionDuplicateLabel', label: string, message: string }
            | { __typename?: 'WebhookSubscriptionInvalidTargetUrl', innerMessage: string, message: string }
            | { __typename?: 'WebhookSubscriptionNoEventTypesProvided', numEventTypes: number, message: string }
           } | null } } | null } };

export type WebhookEventTypesQueryVariables = Exact<{ [key: string]: never; }>;


export type WebhookEventTypesQuery = { __typename?: 'Query', webhooks: { __typename?: 'Webhooks', eventTypes: Array<string> } };

export const AccountBasicsFragmentDoc = gql`
    fragment AccountBasics on Account {
  id
  accountName
  accountProvider
  avatarUrl
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
    ${AccountBasicsFragmentDoc}`;
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
${FetchStepContainerDataFragmentDoc}`;
export const FlowProcessSummaryDataFragmentDoc = gql`
    fragment FlowProcessSummaryData on FlowProcessSummary {
  effectiveState
  consecutiveFailures
  lastSuccessAt
  lastAttemptAt
  lastFailureAt
  nextPlannedAt
  stopPolicy {
    ... on FlowTriggerStopPolicyNever {
      dummy
    }
    ... on FlowTriggerStopPolicyAfterConsecutiveFailures {
      maxFailures
    }
  }
  autoStoppedReason
  autoStoppedAt
  runningSince
  pausedAt
}
    `;
export const DatasetPageInfoFragmentDoc = gql`
    fragment DatasetPageInfo on PageBasedInfo {
  hasNextPage
  hasPreviousPage
  currentPage
  totalPages
}
    `;
export const DatasetFlowProcessConnectionDataFragmentDoc = gql`
    fragment DatasetFlowProcessConnectionData on DatasetFlowProcessConnection {
  nodes {
    flowType
    dataset {
      ...DatasetBasics
    }
    summary {
      ...FlowProcessSummaryData
    }
  }
  totalCount
  pageInfo {
    ...DatasetPageInfo
  }
}
    ${DatasetBasicsFragmentDoc}
${FlowProcessSummaryDataFragmentDoc}
${DatasetPageInfoFragmentDoc}`;
export const AccountFlowProcessCardConnectionDataFragmentDoc = gql`
    fragment AccountFlowProcessCardConnectionData on AccountFlowProcessCardConnection {
  nodes {
    ... on DatasetFlowProcess {
      flowType
      dataset {
        ...DatasetBasics
      }
      summary {
        ...FlowProcessSummaryData
      }
    }
    ... on WebhookFlowSubProcess {
      id
      name
      parentDataset {
        ...DatasetBasics
      }
      summary {
        ...FlowProcessSummaryData
      }
    }
  }
  totalCount
  pageInfo {
    ...DatasetPageInfo
  }
}
    ${DatasetBasicsFragmentDoc}
${FlowProcessSummaryDataFragmentDoc}
${DatasetPageInfoFragmentDoc}`;
export const WebhookFlowSubProcessConnectionDataFragmentDoc = gql`
    fragment WebhookFlowSubProcessConnectionData on WebhookFlowSubProcessConnection {
  nodes {
    id
    name
    parentDataset {
      ...DatasetBasics
    }
    summary {
      ...FlowProcessSummaryData
    }
  }
  totalCount
  pageInfo {
    ...DatasetPageInfo
  }
}
    ${DatasetBasicsFragmentDoc}
${FlowProcessSummaryDataFragmentDoc}
${DatasetPageInfoFragmentDoc}`;
export const AccountWithEmailFragmentDoc = gql`
    fragment AccountWithEmail on Account {
  id
  accountName
  displayName
  avatarUrl
  email
}
    `;
export const AccountSummaryFragmentDoc = gql`
    fragment AccountSummary on Account {
  accountName
  avatarUrl
}
    `;
export const CollectionEntryDataFragmentDoc = gql`
    fragment CollectionEntryData on CollectionEntry {
  systemTime
  path
  ref
  extraData
  asDataset {
    alias
    owner {
      ...AccountSummary
    }
    head
    data {
      estimatedSizeBytes
    }
    asVersionedFile {
      latest {
        systemTime
        contentType
        contentLength
        contentHash
      }
    }
  }
}
    ${AccountSummaryFragmentDoc}`;
export const CollectionEntryConnectionDataFragmentDoc = gql`
    fragment CollectionEntryConnectionData on CollectionEntryConnection {
  nodes {
    ...CollectionEntryData
  }
  pageInfo {
    ...DatasetPageInfo
  }
  totalCount
}
    ${CollectionEntryDataFragmentDoc}
${DatasetPageInfoFragmentDoc}`;
export const VersionedFileEntryDataFragmentDoc = gql`
    fragment VersionedFileEntryData on VersionedFileEntry {
  systemTime
  eventTime
  version
  contentType
  contentLength
  contentHash
  contentUrl {
    url
    expiresAt
  }
}
    `;
export const ViewDatasetEnvVarDataFragmentDoc = gql`
    fragment ViewDatasetEnvVarData on ViewDatasetEnvVar {
  key
  value
  isSecret
}
    `;
export const ViewDatasetEnvVarConnectionDataFragmentDoc = gql`
    fragment ViewDatasetEnvVarConnectionData on ViewDatasetEnvVarConnection {
  totalCount
  nodes {
    ...ViewDatasetEnvVarData
  }
  pageInfo {
    ...DatasetPageInfo
  }
}
    ${ViewDatasetEnvVarDataFragmentDoc}
${DatasetPageInfoFragmentDoc}`;
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
        recoverable
      }
      ... on TaskFailureReasonInputDatasetCompacted {
        message
        inputDataset {
          ...DatasetBasics
        }
      }
      ... on TaskFailureReasonWebhookDeliveryProblem {
        message
        targetUrl
      }
    }
  }
  ... on FlowAbortedResult {
    message
  }
}
    ${DatasetBasicsFragmentDoc}`;
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
        __typename
        ... on FlowTriggerBatchingRuleBuffering {
          maxBatchingInterval {
            ...TimeDeltaData
          }
          minRecordsToAwait
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
      fetchNextIteration
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
${TimeDeltaDataFragmentDoc}`;
export const FlowSummaryDataWithTriggerFragmentDoc = gql`
    fragment FlowSummaryDataWithTrigger on Flow {
  ...FlowSummaryData
  relatedTrigger {
    paused
    schedule {
      __typename
    }
  }
}
    ${FlowSummaryDataFragmentDoc}`;
export const FlowConnectionDataFragmentDoc = gql`
    fragment FlowConnectionData on FlowConnection {
  nodes {
    ...FlowSummaryDataWithTrigger
  }
  totalCount
  pageInfo {
    ...DatasetPageInfo
  }
}
    ${FlowSummaryDataWithTriggerFragmentDoc}
${DatasetPageInfoFragmentDoc}`;
export const FlowDownstreamLinkDataFragmentDoc = gql`
    fragment FlowDownstreamLinkData on FlowDownstreamLink {
  flowId
  activatedAt
  datasetId
  dataset {
    __typename
    ... on DatasetAccessResultAccessible {
      dataset {
        ...DatasetBasics
      }
    }
    ... on DatasetAccessResultNotAccessible {
      id
    }
  }
  flow {
    flowId
    status
    outcome {
      __typename
    }
    description {
      __typename
    }
  }
}
    ${DatasetBasicsFragmentDoc}`;
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
      ... on FlowActivationCauseIterationFinished {
        __typename
      }
      ... on FlowActivationCauseManual {
        initiator {
          ...Account
        }
      }
      ... on FlowActivationCauseDatasetUpdate {
        datasetId
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
          __typename
          ... on FlowTriggerBatchingRuleBuffering {
            minRecordsToAwait
            maxBatchingInterval {
              ...TimeDeltaData
            }
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
              recoverable
            }
            ... on TaskFailureReasonInputDatasetCompacted {
              message
              inputDataset {
                ...DatasetBasics
              }
            }
            ... on TaskFailureReasonWebhookDeliveryProblem {
              message
              targetUrl
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
      ... on FlowActivationCauseIterationFinished {
        __typename
      }
      ... on FlowActivationCauseManual {
        initiator {
          ...Account
        }
      }
      ... on FlowActivationCauseDatasetUpdate {
        datasetId
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
  ... on FlowEventRetryPolicyModified {
    retryPolicy {
      maxAttempts
      minDelay {
        ...TimeDeltaData
      }
      backoffType
    }
  }
  ... on FlowEventCompleted {
    eventId
    eventTime
    downstreamFlows {
      ...FlowDownstreamLinkData
    }
  }
}
    ${AccountFragmentDoc}
${DatasetBasicsFragmentDoc}
${TimeDeltaDataFragmentDoc}
${FlowDownstreamLinkDataFragmentDoc}`;
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
    ${FlowOutcomeDataFragmentDoc}`;
export const FlowConnectionWidgetDataFragmentDoc = gql`
    fragment FlowConnectionWidgetData on FlowConnection {
  nodes {
    ...FlowItemWidgetData
  }
  totalCount
}
    ${FlowItemWidgetDataFragmentDoc}`;
export const DatasetFlowProcessDataFragmentDoc = gql`
    fragment DatasetFlowProcessData on DatasetFlowProcess {
  flowType
  summary {
    ...FlowProcessSummaryData
  }
}
    ${FlowProcessSummaryDataFragmentDoc}`;
export const FlowProcessGroupRollupDataFragmentDoc = gql`
    fragment FlowProcessGroupRollupData on FlowProcessGroupRollup {
  total
  active
  failing
  paused
  stopped
  unconfigured
  worstConsecutiveFailures
}
    `;
export const WebhookFlowSubProcessDataFragmentDoc = gql`
    fragment WebhookFlowSubProcessData on WebhookFlowSubProcess {
  id
  name
  summary {
    ...FlowProcessSummaryData
  }
}
    ${FlowProcessSummaryDataFragmentDoc}`;
export const WebhookFlowSubProcessGroupDataFragmentDoc = gql`
    fragment WebhookFlowSubProcessGroupData on WebhookFlowSubProcessGroup {
  rollup {
    ...FlowProcessGroupRollupData
  }
  subprocesses {
    ...WebhookFlowSubProcessData
  }
}
    ${FlowProcessGroupRollupDataFragmentDoc}
${WebhookFlowSubProcessDataFragmentDoc}`;
export const DatasetFlowProcessesDataFragmentDoc = gql`
    fragment DatasetFlowProcessesData on DatasetFlowProcesses {
  primary {
    ...DatasetFlowProcessData
  }
  webhooks {
    ...WebhookFlowSubProcessGroupData
  }
}
    ${DatasetFlowProcessDataFragmentDoc}
${WebhookFlowSubProcessGroupDataFragmentDoc}`;
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
    ${AccountFragmentDoc}`;
export const DatasetDataSizeFragmentDoc = gql`
    fragment DatasetDataSize on DatasetData {
  numRecordsTotal
  estimatedSizeBytes
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
${DataQueryResultSuccessViewFragmentDoc}`;
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
        chainId
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
${LicenseFragmentDoc}`;
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
${DatasetDataSizeFragmentDoc}`;
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
      ... on DatasetAccessResultNotAccessible {
        id
      }
      ... on DatasetAccessResultAccessible {
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
              ... on DatasetAccessResultNotAccessible {
                id
              }
              ... on DatasetAccessResultAccessible {
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
                      ... on DatasetAccessResultNotAccessible {
                        id
                      }
                      ... on DatasetAccessResultAccessible {
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
                              ... on DatasetAccessResultNotAccessible {
                                id
                              }
                              ... on DatasetAccessResultAccessible {
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
                                      ... on DatasetAccessResultNotAccessible {
                                        id
                                      }
                                      ... on DatasetAccessResultAccessible {
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
                                              ... on DatasetAccessResultNotAccessible {
                                                id
                                              }
                                              ... on DatasetAccessResultAccessible {
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
      ... on DatasetAccessResultNotAccessible {
        id
      }
      ... on DatasetAccessResultAccessible {
        dataset {
          ...DatasetStreamLineageBasics
          metadata {
            currentPushSources {
              sourceName
            }
            currentDownstreamDependencies {
              ... on DatasetAccessResultNotAccessible {
                id
              }
              ... on DatasetAccessResultAccessible {
                dataset {
                  ...DatasetStreamLineageBasics
                  metadata {
                    currentPushSources {
                      sourceName
                    }
                    currentDownstreamDependencies {
                      ... on DatasetAccessResultNotAccessible {
                        id
                      }
                      ... on DatasetAccessResultAccessible {
                        dataset {
                          ...DatasetStreamLineageBasics
                          metadata {
                            currentPushSources {
                              sourceName
                            }
                            currentDownstreamDependencies {
                              ... on DatasetAccessResultNotAccessible {
                                id
                              }
                              ... on DatasetAccessResultAccessible {
                                dataset {
                                  ...DatasetStreamLineageBasics
                                  metadata {
                                    currentPushSources {
                                      sourceName
                                    }
                                    currentDownstreamDependencies {
                                      ... on DatasetAccessResultNotAccessible {
                                        id
                                      }
                                      ... on DatasetAccessResultAccessible {
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
${DatasetStreamLineageBasicsFragmentDoc}`;
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
export const DataSchemaInfoFragmentDoc = gql`
    fragment DataSchemaInfo on DataSchema {
  format
  content
}
    `;
export const ReadStepCsvDataFragmentDoc = gql`
    fragment ReadStepCsvData on ReadStepCsv {
  separator
  encoding
  quote
  escape
  header
  inferSchema
  nullValue
  dateFormat
  timestampFormat
  schema(format: ODF_JSON) {
    ...DataSchemaInfo
  }
}
    ${DataSchemaInfoFragmentDoc}`;
export const ReadStepJsonDataFragmentDoc = gql`
    fragment ReadStepJsonData on ReadStepJson {
  subPath
  dateFormat
  encoding
  timestampFormat
  schema(format: ODF_JSON) {
    ...DataSchemaInfo
  }
}
    ${DataSchemaInfoFragmentDoc}`;
export const ReadStepNdJsonDataFragmentDoc = gql`
    fragment ReadStepNdJsonData on ReadStepNdJson {
  dateFormat
  encoding
  timestampFormat
  schema(format: ODF_JSON) {
    ...DataSchemaInfo
  }
}
    ${DataSchemaInfoFragmentDoc}`;
export const ReadStepGeoJsonDataFragmentDoc = gql`
    fragment ReadStepGeoJsonData on ReadStepGeoJson {
  schema(format: ODF_JSON) {
    ...DataSchemaInfo
  }
}
    ${DataSchemaInfoFragmentDoc}`;
export const ReadStepNdGeoJsonDataFragmentDoc = gql`
    fragment ReadStepNdGeoJsonData on ReadStepNdGeoJson {
  schema(format: ODF_JSON) {
    ...DataSchemaInfo
  }
}
    ${DataSchemaInfoFragmentDoc}`;
export const ReadStepEsriShapefileDataFragmentDoc = gql`
    fragment ReadStepEsriShapefileData on ReadStepEsriShapefile {
  subPath
  schema(format: ODF_JSON) {
    ...DataSchemaInfo
  }
}
    ${DataSchemaInfoFragmentDoc}`;
export const ReadStepParquetDataFragmentDoc = gql`
    fragment ReadStepParquetData on ReadStepParquet {
  schema(format: ODF_JSON) {
    ...DataSchemaInfo
  }
}
    ${DataSchemaInfoFragmentDoc}`;
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
${PreprocessStepDataFragmentDoc}`;
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
${DatasetTransformContentFragmentDoc}`;
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
${PreprocessStepDataFragmentDoc}`;
export const DatasetReadmeFragmentDoc = gql`
    fragment DatasetReadme on Dataset {
  metadata {
    currentReadme
  }
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
  schema(format: ODF_JSON) {
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
    ...AccountBasics
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
    ${AccountBasicsFragmentDoc}
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
${DisablePollingSourceEventFragmentDoc}`;
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
${DatasetPageInfoFragmentDoc}`;
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
    currentSchema(format: ODF_JSON) {
      ...DataSchemaInfo
    }
    currentVocab {
      ...SetVocabEvent
    }
    currentPushSources {
      ...AddPushSourceEvent
    }
    currentDownstreamDependenciesCount
  }
  ...DatasetReadme
  ...DatasetLastUpdate
}
    ${DatasetCurrentInfoFragmentDoc}
${LicenseFragmentDoc}
${SetPollingSourceEventFragmentDoc}
${DatasetTransformFragmentDoc}
${DataSchemaInfoFragmentDoc}
${SetVocabEventFragmentDoc}
${AddPushSourceEventFragmentDoc}
${DatasetReadmeFragmentDoc}
${DatasetLastUpdateFragmentDoc}`;
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
${LicenseFragmentDoc}`;
export const DatasetDetailsFragmentDoc = gql`
    fragment DatasetDetails on Dataset {
  createdAt
  lastUpdatedAt
  data {
    estimatedSizeBytes
    numRecordsTotal
  }
  metadata {
    currentLicense {
      ...License
    }
    currentWatermark
  }
}
    ${LicenseFragmentDoc}`;
export const DatasetOverviewFragmentDoc = gql`
    fragment DatasetOverview on Dataset {
  ...DatasetDescription
  ...DatasetDetails
  ...DatasetReadme
  ...DatasetLastUpdate
  metadata {
    currentArchetype
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
${DatasetLastUpdateFragmentDoc}`;
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
      ... on DatasetAccessResultNotAccessible {
        id
      }
      ... on DatasetAccessResultAccessible {
        dataset {
          ...DatasetBasics
        }
      }
    }
  }
}
    ${DatasetBasicsFragmentDoc}
${DatasetCurrentInfoFragmentDoc}
${LicenseFragmentDoc}`;
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
    ${AccountFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateAccessTokenGQL extends Apollo.Mutation<CreateAccessTokenMutation, CreateAccessTokenMutationVariables> {
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
${DatasetPageInfoFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class RevokeAccessTokenGQL extends Apollo.Mutation<RevokeAccessTokenMutation, RevokeAccessTokenMutationVariables> {
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
    ${AccountFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class AccountChangeEmailGQL extends Apollo.Mutation<AccountChangeEmailMutation, AccountChangeEmailMutationVariables> {
    document = AccountChangeEmailDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AccountFlowsAsCardsDocument = gql`
    query accountFlowsAsCards($name: AccountName!, $page: Int, $perPage: Int, $filters: FlowProcessFilters, $ordering: FlowProcessOrdering) {
  accounts {
    byName(name: $name) {
      flows {
        processes {
          allCards(filters: $filters, page: $page, perPage: $perPage, ordering: $ordering) {
            ...AccountFlowProcessCardConnectionData
          }
          fullRollup(filters: $filters) {
            ...FlowProcessGroupRollupData
          }
        }
      }
    }
  }
}
    ${AccountFlowProcessCardConnectionDataFragmentDoc}
${FlowProcessGroupRollupDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class AccountFlowsAsCardsGQL extends Apollo.Query<AccountFlowsAsCardsQuery, AccountFlowsAsCardsQueryVariables> {
    document = AccountFlowsAsCardsDocument;
    
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
    ${DatasetConnectionDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class AccountListDatasetsWithFlowsGQL extends Apollo.Query<AccountListDatasetsWithFlowsQuery, AccountListDatasetsWithFlowsQueryVariables> {
    document = AccountListDatasetsWithFlowsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AccountListFlowsDocument = gql`
    query accountListFlows($name: AccountName!, $page: Int, $perPageTable: Int, $perPageTiles: Int, $filters: AccountFlowFilters, $order: FlowRunOrder) {
  accounts {
    byName(name: $name) {
      flows {
        runs {
          table: listFlows(
            page: $page
            perPage: $perPageTable
            filters: $filters
            order: $order
          ) {
            ...FlowConnectionData
          }
          tiles: listFlows(
            page: 0
            perPage: $perPageTiles
            filters: {byProcessType: null, byStatus: null, byInitiator: null, byDatasetIds: []}
          ) {
            ...FlowConnectionWidgetData
          }
        }
      }
    }
  }
}
    ${FlowConnectionDataFragmentDoc}
${FlowConnectionWidgetDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class AccountListFlowsGQL extends Apollo.Query<AccountListFlowsQuery, AccountListFlowsQueryVariables> {
    document = AccountListFlowsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AccountPrimaryCardsDocument = gql`
    query accountPrimaryCards($name: AccountName!, $page: Int, $perPage: Int, $filters: FlowProcessFilters, $ordering: FlowProcessOrdering) {
  accounts {
    byName(name: $name) {
      flows {
        processes {
          primaryCards(
            filters: $filters
            page: $page
            perPage: $perPage
            ordering: $ordering
          ) {
            ...DatasetFlowProcessConnectionData
          }
          primaryRollup(filters: $filters) {
            ...FlowProcessGroupRollupData
          }
        }
      }
    }
  }
}
    ${DatasetFlowProcessConnectionDataFragmentDoc}
${FlowProcessGroupRollupDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class AccountPrimaryCardsGQL extends Apollo.Query<AccountPrimaryCardsQuery, AccountPrimaryCardsQueryVariables> {
    document = AccountPrimaryCardsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AccountStorageQuotaDocument = gql`
    query accountStorageQuota($accountName: AccountName!) {
  accounts {
    byName(name: $accountName) {
      quotas {
        user {
          storage {
            limitTotalBytes
          }
        }
      }
      usage {
        storage {
          totalSizeBytes
          totalDataSizeBytes
          totalCheckpointsSizeBytes
          totalLinkedObjectsSizeBytes
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class AccountStorageQuotaGQL extends Apollo.Query<AccountStorageQuotaQuery, AccountStorageQuotaQueryVariables> {
    document = AccountStorageQuotaDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const AccountWebhookCardsDocument = gql`
    query accountWebhookCards($name: AccountName!, $page: Int, $perPage: Int, $filters: FlowProcessFilters, $ordering: FlowProcessOrdering) {
  accounts {
    byName(name: $name) {
      flows {
        processes {
          webhookCards(
            filters: $filters
            page: $page
            perPage: $perPage
            ordering: $ordering
          ) {
            ...WebhookFlowSubProcessConnectionData
          }
          webhookRollup(filters: $filters) {
            ...FlowProcessGroupRollupData
          }
        }
      }
    }
  }
}
    ${WebhookFlowSubProcessConnectionDataFragmentDoc}
${FlowProcessGroupRollupDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class AccountWebhookCardsGQL extends Apollo.Query<AccountWebhookCardsQuery, AccountWebhookCardsQueryVariables> {
    document = AccountWebhookCardsDocument;
    
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
    ${AccountWithEmailFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class ChangeAccountUsernameGQL extends Apollo.Mutation<ChangeAccountUsernameMutation, ChangeAccountUsernameMutationVariables> {
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
    providedIn: 'root'
  })
  export class ChangeAdminPasswordGQL extends Apollo.Mutation<ChangeAdminPasswordMutation, ChangeAdminPasswordMutationVariables> {
    document = ChangeAdminPasswordDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ChangeUserPasswordDocument = gql`
    mutation changeUserPassword($accountName: AccountName!, $oldPassword: AccountPassword!, $newPassword: AccountPassword!) {
  accounts {
    byName(accountName: $accountName) {
      modifyPasswordWithConfirmation(
        oldPassword: $oldPassword
        newPassword: $newPassword
      ) {
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
    providedIn: 'root'
  })
  export class ChangeUserPasswordGQL extends Apollo.Mutation<ChangeUserPasswordMutation, ChangeUserPasswordMutationVariables> {
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
    providedIn: 'root'
  })
  export class DeleteAccountByNameGQL extends Apollo.Mutation<DeleteAccountByNameMutation, DeleteAccountByNameMutationVariables> {
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
    providedIn: 'root'
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
    login(
      loginMethod: $login_method
      loginCredentialsJson: $login_credentials_json
      deviceCode: $deviceCode
    ) {
      accessToken
      account {
        ...Account
      }
    }
  }
}
    ${AccountFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    ${AccountFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class FetchAccountDetailsGQL extends Apollo.Mutation<FetchAccountDetailsMutation, FetchAccountDetailsMutationVariables> {
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
    providedIn: 'root'
  })
  export class SetVisibilityDatasetGQL extends Apollo.Mutation<SetVisibilityDatasetMutation, SetVisibilityDatasetMutationVariables> {
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
    providedIn: 'root'
  })
  export class CommitEventToDatasetGQL extends Apollo.Mutation<CommitEventToDatasetMutation, CommitEventToDatasetMutationVariables> {
    document = CommitEventToDatasetDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateEmptyDatasetDocument = gql`
    mutation createEmptyDataset($datasetKind: DatasetKind!, $datasetAlias: DatasetAlias!, $datasetVisibility: DatasetVisibility!) {
  datasets {
    createEmpty(
      datasetKind: $datasetKind
      datasetAlias: $datasetAlias
      datasetVisibility: $datasetVisibility
    ) {
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateEmptyDatasetGQL extends Apollo.Mutation<CreateEmptyDatasetMutation, CreateEmptyDatasetMutationVariables> {
    document = CreateEmptyDatasetDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateDatasetFromSnapshotDocument = gql`
    mutation createDatasetFromSnapshot($snapshot: String!, $datasetVisibility: DatasetVisibility!) {
  datasets {
    createFromSnapshot(
      snapshot: $snapshot
      snapshotFormat: YAML
      datasetVisibility: $datasetVisibility
    ) {
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateDatasetFromSnapshotGQL extends Apollo.Mutation<CreateDatasetFromSnapshotMutation, CreateDatasetFromSnapshotMutationVariables> {
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
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class UpdateWatermarkGQL extends Apollo.Mutation<UpdateWatermarkMutation, UpdateWatermarkMutationVariables> {
    document = UpdateWatermarkDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateDatasetAsCollectionDocument = gql`
    mutation createDatasetAsCollection($datasetAlias: DatasetAlias!, $datasetVisibility: DatasetVisibility!) {
  datasets {
    createCollection(
      datasetAlias: $datasetAlias
      datasetVisibility: $datasetVisibility
    ) {
      ... on CreateDatasetResultSuccess {
        message
        dataset {
          ...DatasetBasics
        }
      }
      ... on CreateDatasetResultInvalidSnapshot {
        message
      }
      ... on CreateDatasetResultMissingInputs {
        message
      }
      ... on CreateDatasetResultNameCollision {
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateDatasetAsCollectionGQL extends Apollo.Mutation<CreateDatasetAsCollectionMutation, CreateDatasetAsCollectionMutationVariables> {
    document = CreateDatasetAsCollectionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetAsCollectionDocument = gql`
    query datasetAsCollection($datasetId: DatasetID!, $pathPrefix: CollectionPath, $maxDepth: Int, $page: Int, $perPage: Int) {
  datasets {
    byId(datasetId: $datasetId) {
      name
      asCollection {
        latest {
          entries(
            pathPrefix: $pathPrefix
            maxDepth: $maxDepth
            page: $page
            perPage: $perPage
          ) {
            ...CollectionEntryConnectionData
          }
        }
      }
    }
  }
}
    ${CollectionEntryConnectionDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetAsCollectionGQL extends Apollo.Query<DatasetAsCollectionQuery, DatasetAsCollectionQueryVariables> {
    document = DatasetAsCollectionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CreateDatasetAsVersionedFileDocument = gql`
    mutation createDatasetAsVersionedFile($datasetAlias: DatasetAlias!, $datasetVisibility: DatasetVisibility!) {
  datasets {
    createVersionedFile(
      datasetAlias: $datasetAlias
      datasetVisibility: $datasetVisibility
    ) {
      ... on CreateDatasetResultSuccess {
        message
        dataset {
          ...DatasetBasics
        }
      }
      ... on CreateDatasetResultInvalidSnapshot {
        message
      }
      ... on CreateDatasetResultMissingInputs {
        message
      }
      ... on CreateDatasetResultNameCollision {
        message
      }
      ... on CreateDatasetResultNameCollision {
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CreateDatasetAsVersionedFileGQL extends Apollo.Mutation<CreateDatasetAsVersionedFileMutation, CreateDatasetAsVersionedFileMutationVariables> {
    document = CreateDatasetAsVersionedFileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetAsVersionedFileByBlockHashDocument = gql`
    query datasetAsVersionedFileByBlockHash($datasetId: DatasetID!, $blockHash: Multihash) {
  datasets {
    byId(datasetId: $datasetId) {
      name
      asVersionedFile {
        asOf(blockHash: $blockHash) {
          ...VersionedFileEntryData
        }
      }
    }
  }
}
    ${VersionedFileEntryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetAsVersionedFileByBlockHashGQL extends Apollo.Query<DatasetAsVersionedFileByBlockHashQuery, DatasetAsVersionedFileByBlockHashQueryVariables> {
    document = DatasetAsVersionedFileByBlockHashDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetAsVersionedFileByVersionDocument = gql`
    query datasetAsVersionedFileByVersion($datasetId: DatasetID!, $version: Int) {
  datasets {
    byId(datasetId: $datasetId) {
      name
      asVersionedFile {
        versions {
          totalCount
        }
        asOf(version: $version) {
          ...VersionedFileEntryData
        }
      }
    }
  }
}
    ${VersionedFileEntryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetAsVersionedFileByVersionGQL extends Apollo.Query<DatasetAsVersionedFileByVersionQuery, DatasetAsVersionedFileByVersionQueryVariables> {
    document = DatasetAsVersionedFileByVersionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetAsVersionedFileDocument = gql`
    query datasetAsVersionedFile($datasetId: DatasetID!) {
  datasets {
    byId(datasetId: $datasetId) {
      name
      asVersionedFile {
        versions {
          totalCount
        }
        latest {
          ...VersionedFileEntryData
        }
      }
    }
  }
}
    ${VersionedFileEntryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetAsVersionedFileGQL extends Apollo.Query<DatasetAsVersionedFileQuery, DatasetAsVersionedFileQueryVariables> {
    document = DatasetAsVersionedFileDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const VersionedFileContentUrlDocument = gql`
    query versionedFileContentUrl($datasetId: DatasetID!, $version: Int) {
  datasets {
    byId(datasetId: $datasetId) {
      asVersionedFile {
        asOf(version: $version) {
          contentUrl {
            url
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class VersionedFileContentUrlGQL extends Apollo.Query<VersionedFileContentUrlQuery, VersionedFileContentUrlQueryVariables> {
    document = VersionedFileContentUrlDocument;
    
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
${DatasetPermissionsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDatasetBasicsWithPermissionsGQL extends Apollo.Query<GetDatasetBasicsWithPermissionsQuery, GetDatasetBasicsWithPermissionsQueryVariables> {
    document = GetDatasetBasicsWithPermissionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetBlocksEncodedByEventTypeDocument = gql`
    query datasetBlocksEncodedByEventType($accountName: AccountName!, $datasetName: DatasetName!, $eventTypes: [MetadataEventType!]!, $encoding: MetadataManifestFormat!) {
  datasets {
    byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
      metadata {
        metadataProjection(eventTypes: $eventTypes) {
          encoded(encoding: $encoding) {
            content
          }
          event {
            ... on AddPushSource {
              sourceName
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetBlocksEncodedByEventTypeGQL extends Apollo.Query<DatasetBlocksEncodedByEventTypeQuery, DatasetBlocksEncodedByEventTypeQueryVariables> {
    document = DatasetBlocksEncodedByEventTypeDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetBlocksSchemaByEventTypeDocument = gql`
    query datasetBlocksSchemaByEventType($accountName: AccountName!, $datasetName: DatasetName!, $eventTypes: [MetadataEventType!]!) {
  datasets {
    byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
      metadata {
        metadataProjection(eventTypes: $eventTypes) {
          event {
            ...SetPollingSourceEvent
            ...AddPushSourceEvent
          }
        }
      }
    }
  }
}
    ${SetPollingSourceEventFragmentDoc}
${AddPushSourceEventFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetBlocksSchemaByEventTypeGQL extends Apollo.Query<DatasetBlocksSchemaByEventTypeQuery, DatasetBlocksSchemaByEventTypeQueryVariables> {
    document = DatasetBlocksSchemaByEventTypeDocument;
    
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetByAccountAndDatasetNameGQL extends Apollo.Query<DatasetByAccountAndDatasetNameQuery, DatasetByAccountAndDatasetNameQueryVariables> {
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
${DatasetPageInfoFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetListCollaboratorsGQL extends Apollo.Query<DatasetListCollaboratorsQuery, DatasetListCollaboratorsQueryVariables> {
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
    providedIn: 'root'
  })
  export class SetRoleCollaboratorGQL extends Apollo.Mutation<SetRoleCollaboratorMutation, SetRoleCollaboratorMutationVariables> {
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
    providedIn: 'root'
  })
  export class UnsetRoleCollaboratorGQL extends Apollo.Mutation<UnsetRoleCollaboratorMutation, UnsetRoleCollaboratorMutationVariables> {
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
      schemaFormat: ODF_JSON
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
    ${DataQueryResultSuccessViewFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDatasetDataSqlRunGQL extends Apollo.Query<GetDatasetDataSqlRunQuery, GetDatasetDataSqlRunQueryVariables> {
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
    providedIn: 'root'
  })
  export class DatasetHeadBlockHashGQL extends Apollo.Query<DatasetHeadBlockHashQuery, DatasetHeadBlockHashQueryVariables> {
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
${DatasetPageInfoFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
${DatasetLineageFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
          ... on DatasetAccessResultAccessible {
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
    providedIn: 'root'
  })
  export class DatasetListDownstreamsGQL extends Apollo.Query<DatasetListDownstreamsQuery, DatasetListDownstreamsQueryVariables> {
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
${DatasetPermissionsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class DatasetPushSyncStatusesGQL extends Apollo.Query<DatasetPushSyncStatusesQuery, DatasetPushSyncStatusesQueryVariables> {
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
        currentSchema(format: ODF_JSON) {
          ...DataSchemaInfo
        }
      }
    }
  }
}
    ${DatasetBasicsFragmentDoc}
${DataSchemaInfoFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetSystemTimeBlockByHashGQL extends Apollo.Query<DatasetSystemTimeBlockByHashQuery, DatasetSystemTimeBlockByHashQueryVariables> {
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
    providedIn: 'root'
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
${DatasetPageInfoFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetsByAccountNameGQL extends Apollo.Query<DatasetsByAccountNameQuery, DatasetsByAccountNameQueryVariables> {
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
    providedIn: 'root'
  })
  export class DatasetsTotalCountByAccountNameGQL extends Apollo.Query<DatasetsTotalCountByAccountNameQuery, DatasetsTotalCountByAccountNameQueryVariables> {
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
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class GetEnabledLoginMethodsGQL extends Apollo.Query<GetEnabledLoginMethodsQuery, GetEnabledLoginMethodsQueryVariables> {
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
    providedIn: 'root'
  })
  export class EnginesGQL extends Apollo.Query<EnginesQuery, EnginesQueryVariables> {
    document = EnginesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DeleteEnvVariableDocument = gql`
    mutation deleteEnvVariable($datasetId: DatasetID!, $datasetEnvVarKey: String!) {
  datasets {
    byId(datasetId: $datasetId) {
      envVars {
        deleteEnvVariable(key: $datasetEnvVarKey) {
          ... on DeleteDatasetEnvVarResultSuccess {
            message
            envVarKey
          }
          ... on DeleteDatasetEnvVarResultNotFound {
            message
            envVarKey
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DeleteEnvVariableGQL extends Apollo.Mutation<DeleteEnvVariableMutation, DeleteEnvVariableMutationVariables> {
    document = DeleteEnvVariableDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const ExposedEnvVariableValueDocument = gql`
    query exposedEnvVariableValue($accountName: AccountName!, $datasetName: DatasetName!, $datasetEnvVarKey: String!) {
  datasets {
    byOwnerAndName(accountName: $accountName, datasetName: $datasetName) {
      envVars {
        exposedValue(datasetEnvVarKey: $datasetEnvVarKey)
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class ExposedEnvVariableValueGQL extends Apollo.Query<ExposedEnvVariableValueQuery, ExposedEnvVariableValueQueryVariables> {
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
          ...ViewDatasetEnvVarConnectionData
        }
      }
    }
  }
}
    ${DatasetBasicsFragmentDoc}
${ViewDatasetEnvVarConnectionDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    ${ViewDatasetEnvVarDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class UpsertEnvVariableGQL extends Apollo.Mutation<UpsertEnvVariableMutation, UpsertEnvVariableMutationVariables> {
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
                fetchNextIteration
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
${TimeDeltaDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDatasetFlowConfigsGQL extends Apollo.Query<GetDatasetFlowConfigsQuery, GetDatasetFlowConfigsQueryVariables> {
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
    providedIn: 'root'
  })
  export class SetCompactionFlowConfigGQL extends Apollo.Mutation<SetCompactionFlowConfigMutation, SetCompactionFlowConfigMutationVariables> {
    document = SetCompactionFlowConfigDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetIngestFlowConfigDocument = gql`
    mutation setIngestFlowConfig($datasetId: DatasetID!, $ingestConfigInput: FlowConfigIngestInput!, $retryPolicyInput: FlowRetryPolicyInput) {
  datasets {
    byId(datasetId: $datasetId) {
      flows {
        configs {
          setIngestConfig(
            ingestConfigInput: $ingestConfigInput
            retryPolicyInput: $retryPolicyInput
          ) {
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
    providedIn: 'root'
  })
  export class SetIngestFlowConfigGQL extends Apollo.Mutation<SetIngestFlowConfigMutation, SetIngestFlowConfigMutationVariables> {
    document = SetIngestFlowConfigDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const PauseDatasetFlowTriggerDocument = gql`
    mutation pauseDatasetFlowTrigger($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType!) {
  datasets {
    byId(datasetId: $datasetId) {
      flows {
        triggers {
          pauseFlow(datasetFlowType: $datasetFlowType)
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class PauseDatasetFlowTriggerGQL extends Apollo.Mutation<PauseDatasetFlowTriggerMutation, PauseDatasetFlowTriggerMutationVariables> {
    document = PauseDatasetFlowTriggerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SetDatasetFlowTriggerDocument = gql`
    mutation setDatasetFlowTrigger($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType!, $triggerRuleInput: FlowTriggerRuleInput!, $triggerStopPolicyInput: FlowTriggerStopPolicyInput!) {
  datasets {
    byId(datasetId: $datasetId) {
      flows {
        triggers {
          setTrigger(
            datasetFlowType: $datasetFlowType
            triggerRuleInput: $triggerRuleInput
            triggerStopPolicyInput: $triggerStopPolicyInput
          ) {
            message
            ... on FlowIncompatibleDatasetKind {
              expectedDatasetKind
              actualDatasetKind
            }
            ... on FlowInvalidTriggerInputError {
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
    providedIn: 'root'
  })
  export class SetDatasetFlowTriggerGQL extends Apollo.Mutation<SetDatasetFlowTriggerMutation, SetDatasetFlowTriggerMutationVariables> {
    document = SetDatasetFlowTriggerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDatasetFlowTriggerDocument = gql`
    query getDatasetFlowTrigger($datasetId: DatasetID!, $datasetFlowType: DatasetFlowType!) {
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
                __typename
                ... on FlowTriggerBatchingRuleBuffering {
                  maxBatchingInterval {
                    ...TimeDeltaData
                  }
                  minRecordsToAwait
                }
              }
              forBreakingChange
            }
            stopPolicy {
              __typename
              ... on FlowTriggerStopPolicyAfterConsecutiveFailures {
                maxFailures
              }
            }
          }
        }
      }
    }
  }
}
    ${TimeDeltaDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class GetDatasetFlowTriggerGQL extends Apollo.Query<GetDatasetFlowTriggerQuery, GetDatasetFlowTriggerQueryVariables> {
    document = GetDatasetFlowTriggerDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const CancelFlowRunDocument = gql`
    mutation cancelFlowRun($datasetId: DatasetID!, $flowId: FlowID!) {
  datasets {
    byId(datasetId: $datasetId) {
      flows {
        runs {
          cancelFlowRun(flowId: $flowId) {
            ... on FlowNotFound {
              flowId
              message
            }
            ... on CancelFlowRunSuccess {
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
    ${FlowSummaryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class CancelFlowRunGQL extends Apollo.Mutation<CancelFlowRunMutation, CancelFlowRunMutationVariables> {
    document = CancelFlowRunDocument;
    
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
${FlowHistoryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    ${AccountFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetFlowsInitiatorsGQL extends Apollo.Query<DatasetFlowsInitiatorsQuery, DatasetFlowsInitiatorsQueryVariables> {
    document = DatasetFlowsInitiatorsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetDatasetListFlowsDocument = gql`
    query getDatasetListFlows($datasetId: DatasetID!, $page: Int, $perPageTable: Int, $perPageTiles: Int, $filters: DatasetFlowFilters) {
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
            filters: {byProcessType: null, byStatus: null, byInitiator: null}
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
${FlowConnectionWidgetDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    providedIn: 'root'
  })
  export class DatasetPauseFlowsGQL extends Apollo.Mutation<DatasetPauseFlowsMutation, DatasetPauseFlowsMutationVariables> {
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
    providedIn: 'root'
  })
  export class DatasetResumeFlowsGQL extends Apollo.Mutation<DatasetResumeFlowsMutation, DatasetResumeFlowsMutationVariables> {
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
    ${FlowSummaryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetTriggerCompactionFlowGQL extends Apollo.Mutation<DatasetTriggerCompactionFlowMutation, DatasetTriggerCompactionFlowMutationVariables> {
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
    ${FlowSummaryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetTriggerIngestFlowGQL extends Apollo.Mutation<DatasetTriggerIngestFlowMutation, DatasetTriggerIngestFlowMutationVariables> {
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
    ${FlowSummaryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetTriggerResetFlowGQL extends Apollo.Mutation<DatasetTriggerResetFlowMutation, DatasetTriggerResetFlowMutationVariables> {
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
    ${FlowSummaryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetTriggerResetToMetadataFlowGQL extends Apollo.Mutation<DatasetTriggerResetToMetadataFlowMutation, DatasetTriggerResetToMetadataFlowMutationVariables> {
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
    ${FlowSummaryDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetTriggerTransformFlowGQL extends Apollo.Mutation<DatasetTriggerTransformFlowMutation, DatasetTriggerTransformFlowMutationVariables> {
    document = DatasetTriggerTransformFlowDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetFlowsProcessesDocument = gql`
    query datasetFlowsProcesses($datasetId: DatasetID!) {
  datasets {
    byId(datasetId: $datasetId) {
      flows {
        processes {
          ...DatasetFlowProcessesData
        }
      }
    }
  }
}
    ${DatasetFlowProcessesDataFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetFlowsProcessesGQL extends Apollo.Query<DatasetFlowsProcessesQuery, DatasetFlowsProcessesQueryVariables> {
    document = DatasetFlowsProcessesDocument;
    
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
        currentDownstreamDependenciesCount
      }
    }
  }
}
    ${DatasetBasicsFragmentDoc}
${MetadataBlockFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    providedIn: 'root'
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
    ${AccountFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
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
    ${DatasetBasicsFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchDatasetsAutocompleteGQL extends Apollo.Query<SearchDatasetsAutocompleteQuery, SearchDatasetsAutocompleteQueryVariables> {
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
${DatasetPageInfoFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SearchDatasetsOverviewGQL extends Apollo.Query<SearchDatasetsOverviewQuery, SearchDatasetsOverviewQueryVariables> {
    document = SearchDatasetsOverviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const SemanticSearchDatasetsOverviewDocument = gql`
    query semanticSearchDatasetsOverview($prompt: String!, $limit: Int) {
  search {
    queryNaturalLanguage(prompt: $prompt, limit: $limit) {
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
${DatasetPageInfoFragmentDoc}`;

  @Injectable({
    providedIn: 'root'
  })
  export class SemanticSearchDatasetsOverviewGQL extends Apollo.Query<SemanticSearchDatasetsOverviewQuery, SemanticSearchDatasetsOverviewQueryVariables> {
    document = SemanticSearchDatasetsOverviewDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetWebhookByIdDocument = gql`
    query datasetWebhookById($datasetId: DatasetID!, $id: WebhookSubscriptionID!) {
  datasets {
    byId(datasetId: $datasetId) {
      webhooks {
        subscription(id: $id) {
          id
          label
          datasetId
          targetUrl
          eventTypes
          status
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetWebhookByIdGQL extends Apollo.Query<DatasetWebhookByIdQuery, DatasetWebhookByIdQueryVariables> {
    document = DatasetWebhookByIdDocument;
    
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
    providedIn: 'root'
  })
  export class DatasetWebhookCreateSubscriptionGQL extends Apollo.Mutation<DatasetWebhookCreateSubscriptionMutation, DatasetWebhookCreateSubscriptionMutationVariables> {
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
    providedIn: 'root'
  })
  export class DatasetWebhookPauseSubscriptionGQL extends Apollo.Mutation<DatasetWebhookPauseSubscriptionMutation, DatasetWebhookPauseSubscriptionMutationVariables> {
    document = DatasetWebhookPauseSubscriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetWebhookReactivateSubscriptionDocument = gql`
    mutation datasetWebhookReactivateSubscription($datasetId: DatasetID!, $id: WebhookSubscriptionID!) {
  datasets {
    byId(datasetId: $datasetId) {
      webhooks {
        subscription(id: $id) {
          reactivate {
            message
            ... on ReactivateWebhookSubscriptionResultUnexpected {
              status
            }
          }
        }
      }
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class DatasetWebhookReactivateSubscriptionGQL extends Apollo.Mutation<DatasetWebhookReactivateSubscriptionMutation, DatasetWebhookReactivateSubscriptionMutationVariables> {
    document = DatasetWebhookReactivateSubscriptionDocument;
    
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
    providedIn: 'root'
  })
  export class DatasetWebhookRemoveSubscriptionGQL extends Apollo.Mutation<DatasetWebhookRemoveSubscriptionMutation, DatasetWebhookRemoveSubscriptionMutationVariables> {
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
    providedIn: 'root'
  })
  export class DatasetWebhookResumeSubscriptionGQL extends Apollo.Mutation<DatasetWebhookResumeSubscriptionMutation, DatasetWebhookResumeSubscriptionMutationVariables> {
    document = DatasetWebhookResumeSubscriptionDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetWebhookRotateSecretDocument = gql`
    mutation datasetWebhookRotateSecret($datasetId: DatasetID!, $id: WebhookSubscriptionID!) {
  datasets {
    byId(datasetId: $datasetId) {
      webhooks {
        subscription(id: $id) {
          rotateSecret {
            ... on RotateWebhookSubscriptionSecretSuccess {
              newSecret
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
    providedIn: 'root'
  })
  export class DatasetWebhookRotateSecretGQL extends Apollo.Mutation<DatasetWebhookRotateSecretMutation, DatasetWebhookRotateSecretMutationVariables> {
    document = DatasetWebhookRotateSecretDocument;
    
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
    providedIn: 'root'
  })
  export class DatasetWebhookSubscriptionsGQL extends Apollo.Query<DatasetWebhookSubscriptionsQuery, DatasetWebhookSubscriptionsQueryVariables> {
    document = DatasetWebhookSubscriptionsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const DatasetWebhookUpdateSubscriptionDocument = gql`
    mutation datasetWebhookUpdateSubscription($datasetId: DatasetID!, $id: WebhookSubscriptionID!, $input: WebhookSubscriptionInput!) {
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
    providedIn: 'root'
  })
  export class DatasetWebhookUpdateSubscriptionGQL extends Apollo.Mutation<DatasetWebhookUpdateSubscriptionMutation, DatasetWebhookUpdateSubscriptionMutationVariables> {
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
    providedIn: 'root'
  })
  export class WebhookEventTypesGQL extends Apollo.Query<WebhookEventTypesQuery, WebhookEventTypesQueryVariables> {
    document = WebhookEventTypesDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }