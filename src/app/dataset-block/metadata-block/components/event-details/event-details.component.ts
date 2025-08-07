/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull, MaybeUndefined } from "../../../../interface/app.types";
import { SetVocabEventComponent } from "./components/set-vocab-event/set-vocab-event.component";
import { SupportedEvents } from "./supported.events";
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
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { SetPollingSourceEventComponent } from "./components/set-polling-source-event/set-polling-source-event.component";
import { BaseComponent } from "src/app/common/components/base.component";
import { AddPushSourceEventComponent } from "./components/add-push-source-event/add-push-source-event.component";
import { UnsupportedEventComponent } from "./components/unsupported-event/unsupported-event.component";
import { SetDataSchemaEventComponent } from "./components/set-data-schema-event/set-data-schema-event.component";
import { SetInfoEventComponent } from "./components/set-info-event/set-info-event.component";
import { SetAttachmentsEventComponent } from "./components/set-attachments-event/set-attachments-event.component";
import { ExecuteTransformEventComponent } from "./components/execute-transform-event/execute-transform-event.component";
import { SetTransformEventComponent } from "./components/set-transform-event/set-transform-event.component";
import { SeedEventComponent } from "./components/seed-event/seed-event.component";
import { AddDataEventComponent } from "./components/add-data-event/add-data-event.component";
import { SetLicenseEventComponent } from "./components/set-license-event/set-license-event.component";

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
        if (changes.block && changes.block.currentValue) {
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
