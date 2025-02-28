/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";
import AppValues from "src/app/common/values/app.values";

@Component({
    selector: "app-return-to-cli",
    templateUrl: "./return-to-cli.component.html",
    styleUrls: ["./return-to-cli.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToCliComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
}
