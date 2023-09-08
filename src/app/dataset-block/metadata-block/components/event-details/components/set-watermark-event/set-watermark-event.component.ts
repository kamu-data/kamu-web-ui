import { SetWatermark } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-set-watermark-event",
    templateUrl: "./set-watermark-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetWatermarkEventComponent {
    @Input() public event: SetWatermark;
}
