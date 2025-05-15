/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatasetsTabComponent } from "./additional-components/datasets-tab/datasets-tab.component";
import { NgModule } from "@angular/core";
import { AccountComponent } from "./account.component";
import { AccountFlowsTabComponent } from "./additional-components/account-flows-tab/account-flows-tab.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DatasetListModule } from "../common/components/dataset-list-component/dataset-list.module";
import { PaginationModule } from "../common/components/pagination-component/pagination.module";
import { FlowsViewModule } from "../dataset-flow/flows-view.module";
import { FeatureFlagModule } from "../common/directives/feature-flag.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DisplayAccountNameModule } from "../common/pipes/display-account-name.module";

@NgModule({
    declarations: [AccountComponent, AccountFlowsTabComponent, DatasetsTabComponent],
    imports: [
        CommonModule,
        FormsModule,
        MatButtonToggleModule,
        MatIconModule,
        MatDividerModule,
        MatProgressBarModule,
        MatTableModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule,

        DatasetListModule,
        DisplayAccountNameModule,
        FeatureFlagModule,
        FlowsViewModule,
        PaginationModule,
    ],
})
export class AccountModule {}
