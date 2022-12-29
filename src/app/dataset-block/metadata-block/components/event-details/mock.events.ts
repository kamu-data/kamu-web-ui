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

export const mockSeed: Seed = {
    __typename: "Seed",
    datasetId: "sadasdfdsdefdfdf",
    datasetKind: DatasetKind.Root,
};
