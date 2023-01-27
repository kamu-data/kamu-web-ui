import { AddData } from "src/app/api/kamu.graphql.interface";
import { ADD_DATA_SOURCE_DESCRIPTORS } from "../../components/add-data-event/add-data-event.source";
import { EXECUTE_QUERY_SOURCE_DESCRIPTORS } from "../../components/execute-query-event/execute-query-event.source";
import { EventSection } from "../dynamic-events.model";
import { EventSectionBuilder } from "./event-section.builder";

export enum AddDataSection {
    ADD_DATA_WATERMARK = "addDataWatermark",
    INPUT_CHECKPOINT = "inputCheckpoint",
    OUTPUT_DATA = "outputData",
    OUTPUT_CHECKPOINT = "outputCheckpoint",
}

export class AddDataSectionBuilder extends EventSectionBuilder<AddData> {
    private sectionTitleMapper: Record<string, string> = {
        addDataWatermark: "Output watermark",
        inputCheckpoint: "Input checkpoint",
        outputCheckpoint: "Output checkpoint",
        outputData: "Output data",
    };
    public buildEventSections(event: AddData): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section) {
                    case AddDataSection.OUTPUT_CHECKPOINT:
                    case AddDataSection.OUTPUT_DATA: {
                        result.push({
                            title: this.sectionTitleMapper[section],
                            rows: this.buildEventRows(
                                event,
                                ADD_DATA_SOURCE_DESCRIPTORS,
                                section,
                                false,
                            ),
                        });
                        break;
                    }
                    case AddDataSection.INPUT_CHECKPOINT:
                    case AddDataSection.ADD_DATA_WATERMARK: {
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
}
