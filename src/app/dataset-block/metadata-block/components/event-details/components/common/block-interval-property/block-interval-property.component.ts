import { DatasetInfo } from "./../../../../../../../interface/navigation.interface";
import {
    BlockInterval,
    DatasetBasicsFragment,
} from "./../../../../../../../api/kamu.graphql.interface";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { DatasetService } from "src/app/dataset-view/dataset.service";

@Component({
    selector: "app-block-interval-property",
    templateUrl: "./block-interval-property.component.html",
    styleUrls: ["./block-interval-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockIntervalPropertyComponent
    extends BasePropertyComponent
    implements OnInit
{
    @Input() public data: { block: BlockInterval; datasetId: string };
    public datasetInfo: DatasetInfo = { accountName: "", datasetName: "" };

    constructor(private datasetSevice: DatasetService) {
        super();
    }

    ngOnInit(): void {
        this.datasetSevice
            .requestDatasetInfoById(this.data.datasetId)
            .subscribe();
        this.datasetSevice.onDatasetInfoChanges.subscribe(
            (fragment: DatasetBasicsFragment) => {
                this.datasetInfo.accountName = fragment.owner.name;
                this.datasetInfo.datasetName = fragment.name as string;
            },
        );
    }
}
