/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Component, inject } from "@angular/core";
import { ModalService } from "../../common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import AppValues from "src/app/common/values/app.values";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-notification-indicator",
    templateUrl: "./notification-indicator.html",
    styleUrls: ["./notification-indicator.scss"],
    imports: [MatIconModule],
})
export class NotificationIndicatorComponent {
    private modalService = inject(ModalService);

    public onNotifications(): void {
        promiseWithCatch(
            this.modalService.warning({
                message: AppValues.UNIMPLEMENTED_MESSAGE,
                yesButtonText: "Ok",
            }),
        );
    }
}
