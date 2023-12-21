import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetVocab } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";

@Component({
    selector: "app-set-vocab-event",
    templateUrl: "./set-vocab-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetVocabEventComponent extends BaseComponent {
    @Input() public event: SetVocab;
}
