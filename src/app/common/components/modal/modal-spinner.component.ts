/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component } from "@angular/core";

import { DynamicComponent } from "@common/components/modal/dynamic.component";

@Component({
    selector: "modal-spinner",
    templateUrl: "./modal-spinner.component.html",
})
export class ModalSpinnerComponent extends DynamicComponent {}
