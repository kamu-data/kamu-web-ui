import {
    Component,
    ChangeDetectionStrategy,
    AfterViewChecked,
    Input,
    ViewChildren,
    ViewContainerRef,
    QueryList,
    ChangeDetectorRef,
    ComponentRef,
    Inject,
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
    implements AfterViewChecked
{
    @Input() public event: TEvent;
    @ViewChildren("container", { read: ViewContainerRef })
    container: QueryList<ViewContainerRef>;
    public isYamlView = false;
    public eventSections: EventSection[];
    protected readonly shouldShowYamlView: boolean;

    public constructor(
        private cdr: ChangeDetectorRef,
        @Inject("shouldShowYamlView") shouldShowYamlView: boolean,
    ) {
        this.shouldShowYamlView = shouldShowYamlView;
    }

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

    public onToggleView(value: boolean): void {
        this.isYamlView = value;
    }
}
