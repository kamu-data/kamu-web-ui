import { AddData, DataSlice } from "src/app/api/kamu.graphql.interface";
import { ADD_DATA_SOURCE_DESCRIPTORS } from "../../components/add-data-event/add-data-event.source";
import { EventRow, EventSection } from "../dynamic-events.model";
import { EventSectionBuilder } from "./event-section.builder";

export enum AddDataSection {
    PREV_CHECKPOINT = "prevCheckpoint",
    NEW_DATA = "newData",
    NEW_CHECKPOINT = "newCheckpoint",
    NEW_WATERMARK = "newWatermark",
}

export class AddDataSectionBuilder extends EventSectionBuilder<AddData> {
    private sectionTitleMapper: Record<string, string> = {
        prevCheckpoint: "Previous checkpoint",
        newData: "New data",
        newCheckpoint: "New checkpoint",
        newWatermark: "New watermark",
    };
    public buildEventSections(event: AddData): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section) {
                    case AddDataSection.NEW_CHECKPOINT: {
                        result.push({
                            title: this.sectionTitleMapper[section],
                            rows: this.buildEventRows(event, ADD_DATA_SOURCE_DESCRIPTORS, section, false),
                        });
                        break;
                    }

                    case AddDataSection.NEW_DATA: {
                        const rows: EventRow[] = [];
                        Object.entries(data as DataSlice).forEach(([key, value]) => {
                            if (event.__typename && key !== "__typename") {
                                rows.push(
                                    this.buildSupportedRow(
                                        event.__typename,
                                        ADD_DATA_SOURCE_DESCRIPTORS,
                                        "DataSlice",
                                        key,
                                        this.valueTransformMapper(key as keyof DataSlice, value),
                                    ),
                                );
                            }
                        });
                        result.push({
                            title: this.sectionTitleMapper[section],
                            rows,
                        });

                        break;
                    }

                    case AddDataSection.PREV_CHECKPOINT:
                    case AddDataSection.NEW_WATERMARK: {
                        if (event.__typename) {
                            result.push({
                                title: this.sectionTitleMapper[section],
                                rows: [
                                    this.buildSupportedRow(
                                        event.__typename,
                                        ADD_DATA_SOURCE_DESCRIPTORS,
                                        "string",
                                        section,
                                        data,
                                    ),
                                ],
                            });
                        }
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

    private valueTransformMapper(key: keyof DataSlice, value: unknown): unknown {
        switch (key) {
            case "offsetInterval":
                return {
                    block: value,
                    datasetId: null,
                };

            default:
                return value;
        }
    }
}
