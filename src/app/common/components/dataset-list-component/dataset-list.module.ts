/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DisplayTimeModule } from "../display-time/display-time.module";
import { DatasetListItemComponent } from "./dataset-list-item/dataset-list-item.component";
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
import { FeatureFlagModule } from "../../directives/feature-flag.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatChipsModule,
        MatIconModule,
        MatDividerModule,
        MatSelectModule,
        NgbModule,
        RouterModule,

        DatasetVisibilityModule,
        DisplayTimeModule,
        FeatureFlagModule,
    ],
    exports: [DatasetListComponent, DatasetListItemComponent],
    declarations: [DatasetListComponent, DatasetListItemComponent],
})
export class DatasetListModule {}
