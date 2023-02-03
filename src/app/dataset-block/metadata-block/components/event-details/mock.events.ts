import {
    CompressionFormat,
    DatasetTransformFragment,
    ExecuteQueryEventFragment,
    SetPollingSource,
} from "./../../../../api/kamu.graphql.interface";
import {
    AddDataEventFragment,
    DatasetKind,
    Seed,
} from "src/app/api/kamu.graphql.interface";
export const mockAddData: AddDataEventFragment = {
    __typename: "AddData",
    addDataWatermark: "2022-08-01T00:00:00+00:00",
    inputCheckpoint: null,
    outputData: {
        __typename: "DataSlice",
        interval: {
            __typename: "OffsetInterval",
            start: 0,
            end: 596125,
        },
        logicalHash: "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
        physicalHash: "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
        size: 5993876,
    },
    outputCheckpoint: {
        __typename: "Checkpoint",
        physicalHash: "zW1diFMSn97sDG4WMMKZ7pvM7vVenC5ytAesQK7V3qqALPv",
        size: 2560,
    },
};

export const mockSetPollingSourceEvent: SetPollingSource = {
    __typename: "SetPollingSource",
    fetch: {
        __typename: "FetchStepUrl",
        url: "https://www.alberta.ca/data/stats/covid-19-alberta-statistics-data.csv",
        eventTime: null,
    },
    read: {
        __typename: "ReadStepCsv",
        schema: [
            "id BIGINT",
            "date_reported TIMESTAMP",
            "zone STRING",
            "gender STRING",
            "age_group STRING",
            "case_status STRING",
            "case_type STRING",
        ],
        separator: ",",
        encoding: null,
        quote: null,
        escape: null,
        comment: null,
        header: true,
        enforceSchema: true,
        inferSchema: false,
        ignoreLeadingWhiteSpace: null,
        ignoreTrailingWhiteSpace: null,
        nullValue: null,
        emptyValue: null,
        nanValue: null,
        positiveInf: null,
        negativeInf: null,
        dateFormat: null,
        timestampFormat: null,
        multiLine: null,
    },
    merge: {
        __typename: "MergeStrategyLedger",
        primaryKey: ["id"],
    },
    prepare: [
        {
            __typename: "PrepStepDecompress",
            format: CompressionFormat.Gzip,
            subPath: "http://test.com",
        },
    ],
    preprocess: {
        __typename: "TransformSql",
        engine: "spark",
        version: null,
        queries: [
            {
                __typename: "SqlQueryStep",
                query: 'SELECT\n  CAST(UNIX_TIMESTAMP(Reported_Date, "yyyy-MM-dd") as TIMESTAMP) as reported_date,\n  Classification_Reported as classification,\n  ROW_NUMBER() OVER (ORDER BY (Reported_Date, HA)) as id,\n  ha,\n  sex,\n  age_group\nFROM input\n',
                alias: null,
            },
        ],
        temporalTables: null,
    },
};

export const mockSeed: Seed = {
    __typename: "Seed",
    datasetId: "sadasdfdsdefdfdf",
    datasetKind: DatasetKind.Root,
};

export const mockSetTransform: DatasetTransformFragment = {
    __typename: "SetTransform",
    inputs: [
        {
            __typename: "TransformInput",
            dataset: {
                __typename: "Dataset",
                id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                kind: DatasetKind.Root,
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
};

export const mockExecuteQuery: ExecuteQueryEventFragment = {
    __typename: "ExecuteQuery",
    queryOutputData: {
        __typename: "DataSlice",
        interval: {
            __typename: "OffsetInterval",
            start: 0,
            end: 596125,
        },
        logicalHash: "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
        physicalHash: "zW1i7cajDaJjwxCRaRyGHqJpDrqZXbm1wMZkaWrH8a8Cmbd",
    },
    inputCheckpoint: null,
    watermark: "2022-08-01T00:00:00+00:00",
    inputSlices: [
        {
            __typename: "InputSlice",
            datasetId:
                "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            blockInterval: {
                __typename: "BlockInterval",
                start: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                end: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
            },
            dataInterval: {
                __typename: "OffsetInterval",
                start: 0,
                end: 596125,
            },
        },
    ],
    outputCheckpoint: {
        __typename: "Checkpoint",
        physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
        size: 2560,
    },
};
