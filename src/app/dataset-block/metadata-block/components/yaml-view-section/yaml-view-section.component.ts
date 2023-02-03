import { BaseComponent } from "src/app/common/base.component";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
} from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "../../block.service";
import { SupportedEvents } from "../event-details/supported.events";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    styleUrls: ["./yaml-view-section.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlViewSectionComponent extends BaseComponent implements OnInit {
    public block: MetadataBlockFragment;
    constructor(
        private blockService: BlockService,
        private cdr: ChangeDetectorRef,
    ) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.blockService.onMetadataBlockChanges.subscribe((block) => {
                this.block = block;
                this.cdr.detectChanges();
            }),
        );
    }

    public get isSetPollingSourceEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetPollingSource;
    }

    public get isSetTransformEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetTransform;
    }

    public get isEventWithYamlView(): boolean {
        return this.isSetPollingSourceEvent || this.isSetTransformEvent;
    }
}
