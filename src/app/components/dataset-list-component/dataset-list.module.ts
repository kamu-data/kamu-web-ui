import { DisplayTimeModule } from "../display-time/display-time.module";
import { DatasetListItemComponent } from "../dataset-list-item/dataset-list-item.component";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetListComponent } from "./dataset-list.component";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { AngularSvgIconModule } from "angular-svg-icon";

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
    ],
    exports: [DatasetListComponent, DatasetListItemComponent],
    declarations: [DatasetListComponent, DatasetListItemComponent],
})
export class DatasetListModule {
    public static forRoot(): ModuleWithProviders<DatasetListModule> {
        return { ngModule: DatasetListModule };
    }
}
