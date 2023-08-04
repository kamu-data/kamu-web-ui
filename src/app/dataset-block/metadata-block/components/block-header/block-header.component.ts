import { BaseComponent } from "src/app/common/base.component";
import { MetadataBlockFragment } from "./../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { BlockService } from "../../block.service";

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

    constructor(private blockService: BlockService) {
        super();
    }

    ngOnInit(): void {
        this.block$ = this.blockService.onMetadataBlockChanges;
    }
}
