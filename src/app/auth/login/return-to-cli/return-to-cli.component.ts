/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";

import AppValues from "src/app/common/values/app.values";

import { LoggedUserService } from "./../../logged-user.service";

@Component({
    selector: "app-return-to-cli",
    templateUrl: "./return-to-cli.component.html",
    styleUrls: ["./return-to-cli.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class ReturnToCliComponent implements OnInit {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        this.loggedUserService.changeUser(null);
    }
}
