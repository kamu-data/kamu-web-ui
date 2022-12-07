import { DataHelpers } from "./../../../../common/data.helpers";
import { DatasetService } from "./../../../../dataset-view/dataset.service";
import { BaseComponent } from "src/app/common/base.component";
import { MetadataBlockFragment } from "./../../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { Observable } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-block-header",
    templateUrl: "./block-header.component.html",
    styleUrls: ["./block-header.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockHeaderComponent extends BaseComponent implements OnInit {
    public block$: Observable<MetadataBlockFragment>;
    @Input() public blockHash: string;
    @Input() public datasetInfo: DatasetInfo;
    constructor(
        private datasetService: DatasetService,
        private navigationService: NavigationService,
    ) {
        super();
    }
    ngOnInit(): void {
        this.block$ = this.datasetService.onMetadataBlockChanges;
    }

    public relativeTime(time: string): string {
        return DataHelpers.relativeTime(time);
    }

    public navigateToMetadataBlock(
        accountName: string,
        datasetName: string,
        blockHash: string,
    ): void {
        this.navigationService.navigateToMetadataBlock({
            accountName,
            datasetName,
            blockHash,
        });
    }
}
