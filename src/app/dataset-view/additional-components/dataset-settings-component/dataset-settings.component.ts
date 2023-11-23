import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetBasicsFragment, DatasetPermissionsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { TabsEnum } from "./models/dataset-settings.model";
import { DatasetPermissionsService } from "../../dataset.permissions.service";

@Component({
    selector: "app-dataset-settings",
    templateUrl: "./dataset-settings.component.html",
    styleUrls: ["./dataset-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsComponent extends BaseComponent {
    @Input() public datasetBasics: DatasetBasicsFragment;
    @Input() public datasetPermissions: DatasetPermissionsFragment;
    public tabsEnum = TabsEnum;
    public tabActive = TabsEnum.GENERAL;

    constructor(private datasetPermissionsService: DatasetPermissionsService) {
        super();
    }

    public isSchedulingAvailable(): boolean {
        // ToDo: should be changed to a new permission "canSchedule"
        return this.datasetPermissionsService.shouldAllowSettingsTab(this.datasetPermissions);
    }
}
