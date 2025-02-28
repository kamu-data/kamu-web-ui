/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockPublicDatasetVisibility } from "src/app/search/mock.data";
import {
    AddPushSource,
    CompressionFormat,
    DataSchemaFormat,
    DatasetTransformFragment,
    ExecuteTransformEventFragment,
    MqttQos,
    SetAttachments,
    SetDataSchema,
    SetInfo,
    SetLicense,
    SetPollingSource,
    SetVocab,
} from "../../../../api/kamu.graphql.interface";
import { AddDataEventFragment, DatasetKind, Seed } from "src/app/api/kamu.graphql.interface";
export const mockAddData: AddDataEventFragment = {
    __typename: "AddData",
    newWatermark: "2022-08-01T00:00:00+00:00",
    prevCheckpoint: null,
    newData: {
        __typename: "DataSlice",
        offsetInterval: {
            __typename: "OffsetInterval",
            start: 0,
            end: 596125,
        },
        logicalHash: "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
        physicalHash: "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
        size: 5993876,
    },
    newCheckpoint: {
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
        header: true,
        inferSchema: false,
        nullValue: null,
        dateFormat: null,
        timestampFormat: null,
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

export const mockSetPollingSourceEventWithFetchStepMqtt: SetPollingSource = {
    __typename: "SetPollingSource",
    fetch: {
        __typename: "FetchStepMqtt",
        host: "test.mosquitto.org",
        port: 1183,
        username: "mock-user",
        password: "123456",
        topics: [{ __typename: "MqttTopicSubscription", path: "dev.kamu.example.mqtt.temp", qos: MqttQos.AtMostOnce }],
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
        header: true,
        inferSchema: false,
        nullValue: null,
        dateFormat: null,
        timestampFormat: null,
    },
    merge: {
        __typename: "MergeStrategyLedger",
        primaryKey: ["id"],
    },
    prepare: null,
    preprocess: null,
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
            datasetRef: "did:odf:fed0180891d1a8dd7744447baab2a269542a7185052bdfe9e60d2641449ba24f4ea22",
            alias: "covid19.quebec.case-details",
            inputDataset: {
                __typename: "TransformInputDatasetAccessible",
                message: "Success",
                dataset: {
                    __typename: "Dataset",
                    id: "did:odf:fed0180891d1a8dd7744447baab2a269542a7185052bdfe9e60d2641449ba24f4ea22",
                    kind: DatasetKind.Root,
                    name: "covid19.quebec.case-details",
                    owner: {
                        __typename: "Account",
                        id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                        accountName: "kamu",
                    },
                    alias: "kamu/covid19.quebec.case-details",
                    visibility: mockPublicDatasetVisibility,
                },
            },
        },
    ],
    transform: {
        __typename: "TransformSql",
        engine: "datafusion",
        version: null,
        queries: [
            {
                __typename: "SqlQueryStep",
                alias: null,
                query: "SELECT\n  row_id as id,\n  date_reported as reported_date,\n  case when lower(gender) = 'male' then 'M' \n       when lower(gender) = 'female' then 'F' \n       else 'U' end as gender,\n  case when age_group = '<20' then '<20'\n       when age_group = '20-29' then '20s'\n       when age_group = '30-39' then '30s'\n       when age_group = '40-49' then '40s'\n       when age_group = '50-59' then '50s'\n       when age_group = '60-69' then '60s'\n       when age_group = '70-79' then '70s'\n       when age_group = '80+' then '80s'\n       else 'UNKNOWN' end as age_group,\n  health_region as location\n  FROM \"covid19.quebec.case-details\"\n",
            },
        ],
        temporalTables: null,
    },
};

export const mockExecuteTransform: ExecuteTransformEventFragment = {
    __typename: "ExecuteTransform",
    newData: {
        __typename: "DataSlice",
        offsetInterval: {
            __typename: "OffsetInterval",
            start: 0,
            end: 596125,
        },
        logicalHash: "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
        physicalHash: "zW1i7cajDaJjwxCRaRyGHqJpDrqZXbm1wMZkaWrH8a8Cmbd",
        size: 2323,
    },
    prevCheckpoint: null,
    newWatermark: "2022-08-01T00:00:00+00:00",
    queryInputs: [
        {
            __typename: "ExecuteTransformInput",
            datasetId: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            prevBlockHash: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
            newBlockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
            prevOffset: null,
            newOffset: 596125,
        },
    ],
    newCheckpoint: {
        __typename: "Checkpoint",
        physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
        size: 2560,
    },
};

export const mockSetLicense: SetLicense = {
    __typename: "SetLicense",
    shortName: "OGL-Canada-2.0",
    name: "Open Government Licence - Canada",
    spdxId: "OGL-Canada-2.0",
    websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
};

export const mockSetAttachments: SetAttachments = {
    __typename: "SetAttachments",
    attachments: {
        __typename: "AttachmentsEmbedded",
        items: [
            {
                __typename: "AttachmentEmbedded",
                path: "README.md",
                content:
                    "# Confirmed positive cases of COVID-19 in Quebec\n\nThis dataset compiles daily snapshots of publicly reported data on 2019 Novel Coronavirus (COVID-19) testing in Quebec.\n\nData includes:\n- approximation of onset date\n- age group\n- patient gender\n- case acquisition information\n- patient outcome\n- reporting Public Health Unit (PHU)\n- postal code, website, longitude, and latitude of PHU\n\nThis dataset is subject to change. Please review the daily epidemiologic summaries for information on variables, methodology, and technical considerations.\n\n**Related dataset(s)**:\n- [Daily aggregate count of confirmed positive cases of COVID-19 in Quebec](#todo)\n",
            },
        ],
    },
};

export const mockSetInfo: SetInfo = {
    __typename: "SetInfo",
    description: "Confirmed positive cases of COVID-19 in Ontario.",
    keywords: [
        "Healthcare",
        "Epidemiology",
        "COVID-19",
        "SARS-CoV-2",
        "Disaggregated",
        "Anonymized",
        "Ontario",
        "Canada",
    ],
};

export const mockSetVocab: SetVocab = {
    __typename: "SetVocab",
    systemTimeColumn: null,
    eventTimeColumn: "case_reported_date",
    offsetColumn: null,
    operationTypeColumn: null,
};

export const mockSetDataSchema: SetDataSchema = {
    __typename: "SetDataSchema",
    schema: {
        __typename: "DataSchema",
        format: DataSchemaFormat.ParquetJson,
        content:
            '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "token_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "event_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "log_index", "repetition": "OPTIONAL", "type": "INT64"}]}',
    },
};

export const mockAddPushSource: AddPushSource = {
    __typename: "AddPushSource",
    sourceName: "mock1",
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
        header: true,
        inferSchema: false,
        nullValue: null,
        dateFormat: null,
        timestampFormat: null,
    },
    merge: {
        __typename: "MergeStrategyLedger",
        primaryKey: ["id"],
    },
};
