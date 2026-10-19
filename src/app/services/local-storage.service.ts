/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import AppValues from "@common/values/app.values";
import { MaybeNull } from "@interface/app.types";

@Injectable({ providedIn: "root" })
export class LocalStorageService {
    public get accessToken(): MaybeNull<string> {
        return localStorage.getItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
    }

    public get loginDeviceCode(): MaybeNull<string> {
        return localStorage.getItem(AppValues.LOCAL_STORAGE_LOGIN_DEVICE_CODE);
    }

    public setAccessToken(token: MaybeNull<string>) {
        if (token) {
            localStorage.setItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN, token);
        } else {
            localStorage.removeItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
        }
    }

    public setDeviceCode(code: MaybeNull<string>) {
        if (code) {
            localStorage.setItem(AppValues.LOCAL_STORAGE_LOGIN_DEVICE_CODE, code);
        } else {
            localStorage.removeItem(AppValues.LOCAL_STORAGE_LOGIN_DEVICE_CODE);
        }
    }

    public reset() {
        localStorage.clear();
    }
}
