/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { BasePropertyComponent } from "./components/common/base-property/base-property.component";
import { MetadataEvent } from "../../../../api/kamu.graphql.interface";
import { SetPollingSource } from "src/app/api/kamu.graphql.interface";
import { Type } from "@angular/core";
import { SET_POLLING_SOURCE_DESCRIPTORS } from "./components/set-polling-source-event/set-polling-source-event.source";

export interface EventRowDescriptor {
    label: string;
    tooltip: string;
    separateRowForValue?: boolean;
    dataTestId?: string;
    presentationComponent: Type<BasePropertyComponent>;    
}

export interface EventRow {
    descriptor: EventRowDescriptor;
    value: unknown;
}

export interface EventSection {
    title: string;
    rows: EventRow[];
}

enum EventTypes {
    SetPollingSource = "SetPollingSource",
}

enum SetPollingSourceSection {
    READ = "read",
    FETCH = "fetch",
    MERGE = "merge",
    PREPROCESS = "preprocess",
    PREPARE = "prepare",
}

type SetPollingSourceScalarSections =            
    | SetPollingSourceSection.FETCH
    | SetPollingSourceSection.MERGE 
    | SetPollingSourceSection.PREPROCESS  
    | SetPollingSourceSection.READ;

abstract class EventSectionBuilder<TEvent> {
    public abstract buildEventSections(event: TEvent): EventSection[];
}

class SetPollingSourceSectionBuilder extends EventSectionBuilder<SetPollingSource> {
    private readonly UNSUPPORTED_ROW_DESCRIPTOR: EventRowDescriptor = {
        ...SET_POLLING_SOURCE_DESCRIPTORS[`SetPollingSource.UnsupportedKey`],
    };

    public buildEventSections(event: SetPollingSource): EventSection[] {
        const result: EventSection[] = [];
        Object.entries(event).forEach(([section, data]) => {
            if (data && section !== "__typename") {
                switch (section) {
                    case SetPollingSourceSection.READ:
                    case SetPollingSourceSection.FETCH: 
                    case SetPollingSourceSection.MERGE:
                    case SetPollingSourceSection.PREPROCESS: 
                        result.push({ title: section, rows: this.buildEventRows(event, section) });
                        break;

                    case SetPollingSourceSection.PREPARE: {
                        if (event.prepare) {
                            event.prepare.forEach((item, index) => {
                                const rows: EventRow[] = [];
                                Object.entries(item).forEach(([key, value]) => {
                                    if (key !== "__typename") {
                                        rows.push(this.buildSupportedRow(
                                            `${item.__typename}`, key, value,
                                        ));
                                    }
                                });
                                result.push({
                                    title:
                                        section +
                                        (event.prepare!.length > 1
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

    private buildEventRows(
        event: SetPollingSource, 
        section: SetPollingSourceScalarSections,
    ): EventRow[] {
        const rows: EventRow[] = [];
        const sectionObject = event[section as keyof SetPollingSource];
        if (sectionObject) {
            Object.entries(sectionObject).forEach(
                ([key, value]) => {
                    if (value && key !== "__typename") {
                        rows.push(this.buildEventRow(event, section, key, value));
                    }
                },
            );
        }

        return rows;
    }

    private buildEventRow(
        event: SetPollingSource, 
        section: SetPollingSourceScalarSections, 
        key: string, 
        value: unknown
    ): EventRow {
        const sectionType = `${event[section]?.__typename}`;
        const keyExists = Object.keys(SET_POLLING_SOURCE_DESCRIPTORS).includes(
            `SetPollingSource.${sectionType}.${key}`,
        );

        if (keyExists) {
            return this.buildSupportedRow(sectionType, key, value);
        } else {
            return this.buildUnsupportedRow(key, value);
        }
    }

    private buildUnsupportedRow(key: string, value: unknown): EventRow {
        return {
            descriptor: {
                ... this.UNSUPPORTED_ROW_DESCRIPTOR,
                label: `Unsupported(${key})`,
            } as EventRowDescriptor,
            value,
        } as EventRow;
    }

    private buildSupportedRow(sectionType: string, key: string, value: unknown): EventRow {
        return {
            descriptor: SET_POLLING_SOURCE_DESCRIPTORS[`SetPollingSource.${sectionType}.${key}`],
            value,
        } as EventRow;
    }

}

export const FACTORIES_BY_EVENT_TYPE: Record<
    EventTypes,
    EventSectionBuilder<MetadataEvent>
> = {
    [EventTypes.SetPollingSource]: new SetPollingSourceSectionBuilder(),
};
