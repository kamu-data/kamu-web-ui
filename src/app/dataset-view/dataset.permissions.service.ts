/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { DatasetPermissionsFragment } from "../api/kamu.graphql.interface";

@Injectable({ providedIn: "root" })
export class DatasetPermissionsService {
    public shouldAllowSettingsTab(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.canDelete || datasetPermissions.permissions.canRename;
    }

    public shouldAllowFlowsTab(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.canSchedule;
    }
}
