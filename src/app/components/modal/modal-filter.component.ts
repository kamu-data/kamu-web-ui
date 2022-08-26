import { Component } from "@angular/core";
import { DynamicComponent } from "./dynamic.component";
import { ModalArgumentsInterface, NgStyleValue } from "../../interface/modal.interface";

@Component({
    selector: "modal-dialog",
    template: `
        <div>
            <div
                *ngIf="context && context.idFilterButton"
                class="modal-filter__close-btn"
                data-test-id="modal-filter__close-btn"
                (click)="hideAll()"
                [ngStyle]="closeButtonPosition()"
            >
                <span class="icon-cancel"></span>
            </div>

            <div
                class="modal-filter__content"
                *ngIf="context"
                data-test-id="modal-filter__content"
                (click)="hideAll()"
                [ngStyle]="positionStartModal()"
            >
                <div
                    [ngClass]="'modal__dialog'"
                    [ngStyle]="styleFilterModal()"
                    [style.display]="
                        context && !context.filter_data?.length && 'none'
                    "
                >
                    <ul
                        *ngFor="
                            let filter of context.filter_data;
                            let idx1 = index
                        "
                        [style.display]="!filter.length && 'none'"
                        [ngClass]="
                            isArrays(context)
                                ? 'filter__popup__category many-filters'
                                : 'filter__popup__category'
                        "
                    >
                        <li
                            *ngFor="let type of filter; let idx2 = index"
                            [class.check]="type.active"
                            [attr.data-test-id]="type.value"
                            (click)="
                                onSortChange(type.value);
                                $event.stopPropagation()
                            "
                        >
                            <p [attr.data-test-id]="type.title">
                                {{ type.title }}
                            </p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,
})
export class ModalFilterComponent extends DynamicComponent {

    getElementPosition(): DOMRect | null {
        if (this.context) {
            if (this.context.idFilterButton) {
                const element: Element | null = document.querySelector(
                    `[data-test-id=${this.context.idFilterButton}]`,
                );
                if (element !== null) {
                    return element.getBoundingClientRect();
                }
            }
            if (this.context.position) {
                return this.context.position;
            }
        }
        return null;
    }

    hideAll() {
        if (this.context) {
            this.context._close?.();
        }
    }

    onSortChange(action: boolean | string, locationBack?: boolean) {
        if (this.context && this.context.handler) {
            this.context._close?.(locationBack);
            this.context.handler(action);
        }
    }

    isArrays(context: ModalArgumentsInterface) {
        return (
            context.filter_data &&
            context.filter_data.length > 1 &&
            context.filter_data[0].length
        );
    }

    positionStartModal(): NgStyleValue {
        const elementPosition = this.getElementPosition();
        if (elementPosition?.top && elementPosition?.height) {
            return {
                top: elementPosition.top + elementPosition.height + "px",
            };
        }
        return {};
    }

    styleFilterModal(): NgStyleValue {
        const styleModal: NgStyleValue = {};
        const elementPosition = this.getElementPosition();
        if (this.context) {
            if (this.context.style && this.context.style.isMinContent) {
                styleModal["max-width"] = "min-content";
            }
            if (window.innerWidth < 568) {
                styleModal["max-width"] = "91%";
            }
            if (this.context.style?.width) {
                styleModal.width = this.context.style.width || "";
            }

            if (this.context.idFilterButton && this.context.style) {
                const borderRadius = this.context.style.borderRadius;
                styleModal["border-radius"] =
                    borderRadius + " 0 " + borderRadius + " " + borderRadius;

                const modalDialog = document.getElementsByClassName(
                    "modal__dialog",
                )[0] as HTMLElement;

                if (modalDialog !== null && elementPosition) {
                    if (modalDialog.offsetWidth !== 0) {
                        styleModal.position = "absolute";
                        styleModal.right = String(
                            elementPosition.right ||
                                0 - modalDialog.offsetWidth + 4 + "px",
                        );
                    }
                }
            }

            if (
                this.context.style &&
                this.context.style.width &&
                elementPosition
            ) {
                styleModal.position = "absolute";
                styleModal.left =
                    (elementPosition.right ||
                        0 - Number(this.context.style.width.split("px")[0])) +
                    "px";
            }
        }

        return styleModal;
    }

    closeButtonPosition(): NgStyleValue {
        const buttonPositionStyle: NgStyleValue = {};
        const elementPosition = this.getElementPosition();
        if (this.context.style && elementPosition) {
            const borderRadius = this.context
                ? this.context.style.borderRadius
                : 0;
            buttonPositionStyle.top = elementPosition.top + "px";
            (buttonPositionStyle.width =
                (elementPosition.width || 0 - 2) + "px"),
                (buttonPositionStyle.left = elementPosition.left + "px");
            buttonPositionStyle.height = elementPosition.height + "px";
            buttonPositionStyle["border-radius"] =
                borderRadius + " " + borderRadius + " 0px 0px";
            return buttonPositionStyle;
        }
        return {};
    }
}
