import { DisplayTimeModule } from "../display-time/display-time.module";
import { DatasetListItemComponent } from "../dataset-list-item/dataset-list-item.component";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetListComponent } from "./dataset-list.component";
import { MatSelectModule } from "@angular/material/select";
import { AngularSvgIconModule } from "angular-svg-icon";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/shared/shared/shared.module";

@NgModule({
    imports: [
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        NgbModule,
        CommonModule,
        FormsModule,
        MatChipsModule,
        MatSelectModule,
        AngularSvgIconModule,
        DisplayTimeModule,
        RouterModule,
        SharedModule,
    ],
    exports: [DatasetListComponent, DatasetListItemComponent],
    declarations: [DatasetListComponent, DatasetListItemComponent],
})
export class DatasetListModule {
    public static forRoot(): ModuleWithProviders<DatasetListModule> {
        return { ngModule: DatasetListModule };
    }
}
