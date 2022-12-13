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
            name: "GPL",
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
            addedOutputData: {
                __typename: "DataSlice",
                interval: {
                    __typename: "OffsetInterval",
                    start: 117,
                    end: 517,
                },
                logicalHash:
                    "z63ZND5BE6FyKyd9Wa2avVDuJXJWs79CrhCpu51J8v6vEPDZs7dW",
                physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
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
                physicalHash: "zW1ZWFc65JcCqbCWCqqaWVnwcoY13t1MdHZ5fNifD94pv8w",
                interval: {
                    __typename: "OffsetInterval",
                    start: 15,
                    end: 36,
                },
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
