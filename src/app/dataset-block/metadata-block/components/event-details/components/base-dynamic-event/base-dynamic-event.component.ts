/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Directive, Input, OnChanges, SimpleChanges } from "@angular/core";

import { BaseComponent } from "@common/components/base.component";

import {
    EventSectionBuilder,
    GenericDynamicEventType,
} from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/builders/event-section.builder";
import { EventSection } from "src/app/dataset-block/metadata-block/components/event-details/dynamic-events/dynamic-events.model";

@Directive()
export abstract class BaseDynamicEventComponent<TEvent extends GenericDynamicEventType>
    extends BaseComponent
    implements OnChanges
{
    @Input({ required: true }) public event: TEvent;
    protected eventSections: EventSection[];

    protected abstract readonly sectionBuilder: EventSectionBuilder<GenericDynamicEventType>;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.event) {
            this.eventSections = this.sectionBuilder.buildEventSections(this.event);
        }
    }
}
