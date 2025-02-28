/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ClipboardModule } from "@angular/cdk/clipboard";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DisplayHashComponent } from "./display-hash.component";
import { RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [DisplayHashComponent],
    exports: [DisplayHashComponent],
    imports: [CommonModule, ClipboardModule, MatIconModule, RouterModule],
})
export class DisplayHashModule {}
