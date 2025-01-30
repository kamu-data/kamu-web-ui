import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetViewMenuComponent } from "./dataset-view-menu.component";
import { DataAccessPanelModule } from "src/app/data-access-panel/data-access-panel.module";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

@NgModule({
    declarations: [DatasetViewMenuComponent],
    exports: [DatasetViewMenuComponent],
    imports: [CommonModule, DataAccessPanelModule, MatIconModule, RouterModule, MatButtonToggleModule],
})
export class DatasetViewMenuModule {}
