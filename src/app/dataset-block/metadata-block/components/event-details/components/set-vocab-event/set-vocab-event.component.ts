import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetVocab } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-set-vocab-event",
    templateUrl: "./set-vocab-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetVocabEventComponent extends BaseComponent {
    @Input({ required: true }) public event: SetVocab;
    public viewDataMapper: Record<string, { label: string; tooltip: string }> = {
        offsetColumn: { label: "Offset column:", tooltip: "Name of the offset column." },
        operationTypeColumn: { label: "Operation type column:", tooltip: "Name of the operation type column." },
        systemTimeColumn: { label: "System time column:", tooltip: "Name of the system time column." },
        eventTimeColumn: { label: "Event time column:", tooltip: "Name of the event time column." },
    };
}
