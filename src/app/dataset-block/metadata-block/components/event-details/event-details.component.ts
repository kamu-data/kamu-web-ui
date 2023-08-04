import {
    AddDataEventFragment,
    SetPollingSource,
    Seed,
    SetTransform,
    ExecuteQuery,
    SetLicense,
    SetAttachments,
    SetInfo,
    SetVocab,
    SetWatermark,
} from "./../../../../api/kamu.graphql.interface";
import { SupportedEvents } from "./supported.events";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
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

    constructor(private blockService: BlockService, private cdr: ChangeDetectorRef) {
        super();
    }

    public get isSupportedEvent(): boolean {
        return Object.keys(SupportedEvents).includes(this.block.event.__typename);
    }

    public get isAddDataEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.AddData;
    }

    public get isSetPollingSourceEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetPollingSource;
    }

    public get isSetTransformEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetTransform;
    }

    public get setTransformEvent(): SetTransform {
        return this.block.event as SetTransform;
    }

    public get setPollingSourceEvent(): SetPollingSource {
        return this.block.event as SetPollingSource;
    }

    public get addDataEvent(): AddDataEventFragment {
        return this.block.event as AddDataEventFragment;
    }

    public get isSeedEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.Seed;
    }

    public get seedEvent(): Seed {
        return this.block.event as Seed;
    }

    public get isExecuteQueryEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.ExecuteQuery;
    }

    public get executeQueryEvent(): ExecuteQuery {
        return this.block.event as ExecuteQuery;
    }

    public get isSetLicenseEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetLicense;
    }

    public get setLicenseEvent(): SetLicense {
        return this.block.event as SetLicense;
    }

    public get isSetAttachmentsEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetAttachments;
    }

    public get setAttachmentsEvent(): SetAttachments {
        return this.block.event as SetAttachments;
    }

    public get isSetInfoEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetInfo;
    }

    public get setInfoEvent(): SetInfo {
        return this.block.event as SetInfo;
    }

    public get isSetVocabEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetVocab;
    }

    public get setVocabEvent(): SetVocab {
        return this.block.event as SetVocab;
    }

    public get isSetWatermarkEvent(): boolean {
        return this.block.event.__typename === SupportedEvents.SetWatermark;
    }

    public get setWatermarkEvent(): SetWatermark {
        return this.block.event as SetWatermark;
    }

    ngOnInit(): void {
        this.trackSubscription(
            this.blockService.onMetadataBlockChanges.subscribe((block: MetadataBlockFragment) => {
                this.block = block;
                this.cdr.detectChanges();
            }),
        );
    }
}
