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
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-dynamic-base-event",
    templateUrl: "./base-dynamic-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDynamicEventComponent<TEvent extends object> extends BaseComponent implements AfterViewChecked {
    @Input({ required: true }) public event: TEvent;
    @ViewChildren("container", { read: ViewContainerRef })
    container: QueryList<ViewContainerRef>;
    public eventSections: EventSection[];

    public constructor(protected cdr: ChangeDetectorRef) {
        super();
    }

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
