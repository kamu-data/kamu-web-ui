import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { SetInfo } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-set-info-event",
    templateUrl: "./set-info-event.component.html",
    styleUrls: ["./set-info-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetInfoEventComponent {
    @Input() event: SetInfo;
}
