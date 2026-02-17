/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component } from "@angular/core";

import { DynamicComponent } from "./dynamic.component";

@Component({
    selector: "modal-image",
    template: `
        <div class="modal__content" data-test-id="modal_image_content">
            <div class="modal__img text-center">
                <img data-test-id="modal_image" [src]="context.message" />
            </div>

            <div class="text-center">
                <button class="modal__btn" data-test-id="yesButton" (click)="context._close && context._close()">
                    Close
                </button>
            </div>
        </div>
    `,
    standalone: true,
})
export class ModalImageComponent extends DynamicComponent {}
