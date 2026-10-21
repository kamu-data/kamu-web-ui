/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

import AppValues from "@common/values/app.values";

/**
 * Centered box with the application logo for a full-page error: an optional `title`, then the
 * page's projected text, then the elements it marks `errorPageActions`, such as buttons.
 */
@Component({
    selector: "app-error-page-layout",
    templateUrl: "./error-page-layout.component.html",
    styleUrls: ["./error-page-layout.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorPageLayoutComponent {
    @Input() public title?: string;

    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
}
