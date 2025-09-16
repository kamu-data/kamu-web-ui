/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HttpHeaders } from "@angular/common/http";
import { DataSchemaFormat, QueryDialect } from "src/app/api/kamu.graphql.interface";
import { UploadPrepareResponse } from "src/app/interface/ingest-via-file-upload.types";
import { DataRow } from "../interface/dataset.interface";

export enum QueryExplainerDataFormat {
    JsonAoS = "JsonAoS",
    JsonSoA = "JsonSoA",
    JsonAoA = "JsonAoA",
}

export interface QueryExplainerResponse {
    input: QueryExplainerInputType;
    commitment: QueryExplainerCommitmentType;
    proof: QueryExplainerProofType;
    output?: QueryExplainerOutputType;
    // TODO: need implementation
    subQueries?: unknown[];
}

export interface QueryExplainerProofResponse {
    input: QueryExplainerInputType;
    commitment: QueryExplainerCommitmentType;
    proof: QueryExplainerProofType;
    // TODO: need implementation
    subQueries?: unknown[];
}

export interface SqlQueryExplanationResponse {
    input: QueryExplainerInputType;
    output?: QueryExplainerOutputType;
    proof?: QueryExplainerProofType;
    commitment?: QueryExplainerCommitmentType;
    // TODO: need implementation
    subQueries?: unknown[];
}

export interface QueryExplainerInputOutputResponse {
    input: QueryExplainerInputType;
    output?: QueryExplainerOutputType;
}

export interface QueryExplainerDataJsonAosResponse {
    output?: QueryExplainerOutputType;
}

export interface QueryExplainerOutputType {
    data: object[] | [string[]] | DataRow[];
    dataFormat: keyof typeof QueryExplainerDataFormat;
    schema: QueryExplainerSchemaType;
    schemaFormat: keyof typeof DataSchemaFormat;
}

export interface QueryExplainerSchemaType {
    fields: { name: string }[];
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
    include: QueryExplainerIncludeType[];
    dataFormat?: keyof typeof QueryExplainerDataFormat;
    queryDialect?: keyof typeof QueryDialect;
    schemaFormat?: keyof typeof DataSchemaFormat;
    datasets?: QueryExplainerDatasetsType[];
    skip?: number;
    limit?: number;
}

export type QueryExplainerIncludeType = "Proof" | "Input" | "Schema";

export interface QueryExplainerDatasetsType {
    alias: string;
    blockHash: string;
    id: string;
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

export interface UploadPrepareCommitmentData {
    uploadPrepareResponse: UploadPrepareResponse;
    bodyObject: FormData;
    uploadHeaders: HttpHeaders;
}
