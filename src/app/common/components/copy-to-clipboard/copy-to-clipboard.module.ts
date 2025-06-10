/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CopyToClipboardComponent } from "./copy-to-clipboard.component";
import { MatIconModule } from "@angular/material/icon";

@NgModule({
    declarations: [CopyToClipboardComponent],
    exports: [CopyToClipboardComponent],
    imports: [CommonModule, MatIconModule],
})
export class CopyToClipboardModule {}
