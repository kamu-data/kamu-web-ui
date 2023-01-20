import { SetTransform } from "./../../../../../../api/kamu.graphql.interface";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Input,
    QueryList,
    ViewChildren,
    ViewContainerRef,
} from "@angular/core";
import {
    EventRow,
    EventSection,
    FACTORIES_BY_EVENT_TYPE,
} from "../../builder.events";
import { BasePropertyComponent } from "../common/base-property/base-property.component";

@Component({
    selector: "app-set-transform-event",
    templateUrl: "./set-transform-event.component.html",
    styleUrls: ["./set-transform-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformEventComponent {
    @Input() public event: SetTransform;
    @ViewChildren("container", { read: ViewContainerRef })
    container: QueryList<ViewContainerRef>;
    public isYamlView = false;
    public eventSections: EventSection[];

    public constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.eventSections =
            FACTORIES_BY_EVENT_TYPE.SetTransform.buildEventSections(this.event);
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
