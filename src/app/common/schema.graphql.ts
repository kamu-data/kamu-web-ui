import {Injectable} from "@angular/core";

@Injectable()
export default class SchemaForDataTabs {
  public static schema = "schema {\n" +
      "  query: Query\n" +
      "  mutation: Mutation\n" +
      "}\n" +
      "type AccessToken {\n" +
      "  accessToken: String!\n" +
      "  scope: String!\n" +
      "  tokenType: String!\n" +
      "}\n" +
      "interface Account {\n" +
      "  id: AccountID!\n" +
      "  name: String!\n" +
      "}\n" +
      "scalar AccountID\n" +
      "type AccountInfo {\n" +
      "  login: String!\n" +
      "  name: String!\n" +
      "  email: String\n" +
      "  avatarUrl: String\n" +
      "  gravatarId: String\n" +
      "}\n" +
      "scalar AccountName\n" +
      "type Accounts {\n" +
      "  \"Returns account by its ID\"\n" +
      "  byId(accountId: AccountID!): Account\n" +
      "  \"Returns account by its name\"\n" +
      "  byName(name: String!): Account\n" +
      "}\n" +
      "type Auth {\n" +
      "  githubLogin(code: String!): LoginResponse!\n" +
      "  accountInfo(accessToken: String!): AccountInfo!\n" +
      "}\n" +
      "type BlockInterval {\n" +
      "  start: Multihash!\n" +
      "  end: Multihash!\n" +
      "}\n" +
      "type BlockRef {\n" +
      "  name: String!\n" +
      "  blockHash: Multihash!\n" +
      "}\n" +
      "type DataSchema {\n" +
      "  format: DataSchemaFormat!\n" +
      "  content: String!\n" +
      "}\n" +
      "enum DataSchemaFormat {\n" +
      "  PARQUET\n" +
      "  PARQUET_JSON\n" +
      "}\n" +
      "type DataSlice {\n" +
      "  format: DataSliceFormat!\n" +
      "  content: String!\n" +
      "}\n" +
      "enum DataSliceFormat {\n" +
      "  JSON\n" +
      "  JSON_LD\n" +
      "  JSON_SO_A\n" +
      "  CSV\n" +
      "}\n" +
      "type DataSliceMetadata {\n" +
      "  logicalHash: Multihash!\n" +
      "  physicalHash: Multihash!\n" +
      "  interval: OffsetInterval!\n" +
      "}\n" +
      "type Dataset {\n" +
      "  \"Unique identifier of the dataset\"\n" +
      "  id: DatasetID!\n" +
      "  \"\"\"\n" +
      "  Symbolic name of the dataset.\n" +
      "  Name can change over the dataset's lifetime. For unique identifier use `id()`.\n" +
      "  \"\"\"\n" +
      "  name: DatasetName!\n" +
      "  \"Returns the user or organization that owns this dataset\"\n" +
      "  owner: Account!\n" +
      "  \"Returns the kind of a dataset (Root or Derivative)\"\n" +
      "  kind: DatasetKind!\n" +
      "  \"Access to the data of the dataset\"\n" +
      "  data: DatasetData!\n" +
      "  \"Access to the metadata of the dataset\"\n" +
      "  metadata: DatasetMetadata!\n" +
      "  \"Creation time of the first metadata block in the chain\"\n" +
      "  createdAt: DateTime!\n" +
      "  \"Creation time of the most recent metadata block in the chain\"\n" +
      "  lastUpdatedAt: DateTime!\n" +
      "}\n" +
      "type DatasetConnection {\n" +
      "  \"A shorthand for `edges { node { ... } }`\"\n" +
      "  nodes: [Dataset!]!\n" +
      "  \"Approximate number of total nodes\"\n" +
      "  totalCount: Int\n" +
      "  \"Page information\"\n" +
      "  pageInfo: PageBasedInfo!\n" +
      "  edges: [DatasetEdge!]!\n" +
      "}\n" +
      "type DatasetData {\n" +
      "  \"Total number of records in this dataset\"\n" +
      "  numRecordsTotal: Int!\n" +
      "  \"An estimated size of data on disk not accounting for replication or caching\"\n" +
      "  estimatedSize: Int!\n" +
      "  \"\"\"\n" +
      "  Returns the specified number of the latest records in the dataset\n" +
      "  This is equivalent to the SQL query: `SELECT * FROM dataset ORDER BY event_time DESC LIMIT N`\n" +
      "  \"\"\"\n" +
      "  tail(numRecords: Int, format: DataSliceFormat): DataSlice!\n" +
      "}\n" +
      "type DatasetEdge {\n" +
      "  node: Dataset!\n" +
      "}\n" +
      "scalar DatasetID\n" +
      "enum DatasetKind {\n" +
      "  ROOT\n" +
      "  DERIVATIVE\n" +
      "}\n" +
      "type DatasetMetadata {\n" +
      "  \"Access to the temporal metadata chain of the dataset\"\n" +
      "  chain: MetadataChain!\n" +
      "  \"Last recorded watermark\"\n" +
      "  currentWatermark: DateTime\n" +
      "  \"Latest data schema\"\n" +
      "  currentSchema(format: DataSchemaFormat): DataSchema!\n" +
      "  \"Current upstream dependencies of a dataset\"\n" +
      "  currentUpstreamDependencies: [Dataset!]!\n" +
      "  \"Current downstream dependencies of a dataset\"\n" +
      "  currentDownstreamDependencies: [Dataset!]!\n" +
      "}\n" +
      "scalar DatasetName\n" +
      "type Datasets {\n" +
      "  \"Returns dataset by its ID\"\n" +
      "  byId(datasetId: DatasetID!): Dataset\n" +
      "  \"Returns dataset by its owner and name\"\n" +
      "  byOwnerAndName(accountName: AccountName!, datasetName: DatasetName!): Dataset\n" +
      "  \"Returns datasets belonging to the specified account\"\n" +
      "  byAccountId(accountId: AccountID!, page: Int, perPage: Int! = 15): DatasetConnection!\n" +
      "  \"Returns datasets belonging to the specified account\"\n" +
      "  byAccountName(accountName: AccountName!, page: Int, perPage: Int! = 15): DatasetConnection!\n" +
      "}\n" +
      "\"\"\"\n" +
      "Implement the DateTime<Utc> scalar\n" +
      "\n" +
      "The input/output is a string in RFC3339 format.\n" +
      "\"\"\"\n" +
      "scalar DateTime\n" +
      "\"The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).\"\n" +
      "scalar Float\n" +
      "type InputSliceMetadata {\n" +
      "  datasetId: DatasetID!\n" +
      "  blockInterval: BlockInterval\n" +
      "  dataInterval: OffsetInterval\n" +
      "}\n" +
      "type LoginResponse {\n" +
      "  token: AccessToken!\n" +
      "  accountInfo: AccountInfo!\n" +
      "}\n" +
      "type MetadataBlock {\n" +
      "  systemTime: DateTime!\n" +
      "  blockHash: Multihash!\n" +
      "  prevBlockHash: Multihash\n" +
      "  event: MetadataEvent!\n" +
      "}\n" +
      "type MetadataBlockConnection {\n" +
      "  \"A shorthand for `edges { node { ... } }`\"\n" +
      "  nodes: [MetadataBlock!]!\n" +
      "  \"Approximate number of total nodes\"\n" +
      "  totalCount: Int\n" +
      "  \"Page information\"\n" +
      "  pageInfo: PageBasedInfo!\n" +
      "  edges: [MetadataBlockEdge!]!\n" +
      "}\n" +
      "type MetadataBlockEdge {\n" +
      "  node: MetadataBlock!\n" +
      "}\n" +
      "type MetadataChain {\n" +
      "  \"Returns all named metadata block references\"\n" +
      "  refs: [BlockRef!]!\n" +
      "  \"Returns a metadata block corresponding to the specified hash\"\n" +
      "  blockByHash(hash: Multihash!): MetadataBlock\n" +
      "  \"Iterates all metadata blocks in the reverse chronological order\"\n" +
      "  blocks(page: Int, perPage: Int! = 20): MetadataBlockConnection!\n" +
      "}\n" +
      "interface MetadataEvent {\n" +
      "  dummy: String!\n" +
      "}\n" +
      "type MetadataEventAddData implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "  outputData: DataSliceMetadata!\n" +
      "  outputWatermark: DateTime\n" +
      "}\n" +
      "type MetadataEventExecuteQuery implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "  inputSlices: [InputSliceMetadata!]!\n" +
      "  outputData: DataSliceMetadata\n" +
      "  outputWatermark: DateTime\n" +
      "}\n" +
      "type MetadataEventSeed implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "  datasetId: DatasetID!\n" +
      "  datasetKind: DatasetKind!\n" +
      "}\n" +
      "type MetadataEventSetPollingSource implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "}\n" +
      "type MetadataEventSetTransform implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "}\n" +
      "type MetadataEventSetVocab implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "}\n" +
      "type MetadataEventSetWatermark implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "  outputWatermark: DateTime!\n" +
      "}\n" +
      "type MetadataEventUnsupported implements MetadataEvent {\n" +
      "  dummy: String!\n" +
      "}\n" +
      "scalar Multihash\n" +
      "type Mutation {\n" +
      "  auth: Auth!\n" +
      "}\n" +
      "type OffsetInterval {\n" +
      "  start: Int!\n" +
      "  end: Int!\n" +
      "}\n" +
      "type Organization implements Account {\n" +
      "  \"Unique and stable identitfier of this organization account\"\n" +
      "  id: AccountID!\n" +
      "  \"Symbolic account name\"\n" +
      "  name: String!\n" +
      "}\n" +
      "type PageBasedInfo {\n" +
      "  \"When paginating backwards, are there more items?\"\n" +
      "  hasPreviousPage: Boolean!\n" +
      "  \"When paginating forwards, are there more items?\"\n" +
      "  hasNextPage: Boolean!\n" +
      "  \"Index of the current page\"\n" +
      "  currentPage: Int!\n" +
      "  \"Approximate number of total pages assuming number of nodes per page stays the same\"\n" +
      "  totalPages: Int\n" +
      "}\n" +
      "type Query {\n" +
      "  \"Returns the version of the GQL API\"\n" +
      "  apiVersion: String!\n" +
      "  \"Dataset-related functionality group\"\n" +
      "  datasets: Datasets!\n" +
      "  \"Account-related functionality group\"\n" +
      "  accounts: Accounts!\n" +
      "  \"Search-related functionality group\"\n" +
      "  search: Search!\n" +
      "}\n" +
      "type Search {\n" +
      "  \"Perform search across all resources\"\n" +
      "  query(query: String!, page: Int, perPage: Int! = 15): SearchResultConnection!\n" +
      "}\n" +
      "union SearchResult = Dataset\n" +
      "type SearchResultConnection {\n" +
      "  \"A shorthand for `edges { node { ... } }`\"\n" +
      "  nodes: [SearchResult!]!\n" +
      "  \"Approximate number of total nodes\"\n" +
      "  totalCount: Int\n" +
      "  \"Page information\"\n" +
      "  pageInfo: PageBasedInfo!\n" +
      "  edges: [SearchResultEdge!]!\n" +
      "}\n" +
      "type SearchResultEdge {\n" +
      "  node: SearchResult!\n" +
      "}\n" +
      "type User implements Account {\n" +
      "  \"Unique and stable identitfier of this user account\"\n" +
      "  id: AccountID!\n" +
      "  \"Symbolic account name\"\n" +
      "  name: String!\n" +
      "}\n";
}