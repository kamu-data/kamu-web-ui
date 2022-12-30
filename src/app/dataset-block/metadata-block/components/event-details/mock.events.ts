import { SetPollingSource } from "./../../../../api/kamu.graphql.interface";
import { AddDataEventFragment } from "src/app/api/kamu.graphql.interface";
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

export const mockSetPollinfSourceEvent: SetPollingSource = {
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
};
