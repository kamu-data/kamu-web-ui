/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";

import AppValues from "@common/values/app.values";

@Injectable({
    providedIn: "root",
})
export class SessionStorageService {
    public get isSidePanelVisible(): boolean {
        const value = sessionStorage.getItem(AppValues.SESSION_STORAGE_SIDE_PANEL_VISIBLE);
        return value ? (JSON.parse(value) as boolean) : false;
    }

    public setSidePanelVisible(value: boolean): void {
        sessionStorage.setItem(AppValues.SESSION_STORAGE_SIDE_PANEL_VISIBLE, JSON.stringify(value));
    }

    public get datasetSqlCode(): string {
        return sessionStorage.getItem(AppValues.SESSION_STORAGE_SQL_CODE) ?? "";
    }

    public setDatasetSqlCode(sqlCode: string): void {
        sessionStorage.setItem(AppValues.SESSION_STORAGE_SQL_CODE, sqlCode);
    }

    public removeDatasetSqlCode(): void {
        sessionStorage.removeItem(AppValues.SESSION_STORAGE_SQL_CODE);
    }

    public reset() {
        sessionStorage.clear();
    }
}
