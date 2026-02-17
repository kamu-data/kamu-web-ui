/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";

import { SpinnerService } from "@common/components/spinner/spinner.service";

@Component({
    selector: "app-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        AsyncPipe,
        NgIf,
        //-----//
        MatProgressBarModule,
    ],
})
export class SpinnerComponent {
    private spinnerService = inject(SpinnerService);
    public isLoading$ = this.spinnerService.isLoadingChanges;
}
