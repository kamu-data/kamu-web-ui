import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetByIdQuery } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { NavigationService } from "src/app/services/navigation.service";

@Component({
    selector: "app-dataset-id-and-name-property",
    templateUrl: "./dataset-id-and-name-property.component.html",
    styleUrls: ["./dataset-id-and-name-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetIdAndNamePropertyComponent
    extends BasePropertyComponent
    implements OnInit
{
    @Input() public data: string;
    public datasetInfo: DatasetInfo = { accountName: "", datasetName: "" };

    constructor(
        private datasetSevice: DatasetService,
        private navigationService: NavigationService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.datasetSevice
                .requestDatasetInfoById(this.data)
                .subscribe((dataset: DatasetByIdQuery) => {
                    if (dataset.datasets.byId) {
                        this.datasetInfo.accountName =
                            dataset.datasets.byId.owner.name;
                        this.datasetInfo.datasetName = dataset.datasets.byId
                            .name as string;
                        this.cdr.detectChanges();
                    }
                }),
        );
    }

    public navigateToDatasetView(): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetInfo.accountName,
            datasetName: this.datasetInfo.datasetName,
            tab: DatasetViewTypeEnum.Overview,
            page: 1,
        });
    }
}
