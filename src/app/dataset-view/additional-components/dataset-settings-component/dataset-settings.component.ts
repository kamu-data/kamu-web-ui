import { MaybeNull } from "./../../../common/app.types";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import {
    DatasetBasicsFragment,
    DatasetKind,
    DatasetOverviewFragment,
    DatasetPermissionsFragment,
} from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { DatasetSettingsSidePanelItem, SettingsTabsEnum, datasetSettingsSidePanelData } from "./dataset-settings.model";
import { AppConfigService } from "src/app/app-config.service";
import { ParamMap } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsComponent extends BaseComponent implements OnInit {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    public readonly settingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public activeTab: SettingsTabsEnum;
    public sidePanelData: DatasetSettingsSidePanelItem[] = datasetSettingsSidePanelData;
    public overview: DatasetOverviewFragment;

    constructor(
        private appConfigService: AppConfigService,
        private navigationService: NavigationService,
        private datasetSubsService: DatasetSubscriptionsService,
    ) {
        super();
    }

    public get isSchedulingAvailable(): boolean {
        return (
            this.appConfigService.featureFlags.enableScheduling &&
            !this.isSetTransformEmpty &&
            !this.isSetPollingSourceEmpty
        );
    }

    public get isSetPollingSourceEmpty(): boolean {
        return !this.overview.metadata.currentPollingSource && this.datasetBasics.kind === DatasetKind.Root;
    }

    public get isSetTransformEmpty(): boolean {
        return !this.overview.metadata.currentTransform && this.datasetBasics.kind === DatasetKind.Derivative;
    }

    ngOnInit(): void {
        this.activeTab = this.getSectionFromUrl() ?? SettingsTabsEnum.GENERAL;
        this.trackSubscription(
            this.datasetSubsService.overviewChanges.subscribe((overviewUpdate: OverviewUpdate) => {
                this.overview = overviewUpdate.overview;
            }),
        );
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
}
