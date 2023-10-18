import { Injectable } from "@angular/core";
import AppValues from "../common/app.values";

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
}
