import { mockDatasetBasicsFragment } from "./../../search/mock.data";
import {
    DatasetHistoryUpdate,
    DataSqlErrorUpdate,
    DataUpdate,
} from "../dataset.subscriptions.interface";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";

export const mockDataUpdate: DataUpdate = {
    schema: {
        name: "id",
        type: "string",
        fields: [
            {
                name: "mockName",
                repetition: "mockRepetition",
                type: "mockType",
            },
        ],
    },
    content: [
        {
            mockName: "someValueOfMockType",
        },
    ],
};

export const mockSqlErrorUpdate: DataSqlErrorUpdate = {
    error: "sql parser error",
};

export const mockHistoryUpdate: DatasetHistoryUpdate = {
    history: [
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
            sequenceNumber: 14,
            prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
            systemTime: "2022-08-05T21:19:28.817281255+00:00",
            author: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
            event: {
                __typename: "AddData",
                outputData: {
                    __typename: "DataSlice",
                    interval: {
                        __typename: "OffsetInterval",
                        start: 0,
                        end: 596125,
                    },
                    logicalHash:
                        "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                    physicalHash:
                        "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                    size: 300,
                },
            },
        },
        {
            __typename: "MetadataBlockExtended",
            blockHash: "zW1k7Mc19BhaEDPmuPrQcSLWJkRaCd9MB7X4SeGvqKzFi3d",
            prevBlockHash: "zW1jzqJxDwLStfBA8jj5oxAd51otwte3xNtZSBkMVtBAbyc",
            systemTime: "2022-08-05T21:17:30.613911358+00:00",
            sequenceNumber: 3,
            author: {
                __typename: "User",
                id: "1",
                name: "kamu",
            },
            event: {
                __typename: "SetInfo",
            },
        },
    ],
    pageInfo: {
        __typename: "PageBasedInfo",
        hasNextPage: false,
        hasPreviousPage: false,
        currentPage: 0,
        totalPages: 10,
    },
};

export const mockLineageUpdate = {
    nodes: [mockDatasetBasicsFragment],
    edges: [[mockDatasetBasicsFragment, mockDatasetBasicsFragment]],
    origin: mockDatasetBasicsFragment,
};

export const mockOverviewDataUpdate = {
    content: [
        {
            offset: 6908,
            system_time: "2022-08-05 21:15:03.947",
            block_time: "2022-08-05 20:24:55",
            token_symbol: "rETH",
            event_name: "TokensMinted",
            amount: 0.009679238156255232,
            eth_amount: 0.010000000272564223,
            block_number: 15284454,
            block_hash:
                "0x887569ff02456b8cde2ade8e0ee5b48d441800c8c6d92d1414a9648902807558",
            transaction_index: 224,
            transaction_hash:
                "0xa88698d288550d09653e6cec3038ea30fe8f74eb40941eba93b05024037426d7",
            log_index: 355,
        },
    ],
    overview: {
        __typename: "Dataset",
        id: "did:odf:z4k88e8u3rDWqP6sq96Z7gfYdHXiuG9ZDGkdPxbtqFw8VCVJvEu",
        kind: DatasetKind.Root,
        name: "net.rocketpool.reth.mint-burn",
        owner: {
            __typename: "User",
            id: "1",
            name: "kamu",
        },
        data: {
            __typename: "DatasetData",
            numRecordsTotal: 6909,
            estimatedSize: 1102418,
        },
        metadata: {
            __typename: "DatasetMetadata",
            currentInfo: {
                __typename: "SetInfo",
                description: null,
                keywords: null,
            },
            currentLicense: null,
            currentWatermark: "2022-08-05T20:24:55+00:00",
            currentTransform: null,
            currentSchema: {
                __typename: "DataSchema",
                format: "PARQUET_JSON",
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "token_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "event_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "log_index", "repetition": "OPTIONAL", "type": "INT32"}]}',
            },
            currentUpstreamDependencies: [],
            currentDownstreamDependencies: [],
            currentReadme: null,
            chain: {
                __typename: "MetadataChain",
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash:
                                "zW1fSULqRHyTyhGXeCP4f8zX8QxcNVKNhVui42BWRdzHet3",
                            prevBlockHash:
                                "zW1prmMP3XKbMfdWn9MQWpy4WaT8u8LADxXb8us7CTVb1Vu",
                            systemTime: "2022-08-05T21:15:03.947245004+00:00",
                            sequenceNumber: 14,
                            author: {
                                __typename: "User",
                                id: "1",
                                name: "kamu",
                            },
                            event: {
                                __typename: "AddData",
                                addedOutputData: {
                                    __typename: "DataSlice",
                                    interval: {
                                        __typename: "OffsetInterval",
                                        start: 0,
                                        end: 6908,
                                    },
                                    logicalHash:
                                        "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                                    physicalHash:
                                        "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                                },
                            },
                        },
                    ],
                    totalCount: 4,
                    pageInfo: {
                        __typename: "PageBasedInfo",
                        hasNextPage: true,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 4,
                    },
                },
            },
        },
        createdAt: "2022-08-05T21:10:57.332924745+00:00",
        lastUpdatedAt: "2022-08-05T21:15:03.947245004+00:00",
    },
    size: {
        __typename: "DatasetData",
        numRecordsTotal: 6909,
        estimatedSize: 1102418,
    },
};

export const mockMetadataSchemaUpdate = {
    schema: {
        name: "spark_schema",
        type: "struct",
        fields: [
            {
                name: "offset",
                repetition: "OPTIONAL",
                type: "INT64",
            },
            {
                name: "system_time",
                repetition: "REQUIRED",
                type: "INT96",
            },
            {
                name: "id",
                repetition: "OPTIONAL",
                type: "INT64",
            },
            {
                name: "reported_date",
                repetition: "OPTIONAL",
                type: "INT96",
            },
            {
                name: "gender",
                repetition: "REQUIRED",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "age_group",
                repetition: "REQUIRED",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "location",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
        ],
    },
    metadata: {
        __typename: "Dataset",
        id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
        kind: "DERIVATIVE",
        name: "alberta.case-details.hm",
        owner: {
            __typename: "User",
            id: "1",
            name: "kamu",
        },
        data: {
            __typename: "DatasetData",
            tail: {
                __typename: "DataQueryResultSuccess",
                schema: {
                    __typename: "DataSchema",
                    format: "PARQUET",
                    content:
                        "message arrow_schema {\n  OPTIONAL INT64 offset;\n  REQUIRED INT64 system_time (TIMESTAMP(NANOS,false));\n  OPTIONAL INT64 id;\n  OPTIONAL INT64 reported_date (TIMESTAMP(NANOS,false));\n  REQUIRED BYTE_ARRAY gender (STRING);\n  REQUIRED BYTE_ARRAY age_group (STRING);\n  OPTIONAL BYTE_ARRAY location (STRING);\n}\n",
                },
                data: {
                    __typename: "DataBatch",
                    format: "JSON",
                    content:
                        '[{"age_group":"50s","gender":"F","id":595254,"location":"Calgary Zone","offset":596125,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"30s","gender":"M","id":377821,"location":"North Zone","offset":596124,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"60s","gender":"F","id":595723,"location":"South Zone","offset":596123,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"30s","gender":"M","id":457371,"location":"Calgary Zone","offset":596122,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"20s","gender":"F","id":457368,"location":"Edmonton Zone","offset":596121,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"60s","gender":"F","id":351389,"location":"Edmonton Zone","offset":596120,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"80s","gender":"F","id":298274,"location":"Calgary Zone","offset":596119,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"30s","gender":"F","id":324898,"location":"Calgary Zone","offset":596118,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"70s","gender":"F","id":484338,"location":"Calgary Zone","offset":596117,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"},{"age_group":"30s","gender":"F","id":351387,"location":"Edmonton Zone","offset":596116,"reported_date":"2022-08-01 00:00:00","system_time":"2022-08-05 21:20:08.053635"}]',
                },
            },
            numRecordsTotal: 596126,
            estimatedSize: 5967476,
        },
        metadata: {
            __typename: "DatasetMetadata",
            currentInfo: {
                __typename: "SetInfo",
                description:
                    "Confirmed positive cases of COVID-19 in Alberta (harmonized).",
                keywords: [
                    "Healthcare",
                    "Epidemiology",
                    "COVID-19",
                    "SARS-CoV-2",
                    "Disaggregated",
                    "Anonymized",
                    "Alberta",
                    "Canada",
                    "Harmonized",
                ],
            },
            currentLicense: {
                __typename: "SetLicense",
                shortName: "OGL-Canada-2.0",
                name: "Open Government Licence - Canada",
                spdxId: "OGL-Canada-2.0",
                websiteUrl:
                    "https://open.canada.ca/en/open-government-licence-canada",
            },
            currentWatermark: "2022-08-01T00:00:00+00:00",
            currentTransform: {
                __typename: "SetTransform",
                inputs: [
                    {
                        __typename: "TransformInput",
                        dataset: {
                            __typename: "Dataset",
                            id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                            kind: "ROOT",
                            name: "alberta.case-details",
                            owner: {
                                __typename: "User",
                                id: "1",
                                name: "kamu",
                            },
                        },
                    },
                ],
                transform: {
                    __typename: "TransformSql",
                    engine: "spark",
                    version: null,
                    queries: [
                        {
                            __typename: "SqlQueryStep",
                            alias: null,
                            query: "SELECT\n  id,\n  date_reported as reported_date,\n  case when lower(gender) = 'male' then 'M' \n       when lower(gender) = 'female' then 'F' \n       else 'U' end as gender,\n  case when age_group = 'Under 1 year' then '<20'\n       when age_group = '1-4 years' then '<20'\n       when age_group = '5-9 years' then '<20'\n       when age_group = '10-19 years' then '<20'\n       when age_group = '20-29 years' then '20s'\n       when age_group = '30-39 years' then '30s'\n       when age_group = '40-49 years' then '40s'\n       when age_group = '50-59 years' then '50s'\n       when age_group = '60-69 years' then '60s'\n       when age_group = '70-79 years' then '70s'\n       when age_group = '80+ years' then '80s'\n       else 'UNKNOWN' end as age_group,\n  zone as location\n  FROM `alberta.case-details`\n",
                        },
                    ],
                    temporalTables: null,
                },
            },
            currentSchema: {
                __typename: "DataSchema",
                format: "PARQUET_JSON",
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "reported_date", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "gender", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "age_group", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "location", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}]}',
            },
            currentUpstreamDependencies: [
                {
                    __typename: "Dataset",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentUpstreamDependencies: [],
                    },
                    id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                    kind: "ROOT",
                    name: "alberta.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
            ],
            currentDownstreamDependencies: [
                {
                    __typename: "Dataset",
                    metadata: {
                        __typename: "DatasetMetadata",
                        currentDownstreamDependencies: [
                            {
                                __typename: "Dataset",
                                metadata: {
                                    __typename: "DatasetMetadata",
                                    currentDownstreamDependencies: [],
                                },
                                id: "did:odf:z4k88e8thqpQ7kupbJCiFbeXr5WZVCor7hmybhfmyUTLnWifwz6",
                                kind: "DERIVATIVE",
                                name: "canada.daily-cases",
                                owner: {
                                    __typename: "User",
                                    id: "1",
                                    name: "kamu",
                                },
                            },
                        ],
                    },
                    id: "did:odf:z4k88e8epAntnrFDUiDYxSGkCRcTc6wNzcwbpubzLCPQLVLUMcF",
                    kind: "DERIVATIVE",
                    name: "canada.case-details",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
            ],
            currentReadme:
                "# Harmonized COVID-19 case data from Alberta\n\nSee [original dataset](#todo).\n\nSee [harmonization schema and semantics](#todo).\n",
            chain: {
                __typename: "MetadataChain",
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash:
                                "zW1hNbxPz28K1oLNGbddudUzKKLT9LDPh8chjksEo6HcDev",
                            prevBlockHash:
                                "zW1abnmxotsSC7H6SyfbL7bpWtQrMSQktUfiJds3KWX1xfm",
                            systemTime: "2022-08-05T21:20:08.053635579+00:00",
                            sequenceNumber: 6,
                            author: {
                                __typename: "User",
                                id: "1",
                                name: "kamu",
                            },
                            event: {
                                __typename: "ExecuteQuery",
                                queryOutputData: {
                                    __typename: "DataSlice",
                                    interval: {
                                        __typename: "OffsetInterval",
                                        start: 0,
                                        end: 596125,
                                    },
                                    logicalHash:
                                        "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
                                    physicalHash:
                                        "zW1i7cajDaJjwxCRaRyGHqJpDrqZXbm1wMZkaWrH8a8Cmbd",
                                },
                            },
                        },
                    ],
                    totalCount: 7,
                    pageInfo: {
                        __typename: "PageBasedInfo",
                        hasNextPage: true,
                        hasPreviousPage: false,
                        currentPage: 0,
                        totalPages: 7,
                    },
                },
            },
        },
        createdAt: "2022-08-05T21:17:30.646318293+00:00",
        lastUpdatedAt: "2022-08-05T21:20:08.053635579+00:00",
    },
    pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
    },
};
