/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import { parseJsonAs } from "@common/helpers/untyped-boundary.helpers";
import AppValues from "@common/values/app.values";
import { MaybeNull } from "@interface/app.types";

import { GithubLoginState } from "src/app/auth/login/login.component.model";

@Injectable({
    providedIn: "root",
})
export class SessionStorageService {
    public get isSidePanelVisible(): boolean {
        const value = sessionStorage.getItem(AppValues.SESSION_STORAGE_SIDE_PANEL_VISIBLE);
        return value ? parseJsonAs<boolean>(value) : false;
    }

    public setSidePanelVisible(value: boolean): void {
        sessionStorage.setItem(AppValues.SESSION_STORAGE_SIDE_PANEL_VISIBLE, JSON.stringify(value));
    }

    public setGithubLoginState(value: GithubLoginState): void {
        sessionStorage.setItem(AppValues.SESSION_STORAGE_GITHUB_LOGIN_STATE, JSON.stringify(value));
    }

    /** Returns the pending GitHub sign-in and removes it, so a callback can use it only once */
    public takeGithubLoginState(): MaybeNull<GithubLoginState> {
        const value = sessionStorage.getItem(AppValues.SESSION_STORAGE_GITHUB_LOGIN_STATE);
        sessionStorage.removeItem(AppValues.SESSION_STORAGE_GITHUB_LOGIN_STATE);
        return value ? parseJsonAs<GithubLoginState>(value) : null;
    }

    public reset() {
        sessionStorage.clear();
    }
}
