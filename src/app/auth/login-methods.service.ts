/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";

import { map, Observable, tap } from "rxjs";

import { AuthApi } from "@api/auth.api";
import { AccountProvider } from "@api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class LoginMethodsService {
    private authApi = inject(AuthApi);

    private enabledLoginMethods: AccountProvider[] = [];
    private loginMethodsLoadFailed = false;

    /** Loads the enabled methods; on failure, emits the error and leaves `loadFailed` set */
    public initialize(): Observable<void> {
        return this.authApi.readEnabledLoginMethods().pipe(
            tap({
                error: () => {
                    this.loginMethodsLoadFailed = true;
                },
            }),
            map((enabledLoginMethods: AccountProvider[]): void => {
                this.enabledLoginMethods = enabledLoginMethods;
                this.loginMethodsLoadFailed = false;
            }),
        );
    }

    public get loginMethods(): AccountProvider[] {
        return this.enabledLoginMethods;
    }

    /** `true` when the methods could not be loaded, so an empty `loginMethods` says nothing about what is enabled */
    public get loadFailed(): boolean {
        return this.loginMethodsLoadFailed;
    }
}
