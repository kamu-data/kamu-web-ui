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

@NgModule({
    declarations: [
        MetadataBlockComponent,
        BlockHeaderComponent,
        EventDetailsComponent,
        BlockNavigationComponent,
        AddDataEventComponent,
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
    ],
    exports: [MetadataBlockComponent],
})
export class MetadataBlockModule {}
