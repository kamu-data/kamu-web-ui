import { SupportedEvents } from "./supported.events";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { BlockService } from "../../block.service";

@Component({
    selector: "app-event-details",
    templateUrl: "./event-details.component.html",
    styleUrls: ["./event-details.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent extends BaseComponent implements OnInit {
    public block: MetadataBlockFragment;

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

    ngOnInit(): void {
        this.blockService.onMetadataBlockChanges.subscribe((block) => {
            this.block = block;
            this.cdr.detectChanges();
        });
    }
}
