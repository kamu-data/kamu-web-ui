import { ValidatorFn, Validators } from "@angular/forms";
import { DatasetKind, MetadataBlockFragment } from "../api/kamu.graphql.interface";
import { EventPropertyLogo } from "../dataset-block/metadata-block/components/event-details/supported.events";
import { JsonFormValidators } from "../dataset-view/additional-components/metadata-component/components/add-polling-source/add-polling-source-form.types";
import { SetPollingSourceSection } from "../shared/shared.types";
import { MaybeUndefined } from "./app.types";

export class DataHelpers {
    public static readonly BLOCK_DESCRIBE_SEED = "Dataset initialized";
    public static readonly BLOCK_DESCRIBE_SET_TRANSFORM = "Query changed";
    public static readonly BLOCK_DESCRIBE_SET_VOCAB = "Vocabulary changed";
    public static readonly BLOCK_DESCRIBE_SET_POLLING_SOURCE = "Polling source changed";
    public static readonly BLOCK_DESCRIBE_SET_INFO = "Basic information updated";
    public static readonly BLOCK_DESCRIBE_SET_ATTACHMENTS = "Attachments updated";
    public static readonly BLOCK_DESCRIBE_SET_WATERMARK = "Watermark updated";
    private static readonly SHIFT_ATTACHMENTS_VIEW = "\u00A0".repeat(12);

    public static capitalizeFirstLetter(kind: DatasetKind | SetPollingSourceSection): string {
        return kind.charAt(0).toUpperCase() + kind.slice(1).toLowerCase();
    }

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
                console.log("Engine is not defined");
                return {
                    name: "Engine is not defined",
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
            case "ReadStepJsonLines": {
                return "Json Lines";
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
                return `Added ${
                    event.outputData ? event.outputData.interval.end - event.outputData.interval.start + 1 : 0
                } new records`;
            case "ExecuteQuery":
                return `Transformation produced ${
                    event.queryOutputData
                        ? event.queryOutputData.interval.end - event.queryOutputData.interval.start + 1
                        : 0
                } new records`;
            case "Seed":
                return DataHelpers.BLOCK_DESCRIBE_SEED;
            case "SetTransform":
                return DataHelpers.BLOCK_DESCRIBE_SET_TRANSFORM;
            case "SetVocab":
                return DataHelpers.BLOCK_DESCRIBE_SET_VOCAB;
            case "SetWatermark":
                return DataHelpers.BLOCK_DESCRIBE_SET_WATERMARK;
            case "SetPollingSource":
                return DataHelpers.BLOCK_DESCRIBE_SET_POLLING_SOURCE;
            case "SetInfo":
                return DataHelpers.BLOCK_DESCRIBE_SET_INFO;
            case "SetLicense":
                return `License updated: ${event.name}`;
            case "SetAttachments":
                return DataHelpers.BLOCK_DESCRIBE_SET_ATTACHMENTS;
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
