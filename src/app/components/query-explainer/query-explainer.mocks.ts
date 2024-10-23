import {
    QueryExplainerOutputType,
    QueryExplainerResponse,
    VerifyQueryKindError,
    VerifyQueryResponse,
} from "./query-explainer.types";

export const mockQueryExplainerOutput: QueryExplainerOutputType = {
    data: [["0", "0", "2024-10-22T11:54:24.234Z", "2024-10-22T11:54:24.100Z", "100", "200"]],
    dataFormat: "JsonAoa",
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

export const mockQueryExplainerResponse: QueryExplainerResponse = {
    input: {
        query: 'select block_number from "account.tokens.portfolio" order by offset desc limit 1',
        queryDialect: "SqlDataFusion",
        dataFormat: "JsonAoa",
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
    output: {
        data: [["20865224"]],
        dataFormat: "JsonAoa",
        schema: {
            fields: [
                {
                    name: "block_number",
                },
            ],
        },
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
