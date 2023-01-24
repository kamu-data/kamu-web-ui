import {
    SetTransform,
    TransformInput,
} from "src/app/api/kamu.graphql.interface";
import {
    EventSectionBuilder,
    EventSection,
    EventRow,
    SetTransformSection,
} from "../builder.events";

export class SetTransformSectionBuilder extends EventSectionBuilder<SetTransform> {
    public buildEventSections(event: SetTransform): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (section !== "__typename") {
                switch (section) {
                    case SetTransformSection.TRANSFORM: {
                        result.push({
                            title: section,
                            rows: this.buildEventRows(event, section, false),
                        });

                        break;
                    }
                    case SetTransformSection.INPUTS: {
                        const numInputsParts = event.inputs.length;
                        const rows: EventRow[] = [];
                        (data as TransformInput[]).forEach((item, index) => {
                            Object.entries(item.dataset).forEach(
                                ([key, value]) => {
                                    if (
                                        event.__typename &&
                                        item.dataset.__typename &&
                                        key !== "__typename"
                                    ) {
                                        rows.push(
                                            this.buildSupportedRow(
                                                event.__typename,
                                                item.dataset.__typename,
                                                key,
                                                key === "kind"
                                                    ? this.kindDatasetCapitalize(
                                                          value as string,
                                                      )
                                                    : value,
                                            ),
                                        );
                                    }
                                },
                            );
                            result.push({
                                title:
                                    section +
                                    (numInputsParts > 1 ? `#${index + 1}` : ""),
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
}
