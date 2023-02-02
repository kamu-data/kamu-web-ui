import {
    Component,
    ChangeDetectionStrategy,
    Input,
    ViewChildren,
    ViewContainerRef,
    QueryList,
    ChangeDetectorRef,
    ComponentRef,
    AfterViewInit,
} from "@angular/core";
import {
    EventRow,
    EventSection,
} from "../../dynamic-events/dynamic-events.model";

import { BasePropertyComponent } from "../common/base-property/base-property.component";

@Component({
    selector: "app-dynamic-base-event",
    templateUrl: "./base-dynamic-event.component.html",
    styleUrls: ["./base-dynamic-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDynamicEventComponent<TEvent extends object>
    implements AfterViewInit
{
    @Input() public event: TEvent;
    @ViewChildren("container", { read: ViewContainerRef })
    container: QueryList<ViewContainerRef>;
    public eventSections: EventSection[];

    public constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewInit(): void {
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
