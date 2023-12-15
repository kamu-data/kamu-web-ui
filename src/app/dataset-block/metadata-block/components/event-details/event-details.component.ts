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
    AddPushSource,
    SetDataSchema,
} from "../../../../api/kamu.graphql.interface";
import { SupportedEvents } from "./supported.events";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "../../block.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Observable } from "rxjs";

@Component({
    selector: "app-event-details",
    templateUrl: "./event-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent {
    public block$: Observable<MetadataBlockFragment> = this.blockService.metadataBlockChanges;
    @Input() public datasetInfo: DatasetInfo;

    constructor(private blockService: BlockService) {}

    public get currentBlock(): MetadataBlockFragment {
        return this.blockService.currentBlock;
    }

    public get isSupportedEvent(): boolean {
        return Object.keys(SupportedEvents).includes(this.currentBlock.event.__typename);
    }

    public get isAddDataEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.AddData;
    }

    public get isSetPollingSourceEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetPollingSource;
    }

    public get isSetTransformEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetTransform;
    }

    public get setTransformEvent(): SetTransform {
        return this.currentBlock.event as SetTransform;
    }

    public get setPollingSourceEvent(): SetPollingSource {
        return this.currentBlock.event as SetPollingSource;
    }

    public get addDataEvent(): AddDataEventFragment {
        return this.currentBlock.event as AddDataEventFragment;
    }

    public get isSeedEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.Seed;
    }

    public get seedEvent(): Seed {
        return this.currentBlock.event as Seed;
    }

    public get isExecuteQueryEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.ExecuteQuery;
    }

    public get executeQueryEvent(): ExecuteQuery {
        return this.currentBlock.event as ExecuteQuery;
    }

    public get isSetLicenseEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetLicense;
    }

    public get setLicenseEvent(): SetLicense {
        return this.currentBlock.event as SetLicense;
    }

    public get isSetAttachmentsEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetAttachments;
    }

    public get setAttachmentsEvent(): SetAttachments {
        return this.currentBlock.event as SetAttachments;
    }

    public get isSetInfoEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetInfo;
    }

    public get setInfoEvent(): SetInfo {
        return this.currentBlock.event as SetInfo;
    }

    public get isSetVocabEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetVocab;
    }

    public get setVocabEvent(): SetVocab {
        return this.currentBlock.event as SetVocab;
    }

    public get isSetWatermarkEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetWatermark;
    }

    public get setWatermarkEvent(): SetWatermark {
        return this.currentBlock.event as SetWatermark;
    }

    public get isAddPushSourceEvent(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.AddPushSource;
    }

    public get addPushSourceEvent(): AddPushSource {
        return this.currentBlock.event as AddPushSource;
    }

    public get isSetDataSchema(): boolean {
        return this.currentBlock.event.__typename === SupportedEvents.SetDataSchema;
    }

    public get setDataSchemaEvent(): SetDataSchema {
        return this.currentBlock.event as SetDataSchema;
    }
}
