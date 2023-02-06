import { SharedModule } from "./../../shared/shared/shared.module";
import { SeparatorPropertyComponent } from "./components/event-details/components/common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "./components/event-details/components/common/simple-property/simple-property.component";
import { FormsModule } from "@angular/forms";
import { DisplayTimeModule } from "./../../components/display-time/display-time.module";
import { MatDividerModule } from "@angular/material/divider";
import { EventDetailsComponent } from "./components/event-details/event-details.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetadataBlockComponent } from "./metadata-block.component";
import { DatasetModule } from "src/app/dataset-view/dataset.module";
import { BlockHeaderComponent } from "./components/block-header/block-header.component";
import { BlockNavigationComponent } from "./components/block-navigation/block-navigation.component";
import { MatMenuModule } from "@angular/material/menu";
import { DisplayHashModule } from "src/app/components/display-hash/dispaly-hash.module";
import { AddDataEventComponent } from "./components/event-details/components/add-data-event/add-data-event.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { PaginationModule } from "src/app/components/pagination-component/pagination.module";
import { BlockHashFilterPipe } from "./components/block-navigation/pipes/block-hash-filter.pipe";
import { EventTypeFilterPipe } from "./components/block-navigation/pipes/event-type-filter.pipe";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SetPollingSourceEventComponent } from "./components/event-details/components/set-polling-source-event/set-polling-source-event.component";
import { ToggleComponent } from "src/app/components/toggle/toggle.component";
import { SeedEventComponent } from "./components/event-details/components/seed-event/seed-event.component";
import { HighlightModule } from "ngx-highlightjs";
import { DynamicTableModule } from "src/app/components/dynamic-table/dynamic-table.module";
import { EnvVariablesPropertyComponent } from "./components/event-details/components/common/env-variables-property/env-variables-property.component";
import { UnsupportedPropertyComponent } from "./components/event-details/components/common/unsupported-property/unsupported-property.component";
import { YamlEventViewerComponent } from "./components/event-details/components/common/yaml-event-viewer/yaml-event-viewer.component";
import { SetTransformEventComponent } from "./components/event-details/components/set-transform-event/set-transform-event.component";
import { BaseDynamicEventComponent } from "./components/event-details/components/base-dynamic-event/base-dynamic-event.component";
import { YamlViewSectionComponent } from "./components/yaml-view-section/yaml-view-section.component";
import { ExecuteQueryEventComponent } from "./components/event-details/components/execute-query-event/execute-query-event.component";
import { SizePropertyComponent } from "./components/event-details/components/common/size-property/size-property.component";
import { HashPropertyComponent } from "./components/event-details/components/common/hash-property/hash-property.component";
import { BlockIntervalPropertyComponent } from "./components/event-details/components/common/block-interval-property/block-interval-property.component";
import { SetLicenseEventComponent } from "./components/event-details/components/set-license-event/set-license-event.component";
import { SetInfoEventComponent } from "./components/event-details/components/set-info-event/set-info-event.component";

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
        YamlEventViewerComponent,
        BaseDynamicEventComponent,
        ExecuteQueryEventComponent,
        YamlViewSectionComponent,
        SizePropertyComponent,
        HashPropertyComponent,
        BlockIntervalPropertyComponent,
        SetLicenseEventComponent,
        SetInfoEventComponent,
    ],
    imports: [
        CommonModule,
        DatasetModule,
        MatMenuModule,
        MatDividerModule,
        AngularSvgIconModule,
        FormsModule,
        PaginationModule,
        NgMultiSelectDropDownModule.forRoot(),
        HighlightModule,
        DynamicTableModule,
        DisplayTimeModule,
        DisplayHashModule,
        SharedModule,
    ],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
