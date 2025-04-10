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
export class CancelRequestService {
    private cancel$ = new Subject<void>();

    public cancelRequest(): void {
        this.cancel$.next();
        this.cancel$.complete();
    }

    public get cancelRequstObservable(): Observable<void> {
        return this.cancel$.asObservable();
    }
}
