/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaybeUndefined } from "src/app/interface/app.types";

@Component({
    selector: "app-rotate-secret-subscription-modal",
    templateUrl: "./rotate-secret-subscription-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RotateSecretSubscriptionModalComponent {
    public secretRotate: MaybeUndefined<string>;

    public activeModal = inject(NgbActiveModal);
}
