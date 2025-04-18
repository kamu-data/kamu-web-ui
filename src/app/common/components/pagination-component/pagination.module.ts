/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { PaginationComponent } from "./pagination.component";

@NgModule({
    imports: [CommonModule, FormsModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule, NgbModule],
    exports: [PaginationComponent],
    declarations: [PaginationComponent],
})
export class PaginationModule {}
