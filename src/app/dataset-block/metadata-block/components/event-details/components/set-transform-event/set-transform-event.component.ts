import { SetTransform } from "./../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-set-transform-event",
    templateUrl: "./set-transform-event.component.html",
    styleUrls: ["./set-transform-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformEventComponent {
    @Input() public event: SetTransform;
}
