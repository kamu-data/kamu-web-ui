import { LinkPropertyComponent } from "./components/event-details/components/common/link-property/link-property.component";
import { SeparatorPropertyComponent } from "./components/event-details/components/common/separator-property/separator-property.component";
import { SimplePropertyComponent } from "./components/event-details/components/common/simple-property/simple-property.component";
import { FormsModule } from "@angular/forms";
import { DisplayTimeModule } from "./../../components/display-time/display-time.module";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
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
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { TooltipIconComponent } from "./components/tooltip-icon/tooltip-icon.component";
import { BlockRowDataComponent } from "./components/block-row-data/block-row-data.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { PaginationModule } from "src/app/components/pagination-component/pagination.module";
import { BlockHashFilterPipe } from "./components/block-navigation/pipes/block-hash-filter.pipe";
import { EventTypeFilterPipe } from "./components/block-navigation/pipes/event-type-filter.pipe";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { SetPollingSourceEventComponent } from "./components/event-details/components/set-polling-source-event/set-polling-source-event.component";
import { ToggleComponent } from "src/app/components/toggle/toggle.component";
import { SeedEventComponent } from "./components/event-details/components/seed-event/seed-event.component";
import { MergeStrategyPropertyComponent } from "./components/event-details/components/common/merge-strategy-property/merge-strategy-property.component";
import { EnginePropertyComponent } from "./components/event-details/components/common/engine-property/engine-property.component";
import { SqlQueryViewerComponent } from "./components/event-details/components/common/sql-query-viewer/sql-query-viewer.component";
import { HighlightModule } from "ngx-highlightjs";
import { DynamicTableModule } from "src/app/components/dynamic-table/dynamic-table.module";
import { SchemaPropertyComponent } from "./components/event-details/components/common/schema-property/schema-property.component";
import { EnvVariablesPropertyComponent } from "./components/event-details/components/common/env-variables-property/env-variables-property.component";
import { CardsPropertyComponent } from "./components/event-details/components/common/cards-property/cards-property.component";
import { UnsupportedPropertyComponent } from "./components/event-details/components/common/unsupported-property/unsupported-property.component";
import { YamlEventViewerComponent } from "./components/event-details/components/common/yaml-event-viewer/yaml-event-viewer.component";
import { SetTransformEventComponent } from "./components/event-details/components/set-transform-event/set-transform-event.component";
import { OwnerPropertyComponent } from "./components/event-details/components/common/owner-property/owner-property.component";
import { BaseDynamicEventComponent } from "./components/event-details/components/base-dynamic-event/base-dynamic-event.component";
import { DatasetNamePropertyComponent } from "./components/event-details/components/common/dataset-name-property/dataset-name-property.component";
import { ExecuteQueryEventComponent } from "./components/event-details/components/execute-query-event/execute-query-event.component";
import { TimePropertyComponent } from "./components/event-details/components/common/time-property/time-property.component";
import { IntervalPropertyComponent } from "./components/event-details/components/common/interval-property/interval-property.component";
import { SizePropertyComponent } from "./components/event-details/components/common/size-property/size-property.component";
import { HashPropertyComponent } from "./components/event-details/components/common/hash-property/hash-property.component";
import { BlockIntervalPropertyComponent } from "./components/event-details/components/common/block-interval-property/block-interval-property.component";

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
        TooltipIconComponent,
        BlockRowDataComponent,
        EventTypeFilterPipe,
        BlockHashFilterPipe,
        ToggleComponent,
        MergeStrategyPropertyComponent,
        SimplePropertyComponent,
        SeparatorPropertyComponent,
        LinkPropertyComponent,
        EnginePropertyComponent,
        SqlQueryViewerComponent,
        SchemaPropertyComponent,
        EnvVariablesPropertyComponent,
        CardsPropertyComponent,
        UnsupportedPropertyComponent,
        YamlEventViewerComponent,
        OwnerPropertyComponent,
        BaseDynamicEventComponent,
        DatasetNamePropertyComponent,
        TimePropertyComponent,
        IntervalPropertyComponent,
        SizePropertyComponent,
        HashPropertyComponent,
        BlockIntervalPropertyComponent,
        ExecuteQueryEventComponent,
    ],
    imports: [
        CommonModule,
        DatasetModule,
        MatMenuModule,
        MatIconModule,
        MatDividerModule,
        DisplayTimeModule,
        DisplayHashModule,
        DisplaySizeModule,
        NgbTooltipModule,
        AngularSvgIconModule,
        FormsModule,
        PaginationModule,
        NgMultiSelectDropDownModule.forRoot(),
        HighlightModule,
        DynamicTableModule,
    ],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
