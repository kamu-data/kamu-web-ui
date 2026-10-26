/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    DatasetBasicsFragment,
    DatasetTransformFragment,
    TransformInputDataFragment,
} from "@api/kamu.graphql.interface";

import { SET_TRANSFORM_SOURCE_DESCRIPTORS } from "src/app/dataset-block/metadata-block/components/event-details/components/set-transform-event/set-transform-event.source";
import { EventSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/event-section.builder";
import {
    EventRow,
    EventSection,
} from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/dynamic-events.model";

enum SetTransformSection {
    INPUTS = "inputs",
    TRANSFORM = "transform",
}

export class SetTransformSectionBuilder extends EventSectionBuilder<DatasetTransformFragment> {
    public buildEventSections(event: DatasetTransformFragment): EventSection[] {
        const result: EventSection[] = [];
        Object.keys(event).forEach((section) => {
            if (section !== "__typename") {
                switch (section as SetTransformSection) {
                    case SetTransformSection.TRANSFORM: {
                        result.push({
                            title: section,
                            rows: this.buildEventRows(
                                event,
                                SET_TRANSFORM_SOURCE_DESCRIPTORS,
                                section as keyof DatasetTransformFragment,
                                false,
                            ),
                        });
                        break;
                    }

                    case SetTransformSection.INPUTS: {
                        const numInputsParts = event.inputs.length;

                        event.inputs.forEach((item, index) => {
                            const rows: EventRow[] = [];
                            const inputDataset = item.inputDataset;
                            const { fields, sectionType } =
                                inputDataset.__typename === "TransformInputDatasetNotAccessible"
                                    ? { fields: inputDataset, sectionType: inputDataset.__typename }
                                    : "dataset" in inputDataset
                                      ? {
                                            fields: inputDataset.dataset,
                                            sectionType: `${inputDataset.dataset.__typename}`,
                                        }
                                      : { fields: {}, sectionType: "" };

                            Object.entries(fields).forEach(([key, value]) => {
                                if (event.__typename && key !== "__typename" && ["id", "name", "alias"].includes(key)) {
                                    rows.push(
                                        this.buildSupportedRow(
                                            event.__typename,
                                            SET_TRANSFORM_SOURCE_DESCRIPTORS,
                                            sectionType,
                                            key,
                                            this.valueTransformMapper(key as keyof DatasetBasicsFragment, value, item),
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

    private valueTransformMapper(
        key: keyof DatasetBasicsFragment,
        value: unknown,
        inputItem: TransformInputDataFragment,
    ): unknown {
        switch (key) {
            case "kind":
                return this.kindDatasetCapitalize(value as string);
            case "name":
                return "dataset" in inputItem.inputDataset ? inputItem.inputDataset.dataset.id : value;

            default:
                return value;
        }
    }
}
