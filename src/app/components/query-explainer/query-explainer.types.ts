export interface QueryExplainerResponse {
    input: {
        query: string;
        queryDialect: string;
        dataFormat: string;
        schemaFormat: string;
        include: string[];
        skip: number;
        limit: number;
        datasets: [{ alias: string; blockHash: string; id: string }];
    };
    commitment: {
        inputHash: string;
        outputHash: string;
        subQueriesHash: string;
    };
    proof: {
        proofValue: string;
        type: string;
        verificationMethod: string;
    };
    output?: {
        data: [string[]];
        dataFormat: string;
        schema: {
            fields: [{ name: string }];
        };
    };
}

export interface VerifyQueryResponse {
    ok: boolean;
    error?: {
        kind: string;
        message: string;
        actual_hash?: string;
        expected_hash?: string;
    };
}
