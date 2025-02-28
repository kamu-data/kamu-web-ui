/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FlowsTableComponent } from "./flows-table/flows-table.component";
import { TileBaseWidgetComponent } from "./tile-base-widget/tile-base-widget.component";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDividerModule } from "@angular/material/divider";
import { RouterModule } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { SafeHtmlModule } from "../common/pipes/safe-html.module";

@NgModule({
    declarations: [FlowsTableComponent, TileBaseWidgetComponent],
    exports: [FlowsTableComponent, TileBaseWidgetComponent],
    imports: [
        AngularMultiSelectModule,
        CommonModule,
        FormsModule,
        MatDividerModule,
        MatMenuModule,
        MatIconModule,
        MatTableModule,
        NgbPopoverModule,
        ReactiveFormsModule,
        RouterModule,

        SafeHtmlModule,
    ],
})
export class FlowsViewModule {}
