import { combineLatest, map, Observable } from "rxjs";
import { inject, Injectable } from "@angular/core";
import { LoggedUserService } from "../auth/logged-user.service";
import { DatasetSubscriptionsService } from "../dataset-view/dataset.subscriptions.service";

@Injectable({
    providedIn: "root",
})
export class ElementsViewService {
    private loggedUserService = inject(LoggedUserService);
    private datasetSubsService = inject(DatasetSubscriptionsService);

    public viewModeElement(): Observable<ViewModeElement> {
        return combineLatest([
            this.loggedUserService.adminPrivelegesChanges,
            this.datasetSubsService.permissionsChanges,
        ]).pipe(
            map(([adminPriveleges, datasetPermissions]) => {
                if (adminPriveleges) {
                    return ViewModeElement.ADMIN_MODE;
                }

                const permissions = datasetPermissions.permissions;
                if (
                    permissions.canCommit ||
                    permissions.canDelete ||
                    permissions.canRename ||
                    permissions.canSchedule
                ) {
                    return ViewModeElement.PERMISSIONS_MODE;
                }

                return ViewModeElement.NOT_AVAILABLE_MODE;
            }),
        );
    }
}

export enum ViewModeElement {
    NOT_AVAILABLE_MODE = "notAvailableMode",
    PERMISSIONS_MODE = "permissionsMode",
    ADMIN_MODE = "adminMode",
}
