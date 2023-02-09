import {
    DatasetKind,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { mockOwnerFields } from "../search/mock.data";
import { DataHelpers } from "./data.helpers";

const metadataBlockSetVocab: MetadataBlockFragment = {
    __typename: "MetadataBlockExtended",
    blockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
    prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
    sequenceNumber: 14,
    systemTime: "2022-08-05T21:19:28.817281255+00:00",
    author: {
        __typename: "User",
        ...mockOwnerFields,
    },
    event: {
        __typename: "SetVocab",
        systemTimeColumn: null,
        eventTimeColumn: "case_reported_date",
        offsetColumn: null,
    },
};

it("should check description for SetVocab block", () => {
    expect(
        DataHelpers.descriptionForMetadataBlock(metadataBlockSetVocab),
    ).toEqual(DataHelpers.BLOCK_DESCRIBE_SET_VOCAB);
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
            prepare: null,
            preprocess: null,
        },
    };
    expect(
        DataHelpers.descriptionForMetadataBlock(setPollingSourceBlock),
    ).toEqual(DataHelpers.BLOCK_DESCRIBE_SET_POLLING_SOURCE);
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
    expect(
        DataHelpers.descriptionForMetadataBlock(setAttachmentsBlock),
    ).toEqual(DataHelpers.BLOCK_DESCRIBE_SET_ATTACHMENTS);
});

it("should check description for SetInfo block", () => {
    const setInfoBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetInfo",
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setInfoBlock)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_SET_INFO,
    );
});

it("should check description for SetTransform block", () => {
    const setTransformBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetTransform",
            inputs: [
                {
                    __typename: "TransformInput",
                    name: "alias",
                    dataset: {
                        __typename: "Dataset",
                        id: "did:odf:z4k88e8uENDqbAKHbhZF2xXAQrAF19cnqGqArUB9RVStSZHQNeP",
                        kind: DatasetKind.Root,
                        name: "quebec.case-details",
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
            datasetId:
                "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
            datasetKind: DatasetKind.Root,
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(seedBlock)).toEqual(
        DataHelpers.BLOCK_DESCRIBE_SEED,
    );
});

it("should check description for SetLicense block", () => {
    const setLicenseBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetLicense",
            shortName: "OGL-Canada-2.0",
            name: "GPL",
            spdxId: "OGL-Canada-2.0",
            websiteUrl:
                "https://open.canada.ca/en/open-government-licence-canada",
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setLicenseBlock)).toEqual(
        "License updated: GPL",
    );
});

it("should check description for SetWatermark block", () => {
    const watermarkTime = 1666303480;
    const setWatermarkBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "SetWatermark",
            outputWatermark: +watermarkTime,
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(setWatermarkBlock)).toEqual(
        `Watermark updated to ${watermarkTime}`,
    );
});

it("should check description for AddData block", () => {
    const addDataBlock: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "AddData",
            outputData: {
                __typename: "DataSlice",
                interval: {
                    __typename: "OffsetInterval",
                    start: 117,
                    end: 517,
                },
                logicalHash:
                    "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                size: 100,
            },
        },
    };
    expect(DataHelpers.descriptionForMetadataBlock(addDataBlock)).toEqual(
        "Added 400 new records",
    );
});

it("should check description for ExecuteQuery block", () => {
    const addDataBlockEmpty: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "ExecuteQuery",
            queryOutputData: {
                __typename: "DataSlice",
                interval: {
                    __typename: "OffsetInterval",
                    start: 0,
                    end: 0,
                },
                logicalHash:
                    "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
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
                        end: 0,
                    },
                },
            ],
            outputCheckpoint: {
                __typename: "Checkpoint",
                physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
                size: 2560,
            },
        },
    };
    const addDataBlockNonEmpty: MetadataBlockFragment = {
        ...metadataBlockSetVocab,
        event: {
            __typename: "ExecuteQuery",
            queryOutputData: {
                __typename: "DataSlice",
                interval: {
                    __typename: "OffsetInterval",
                    start: 0,
                    end: 21,
                },
                logicalHash:
                    "z63ZND5B21T2Dbmr2bB2Eu2Y4fjEJzLYrwiumM7ApeU24N29qpna",
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
                        end: 21,
                    },
                },
            ],
            outputCheckpoint: {
                __typename: "Checkpoint",
                physicalHash: "zW1otipGpjScUH8C2RfaF4s8RshReBbQVPDf2fPrp2R8Ft2",
                size: 2560,
            },
        },
    };

    expect(DataHelpers.descriptionForMetadataBlock(addDataBlockEmpty)).toEqual(
        "Transformation produced 0 new records",
    );

    expect(
        DataHelpers.descriptionForMetadataBlock(addDataBlockNonEmpty),
    ).toEqual("Transformation produced 21 new records");
});
