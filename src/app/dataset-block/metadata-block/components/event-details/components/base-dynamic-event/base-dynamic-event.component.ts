import {
    Component,
    ChangeDetectionStrategy,
    Input,
    ViewChildren,
    ViewContainerRef,
    QueryList,
    ChangeDetectorRef,
    ComponentRef,
    AfterViewChecked,
} from "@angular/core";
import { EventRow, EventSection } from "../../dynamic-events/dynamic-events.model";
import { BasePropertyComponent } from "../common/base-property/base-property.component";

@Component({
    selector: "app-dynamic-base-event",
    templateUrl: "./base-dynamic-event.component.html",
    styleUrls: ["./base-dynamic-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDynamicEventComponent<TEvent extends object> implements AfterViewChecked {
    @Input() public event: TEvent;
    @ViewChildren("container", { read: ViewContainerRef })
    container: QueryList<ViewContainerRef>;
    public eventSections: EventSection[];

    public constructor(protected cdr: ChangeDetectorRef) {}

    ngAfterViewChecked(): void {
        let componentRef: ComponentRef<BasePropertyComponent>;
        const rows: EventRow[] = [];
        this.eventSections
            .map((item) => item.rows)
            .forEach((item: EventRow[]) => {
                rows.push(...item);
            });
        this.container.forEach((vcr: ViewContainerRef, index: number) => {
            vcr.clear();
            componentRef = vcr.createComponent<BasePropertyComponent>(rows[index].descriptor.presentationComponent);
            componentRef.setInput("data", rows[index].value);
            componentRef.instance.dataTestId = rows[index].descriptor.dataTestId;
            componentRef.changeDetectorRef.detectChanges();
        });
    }
}
