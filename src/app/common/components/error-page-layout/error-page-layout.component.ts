/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component } from "@angular/core";

import AppValues from "@common/values/app.values";

/**
 * Centered box with the application logo for a full-page error. The page projects its content
 * and marks its heading with the `title` class and its text with the `description` class.
 */
@Component({
    selector: "app-error-page-layout",
    templateUrl: "./error-page-layout.component.html",
    styleUrls: ["./error-page-layout.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageLayoutComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
}
