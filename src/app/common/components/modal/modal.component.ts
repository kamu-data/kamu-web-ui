/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Location, NgClass } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { BaseComponent } from "@common/components/base.component";
import { ModalDialogComponent } from "@common/components/modal/modal-dialog.component";
import { ModalImageComponent } from "@common/components/modal/modal-image.component";
import { ModalSpinnerComponent } from "@common/components/modal/modal-spinner.component";
import { ModalService } from "@common/components/modal/modal.service";
import { MaybeUndefined } from "@interface/app.types";
import { ModalCommandInterface, ModalComponentType, ModalMappingsComponent } from "@interface/modal.interface";

@Component({
    selector: "modal",
    template: `
        <div class="modal__container" #container tabindex="1" [ngClass]="{ modal__invisible: !isVisible }"></div>
    `,
    imports: [NgClass],
})
export class ModalComponent extends BaseComponent implements OnInit {
    @ViewChild("container", { read: ViewContainerRef })
    private container: ViewContainerRef;
    public isVisible: boolean;
    public type: MaybeUndefined<string>;

    private mappings: ModalMappingsComponent = {
        dialog: ModalDialogComponent,
        image: ModalImageComponent,
        spinner: ModalSpinnerComponent,
    };

    private modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);
    private location = inject(Location);
    private readonly keydownListener = (e: KeyboardEvent) => this._processKDB(e);

    public ngOnInit() {
        this.modalService
            .getCommand()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((command: ModalCommandInterface) => {
                this._execute(command);
                this.cdr.markForCheck();
            });
        this.destroyRef.onDestroy(() => document.removeEventListener("keydown", this.keydownListener));
    }

    public _execute(command: ModalCommandInterface) {
        this.modalService.modalType = command.type;

        this._close();

        this._renderModal(command);
    }

    public _renderModal(command: ModalCommandInterface) {
        const componentType = this._getComponentType(command.type);

        const componentRef = this.container.createComponent(componentType);

        const instance = componentRef.instance;
        instance.context = Object.assign(command.context, {
            _close: this._close.bind(this),
        });

        this._handleKBD(command.type);
    }

    public _getComponentType(typeName: ModalComponentType) {
        return this.mappings[typeName];
    }

    public _handleKBD(type?: string) {
        this.isVisible = true;
        this.type = type;
        document.addEventListener("keydown", this.keydownListener);
    }

    public _close(location?: boolean) {
        if (location === true) {
            this.location.back();
        }

        this.isVisible = false;
        this.container.remove();

        document.removeEventListener("keydown", this.keydownListener);
    }

    /* istanbul ignore next */
    public _processKDB(e: KeyboardEvent) {
        if (e.key === "Escape") {
            // escape
            this._close();
        }

        if (e.key === "Tab") {
            // tab
            const element: unknown = this.container.element.nativeElement;
            if (element instanceof HTMLElement) {
                setTimeout(() => element.focus());
            }
        }
    }
}
