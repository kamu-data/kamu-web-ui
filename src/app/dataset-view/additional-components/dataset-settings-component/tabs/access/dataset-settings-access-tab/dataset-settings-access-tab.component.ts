import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { SettingsTabsEnum } from "../../../dataset-settings.model";

@Component({
    selector: "app-dataset-settings-access-tab",
    templateUrl: "./dataset-settings-access-tab.component.html",
    styleUrls: ["./dataset-settings-access-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetSettingsAccessTabComponent {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;

    public readonly DatasetViewTypeEnum: typeof DatasetViewTypeEnum = DatasetViewTypeEnum;
    public readonly SettingsTabsEnum: typeof SettingsTabsEnum = SettingsTabsEnum;
}
