/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DisplayTimeComponent } from "./display-time.component";

@NgModule({
    declarations: [DisplayTimeComponent],
    exports: [DisplayTimeComponent],
    imports: [CommonModule],
})
export class DisplayTimeModule {}
