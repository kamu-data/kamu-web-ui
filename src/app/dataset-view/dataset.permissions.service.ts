/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable } from "@angular/core";
import { DatasetPermissionsFragment } from "../api/kamu.graphql.interface";
import { AppConfigService } from "../app-config.service";

@Injectable({ providedIn: "root" })
export class DatasetPermissionsService {
    private appConfigService = inject(AppConfigService);

    public shouldAllowSettingsTab(datasetPermissions: DatasetPermissionsFragment): boolean {
        return (
            this.isMaintainer(datasetPermissions) ||
            (this.appConfigService.featureFlags.enableDatasetEnvVarsManagement &&
                datasetPermissions.permissions.envVars.canView)
        );
    }

    public shouldAllowFlowsTab(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.flows.canView;
    }

    public shouldRunFlows(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.flows.canRun;
    }

    public shouldAllowEnvironmentVariables(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.envVars.canView;
    }

    public isReader(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.envVars.canView && datasetPermissions.permissions.flows.canView;
    }

    public isEditor(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.metadata.canCommit;
    }

    public isMaintainer(datasetPermissions: DatasetPermissionsFragment): boolean {
        const permissions = datasetPermissions.permissions;
        return (
            permissions.collaboration.canUpdate &&
            permissions.envVars.canUpdate &&
            permissions.flows.canRun &&
            permissions.general.canRename &&
            permissions.general.canSetVisibility
        );
    }

    public isOwner(datasetPermissions: DatasetPermissionsFragment): boolean {
        return datasetPermissions.permissions.general.canDelete;
    }
}
