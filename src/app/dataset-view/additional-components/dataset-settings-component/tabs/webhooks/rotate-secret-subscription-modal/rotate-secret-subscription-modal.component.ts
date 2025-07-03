/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MaybeUndefined } from "src/app/interface/app.types";
import { FeatureFlagDirective } from "../../../../../../common/directives/feature-flag.directive";
import { CopyToClipboardComponent } from "../../../../../../common/components/copy-to-clipboard/copy-to-clipboard.component";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    selector: "app-rotate-secret-subscription-modal",
    templateUrl: "./rotate-secret-subscription-modal.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        FormsModule,
        NgIf,

        //-----//
        MatDividerModule,

        //-----//
        CopyToClipboardComponent,
        FeatureFlagDirective,
    ],
})
export class RotateSecretSubscriptionModalComponent {
    public secretRotate: MaybeUndefined<string>;

    public activeModal = inject(NgbActiveModal);
}
