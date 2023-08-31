import { BaseComponent } from "src/app/common/base.component";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "../../block.service";
import { SupportedEvents } from "../event-details/supported.events";
import { Observable } from "rxjs";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    styleUrls: ["./yaml-view-section.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlViewSectionComponent extends BaseComponent implements OnInit {
    public block: MetadataBlockFragment;
    public yamlEventText$: Observable<string> = this.blockService.onMetadataBlockAsYamlChanges;
    constructor(private blockService: BlockService) {
        super();
    }

    ngOnInit(): void {
        this.trackSubscriptions(
            this.blockService.onMetadataBlockChanges.subscribe((block) => {
                this.block = block;
            }),
        );
    }

    public get isSetPollingSourceEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetPollingSource;
    }

    public get isSetTransformEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetTransform;
    }

    public get isSetAttachmentsEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetAttachments;
    }

    public get isSetLicenseEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetLicense;
    }

    public get isSetInfoEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetInfo;
    }

    public get isSetVocabEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetVocab;
    }

    public get isSetWatermarkEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetWatermark;
    }

    public get isSeedEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.Seed;
    }

    public get isEventWithYamlView(): boolean {
        return (
            this.isSetPollingSourceEvent ||
            this.isSetTransformEvent ||
            this.isSetAttachmentsEvent ||
            this.isSetLicenseEvent ||
            this.isSetInfoEvent ||
            this.isSetVocabEvent ||
            this.isSetWatermarkEvent ||
            this.isSeedEvent
        );
    }
}
