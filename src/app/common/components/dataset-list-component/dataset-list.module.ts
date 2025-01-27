import { DisplayTimeModule } from "../display-time/display-time.module";
import { DatasetListItemComponent } from "../../components/dataset-list-item/dataset-list-item.component";
import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetListComponent } from "./dataset-list.component";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule } from "@angular/router";
import { DatasetVisibilityModule } from "../dataset-visibility/dataset-visibility.module";
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
        DisplayTimeModule,
        RouterModule,
        DatasetVisibilityModule,
        SharedModule,
    ],
    exports: [DatasetListComponent, DatasetListItemComponent],
    declarations: [DatasetListComponent, DatasetListItemComponent],
})
export class DatasetListModule {}
