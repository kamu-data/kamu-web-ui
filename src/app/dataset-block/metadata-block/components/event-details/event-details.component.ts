import { AddDataEventFragment } from "./../../../../api/kamu.graphql.interface";
import { SupportedEvents } from "./supported.events";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { BlockService } from "../../block.service";

import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-event-details",
    templateUrl: "./event-details.component.html",
    styleUrls: ["./event-details.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent extends BaseComponent implements OnInit {
    public block: MetadataBlockFragment;
    @Input() public datasetInfo: DatasetInfo;

    constructor(
        private blockService: BlockService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    public get isSupportedEvent(): boolean {
        return Object.keys(SupportedEvents).includes(
            this.block.event.__typename,
        );
    }

    public get isAddDataEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.AddData;
    }

    public get addDataEvent(): AddDataEventFragment {
        return this.block.event as AddDataEventFragment;
    }

    ngOnInit(): void {
        this.blockService.onMetadataBlockChanges.subscribe((block) => {
            this.block = block;
            this.cdr.detectChanges();
        });
    }
}
