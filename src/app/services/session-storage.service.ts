import { Injectable } from "@angular/core";
import AppValues from "../common/app.values";

@Injectable({
    providedIn: "root",
})
export class SessionStorageService {
    public get sidePanelVisibility(): string | null {
        return sessionStorage.getItem(AppValues.SESSION_STORAGE_SIDE_PANEL_VISIBLE);
    }

    public setSidePanelVisibility(value: string): void {
        sessionStorage.setItem(AppValues.SESSION_STORAGE_SIDE_PANEL_VISIBLE, value);
    }
}
