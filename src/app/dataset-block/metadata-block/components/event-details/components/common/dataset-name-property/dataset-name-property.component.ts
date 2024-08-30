import { NavigationService } from "../../../../../../../services/navigation.service";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { BasePropertyComponent } from "../base-property/base-property.component";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-dataset-name-property",
    templateUrl: "./dataset-name-property.component.html",
    styleUrls: ["./dataset-name-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetNamePropertyComponent extends BasePropertyComponent {
    @Input({ required: true }) public data: { datasetName: string; ownerAccountName: string };

    private navigationService = inject(NavigationService);

    public navigateToDatasetView(): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.data.ownerAccountName,
            datasetName: this.data.datasetName,
            tab: DatasetViewTypeEnum.Overview,
            page: 1,
        });
    }
}
