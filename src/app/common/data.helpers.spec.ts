import { DataSchemaFormat, DatasetKind, MetadataBlockFragment } from "../api/kamu.graphql.interface";
import { SliceUnit } from "../dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.types";
import { mockOwnerFields, mockPublicDatasetVisibility } from "../search/mock.data";
import { DataHelpers, sliceSizeMapperReverse } from "./data.helpers";

export const metadataBlockSetVocab: MetadataBlockFragment = {
    __typename: "MetadataBlockExtended",
    blockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
    prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
    sequenceNumber: 14,
    systemTime: "2022-08-05T21:19:28.817281255+00:00",
    author: {
        __typename: "Account",
        ...mockOwnerFields,
    },
    event: {
        __typename: "SetVocab",
        systemTimeColumn: null,
        eventTimeColumn: "case_reported_date",
        offsetColumn: null,
        operationTypeColumn: null,
    },
};

it("should check description for SetVocab block", () => {
    expect(DataHelpers.descriptionForMetadataBlock(metadataBlockSetVocab)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_SET_VOCAB,
    );
});

it("should check description for SetDataSchema block", () => {
    const setDataSchemaBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetDataSchema",
            schema: {
                __typename: "DataSchema",
                format: DataSchemaFormat.ParquetJson,
                content:
                    '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "block_time", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(MILLIS,true)"}, {"name": "token_symbol", "repetition": "REQUIRED", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "event_name", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "eth_amount", "repetition": "OPTIONAL", "type": "DOUBLE"}, {"name": "block_number", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "block_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "transaction_index", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "transaction_hash", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "log_index", "repetition": "OPTIONAL", "type": "INT64"}]}',
            },
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setDataSchemaBlock)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_SET_DATA_SCHEMA,
    );
});

it("should check description for SetPollingSource block", () => {
    const setPollingSourceBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
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
                separator: null,
                encoding: null,
                quote: null,
                escape: null,
                dateFormat: null,
                timestampFormat: null,
            },
            merge: {
                __typename: "MergeStrategyLedger",
                primaryKey: ["id"],
            },
            prepare: null,
            preprocess: null,
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setPollingSourceBlock)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_SET_POLLING_SOURCE,
    );
});

it("should check description for AddPushSource block", () => {
    const addPushSourceBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "AddPushSource",
            sourceName: "name",
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
                separator: null,
                encoding: null,
                quote: null,
                escape: null,
                dateFormat: null,
                timestampFormat: null,
            },
            merge: {
                __typename: "MergeStrategyLedger",
                primaryKey: ["id"],
            },
            preprocess: null,
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(addPushSourceBlock)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_ADD_PUSH_SOURCE,
    );
});

it("should check description for SetAttachments block", () => {
    const setAttachmentsBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
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
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setAttachmentsBlock)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_SET_ATTACHMENTS,
    );
});

it("should check description for SetInfo block", () => {
    const setInfoBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetInfo",
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setInfoBlock)).toEqual(DataHelpers.BLOCK_DESCRIBE_SET_INFO);
});

it("should check description for SetTransform block", () => {
    const setTransformBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetTransform",
            inputs: [
                {
                    __typename: "TransformInput",
                    datasetRef: "did:odf:z4k88e8uENDqbAKHbhZF2xXAQrAF19cnqGqArUB9RVStSZHQNeP",
                    alias: "alias",
                    dataset: {
                        __typename: "Dataset",
                        id: "did:odf:z4k88e8uENDqbAKHbhZF2xXAQrAF19cnqGqArUB9RVStSZHQNeP",
                        kind: DatasetKind.Root,
                        name: "quebec.case-details",
                        owner: {
                            __typename: "Account",
                            id: "did:odf:fed016b61ed2ab1b63a006b61ed2ab1b63a00b016d65607000000e0821aafbf163e6f",
                            accountName: "kamu",
                        },
                        alias: "kamu/quebec.case-details",
                        visibility: mockPublicDatasetVisibility,
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
                        query: "SELECT\n  row_id as id,\n  date_reported as reported_date,\n  case when lower(gender) = 'male' then 'M' \n       when lower(gender) = 'female' then 'F' \n       else 'U' end as gender,\n  case when age_group = '<20' then '<20'\n       when age_group = '20-29' then '20s'\n       when age_group = '30-39' then '30s'\n       when age_group = '40-49' then '40s'\n       when age_group = '50-59' then '50s'\n       when age_group = '60-69' then '60s'\n       when age_group = '70-79' then '70s'\n       when age_group = '80+' then '80s'\n       else 'UNKNOWN' end as age_group,\n  health_region as location\n  FROM `quebec.case-details`\n",
                    },
                ],
                temporalTables: null,
            },
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setTransformBlock)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_SET_TRANSFORM,
    );
});

it("should check description for Seed block", () => {
    const seedBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "Seed",
            datasetId: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            datasetKind: DatasetKind.Root,
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(seedBlock)).toEqual(DataHelpers.BLOCK_DESCRIBE_SEED);
});

it("should check description for SetLicense block", () => {
    const setLicenseBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetLicense",
            shortName: "OGL-Canada-2.0",
            name: "GPL",
            spdxId: "OGL-Canada-2.0",
            websiteUrl: "https://open.canada.ca/en/open-government-licence-canada",
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setLicenseBlock)).toEqual("License updated: GPL");
});

it("should check description for AddData block", () => {
    const addDataBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "AddData",
            newData: {
                __typename: "DataSlice",
                offsetInterval: {
                    __typename: "OffsetInterval",
                    start: 117,
                    end: 517,
                },
                logicalHash: "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                size: 100,
            },
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(addDataBlock)).toEqual("Added 401 new records");
});

it("should check description for AddData block (watermark only)", () => {
    const watermarkTime = 1666303480;
    const addDataBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "AddData",
            newData: null,
            newWatermark: watermarkTime.toString(),
            newSourceState: {
                __typename: "SourceState",
                sourceName: "src",
                kind: "odf/etag",
                value: "123",
            },
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(addDataBlock)).toEqual(`Watermark updated`);
});

it("should check description for ExecuteTransform block", () => {
    const addDataBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
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
        },
    };

    expect(DataHelpers.descriptionForMetadataBlock(addDataBlock)).toEqual("Transformation produced 596126 new records");
});

it("should check description for ExecuteTransform block (no data)", () => {
    const addDataBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "ExecuteTransform",
            newData: null,
            prevCheckpoint: null,
            newWatermark: "2022-08-01T00:00:00+00:00",
            queryInputs: [
                {
                    __typename: "ExecuteTransformInput",
                    datasetId: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
                    prevBlockHash: "zW1qJPmDvBxGS9GeC7PFseSCy7koHjvurUmisf1VWscY3AX",
                    newBlockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
                    prevOffset: 0,
                    newOffset: 0,
                },
            ],
            newCheckpoint: {
                __typename: "Checkpoint",
                physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
                size: 2560,
            },
        },
    };

    expect(DataHelpers.descriptionForMetadataBlock(addDataBlock)).toEqual("Transformation advanced");
});

[
    { engine: "spark", label: "Apache Spark" },
    { engine: "flink", label: "Apache Flink" },
    { engine: "datafusion", label: "Apache DataFusion" },
    { engine: "risingwave", label: "RisingWave" },
].forEach((item: { engine: string; label: string }) => {
    it(`should check label for ${item.engine} engine`, () => {
        expect(DataHelpers.descriptionForEngine(item.engine).label).toEqual(item.label);
    });
});

it(`should propagate the name for unknown engines`, () => {
    const engineDesc = DataHelpers.descriptionForEngine("foobar");
    expect(engineDesc.name).toEqual("foobar");
    expect(engineDesc.label).toBeUndefined();
    expect(engineDesc.url_logo).toBeUndefined();
});

[
    { type: "MergeStrategyLedger", description: "Ledger strategy" },
    { type: "MergeStrategyAppend", description: "Append strategy" },
    { type: "MergeStrategySnapshot", description: "Snapshot strategy" },
    { type: "unknown", description: "Unknown strategy" },
].forEach((item: { type: string; description: string }) => {
    it(`should check description for ${item.type} strategy`, () => {
        expect(DataHelpers.descriptionMergeStrategy(item.type).name).toEqual(item.description);
    });
});

[
    { key: "BY_NAME", description: "By name" },
    { key: "BY_EVENT_TIME", description: "By event time" },
    { key: "unknown", description: "Unknown order" },
].forEach((item: { key: string; description: string }) => {
    it(`should check description for ${item.key} order`, () => {
        expect(DataHelpers.descriptionOrder(item.key)).toEqual(item.description);
    });
});

[
    { case: Math.pow(2, 10), expectation: { size: 1, unit: SliceUnit.KB } },
    { case: Math.pow(2, 20), expectation: { size: 1, unit: SliceUnit.MB } },
    { case: Math.pow(2, 30), expectation: { size: 1, unit: SliceUnit.GB } },
].forEach((item: { case: number; expectation: { size: number; unit: SliceUnit } }) => {
    it(`should check slice size mapper with ${item.case} bytes`, () => {
        expect(sliceSizeMapperReverse(item.case)).toEqual(item.expectation);
    });
});

[
    { case: "ReadStepCsv", expectation: "Csv" },
    { case: "ReadStepEsriShapefile", expectation: "Esri Shapefile" },
    { case: "ReadStepGeoJson", expectation: "Geo Json" },
    { case: "ReadStepJson", expectation: "Json" },
    { case: "ReadStepNdJson", expectation: "Newline-delimited Json" },
    { case: "ReadStepNdGeoJson", expectation: "Newline-delimited Geo Json" },
    { case: "ReadStepParquet", expectation: "Parquet" },
    { case: "FetchStepUrl", expectation: "Url" },
    { case: "FetchStepContainer", expectation: "Container" },
    { case: "FetchStepFilesGlob", expectation: "Files Glob" },
    { case: "FetchStepMqtt", expectation: "Mqtt" },
    { case: "MergeStrategyLedger", expectation: "Ledger" },
    { case: "MergeStrategyAppend", expectation: "Append" },
    { case: "MergeStrategySnapshot", expectation: "Snapshot" },
    { case: "FetchStepEthereumLogs", expectation: "Ethereum Logs" },
    { case: "", expectation: "Unknown type" },
].forEach((item: { case: string; expectation: string }) => {
    it(`should check description for SetPollingSource steps  with ${item.case}`, () => {
        expect(DataHelpers.descriptionSetPollingSourceSteps(item.case)).toEqual(item.expectation);
    });
});
