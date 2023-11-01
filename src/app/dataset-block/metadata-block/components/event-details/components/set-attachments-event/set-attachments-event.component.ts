import { SetAttachments } from "../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-set-attachments-event",
    templateUrl: "./set-attachments-event.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetAttachmentsEventComponent {
    @Input() public event: SetAttachments;
}
