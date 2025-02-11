import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LineageGraphComponent } from "./lineage-graph.component";
import { NgxGraphModule } from "@swimlane/ngx-graph";
import { MatIconModule } from "@angular/material/icon";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { DisplayTimeModule } from "../display-time/display-time.module";
import { DisplayDatasetIdPipeModule } from "src/app/common/pipes/display-dataset-id.pipe.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        NgxGraphModule,

        DisplayDatasetIdPipeModule,
        DisplayTimeModule,
        DisplaySizeModule,
    ],
    exports: [LineageGraphComponent],
    declarations: [LineageGraphComponent],
})
export class LineageGraphModule {}
