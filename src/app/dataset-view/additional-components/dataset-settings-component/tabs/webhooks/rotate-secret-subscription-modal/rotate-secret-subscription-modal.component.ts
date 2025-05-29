/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { changeCopyIcon } from "src/app/common/helpers/app.helpers";
import { MaybeUndefined } from "src/app/interface/app.types";
import { Clipboard } from "@angular/cdk/clipboard";

@Component({
    selector: "app-rotate-secret-subscription-modal",
    templateUrl: "./rotate-secret-subscription-modal.component.html",
    styleUrls: ["./rotate-secret-subscription-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RotateSecretSubscriptionModalComponent {
    public secretRotate: MaybeUndefined<string>;

    public activeModal = inject(NgbActiveModal);
    private clipboard = inject(Clipboard);

    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }
}
