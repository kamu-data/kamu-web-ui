/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import AppValues from "../common/values/app.values";

@Injectable({ providedIn: "root" })
export class LocalStorageService {
    public get accessToken(): string | null {
        return localStorage.getItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
    }

    public get loginCallbackUrl(): string | null {
        return localStorage.getItem(AppValues.LOCAL_STORAGE_LOGIN_CALLBACK_URL);
    }

    public setAccessToken(token: string | null) {
        if (token) {
            localStorage.setItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN, token);
        } else {
            localStorage.removeItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
        }
    }

    public setLoginCallbackUrl(loginCallbackUrl: string | null) {
        if (loginCallbackUrl) {
            localStorage.setItem(AppValues.LOCAL_STORAGE_LOGIN_CALLBACK_URL, loginCallbackUrl);
        } else {
            localStorage.removeItem(AppValues.LOCAL_STORAGE_LOGIN_CALLBACK_URL);
        }
    }

    public reset() {
        localStorage.clear();
    }
}
