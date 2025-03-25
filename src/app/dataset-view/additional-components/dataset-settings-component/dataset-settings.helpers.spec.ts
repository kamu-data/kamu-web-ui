/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "src/app/common/values/app.values";
import { isSettingsTabAccessibleHelper } from "./dataset-settings.helpers";
import { SettingsTabsEnum } from "./dataset-settings.model";
import {
    mockDatasetBasicsDerivedFragment,
    mockDatasetBasicsRootFragment,
    mockFullPowerDatasetPermissionsFragment,
} from "src/app/search/mock.data";
import { datasetMetadataDerivativeDataset, datasetMetadataRootDataset } from "../data-tabs.mock";

describe("DatasetSettingsHelpers", () => {
    it(`should check available ${SettingsTabsEnum.GENERAL} tab with canRename permission`, () => {
        const copyPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        copyPermissions.permissions.general.canDelete = false;
        copyPermissions.permissions.general.canSetVisibility = false;
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.GENERAL,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsRootFragment,
                copyPermissions,
                datasetMetadataDerivativeDataset,
            ),
        ).toEqual(true);
    });

    it(`should check available ${SettingsTabsEnum.GENERAL} tab with canDelete permission`, () => {
        const copyPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        copyPermissions.permissions.general.canRename = false;
        copyPermissions.permissions.general.canSetVisibility = false;
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.GENERAL,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsRootFragment,
                copyPermissions,
                datasetMetadataDerivativeDataset,
            ),
        ).toEqual(true);
    });

    it(`should check available ${SettingsTabsEnum.GENERAL} tab with canSetVisibility permission`, () => {
        const copyPermissions = structuredClone(mockFullPowerDatasetPermissionsFragment);
        copyPermissions.permissions.general.canRename = false;
        copyPermissions.permissions.general.canDelete = false;
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.GENERAL,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsRootFragment,
                copyPermissions,
                datasetMetadataDerivativeDataset,
            ),
        ).toEqual(true);
    });

    it(`should check available ${SettingsTabsEnum.SCHEDULING}  tab`, () => {
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.SCHEDULING,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsRootFragment,
                mockFullPowerDatasetPermissionsFragment,
                datasetMetadataRootDataset,
            ),
        ).toEqual(true);
    });

    it(`should check available ${SettingsTabsEnum.COMPACTION}  tab`, () => {
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.COMPACTION,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsRootFragment,
                mockFullPowerDatasetPermissionsFragment,
                datasetMetadataRootDataset,
            ),
        ).toEqual(true);
    });

    it(`should check available ${SettingsTabsEnum.TRANSFORM_SETTINGS}  tab`, () => {
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.TRANSFORM_SETTINGS,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsDerivedFragment,
                mockFullPowerDatasetPermissionsFragment,
                datasetMetadataDerivativeDataset,
            ),
        ).toEqual(true);
    });

    it(`should check available ${SettingsTabsEnum.VARIABLES_AND_SECRETS}  tab`, () => {
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.VARIABLES_AND_SECRETS,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsRootFragment,
                mockFullPowerDatasetPermissionsFragment,
                datasetMetadataRootDataset,
            ),
        ).toEqual(true);
    });

    it(`should check available ${SettingsTabsEnum.ACCESS}  tab`, () => {
        expect(
            isSettingsTabAccessibleHelper(
                SettingsTabsEnum.ACCESS,
                AppValues.DEFAULT_UI_FEATURE_FLAGS,
                mockDatasetBasicsRootFragment,
                mockFullPowerDatasetPermissionsFragment,
                datasetMetadataRootDataset,
            ),
        ).toEqual(true);
    });
});
