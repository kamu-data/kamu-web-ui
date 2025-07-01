/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "../../../interface/app.types";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetMetadata,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetSettingsSidePanelItem, SettingsTabsEnum, datasetSettingsSidePanelData } from "./dataset-settings.model";
import { AppConfigService } from "src/app/app-config.service";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetOverviewTabData, DatasetViewTypeEnum } from "../../dataset-view.interface";
import { isSettingsTabAccessibleHelper } from "./dataset-settings.helpers";
import RoutingResolvers from "src/app/common/resolvers/routing-resolvers";
import { RouterOutlet } from "@angular/router";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { FeatureFlagDirective } from "../../../common/directives/feature-flag.directive";
import { NgFor, NgIf } from "@angular/common";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgFor, NgIf, FeatureFlagDirective, MatIconModule, MatDividerModule, RouterOutlet],
})
export class DatasetSettingsComponent extends BaseComponent {
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

    public sidePanelData: DatasetSettingsSidePanelItem[] = datasetSettingsSidePanelData;

    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);

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
