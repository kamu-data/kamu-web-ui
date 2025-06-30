/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { DatasetCreateComponent } from "./dataset-create.component";

import { MatFormFieldModule } from "@angular/material/form-field";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { EditorModule } from "../editor/editor.module";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
import { NgSelectModule } from "@ng-select/ng-select";


@NgModule({
    imports: [
    AngularMultiSelectModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    NgbModule,
    NgSelectModule,
    ReactiveFormsModule,
    EditorModule,
    DatasetCreateComponent,
],
    exports: [DatasetCreateComponent],
})
export class DatasetCreateModule {}
