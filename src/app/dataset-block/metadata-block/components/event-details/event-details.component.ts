import { MaybeNull } from "./../../../../common/app.types";
import { SetVocabEventComponent } from "./components/set-vocab-event/set-vocab-event.component";
import { SupportedEvents } from "./supported.events";
import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    Input,
    Type,
    ViewChild,
    ViewContainerRef,
} from "@angular/core";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { BlockService } from "../../block.service";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { Observable } from "rxjs";
import { SetPollingSourceEventComponent } from "./components/set-polling-source-event/set-polling-source-event.component";
import { BaseComponent } from "src/app/common/base.component";
import { AddPushSourceEventComponent } from "./components/add-push-source-event/add-push-source-event.component";
import { UnsupportedEventComponent } from "./components/unsupported-event/unsupported-event.component";
import { SetDataSchemaEventComponent } from "./components/set-data-schema-event/set-data-schema-event.component";
import { SetWatermarkEventComponent } from "./components/set-watermark-event/set-watermark-event.component";
import { SetInfoEventComponent } from "./components/set-info-event/set-info-event.component";
import { SetAttachmentsEventComponent } from "./components/set-attachments-event/set-attachments-event.component";
import { ExecuteQueryEventComponent } from "./components/execute-query-event/execute-query-event.component";
import { SetTransformEventComponent } from "./components/set-transform-event/set-transform-event.component";
import { SeedEventComponent } from "./components/seed-event/seed-event.component";
import { AddDataEventComponent } from "./components/add-data-event/add-data-event.component";
import { SetLicenseEventComponent } from "./components/set-license-event/set-license-event.component";

@Component({
    selector: "app-event-details",
    templateUrl: "./event-details.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent implements AfterViewChecked {
    public block$: Observable<MetadataBlockFragment> = this.blockService.metadataBlockChanges;
    @Input() public datasetInfo: DatasetInfo;

    @ViewChild("dynamicContainer", { read: ViewContainerRef })
    public dynamicContainer: MaybeNull<ViewContainerRef>;

    constructor(private blockService: BlockService) {}

    ngAfterViewChecked(): void {
        if (this.dynamicContainer) {
            this.dynamicContainer.clear();
            const componentRef = this.dynamicContainer.createComponent<BaseComponent>(
                this.componentEventTypeFactory(this.currentBlock.event.__typename as SupportedEvents),
            );
            componentRef.setInput("event", this.currentBlock.event);
            componentRef.changeDetectorRef.detectChanges();
        }
    }

    private componentEventTypeFactory(type: SupportedEvents): Type<BaseComponent> {
        let component: Type<BaseComponent>;
        switch (type) {
            case SupportedEvents.SetPollingSource: {
                component = SetPollingSourceEventComponent;
                break;
            }
            case SupportedEvents.SetDataSchema: {
                component = SetDataSchemaEventComponent;
                break;
            }
            case SupportedEvents.AddPushSource: {
                component = AddPushSourceEventComponent;
                break;
            }
            case SupportedEvents.SetWatermark: {
                component = SetWatermarkEventComponent;
                break;
            }
            case SupportedEvents.SetVocab: {
                component = SetVocabEventComponent;
                break;
            }
            case SupportedEvents.SetInfo: {
                component = SetInfoEventComponent;
                break;
            }
            case SupportedEvents.SetAttachments: {
                component = SetAttachmentsEventComponent;
                break;
            }
            case SupportedEvents.ExecuteQuery: {
                component = ExecuteQueryEventComponent;
                break;
            }
            case SupportedEvents.SetTransform: {
                component = SetTransformEventComponent;
                break;
            }
            case SupportedEvents.Seed: {
                component = SeedEventComponent;
                break;
            }
            case SupportedEvents.AddData: {
                component = AddDataEventComponent;
                break;
            }
            case SupportedEvents.SetLicense: {
                component = SetLicenseEventComponent;
                break;
            }
            default:
                component = UnsupportedEventComponent;
        }
        return component;
    }

    public get currentBlock(): MetadataBlockFragment {
        return this.blockService.currentBlock;
    }
}
