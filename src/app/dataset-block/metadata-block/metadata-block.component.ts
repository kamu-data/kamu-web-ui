import { BaseProcessingComponent } from "./../../common/base.processing.component";
import { DatasetViewTypeEnum } from "./../../dataset-view/dataset-view.interface";
import {
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewEncapsulation,
} from "@angular/core";

import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-metadata-block",
    templateUrl: "./metadata-block.component.html",
    styleUrls: ["./metadata-block.component.sass"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MetadataBlockComponent
    extends BaseProcessingComponent
    implements OnInit
{
    public datasetInfo: DatasetInfo;
    public datasetViewType = DatasetViewTypeEnum.History;

    ngOnInit(): void {
        this.datasetInfo = this.getDatasetInfoFromUrl();
    }
}
