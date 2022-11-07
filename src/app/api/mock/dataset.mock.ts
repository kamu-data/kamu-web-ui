import {
    DataBatchFormat,
    DatasetKind,
    DatasetSearchOverviewFragment,
    GetDatasetDataSqlRunQuery,
} from "./../kamu.graphql.interface";
import { DataSchemaFormat } from "../kamu.graphql.interface";

export const TEST_USER_NAME = "test-user";
export const TEST_DATASET_NAME = "test-dataset";

export const mockDatasetDataSqlRunResponse: GetDatasetDataSqlRunQuery = {
    data: {
        __typename: "DataQueries",
        query: {
            __typename: "DataQueryResult",
            schema: {
                __typename: "DataSchema",
                format: DataSchemaFormat.ParquetJson,
                content:
                    '{"name": "arrow_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT64", "logicalType": "TIMESTAMP(NANOS,false)"}, {"name": "reported_date", "repetition": "OPTIONAL", "type": "INT64", "logicalType": "TIMESTAMP(NANOS,false)"}, {"name": "classification", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "ha", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "sex", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "STRING"}]}',
            },
            data: {
                __typename: "DataBatch",
                format: DataBatchFormat.Json,
                content:
                    '[{"offset":0,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-01-29 00:00:00","classification":"Lab-diagnosed","id":1,"ha":"Out of Canada","sex":"M","age_group":"40-49"},{"offset":1,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-06 00:00:00","classification":"Lab-diagnosed","id":2,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":2,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-10 00:00:00","classification":"Lab-diagnosed","id":4,"ha":"Out of Canada","sex":"F","age_group":"20-29"},{"offset":3,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-10 00:00:00","classification":"Lab-diagnosed","id":3,"ha":"Out of Canada","sex":"M","age_group":"30-39"},{"offset":4,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-18 00:00:00","classification":"Lab-diagnosed","id":5,"ha":"Interior","sex":"F","age_group":"30-39"},{"offset":5,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-24 00:00:00","classification":"Lab-diagnosed","id":6,"ha":"Fraser","sex":"M","age_group":"40-49"},{"offset":6,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-02-24 00:00:00","classification":"Lab-diagnosed","id":7,"ha":"Fraser","sex":"F","age_group":"30-39"},{"offset":7,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":12,"ha":"Vancouver Coastal","sex":"M","age_group":"60-69"},{"offset":8,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":11,"ha":"Vancouver Coastal","sex":"F","age_group":"30-39"},{"offset":9,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":8,"ha":"Fraser","sex":"M","age_group":"50-59"},{"offset":10,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":9,"ha":"Vancouver Coastal","sex":"F","age_group":"60-69"},{"offset":11,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-03 00:00:00","classification":"Lab-diagnosed","id":10,"ha":"Vancouver Coastal","sex":"F","age_group":"80-89"},{"offset":12,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":16,"ha":"Out of Canada","sex":"F","age_group":"50-59"},{"offset":13,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":14,"ha":"Out of Canada","sex":"F","age_group":"50-59"},{"offset":14,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":18,"ha":"Vancouver Coastal","sex":"M","age_group":"20-29"},{"offset":15,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":20,"ha":"Vancouver Coastal","sex":"M","age_group":"60-69"},{"offset":16,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":13,"ha":"Fraser","sex":"F","age_group":"50-59"},{"offset":17,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":19,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":18,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":17,"ha":"Vancouver Coastal","sex":"M","age_group":"30-39"},{"offset":19,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-05 00:00:00","classification":"Lab-diagnosed","id":15,"ha":"Out of Canada","sex":"F","age_group":"50-59"},{"offset":20,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":23,"ha":"Fraser","sex":"M","age_group":"60-69"},{"offset":21,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":26,"ha":"Vancouver Coastal","sex":"F","age_group":"70-79"},{"offset":22,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":22,"ha":"Fraser","sex":"M","age_group":"60-69"},{"offset":23,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":21,"ha":"Fraser","sex":"F","age_group":"50-59"},{"offset":24,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":27,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":25,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":24,"ha":"Fraser","sex":"F","age_group":"60-69"},{"offset":26,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-06 00:00:00","classification":"Lab-diagnosed","id":25,"ha":"Vancouver Coastal","sex":"M","age_group":"80-89"},{"offset":27,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-07 00:00:00","classification":"Lab-diagnosed","id":28,"ha":"Vancouver Coastal","sex":"M","age_group":"30-39"},{"offset":28,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":30,"ha":"Fraser","sex":"M","age_group":"50-59"},{"offset":29,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":29,"ha":"Fraser","sex":"F","age_group":"40-49"},{"offset":30,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":32,"ha":"Northern","sex":"F","age_group":"60-69"},{"offset":31,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-08 00:00:00","classification":"Lab-diagnosed","id":31,"ha":"Fraser","sex":"M","age_group":"10-19"},{"offset":32,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-09 00:00:00","classification":"Lab-diagnosed","id":34,"ha":"Vancouver Coastal","sex":"F","age_group":"30-39"},{"offset":33,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-09 00:00:00","classification":"Lab-diagnosed","id":33,"ha":"Northern","sex":"M","age_group":"70-79"},{"offset":34,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-09 00:00:00","classification":"Lab-diagnosed","id":35,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":35,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":42,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":36,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":41,"ha":"Vancouver Coastal","sex":"M","age_group":"90+"},{"offset":37,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":39,"ha":"Fraser","sex":"M","age_group":"90+"},{"offset":38,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":37,"ha":"Fraser","sex":"M","age_group":"70-79"},{"offset":39,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":44,"ha":"Vancouver Coastal","sex":"M","age_group":"40-49"},{"offset":40,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":38,"ha":"Fraser","sex":"M","age_group":"60-69"},{"offset":41,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":36,"ha":"Fraser","sex":"F","age_group":"60-69"},{"offset":42,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":45,"ha":"Vancouver Island","sex":"M","age_group":"60-69"},{"offset":43,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":43,"ha":"Vancouver Coastal","sex":"F","age_group":"50-59"},{"offset":44,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-10 00:00:00","classification":"Lab-diagnosed","id":40,"ha":"Fraser","sex":"M","age_group":"40-49"},{"offset":45,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":54,"ha":"Vancouver Coastal","sex":"F","age_group":"60-69"},{"offset":46,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":56,"ha":"Vancouver Coastal","sex":"F","age_group":"40-49"},{"offset":47,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":59,"ha":"Vancouver Coastal","sex":"M","age_group":"60-69"},{"offset":48,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":61,"ha":"Vancouver Coastal","sex":"F","age_group":"30-39"},{"offset":49,"system_time":"2022-08-05 21:19:43.875","reported_date":"2020-03-11 00:00:00","classification":"Lab-diagnosed","id":46,"ha":"Fraser","sex":"F","age_group":"50-59"}]',
                numRecords: 50,
            },
            limit: 50,
        },
    },
};

export const mockDatasetListItem: DatasetSearchOverviewFragment = {
    __typename: "Dataset",
    createdAt: "2022-08-05T21:17:30.613911358+00:00",
    lastUpdatedAt: "2022-08-05T21:19:28.817281255+00:00",
    metadata: {
        __typename: "DatasetMetadata",
        currentInfo: {
            __typename: "SetInfo",
            description: "Confirmed positive cases of COVID-19 in Alberta.",
            keywords: [
                "Healthcare",
                "Epidemiology",
                "COVID-19",
                "SARS-CoV-2",
                "Disaggregated",
                "Anonymized",
                "Alberta",
                "Canada",
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
        currentDownstreamDependencies: [
            {
                __typename: "Dataset",
                id: "did:odf:z4k88e8kmp7wTEePmNDSprhY2TqwDxSiFwHiau8fnUk4V4Cpgu7",
                kind: DatasetKind.Derivative,
            },
        ],
    },
    id: "did:odf:z4k88e8rxU6m5wCnK9idM5sGAxAGfvUgNgQbckwJ4ro78tXMLSu",
    kind: DatasetKind.Root,
    name: "alberta.case-details",
    owner: {
        __typename: "User",
        id: "1",
        name: "kamu",
    },
};
