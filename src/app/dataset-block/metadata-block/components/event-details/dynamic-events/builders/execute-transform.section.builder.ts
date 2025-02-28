/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DataSlice, ExecuteTransform, ExecuteTransformInput } from "src/app/api/kamu.graphql.interface";
import { EXECUTE_TRANSFORM_SOURCE_DESCRIPTORS } from "../../components/execute-transform-event/execute-transform-event.source";
import { EventRow, EventSection } from "../dynamic-events.model";
import { EventSectionBuilder } from "./event-section.builder";

export enum ExecuteTransformSection {
    QUERY_INPUTS = "queryInputs",
    PREV_CHECKPOINT = "prevCheckpoint",
    PREV_OFFSET = "prevOffset",
    NEW_DATA = "newData",
    NEW_CHECKPOINT = "newCheckpoint",
    NEW_WATERMARK = "newWatermark",
}

export class ExecuteTransformSectionBuilder extends EventSectionBuilder<ExecuteTransform> {
    private sectionTitleMapper: Record<string, string> = {
        queryInputs: "Query inputs",
        prevCheckpoint: "Previous checkpoint",
        prevOffset: "Previous offset",
        newData: "New data",
        newCheckpoint: "New checkpoint",
        newWatermark: "New watermark",
    };

    public buildEventSections(event: ExecuteTransform): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section as ExecuteTransformSection) {
                    case ExecuteTransformSection.NEW_CHECKPOINT: {
                        result.push({
                            title: this.sectionTitleMapper[section],
                            rows: this.buildEventRows(
                                event,
                                EXECUTE_TRANSFORM_SOURCE_DESCRIPTORS,
                                section as keyof ExecuteTransform,
                                false,
                            ),
                        });
                        break;
                    }
                    case ExecuteTransformSection.NEW_DATA: {
                        const rows: EventRow[] = [];
                        Object.entries(data as DataSlice).forEach(([key, value]) => {
                            if (event.__typename && key !== "__typename") {
                                rows.push(
                                    this.buildSupportedRow(
                                        event.__typename,
                                        EXECUTE_TRANSFORM_SOURCE_DESCRIPTORS,
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
                    case ExecuteTransformSection.PREV_OFFSET: {
                        if (event.__typename) {
                            result.push({
                                title: this.sectionTitleMapper[section],
                                rows: [
                                    this.buildSupportedRow(
                                        event.__typename,
                                        EXECUTE_TRANSFORM_SOURCE_DESCRIPTORS,
                                        "number",
                                        section,
                                        data,
                                    ),
                                ],
                            });
                        }
                        break;
                    }

                    case ExecuteTransformSection.PREV_CHECKPOINT:
                    case ExecuteTransformSection.NEW_WATERMARK: {
                        if (event.__typename) {
                            result.push({
                                title: this.sectionTitleMapper[section],
                                rows: [
                                    this.buildSupportedRow(
                                        event.__typename,
                                        EXECUTE_TRANSFORM_SOURCE_DESCRIPTORS,
                                        "string",
                                        section,
                                        data,
                                    ),
                                ],
                            });
                        }
                        break;
                    }

                    case ExecuteTransformSection.QUERY_INPUTS: {
                        const numQueryInputs = event.queryInputs.length;
                        (data as ExecuteTransformInput[]).forEach((item, index) => {
                            let rows: EventRow[] = [];
                            Object.entries({
                                ...item,
                            }).forEach(([key, value]) => {
                                if (event.__typename && item.__typename && key !== "__typename") {
                                    rows.push(
                                        this.buildSupportedRow(
                                            event.__typename,
                                            EXECUTE_TRANSFORM_SOURCE_DESCRIPTORS,
                                            item.__typename,
                                            key,
                                            value,
                                        ),
                                    );
                                }
                            });
                            result.push({
                                title: this.sectionTitleMapper[section] + (numQueryInputs > 1 ? `#${index + 1}` : ""),
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

    private valueTransformMapper(key: keyof ExecuteTransformInput | keyof DataSlice, value: unknown): unknown {
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
