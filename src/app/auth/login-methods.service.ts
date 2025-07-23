/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { AccountProvider } from "../api/kamu.graphql.interface";
import { map, Observable } from "rxjs";
import { AuthApi } from "../api/auth.api";

@Injectable({
    providedIn: "root",
})
export class LoginMethodsService {
    private authApi = inject(AuthApi);

    private enabledLoginMethods: AccountProvider[] = [];

    public initialize(): Observable<void> {
        return this.authApi.readEnabledLoginMethods().pipe(
            map((enabledLoginMethods: AccountProvider[]): void => {
                this.enabledLoginMethods = enabledLoginMethods;
            }),
        );
    }

    public get loginMethods(): AccountProvider[] {
        return this.enabledLoginMethods;
    }
}
