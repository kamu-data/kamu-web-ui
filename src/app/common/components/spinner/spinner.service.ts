/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";

import { MaybeUndefined } from "@interface/app.types";

@Injectable({
    providedIn: "root",
})
export class SpinnerService {
    private _isLoading$ = new Subject<boolean>();
    private pendingRequests = 0;
    private showTimer: MaybeUndefined<ReturnType<typeof setTimeout>>;

    public get isLoadingChanges(): Observable<boolean> {
        return this._isLoading$.asObservable();
    }

    public show(): void {
        this._isLoading$.next(true);
    }

    public hide(): void {
        this._isLoading$.next(false);
    }

    /**
     * Shows the spinner once requests have been pending for `delayMs`, and keeps it until the
     * last of them ends with `requestEnded()`.
     */
    public requestStarted(delayMs: number): void {
        this.pendingRequests++;
        if (this.pendingRequests === 1) {
            this.showTimer = setTimeout(() => this.show(), delayMs);
        }
    }

    public requestEnded(): void {
        this.pendingRequests = Math.max(0, this.pendingRequests - 1);
        if (this.pendingRequests === 0) {
            clearTimeout(this.showTimer);
            this.hide();
        }
    }
}
