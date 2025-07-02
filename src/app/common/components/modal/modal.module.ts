/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ModuleWithProviders, NgModule } from "@angular/core";
import { ModalService } from "./modal.service";
import { ModalComponent } from "./modal.component";
import { ModalDialogComponent } from "./modal-dialog.component";
import { CommonModule } from "@angular/common";
import { ModalImageComponent } from "./modal-image.component";
import { ModalSpinnerComponent } from "./modal-spinner.component";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
    imports: [
        CommonModule,

        MatDividerModule,

        ModalComponent,
        ModalDialogComponent,
        ModalImageComponent,
        ModalSpinnerComponent,
    ],
    exports: [ModalComponent],
})
export class ModalModule {
    public static forRoot(): ModuleWithProviders<ModalModule> {
        return {
            ngModule: ModalModule,
            providers: [ModalService],
        };
    }
}
