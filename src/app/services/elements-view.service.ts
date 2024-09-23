import { LocalStorageService } from "src/app/services/local-storage.service";
import { inject, Injectable } from "@angular/core";
import { DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { LoggedUserService } from "../auth/logged-user.service";
import { DatasetPermissionsService } from "../dataset-view/dataset.permissions.service";

@Injectable({
    providedIn: "root",
})
export class ElementsViewService {
    private loggedUserService = inject(LoggedUserService);
    private datasetPermissionsService = inject(DatasetPermissionsService);
    private localStorageService = inject(LocalStorageService);

    private get isAdminPrivelegesOn(): boolean {
        return this.loggedUserService.isAdmin && (this.localStorageService.adminPriveleges ?? false);
    }

    public executeAction(action: EnumViewActions, datasetPermissions: DatasetPermissionsFragment | null): boolean {
        if (action === EnumViewActions.SHOW_FLOWS_TAB_ACTION && datasetPermissions) {
            return this.isAdminPrivelegesOn || this.datasetPermissionsService.shouldAllowFlowsTab(datasetPermissions);
        }
        if (action === EnumViewActions.SHOW_SETTINGS_TAB_ACTION && datasetPermissions) {
            return (
                this.isAdminPrivelegesOn || this.datasetPermissionsService.shouldAllowSettingsTab(datasetPermissions)
            );
        }
        return false;
    }
}

export enum EnumViewActions {
    SHOW_FLOWS_TAB_ACTION = "showFlowsTabAction",
    SHOW_SETTINGS_TAB_ACTION = "showSettingsTabAction",
}
