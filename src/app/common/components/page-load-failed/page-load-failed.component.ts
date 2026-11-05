/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject } from "@angular/core";

import { ErrorPageLayoutComponent } from "@common/components/error-page-layout/error-page-layout.component";

import { NavigationService } from "src/app/services/navigation.service";

import { PageLoadFailedTexts } from "./page-load-failed.text";

/** Shown in place of the first page the app opens when that page could not be loaded */
@Component({
    selector: "app-page-load-failed",
    templateUrl: "./page-load-failed.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        ErrorPageLayoutComponent,
    ],
})
export class PageLoadFailedComponent {
    public readonly TEXTS = PageLoadFailedTexts;

    private navigationService = inject(NavigationService);

    // The address bar still holds the requested URL, so a reload requests that page again
    public tryAgain(): void {
        this.navigationService.reloadPage();
    }
}
