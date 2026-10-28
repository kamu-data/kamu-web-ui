/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRouteSnapshot } from "@angular/router";

import { ErrorPolicy, WatchQueryFetchPolicy } from "@apollo/client";
import { differenceInSeconds } from "date-fns";

import {
    DynamicTableCellValue,
    DynamicTableColumnClassEnum,
    DynamicTableDataRow,
} from "@common/components/dynamic-table/dynamic-table.interface";
import { convertSecondsToHumanReadableFormat, isRecord } from "@common/helpers/app.helpers";
import {
    DataQueryResultSuccessViewFragment,
    MetadataBlockFragment,
    OffsetIntervalDataFragment,
} from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";

import { EventPropertyLogo } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { SliceUnit } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.types";
import { SubscribedEventType } from "src/app/dataset-view/additional-components/dataset-settings-component/tabs/webhooks/dataset-settings-webhooks-tab.component.types";
import { JsonFormValidators } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";

export class DataHelpers {
    public static readonly BLOCK_DESCRIBE_SEED = "Dataset initialized";
    public static readonly BLOCK_DESCRIBE_SET_TRANSFORM = "Query changed";
    public static readonly BLOCK_DESCRIBE_SET_VOCAB = "Vocabulary changed";
    public static readonly BLOCK_DESCRIBE_SET_POLLING_SOURCE = "Polling source changed";
    public static readonly BLOCK_DESCRIBE_ADD_PUSH_SOURCE = "Push source updated";
    public static readonly BLOCK_DESCRIBE_SET_DATA_SCHEMA = "Data schema updated";
    public static readonly BLOCK_DESCRIBE_DISABLE_POLLING_SOURCE = "Polling source disabled";
    public static readonly BLOCK_DESCRIBE_DISABLE_ADD_PUSH_SOURCE = "Push source disabled";
    public static readonly BLOCK_DESCRIBE_SET_INFO = "Basic information updated";
    public static readonly BLOCK_DESCRIBE_SET_ATTACHMENTS = "Attachments updated";
    private static readonly SHIFT_ATTACHMENTS_VIEW = "\u00A0".repeat(12);

    public static descriptionForEngine(name: string): EventPropertyLogo {
        switch (name.toLowerCase()) {
            case "flink":
                return {
                    name: "flink",
                    label: "Apache Flink",
                    url_logo: "assets/images/apache-flink.png",
                };

            case "spark":
                return {
                    name: "spark",
                    label: "Apache Spark",
                    url_logo: "assets/images/apache-spark.png",
                };

            case "datafusion":
                return {
                    name: "datafusion",
                    label: "Apache DataFusion",
                    url_logo: "assets/images/datafusion-logo.png",
                };
            case "risingwave":
                return {
                    name: "risingwave",
                    label: "RisingWave",
                    url_logo: "assets/images/risingwave-logo.png",
                };
            default:
                return {
                    name: name,
                };
        }
    }

    public static descriptionMergeStrategy(type: MaybeUndefined<string>): EventPropertyLogo {
        switch (type) {
            case "MergeStrategyLedger":
                return {
                    name: "Ledger strategy",
                    url_logo: "assets/images/ledger.jpg",
                };
            case "MergeStrategyAppend":
                return {
                    name: "Append strategy",
                    url_logo: "assets/images/append.jpg",
                };
            case "MergeStrategySnapshot":
                return {
                    name: "Snapshot strategy",
                    url_logo: "assets/images/snapshot.jpg",
                };
            case "MergeStrategyChangelogStream":
                return {
                    name: "Changelog stream strategy",
                    url_logo: "assets/images/changelog_stream.png",
                };
            case "MergeStrategyUpsertStream":
                return {
                    name: "Upsert stream strategy",
                    url_logo: "assets/images/upsert_stream.png",
                };
            default:
                return { name: "Unknown strategy" };
        }
    }

    public static descriptionOrder(name: string): string {
        switch (name) {
            case "BY_NAME": {
                return "By name";
            }
            case "BY_EVENT_TIME": {
                return "By event time";
            }
            default:
                return "Unknown order";
        }
    }

    public static descriptionSetPollingSourceSteps(name: string): string {
        switch (name) {
            case "ReadStepCsv": {
                return "Csv";
            }
            case "ReadStepEsriShapefile": {
                return "Esri Shapefile";
            }
            case "ReadStepGeoJson": {
                return "Geo Json";
            }
            case "ReadStepJson": {
                return "Json";
            }
            case "ReadStepNdJson": {
                return "Newline-delimited Json";
            }
            case "ReadStepNdGeoJson": {
                return "Newline-delimited Geo Json";
            }
            case "ReadStepParquet": {
                return "Parquet";
            }
            case "FetchStepUrl": {
                return "Url";
            }
            case "FetchStepContainer": {
                return "Container";
            }
            case "FetchStepFilesGlob": {
                return "Files Glob";
            }
            case "FetchStepMqtt": {
                return "Mqtt";
            }
            case "MergeStrategyLedger": {
                return "Ledger";
            }
            case "MergeStrategyAppend": {
                return "Append";
            }
            case "MergeStrategySnapshot": {
                return "Snapshot";
            }
            case "FetchStepEthereumLogs": {
                return "Ethereum Logs";
            }
            default:
                return "Unknown type";
        }
    }

    private static offsetIntervalLength(iv: OffsetIntervalDataFragment): bigint {
        // BigInt keeps the count exact for any Uint64 offsets
        return BigInt(iv.end) - BigInt(iv.start) + 1n;
    }

    public static descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        const event = block.event;
        switch (event.__typename) {
            case "AddData":
                if (event.newData) {
                    const iv = event.newData.offsetInterval;
                    return `Added ${DataHelpers.offsetIntervalLength(iv)} new records`;
                } else {
                    return `Watermark updated`;
                }
            case "ExecuteTransform":
                if (event.newData) {
                    const iv = event.newData.offsetInterval;
                    return `Transformation produced ${DataHelpers.offsetIntervalLength(iv)} new records`;
                } else {
                    return `Transformation advanced`;
                }
            case "Seed":
                return DataHelpers.BLOCK_DESCRIBE_SEED;
            case "SetTransform":
                return DataHelpers.BLOCK_DESCRIBE_SET_TRANSFORM;
            case "SetVocab":
                return DataHelpers.BLOCK_DESCRIBE_SET_VOCAB;
            case "SetPollingSource":
                return DataHelpers.BLOCK_DESCRIBE_SET_POLLING_SOURCE;
            case "SetInfo":
                return DataHelpers.BLOCK_DESCRIBE_SET_INFO;
            case "SetLicense":
                return `License updated: ${event.name}`;
            case "SetAttachments":
                return DataHelpers.BLOCK_DESCRIBE_SET_ATTACHMENTS;
            case "AddPushSource":
                return DataHelpers.BLOCK_DESCRIBE_ADD_PUSH_SOURCE;
            case "SetDataSchema":
                return DataHelpers.BLOCK_DESCRIBE_SET_DATA_SCHEMA;
            // case "DisablePollingSource":
            //     return DataHelpers.BLOCK_DESCRIBE_DISABLE_POLLING_SOURCE;
            // case "DisablePushSource":
            //     return DataHelpers.BLOCK_DESCRIBE_DISABLE_ADD_PUSH_SOURCE;
            /* istanbul ignore next */
            default:
                return "Unsupported event type";
        }
    }

    public static durationTask(startTime: string, endTime: string): string {
        const durationSeconds = Math.round(differenceInSeconds(endTime, startTime));
        const result = convertSecondsToHumanReadableFormat(durationSeconds);
        return result ? result : "less than 1 second";
    }

    public static setTimelineItemIcon(block: MetadataBlockFragment): string {
        switch (block.event.__typename) {
            case "AddData": {
                return "input";
            }
            case "ExecuteTransform":
                return "call_merge";
            case "Seed":
                return "add_circle_outline";
            case "SetAttachments":
            case "SetInfo":
            case "SetLicense":
            case "SetVocab":
            case "SetTransform":
            case "SetPollingSource":
            case "SetDataSchema":
            case "AddPushSource":
            case "DisablePushSource":
            case "DisablePollingSource":
                return "more_horiz";
            /* istanbul ignore next */
            default:
                throw new Error("Unknown event type");
        }
    }
}
export const getValidators = (validators: JsonFormValidators): ValidatorFn[] => {
    const validatorsToAdd: ValidatorFn[] = [];
    if (validators.required) {
        validatorsToAdd.push(Validators.required);
    }
    if (validators.pattern) {
        validatorsToAdd.push(Validators.pattern(validators.pattern));
    }
    if (validators.maxLength) {
        validatorsToAdd.push(Validators.maxLength(validators.maxLength));
    }
    if (validators.min !== undefined) {
        validatorsToAdd.push(Validators.min(validators.min));
    }
    return validatorsToAdd;
};

export const MY_MOMENT_FORMATS = {
    parseInput: "YYYY-MM-DD, h:mm:ss A",
    fullPickerInput: "YYYY-MM-DD, h:mm A",
    datePickerInput: "YYYY-MM-DD",
    timePickerInput: "h:mm:ss A",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
};

export const noCacheFetchPolicy: {
    fetchPolicy?: MaybeUndefined<WatchQueryFetchPolicy>;
    errorPolicy?: MaybeUndefined<ErrorPolicy>;
} = {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
};

export function sliceSizeMapperReverse(sizeInBytes: number): { size: number; unit: SliceUnit } {
    if (sizeInBytes % Math.pow(2, 30) === 0) {
        return { size: sizeInBytes / Math.pow(2, 30), unit: SliceUnit.GB };
    } else if (sizeInBytes % Math.pow(2, 20) === 0) {
        return { size: sizeInBytes / Math.pow(2, 20), unit: SliceUnit.MB };
    } else {
        return { size: sizeInBytes / Math.pow(2, 10), unit: SliceUnit.KB };
    }
}

export function parseDataRows(successResult: DataQueryResultSuccessViewFragment): DynamicTableDataRow[] {
    const content: string = successResult.data.content;
    const parsedJson: unknown = JSON.parse(content);
    const parsedData: unknown[] = Array.isArray(parsedJson) ? parsedJson : [];
    if (parsedData.length) {
        const columnNames = isRecord(parsedData[0]) ? Object.keys(parsedData[0]) : [];
        const dataRowArray = parseDataFromJsonAoSFormat(parsedData, columnNames);
        return dataRowArray;
    } else {
        return [];
    }
}

/** Builds table rows from JSON rows; a row that is not an object, as in another data format, has empty cells. */
export function parseDataFromJsonAoSFormat(data: unknown[], columnNames: string[]): DynamicTableDataRow[] {
    return data.map((dataItem: unknown) => {
        const row: Record<string, unknown> = isRecord(dataItem) ? dataItem : {};
        const arr = columnNames.map((key: string) => {
            const value = jsonCellValue(row[key]);
            const isOperation = key === "op" && (typeof value === "string" || typeof value === "number");
            return {
                [key]: {
                    value: isOperation ? operationColumnMapper(value) : value,
                    cssClass:
                        isOperation && typeof value === "number"
                            ? setOperationColumnClass(value)
                            : DynamicTableColumnClassEnum.PRIMARY_COLOR,
                },
            };
        });
        return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
    });
}

function jsonCellValue(value: unknown): DynamicTableCellValue {
    switch (typeof value) {
        case "string":
        case "number":
        case "boolean":
        case "object":
            return value;
        default:
            return null;
    }
}

export function operationColumnMapper(value: string | number): string {
    if (typeof value === "number") {
        switch (value) {
            case 0:
                return "+A";
            case 1:
                return "-R";
            case 2:
                return "-C";
            case 3:
                return "+C";
            /* istanbul ignore next */
            default:
                throw new Error("Unknown operation type");
        }
    } else return value;
}

export function setOperationColumnClass(value: number): DynamicTableColumnClassEnum {
    switch (value) {
        case 1:
            return DynamicTableColumnClassEnum.ERROR_COLOR;
        case 2:
        case 3:
            return DynamicTableColumnClassEnum.SECONDARY_COLOR;

        default:
            return DynamicTableColumnClassEnum.PRIMARY_COLOR;
    }
}

export function getAllRouteParams(route: ActivatedRouteSnapshot): Record<string, string> {
    let params: Record<string, string> = {};
    let currentRoute: MaybeNull<ActivatedRouteSnapshot> = route;

    while (currentRoute) {
        params = { ...params, ...currentRoute.params };
        currentRoute = currentRoute.parent;
    }
    return params;
}

export function eventTypesMapper(name: string): SubscribedEventType {
    switch (name) {
        case "DATASET.REF.UPDATED":
            return { value: "DATASET.REF.UPDATED", name: "Dataset Updated" };
        /* istanbul ignore next */
        default:
            return { value: "Unknown event type", name: "Unknown label" };
    }
}

export function stripSecondsFromDateToISOString(date: Date): string {
    const modifiedDate = new Date(date);
    modifiedDate.setSeconds(0, 0);
    return modifiedDate.toISOString();
}
