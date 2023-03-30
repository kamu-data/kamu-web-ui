import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { EventSectionBuilder } from "./event-section.builder";
import { SET_POLLING_SOURCE_DESCRIPTORS } from "../../components/set-polling-source-event/set-polling-source-event.source";
import { EventRow, EventSection } from "../dynamic-events.model";
import { SetPollingSourceSection } from "src/app/shared/shared.types";

export class SetPollingSourceSectionBuilder extends EventSectionBuilder<SetPollingSource> {
    public buildEventSections(event: SetPollingSource): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section) {
                    case SetPollingSourceSection.READ:
                    case SetPollingSourceSection.FETCH:
                    case SetPollingSourceSection.MERGE:
                    case SetPollingSourceSection.PREPROCESS: {
                        const allowTypenameKey =
                            section === SetPollingSourceSection.MERGE;
                        result.push({
                            title: section,
                            rows: this.buildEventRows(
                                event,
                                SET_POLLING_SOURCE_DESCRIPTORS,
                                section,
                                allowTypenameKey,
                            ),
                        });
                        break;
                    }

                    case SetPollingSourceSection.PREPARE: {
                        if (event.prepare) {
                            const numPrepareParts = event.prepare.length;
                            event.prepare.forEach((item, index) => {
                                const rows: EventRow[] = [];
                                Object.entries(item).forEach(([key, value]) => {
                                    if (
                                        key !== "__typename" &&
                                        item.__typename &&
                                        event.__typename
                                    ) {
                                        rows.push(
                                            this.buildSupportedRow(
                                                event.__typename,
                                                SET_POLLING_SOURCE_DESCRIPTORS,
                                                `${item.__typename}`,
                                                key,
                                                value,
                                            ),
                                        );
                                    }
                                });
                                result.push({
                                    title:
                                        section +
                                        (numPrepareParts > 1
                                            ? `#${index + 1}`
                                            : ""),
                                    rows,
                                });
                            });
                        }
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
}
