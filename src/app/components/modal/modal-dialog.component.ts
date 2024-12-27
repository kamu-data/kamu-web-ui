import { Component } from "@angular/core";
import { DynamicComponent } from "./dynamic.component";

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

                    <p
                        *ngIf="context && context.description"
                        style="text-align:left; font-size:12px;"
                        class="modal__msg"
                        data-test-id="modalDescription"
                    >
                        <img
                            style="padding-bottom:2px"
                            src="assets/images/information.png"
                            alt=""
                            width="14"
                            height="14"
                        />
                        {{ context.description }}
                    </p>

                    <p *ngIf="context && context.message" class="modal__msg mt-4" data-test-id="modalMessage">
                        {{ context.message }}
                    </p>
                </div>
                <div
                    class="modal__dialog__footer-block"
                    [style]="{
                        width: computeWidth(),
                        display: 'flex',
                        alignItems: 'center',
                    }"
                >
                    <button
                        [class]="
                            context.lastButtonText || context.tooLastButtonText
                                ? 'modal__btn modal__btn-first'
                                : 'modal__btn'
                        "
                        data-test-id="yesButton"
                        *ngIf="context && context.yesButtonText"
                        (click)="onClick(true, context.locationBack)"
                    >
                        {{ context.yesButtonText }}
                    </button>

                    <button
                        [class]="
                            context.lastButtonText || context.tooLastButtonText
                                ? 'modal__btn modal__btn-last'
                                : 'modal__btn'
                        "
                        data-test-id="noButton"
                        *ngIf="context && context.noButtonText"
                        (click)="onClick(false)"
                    >
                        {{ context.noButtonText }}
                    </button>
                    <button
                        class="modal__btn modal__btn-last"
                        data-test-id="lastButton"
                        *ngIf="context && context.lastButtonText"
                        (click)="onClick('last')"
                    >
                        {{ context.lastButtonText }}
                    </button>
                    <button
                        class="modal__btn modal__btn-last"
                        data-test-id="tooLastButtonText"
                        *ngIf="context && context.tooLastButtonText"
                        (click)="onClick('tooLast')"
                    >
                        {{ context.tooLastButtonText }}
                    </button>
                </div>
            </div>
        </div>
    `,
})
export class ModalDialogComponent extends DynamicComponent {
    onClick(action: boolean | string, locationBack?: boolean) {
        this.context._close?.(locationBack);
        this.context.handler?.(action);
    }

    hideAll() {
        if (this.context.title === "Search for:") {
            this.context._close?.();
        }
    }

    computeWidth(): string {
        const buttonsCount = this.getContextButtonsCount();
        return `${100 / buttonsCount}%`;
    }

    private getContextButtonsCount(): number {
        let buttonsCount = 0;
        if (this.context.yesButtonText) buttonsCount++;
        if (this.context.noButtonText) buttonsCount++;
        if (this.context.lastButtonText) buttonsCount++;
        if (this.context.tooLastButtonText) buttonsCount++;
        return buttonsCount;
    }
}
