import { NavigationService } from "./../../../../../../../services/navigation.service";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-dataset-name-property",
    templateUrl: "./dataset-name-property.component.html",
    styleUrls: ["./dataset-name-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetNamePropertyComponent extends BasePropertyComponent {
    @Input() public data: { datasetName: string; owner: string };

    public constructor(private navigationService: NavigationService) {
        super();
    }

    public navigateToDatasetView(): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.data.owner,
            datasetName: this.data.datasetName,
            tab: DatasetViewTypeEnum.Overview,
            page: 1,
        });
    }
}
