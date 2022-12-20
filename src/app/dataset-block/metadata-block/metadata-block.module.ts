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
import { EventTypeFilterModule } from "src/app/common/pipes/event-type-filter.module";
import { BlockHashFilterModule } from "src/app/common/pipes/block-hash-filter.module";

@NgModule({
    declarations: [
        MetadataBlockComponent,
        BlockHeaderComponent,
        EventDetailsComponent,
        BlockNavigationComponent,
        AddDataEventComponent,
        TooltipIconComponent,
        BlockRowDataComponent,
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
        EventTypeFilterModule,
        BlockHashFilterModule,
    ],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
