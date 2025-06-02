/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { DisplayAccountNamePipe } from "./display-account-name.pipe";

@NgModule({
    declarations: [DisplayAccountNamePipe],
    exports: [DisplayAccountNamePipe],
    imports: [CommonModule],
})
export class DisplayAccountNameModule {}
