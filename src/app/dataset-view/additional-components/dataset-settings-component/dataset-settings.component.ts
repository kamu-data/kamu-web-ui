/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "../../../interface/app.types";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetKind,
    DatasetMetadata,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetSettingsSidePanelItem, SettingsTabsEnum, datasetSettingsSidePanelData } from "./dataset-settings.model";
import { AppConfigService } from "src/app/app-config.service";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "../../dataset-view.interface";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";
import { isSettingsTabAccessibleHelper } from "./dataset-settings.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsComponent extends BaseComponent implements OnInit {
    @Input(RoutingResolvers.DATASET_VIEW_SETTINGS_KEY) public datasetSettingsTabData: DatasetOverviewTabData;
    @Input(RoutingResolvers.DATASET_VIEW_SETTINGS_ACTIVE_SECTION_KEY) public activeTab: SettingsTabsEnum;

    public get datasetBasics(): DatasetBasicsFragment {
        return this.datasetSettingsTabData.datasetBasics;
    }

    public get datasetPermissions(): DatasetPermissionsFragment {
        return this.datasetSettingsTabData.datasetPermissions;
    }

    public get overview(): MaybeNull<DatasetOverviewFragment> {
        return this.datasetSettingsTabData.overviewUpdate.overview;
    }

    public readonly settingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly DatasetKind: typeof DatasetKind = DatasetKind;
    public sidePanelData: DatasetSettingsSidePanelItem[] = datasetSettingsSidePanelData;

    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);
    private modalService = inject(ModalService);

    public get showSchedulingTab(): boolean {
        return this.activeTab === SettingsTabsEnum.SCHEDULING && this.isSettingsTabAccessible;
    }

    public get showGeneralTab(): boolean {
        return this.activeTab === SettingsTabsEnum.GENERAL && this.isSettingsTabAccessible;
    }

    public get showAccessTab(): boolean {
        return this.activeTab === SettingsTabsEnum.ACCESS && this.isSettingsTabAccessible;
    }

    public get showCompactionTab(): boolean {
        return this.activeTab === SettingsTabsEnum.COMPACTION && this.isSettingsTabAccessible;
    }

    public get showTransformSettingsTab(): boolean {
        return this.activeTab === SettingsTabsEnum.TRANSFORM_SETTINGS && this.isSettingsTabAccessible;
    }

    public get showSecretsManagerTab(): boolean {
        return this.activeTab === SettingsTabsEnum.VARIABLES_AND_SECRETS && this.isSettingsTabAccessible;
    }

    public get isSettingsTabAccessible(): boolean {
        return isSettingsTabAccessibleHelper(
            this.activeTab,
            this.appConfigService.featureFlags,
            this.datasetBasics,
            this.datasetPermissions,
            this.overview?.metadata as DatasetMetadata,
        );
    }

    public ngOnInit(): void {}

    private initializationActiveTab(): void {
        if (this.datasetPermissions.permissions.general.canSetVisibility) {
            // this.activeTab = this.getSectionFromUrl() ?? SettingsTabsEnum.GENERAL;
        } else {
            if (this.appConfigService.featureFlags.enableDatasetEnvVarsManagement) {
                this.activeTab = SettingsTabsEnum.VARIABLES_AND_SECRETS;
            } else {
                promiseWithCatch(
                    this.modalService.warning({
                        message: "You don't have access to the variables and secrets manager",
                        yesButtonText: "Ok",
                    }),
                );
                this.navigationService.navigateToDatasetView({
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                    tab: DatasetViewTypeEnum.Overview,
                });
            }
        }
    }

    public navigateToSection(section: SettingsTabsEnum): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Settings,
            section: section === SettingsTabsEnum.GENERAL ? undefined : section,
        });
    }

    public visibilitySettingsMenuItem(item: DatasetSettingsSidePanelItem): boolean {
        return isSettingsTabAccessibleHelper(
            item.activeTab,
            this.appConfigService.featureFlags,
            this.datasetBasics,
            this.datasetPermissions,
            this.overview?.metadata as DatasetMetadata,
        );
    }
}
