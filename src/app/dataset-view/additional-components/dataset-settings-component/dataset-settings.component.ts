import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { SettingsTabsEnum } from "./dataset-settings.model";
import { DatasetPermissionsService } from "../../dataset.permissions.service";

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
    public activeTab = SettingsTabsEnum.SCHEDULING;

    constructor(private datasetPermissionsService: DatasetPermissionsService) {
        super();
    }

    public ngOnInit(): void {
        //
    }

    public isSchedulingAvailable(): boolean {
        // ToDo: should be changed to a new permission "canSchedule"
        return this.datasetPermissionsService.shouldAllowSettingsTab(this.datasetPermissions);
    }
}
