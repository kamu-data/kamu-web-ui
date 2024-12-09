import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AccountComponent } from "./account.component";
import { DatasetFlowModule } from "src/app/dataset-flow/dataset-flow/dataset-flow.module";
import { AccountFlowsTabComponent } from "./additional-components/account-flows-tab/account-flows-tab.component";
import { MatIconModule } from "@angular/material/icon";
import { PaginationModule } from "src/app/components/pagination-component/pagination.module";
import { SharedModule } from "src/app/shared/shared/shared.module";
import { MatDividerModule } from "@angular/material/divider";
import { DatasetsTabComponent } from "./additional-components/datasets-tab/datasets-tab.component";
import { DatasetListModule } from "src/app/components/dataset-list-component/dataset-list.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    declarations: [AccountComponent, AccountFlowsTabComponent, DatasetsTabComponent],
    imports: [
        CommonModule,
        DatasetFlowModule,
        MatIconModule,
        MatDividerModule,
        DatasetListModule,
        PaginationModule,
        SharedModule,
        MatTableModule,
        RouterModule,
        AngularSvgIconModule,
        MatButtonToggleModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
    ],
})
export class AccountModule {}
