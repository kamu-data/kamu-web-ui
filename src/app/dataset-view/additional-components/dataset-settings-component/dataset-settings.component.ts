import { MaybeNull } from "../../../interface/app.types";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetKind,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/components/base.component";
import { DatasetSettingsSidePanelItem, SettingsTabsEnum, datasetSettingsSidePanelData } from "./dataset-settings.model";
import { AppConfigService } from "src/app/app-config.service";
import { ParamMap } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

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
        return this.isSchedulingAvailable && this.activeTab === SettingsTabsEnum.SCHEDULING;
    }

    public get showCompactionTab(): boolean {
        return this.datasetBasics.kind === DatasetKind.Root && this.activeTab === SettingsTabsEnum.COMPACTION;
    }

    public get showTransformSettingsTab(): boolean {
        return (
            this.datasetBasics.kind === DatasetKind.Derivative && this.activeTab === SettingsTabsEnum.TRANSFORM_SETTINGS
        );
    }

    public get showSecretsManagerTab(): boolean {
        return (
            this.appConfigService.featureFlags.enableDatasetEnvVarsManagement &&
            this.activeTab === SettingsTabsEnum.VARIABLES_AND_SECRETS
        );
    }

    public ngOnInit(): void {
        this.activeTab = this.getSectionFromUrl() ?? SettingsTabsEnum.GENERAL;

        this.datasetSubsService.overviewChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((overviewUpdate: OverviewUpdate) => {
                this.overview = overviewUpdate.overview;
            });
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
            case SettingsTabsEnum.SCHEDULING:
                return this.isSchedulingAvailable;
            case SettingsTabsEnum.COMPACTION:
                return this.datasetBasics.kind === DatasetKind.Root;
            case SettingsTabsEnum.TRANSFORM_SETTINGS:
                return (
                    this.datasetBasics.kind === DatasetKind.Derivative &&
                    this.appConfigService.featureFlags.enableScheduling
                );
            case SettingsTabsEnum.VARIABLES_AND_SECRETS:
                return (
                    this.appConfigService.featureFlags.enableDatasetEnvVarsManagement &&
                    this.datasetBasics.kind === DatasetKind.Root
                );
            default:
                return Boolean(item.visible);
        }
    }
}
