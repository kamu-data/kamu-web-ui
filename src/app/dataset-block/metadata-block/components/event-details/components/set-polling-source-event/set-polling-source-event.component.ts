import { EventRow, EventSection } from "../../builder.events";
import { SetPollingSource } from "./../../../../../../api/kamu.graphql.interface";
import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Input,
    OnInit,
    QueryList,
    ViewChildren,
    ViewContainerRef,
} from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { FACTORIES_BY_EVENT_TYPE } from "../../builder.events";
import { BasePropertyComponent } from "../common/base-property/base-property.component";

@Component({
    selector: "app-set-polling-source-event",
    templateUrl: "./set-polling-source-event.component.html",
    styleUrls: ["./set-polling-source-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPollingSourceEventComponent
    implements OnInit, AfterViewChecked
{
    @Input() public event: SetPollingSource;
    @Input() public datasetInfo: DatasetInfo;
    @ViewChildren("container", { read: ViewContainerRef })
    container: QueryList<ViewContainerRef>;
    public isYamlView = false;
    public eventSections: EventSection[];

    public constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewChecked(): void {
        if (!this.isYamlView) {
            let componentRef: ComponentRef<BasePropertyComponent>;
            const rows: EventRow[] = [];
            this.eventSections
                .map((item) => item.rows)
                .forEach((item: EventRow[]) => {
                    rows.push(...item);
                });
            this.container.map((vcr: ViewContainerRef, index: number) => {
                vcr.clear();
                componentRef = vcr.createComponent(
                    rows[index].descriptor.presentationComponent,
                );
                componentRef.setInput("data", rows[index].value);
                componentRef.instance.dataTestId =
                    rows[index].descriptor.dataTestId;
            });
            this.cdr.detectChanges();
        }
    }

    ngOnInit(): void {
        this.eventSections =
            FACTORIES_BY_EVENT_TYPE.SetPollingSource.buildEventSections(
                this.event,
            );
    }

    public onToggleView(value: boolean): void {
        this.isYamlView = value;
    }
}
