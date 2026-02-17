/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    SimpleChanges,
    Type,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";

import { AddDataEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/add-data-event/add-data-event.component";
import { AddPushSourceEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/add-push-source-event/add-push-source-event.component";
import { ExecuteTransformEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/execute-transform-event/execute-transform-event.component";
import { SeedEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/seed-event/seed-event.component";
import { SetAttachmentsEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-attachments-event/set-attachments-event.component";
import { SetDataSchemaEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-data-schema-event/set-data-schema-event.component";
import { SetInfoEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-info-event/set-info-event.component";
import { SetLicenseEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-license-event/set-license-event.component";
import { SetPollingSourceEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-polling-source-event/set-polling-source-event.component";
import { SetTransformEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-transform-event/set-transform-event.component";
import { SetVocabEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/set-vocab-event/set-vocab-event.component";
import { UnsupportedEventComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/unsupported-event/unsupported-event.component";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";

import { BaseComponent } from "@common/components/base.component";
import { MetadataBlockFragment } from "@api/kamu.graphql.interface";
import { MaybeNull, MaybeUndefined } from "@interface/app.types";
import { DatasetInfo } from "@interface/navigation.interface";

@Component({
    selector: "app-event-details",
    templateUrl: "./event-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class EventDetailsComponent implements AfterViewInit, OnChanges {
    @Input({ required: true }) public block: MetadataBlockFragment;
    @Input({ required: true }) public datasetInfo: DatasetInfo;
    @ViewChild("dynamicContainer", { read: ViewContainerRef })
    public dynamicContainer: MaybeNull<ViewContainerRef>;
    private cdr = inject(ChangeDetectorRef);

    public ngAfterViewInit(): void {
        this.createView();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.block && changes.block.currentValue && !changes.block.isFirstChange()) {
            this.createView();
        }
    }

    private createView(): void {
        if (this.dynamicContainer) {
            this.dynamicContainer.clear();
            const componentRef = this.dynamicContainer.createComponent<BaseComponent>(
                this.componentEventTypeFactory[this.block.event.__typename as SupportedEvents] ??
                    UnsupportedEventComponent,
            );
            componentRef.setInput("event", this.block.event);
        }
        this.cdr.detectChanges();
    }

    private componentEventTypeFactory: { [key in SupportedEvents]: MaybeUndefined<Type<BaseComponent>> } = {
        [SupportedEvents.SetPollingSource]: SetPollingSourceEventComponent,
        [SupportedEvents.SetDataSchema]: SetDataSchemaEventComponent,
        [SupportedEvents.AddPushSource]: AddPushSourceEventComponent,
        [SupportedEvents.SetVocab]: SetVocabEventComponent,
        [SupportedEvents.SetInfo]: SetInfoEventComponent,
        [SupportedEvents.SetAttachments]: SetAttachmentsEventComponent,
        [SupportedEvents.ExecuteTransform]: ExecuteTransformEventComponent,
        [SupportedEvents.SetTransform]: SetTransformEventComponent,
        [SupportedEvents.Seed]: SeedEventComponent,
        [SupportedEvents.AddData]: AddDataEventComponent,
        [SupportedEvents.SetLicense]: SetLicenseEventComponent,
    };
}
