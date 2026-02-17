/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SetTransform, TransformInput } from "@api/kamu.graphql.interface";

import {
    Dataset,
    TransformInputDatasetAccessible,
    TransformInputDatasetNotAccessible,
} from "../../../../../../api/kamu.graphql.interface";
import { SET_TRANSFORM_SOURCE_DESCRIPTORS } from "../../components/set-transform-event/set-transform-event.source";
import { EventRow, EventSection } from "../dynamic-events.model";
import { EventSectionBuilder } from "./event-section.builder";

enum SetTransformSection {
    INPUTS = "inputs",
    TRANSFORM = "transform",
}

export class SetTransformSectionBuilder extends EventSectionBuilder<SetTransform> {
    public buildEventSections(event: SetTransform): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (section !== "__typename") {
                switch (section as SetTransformSection) {
                    case SetTransformSection.TRANSFORM: {
                        result.push({
                            title: section,
                            rows: this.buildEventRows(
                                event,
                                SET_TRANSFORM_SOURCE_DESCRIPTORS,
                                section as keyof SetTransform,
                                false,
                            ),
                        });
                        break;
                    }

                    case SetTransformSection.INPUTS: {
                        const numInputsParts = event.inputs.length;

                        (data as TransformInput[]).forEach((item, index) => {
                            const rows: EventRow[] = [];
                            const object = item.datasetRef
                                ? {
                                      dataset: item.inputDataset,
                                      alias: item.alias,
                                      datasetRef: item.datasetRef,
                                  }
                                : {
                                      dataset: item.inputDataset,
                                      alias: item.alias,
                                  };

                            const notAccessibleType =
                                "__typename" in object.dataset &&
                                object.dataset.__typename === "TransformInputDatasetNotAccessible";

                            Object.entries(
                                notAccessibleType
                                    ? (object.dataset as TransformInputDatasetNotAccessible)
                                    : (object.dataset as TransformInputDatasetAccessible).dataset,
                            ).forEach(([key, value]) => {
                                if (
                                    event.__typename &&
                                    item.inputDataset &&
                                    key !== "__typename" &&
                                    ["id", "name", "alias"].includes(key)
                                ) {
                                    rows.push(
                                        this.buildSupportedRow(
                                            event.__typename,
                                            SET_TRANSFORM_SOURCE_DESCRIPTORS,
                                            notAccessibleType
                                                ? ((item.inputDataset as TransformInputDatasetNotAccessible)
                                                      .__typename as string)
                                                : ((item.inputDataset as TransformInputDatasetAccessible).dataset
                                                      .__typename as string),
                                            key,
                                            // this.keyTransformMapper(key as keyof Dataset),

                                            this.valueTransformMapper(key as keyof Dataset, value, item),
                                        ),
                                    );
                                }
                            });

                            result.push({
                                title: section + (numInputsParts > 1 ? `#${index + 1}` : ""),
                                rows,
                            });
                        });
                        break;
                    }

                    default: {
                        result.push({ title: section, rows: [] });
                    }
                }
            }
        });

        return result;
    }

    private kindDatasetCapitalize(kind: string): string {
        return kind.slice(0, 1) + kind.slice(1).toLowerCase();
    }

    private valueTransformMapper(key: keyof Dataset, value: unknown, inputItem: TransformInput): unknown {
        switch (key) {
            case "kind":
                return this.kindDatasetCapitalize(value as string);
            case "name":
                return (inputItem.inputDataset as TransformInputDatasetAccessible).dataset.id;

            default:
                return value;
        }
    }
}
