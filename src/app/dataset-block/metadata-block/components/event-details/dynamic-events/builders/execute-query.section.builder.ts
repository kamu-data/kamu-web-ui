import { ExecuteQuery, InputSlice } from "src/app/api/kamu.graphql.interface";
import { EXECUTE_QUERY_SOURCE_DESCRIPTORS } from "../../components/execute-query-event/execute-query-event.source";
import { EventRow, EventSection } from "../dynamic-events.model";
import { EventSectionBuilder } from "./event-section.builder";

export enum ExecuteQuerySection {
    QUERY_OUTPUT_DATA = "queryOutputData",
    INPUT_SLICES = "inputSlices",
    INPUT_CHECKPOINT = "inputCheckpoint",
    OUTPUT_CHECKPOINT = "outputCheckpoint",
    OUTPUT_WATERMARK = "watermark",
}

export class ExecuteQuerySectionBuilder extends EventSectionBuilder<ExecuteQuery> {
    private sectionTitleMapper: Record<string, string> = {
        queryOutputData: "Output data",
        inputSlices: "Input slices",
        inputCheckpoint: "Input checkpoint",
        outputCheckpoint: "Output checkpoint",
        watermark: "Output watermark",
    };
    public buildEventSections(event: ExecuteQuery): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section) {
                    case ExecuteQuerySection.QUERY_OUTPUT_DATA:
                    case ExecuteQuerySection.OUTPUT_CHECKPOINT: {
                        result.push({
                            title: this.sectionTitleMapper[section],
                            rows: this.buildEventRows(
                                event,
                                EXECUTE_QUERY_SOURCE_DESCRIPTORS,
                                section as keyof ExecuteQuery,
                                false,
                            ),
                        });
                        break;
                    }
                    case ExecuteQuerySection.INPUT_CHECKPOINT:
                    case ExecuteQuerySection.OUTPUT_WATERMARK: {
                        if (event.__typename) {
                            result.push({
                                title: this.sectionTitleMapper[section],
                                rows: [
                                    this.buildSupportedRow(
                                        event.__typename,
                                        EXECUTE_QUERY_SOURCE_DESCRIPTORS,
                                        "string",
                                        section,
                                        data,
                                    ),
                                ],
                            });
                        }
                        break;
                    }

                    case ExecuteQuerySection.INPUT_SLICES: {
                        const numInputSlicesParts = event.inputSlices.length;
                        (data as InputSlice[]).forEach((item, index) => {
                            let rows: EventRow[] = [];
                            Object.entries({
                                id: item.datasetId as string,
                                ...item,
                            }).forEach(([key, value]) => {
                                if (
                                    event.__typename &&
                                    item.__typename &&
                                    key !== "__typename"
                                ) {
                                    rows.push(
                                        this.buildSupportedRow(
                                            event.__typename,
                                            EXECUTE_QUERY_SOURCE_DESCRIPTORS,
                                            item.__typename,
                                            key,
                                            this.valueTransformMapper(
                                                key as keyof InputSlice,
                                                value,
                                                item,
                                            ),
                                        ),
                                    );
                                }
                            });
                            result.push({
                                title:
                                    this.sectionTitleMapper[section] +
                                    (numInputSlicesParts > 1
                                        ? `#${index + 1}`
                                        : ""),
                                rows,
                            });
                            rows = [];
                        });
                        break;
                    }

                    default: {
                        result.push({
                            title: this.sectionTitleMapper[section],
                            rows: [],
                        });
                    }
                }
            }
        });
        return result;
    }

    private valueTransformMapper(
        key: keyof InputSlice,
        value: unknown,
        inputItem: InputSlice,
    ): unknown {
        switch (key) {
            case "blockInterval":
                return {
                    block: value,
                    datasetId: inputItem.datasetId as string,
                };

            default:
                return value;
        }
    }
}
