import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockIntervalPropertyComponent } from "./block-interval-property/block-interval-property.component";
import { CachePropertyComponent } from "./cache-property/cache-property.component";
import { CardsPropertyComponent } from "./cards-property/cards-property.component";
import { DisplayHashModule } from "src/app/common/components/display-hash/display-hash.module";
import { CommandPropertyComponent } from "./command-property/command-property.component";
import { DatasetNameByIdPropertyComponent } from "./dataset-name-by-id-property/dataset-name-by-id-property.component";
import { DatasetNamePropertyComponent } from "./dataset-name-property/dataset-name-property.component";
import { RouterModule } from "@angular/router";
import { EnginePropertyComponent } from "./engine-property/engine-property.component";
import { EnvVariablesPropertyComponent } from "./env-variables-property/env-variables-property.component";
import { DynamicTableModule } from "src/app/common/components/dynamic-table/dynamic-table.module";
import { EventTimePropertyComponent } from "./event-time-property/event-time-property.component";
import { HashPropertyComponent } from "./hash-property/hash-property.component";
import { LinkPropertyComponent } from "./link-property/link-property.component";
import { MergeStrategyPropertyComponent } from "./merge-strategy-property/merge-strategy-property.component";
import { OffsetIntervalPropertyComponent } from "./offset-interval-property/offset-interval-property.component";
import { OrderPropertyComponent } from "./order-property/order-property.component";
import { OwnerPropertyComponent } from "./owner-property/owner-property.component";
import { SchemaPropertyComponent } from "./schema-property/schema-property.component";
import { SeparatorPropertyComponent } from "./separator-property/separator-property.component";
import { SimplePropertyComponent } from "./simple-property/simple-property.component";
import { SizePropertyComponent } from "./size-property/size-property.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { SqlQueryViewerComponent } from "./sql-query-viewer/sql-query-viewer.component";
import { HighlightModule } from "ngx-highlightjs";
import { StepTypePropertyComponent } from "./step-type-property/step-type-property.component";
import { TemporalTablesPropertyComponent } from "./temporal-tables-property/temporal-tables-property.component";
import { TimePropertyComponent } from "./time-property/time-property.component";
import { DisplayTimeModule } from "src/app/common/components/display-time/display-time.module";
import { TopicsPropertyComponent } from "./topics-property/topics-property.component";
import { UnsupportedPropertyComponent } from "./unsupported-property/unsupported-property.component";

@NgModule({
    declarations: [
        BlockIntervalPropertyComponent,
        CachePropertyComponent,
        CardsPropertyComponent,
        CommandPropertyComponent,
        DatasetNameByIdPropertyComponent,
        DatasetNamePropertyComponent,
        EnginePropertyComponent,
        EnvVariablesPropertyComponent,
        EventTimePropertyComponent,
        HashPropertyComponent,
        LinkPropertyComponent,
        MergeStrategyPropertyComponent,
        OffsetIntervalPropertyComponent,
        OrderPropertyComponent,
        OwnerPropertyComponent,
        SchemaPropertyComponent,
        SeparatorPropertyComponent,
        SimplePropertyComponent,
        SizePropertyComponent,
        SqlQueryViewerComponent,
        StepTypePropertyComponent,
        TemporalTablesPropertyComponent,
        TimePropertyComponent,
        TopicsPropertyComponent,
        UnsupportedPropertyComponent,
    ],
    exports: [
        BlockIntervalPropertyComponent,
        CachePropertyComponent,
        CardsPropertyComponent,
        CommandPropertyComponent,
        DatasetNameByIdPropertyComponent,
        DatasetNamePropertyComponent,
        EnginePropertyComponent,
        EnvVariablesPropertyComponent,
        EventTimePropertyComponent,
        HashPropertyComponent,
        LinkPropertyComponent,
        MergeStrategyPropertyComponent,
        OffsetIntervalPropertyComponent,
        OrderPropertyComponent,
        OwnerPropertyComponent,
        SchemaPropertyComponent,
        SeparatorPropertyComponent,
        SimplePropertyComponent,
        SizePropertyComponent,
        SqlQueryViewerComponent,
        StepTypePropertyComponent,
        TemporalTablesPropertyComponent,
        TimePropertyComponent,
        TopicsPropertyComponent,
        UnsupportedPropertyComponent,
    ],
    imports: [
        CommonModule,
        DisplayHashModule,
        RouterModule,
        DynamicTableModule,
        DisplaySizeModule,
        HighlightModule,
        DisplayTimeModule,
    ],
})
export class EventDetailsPropertiesModule {}
