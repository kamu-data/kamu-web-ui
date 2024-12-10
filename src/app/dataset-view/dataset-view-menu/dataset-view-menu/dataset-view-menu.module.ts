import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetViewMenuComponent } from "../dataset-view-menu.component";
import { DataAccessPanelModule } from "src/app/components/data-access-panel/data-access-panel.module";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SharedModule } from "src/app/shared/shared/shared.module";

@NgModule({
    declarations: [DatasetViewMenuComponent],
    imports: [
        CommonModule,
        DataAccessPanelModule,
        AngularSvgIconModule,
        MatButtonToggleModule,
        RouterModule,
        MatIconModule,
        SharedModule,
    ],
    exports: [DatasetViewMenuComponent],
})
export class DatasetViewMenuModule {}
