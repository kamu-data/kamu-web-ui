import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DatasetViewHeaderComponent } from "../dataset-view-header.component";
import { SearchAdditionalButtonsModule } from "src/app/components/search-additional-buttons/search-additional-buttons.module";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";

@NgModule({
    declarations: [DatasetViewHeaderComponent],
    imports: [CommonModule, SearchAdditionalButtonsModule, RouterModule, AngularSvgIconModule],
    exports: [DatasetViewHeaderComponent],
})
export class DatasetViewHeaderModule {}
