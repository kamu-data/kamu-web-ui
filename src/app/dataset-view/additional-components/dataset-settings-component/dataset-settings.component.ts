/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "../../../interface/app.types";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetKind,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetSettingsSidePanelItem, SettingsTabsEnum, datasetSettingsSidePanelData } from "./dataset-settings.model";
import { AppConfigService } from "src/app/app-config.service";
import { NavigationEnd, ParamMap, Router } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { filter } from "rxjs";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { promiseWithCatch } from "src/app/common/helpers/app.helpers";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    @Input({ required: true }) public datasetPermissions: DatasetPermissionsFragment;

    public readonly settingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public readonly DatasetKind: typeof DatasetKind = DatasetKind;
    public activeTab: SettingsTabsEnum;
    public sidePanelData: DatasetSettingsSidePanelItem[] = datasetSettingsSidePanelData;
    public overview: MaybeNull<DatasetOverviewFragment>;

    private appConfigService = inject(AppConfigService);
    private navigationService = inject(NavigationService);
    private datasetSubsService = inject(DatasetSubscriptionsService);
    private router = inject(Router);
    private cdr = inject(ChangeDetectorRef);
    private modalService = inject(ModalService);

    public get isSchedulingAvailable(): boolean {
        return (
            this.appConfigService.featureFlags.enableScheduling &&
            !this.isSetTransformEmpty &&
            !this.isSetPollingSourceEmpty &&
            this.isRootDataset
        );
    }

    public get isRootDataset(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root;
    }

    public get isSetPollingSourceEmpty(): boolean {
        return !this.overview?.metadata.currentPollingSource && this.datasetBasics.kind === DatasetKind.Root;
    }

    public get isSetTransformEmpty(): boolean {
        return !this.overview?.metadata.currentTransform && this.datasetBasics.kind === DatasetKind.Derivative;
    }

    public get showSchedulingTab(): boolean {
        return (
            this.isSchedulingAvailable &&
            this.activeTab === SettingsTabsEnum.SCHEDULING &&
            this.datasetPermissions.permissions.flows.canRun
        );
    }

    public get showGeneralTab(): boolean {
        return this.activeTab === SettingsTabsEnum.GENERAL && this.datasetPermissions.permissions.general.canRename;
    }

    public get showAccessTab(): boolean {
        return this.activeTab === SettingsTabsEnum.ACCESS && this.datasetPermissions.permissions.collaboration.canView;
    }

    public get showCompactionTab(): boolean {
        return (
            this.datasetBasics.kind === DatasetKind.Root &&
            this.activeTab === SettingsTabsEnum.COMPACTION &&
            this.datasetPermissions.permissions.flows.canRun
        );
    }

    public get showTransformSettingsTab(): boolean {
        return (
            this.datasetBasics.kind === DatasetKind.Derivative &&
            this.activeTab === SettingsTabsEnum.TRANSFORM_SETTINGS &&
            this.datasetPermissions.permissions.flows.canRun
        );
    }

    public get showSecretsManagerTab(): boolean {
        return (
            this.appConfigService.featureFlags.enableDatasetEnvVarsManagement &&
            this.activeTab === SettingsTabsEnum.VARIABLES_AND_SECRETS
        );
    }

    public ngOnInit(): void {
        this.initializationActiveTab();

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                this.activeTab = this.getSectionFromUrl() ?? SettingsTabsEnum.GENERAL;
                this.cdr.detectChanges();
            });

        this.datasetSubsService.overviewChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((overviewUpdate: OverviewUpdate) => {
                this.overview = overviewUpdate.overview;
            });
    }

    private initializationActiveTab(): void {
        if (this.datasetPermissions.permissions.general.canSetVisibility) {
            this.activeTab = this.getSectionFromUrl() ?? SettingsTabsEnum.GENERAL;
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

    public getSectionFromUrl(): MaybeNull<SettingsTabsEnum> {
        const paramMap: ParamMap = this.activatedRoute.snapshot.queryParamMap;
        return paramMap.get(ProjectLinks.URL_QUERY_PARAM_SECTION) as SettingsTabsEnum;
    }

    public navigateToSection(section: SettingsTabsEnum): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.getDatasetInfoFromUrl().accountName,
            datasetName: this.getDatasetInfoFromUrl().datasetName,
            tab: DatasetViewTypeEnum.Settings,
            section: section === SettingsTabsEnum.GENERAL ? undefined : section,
        });
        this.activeTab = section;
    }

    public visibilitySettingsMenuItem(item: DatasetSettingsSidePanelItem): boolean {
        switch (item.activeTab) {
            case SettingsTabsEnum.GENERAL:
                return this.datasetPermissions.permissions.general.canRename;

            case SettingsTabsEnum.SCHEDULING:
                return this.isSchedulingAvailable && this.datasetPermissions.permissions.flows.canRun;
            case SettingsTabsEnum.COMPACTION:
                return this.datasetBasics.kind === DatasetKind.Root && this.datasetPermissions.permissions.flows.canRun;
            case SettingsTabsEnum.TRANSFORM_SETTINGS:
                return (
                    this.datasetBasics.kind === DatasetKind.Derivative &&
                    this.appConfigService.featureFlags.enableScheduling &&
                    this.datasetPermissions.permissions.flows.canRun
                );
            case SettingsTabsEnum.VARIABLES_AND_SECRETS:
                return (
                    this.appConfigService.featureFlags.enableDatasetEnvVarsManagement &&
                    this.datasetBasics.kind === DatasetKind.Root &&
                    this.datasetPermissions.permissions.envVars.canView
                );
            case SettingsTabsEnum.ACCESS:
                return this.datasetPermissions.permissions.collaboration.canView;
            default:
                return Boolean(item.visible);
        }
    }
}
