/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { Observable, Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class SpinnerService {
    private _isLoading$ = new Subject<boolean>();

    public get isLoadingChanges(): Observable<boolean> {
        return this._isLoading$.asObservable();
    }

    public show(): void {
        this._isLoading$.next(true);
    }

    public hide(): void {
        this._isLoading$.next(false);
    }
}
