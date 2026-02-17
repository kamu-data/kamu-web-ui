/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    QueryExplainerOutputType,
    QueryExplainerProofResponse,
    VerifyQueryDatasetBlockNotFoundError,
    VerifyQueryDatasetNotFoundError,
    VerifyQueryKindError,
    VerifyQueryOutputMismatchError,
    VerifyQueryResponse,
} from "src/app/query-explainer/query-explainer.types";

export const mockTextareaCommitment: string = `
{
    "input": {
        "query": "select\n  *\nfrom 'account.tokens.portfolio' limit 1",
        "queryDialect": "SqlDataFusion",
        "dataFormat": "JsonAoS",
        "include": [
            "Input",
            "Proof"
        ],
        "datasets": [
            {
                "id": "did:odf:fed01df8964328b3b36fdfc5b140c5aea8795d445403a577428b2eafa5111f47dc212",
                "alias": "account.tokens.portfolio",
                "blockHash": "f16207781e20aca696acfafc462429613e7d5c3d0f333d6bd0003240b53a083a52d27"
            }
        ],
        "skip": 0,
        "limit": 100
    },
    "subQueries": [],
    "commitment": {
        "inputHash": "f1620cd150e7b1de0ae94d1e4a36a495d9719d5e74151efe5bd8c6a50e61eeb7e045c",
        "outputHash": "f1620d0c403f71d659d040e6624806abf9159b83be4c3019e0daf3b362143397cdc33",
        "subQueriesHash": "f1620ca4510738395af1429224dd785675309c344b2b549632e20275c69b15ed1d210"
    },
    "proof": {
        "type": "Ed25519Signature2020",
        "verificationMethod": "did:key:z6MksqxvcNrqUYMC2LrAFcEtjjqEMLsUi1Ek8x6VFA8vA4xF",
        "proofValue": "uM3hJArKzYILkfYFOv1kqjqrxRn9_joCHFdQuTAflCJ7SeYwjcOGR5p8VHpVx4uKMTG_2SwcieFCcGellRNgpDQ"
    }
}
`;

export const mockQueryExplainerOutput: QueryExplainerOutputType = {
    data: [["0", 0, "2024-10-22T11:54:24.234Z", "2024-10-22T11:54:24.100Z", "100", "200"]],

    dataFormat: "JsonAoA",
    schemaFormat: "ArrowJson",
    schema: {
        fields: [
            {
                name: "offset",
            },
            {
                name: "op",
            },
            {
                name: "system_time",
            },
            {
                name: "event_time",
            },
            {
                name: "A",
            },
            {
                name: "B",
            },
        ],
    },
};

export const mockQueryExplainerEmptyOutput: QueryExplainerOutputType = {
    data: [],

    dataFormat: "JsonAoA",
    schemaFormat: "ArrowJson",
    schema: {
        fields: [
            {
                name: "offset",
            },
            {
                name: "op",
            },
            {
                name: "system_time",
            },
            {
                name: "event_time",
            },
            {
                name: "A",
            },
            {
                name: "B",
            },
        ],
    },
};

export const mockVerifyQueryResponseSuccess: VerifyQueryResponse = { ok: true };
export const mockVerifyQueryResponseError: VerifyQueryResponse = {
    ok: false,
    error: {
        kind: VerifyQueryKindError.InputHash,
        message: "Error",
    },
};
export const mockDatasetBlockNotFoundError: VerifyQueryResponse = {
    ok: false,
    error: {
        dataset_id: "test-id",
        block_hash: "f16207781e20aca696acfafc462429613e7d5c3d0f333d6bd0003240b53a083a52d27",
        kind: VerifyQueryKindError.DatasetBlockNotFound,
        message: "Error dataset block not found",
    } as VerifyQueryDatasetBlockNotFoundError,
};

export const mockDatasetNotFoundError: VerifyQueryResponse = {
    ok: false,
    error: {
        dataset_id: "did:odf:fed01df8964328b3b36fdfc5b140c5aea8795d445403a577428b2eafa5111f47dc212",
        kind: VerifyQueryKindError.DatasetNotFound,
        message: "Error dataset not found",
    } as VerifyQueryDatasetNotFoundError,
};

export const mockVerifyQueryOutputMismatchError: VerifyQueryResponse = {
    ok: false,
    error: {
        kind: VerifyQueryKindError.OutputMismatch,
        message: "Error",
        expected_hash: "f16207781e20aca696acfafc462429613e7d5c3d0f333d6bd0003240b53a083a52d27",
        actual_hash: "f16207781e20aca696acfafc462429613e7d5c3d0f333d6bd0003240b53a083a52d29",
    } as VerifyQueryOutputMismatchError,
};

export const mockQueryExplainerResponse: QueryExplainerProofResponse = {
    input: {
        query: 'select block_number from "account.tokens.portfolio" order by offset desc limit 1',
        queryDialect: "SqlDataFusion",
        dataFormat: "JsonAoA",
        include: ["Input", "Proof", "Schema"],
        schemaFormat: "ArrowJson",
        datasets: [
            {
                id: "did:odf:fed01df8964328b3b36fdfc5b140c5aea8795d445403a577428b2eafa5111f47dc212",
                alias: "account.tokens.portfolio",
                blockHash: "f16207781e20aca696acfafc462429613e7d5c3d0f333d6bd0003240b53a083a52d27",
            },
        ],
        skip: 0,
        limit: 100,
    },

    commitment: {
        inputHash: "f1620dadb9057b8e95e5956a34db4edaa6a68c86ba9cab409336b120a69f21f46e881",
        outputHash: "f1620b7f5fd290ed9d56967f36dd75dc0af02f7b2e5076aab96128277b31b161b1fea",
        subQueriesHash: "f1620ca4510738395af1429224dd785675309c344b2b549632e20275c69b15ed1d210",
    },
    proof: {
        type: "Ed25519Signature2020",
        verificationMethod: "did:key:z6MksqxvcNrqUYMC2LrAFcEtjjqEMLsUi1Ek8x6VFA8vA4xF",
        proofValue: "uG8trtFVTQvZmPcTMhxyYZRG-b-4Rp-fJs8uZbUPir6Rm_TExy8bTxT7Oynq25wa3AQxPOqdH3_FhUoZhIfAnBQ",
    },
};
