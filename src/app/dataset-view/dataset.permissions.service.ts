import { Injectable } from "@angular/core";
import { DatasetPermissionsFragment } from "../api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class DatasetPermissionsService {
    public shouldAllowSettingsTab(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.canDelete || datasetPermissions.permissions.canRename;
    }
}
