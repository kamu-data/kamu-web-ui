/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DisplaySizePipe } from "./display-size.pipe";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations: [DisplaySizePipe],
    exports: [DisplaySizePipe],
    imports: [CommonModule],
})
export class DisplaySizeModule {}
