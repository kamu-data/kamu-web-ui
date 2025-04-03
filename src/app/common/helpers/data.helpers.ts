/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "src/app/interface/app.types";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import {
    DataQueryResultSuccessViewFragment,
    FlowSummaryDataFragment,
    MetadataBlockFragment,
    TimeUnit,
} from "../../api/kamu.graphql.interface";
import { EventPropertyLogo } from "../../dataset-block/metadata-block/components/event-details/supported.events";
import { JsonFormValidators } from "../../dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { MaybeUndefined } from "../../interface/app.types";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { isValidCronExpression } from "./cron-expression-validator.helper";
import { ErrorPolicy, WatchQueryFetchPolicy } from "@apollo/client";
import { convertSecondsToHumanReadableFormat, removeAllLineBreaks } from "./app.helpers";
import { SliceUnit } from "../../dataset-view/additional-components/dataset-settings-component/tabs/compacting/dataset-settings-compacting-tab.types";
import { DataRow, DatasetSchema, OperationColumnClassEnum } from "../../interface/dataset.interface";
import { differenceInSeconds } from "date-fns";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";

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

    public static descriptionForMetadataBlock(block: MetadataBlockFragment): string {
        const event = block.event;
        switch (event.__typename) {
            case "AddData":
                if (event.newData) {
                    const iv = event.newData.offsetInterval;
                    return `Added ${iv.end - iv.start + 1} new records`;
                } else {
                    return `Watermark updated`;
                }
            case "ExecuteTransform":
                if (event.newData) {
                    const iv = event.newData.offsetInterval;
                    return `Transformation produced ${iv.end - iv.start + 1} new records`;
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

    public static flowTypeDescription(flow: FlowSummaryDataFragment): string {
        const decriptionFlow = flow.description;
        switch (decriptionFlow.__typename) {
            case "FlowDescriptionDatasetPollingIngest":
                return `Polling ingest`;
            case "FlowDescriptionDatasetPushIngest":
                return `Push ingest`;
            case "FlowDescriptionDatasetExecuteTransform":
                return `Execute transformation`;
            case "FlowDescriptionDatasetHardCompaction":
                if (
                    flow.configSnapshot?.__typename === "FlowConfigurationCompactionRule" &&
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    flow.configSnapshot.compactionRule.__typename === "CompactionMetadataOnly"
                ) {
                    return "Reset";
                }
                return `Hard compaction`;
            case "FlowDescriptionSystemGC":
                return `Garbage collector`;
            case "FlowDescriptionDatasetReset":
                return `Reset to seed`;
            /* istanbul ignore next */
            default:
                return "Unsupported flow description";
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
    Object.entries(validators).forEach(([key, value]) => {
        switch (key) {
            case "required":
                if (value) {
                    validatorsToAdd.push(Validators.required);
                }
                break;
            case "pattern":
                if (value) {
                    validatorsToAdd.push(Validators.pattern(value as RegExp));
                }
                break;
            case "maxLength":
                if (value) {
                    validatorsToAdd.push(Validators.maxLength(value as number));
                }
                break;
            case "min": {
                validatorsToAdd.push(Validators.min(value as number));
                break;
            }
            default:
                break;
        }
    });
    return validatorsToAdd;
};

export const MY_MOMENT_FORMATS = {
    parseInput: "DD/MM/YY HH:mm:ss",
    fullPickerInput: "DD/MM/YYYY HH:mm:ss A z",
    datePickerInput: "DD/MM/YYYY",
    timePickerInput: "HH:mm:ss",
    monthYearLabel: "MMM YYYY",
    dateA11yLabel: "LL",
    monthYearA11yLabel: "MMMM YYYY",
};

export function cronExpressionValidator(): ValidatorFn {
    return (control: AbstractControl): MaybeNull<ValidationErrors> => {
        return !isValidCronExpression(control.value as string) ? { invalidCronExpression: true } : null;
    };
}

export const everyTimeMapperValidators: Record<TimeUnit, ValidatorFn> = {
    [TimeUnit.Minutes]: RxwebValidators.range({
        minimumNumber: 0,
        maximumNumber: 60,
        message: "Value should be between 0 to 60",
    }),
    [TimeUnit.Hours]: RxwebValidators.range({
        minimumNumber: 0,
        maximumNumber: 24,
        message: "Value should be between 0 to 24",
    }),
    [TimeUnit.Days]: RxwebValidators.range({
        minimumNumber: 0,
        maximumNumber: 31,
        message: "Value should be between 0 to 31",
    }),
    [TimeUnit.Weeks]: RxwebValidators.range({
        minimumNumber: 0,
        maximumNumber: 51,
        message: "Value should be between 0 to 51",
    }),
};

export const noCacheFetchPolicy: {
    fetchPolicy?: MaybeUndefined<WatchQueryFetchPolicy>;
    errorPolicy?: MaybeUndefined<ErrorPolicy>;
} = {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
};

export const noWhitespaceValidator = (): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const isSpace = ((control.value as string) || "").match(/\s/g);
        return isSpace ? { whitespace: true } : null;
    };
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

export function parseSchema(schemaContent: string): DatasetSchema {
    return JSON.parse(removeAllLineBreaks(schemaContent)) as DatasetSchema;
}

export function parseDataRows(successResult: DataQueryResultSuccessViewFragment): DataRow[] {
    const content: string = successResult.data.content;
    const parsedData = JSON.parse(content) as object[];
    if (parsedData.length) {
        const columnNames = Object.keys(parsedData[0]);
        const dataRowArray = parseDataFromJsonAoSFormat(parsedData, columnNames);
        return dataRowArray;
    } else {
        return [];
    }
}

export function parseDataFromJsonAoSFormat(data: object[], columnNames: string[]): DataRow[] {
    return data.map((dataItem: object) => {
        const arr = columnNames.map((key: string) => {
            const keyObject = key as keyof typeof dataItem;
            return {
                [key]: {
                    value: key === "op" ? operationColumnMapper(dataItem[keyObject]) : dataItem[keyObject],
                    cssClass:
                        key === "op"
                            ? setOperationColumnClass(dataItem[keyObject])
                            : OperationColumnClassEnum.PRIMARY_COLOR,
                },
            };
        });
        return arr.reduce((resultObj, obj) => Object.assign(resultObj, obj), {});
    });
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

export function setOperationColumnClass(value: number): OperationColumnClassEnum {
    switch (value) {
        case 1:
            return OperationColumnClassEnum.ERROR_COLOR;
        case 2:
        case 3:
            return OperationColumnClassEnum.SECONDARY_COLOR;

        default:
            return OperationColumnClassEnum.PRIMARY_COLOR;
    }
}

export const activeTabResolver = (): ResolveFn<string> => (_: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const pathWithoutQuery = state.url.split("?")[0];
    const routeSegments = pathWithoutQuery.split("/").filter(Boolean);
    return routeSegments[routeSegments.length - 1];
};
