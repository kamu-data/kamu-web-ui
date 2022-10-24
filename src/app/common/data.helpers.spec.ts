import timekeeper from "timekeeper";
import {
    DatasetKind,
    MetadataBlockFragment,
} from "../api/kamu.graphql.interface";
import { mockOwnerFields } from "../search/mock.data";
import { DataHelpers } from "./data.helpers";

describe("Relative time helper", () => {
    const FROZEN_TIME = new Date("2022-10-01 12:00:00");
    const TEN_SEC_AGO = new Date("2022-10-01 11:59:50");
    const ALMOST_MINUTE_AGO = new Date("2022-10-01 11:59:59");
    const MINUTE_AGO = new Date("2022-10-01 11:59:00");
    const TEN_MINUTES_AGO = new Date("2022-10-01 11:50:00");
    const HOUR_AGO = new Date("2022-10-01 11:00:00");
    const FIVE_HOURS_AGO = new Date("2022-10-01 07:00:00");
    const DAY_AGO = new Date("2022-09-30 12:00:00");
    const TWO_DAYS_AGO = new Date("2022-09-29 12:00:00");
    const THREE_DAYS_AGO = new Date("2022-09-28 12:00:00");
    const WEEK_AGO = new Date("2022-09-24 12:00:00");
    const EIGHT_DAYS_AGO = new Date("2022-09-23 12:00:00");
    const MONTH_AGO = new Date("2022-09-01 12:00:00");
    const YEAR_AGO = new Date("2021-10-03 12:00:00");

    beforeAll(() => {
        timekeeper.freeze(FROZEN_TIME);
    });

    function testRelativeTime(
        expectedResult: string,
        date: Date,
        threshold?: moment.argThresholdOpts,
    ): void {
        expect(DataHelpers.relativeTime(date.toISOString(), threshold)).toBe(
            expectedResult,
        );
    }

    [
        {
            date: FROZEN_TIME,
            expectedResult: "a few seconds ago",
        },
        {
            date: TEN_SEC_AGO,
            expectedResult: "a few seconds ago",
        },
        {
            date: ALMOST_MINUTE_AGO,
            expectedResult: "a few seconds ago",
        },
        {
            date: MINUTE_AGO,
            expectedResult: "a minute ago",
        },
        {
            date: TEN_MINUTES_AGO,
            expectedResult: "10 minutes ago",
        },
        {
            date: HOUR_AGO,
            expectedResult: "an hour ago",
        },
        {
            date: FIVE_HOURS_AGO,
            expectedResult: "5 hours ago",
        },
        {
            date: DAY_AGO,
            expectedResult: "a day ago",
        },
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago",
        },
        {
            date: WEEK_AGO,
            expectedResult: "7 days ago",
        },
        {
            date: MONTH_AGO,
            expectedResult: "a month ago",
        },
        {
            date: YEAR_AGO,
            expectedResult: "a year ago",
        },
    ].forEach(({ date, expectedResult: expectedResult }) => {
        it("#relativeTime no threshold", () => {
            testRelativeTime(expectedResult, date);
        });
    });

    [
        {
            date: DAY_AGO,
            expectedResult: "a day ago",
        },
        {
            date: TWO_DAYS_AGO,
            expectedResult: "2 days ago",
        },
        {
            date: THREE_DAYS_AGO,
            expectedResult: "28 Sep 2022",
        },
        {
            date: WEEK_AGO,
            expectedResult: "24 Sep 2022",
        },
    ].forEach(({ date, expectedResult }) => {
        it("#relativeTime days threshold", () => {
            testRelativeTime(expectedResult, date, { d: 3 });
        });
    });

    [
        {
            date: THREE_DAYS_AGO,
            expectedResult: "3 days ago",
        },
        {
            date: WEEK_AGO,
            expectedResult: "24 Sep 2022",
        },
        {
            date: EIGHT_DAYS_AGO,
            expectedResult: "23 Sep 2022",
        },
    ].forEach(({ date, expectedResult }) => {
        it("#relativeTime weeks threshold", () => {
            testRelativeTime(expectedResult, date, { w: 1 });
        });
    });

    afterAll(() => {
        timekeeper.reset();
    });
});

describe("Size helper", () => {
    [
        {
            size: 0,
            decimalPlaces: 0,
            expectedResult: "0 B",
        },
        {
            size: 125,
            decimalPlaces: 0,
            expectedResult: "125 B",
        },
        {
            size: 1023,
            decimalPlaces: 0,
            expectedResult: "1023 B",
        },
        {
            size: 1024,
            decimalPlaces: 0,
            expectedResult: "1 KB",
        },
        {
            size: 1536,
            decimalPlaces: 1,
            expectedResult: "1.5 KB",
        },
        {
            size: 1024 * 1023,
            decimalPlaces: 0,
            expectedResult: "1023 KB",
        },
        {
            size: 1024 * 1024 - 1,
            decimalPlaces: 0,
            expectedResult: "1 MB",
        },
        {
            size: 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "1 MB",
        },
        {
            size: 1.5 * 1024 * 1024,
            decimalPlaces: 1,
            expectedResult: "1.5 MB",
        },
        {
            size: 1.5 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "2 MB",
        },
        {
            size: 1.49 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "1 MB",
        },
        {
            size: 2 * 1024 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "2 GB",
        },
        {
            size: 13 * 1024 * 1024 * 1024 * 1024,
            decimalPlaces: 0,
            expectedResult: "13 TB",
        },
    ].forEach(({ size, decimalPlaces, expectedResult }) => {
        it("#dataSize", () => {
            expect(DataHelpers.dataSize(size, decimalPlaces)).toBe(
                expectedResult,
            );
        });
    });

    const metadataBlockSetVocab: MetadataBlockFragment = {
        __typename: "MetadataBlockExtended",
        blockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
        prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
        systemTime: "2022-08-05T21:19:28.817281255+00:00",
        author: {
            __typename: "User",
            ...mockOwnerFields,
        },
        event: {
            __typename: "SetVocab",
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
            },
        };
        expect(
            DataHelpers.descriptionForMetadataBlock(setTransformBlock),
        ).toEqual(DataHelpers.BLOCK_DESCRIBE_SET_TRANSFORM);
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
                name: "GPL",
            },
        };
        expect(
            DataHelpers.descriptionForMetadataBlock(setLicenseBlock),
        ).toEqual("License updated: GPL");
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
        expect(
            DataHelpers.descriptionForMetadataBlock(setWatermarkBlock),
        ).toEqual(`Watermark updated to ${watermarkTime}`);
    });

    it("should check description for AddData block", () => {
        const addDataBlock: MetadataBlockFragment = {
            ...metadataBlockSetVocab,
            event: {
                __typename: "AddData",
                addedOutputData: {
                    __typename: "DataSlice",
                    interval: {
                        __typename: "OffsetInterval",
                        start: 117,
                        end: 517,
                    },
                    logicalHash:
                        "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                    physicalHash:
                        "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
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
            },
        };
        const addDataBlockNonEmpty: MetadataBlockFragment = {
            ...metadataBlockSetVocab,
            event: {
                __typename: "ExecuteQuery",
                queryOutputData: {
                    __typename: "DataSlice",
                    logicalHash:
                        "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                    physicalHash:
                        "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                    interval: {
                        __typename: "OffsetInterval",
                        start: 15,
                        end: 36,
                    },
                },
            },
        };

        expect(
            DataHelpers.descriptionForMetadataBlock(addDataBlockEmpty),
        ).toEqual("Transformation produced 0 new records");

        expect(
            DataHelpers.descriptionForMetadataBlock(addDataBlockNonEmpty),
        ).toEqual("Transformation produced 21 new records");
    });
});
