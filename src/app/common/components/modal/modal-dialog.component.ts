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
    template: `
        <div class="modal__content" (click)="hideAll()">
            <div [ngClass]="context && context.bigTextBlock ? 'modal__bigtest-dialog' : 'modal__dialog'">
                <div class="modal__dialog__header-block">
                    <h2
                        class="modal__header"
                        data-test-id="modalHeader"
                        [ngClass]="{
                            'modal__header-ok': context && context.status === 'ok',
                            'modal__header-warning': context && context.status === 'warning',
                            'modal__header-error': context && context.status === 'error',
                            'modal__header-black': context && context.status === 'dialog_question',
                        }"
                    >
                        {{ context && context.title }}
                    </h2>

                    @if (context && context.description) {
                        <p style="text-align:left; font-size:12px;" class="modal__msg" data-test-id="modalDescription">
                            <img
                                style="padding-bottom:2px"
                                src="assets/images/information.png"
                                alt=""
                                width="14"
                                height="14"
                            />
                            {{ context.description }}
                        </p>
                    }

                    @if (context && context.warningText) {
                        <p
                            style="text-align:center; font-size:12px; color:red;"
                            class="modal__msg"
                            data-test-id="modalWarning"
                        >
                            {{ context.warningText }}
                        </p>
                    }

                    @if (context && context.message) {
                        <p class="modal__msg mt-4" data-test-id="modalMessage">
                            {{ context.message }}
                        </p>
                    }

                    @if (context && context.listDescription) {
                        <mat-divider class="mb-4" />
                        <ul>
                            @for (item of context.listDescription; track item) {
                                <li style="text-align:left" class="mb-1">
                                    <span class="fs-12 text-muted"> {{ item }}</span>
                                </li>
                            }
                        </ul>
                    }
                </div>
                <div
                    class="modal__dialog__footer-block"
                    [style]="{
                        width: computeWidth(),
                        display: 'flex',
                        alignItems: 'center',
                    }"
                >
                    @if (context && context.yesButtonText) {
                        <button
                            [class]="
                                context.lastButtonText || context.tooLastButtonText
                                    ? 'modal__btn modal__btn-first'
                                    : 'modal__btn'
                            "
                            data-test-id="yesButton"
                            (click)="onClick(true, context.locationBack)"
                        >
                            {{ context.yesButtonText }}
                        </button>
                    }

                    @if (context && context.noButtonText) {
                        <button
                            [class]="
                                context.lastButtonText || context.tooLastButtonText
                                    ? 'modal__btn modal__btn-last'
                                    : 'modal__btn'
                            "
                            data-test-id="noButton"
                            (click)="onClick(false)"
                        >
                            {{ context.noButtonText }}
                        </button>
                    }
                    @if (context && context.lastButtonText) {
                        <button class="modal__btn modal__btn-last" data-test-id="lastButton" (click)="onClick('last')">
                            {{ context.lastButtonText }}
                        </button>
                    }
                    @if (context && context.tooLastButtonText) {
                        <button
                            class="modal__btn modal__btn-last"
                            data-test-id="tooLastButtonText"
                            (click)="onClick('tooLast')"
                        >
                            {{ context.tooLastButtonText }}
                        </button>
                    }
                </div>
            </div>
        </div>
    `,
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
