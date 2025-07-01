/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetadataBlockComponent } from "./metadata-block.component";
import { DatasetViewModule } from "src/app/dataset-view/dataset-view.module";
import { BlockHeaderComponent } from "./components/block-header/block-header.component";
import { BlockNavigationComponent } from "./components/block-navigation/block-navigation.component";
import { MatMenuModule } from "@angular/material/menu";
import { AddDataEventComponent } from "./components/event-details/components/add-data-event/add-data-event.component";
import { BlockHashFilterPipe } from "./components/block-navigation/pipes/block-hash-filter.pipe";
import { EventTypeFilterPipe } from "./components/block-navigation/pipes/event-type-filter.pipe";
import { SetPollingSourceEventComponent } from "./components/event-details/components/set-polling-source-event/set-polling-source-event.component";
import { SeedEventComponent } from "./components/event-details/components/seed-event/seed-event.component";
import { HighlightModule } from "ngx-highlightjs";
import { SetTransformEventComponent } from "./components/event-details/components/set-transform-event/set-transform-event.component";
import { BaseDynamicEventComponent } from "./components/event-details/components/base-dynamic-event/base-dynamic-event.component";
import { YamlViewSectionComponent } from "./components/yaml-view-section/yaml-view-section.component";
import { ExecuteTransformEventComponent } from "./components/event-details/components/execute-transform-event/execute-transform-event.component";
import { SetLicenseEventComponent } from "./components/event-details/components/set-license-event/set-license-event.component";
import { SetAttachmentsEventComponent } from "./components/event-details/components/set-attachments-event/set-attachments-event.component";
import { SetInfoEventComponent } from "./components/event-details/components/set-info-event/set-info-event.component";
import { SetVocabEventComponent } from "./components/event-details/components/set-vocab-event/set-vocab-event.component";
import { AddPushSourceEventComponent } from "./components/event-details/components/add-push-source-event/add-push-source-event.component";
import { SetDataSchemaEventComponent } from "./components/event-details/components/set-data-schema-event/set-data-schema-event.component";
import { UnsupportedEventComponent } from "./components/event-details/components/unsupported-event/unsupported-event.component";
import { MatIconModule } from "@angular/material/icon";
import { MarkdownModule } from "ngx-markdown";
import { NgSelectModule } from "@ng-select/ng-select";
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HighlightModule,
        MarkdownModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        NgSelectModule,
        DatasetViewModule,
        AddDataEventComponent,
        AddPushSourceEventComponent,
        MetadataBlockComponent,
        BaseDynamicEventComponent,
        BlockHashFilterPipe,
        BlockHeaderComponent,
        BlockNavigationComponent,
        EventDetailsComponent,
        EventTypeFilterPipe,
        ExecuteTransformEventComponent,
        SetPollingSourceEventComponent,
        SetTransformEventComponent,
        SeedEventComponent,
        SetLicenseEventComponent,
        SetAttachmentsEventComponent,
        SetInfoEventComponent,
        SetVocabEventComponent,
        SetDataSchemaEventComponent,
        UnsupportedEventComponent,
        YamlViewSectionComponent,
    ],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
