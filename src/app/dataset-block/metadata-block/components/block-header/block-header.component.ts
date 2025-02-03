import { BaseComponent } from "src/app/common/components/base.component";
import { MetadataBlockFragment } from "../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { BlockService } from "../../block.service";

@Component({
    selector: "app-block-header",
    templateUrl: "./block-header.component.html",
    styleUrls: ["./block-header.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockHeaderComponent extends BaseComponent implements OnInit {
    public block$: Observable<MetadataBlockFragment>;
    @Input({ required: true }) public blockHash: string;
    @Input({ required: true }) public datasetInfo: DatasetInfo;

    private blockService = inject(BlockService);

    public ngOnInit(): void {
        this.block$ = this.blockService.metadataBlockChanges;
    }
}
