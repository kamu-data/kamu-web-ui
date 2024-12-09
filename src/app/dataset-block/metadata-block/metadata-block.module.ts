import { SharedModule } from "../../shared/shared/shared.module";
import { SeparatorPropertyComponent } from "./components/event-details/components/common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "./components/event-details/components/common/simple-property/simple-property.component";
import { FormsModule } from "@angular/forms";
import { DisplayTimeModule } from "../../components/display-time/display-time.module";
import { MatDividerModule } from "@angular/material/divider";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetadataBlockComponent } from "./metadata-block.component";
import { BlockHeaderComponent } from "./components/block-header/block-header.component";
import { BlockNavigationComponent } from "./components/block-navigation/block-navigation.component";
import { MatMenuModule } from "@angular/material/menu";
import { DisplayHashModule } from "src/app/components/display-hash/display-hash.module";
import { AddDataEventComponent } from "./components/event-details/components/add-data-event/add-data-event.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { PaginationModule } from "src/app/components/pagination-component/pagination.module";
import { BlockHashFilterPipe } from "./components/block-navigation/pipes/block-hash-filter.pipe";
import { EventTypeFilterPipe } from "./components/block-navigation/pipes/event-type-filter.pipe";
import { SetPollingSourceEventComponent } from "./components/event-details/components/set-polling-source-event/set-polling-source-event.component";
import { ToggleComponent } from "src/app/components/toggle/toggle.component";
import { SeedEventComponent } from "./components/event-details/components/seed-event/seed-event.component";
import { HighlightModule } from "ngx-highlightjs";
import { DynamicTableModule } from "src/app/components/dynamic-table/dynamic-table.module";
import { EnvVariablesPropertyComponent } from "./components/event-details/components/common/env-variables-property/env-variables-property.component";
import { UnsupportedPropertyComponent } from "./components/event-details/components/common/unsupported-property/unsupported-property.component";
import { SetTransformEventComponent } from "./components/event-details/components/set-transform-event/set-transform-event.component";
import { BaseDynamicEventComponent } from "./components/event-details/components/base-dynamic-event/base-dynamic-event.component";
import { YamlViewSectionComponent } from "./components/yaml-view-section/yaml-view-section.component";
import { ExecuteTransformEventComponent } from "./components/event-details/components/execute-transform-event/execute-transform-event.component";
import { SizePropertyComponent } from "./components/event-details/components/common/size-property/size-property.component";
import { HashPropertyComponent } from "./components/event-details/components/common/hash-property/hash-property.component";
import { BlockIntervalPropertyComponent } from "./components/event-details/components/common/block-interval-property/block-interval-property.component";
import { SetLicenseEventComponent } from "./components/event-details/components/set-license-event/set-license-event.component";
import { SetAttachmentsEventComponent } from "./components/event-details/components/set-attachments-event/set-attachments-event.component";
import { SetInfoEventComponent } from "./components/event-details/components/set-info-event/set-info-event.component";
import { SetVocabEventComponent } from "./components/event-details/components/set-vocab-event/set-vocab-event.component";
import { TemporalTablesPropertyComponent } from "./components/event-details/components/common/temporal-tables-property/temporal-tables-property.component";
import { OffsetIntervalPropertyComponent } from "./components/event-details/components/common/offset-interval-property/offset-interval-property.component";
import { CachePropertyComponent } from "./components/event-details/components/common/cache-property/cache-property.component";
import { EventTimePropertyComponent } from "./components/event-details/components/common/event-time-property/event-time-property.component";
import { OrderPropertyComponent } from "./components/event-details/components/common/order-property/order-property.component";
import { CommandPropertyComponent } from "./components/event-details/components/common/command-property/command-property.component";
import { StepTypePropertyComponent } from "./components/event-details/components/common/step-type-property/step-type-property.component";
import { AddPushSourceEventComponent } from "./components/event-details/components/add-push-source-event/add-push-source-event.component";
import { SetDataSchemaEventComponent } from "./components/event-details/components/set-data-schema-event/set-data-schema-event.component";
import { UnsupportedEventComponent } from "./components/event-details/components/unsupported-event/unsupported-event.component";
import { TopicsPropertyComponent } from "./components/event-details/components/common/topics-property/topics-property.component";
import { TimePropertyComponent } from "./components/event-details/components/common/time-property/time-property.component";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { DatasetViewMenuModule } from "src/app/dataset-view/dataset-view-menu/dataset-view-menu/dataset-view-menu.module";
import { DatasetViewHeaderModule } from "src/app/dataset-view/dataset-view-header/dataset-view-header/dataset-view-header.module";

@NgModule({
    declarations: [
        MetadataBlockComponent,
        BlockHeaderComponent,
        EventDetailsComponent,
        BlockNavigationComponent,
        AddDataEventComponent,
        SetPollingSourceEventComponent,
        SetTransformEventComponent,
        SeedEventComponent,
        EventTypeFilterPipe,
        BlockHashFilterPipe,
        ToggleComponent,
        SimplePropertyComponent,
        SeparatorPropertyComponent,
        EnvVariablesPropertyComponent,
        UnsupportedPropertyComponent,
        OffsetIntervalPropertyComponent,
        BaseDynamicEventComponent,
        ExecuteTransformEventComponent,
        YamlViewSectionComponent,
        SizePropertyComponent,
        HashPropertyComponent,
        BlockIntervalPropertyComponent,
        TemporalTablesPropertyComponent,
        SetLicenseEventComponent,
        SetAttachmentsEventComponent,
        SetInfoEventComponent,
        SetVocabEventComponent,
        CachePropertyComponent,
        EventTimePropertyComponent,
        OrderPropertyComponent,
        CommandPropertyComponent,
        StepTypePropertyComponent,
        AddPushSourceEventComponent,
        SetDataSchemaEventComponent,
        UnsupportedEventComponent,
        TopicsPropertyComponent,
        TimePropertyComponent,
    ],
    imports: [
        CommonModule,
        MatMenuModule,
        MatDividerModule,
        FormsModule,
        PaginationModule,
        AngularSvgIconModule,
        HighlightModule,
        DynamicTableModule,
        DisplayTimeModule,
        DisplayHashModule,
        SharedModule,
        AngularMultiSelectModule,
        DatasetViewMenuModule,
        DatasetViewHeaderModule,
    ],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
