import { AddPushSource } from "src/app/api/kamu.graphql.interface";
import { EventSectionBuilder } from "./event-section.builder";
import { EventSection } from "../dynamic-events.model";
import { AddPushSourceSection } from "src/app/shared/shared.types";
import { ADD_PUSH_SOURCE_DESCRIPTORS } from "../../components/add-push-source-event/add-push-source-event.source";

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
