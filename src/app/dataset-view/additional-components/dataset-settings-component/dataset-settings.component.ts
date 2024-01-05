import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { SettingsTabsEnum } from "./dataset-settings.model";
import { AppConfigService } from "src/app/app-config.service";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsComponent extends BaseComponent {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    public readonly settingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
    public activeTab = SettingsTabsEnum.SCHEDULING;

    constructor(private appConfigService: AppConfigService) {
        super();
    }

    public get isSchedulingAvailable(): boolean {
        return this.appConfigService.featureFlags.enableScheduling && this.datasetPermissions.permissions.canSchedule;
    }
}
