/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { isNil } from "@common/helpers/app.helpers";
import {
    DatasetBasicsFragment,
    DatasetKind,
    DatasetMetadata,
    DatasetPermissionsFragment,
} from "@api/kamu.graphql.interface";
import { AppUIConfigFeatureFlags } from "src/app/app-config.model";

import { SettingsTabsEnum } from "./dataset-settings.model";

export function isSettingsTabAccessibleHelper(
    tab: SettingsTabsEnum,
    featureFlags: AppUIConfigFeatureFlags,
    datasetBasics: DatasetBasicsFragment,
    datasetPermissions: DatasetPermissionsFragment,
    datasetMetadata: DatasetMetadata,
): boolean {
    switch (tab) {
        case SettingsTabsEnum.GENERAL:
            return (
                datasetPermissions.permissions.general.canRename ||
                datasetPermissions.permissions.general.canDelete ||
                datasetPermissions.permissions.general.canSetVisibility
            );

        case SettingsTabsEnum.SCHEDULING:
        case SettingsTabsEnum.INGEST_CONFIGURATION:
            return (
                featureFlags.enableScheduling &&
                datasetBasics.kind === DatasetKind.Root &&
                !isNil(datasetMetadata.currentPollingSource) &&
                datasetPermissions.permissions.flows.canRun
            );

        case SettingsTabsEnum.COMPACTION:
            return datasetBasics.kind === DatasetKind.Root && datasetPermissions.permissions.flows.canRun;

        case SettingsTabsEnum.TRANSFORM_SETTINGS:
            return (
                datasetBasics.kind === DatasetKind.Derivative &&
                featureFlags.enableScheduling &&
                !isNil(datasetMetadata.currentTransform) &&
                datasetPermissions.permissions.flows.canRun
            );

        case SettingsTabsEnum.VARIABLES_AND_SECRETS:
            return (
                featureFlags.enableDatasetEnvVarsManagement &&
                datasetBasics.kind === DatasetKind.Root &&
                datasetPermissions.permissions.envVars.canView
            );

        case SettingsTabsEnum.ACCESS:
            return datasetPermissions.permissions.collaboration.canView;

        case SettingsTabsEnum.WEBHOOKS:
            return datasetPermissions.permissions.webhooks.canView;

        /* istanbul ignore next */
        default:
            return false;
    }
}
