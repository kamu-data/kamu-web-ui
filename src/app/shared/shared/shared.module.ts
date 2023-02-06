import { TooltipIconComponent } from "./../../dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BlockRowDataComponent } from "src/app/dataset-block/metadata-block/components/block-row-data/block-row-data.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { LinkPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/link-property/link-property.component";
import { OwnerPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/owner-property/owner-property.component";
import { DatasetNamePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/dataset-name-property/dataset-name-property.component";
import { SqlQueryViewerComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/sql-query-viewer/sql-query-viewer.component";
import { HighlightModule } from "ngx-highlightjs";
import { EnginePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/engine-property/engine-property.component";
import { SchemaPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/schema-property/schema-property.component";
import { DynamicTableModule } from "src/app/components/dynamic-table/dynamic-table.module";
import { MergeStrategyPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/merge-strategy-property/merge-strategy-property.component";
import { CardsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/cards-property/cards-property.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { MarkdownModule } from "ngx-markdown";

@NgModule({
    declarations: [
        BlockRowDataComponent,
        TooltipIconComponent,
        LinkPropertyComponent,
        OwnerPropertyComponent,
        DatasetNamePropertyComponent,
        SqlQueryViewerComponent,
        EnginePropertyComponent,
        SchemaPropertyComponent,
        MergeStrategyPropertyComponent,
        CardsPropertyComponent,
    ],
    imports: [
        CommonModule,
        NgbTooltipModule,
        MatIconModule,
        HighlightModule,
        DynamicTableModule,
        DisplaySizeModule,
        MarkdownModule,
    ],
    exports: [
        BlockRowDataComponent,
        MatIconModule,
        LinkPropertyComponent,
        OwnerPropertyComponent,
        DatasetNamePropertyComponent,
        SqlQueryViewerComponent,
        EnginePropertyComponent,
        SchemaPropertyComponent,
        MergeStrategyPropertyComponent,
        CardsPropertyComponent,
        MarkdownModule,
        DisplaySizeModule,
    ],
})
export class SharedModule {}
