import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";
import { DataAccessPanelModule } from "src/app/data-access-panel/data-access-panel.module";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FeatureFlagModule } from "src/app/common/directives/feature-flag.module";

@NgModule({
    declarations: [DatasetViewMenuComponent],
    exports: [DatasetViewMenuComponent],
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonToggleModule,
        RouterModule,

        DataAccessPanelModule,
        FeatureFlagModule,
    ],
})
export class DatasetViewMenuModule {}
