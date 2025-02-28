/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DragAndDropDirective } from "./drag-and-drop.directive";

@NgModule({
    declarations: [DragAndDropDirective],
    exports: [DragAndDropDirective],
    imports: [CommonModule],
})
export class DragAndDropModule {}
