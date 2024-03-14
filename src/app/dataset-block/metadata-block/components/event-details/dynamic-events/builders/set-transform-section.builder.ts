import { Dataset } from "../../../../../../api/kamu.graphql.interface";
import { SetTransform, TransformInput } from "src/app/api/kamu.graphql.interface";
import { EventSectionBuilder } from "./event-section.builder";
import { SET_TRANSFORM_SOURCE_DESCRIPTORS } from "../../components/set-transform-event/set-transform-event.source";
import { EventRow, EventSection } from "../dynamic-events.model";

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
                                      ...item.dataset,
                                      alias: item.alias,
                                      datasetRef: item.datasetRef,
                                  }
                                : {
                                      ...item.dataset,
                                      alias: item.alias,
                                  };
                            Object.entries(object).forEach(([key, value]) => {
                                if (event.__typename && item.dataset.__typename && key !== "__typename") {
                                    rows.push(
                                        this.buildSupportedRow(
                                            event.__typename,
                                            SET_TRANSFORM_SOURCE_DESCRIPTORS,
                                            item.dataset.__typename,
                                            key,
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
                return inputItem.dataset.id;

            default:
                return value;
        }
    }
}
