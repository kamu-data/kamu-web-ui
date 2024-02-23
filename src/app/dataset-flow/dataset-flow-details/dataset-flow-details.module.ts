import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatMenuModule } from "@angular/material/menu";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { DatasetModule } from "src/app/dataset-view/dataset.module";
import { DatasetFlowDetailsComponent } from "./dataset-flow-details.component";

@NgModule({
    declarations: [DatasetFlowDetailsComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatDividerModule,
        DatasetModule,
        RouterModule,
        AngularSvgIconModule,
        MatMenuModule,
    ],
})
export class DatasetFlowDetailsModule {}
