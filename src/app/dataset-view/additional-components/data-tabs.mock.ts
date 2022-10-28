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
            "mockName": "someValueOfMockType"
        }
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
            prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
            systemTime: "2022-08-05T21:19:28.817281255+00:00",
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
                        end: 596125,
                    },
                    logicalHash:
                        "z63ZND5BG3GUBRWVV3AtQj1WHLucVaAb9kSpXLeVxTdWob7PSc5J",
                    physicalHash:
                        "zW1hrpnAnB6AoHu4j9e1m8McQRWzDN1Q8h4Vm4GCa9XKnWf",
                },
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
                name: "reported_date",
                repetition: "OPTIONAL",
                type: "INT96",
            },
            {
                name: "classification",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "id",
                repetition: "OPTIONAL",
                type: "INT32",
            },
            {
                name: "ha",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "sex",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
            {
                name: "age_group",
                repetition: "OPTIONAL",
                type: "BYTE_ARRAY",
                logicalType: "UTF8",
            },
        ],
    },
    pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        totalPages: 1,
        currentPage: 1,
    },
    metadata: {
        __typename: "Dataset",
        id: "did:odf:z4k88e8i1YPqnKHsAqwPkaUhT1t4vtHQzS2fVCqtggE7SJWDVza",
        kind: "ROOT",
        name: "british-columbia.case-details",
        owner: {
            __typename: "User",
            id: "1",
            name: "kamu",
        },
        data: {
            __typename: "DatasetData",
            tail: {
                __typename: "DataQueryResult",
                schema: {
                    __typename: "DataSchema",
                    format: "PARQUET",
                    content:
                        "message arrow_schema {\n  OPTIONAL INT64 offset;\n  REQUIRED INT64 system_time (TIMESTAMP(NANOS,false));\n  OPTIONAL INT64 reported_date (TIMESTAMP(NANOS,false));\n  OPTIONAL BYTE_ARRAY classification (STRING);\n  OPTIONAL INT32 id;\n  OPTIONAL BYTE_ARRAY ha (STRING);\n  OPTIONAL BYTE_ARRAY sex (STRING);\n  OPTIONAL BYTE_ARRAY age_group (STRING);\n}\n",
                },
                data: {
                    __typename: "DataBatch",
                    format: "JSON",
                    content:
                        '[{"offset":379273,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379227,"ha":"Interior","sex":"M","age_group":"40-49"},{"offset":379272,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379222,"ha":"Interior","sex":"F","age_group":"90+"},{"offset":379271,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379210,"ha":"Fraser","sex":"F","age_group":"80-89"},{"offset":379270,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379214,"ha":"Interior","sex":"F","age_group":"80-89"},{"offset":379269,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379197,"ha":"Fraser","sex":"M","age_group":"80-89"},{"offset":379268,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379237,"ha":"Northern","sex":"M","age_group":"40-49"},{"offset":379267,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379270,"ha":"Vancouver Island","sex":"M","age_group":"80-89"},{"offset":379266,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379220,"ha":"Interior","sex":"M","age_group":"70-79"},{"offset":379265,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379224,"ha":"Interior","sex":"F","age_group":"90+"},{"offset":379264,"system_time":"2022-08-05 21:19:43.875","reported_date":"2022-07-30 00:00:00","classification":"Lab-diagnosed","id":379200,"ha":"Fraser","sex":"M","age_group":"<10"}]',
                },
            },
            numRecordsTotal: 379274,
            estimatedSize: 3476854,
        },
        metadata: {
            __typename: "DatasetMetadata",
            currentInfo: {
                __typename: "SetInfo",
                description:
                    "British Columbia COVID-19 case data updated regularly from the B.C. Centre for Disease Control, Provincial Health Services Authority and the B.C. Ministry of Health.",
                keywords: [
                    "Healthcare",
                    "Epidemiology",
                    "COVID-19",
                    "SARS-CoV-2",
                    "Disaggregated",
                    "Anonymized",
                    "British Columbia",
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
            currentWatermark: "2022-07-30T00:00:00+00:00",
            currentTransform: null,
            currentSchema: {
                __typename: "DataSchema",
                format: "PARQUET_JSON",
                content:
                    '{"name": "spark_schema", "type": "struct", "fields": [{"name": "offset", "repetition": "OPTIONAL", "type": "INT64"}, {"name": "system_time", "repetition": "REQUIRED", "type": "INT96"}, {"name": "reported_date", "repetition": "OPTIONAL", "type": "INT96"}, {"name": "classification", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "id", "repetition": "OPTIONAL", "type": "INT32"}, {"name": "ha", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "sex", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}, {"name": "age_group", "repetition": "OPTIONAL", "type": "BYTE_ARRAY", "logicalType": "UTF8"}]}',
            },
            currentUpstreamDependencies: [],
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
                                    currentDownstreamDependencies: [
                                        {
                                            __typename: "Dataset",
                                            metadata: {
                                                __typename: "DatasetMetadata",
                                                currentDownstreamDependencies:
                                                    [],
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
                    },
                    id: "did:odf:z4k88e8rAFwtkT53U5hCMU2k5E1EqNLif5uYfC3AwN6FD62onvP",
                    kind: "DERIVATIVE",
                    name: "british-columbia.case-details.hm",
                    owner: {
                        __typename: "User",
                        id: "1",
                        name: "kamu",
                    },
                },
            ],
            currentReadme:
                "# Confirmed positive cases of COVID-19 in British Columbia\n\n**Purpose**: These data can be used for visual or reference purposes.\n\nBritish Columbia COVID-19 B.C. & Canadian Testing Rates are obtained from the Public Health Agency of Canada's Daily Epidemiologic Update site: https://www.canada.ca/en/public-health/services/diseases/2019-novel-coronavirus-infection.html.\n\nThese data were made specifically for the British Columbia COVID-19 Dashboard.\n\n## Terms of use, disclaimer and limitation of liability\n\nAlthough every effort has been made to provide accurate information, the Province of British Columbia, including the British Columbia Centre for Disease Control, the Provincial Health Services Authority and the British Columbia Ministry of Health makes no representation or warranties regarding the accuracy of the information in the dashboard and the associated data, nor will it accept responsibility for errors or omissions. Data may not reflect the current situation, and therefore should only be used for reference purposes. Access to and/or content of these data and associated data may be suspended, discontinued, or altered, in part or in whole, at any time, for any reason, with or without prior notice, at the discretion of the Province of British Columbia.\n\nAnyone using this information does so at his or her own risk, and by using such information agrees to indemnify the Province of British Columbia, including the British Columbia Centre for Disease Control, the Provincial Health Services Authority and the British Columbia Ministry of Health and its content providers from any and all liability, loss, injury, damages, costs and expenses (including legal fees and expenses) arising from such person's use of the information on this website.\n\n## Data Notes - General\n\nThe following data notes define the indicators presented on the public dashboard and describe the data sources involved. Data changes daily as new cases are identified, characteristics of reported cases change or are updated, and data corrections are made. For the latest caveats about the data, please refer to the most recent BCCDC Surveillance Report located at: www.bccdc.ca/health-info/diseases-conditions/covid-19/data\n\n## Data Sources\n\n- Case details and laboratory information are updated daily Monday through Friday at 4:30 pm.\n- Data on cases (including hospitalizations and deaths) is collected by Health Authorities during public health follow-up and provided to BCCDC.\n- Total COVID-19 cases include laboratory diagnosed cases (confirmed and probable) as well as epi-linked cases. Definitions can be found at: www.bccdc.ca/health-professionals/clinical-resources/case-definitions/covid-19-(novel-coronavirus). Prior to June 4, 2020, the total number of cases included only laboratory diagnosed cases. Starting June 4, probable epi-linked cases became reportable as a separate category. Epi-linked cases identified during case investigations since May 19, 2020 - the date BC entered Phase 2 of its Restart Plan - are now included in the case total, but are not considered New Cases unless they were reported in the last 24 hours.\n- Laboratory data is supplied by the B.C. Centre for Disease Control Public Health Laboratory and the Provincial Lab Information Solution (PLIS); tests performed for other provinces have been excluded.\n- Critical care hospitalizations are provided by the health authorities to PHSA on a daily basis. \n\nBCCDC/PHSA/B.C. Ministry of Health data sources are available at the links below:\n\n- [Cases Totals (spatial)](#)\n- [Case Details](#)\n- [Laboratory Testing Information](#)\n- [Regional Summary Data](#)\n\n## Data Over Time\n\n- The number of laboratory tests performed and positivity rate over time are reported by the date of test result. On March 16, testing recommendations changed to focus on hospitalized patients, healthcare workers, long term care facility staff and residents, and those part of a cluster or outbreak who are experiencing respiratory symptoms. The current day is excluded from all laboratory indicators.\n- As of January 7, 2021, the numbers of cases over time are reported by the result date of the client's first positive lab result where available; otherwise by the date they are reported to public health.\n\n## Epidemiologic Indicators\n\n- Cases have 'Recovered' when the criteria outlined in BC guidelines for public health management of COVID-19 (www.bccdc.ca/resource-gallery/Documents/Guidelines%20and%20Forms/Guidelines%20and%20Manuals/Epid/CD%20Manual/Chapter%201%20-%20CDC/2019-nCoV-Interim_Guidelines.pdf) are met. These are the same criteria that are met for cases to “Discontinue Isolation” and the terms are sometimes used interchangeably.\n- Today's New Cases are those reported daily in the Provincial Health Officer's press briefing and reflect the difference in counts between one day and the next (net new). This may not be equal to the number of cases identified by calendar day, as: (1) new cases for the current day will be based on lab results up to midnight of the day before; and (2) there may be some delays between cases being reported to public health and then reported provincially; and (3) cases may be attributed to different health authorities or may be excluded from case counts as new information is obtained. \n- Critical care values include the number of COVID-19 patients in all critical care beds (e.g., intensive care units; high acuity units; and other surge critical care spaces as they become available and/or required). \n- Active cases exclude those cases who have died, recovered/discontinued isolation or been lost to follow up. \n- The 7-day moving average is an average daily value over the 7 days up to and including the selected date. The 7-day window moves - or changes - with each new day of data. It is used to smooth new daily case and death counts or rates to mitigate the impact of short-term fluctuations and to more clearly identify the most recent trend over time.\n- The following epidemiological indicators are included in the provincial case data file:\n    - Date: date of the client's first positive lab result where available; otherwise by the date they were reported to public health\n    - HA: health authority assigned to the case\n    - Sex: the sex of the client\n    - Age_Group: the age group of the client\n    - Classification_Reported: whether the case has been lab-diagnosed or is epidemiologically linked to another case\n- The following epidemiological indicators are included in the regional summary data file:\n    - Cases_Reported: the number of cases for the health authority (HA) and health service delivery area (HSDA)\n    - Cases_Reported_Smoothed: Seven day moving average for reported cases\n\n## Laboratory Indicators\n\n- Total tests represent the cumulative number of COVID-19 tests since testing began mid-January. Only tests for residents of B.C. are included.\n- New tests represent the number of COVID-19 tests performed in the 24 hour period prior to date of the dashboard update.\n- COVID-19 positivity rate is calculated for each day as the ratio of 7-day rolling average of number of positive specimens to 7-day rolling average of the total number specimens tested (positive, negative, indeterminate and invalid). A 7-day rolling average applied to all testing data corrects for uneven data release patterns while accurately representing the provincial positivity trends. It avoids misleading daily peaks and valleys due to varying capacities and reporting cadences.\n- Turn-around time is calculated as the daily average time (in hours) between specimen collection and report of a test result. Turn-around time includes the time to ship specimens to the lab; patients who live farther away are expected to have slightly longer average turn around times.\n- The rate of COVID-19 testing per million population is defined as the cumulative number of people tested for COVID-19/BC population x 1,000,000. B.C. and Canadian rates are obtained from the map (Figure 1) available in the Public Health Agency of Canada's Daily Epidemiologic Update: https://health-infobase.canada.ca/covid-19/epidemiological-summary-covid-19-cases.html by selecting Rate and Individuals Tested.  Please note: the same person may be tested multiple times, thus it is not possible to derive this rate directly from the # of cumulative tests reported on the BC COVID dashboard.\n- Testing context:  COVID-19 diagnostic testing and laboratory test guidelines have changed in British Columbia over time.  BC's testing strategy has been characterized by four phases: 1) Exposure-based testing, 2) Targeted testing, 3) Expanded testing, and 4) Symptom-based testing.  While COVID-19 testing was originally centralized at the BCCDC Public Health Laboratory (BCPHL), testing capacity expanded to other BC laboratories over time.  Additional details on the timing and definition of test phases and decentralization of testing can be found at: www.bccdc.ca/health-info/diseases-conditions/covid-19/testing/phases-of-covid-19-testing-in-bc\n- The following laboratory indicators are included in the provincial laboratory data file:\n    - New_Tests: the number of new COVID-19 tests\n    - Total_Tests: the total number of COVID-19 tests\n    - Positivity: the positivity rate for COVID-19 tests\n    - Turn_Around: the turnaround time for COVID-19 tests\n\n## Hospitalization Indicators\n\n- Hospitalizations are defined according to the COVID-19 Case Report Form\n- Hospitalizations are reported by the date of admission. Date of admission is replaced with surveillance date (date of the client's first positive lab result where available; otherwise by the date they were reported to public health) in the rare instance where admission date is missing for a known hospitalization.  \n- Information will change as data becomes available; data from the most recent week, in particular, are incomplete. \n\n## Death Indicators\n\n- Deaths are defined according to the COVID-19 Case Report Form.\n- Deaths are reported by the date of death. Date of death is replaced with surveillance date (date of the client's first positive lab result where available; otherwise by the date they were reported to public health) in the rare instance where date of death is missing for a known mortality event.\n- Information will change as data becomes available; data from the most recent week, in particular, are incomplete. \n\n## Health Authority Assignment\n\n- As of July 9, cases are reported by health authority of residence. When health authority of residence is not available, cases are assigned to the health authority reporting the case or the health authority of the provider ordering the lab test. Cases whose primary residence is outside of Canada are reported as “Out of Canada”. Previously, cases were assigned to the health authority that reported the case. Please note that the health authority of residence and the health authority reporting the case do not necessarily indicate the location of exposure or transmission. As more data is collected about the case, the health authority assignment may change to reflect the latest information. \n- For lab data, health authority is assigned by place of residence; when not available, by location of the provider ordering the lab test. Delays in assignment may occur such that the total number of BC tests performed may be greater than the sum of tests done in specific Health Authorities. \n\n© Province of British Columbia\n",
            chain: {
                __typename: "MetadataChain",
                blocks: {
                    __typename: "MetadataBlockConnection",
                    nodes: [
                        {
                            __typename: "MetadataBlockExtended",
                            blockHash:
                                "zW1fcRSmqFXG6Jpe312qWjE7LuA7ANgJLu5MeEEp4L6Hiej",
                            prevBlockHash:
                                "zW1fzZHGUrvDzMPuYeYifBB56BBKzdxmsbhGdcv1fBXPqBA",
                            systemTime: "2022-08-05T21:19:43.875457619+00:00",
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
                                        end: 379273,
                                    },
                                    logicalHash:
                                        "z63ZND5BFgACqjmdLXGhuF2Wmmrp3wGpHJbXAFotSPPdb5gM8ezd",
                                    physicalHash:
                                        "zW1hQyTP2Hht96n4vKpw7NHn5jByCBh3m1urWbfJYB7DGSa",
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
        createdAt: "2022-08-05T21:17:30.621941313+00:00",
        lastUpdatedAt: "2022-08-05T21:19:43.875457619+00:00",
    },
};
