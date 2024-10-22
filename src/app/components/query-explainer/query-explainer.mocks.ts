import { QueryExplainerOutputType, VerifyQueryKindError, VerifyQueryResponse } from "./query-explainer.types";

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
