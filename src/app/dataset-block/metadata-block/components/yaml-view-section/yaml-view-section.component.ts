import { ChangeDetectionStrategy, Component } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "../../block.service";
import { SupportedEvents } from "../event-details/supported.events";
import { Observable } from "rxjs";

@Component({
    selector: "app-yaml-view-section",
    templateUrl: "./yaml-view-section.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class YamlViewSectionComponent {
    public yamlEventText$: Observable<string>;

    constructor(private blockService: BlockService) {
        this.yamlEventText$ = this.blockService.metadataBlockAsYamlChanges;
    }

    public get currentBlock(): MetadataBlockFragment {
        return this.blockService.currentBlock;
    }

    public get isSetPollingSourceEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetPollingSource;
    }

    public get isSetTransformEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetTransform;
    }

    public get isSetAttachmentsEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetAttachments;
    }

    public get isSetLicenseEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetLicense;
    }

    public get isSetInfoEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetInfo;
    }

    public get isSetVocabEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetVocab;
    }

    public get isSetWatermarkEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetWatermark;
    }

    public get isSeedEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.Seed;
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
