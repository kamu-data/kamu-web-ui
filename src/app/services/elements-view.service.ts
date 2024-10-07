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

    public viewModeElement(): Observable<ElementVisibilityMode> {
        return combineLatest([
            this.loggedUserService.adminPrivilegesChanges,
            this.datasetSubsService.permissionsChanges,
        ]).pipe(
            map(([adminPrivileges, datasetPermissions]) => {
                if (adminPrivileges) {
                    return ElementVisibilityMode.AVAILABLE_VIA_ADMIN_PRIVILEGES;
                }

                const permissions = datasetPermissions.permissions;
                if (permissions.canView) {
                    return ElementVisibilityMode.AVAILABLE_VIA_PERMISSIONS;
                }

                return ElementVisibilityMode.UNAVAILABLE;
            }),
        );
    }
}

export enum ElementVisibilityMode {
    UNAVAILABLE,
    AVAILABLE_VIA_PERMISSIONS,
    AVAILABLE_VIA_ADMIN_PRIVILEGES,
}
