import { UnsupportedPropertyComponent } from "../../components/common/unsupported-property/unsupported-property.component";
import {
    DynamicEventTypesScalar,
    EventRow,
    EventRowDescriptor,
    EventRowDescriptorsByField,
    EventSection,
} from "../dynamic-events.model";

export interface GenericDynamicEventType extends Record<string, unknown> {
    __typename?: DynamicEventTypesScalar;
}

type GenericEventSectionType = Record<string, unknown>;

export abstract class EventSectionBuilder<
    TEvent extends GenericDynamicEventType,
> {
    private readonly UNSUPPORTED_ROW_DESCRIPTOR: EventRowDescriptor = {
        label: "",
        tooltip: "Unsupported value",
        presentationComponent: UnsupportedPropertyComponent,
        separateRowForValue: false,
        dataTestId: "unsupportedKey",
    };

    public abstract buildEventSections(event: TEvent): EventSection[];

    public buildEventRows(
        event: TEvent,
        rowDescriptors: EventRowDescriptorsByField,
        section: keyof TEvent,
        allowTypenameKey: boolean,
    ): EventRow[] {
        const rows: EventRow[] = [];
        const sectionObject: GenericEventSectionType = event[
            section
        ] as GenericEventSectionType;
        Object.entries(sectionObject).forEach(([key, value]) => {
            if (value && (key !== "__typename" || allowTypenameKey)) {
                rows.push(
                    this.buildEventRow(
                        event,
                        rowDescriptors,
                        sectionObject,
                        key,
                        value,
                    ),
                );
            }
        });

        return rows;
    }

    public buildEventRow(
        event: TEvent,
        rowDescriptors: EventRowDescriptorsByField,
        sectionObject: GenericEventSectionType,
        key: string,
        value: unknown,
    ): EventRow {
        const eventType = event.__typename;
        if (event.__typename && eventType && "__typename" in sectionObject) {
            const sectionType = sectionObject.__typename as string;
            const keyExists = Object.keys(rowDescriptors).includes(
                `${eventType}.${sectionType}.${key}`,
            );
            if (keyExists) {
                return this.buildSupportedRow(
                    event.__typename,
                    rowDescriptors,
                    sectionType,
                    key,
                    value,
                );
            } else {
                return this.buildUnsupportedRow(key, value);
            }
        } else {
            throw new Error("Expecting typename in section object");
        }
    }

    private buildUnsupportedRow(key: string, value: unknown): EventRow {
        return {
            descriptor: {
                ...this.UNSUPPORTED_ROW_DESCRIPTOR,
                label: `Unsupported(${key})`,
            } as EventRowDescriptor,
            value,
        } as EventRow;
    }

    public buildSupportedRow(
        eventType: DynamicEventTypesScalar,
        rowDescriptors: EventRowDescriptorsByField,
        sectionType: string,
        key: string,
        value: unknown,
    ): EventRow {
        return {
            descriptor: rowDescriptors[`${eventType}.${sectionType}.${key}`],
            value,
        } as EventRow;
    }
}
