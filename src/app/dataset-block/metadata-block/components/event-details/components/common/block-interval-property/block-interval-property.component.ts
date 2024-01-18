import { DatasetInfo } from "../../../../../../../interface/navigation.interface";
import { DatasetByIdQuery } from "../../../../../../../api/kamu.graphql.interface";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { DatasetService } from "src/app/dataset-view/dataset.service";

@Component({
    selector: "app-block-interval-property",
    templateUrl: "./block-interval-property.component.html",
    styleUrls: ["./block-interval-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockIntervalPropertyComponent extends BasePropertyComponent implements OnInit {
    @Input() public data: { prevBlockHash: string; newBlockHash: string; datasetId: string };
    public datasetInfo: DatasetInfo = { accountName: "", datasetName: "" };

    constructor(private datasetSevice: DatasetService) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.datasetSevice.requestDatasetInfoById(this.data.datasetId).subscribe((dataset: DatasetByIdQuery) => {
                if (dataset.datasets.byId) {
                    this.datasetInfo.accountName = dataset.datasets.byId.owner.accountName;
                    this.datasetInfo.datasetName = dataset.datasets.byId.name;
                }
            }),
        );
    }
}
