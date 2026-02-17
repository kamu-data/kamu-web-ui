/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Location, NgClass } from "@angular/common";
import {
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    inject,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { BaseComponent } from "src/app/common/components/base.component";
import { MaybeUndefined } from "src/app/interface/app.types";
import { ModalCommandInterface, ModalComponentType, ModalMappingsComponent } from "src/app/interface/modal.interface";

import { DynamicComponent } from "./dynamic.component";
import { ModalDialogComponent } from "./modal-dialog.component";
import { ModalImageComponent } from "./modal-image.component";
import { ModalSpinnerComponent } from "./modal-spinner.component";
import { ModalService } from "./modal.service";

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

    private componentRef: ComponentRef<unknown>;
    private mappings: ModalMappingsComponent = {
        dialog: ModalDialogComponent,
        image: ModalImageComponent,
        spinner: ModalSpinnerComponent,
    };

    private componentFactoryResolver = inject(ComponentFactoryResolver);
    private modalService = inject(ModalService);
    private cdr = inject(ChangeDetectorRef);
    private location = inject(Location);

    public ngOnInit() {
        this.modalService
            .getCommand()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((command: ModalCommandInterface) => {
                this._execute(command);
                this.cdr.markForCheck();
            });
    }

    public _execute(command: ModalCommandInterface) {
        this.modalService.modalType = command.type;

        this._close();

        this._renderModal(command);
    }

    public _renderModal(command: ModalCommandInterface) {
        const componentType = this._getComponentType(command.type);

        const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
        this.componentRef = this.container.createComponent(factory);

        const instance = this.componentRef.instance as DynamicComponent;
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
        document.addEventListener("keydown", this._processKDB.bind(this));
    }

    public _close(location?: boolean) {
        if (location === true) {
            this.location.back();
        }

        this.isVisible = false;
        this.container.remove();

        document.removeEventListener("keydown", this._processKDB.bind(this));
    }

    /* istanbul ignore next */
    public _processKDB(e: KeyboardEvent) {
        if (e.key === "Escape") {
            // escape
            this._close();
        }

        if (e.key === "Tab") {
            // tab
            const element = this.container.element.nativeElement as HTMLElement;
            setTimeout(() => element.focus());
        }
    }
}
