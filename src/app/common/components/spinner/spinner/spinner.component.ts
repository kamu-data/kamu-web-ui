/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SpinnerService } from "../spinner.service";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgIf, AsyncPipe } from "@angular/common";

@Component({
    selector: "app-spinner",
    templateUrl: "./spinner.component.html",
    styleUrls: ["./spinner.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgIf,
        MatProgressBarModule,
        AsyncPipe,
    ],
})
export class SpinnerComponent {
    private spinnerService = inject(SpinnerService);
    public isLoading$ = this.spinnerService.isLoadingChanges;
}
