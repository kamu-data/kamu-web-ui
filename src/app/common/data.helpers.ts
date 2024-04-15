import { MaybeNull } from "src/app/common/app.types";
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { FlowSummaryDataFragment, MetadataBlockFragment, TimeUnit } from "../api/kamu.graphql.interface";
import { EventPropertyLogo } from "../dataset-block/metadata-block/components/event-details/supported.events";
import { JsonFormValidators } from "../dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { MaybeUndefined } from "./app.types";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { isValidCronExpression } from "./cron-expression-validator.helper";
import { ErrorPolicy, WatchQueryFetchPolicy } from "@apollo/client";
import moment from "moment";
import { convertSecondsToHumanReadableFormat } from "./app.helpers";

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
        switch (name) {
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
                    label: "DataFusion",
                    url_logo: "assets/images/datafusion-logo.png",
                };
            default:
                return {
                    name: "Engine is not defined",
                    label: "Unknown engine",
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
                return "Newline-delimited Geo Json ";
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
            case "MergeStrategyLedger": {
                return "Ledger";
            }
            case "MergeStrategyAppend": {
                return "Append";
            }
            case "MergeStrategySnapshot": {
                return "Snapshot";
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
            case "FlowDescriptionDatasetHardCompacting":
                return `Hard compaction`;
            case "FlowDescriptionSystemGC":
                return `Garbage collector`;
            default:
                return "Unsupported flow description";
        }
    }

    public static escapeText(text: string): string {
        const htmlEscapes: Record<string, string> = {
            "#": "#",
            "<": "/<",
            ">": "/>",
        };
        const reUnescapedHtml = /[#<>]/g;
        const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
        return reHasUnescapedHtml.test(text)
            ? `|\n${this.SHIFT_ATTACHMENTS_VIEW}${text
                  .replace(reUnescapedHtml, (chr) => htmlEscapes[chr])
                  .replace(/(\r\n|\n|\r)/gm, "\n" + this.SHIFT_ATTACHMENTS_VIEW)}`
            : text;
    }

    public static durationTask(startTime: string, endTime: string): string {
        const durationSeconds = Math.round(moment.duration(moment(endTime).diff(moment(startTime))).asSeconds());
        const result = convertSecondsToHumanReadableFormat(durationSeconds);
        return result ? result : "less than 1 second";
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
        minimumNumber: 1,
        maximumNumber: 60,
        message: "Value should be between 1 to 60",
    }),
    [TimeUnit.Hours]: RxwebValidators.range({
        minimumNumber: 1,
        maximumNumber: 24,
        message: "Value should be between 1 to 24",
    }),
    [TimeUnit.Days]: RxwebValidators.range({
        minimumNumber: 1,
        maximumNumber: 31,
        message: "Value should be between 1 to 31",
    }),
    [TimeUnit.Weeks]: RxwebValidators.range({
        minimumNumber: 1,
        maximumNumber: 51,
        message: "Value should be between 1 to 51",
    }),
};

export const noCacheFetchPolicy: {
    fetchPolicy?: MaybeUndefined<WatchQueryFetchPolicy>;
    errorPolicy?: MaybeUndefined<ErrorPolicy>;
} = {
    fetchPolicy: "no-cache",
    errorPolicy: "all",
};
