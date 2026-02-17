/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component } from "@angular/core";

import { DynamicComponent } from "./dynamic.component";

@Component({
    selector: "modal-spinner",
    template: `
        <div class="modal__content">
            <div data-test-id="spinner" class="loader">Loading...</div>
        </div>
    `,
    standalone: true,
})
export class ModalSpinnerComponent extends DynamicComponent {}
