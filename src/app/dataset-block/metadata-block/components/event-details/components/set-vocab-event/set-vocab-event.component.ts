import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetVocab } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-set-vocab-event",
    templateUrl: "./set-vocab-event.component.html",
    styleUrls: ["./set-vocab-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetVocabEventComponent {
    @Input() public event: SetVocab;
}
