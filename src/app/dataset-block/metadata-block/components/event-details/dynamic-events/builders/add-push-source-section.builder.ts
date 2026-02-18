/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AddPushSource } from "@api/kamu.graphql.interface";

import { ADD_PUSH_SOURCE_DESCRIPTORS } from "src/app/dataset-block/metadata-block/components/event-details/components/add-push-source-event/add-push-source-event.source";
import { EventSectionBuilder } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/event-section.builder";
import { EventSection } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/dynamic-events.model";
import { AddPushSourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-push-source/add-push-source-form.types";

export class AddPushSourceSectionBuilder extends EventSectionBuilder<AddPushSource> {
    private sectionTitleMapper: Record<string, string> = {
        sourceName: "Source",
    };

    public buildEventSections(event: AddPushSource): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                const section_enum: AddPushSourceSection = section as AddPushSourceSection;
                switch (section_enum) {
                    case AddPushSourceSection.SOURCE_NAME: {
                        if (event.__typename) {
                            result.push({
                                title: this.sectionTitleMapper[section],
                                rows: [
                                    this.buildSupportedRow(
                                        event.__typename,
                                        ADD_PUSH_SOURCE_DESCRIPTORS,
                                        "string",
                                        section,
                                        data,
                                    ),
                                ],
                            });
                        }
                        break;
                    }

                    case AddPushSourceSection.READ:
                    case AddPushSourceSection.MERGE:
                    case AddPushSourceSection.PREPROCESS: {
                        const allowTypenameKey =
                            section_enum === AddPushSourceSection.MERGE || section_enum === AddPushSourceSection.READ;
                        result.push({
                            title: section,
                            rows: this.buildEventRows(
                                event,
                                ADD_PUSH_SOURCE_DESCRIPTORS,
                                section as keyof AddPushSource,
                                allowTypenameKey,
                            ),
                        });
                        break;
                    }

                    default: {
                        result.push({
                            title: section,
                            rows: [],
                        });
                    }
                }
            }
        });

        return result;
    }
}
