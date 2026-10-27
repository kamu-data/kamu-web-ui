/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgClass } from "@angular/common";
import { Component } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

import { DynamicComponent } from "@common/components/modal/dynamic.component";

@Component({
    selector: "modal-dialog",
    templateUrl: "./modal-dialog.component.html",
    imports: [
        //-----//
        NgClass,
        //-----//
        MatDividerModule,
    ],
})
export class ModalDialogComponent extends DynamicComponent {
    public onClick(action: boolean | string, locationBack?: boolean) {
        this.context._close?.(locationBack);
        this.context.handler?.(action);
    }

    public hideAll() {
        if (this.context.title === "Search for:") {
            this.context._close?.();
        }
    }

    public computeWidth(): string {
        const buttonsCount = this.getContextButtonsCount();
        return `${100 / buttonsCount}%`;
    }

    /* istanbul ignore next */
    private getContextButtonsCount(): number {
        let buttonsCount = 0;
        if (this.context.yesButtonText) buttonsCount++;
        if (this.context.noButtonText) buttonsCount++;
        if (this.context.lastButtonText) buttonsCount++;
        if (this.context.tooLastButtonText) buttonsCount++;
        return buttonsCount;
    }
}
