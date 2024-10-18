import { DataBatchFormat, DataSchemaFormat, QueryDialect } from "src/app/api/kamu.graphql.interface";

export interface QueryExplainerResponse {
    input: QueryExplainerInputType;
    commitment: QueryExplainerCommitmentType;
    proof: QueryExplainerProofType;
    output?: QueryExplainerOutputType;
}

export interface QueryExplainerOutputType {
    data: [string[]];
    dataFormat: keyof typeof DataBatchFormat;
    schema: QueryExplainerSchemaType;
}

export interface QueryExplainerSchemaType {
    fields: [{ name: string }];
}

export interface QueryExplainerProofType {
    proofValue: string;
    type: string;
    verificationMethod: string;
}

export interface QueryExplainerCommitmentType {
    inputHash: string;
    outputHash: string;
    subQueriesHash: string;
}

export interface QueryExplainerInputType {
    query: string;
    include: string[];
    dataFormat: keyof typeof DataBatchFormat;
    queryDialect?: keyof typeof QueryDialect;
    schemaFormat?: keyof typeof DataSchemaFormat;
    datasets?: [{ alias: string; blockHash: string; id: string }];
    skip?: number;
    limit?: number;
}

export interface VerifyQueryResponse {
    ok: boolean;
    error?: VerifyQueryError;
}

export enum VerifyQueryKindError {
    InputHash = "InvalidRequest::InputHash",
    SubQueriesHash = "InvalidRequest::SubQueriesHash",
    BadSignature = "InvalidRequest::BadSignature",
    OutputMismatch = "VerificationFailed::OutputMismatch",
    DatasetNotFound = "VerificationFailed::DatasetNotFound",
    DatasetBlockNotFound = "VerificationFailed::DatasetBlockNotFound",
}

export interface VerifyQueryError {
    kind: VerifyQueryKindError;
    message: string;
}

export interface VerifyQueryInputHashError extends VerifyQueryError {}
export interface VerifyQuerySubQueriesHashError extends VerifyQueryError {}
export interface VerifyQueryBadSignatureError extends VerifyQueryError {}
export interface VerifyQueryOutputMismatchError extends VerifyQueryError {
    expected_hash: string;
    actual_hash: string;
}
export interface VerifyQueryDatasetNotFoundError extends VerifyQueryError {
    dataset_id: string;
}

export interface VerifyQueryDatasetBlockNotFoundError extends VerifyQueryError {
    dataset_id: string;
    block_hash: string;
}
