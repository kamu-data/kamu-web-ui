/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */


import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SearchComponent } from "./search.component";

import { FormsModule } from "@angular/forms";

import { MatChipsModule } from "@angular/material/chips";


import { ModalModule } from "../common/components/modal/modal.module";
import { MatCheckboxModule } from "@angular/material/checkbox";


@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatCheckboxModule,
    ModalModule,
    SearchComponent,
],
    exports: [SearchComponent],
})
export class SearchModule {}
