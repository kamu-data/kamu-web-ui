/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgFor, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { RouterOutlet } from "@angular/router";

import { BaseComponent } from "@common/components/base.component";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import {
    DatasetBasicsFragment,
    DatasetMetadata,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
} from "@api/kamu.graphql.interface";
import { AppConfigService } from "src/app/app-config.service";
import { MaybeNull } from "src/app/interface/app.types";
import { NavigationService } from "src/app/services/navigation.service";

import { FeatureFlagDirective } from "../../../common/directives/feature-flag.directive";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "../../dataset-view.interface";
import { isSettingsTabAccessibleHelper } from "./dataset-settings.helpers";
import {
    DATASET_SETTINGS_SIDE_PANEL_DATA,
    DatasetSettingsSidePanelItem,
    SettingsTabsEnum,
} from "./dataset-settings.model";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgFor,
        NgIf,
        RouterOutlet,
        //-----//
        MatIconModule,
        MatDividerModule,
        //-----//
        FeatureFlagDirective,
    ],
})
export class DatasetSettingsComponent extends BaseComponent {
    public readonly DATASET_SETTINGS_SIDE_PANEL_DATA: DatasetSettingsSidePanelItem[] = DATASET_SETTINGS_SIDE_PANEL_DATA;

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

    private readonly appConfigService = inject(AppConfigService);
    private readonly navigationService = inject(NavigationService);

    public navigateToSection(section: SettingsTabsEnum): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Settings,
            section,
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
