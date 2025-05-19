/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { BaseComponent } from "src/app/common/components/base.component";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import ProjectLinks from "src/app/project-links";

@Component({
    selector: "app-account-tab",
    templateUrl: "./account-tab.component.html",
    styleUrls: ["./account-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountTabComponent extends BaseComponent {
    private modalService = inject(ModalService);
    private loggedUserService = inject(LoggedUserService);
    private router = inject(Router);

    public deleteAccount(): void {
        const message = "Do you want to delete a account";
        promiseWithCatch(
            this.modalService.error({
                title: "Delete",
                message: message,
                yesButtonText: "Ok",
                noButtonText: "Cancel",
                handler: (ok) => {
                    if (ok) {
                        console.log("delete account");
                    }
                },
            }),
        );
    }

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }

    public get isOwnerPage(): boolean {
        return this.router.url.includes(ProjectLinks.URL_SETTINGS);
    }
}
